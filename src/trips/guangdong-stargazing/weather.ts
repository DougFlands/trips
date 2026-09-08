import type { Coordinate } from "../../lib/coordinates";

export const weatherFields = {
  cloud_cover: { label: "总云量", unit: "%", min: 0, max: 100 },
  precipitation_probability: { label: "降水概率", unit: "%", min: 0, max: 100 },
  temperature_2m: { label: "气温", unit: "°C", min: -90, max: 65 },
  relative_humidity_2m: { label: "湿度", unit: "%", min: 0, max: 100 },
  cloud_cover_low: { label: "低云", unit: "%", min: 0, max: 100 },
  cloud_cover_mid: { label: "中云", unit: "%", min: 0, max: 100 },
  cloud_cover_high: { label: "高云", unit: "%", min: 0, max: 100 },
  wind_speed_10m: { label: "风速", unit: "km/h", min: 0, max: 500 },
  visibility: { label: "能见度", unit: "m", min: 0, max: 10000000 },
} as const;
export type WeatherField = keyof typeof weatherFields;
export const fieldNames = Object.keys(weatherFields) as WeatherField[];
export type WeatherHour = { time: number } & Record<WeatherField, number | null>;
const storedUnits = Object.fromEntries(fieldNames.map(field => [field, weatherFields[field].unit]));
export type WeatherPoint = { id: string; wgs84: Coordinate };
export type WeatherRecord = {
  version: 1;
  provider: "open-meteo-v1";
  placeId: string;
  wgs84: Coordinate;
  fetchedAt: number;
  units: Record<string, string>;
  hours: WeatherHour[];
};
export type WeatherResult = { point: WeatherPoint; record?: WeatherRecord; error?: string };

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
function validValue(value: unknown, field: WeatherField): value is number | null {
  return value === null || (finite(value) && value >= weatherFields[field].min && value <= weatherFields[field].max);
}
function validTimes(times: unknown[]): times is number[] {
  return times.length >= 1 && times.length <= 240 && times.every((time, index) =>
    finite(time) && Number.isInteger(time) && time > 0 && (index === 0 || time === Number(times[index - 1]) + 3600));
}

// Single- and multi-location responses share one decoder. Grid coordinates never replace the requested POI.
export function decodeForecast(raw: unknown, points: WeatherPoint[], fetchedAt = Date.now()): WeatherResult[] {
  const rows = Array.isArray(raw) ? raw : [raw];
  if (rows.length !== points.length) return points.map(point => ({ point, error: "天气返回的地点数量不匹配" }));
  const rowsById = new Map<number, Record<string, unknown>>();
  for (const [index, row] of rows.entries()) {
    if (!object(row)) continue;
    // Open-Meteo omits location_id for its first location (0).
    const id = row.location_id === undefined && index === 0 ? 0 : row.location_id;
    if (!finite(id) || !Number.isInteger(id) || id < 0 || id >= points.length || rowsById.has(id)) {
      return points.map(point => ({ point, error: "天气地点编号无效" }));
    }
    rowsById.set(id, row);
  }
  return points.map((point, index) => {
    const bad = { point, error: "天气数据不完整，请稍后重试" };
    const row = rowsById.get(index);
    if (!row || row.utc_offset_seconds !== 28800 || !finite(row.latitude) || !finite(row.longitude)
      || Math.abs(row.latitude - point.wgs84[1]) > 1 || Math.abs(row.longitude - point.wgs84[0]) > 1) return bad;
    const hourly = row.hourly;
    const units = row.hourly_units;
    if (!object(hourly) || !object(units) || units.time !== "unixtime" || !Array.isArray(hourly.time) || !validTimes(hourly.time)) return bad;
    const times = hourly.time;
    const columns = new Map<WeatherField, (number | null)[]>();
    for (const field of fieldNames) {
      const values = hourly[field];
      if (units[field] !== weatherFields[field].unit || !Array.isArray(values) || values.length !== times.length || !values.every(value => validValue(value, field))) return bad;
      columns.set(field, values);
    }
    const hours = times.map((time, i) => {
      const hour = { time } as WeatherHour;
      for (const field of fieldNames) hour[field] = columns.get(field)![i];
      return hour;
    });
    return { point, record: { version: 1, provider: "open-meteo-v1", placeId: point.id, wgs84: [...point.wgs84], fetchedAt, units: { ...storedUnits, time: "unixtime" }, hours } };
  });
}

