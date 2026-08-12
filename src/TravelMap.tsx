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
  focusPlaceId?: string | null;
  label: string;
};

export function TravelMap({
  stops,
  alternatives,
  days,
  activeDay,
  focusPlaceId = null,
  label,
}: TravelMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<AMapInstance | null>(null);
  const userMarkerRef = useRef<AMapOverlay | null>(null);
  const [api, setApi] = useState<AMapNamespace | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
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
          scrollWheel: false,
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
      if (mapRef.current && userMarkerRef.current) {
        mapRef.current.remove(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, [key, securityJsCode, serviceHost, stops]);

  function locateUser() {
    if (!api || !mapRef.current) return;
    if (!navigator.geolocation) {
      setLocationError("当前浏览器不支持定位");
      return;
    }

    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const map = mapRef.current;
        if (!map || !api) return;

        const position: [number, number] = [coords.longitude, coords.latitude];
        if (userMarkerRef.current) map.remove(userMarkerRef.current);

        const markerNode = document.createElement("span");
        markerNode.className = "map-user-marker";
        markerNode.title = "我的位置";
        const marker = new api.Marker({
          position,
          content: markerNode,
          anchor: "center",
          zIndex: 100,
          title: "我的位置",
        });

        map.add(marker);
        map.setZoomAndCenter(14, position);
        userMarkerRef.current = marker;
        setLocating(false);
      },
      () => {
        setLocating(false);
        setLocationError("无法获取位置，请检查浏览器定位权限");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

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

    const focusedPlace = focusPlaceId
      ? shownPlaces.find((place) => place.id === focusPlaceId)
      : undefined;
    const focusedInfoWindow = focusedPlace
      ? infoWindows[shownPlaces.indexOf(focusedPlace)]
      : undefined;

    if (focusedPlace && focusedInfoWindow) {
      infoWindows.forEach((window) => window.close());
      currentMap.setZoomAndCenter(14, focusedPlace.coord);
      focusedInfoWindow.open(currentMap, focusedPlace.coord);
    }

    return () => {
      infoWindows.forEach((window) => window.close());
      if (mapRef.current === map && overlays.length) map.remove(overlays);
    };
  }, [activeDay, alternatives, api, days, focusPlaceId, stops]);

  const statusText =
    status === "missing"
      ? "请在根目录 .env.local 填写高德 Web JS API Key 与安全密钥"
      : status === "error"
        ? "高德地图加载失败，请检查 Key、安全密钥和域名白名单"
        : "高德 JS API 2.0 加载中…";

  return (
    <div className="relative min-w-0 bg-[#eef1e9]">
      <div
        ref={containerRef}
        className="h-[680px] w-full touch-none bg-[#eef1e9] max-md:h-[460px]"
        aria-label={label}
      />
      {status !== "ready" && (
        <div
          className={`absolute left-1/2 top-1/2 z-[510] w-[min(420px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 border bg-[#182126]/95 px-5 py-[18px] text-center font-mono text-[11px] font-extrabold leading-[1.7] text-[#fff3a6] shadow-[7px_7px_0_rgb(21_25_29_/_20%)] ${
            status === "error"
              ? "border-[#d93047]"
              : "border-[#f2dc00]/60"
          }`}
        >
          {statusText}
        </div>
      )}
      <div className="absolute left-3 top-3 z-[500] flex max-w-[calc(100%-1.5rem)] flex-wrap gap-3 border border-[#15191d]/40 bg-[#182126]/90 px-2.5 py-2 font-mono text-[9px] font-bold text-[#fff5a4]">
        <span className="flex items-center gap-1.5">
          <i className="size-2.5 rotate-45 bg-[#f2dc00]" /> 要去的 / 顺序连线
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-2.5 rounded-full border border-[#f2dc00]" /> 6+ 备选
        </span>
      </div>
      <button
        className="absolute right-3 top-3 z-[520] border border-[#f2dc00]/70 bg-[#182126]/95 px-2.5 py-2 font-mono text-[9px] font-extrabold text-[#f2dc00] hover:bg-[#d93047] hover:text-[#fff3a6] disabled:cursor-wait disabled:opacity-65"
        type="button"
        onClick={locateUser}
        disabled={locating || status !== "ready"}
      >
        {locating ? "定位中…" : "我的位置 ↗"}
      </button>
      {locationError && (
        <div
          className="absolute right-3 top-12 z-[520] max-w-[230px] border border-[#d93047] bg-[#182126]/95 px-2 py-1.5 font-mono text-[9px] font-bold leading-[1.4] text-[#fff3a6]"
          role="status"
        >
          {locationError}
        </div>
      )}
      <div className="absolute bottom-3 left-3 z-[500] border border-[#15191d]/40 bg-[#182126]/90 px-2.5 py-1.5 font-mono text-[9px] font-bold text-[#fff5a4]">
        高德 JS API 2.0 // 列表点击聚焦 · 地图可拖动/双指缩放
      </div>
    </div>
  );
}
