import { TripPage } from "../trip-page";
import type { Trip } from "../types";
import "./styles.css";

/**
 * The trip renderer is shared with the existing route page. Shanwei owns its
 * data and theme, while map, filters, meals and checklist behavior stay in one
 * place.
 */
export function ShanweiTripPage({ trip }: { trip: Trip }) {
  return (
    <div className="shanwei-page">
      <TripPage trip={trip} />
    </div>
  );
}
