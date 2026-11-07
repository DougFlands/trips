import { qingdaoYantaiWeihaiTrip } from "./qingdao-yantai-weihai/trip";
import { QingdaoTripPage } from "./qingdao-yantai-weihai/page";
import { shanweiTwoDayTrip } from "./shanwei-two-day-trip/trip";
import { ShanweiTripPage } from "./shanwei-two-day-trip/page";
import type { ComponentType } from "react";
import type { Trip } from "./types";
import { hokkaidoWinterTrip } from "./hokkaido-winter/trip";
import { HokkaidoWinterPage } from "./hokkaido-winter/page";

export const trips = [hokkaidoWinterTrip, shanweiTwoDayTrip, qingdaoYantaiWeihaiTrip];

const tripPages: Record<string, ComponentType<{ trip: Trip }>> = {
  [hokkaidoWinterTrip.slug]: HokkaidoWinterPage,
  [qingdaoYantaiWeihaiTrip.slug]: QingdaoTripPage,
  [shanweiTwoDayTrip.slug]: ShanweiTripPage,
};

export function findTrip(slug: string) {
  return trips.find((trip) => trip.slug === slug);
}

export function findTripPage(slug: string) {
  return tripPages[slug];
}
