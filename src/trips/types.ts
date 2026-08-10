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

export type TripStop = {
  id: string;
  day: number;
  order: number;
  city: string;
  name: string;
  time: string;
  note: string;
  coord: Coordinate;
};

export type TripLink = {
  label: string;
  href: string;
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
  bookings: Array<{
    eyebrow: string;
    title: string;
    lines: string[];
    footer?: string;
    link?: TripLink;
  }>;
  foods: Array<{
    city: string;
    items: string[];
  }>;
  links: TripLink[];
};
