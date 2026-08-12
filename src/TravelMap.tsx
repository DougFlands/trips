import { useEffect, useRef, useState } from "react";
import type { TripDay, TripPlace, TripStop } from "./trips/types";

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
    _AMapSecurityConfig?:
      | { securityJsCode: string }
      | { serviceHost: string };
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

async function loadAMap(
  key: string,
  securityJsCode: string,
  serviceHost: string,
) {
  window._AMapSecurityConfig = serviceHost
    ? { serviceHost }
    : { securityJsCode };
  await loadLoader();

  amapPromise ??= window.AMapLoader!.load({
    key,
    version: "2.0",
    plugins: ["AMap.ToolBar", "AMap.Scale"],
  });

  return amapPromise;
}

function popupContent(place: TripPlace, metaText: string) {
  const box = document.createElement("div");
  box.className = "map-popup";

  const meta = document.createElement("span");
  meta.textContent = metaText;
  const name = document.createElement("strong");
  name.textContent = place.name;
  const note = document.createElement("p");
  note.textContent = place.note;
  const link = document.createElement("a");
  link.href = amapUrl(place);
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = "高德导航 ↗";

  box.append(meta, name, note, link);
  return box;
}

export function amapUrl(place: TripPlace) {
  const [lng, lat] = place.coord;
  const query = new URLSearchParams({
    position: `${lng},${lat}`,
    name: place.name,
    coordinate: "gaode",
    callnative: "1",
    src: "travel-guides",
  });

  return `https://uri.amap.com/marker?${query.toString()}`;
}

type TravelMapProps = {
  stops: TripStop[];
  alternatives: TripPlace[];
  days: TripDay[];
  activeDay: DayFilter;
  label: string;
};

export function TravelMap({
  stops,
  alternatives,
  days,
  activeDay,
  label,
}: TravelMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<AMapInstance | null>(null);
  const [api, setApi] = useState<AMapNamespace | null>(null);
  const [status, setStatus] = useState<
    "missing" | "loading" | "ready" | "error"
  >("loading");
  const key = import.meta.env.VITE_AMAP_KEY?.trim() ?? "";
  const securityJsCode = import.meta.env.DEV
    ? (import.meta.env.VITE_AMAP_SECURITY_JS_CODE?.trim() ?? "")
    : "";
  const serviceHost = import.meta.env.DEV
    ? ""
    : `${window.location.origin}/_AMapService`;

  useEffect(() => {
    if (!key || (import.meta.env.DEV && !securityJsCode)) {
      setStatus("missing");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    loadAMap(key, securityJsCode, serviceHost)
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
  }, [key, securityJsCode, serviceHost, stops]);

  useEffect(() => {
    const map = mapRef.current;
    if (!api || !map) return;
    const currentApi = api;
    const currentMap = map;

    const shownStops =
      activeDay === "all"
        ? stops
        : stops.filter((stop) => stop.day === activeDay);
    const activeCity = activeDay === "all" ? undefined : days[activeDay]?.city;
    const shownAlternatives =
      activeDay === "all"
        ? alternatives
        : alternatives.filter((place) => place.city === activeCity);
    const shownPlaces = [...shownStops, ...shownAlternatives];
    const overlays: AMapOverlay[] = [];
    const infoWindows: AMapInfoWindow[] = [];

    for (const dayIndex of new Set(shownStops.map((stop) => stop.day))) {
      const route = shownStops
        .filter((stop) => stop.day === dayIndex)
        .sort((a, b) => a.order - b.order);
      if (route.length < 2) continue;

      overlays.push(
        new api.Polyline({
          path: route.map((stop) => stop.coord),
          strokeColor: days[dayIndex]?.color ?? "#008f9c",
          strokeWeight: 5,
          strokeOpacity: 0.95,
          strokeStyle: "solid",
          borderWeight: 2,
          showDir: true,
          zIndex: 30,
        }),
      );
    }

    function addMarker(
      place: TripPlace,
      markerText: string,
      color: string,
      kind: "planned" | "alternative",
      metaText: string,
    ) {
      const markerNode = document.createElement("span");
      markerNode.className = `map-marker ${kind}`;
      markerNode.style.setProperty("--marker", color);
      markerNode.textContent = markerText;

      const marker = new currentApi.Marker({
        position: place.coord,
        content: markerNode,
        anchor: "center",
        zIndex: kind === "planned" ? 50 : 40,
        title: place.name,
      });
      const infoWindow = new currentApi.InfoWindow({
        content: popupContent(place, metaText),
        anchor: "bottom-center",
        offset: new currentApi.Pixel(0, -22),
        isCustom: true,
      });

      marker.on?.("click", () => {
        infoWindows.forEach((window) => window.close());
        infoWindow.open(currentMap, place.coord);
      });
      overlays.push(marker);
      infoWindows.push(infoWindow);
    }

    shownStops.forEach((stop) => {
      const color = days[stop.day]?.color ?? "#008f9c";
      addMarker(
        stop,
        String(stop.order),
        color,
        "planned",
        `${stop.city} // ${stop.time} // 推荐 ${stop.score.toFixed(1)}`,
      );
    });

    shownAlternatives.forEach((place) => {
      const color =
        (activeDay === "all"
          ? days.find((day) => day.city === place.city)?.color
          : days[activeDay]?.color) ?? "#008f9c";
      addMarker(
        place,
        place.score.toFixed(1),
        color,
        "alternative",
        `${place.city} // 6+ 备选 // 推荐 ${place.score.toFixed(1)}`,
      );
    });

    if (overlays.length) map.add(overlays);
    if (shownPlaces.length === 1)
      map.setZoomAndCenter(13, shownPlaces[0].coord);
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
  }, [activeDay, alternatives, api, days, stops]);

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
      <div className="map-legend">
        <span>
          <i className="planned" /> 要去的 / 顺序连线
        </span>
        <span>
          <i className="alternative" /> 6+ 备选
        </span>
      </div>
      <div className="map-hint">高德 JS API 2.0 // 滚轮或双指缩放</div>
    </div>
  );
}
