import { useEffect, useRef, useState } from "react";
import type { TripDay, TripPlace, TripStop } from "./trips/types";
import type { MapPlace, TravelMapProps } from "./map/types";
export type { DayFilter, MapPlace, TravelMapProps } from "./map/types";

type TLngLat = { lng: number; lat: number };
type TOverlay = {
  addEventListener?: (event: string, handler: () => void) => void;
};
type TInfoWindow = object;
type TMap = {
  centerAndZoom: (center: TLngLat, zoom: number) => void;
  addOverLay: (overlay: TOverlay) => void;
  removeOverLay: (overlay: TOverlay) => void;
  setViewport?: (points: TLngLat[], options?: { enableAnimation?: boolean; zoom?: number }) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  openInfoWindow?: (infoWindow: TInfoWindow, point: TLngLat) => void;
  closeInfoWindow?: () => void;
  destroy?: () => void;
};
type TNamespace = {
  Map: new (container: string, options?: Record<string, unknown>) => TMap;
  LngLat: new (lng: number, lat: number) => TLngLat;
  Marker: new (point: TLngLat, options?: Record<string, unknown>) => TOverlay;
  Polyline: new (points: TLngLat[], options?: Record<string, unknown>) => TOverlay;
  InfoWindow: new (content: string, options?: Record<string, unknown>) => TInfoWindow;
};

declare global {
  interface Window {
    T?: TNamespace;
  }
}

let loaderPromise: Promise<TNamespace> | undefined;
let containerSequence = 0;

