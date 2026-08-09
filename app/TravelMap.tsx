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

const colors = ["#00f5ff", "#ff2bd6", "#f9f871", "#8bff80"];

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char,
  );
}

export function amapUrl(stop: MapStop) {
  const [lng, lat] = stop.coord;
  const query = new URLSearchParams({
    position: `${lng},${lat}`,
    name: stop.name,
    coordinate: "gaode",
    callnative: "1",
    src: "qingdao-trip-guide",
  });
  return `https://uri.amap.com/marker?${query.toString()}`;
}

export function TravelMap({ stops, activeDay }: { stops: MapStop[]; activeDay: number | "all" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      if (!containerRef.current) return;
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          touchZoom: true,
          doubleClickZoom: true,
          dragging: true,
          keyboard: true,
          boxZoom: true,
          zoomSnap: 0.5,
          wheelPxPerZoomLevel: 90,
        }).setView([36.75, 121.15], 8);

        L.tileLayer(
          "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
          {
            subdomains: ["1", "2", "3", "4"],
            minZoom: 3,
            maxZoom: 18,
            attribution: '<a href="https://lbs.amap.com/" target="_blank" rel="noreferrer">高德地图</a>',
          },
        ).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }

      const map = mapRef.current;
      const layer = layerRef.current;
      if (!map || !layer) return;
      layer.clearLayers();

      const shown = activeDay === "all" ? stops : stops.filter((stop) => stop.day === activeDay);
      const bounds: [number, number][] = [];

      for (const day of [0, 1, 2, 3]) {
        const route = shown.filter((stop) => stop.day === day);
        if (route.length > 1) {
          L.polyline(
            route.map((stop) => [stop.coord[1], stop.coord[0]] as [number, number]),
            { color: colors[day], weight: 2, opacity: 0.8, dashArray: "8 9" },
          ).addTo(layer);
        }
      }

      shown.forEach((stop) => {
        const location: [number, number] = [stop.coord[1], stop.coord[0]];
        bounds.push(location);
        L.marker(location, {
          icon: L.divIcon({
            className: "map-marker-shell",
            html: `<span class="map-marker" style="--marker:${colors[stop.day]}">${stop.order}</span>`,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            popupAnchor: [0, -18],
          }),
        })
          .bindPopup(
            `<div class="map-popup"><span>${escapeHtml(stop.city)} // ${escapeHtml(stop.time)}</span><strong>${escapeHtml(stop.name)}</strong><p>${escapeHtml(stop.note)}</p><a href="${amapUrl(stop)}" target="_blank" rel="noreferrer">高德导航 ↗</a></div>`,
            { maxWidth: 250 },
          )
          .addTo(layer);
      });

      if (bounds.length === 1) map.setView(bounds[0], 13);
      else if (bounds.length) map.fitBounds(bounds, { padding: [40, 40], maxZoom: activeDay === "all" ? 8 : 13 });
      window.setTimeout(() => map.invalidateSize(), 60);
    }

    draw();
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
      <div ref={containerRef} className="map-canvas" aria-label="高德地图：青岛烟台威海旅行点位" />
      <div className="map-hint">高德底图 // 滚轮或双指缩放</div>
    </div>
  );
}
