import { useEffect } from "react";
import { TripPage } from "./TripPage";
import { findTrip, trips } from "./trips";

const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
const segments = pathname.split("/").filter(Boolean);
const trip =
  segments.length === 2 && segments[0] === "trips"
    ? findTrip(segments[1])
    : undefined;

export function App() {
  const isIndex = pathname === "/";
  const title = trip
    ? `${trip.title} · ${trip.subtitle}`
    : isIndex
      ? "旅行攻略"
      : "页面不存在 · 旅行攻略";
  const description = trip?.intro ?? "逐日安排、高德地图点位与预订清单。";

  useEffect(() => {
    document.title = title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
  }, [description, title]);

  if (trip) return <TripPage trip={trip} />;
  if (isIndex) return <TripIndex />;

  return (
    <main className="simple-page">
      <p className="hero-kicker">[ ROUTE NOT FOUND ]</p>
      <h1>404</h1>
      <p>这条旅行路线还没有录入。</p>
      <a className="neon-button" href="/">
        返回旅行列表 <b>↗</b>
      </a>
    </main>
  );
}

function TripIndex() {
  return (
    <main>
      <nav className="topbar">
        <a className="brand" href="/">
          <i /> TRAVEL//INDEX
        </a>
        <span className="status">
          <i /> {String(trips.length).padStart(2, "0")} GUIDE ONLINE
        </span>
      </nav>

      <header className="index-hero section-shell">
        <p className="hero-kicker">[ MAINTAINED TRAVEL ROUTES ]</p>
        <h1>
          旅行攻略<span>//</span>
        </h1>
        <p>逐日行程、高德地图点位与临行清单。选一条路线开始。</p>
      </header>

      <section className="trip-list section-shell" aria-label="旅行列表">
        {trips.map((item, index) => {
          const cities = [...new Set(item.days.map((day) => day.city))];

          return (
            <a
              className="trip-card cyber-panel"
              href={`/trips/${item.slug}/`}
              key={item.slug}
            >
              <small>ROUTE {String(index + 1).padStart(2, "0")}</small>
              <h2>
                {item.title}
                <span>//{item.subtitle}</span>
              </h2>
              <p>{item.intro}</p>
              <div>
                <span>{item.fullDateRange}</span>
                <span>{cities.join(" · ")}</span>
                <span>{item.stops.length} MAP NODES</span>
              </div>
              <b>OPEN ROUTE ↗</b>
            </a>
          );
        })}
      </section>

      <footer className="footer index-footer">
        <strong>TRAVEL//GUIDES</strong>
        <span>VITE · REACT · AMAP JS API 2.0</span>
      </footer>
    </main>
  );
}
