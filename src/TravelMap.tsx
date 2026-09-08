import { useEffect, useRef, useState } from "react";
import type { TripDay, TripPlace, TripStop } from "./trips/types";
import { wgs84ToGcj02 } from "./lib/coordinates";

export type DayFilter = number | "all";

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
  zoomIn: () => void;
  zoomOut: () => void;
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
    plugins: [],
  });

  return amapPromise;
}

export type MapPlace = Pick<TripPlace, "id" | "name" | "coord" | "note"> & {
  markerLabel?: string;
  markerColor?: string;
  meta?: string;
  url?: string;
  linkLabel?: string;
};

function popupContent(place: MapPlace, metaText: string, theme: string, onClose: () => void) {
  const box = document.createElement("div");
  box.className = `map-popup relative${theme === "paper" ? " stargazing-popup" : ""}`;

  const close = document.createElement("button");
  close.type = "button";
  close.className = "absolute right-1 top-1 grid size-7 cursor-pointer place-items-center rounded text-xl leading-none hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-1";
  close.setAttribute("aria-label", "关闭地图弹窗");
  close.title = "关闭";
  close.textContent = "×";
  close.addEventListener("click", event => {
    event.stopPropagation();
    onClose();
  });
  box.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
    }
  });

  const meta = document.createElement("span");
  meta.className = "block pr-6";
  meta.textContent = metaText;
  const name = document.createElement("strong");
  name.textContent = place.name;
  const note = document.createElement("p");
  note.textContent = place.note;
  const link = document.createElement("a");
  link.href = place.url ?? amapUrl(place);
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = place.linkLabel ?? "高德导航 ↗";

  box.append(close, meta, name, note, link);
  return box;
}

