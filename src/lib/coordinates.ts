export type Coordinate = [longitude: number, latitude: number];

// WGS84 → GCJ-02 地图偏移公式；与 gcoord 1.0.7 的公开转换结果交叉检查。
export function wgs84ToGcj02([lng, lat]: Coordinate): Coordinate {
  if (lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271) return [lng, lat];
  const x = lng - 105;
  const y = lat - 35;
  const wave = (v: number) => Math.sin(v * Math.PI);
  const common = (20 * wave(6 * x) + 20 * wave(2 * x)) * 2 / 3;
  let dy = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x)) + common;
  dy += (20 * wave(y) + 40 * wave(y / 3)) * 2 / 3;
  dy += (160 * wave(y / 12) + 320 * wave(y / 30)) * 2 / 3;
  let dx = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x)) + common;
  dx += (20 * wave(x) + 40 * wave(x / 3)) * 2 / 3;
  dx += (150 * wave(x / 12) + 300 * wave(x / 30)) * 2 / 3;
  const rad = lat * Math.PI / 180;
  const magic = 1 - 0.006693421622965943 * Math.sin(rad) ** 2;
  const root = Math.sqrt(magic);
  return [lng + dx * 180 / (6378245 / root * Math.cos(rad) * Math.PI), lat + dy * 180 / (6378245 * (1 - 0.006693421622965943) / (magic * root) * Math.PI)];
}

export function distanceKm(a: Coordinate, b: Coordinate) {
  const rad = Math.PI / 180;
  const h = Math.sin((b[1] - a[1]) * rad / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin((b[0] - a[0]) * rad / 2) ** 2;
  return 6371.0088 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}
