import { useEffect, useRef, useState } from "react";
import type { TripDay, TripStop } from "./trips/types";

type DayFilter = number | "all";

type AMapOverlay = {
  on?: (event: string, handler: () => void) => void;
};

type AMapInstance = {
  add: (items: AMapOverlay | AMapOverlay[]) => void;
  remove: (items: AMapOverlay | AMapOverlay[]) => void;
  addControl: (control: object) => void;
  setFitView: (
    items?: AMapOverlay[],
    immediately?: boolean,
    avoid?: number[],
    maxZoom?: number,
  ) => void;
  setZoomAndCenter: (zoom: number, center: [number, number]) => void;
  destroy: () => void;
};

type AMapInfoWindow = {
  open: (map: AMapInstance, position: [number, number]) => void;
  close: () => void;
};

type AMapNamespace = {
  Map: new (
    container: HTMLDivElement,
    options: Record<string, unknown>,
  ) => AMapInstance;
  Marker: new (options: Record<string, unknown>) => AMapOverlay;
  Polyline: new (options: Record<string, unknown>) => AMapOverlay;
  InfoWindow: new (options: Record<string, unknown>) => AMapInfoWindow;
  Pixel: new (x: number, y: number) => object;
  ToolBar: new (options?: Record<string, unknown>) => object;
  Scale: new (options?: Record<string, unknown>) => object;
};

type AMapLoader = {
  load: (options: {
    key: string;
    version: "2.0";
    plugins: string[];
  }) => Promise<AMapNamespace>;
};

declare global {
  interface Window {
    _AMapSecurityConfig?: { securityJsCode: string };
    AMapLoader?: AMapLoader;
  }
}

let loaderPromise: Promise<void> | undefined;
let amapPromise: Promise<AMapNamespace> | undefined;

function loadLoader() {
  if (window.AMapLoader) return Promise.resolve();
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-amap-loader="true"]',
    );
    const script = existing ?? document.createElement("script");

    script.addEventListener(
      "load",
      () =>
        window.AMapLoader
          ? resolve()
          : reject(new Error("高德 JS API Loader 未初始化")),
      { once: true },
    );
    script.addEventListener(
      "error",
      () => reject(new Error("高德 JS API Loader 加载失败")),
      { once: true },
    );

    if (!existing) {
      script.src = "https://webapi.amap.com/loader.js";
      script.async = true;
      script.dataset.amapLoader = "true";
      document.head.appendChild(script);
    }
  });

  return loaderPromise;
}

async function loadAMap(key: string, securityJsCode: string) {
  window._AMapSecurityConfig = { securityJsCode };
  await loadLoader();

  amapPromise ??= window.AMapLoader!.load({
    key,
    version: "2.0",
    plugins: ["AMap.ToolBar", "AMap.Scale"],
  });

  return amapPromise;
}

function popupContent(stop: TripStop) {
  const box = document.createElement("div");
  box.className = "map-popup";

  const meta = document.createElement("span");
  meta.textContent = `${stop.city} // ${stop.time}`;
  const name = document.createElement("strong");
  name.textContent = stop.name;
  const note = document.createElement("p");
  note.textContent = stop.note;
  const link = document.createElement("a");
  link.href = amapUrl(stop);
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = "高德导航 ↗";

  box.append(meta, name, note, link);
  return box;
}

export function amapUrl(stop: TripStop) {
  const [lng, lat] = stop.coord;
  const query = new URLSearchParams({
    position: `${lng},${lat}`,
    name: stop.name,
    coordinate: "gaode",
    callnative: "1",
    src: "travel-guides",
  });

  return `https://uri.amap.com/marker?${query.toString()}`;
}

type TravelMapProps = {
  stops: TripStop[];
  days: TripDay[];
  activeDay: DayFilter;
  label: string;
};