export function amapUrl(place: Pick<MapPlace, "name" | "coord">) {
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

const emptyStops: TripStop[] = [];
const emptyPlaces: TripPlace[] = [];
const emptyDays: TripDay[] = [];

export type TravelMapProps = {
  focusPlaceId?: string | null;
  label: string;
  fitMaxZoom?: number;
  focusZoom?: number;
  onSelectPlace?: (id: string) => void;
  theme?: "default" | "paper";
} & ({ places: MapPlace[]; stops?: never; alternatives?: never; days?: never; activeDay?: never }
  | { places?: never; stops: TripStop[]; alternatives: TripPlace[]; days: TripDay[]; activeDay: DayFilter });

export function TravelMap({
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
  const mapRef = useRef<AMapInstance | null>(null);
  const userMarkerRef = useRef<AMapOverlay | null>(null);
  const initialCenter = useRef(places?.[0]?.coord ?? stops[0]?.coord ?? [116.397, 39.909]);
  const onSelectRef = useRef(onSelectPlace);
  useEffect(() => { onSelectRef.current = onSelectPlace; }, [onSelectPlace]);
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
          center: initialCenter.current,
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
  }, [key, securityJsCode, serviceHost]);

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

        const position = wgs84ToGcj02([coords.longitude, coords.latitude]);
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
    const shownPlaces: MapPlace[] = places ?? [...shownStops, ...shownAlternatives];
    const overlays: AMapOverlay[] = [];
    const infoWindows: AMapInfoWindow[] = [];
    const infoWindowByPlaceId = new Map<string, AMapInfoWindow>();

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
      place: MapPlace,
      markerText: string,
      color: string,
      kind: "planned" | "alternative" | "place",
      metaText: string,
    ) {
      const markerNode = document.createElement("button");
      markerNode.type = "button";
      markerNode.setAttribute("aria-label", `选择${place.name}`);
      markerNode.setAttribute("aria-pressed", String(place.id === focusPlaceId));
      markerNode.className = `map-marker ${kind}${theme === "paper" ? " stargazing-marker" : ""}`;
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
        content: popupContent(place, metaText, theme, () => {
          infoWindow.close();
          markerNode.focus({ preventScroll: true });
        }),
        anchor: "bottom-center",
        offset: new currentApi.Pixel(0, -22),
        isCustom: true,
      });

      const select = () => {
        infoWindows.forEach((window) => window.close());
        infoWindow.open(currentMap, place.coord);
        onSelectRef.current?.(place.id);
      };
      marker.on?.("click", select);
      markerNode.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); }
      });
      overlays.push(marker);
      infoWindows.push(infoWindow);
      infoWindowByPlaceId.set(place.id, infoWindow);
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
        place.markerColor ??
        (activeDay === "all"
          ? days.find((day) => day.city === place.city)?.color
          : days[activeDay]?.color) ?? "#008f9c";
      addMarker(
        place,
        place.markerLabel ?? place.score.toFixed(1),
        color,
        "alternative",
        `${place.category ?? "备选"} // ${place.city} // 推荐 ${place.score.toFixed(1)}`,
      );
    });

    places?.forEach((place) => addMarker(place, place.markerLabel ?? "•", place.markerColor ?? "#36594a", "place", place.meta ?? ""));

    if (overlays.length) map.add(overlays);
    if (shownPlaces.length === 1)
      map.setZoomAndCenter(13, shownPlaces[0].coord);
    else if (overlays.length)
      map.setFitView(
        overlays,
        false,
        [55, 55, 55, 55],
        activeDay === "all" ? fitMaxZoom : 13,
      );

    const focusedPlace = focusPlaceId
      ? shownPlaces.find((place) => place.id === focusPlaceId)
      : undefined;
    const focusedInfoWindow = focusedPlace
      ? infoWindowByPlaceId.get(focusedPlace.id)
      : undefined;

    if (focusedPlace && focusedInfoWindow) {
      infoWindows.forEach((window) => window.close());
      currentMap.setZoomAndCenter(focusZoom, focusedPlace.coord);
      focusedInfoWindow.open(currentMap, focusedPlace.coord);
    }

    return () => {
      infoWindows.forEach((window) => window.close());
      if (mapRef.current === map && overlays.length) map.remove(overlays);
    };
  }, [activeDay, alternatives, api, days, fitMaxZoom, focusPlaceId, focusZoom, stops, places, theme]);

  const statusText =
    status === "missing"
      ? theme === "paper" ? "地图暂未配置，可继续查看地点列表与天气。" : "请在根目录 .env.local 填写高德 Web JS API Key 与安全密钥"
      : status === "error"
        ? theme === "paper" ? "地图暂时加载失败，可通过下方链接查看地点。" : "高德地图加载失败，请检查 Key、安全密钥和域名白名单"
        : "高德 JS API 2.0 加载中…";

  return (
    <div className={`relative min-w-0 bg-[#eef1e9] ${theme === "paper" ? "stargazing-map" : ""}`}>
      <div
        ref={containerRef}
        className="h-[680px] w-full touch-none bg-[#eef1e9] max-md:h-[460px]"
        aria-label={label}
      />
      {status !== "ready" && (
        <div
          role="status"
          className={`map-status absolute left-1/2 top-1/2 z-[510] w-[min(420px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 border bg-[#182126]/95 px-5 py-[18px] text-center font-mono text-[11px] font-extrabold leading-[1.7] text-[#fff3a6] shadow-[7px_7px_0_rgb(21_25_29_/_20%)] ${
            status === "error"
              ? "border-[#d93047]"
              : "border-[#f2dc00]/60"
          }`}
        >
          {statusText}
        </div>
      )}
      <button
        className="absolute bottom-3 left-3 z-[520] grid size-9 place-items-center rounded-full border border-[#f2dc00]/70 bg-[#182126]/95 font-sans text-xl leading-none text-[#f2dc00] shadow-[0_0_0_3px_rgb(24_33_38_/_18%)] hover:bg-[#d93047] hover:text-[#fff3a6] disabled:cursor-wait disabled:opacity-65"
        type="button"
        onClick={locateUser}
        disabled={locating || status !== "ready"}
        aria-label={locating ? "定位中" : "我的位置"}
        title={locating ? "定位中" : "我的位置"}
      >
        {locating ? "…" : "◎"}
      </button>
      <div className="absolute bottom-3 right-3 z-[520] grid border border-[#f2dc00]/70 bg-[#182126]/95 shadow-[0_0_0_3px_rgb(24_33_38_/_18%)]">
        <button
          className="grid size-9 place-items-center border-b border-[#f2dc00]/35 font-sans text-xl leading-none text-[#f2dc00] hover:bg-[#d93047] hover:text-[#fff3a6] disabled:cursor-not-allowed disabled:opacity-65"
          type="button"
          onClick={() => mapRef.current?.zoomIn()}
          disabled={status !== "ready"}
          aria-label="放大地图"
          title="放大地图"
        >
          +
        </button>
        <button
          className="grid size-9 place-items-center font-sans text-xl leading-none text-[#f2dc00] hover:bg-[#d93047] hover:text-[#fff3a6] disabled:cursor-not-allowed disabled:opacity-65"
          type="button"
          onClick={() => mapRef.current?.zoomOut()}
          disabled={status !== "ready"}
          aria-label="缩小地图"
          title="缩小地图"
        >
          -
        </button>
      </div>
      {locationError && (
        <div
          className="absolute bottom-14 left-3 z-[520] max-w-[230px] border border-[#d93047] bg-[#182126]/95 px-2 py-1.5 font-mono text-[9px] font-bold leading-[1.4] text-[#fff3a6]"
          role="status"
        >
          {locationError}
        </div>
      )}
    </div>
  );
}
