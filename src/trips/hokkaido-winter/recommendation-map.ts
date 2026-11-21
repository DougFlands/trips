import type { MapPlace } from "../../map/types";
import type { RecommendationCity, Recommendation } from "./trip";

export type HokkaidoMapPlace = MapPlace & {
  city: RecommendationCity;
  priority: Recommendation["priority"];
  duration: string;
  condition?: string;
};

type Coord = readonly [number, number];

// WGS84 位置参考。2026-11-21 核验见 research/hokkaido-route-audit-2026-11-21/findings.json。
// M01–M22 对应公开来源；山岳取索道山麓站，园区/街道仍为参考点，导航需核对入口。
const coordinates: Record<string, Coord> = {
  // OpenStreetMap 概览点：温泉街、地狱谷入口、湖畔、展望台。
  // nodes 8696193834 / 6448831956 / 8653783180 / 1468149327.
  "ice-festival": [141.397802, 42.778595],
  "hell-valley": [141.1479764, 42.4982434],
  "lake-toya": [140.817795, 42.563588],
  silo: [140.7996796, 42.6257851],
  usu: [140.8604592, 42.5390478],
  odori: [141.3535386, 43.0607249],
  shrine: [141.3081104, 43.0546731],
  university: [141.34763275, 43.0711003],
  susukino: [141.3544, 43.0552],
  nakajima: [141.3534, 43.0438],
  "red-office": [141.348, 43.063944],
  shiroi: [141.2716802, 43.0886903],
  tanukikoji: [141.3508, 43.0572],
  // Mapion: https://www.mapion.co.jp/phonebook/M04101/01101/0000MYFR_001pa/
  frances: [141.30043339, 43.0588932],
  // Outdooractive 二条市場 / 53824304，WGS84。
  nijo: [141.358414, 43.058414],
  // 新千岁机场温泉 Google Maps 场所点（国内线4楼）。
  "airport-onsen": [141.6803994, 42.7880028],
  moiwa: [141.3330332, 43.0316675],
  t38: [141.35194, 43.06861], // M23：JR塔
  "hill-buddha": [141.36275, 42.92056], // M24：头大佛，非陵园中心
  showa: [140.8599401, 42.5400541], // M25：山麓案内图附近
  tower: [141.35640632, 43.0611339],
  clock: [141.3536, 43.0627],
  remote: [141.3253697, 43.0349657],
  canal: [141.0032805, 43.1978359],
  tengu: [140.9751704, 43.1779003],
  sakaimachi: [141.0068845, 43.1911434], // M26：堺町南段参考
  "music-box": [141.007792, 43.1905785],
  glass: [141.0073169, 43.1923093],
  funami: [140.9936244, 43.1992394],
  temiya: [140.9979526, 43.2018271], // M27：旧手宫线市区段
  aquarium: [141.01125, 43.236806],
  shukutsu: [141.0094945, 43.2381569],
  // 朝里站：OpenStreetMap node 8082693157（N33）。
  asari: [141.0636887, 43.1769076],
  "hakodate-mountain": [140.714177, 41.7609207],
  goryokaku: [140.754, 41.794694],
  motomachi: [140.7117728, 41.7637939],
  kanemori: [140.7164492, 41.7661843],
  // MapFan 世界测地系：https://mapfan.com/spots/SC5YW,J,70
  "morning-market": [140.7252998, 41.7723692],
  "old-hall": [140.70889, 41.765028],
  omori: [140.7354, 41.7625],
  yunokawa: [140.7879, 41.7758],
  botanical: [140.78936388, 41.77421685],
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