export async function fetchWeather(points: WeatherPoint[], signal: AbortSignal): Promise<WeatherResult[]> {
  if (!points.length) return [];
  const params = new URLSearchParams({
    latitude: points.map(point => point.wgs84[1]).join(","),
    longitude: points.map(point => point.wgs84[0]).join(","),
    hourly: fieldNames.join(","), forecast_days: "8", timezone: "Asia/Shanghai", timeformat: "unixtime",
  });
  const timeout = AbortSignal.timeout(25000);
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: AbortSignal.any([signal, timeout]) });
  if (!response.ok) throw new Error(response.status === 429 ? "天气请求过多，请稍后重试" : "天气服务暂时不可用");
  const raw: unknown = await response.json();
  return decodeForecast(raw, points);
}

export function validCache(raw: unknown, point: WeatherPoint): raw is WeatherRecord {
  if (!object(raw) || raw.version !== 1 || raw.provider !== "open-meteo-v1" || raw.placeId !== point.id
    || !finite(raw.fetchedAt) || raw.fetchedAt <= 0 || raw.fetchedAt > Date.now() + 60000
    || !Array.isArray(raw.wgs84) || raw.wgs84.length !== 2 || !raw.wgs84.every((n, i) => n === point.wgs84[i])
    || !object(raw.units) || raw.units.time !== "unixtime" || !fieldNames.every(field => object(raw.units) && raw.units[field] === weatherFields[field].unit)
    || !Array.isArray(raw.hours)) return false;
  const times: unknown[] = [];
  for (const hour of raw.hours) {
    if (!object(hour) || !fieldNames.every(field => validValue(hour[field], field))) return false;
    times.push(hour.time);
  }
  return validTimes(times);
}

export const WEATHER_DB = "travel-guides-stargazing";
function openCache(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(new Error("此浏览器无法保存天气")); return; }
    const request = indexedDB.open(WEATHER_DB, 1);
    let settled = false;
    const fail = () => { settled = true; clearTimeout(timer); reject(new Error("天气缓存暂时不可用")); };
    const timer = setTimeout(fail, 8000);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("weather")) request.result.createObjectStore("weather", { keyPath: "placeId" });
    };
    request.onerror = fail;
    request.onblocked = fail;
    request.onsuccess = () => {
      clearTimeout(timer);
      const db = request.result;
      if (settled) { db.close(); return; }
      settled = true;
      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}

export async function readWeatherCache(points: WeatherPoint[]): Promise<Record<string, WeatherRecord>> {
  const db = await openCache();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("weather", "readonly");
      const request = tx.objectStore("weather").getAll();
      let rows: unknown[] = [];
      request.onsuccess = () => { rows = request.result; };
      tx.oncomplete = () => {
        const cache: Record<string, WeatherRecord> = {};
        for (const row of rows) {
          const point = points.find(point => object(row) && row.placeId === point.id);
          if (point && validCache(row, point)) cache[point.id] = row;
        }
        resolve(cache);
      };
      tx.onerror = tx.onabort = () => reject(new Error("读取天气缓存失败"));
    });
  } finally { db.close(); }
}

export async function saveWeatherCache(records: WeatherRecord[]) {
  const db = await openCache();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("weather", "readwrite");
      for (const record of records) tx.objectStore("weather").put(record);
      // Request success can still be followed by transaction abort (e.g. quota).
      tx.oncomplete = () => resolve();
      tx.onerror = tx.onabort = () => reject(new Error("天气已获取，但未保存到此浏览器"));
    });
  } finally { db.close(); }
}

const DAY = 86400000;
export function nightDates(now = Date.now()) {
  return Array.from({ length: 7 }, (_, i) => new Date(now + 8 * 3600000 + i * DAY).toISOString().slice(0, 10));
}
export function nightHours(record: WeatherRecord | undefined, date: string) {
  const start = Date.parse(`${date}T18:00:00+08:00`) / 1000;
  return record?.hours.filter(hour => hour.time >= start && hour.time < start + 12 * 3600) ?? [];
}
export function weatherSummary(hours: WeatherHour[]) {
  const clouds = hours.flatMap(hour => hour.cloud_cover === null ? [] : [hour.cloud_cover]);
  const rain = hours.flatMap(hour => hour.precipitation_probability === null ? [] : [hour.precipitation_probability]);
  return { cloud: clouds.length ? Math.round(clouds.reduce((a, b) => a + b, 0) / clouds.length) : null, rain: rain.length ? Math.max(...rain) : null };
}
export function formatTime(timestamp: number, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit", hour12: false, ...options }).format(timestamp);
}
