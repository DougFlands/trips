import type { Metadata } from "next";
import { TripPlanner } from "./TripPlanner";

export const metadata: Metadata = {
  title: "青烟威 · 4日海岸线",
  description:
    "2026年9月26日至29日青岛、烟台、威海旅行攻略，含高德地图点位、换城动线与逐日安排。",
};

export default function Home() {
  return <TripPlanner />;
}
