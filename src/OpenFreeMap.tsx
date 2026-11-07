import { useEffect, useRef, useState } from "react";
import { GeolocateControl, LngLatBounds, Map as LibreMap, Marker, NavigationControl, Popup, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import type { MapPlace } from "./map/types";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map/openfreemap.css";

setWorkerUrl(workerUrl);

export type OpenFreeMapProps = {
  /** Coordinates must be WGS84 [longitude, latitude], not the existing AMap GCJ-02 values. */
  places: MapPlace[];
  label: string;
  focusPlaceId?: string | null;
  onSelectPlace?: (id: string) => void;
  fitMaxZoom?: number;
  focusZoom?: number;
};

function placeLink(place: MapPlace) {
  if (!place.url) return undefined;
  try {
    const url = new URL(place.url);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function popupContent(place: MapPlace) {
  const box = document.createElement("div");
  for (const [tag, text] of [["strong", place.name], ["p", place.meta], ["p", place.note]] as const) {
    if (!text) continue;
    const item = document.createElement(tag);
    item.textContent = text;
    box.append(item);
  }
  const href = placeLink(place);
  if (href) {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = place.linkLabel ?? "查看地点 ↗";
    box.append(link);
  }
  return box;
}

export function OpenFreeMap({ places, label, focusPlaceId = null, onSelectPlace, fitMaxZoom = 12, focusZoom = 14 }: OpenFreeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialCenter = useRef(places[0]?.coord ?? [0, 20]);
  const onSelectRef = useRef(onSelectPlace);
  const focusRef = useRef(focusPlaceId);
  const selectRef = useRef<(id: string) => void>(() => {});
  const showPlaceRef = useRef<(place: MapPlace) => void>(() => {});
  const markersRef = useRef(new Map<string, Marker>());
  const popupRef = useRef<Popup | null>(null);
  const [map, setMap] = useState<LibreMap | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [tileError, setTileError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    onSelectRef.current = onSelectPlace;
    focusRef.current = focusPlaceId;
  }, [onSelectPlace, focusPlaceId]);

  useEffect(() => {
    if (!containerRef.current) return;
    let instance: LibreMap | undefined;
    let observer: ResizeObserver | undefined;
    let hasLoadedTile = false;
    let hasLoadError = false;
    let disposed = false;
    setStatus("loading");
    setTileError(false);
    setLocationError(false);
    const timeout = window.setTimeout(() => setStatus("error"), 20000);
    try {
      instance = new LibreMap({
        container: containerRef.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: initialCenter.current,
        zoom: 3,
        locale: {
          "Map.Title": label,
          "NavigationControl.ZoomIn": "放大地图",
          "NavigationControl.ZoomOut": "缩小地图",
          "GeolocateControl.FindMyLocation": "我的位置",
          "GeolocateControl.LocationNotAvailable": "无法获取位置",
          "AttributionControl.ToggleAttribution": "地图署名",
          "Popup.Close": "关闭地图弹窗",
        },
      });
      const current = instance;
      const ready = () => {
        window.clearTimeout(timeout);
        setStatus("ready");
      };
      current.on("load", () => {
        if (!hasLoadError || hasLoadedTile) ready();
      });
      current.on("error", () => {
        hasLoadError = true;
        if (hasLoadedTile) setTileError(true);
        else setStatus("error");
      });
      current.on("sourcedata", event => {
        // A load event alone can also follow failed tiles; require actual tile data to recover.
        const tile: unknown = event.tile;
        if (event.sourceDataType === "content" && tile && typeof tile === "object" && "state" in tile && tile.state === "loaded") {
          hasLoadedTile = true;
          setTileError(false);
          if (current.loaded()) ready();
        }
      });
      const location = new GeolocateControl({ positionOptions: { enableHighAccuracy: true, timeout: 10000 }, fitBoundsOptions: { maxZoom: 14 } });
      location.on("error", () => { if (!disposed) setLocationError(true); });
      location.on("geolocate", () => { if (!disposed) setLocationError(false); });
      current.addControl(new NavigationControl({ showCompass: false }), "top-right");
      current.addControl(location, "top-right");
      observer = new ResizeObserver(() => current.resize());
      observer.observe(containerRef.current);
      setMap(current);
    } catch {
      window.clearTimeout(timeout);
      observer?.disconnect();
      instance?.remove();
      instance = undefined;
      setMap(null);
      setStatus("error");
    }
    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      observer?.disconnect();
      popupRef.current?.remove();
      popupRef.current = null;
      instance?.remove();
    };
  // The accessible label can change without recreating the map.
  }, [attempt]);

  useEffect(() => {
    map?.getCanvas().setAttribute("aria-label", label);
  }, [map, label]);

  useEffect(() => {
    if (!map) return;
    const markers = new Map<string, Marker>();
    const showPlace = (place: MapPlace) => {
      popupRef.current?.remove();
      map.stop().jumpTo({ center: place.coord, zoom: focusZoom });
      const popup = new Popup({ offset: 24, maxWidth: "260px", className: "openfreemap-popup", focusAfterOpen: false })
        .setLngLat(place.coord).setDOMContent(popupContent(place)).addTo(map);
      popupRef.current = popup;
    };
    showPlaceRef.current = showPlace;
    const select = (id: string) => {
      const place = places.find(item => item.id === id);
      if (!place) return;
      if (onSelectRef.current && id !== focusRef.current) onSelectRef.current(id);
      else {
        showPlace(place);
        onSelectRef.current?.(id);
      }
    };
    selectRef.current = select;
    for (const place of places) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "openfreemap-marker";
      button.textContent = place.markerLabel ?? "•";
      button.style.backgroundColor = place.markerColor ?? "#36594a";
      button.setAttribute("aria-label", `选择${place.name}`);
      button.setAttribute("aria-pressed", String(place.id === focusRef.current));
      button.addEventListener("click", event => {
        event.stopPropagation();
        select(place.id);
      });
      // Native buttons own keyboard activation; do not also attach Marker.setPopup key handlers.
      markers.set(place.id, new Marker({ element: button }).setLngLat(place.coord).addTo(map));
    }
    markersRef.current = markers;
    return () => {
      selectRef.current = () => {};
      showPlaceRef.current = () => {};
      markers.forEach(marker => marker.remove());
      markersRef.current.clear();
      popupRef.current?.remove();
      popupRef.current = null;
    };
  }, [map, places, focusZoom]);

  useEffect(() => {
    if (!map) return;
    markersRef.current.forEach((marker, id) => marker.getElement().setAttribute("aria-pressed", String(id === focusPlaceId)));
    const focused = places.find(place => place.id === focusPlaceId);
    if (focused) showPlaceRef.current(focused);
    else {
      popupRef.current?.remove();
      map.stop();
      if (places.length === 1) map.jumpTo({ center: places[0].coord, zoom: fitMaxZoom });
      else if (places.length > 1) {
        const bounds = new LngLatBounds();
        places.forEach(place => bounds.extend(place.coord));
        map.fitBounds(bounds, { padding: 60, maxZoom: fitMaxZoom, duration: 0 });
      }
    }
  }, [map, places, focusPlaceId, focusZoom, fitMaxZoom]);

  return <section className="openfreemap" aria-label={label}>
    <div className="openfreemap-frame">
      <div ref={containerRef} className="openfreemap-canvas" />
      {status !== "ready" && <div className="openfreemap-status" role="status">
        <p>{status === "loading" ? "地图加载中…" : "地图暂时加载失败，仍可查看下方地点。"}</p>
        {status === "error" && <button type="button" onClick={() => setAttempt(value => value + 1)}>重新加载地图</button>}
      </div>}
      {(tileError || locationError) && <p className="openfreemap-notice" role="status">{locationError ? "无法获取位置，请检查浏览器定位权限。" : "部分底图加载失败，请检查网络或移动地图重试。"}</p>}
    </div>
    <details className="openfreemap-places" open={status === "error"}>
      <summary>地点列表 · {places.length}</summary>
      {places.length ? <ul>{places.map(place => <li key={place.id}>
        <button type="button" onClick={() => selectRef.current(place.id)} aria-pressed={place.id === focusPlaceId}>{place.name}</button>
        {place.meta && <p>{place.meta}</p>}<p>{place.note}</p>
        {placeLink(place) && <a href={placeLink(place)} target="_blank" rel="noreferrer">{place.linkLabel ?? "查看地点 ↗"}</a>}
      </li>)}</ul> : <p>暂无地点。</p>}
    </details>
  </section>;
}
