import type { MapPlace } from "../../map/types";
import type { RecommendationCity, Recommendation } from "./trip";

export type HokkaidoMapPlace = MapPlace & {
  city: RecommendationCity;
  priority: Recommendation["priority"];
  duration: string;
  condition?: string;
};

type Coord = readonly [number, number];

// WGS84 概览点位：用于看分布，不作导航入口。
const coordinates: Record<string, Coord> = {
  // OpenStreetMap 概览点：温泉街、地狱谷入口、湖畔、展望台、索道。
  // nodes 8696193834 / 6448831956 / 8653783180 / 1468149327; way 303604338.
  "ice-festival": [141.397802, 42.778595],
  "hell-valley": [141.1479764, 42.4982434],
  "lake-toya": [140.817795, 42.563588],
  silo: [140.7996796, 42.6257851],
  usu: [140.8524111, 42.5396643],
  odori: [141.3545, 43.0588],
  shrine: [141.3147, 43.0152],
  university: [141.3418, 43.0764],
  susukino: [141.3544, 43.0552],
  nakajima: [141.3534, 43.0438],
  "red-office": [141.3472, 43.0621],
  shiroi: [141.2776, 43.0896],
  tanukikoji: [141.3508, 43.0572],
  // Mapion: https://www.mapion.co.jp/phonebook/M04101/01101/0000MYFR_001pa/
  frances: [141.30043339, 43.0588932],
  // Outdooractive 二条市場 / 53824304，WGS84。
  nijo: [141.358414, 43.058414],
  // 新千岁机场温泉 Google Maps 场所点（国内线4楼）。
  "airport-onsen": [141.6803994, 42.7880028],
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
  // MapFan 世界测地系：https://mapfan.com/spots/SC5YW,J,70
  "morning-market": [140.7252998, 41.7723692],
  "old-hall": [140.7126, 41.7673],
  omori: [140.7354, 41.7625],
  yunokawa: [140.7879, 41.7758],
  botanical: [140.7904, 41.7739],
};

const cityColors: Record<RecommendationCity, string> = {
  支笏湖: "#366e86",
  登别: "#986239",
  洞爷湖: "#47756b",
  札幌: "#a74440",
  小樽: "#365f78",
  函馆: "#6e4f72",
};

export function toHokkaidoMapPlace(city: RecommendationCity, recommendation: Recommendation, index: number): HokkaidoMapPlace {
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

export function buildHokkaidoMapPlaces(recommendations: Record<RecommendationCity, Recommendation[]>): HokkaidoMapPlace[] {
  const places = (Object.keys(recommendations) as RecommendationCity[]).flatMap((city) => recommendations[city].map((item, index) => toHokkaidoMapPlace(city, item, index)));
  const ids = new Set<string>();
  for (const place of places) {
    if (ids.has(place.id) || place.coord.length !== 2 || place.coord.some((value) => !Number.isFinite(value))) {
      throw new Error(`Invalid Hokkaido map place: ${place.id}`);
    }
    ids.add(place.id);
  }
  return places;
}
