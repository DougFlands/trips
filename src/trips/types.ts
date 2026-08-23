export type Coordinate = [longitude: number, latitude: number];

export type TripDay = {
  label: string;
  date: string;
  city: string;
  title: string;
  summary: string;
  schedule: string[];
  stay: string;
  color: string;
};

export type TripPlace = {
  id: string;
  city: string;
  name: string;
  score: number;
  note: string;
  coord: Coordinate;
  category?: string;
  markerLabel?: string;
  markerColor?: string;
};

export type TripStop = TripPlace & {
  day: number;
  order: number;
  time: string;
};

export type TripLink = {
  label: string;
  href: string;
};

export type TripMealOption = {
  name: string;
  note: string;
  link?: TripLink;
};

export type TripMeal = {
  date: string;
  slot: string;
  city: string;
  route: string;
  planA: TripMealOption;
  planB: TripMealOption;
};

export type Trip = {
  slug: string;
  code: string;
  routeBadge: string;
  kicker: string;
  title: string;
  subtitle: string;
  dateRange: string;
  fullDateRange: string;
  intro: string;
  alert?: {
    code: string;
    title: string;
    text: string;
    link: TripLink;
  };
  days: TripDay[];
  stops: TripStop[];
  alternatives: TripPlace[];
  koreanRestaurants?: TripPlace[];
  meals: TripMeal[];
  bookings: Array<{
    eyebrow: string;
    title: string;
    lines: string[];
    footer?: string;
    link?: TripLink;
  }>;
  links: TripLink[];
};
