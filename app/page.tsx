import type { Metadata } from "next";
import { TripPlanner } from "./TripPlanner";

export const metadata: Metadata = {
  title: "青烟威 · 5日山海路线",
  description:
    "2026年9月25日至29日青岛、烟台、威海旅行攻略，含地图点位、换城动线、抢票提醒与逐日安排。",
};

export default function Home() {
  return <TripPlanner />;
}
