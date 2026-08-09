"use client";

import { useEffect, useRef } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";

export type MapStop = {
  id: string;
  day: number;
  order: number;
  city: "青岛" | "烟台" | "威海";
  name: string;
  time: string;
  note: string;
  coord: [number, number];
};

type Props = {
  stops: MapStop[];
  activeDay: number | "all";
};

const dayColors = ["#e55b3b", "#087f8c", "#6555c7", "#e0a126", "#c14463"];

function transformLat(x: number, y: number) {
  let result = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y;
  result += 0.2 * Math.sqrt(Math.abs(x));
  result +=
    ((20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2) /
    3;
  result +=
    ((20 * Math.sin(y * Math.PI) + 40 * Math.sin((y / 3) * Math.PI)) * 2) /
    3;
  result +=
    ((160 * Math.sin((y / 12) * Math.PI) + 320 * Math.sin((y * Math.PI) / 30)) *
      2) /
    3;
  return result;
}

function transformLng(x: number, y: number) {
  let result = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y;
  result += 0.1 * Math.sqrt(Math.abs(x));
  result +=
    ((20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2) /
    3;
  result +=
    ((20 * Math.sin(x * Math.PI) + 40 * Math.sin((x / 3) * Math.PI)) * 2) /
    3;
  result +=
    ((150 * Math.sin((x / 12) * Math.PI) + 300 * Math.sin((x / 30) * Math.PI)) *
      2) /
    3;
  return result;
}

function gcj02ToWgs84([lng, lat]: [number, number]): [number, number] {
  const a = 6378245;
  const ee = 0.006693421622965943;
  let dLat = transformLat(lng - 105, lat - 35);
  let dLng = transformLng(lng - 105, lat - 35);
  const radLat = (lat / 180) * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180) / (((a * (1 - ee)) / (magic * sqrtMagic)) * Math.PI);
  dLng = (dLng * 180) / ((a / sqrtMagic) * Math.cos(radLat) * Math.PI);
  return [lng * 2 - (lng + dLng), lat * 2 - (lat + dLat)];
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ] ?? character,
  );
}

export function amapUrl(stop: MapStop) {
  const [lng, lat] = stop.coord;
  const params = new URLSearchParams({
    position: `${lng},${lat}`,
    name: stop.name,
    src: "qingdao-trip-guide",
    coordinate: "gaode",
    callnative: "1",
  });
  return `https://uri.amap.com/marker?${params.toString()}`;
}

export function TravelMap({ stops, activeDay }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderMap() {
      if (!containerRef.current) return;
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {
          zoomControl: false,
          scrollWheelZoom: false,
        }).setView([36.75, 121.15], 8);
        L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }

      const layer = layerRef.current;
      const map = mapRef.current;
      if (!layer || !map) return;
      layer.clearLayers();

      const shown = activeDay === "all" ? stops : stops.filter((stop) => stop.day === activeDay);
      const bounds: [number, number][] = [];

      for (const day of [0, 1, 2, 3, 4]) {
        const route = shown.filter((stop) => stop.day === day);
        if (route.length < 2) continue;
        const coordinates = route.map((stop) => {
          const [lng, lat] = gcj02ToWgs84(stop.coord);
          return [lat, lng] as [number, number];
        });
        L.polyline(coordinates, {
          color: dayColors[day],
          weight: activeDay === "all" ? 2 : 3,
          opacity: activeDay === "all" ? 0.45 : 0.8,
          dashArray: "7 8",
        }).addTo(layer);
      }

      shown.forEach((stop) => {
        const [lng, lat] = gcj02ToWgs84(stop.coord);
        const location: [number, number] = [lat, lng];
        bounds.push(location);
        const marker = L.marker(location, {
          icon: L.divIcon({
            className: "map-marker-shell",
            html: `<span class="map-marker" style="--marker:${dayColors[stop.day]}">${stop.order}</span>`,
            iconSize: [32, 38],
            iconAnchor: [16, 36],
            popupAnchor: [0, -31],
          }),
        });
        marker.bindPopup(
          `<div class="map-popup"><span>${escapeHtml(stop.city)} · ${escapeHtml(stop.time)}</span><strong>${escapeHtml(stop.name)}</strong><p>${escapeHtml(stop.note)}</p><a href="${amapUrl(stop)}" target="_blank" rel="noreferrer">高德地图打开 ↗</a></div>`,
          { maxWidth: 240 },
        );
        marker.addTo(layer);
      });

      if (bounds.length) {
        map.fitBounds(bounds, {
          padding: [38, 38],
          maxZoom: activeDay === "all" ? 8 : 13,
        });
      }
      window.setTimeout(() => map.invalidateSize(), 80);
    }

    renderMap();
    return () => {
      cancelled = true;
    };
  }, [activeDay, stops]);

  useEffect(
    () => () => {
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    },
    [],
  );

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map-canvas" aria-label="青岛烟台威海旅行点位地图" />
      <div className="map-note">点位来自高德 MCP · 底图使用 OpenStreetMap</div>
    </div>
  );
}