export function TravelMap({ stops, days, activeDay, label }: TravelMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<AMapInstance | null>(null);
  const [api, setApi] = useState<AMapNamespace | null>(null);
  const [status, setStatus] = useState<
    "missing" | "loading" | "ready" | "error"
  >("loading");
  const key = import.meta.env.VITE_AMAP_KEY?.trim() ?? "";
  const securityJsCode =
    import.meta.env.VITE_AMAP_SECURITY_JS_CODE?.trim() ?? "";

  useEffect(() => {
    if (!key || !securityJsCode) {
      setStatus("missing");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    loadAMap(key, securityJsCode)
      .then((AMap) => {
        if (cancelled || !containerRef.current) return;

        const map = new AMap.Map(containerRef.current, {
          viewMode: "2D",
          mapStyle: "amap://styles/normal",
          center: stops[0]?.coord ?? [116.397, 39.909],
          zoom: 8,
          zooms: [3, 18],
          resizeEnable: true,
          showLabel: true,
          dragEnable: true,
          zoomEnable: true,
          scrollWheel: true,
          doubleClickZoom: true,
          keyboardEnable: true,
          touchZoom: true,
          touchZoomCenter: 0,
        });

        map.addControl(new AMap.ToolBar({ position: "RT" }));
        map.addControl(new AMap.Scale());
        mapRef.current = map;
        setApi(AMap);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, [key, securityJsCode, stops]);

  useEffect(() => {
    const map = mapRef.current;
    if (!api || !map) return;

    const shown =
      activeDay === "all"
        ? stops
        : stops.filter((stop) => stop.day === activeDay);
    const overlays: AMapOverlay[] = [];
    const infoWindows: AMapInfoWindow[] = [];

    for (const dayIndex of new Set(shown.map((stop) => stop.day))) {
      const route = shown.filter((stop) => stop.day === dayIndex);
      if (route.length < 2) continue;

      overlays.push(
        new api.Polyline({
          path: route.map((stop) => stop.coord),
          strokeColor: days[dayIndex]?.color ?? "#008f9c",
          strokeWeight: 4,
          strokeOpacity: 0.9,
          strokeStyle: "dashed",
          borderWeight: 1,
          showDir: true,
          zIndex: 30,
        }),
      );
    }

    shown.forEach((stop) => {
      const color = days[stop.day]?.color ?? "#008f9c";
      const markerNode = document.createElement("span");
      markerNode.className = "map-marker";
      markerNode.style.setProperty("--marker", color);
      markerNode.textContent = String(stop.order);

      const marker = new api.Marker({
        position: stop.coord,
        content: markerNode,
        anchor: "center",
        zIndex: 50,
        title: stop.name,
      });
      const infoWindow = new api.InfoWindow({
        content: popupContent(stop),
        anchor: "bottom-center",
        offset: new api.Pixel(0, -22),
        isCustom: true,
      });

      marker.on?.("click", () => {
        infoWindows.forEach((window) => window.close());
        infoWindow.open(map, stop.coord);
      });
      overlays.push(marker);
      infoWindows.push(infoWindow);
    });

    if (overlays.length) map.add(overlays);
    if (shown.length === 1) map.setZoomAndCenter(13, shown[0].coord);
    else if (overlays.length)
      map.setFitView(
        overlays,
        false,
        [55, 55, 55, 55],
        activeDay === "all" ? 8 : 13,
      );

    return () => {
      infoWindows.forEach((window) => window.close());
      if (mapRef.current === map && overlays.length) map.remove(overlays);
    };
  }, [activeDay, api, days, stops]);

  const statusText =
    status === "missing"
      ? "请在根目录 .env.local 填写高德 Web JS API Key 与安全密钥"
      : status === "error"
        ? "高德地图加载失败，请检查 Key、安全密钥和域名白名单"
        : "高德 JS API 2.0 加载中…";

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map-canvas" aria-label={label} />
      {status !== "ready" && (
        <div className={`map-status ${status}`}>{statusText}</div>
      )}
      <div className="map-hint">高德 JS API 2.0 // 滚轮或双指缩放</div>
    </div>
  );
}
