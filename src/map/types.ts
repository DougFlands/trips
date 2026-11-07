import type { TripDay, TripPlace, TripStop } from "../trips/types";

export type DayFilter = number | "all";

export type MapPlace = Pick<TripPlace, "id" | "name" | "coord" | "note"> & {
  markerLabel?: string;
  markerColor?: string;
  meta?: string;
  url?: string;
  linkLabel?: string;
};

export type TravelMapProps = {
  focusPlaceId?: string | null;
  label: string;
  fitMaxZoom?: number;
  focusZoom?: number;
  onSelectPlace?: (id: string) => void;
  theme?: "default" | "paper";
} & ({ places: MapPlace[]; stops?: never; alternatives?: never; days?: never; activeDay?: never }
  | { places?: never; stops: TripStop[]; alternatives: TripPlace[]; days: TripDay[]; activeDay: DayFilter });
