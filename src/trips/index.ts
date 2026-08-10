import { qingdaoYantaiWeihaiTrip } from "./qingdao-yantai-weihai/trip";

export const trips = [qingdaoYantaiWeihaiTrip];

export function findTrip(slug: string) {
  return trips.find((trip) => trip.slug === slug);
}
