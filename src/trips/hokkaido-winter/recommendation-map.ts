import type { MapPlace } from "../../map/types";
import type { City, Recommendation } from "./trip";

export type HokkaidoMapPlace = MapPlace & {
  city: City;
  priority: Recommendation["priority"];
  duration: string;
  condition?: string;
};

type Coord = readonly [number, number];

// WGS84 概览点位：用于看分布，不作导航入口。
const coordinates: Record<string, Coord> = {
  odori: [141.3545, 43.0588],
  shrine: [141.3147, 43.0152],
  university: [141.3418, 43.0764],
  susukino: [141.3544, 43.0552],
  nakajima: [141.3534, 43.0438],
  "red-office": [141.3472, 43.0621],
  shiroi: [141.2776, 43.0896],
  tanukikoji: [141.3508, 43.0572],
  moiwa: [141.3223, 43.0206],
  tower: [141.3564, 43.0571],
  clock: [141.3536, 43.0627],
  remote: [141.2931, 42.9977],
  canal: [140.9947, 43.1976],
  tengu: [140.9714, 43.1672],
  sakaimachi: [141.0025, 43.1907],
  "music-box": [141.0023, 43.1901],
  glass: [141.0011, 43.1908],
  funami: [140.9982, 43.1949],
  temiya: [140.9998, 43.2035],
  aquarium: [140.9412, 43.2348],
  shukutsu: [140.9449, 43.2298],
  asari: [141.0855, 43.1701],
  "hakodate-mountain": [140.7038, 41.7596],
  goryokaku: [140.7568, 41.7969],
  motomachi: [140.7147, 41.7658],
  kanemori: [140.7145, 41.7651],
  "old-hall": [140.7126, 41.7673],
  omori: [140.7354, 41.7625],
  yunokawa: [140.7879, 41.7758],
  botanical: [140.7904, 41.7739],
};

const cityColors: Record<City, string> = {
  札幌: "#a74440",
  小樽: "#365f78",
  函馆: "#6e4f72",
};

export function toHokkaidoMapPlace(city: City, recommendation: Recommendation, index: number): HokkaidoMapPlace {
  const coord = coordinates[recommendation.id];
  if (!coord) throw new Error(`Missing map coordinate: ${recommendation.id}`);
  return {
    id: recommendation.id,
    name: recommendation.name,
    coord: [...coord],
    note: recommendation.reason,
    meta: `${city} · ${recommendation.priority} · ${recommendation.duration}`,
    markerLabel: String(index + 1).padStart(2, "0"),
    markerColor: cityColors[city],
    city,
    priority: recommendation.priority,
    duration: recommendation.duration,
    condition: recommendation.condition,
  };
}

export function buildHokkaidoMapPlaces(recommendations: Record<City, Recommendation[]>): HokkaidoMapPlace[] {
  const places = (Object.keys(recommendations) as City[]).flatMap((city) => recommendations[city].map((item, index) => toHokkaidoMapPlace(city, item, index)));
  const ids = new Set<string>();
  for (const place of places) {
    if (ids.has(place.id) || place.coord.length !== 2 || place.coord.some((value) => !Number.isFinite(value))) {
      throw new Error(`Invalid Hokkaido map place: ${place.id}`);
    }
    ids.add(place.id);
  }
  return places;
}