function loadTianditu(key: string) {
  if (window.T) return Promise.resolve(window.T);
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<TNamespace>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-tianditu-loader="true"]',
    );
    const script = existing ?? document.createElement("script");
    const finish = () => window.T ? resolve(window.T) : reject(new Error("天地图 SDK 未初始化"));
    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", () => reject(new Error("天地图 SDK 加载失败")), { once: true });

    if (!existing) {
      script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${encodeURIComponent(key)}`;
      script.async = true;
      script.dataset.tiandituLoader = "true";
      document.head.appendChild(script);
    }
  });

  return loaderPromise;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function popupHtml(place: MapPlace, meta: string) {
  const link = place.url ?? "https://map.tianditu.gov.cn/";
  return `<strong>${escapeHtml(place.name)}</strong><p>${escapeHtml(meta)}</p><p>${escapeHtml(place.note)}</p><a href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${escapeHtml(place.linkLabel ?? "查看地点 ↗")}</a>`;
}

const emptyStops: TripStop[] = [];
const emptyPlaces: TripPlace[] = [];
const emptyDays: TripDay[] = [];

export function TiandituMap({
  stops = emptyStops,
  alternatives = emptyPlaces,
  days = emptyDays,
  activeDay = "all",
  places,
  focusPlaceId = null,
  label,
  fitMaxZoom = 8,
  focusZoom = 14,
  onSelectPlace,
  theme = "default",
}: TravelMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<TMap | null>(null);
  const apiRef = useRef<TNamespace | null>(null);
  const overlayRef = useRef<TOverlay[]>([]);
  const infoWindowByPlaceId = useRef(new Map<string, TInfoWindow>());
  const initialCenter = useRef(places?.[0]?.coord ?? stops[0]?.coord ?? [116.397, 39.909]);
  const onSelectRef = useRef(onSelectPlace);
  const [status, setStatus] = useState<"missing" | "loading" | "ready" | "error">("loading");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const key = import.meta.env.VITE_TIANDITU_KEY?.trim() ?? "";
  const containerId = useRef(`tianditu-map-${++containerSequence}`);
  const accessibleStops = activeDay === "all" ? stops : stops.filter(stop => stop.day === activeDay);
  const accessibleCity = activeDay === "all" ? undefined : days[activeDay]?.city;
  const accessibleAlternatives = activeDay === "all" ? alternatives : alternatives.filter(place => place.city === accessibleCity);
  const accessiblePlaces: MapPlace[] = places ?? [...accessibleStops, ...accessibleAlternatives];

  useEffect(() => { onSelectRef.current = onSelectPlace; }, [onSelectPlace]);

  useEffect(() => {
    if (!key) {
      setStatus("missing");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    loadTianditu(key).then(api => {
      if (cancelled || !containerRef.current) return;
      const map = new api.Map(containerId.current, { projection: "EPSG:4326" });
      const center = new api.LngLat(initialCenter.current[0], initialCenter.current[1]);
      map.centerAndZoom(center, 8);
      mapRef.current = map;
      apiRef.current = api;
      setStatus("ready");
    }).catch(() => {
      if (!cancelled) setStatus("error");
    });

    return () => {
      cancelled = true;
      overlayRef.current.forEach(overlay => mapRef.current?.removeOverLay(overlay));
      overlayRef.current = [];
      mapRef.current?.closeInfoWindow?.();
      mapRef.current?.destroy?.();
      mapRef.current = null;
      apiRef.current = null;
    };
  }, [key]);

  useEffect(() => {
    const map = mapRef.current;
    const api = apiRef.current;
    if (!map || !api || status !== "ready") return;

    const shownStops = activeDay === "all" ? stops : stops.filter(stop => stop.day === activeDay);
    const activeCity = activeDay === "all" ? undefined : days[activeDay]?.city;
    const shownAlternatives = activeDay === "all" ? alternatives : alternatives.filter(place => place.city === activeCity);
    const shownPlaces: MapPlace[] = places ?? [...shownStops, ...shownAlternatives];
    const overlays: TOverlay[] = [];
    const infoWindows = new Map<string, TInfoWindow>();

    for (const dayIndex of new Set(shownStops.map(stop => stop.day))) {
      const route = shownStops.filter(stop => stop.day === dayIndex).sort((a, b) => a.order - b.order);
      if (route.length < 2) continue;
      const line = new api.Polyline(route.map(stop => new api.LngLat(stop.coord[0], stop.coord[1])), {
        color: days[dayIndex]?.color ?? "#008f9c",
        weight: 5,
        opacity: 0.9,
        showDir: true,
      });
      map.addOverLay(line);
      overlays.push(line);
    }

    const addMarker = (place: MapPlace, markerText: string, color: string, meta: string) => {
      const point = new api.LngLat(place.coord[0], place.coord[1]);
      const marker = new api.Marker(point, { title: `${markerText} ${place.name}`, color });
      const infoWindow = new api.InfoWindow(popupHtml(place, meta), { closeButton: true, enableMessage: false });
      marker.addEventListener?.("click", () => {
        if (onSelectRef.current && place.id !== focusPlaceId) {
          onSelectRef.current(place.id);
          return;
        }
        map.closeInfoWindow?.();
        map.openInfoWindow?.(infoWindow, point);
        onSelectRef.current?.(place.id);
      });
      map.addOverLay(marker);
      overlays.push(marker);
      infoWindows.set(place.id, infoWindow);
    };

    shownStops.forEach(stop => addMarker(stop, String(stop.order), days[stop.day]?.color ?? "#008f9c", `${stop.city} // ${stop.time} // 推荐 ${stop.score.toFixed(1)}`));
    shownAlternatives.forEach(place => addMarker(place, place.markerLabel ?? place.score.toFixed(1), place.markerColor ?? "#008f9c", `${place.category ?? "备选"} // ${place.city} // 推荐 ${place.score.toFixed(1)}`));
    places?.forEach(place => addMarker(place, place.markerLabel ?? "•", place.markerColor ?? "#36594a", place.meta ?? ""));

    overlayRef.current = overlays;
    infoWindowByPlaceId.current = infoWindows;
    const focusedPlace = focusPlaceId ? shownPlaces.find(place => place.id === focusPlaceId) : undefined;
    if (focusedPlace) {
      const point = new api.LngLat(focusedPlace.coord[0], focusedPlace.coord[1]);
      map.centerAndZoom(point, focusZoom);
      const infoWindow = infoWindows.get(focusedPlace.id);
      if (infoWindow) map.openInfoWindow?.(infoWindow, point);
    } else if (shownPlaces.length === 1) {
      const point = new api.LngLat(shownPlaces[0].coord[0], shownPlaces[0].coord[1]);
      map.centerAndZoom(point, 13);
    } else if (map.setViewport && shownPlaces.length) {
      map.setViewport(shownPlaces.map(place => new api.LngLat(place.coord[0], place.coord[1])), { enableAnimation: false, zoom: fitMaxZoom });
    }

    return () => {
      map.closeInfoWindow?.();
      overlays.forEach(overlay => map.removeOverLay(overlay));
      if (overlayRef.current === overlays) overlayRef.current = [];
    };
  }, [activeDay, alternatives, apiRef, days, fitMaxZoom, focusPlaceId, focusZoom, places, status, stops]);

  function locateUser() {
    const map = mapRef.current;
    const api = apiRef.current;
    if (!map || !api || !navigator.geolocation) {
      setLocationError("当前浏览器不支持定位");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const point = new api.LngLat(coords.longitude, coords.latitude);
      map.centerAndZoom(point, 14);
      setLocating(false);
    }, () => {
      setLocating(false);
      setLocationError("无法获取位置，请检查浏览器定位权限");
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  }

  const statusText = status === "missing"
    ? theme === "paper" ? "地图暂未配置，可继续查看地点列表与天气。" : "请在 .env.local 填写 VITE_TIANDITU_KEY"
    : status === "error"
      ? theme === "paper" ? "地图暂时加载失败，可通过下方链接查看地点。" : "天地图加载失败，请检查 Key 和域名白名单"
      : "天地图加载中…";

  return <div className={`relative min-w-0 bg-[#eef1e9] ${theme === "paper" ? "stargazing-map" : ""}`}>
    <div ref={containerRef} id={containerId.current} className="h-[680px] w-full touch-none bg-[#eef1e9] max-md:h-[460px]" aria-label={label} />
    {status !== "ready" && <div role="status" className="map-status absolute left-1/2 top-1/2 z-[510] w-[min(420px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 border border-[#f2dc00]/60 bg-[#182126]/95 px-5 py-[18px] text-center font-mono text-[11px] font-extrabold leading-[1.7] text-[#fff3a6] shadow-[7px_7px_0_rgb(21_25_29_/_20%)]">{statusText}</div>}
    <button className="absolute bottom-3 left-3 z-[520] grid size-9 place-items-center rounded-full border border-[#f2dc00]/70 bg-[#182126]/95 font-sans text-xl leading-none text-[#f2dc00]" type="button" onClick={locateUser} disabled={locating || status !== "ready"} aria-label={locating ? "定位中" : "我的位置"} title={locating ? "定位中" : "我的位置"}>{locating ? "…" : "◎"}</button>
    <div className="absolute bottom-3 right-3 z-[520] grid border border-[#f2dc00]/70 bg-[#182126]/95">
      <button className="grid size-9 place-items-center border-b border-[#f2dc00]/35 font-sans text-xl leading-none text-[#f2dc00]" type="button" onClick={() => mapRef.current?.zoomIn()} disabled={status !== "ready"} aria-label="放大地图" title="放大地图">+</button>
      <button className="grid size-9 place-items-center font-sans text-xl leading-none text-[#f2dc00]" type="button" onClick={() => mapRef.current?.zoomOut()} disabled={status !== "ready"} aria-label="缩小地图" title="缩小地图">-</button>
    </div>
    <div className="sr-only" aria-label="地图地点键盘列表">
      {accessiblePlaces.map(place => <button key={place.id} type="button" onClick={() => onSelectRef.current?.(place.id)}>{place.name}</button>)}
    </div>
    {locationError && <div className="absolute bottom-14 left-3 z-[520] max-w-[230px] border border-[#d93047] bg-[#182126]/95 px-2 py-1.5 font-mono text-[9px] font-bold leading-[1.4] text-[#fff3a6]" role="status">{locationError}</div>}
  </div>;
}
