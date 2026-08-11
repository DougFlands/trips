import { useState, type CSSProperties } from "react";
import { amapUrl, TravelMap } from "./TravelMap";
import type { Trip } from "./trips/types";

type DayFilter = number | "all";

export function TripPage({ trip }: { trip: Trip }) {
  const [activeDay, setActiveDay] = useState<DayFilter>("all");
  const visibleStops =
    activeDay === "all"
      ? trip.stops
      : trip.stops.filter((stop) => stop.day === activeDay);
  const activeInfo = activeDay === "all" ? undefined : trip.days[activeDay];
  const visibleAlternatives =
    activeDay === "all"
      ? trip.alternatives
      : trip.alternatives.filter((place) => place.city === activeInfo?.city);
  const cities = [...new Set(trip.days.map((day) => day.city))];
  const mapNodeCount = trip.stops.length + trip.alternatives.length;

  function showDay(day: number) {
    setActiveDay(day);
    document.querySelector("#map")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <nav className="topbar">
        <a className="brand" href="/">
          <i /> {trip.code}
        </a>
        <div>
          <a href="#map">MAP</a>
          <a href="#plan">PLAN</a>
          <a href="#book">BOOK</a>
        </div>
        <span className="status">
          <i /> ROUTE ONLINE
        </span>
      </nav>

      <header
        className="hero section-shell"
        data-route={trip.routeBadge}
        id="top"
      >
        <div className="hero-kicker">[ {trip.kicker} ]</div>
        <h1>
          {trip.title}
          <span>//</span>
          <br />
          {trip.subtitle}
        </h1>
        <p>
          {trip.dateRange} · {trip.intro}
        </p>
        <div className="hero-meta">
          <span>{String(trip.days.length).padStart(2, "0")} DAYS</span>
          <span>{String(cities.length).padStart(2, "0")} CITIES</span>
          <span>{String(mapNodeCount).padStart(2, "0")} MAP NODES</span>
        </div>
        <a className="neon-button" href="#map">
          ENTER MAP <b>↘</b>
        </a>
      </header>

      <section
        className="route-strip"
        style={{ "--day-count": trip.days.length } as CSSProperties}
      >
        {trip.days.map((day, index) => (
          <button type="button" onClick={() => showDay(index)} key={day.date}>
            <small>{day.date}</small>
            <strong>{day.city}</strong>
            <span>{day.title}</span>
          </button>
        ))}
      </section>

      {trip.alert && (
        <aside className="alert section-shell">
          <span>{trip.alert.code}</span>
          <strong>{trip.alert.title}</strong>
          <p>{trip.alert.text}</p>
          <a href={trip.alert.link.href} target="_blank" rel="noreferrer">
            {trip.alert.link.label}
          </a>
        </aside>
      )}

      <section className="section-shell map-section" id="map">
        <div className="section-head">
          <div>
            <span>01</span>
            <small>AMAP ROUTE</small>
            <h2>点位地图</h2>
          </div>
          <p>地图内支持鼠标滚轮、双击和移动端双指缩放。</p>
        </div>
        <div className="tabs" role="group" aria-label="按日期筛选地图">
          <button
            type="button"
            className={activeDay === "all" ? "active" : ""}
            aria-pressed={activeDay === "all"}
            onClick={() => setActiveDay("all")}
          >
            ALL
          </button>
          {trip.days.map((day, index) => (
            <button
              type="button"
              className={activeDay === index ? "active" : ""}
              aria-pressed={activeDay === index}
              onClick={() => setActiveDay(index)}
              key={day.date}
            >
              {day.date}
            </button>
          ))}
        </div>
        <div className="map-grid cyber-panel">
          <aside className="stop-panel">
            <header>
              <small>{activeInfo?.date ?? "FULL ROUTE"}</small>
              <h3>{activeInfo?.title ?? "完整路线"}</h3>
              <p>
                {activeInfo?.summary ??
                  "切换日期，地图会聚焦当天动线。点击箭头可在高德地图继续导航。"}
              </p>
            </header>
            <section className="point-group planned">
              <h4>
                <span>要去的</span>
                <em>{visibleStops.length}</em>
              </h4>
              <ol>
                {visibleStops.map((stop) => (
                  <li
                    key={stop.id}
                    style={
                      {
                        "--accent":
                          trip.days[stop.day]?.color ?? "var(--cyan)",
                      } as CSSProperties
                    }
                  >
                    <b>{stop.order}</b>
                    <div>
                      <small>
                        {stop.time} // {stop.city} · {stop.score.toFixed(1)}
                      </small>
                      <strong>{stop.name}</strong>
                      <p>{stop.note}</p>
                    </div>
                    <a href={amapUrl(stop)} target="_blank" rel="noreferrer">
                      ↗
                    </a>
                  </li>
                ))}
              </ol>
            </section>
            <section className="point-group optional">
              <h4>
                <span>6 分以上 · 未排入</span>
                <em>{visibleAlternatives.length}</em>
              </h4>
              <ul>
                {visibleAlternatives.map((place) => {
                  const cityDay =
                    activeDay === "all"
                      ? trip.days.find((day) => day.city === place.city)
                      : activeInfo;

                  return (
                    <li
                      key={place.id}
                      style={
                        {
                          "--accent": cityDay?.color ?? "var(--cyan)",
                        } as CSSProperties
                      }
                    >
                      <b>{place.score.toFixed(1)}</b>
                      <div>
                        <small>{place.city} // HIGH SCORE</small>
                        <strong>{place.name}</strong>
                        <p>{place.note}</p>
                      </div>
                      <a href={amapUrl(place)} target="_blank" rel="noreferrer">
                        ↗
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>
          <TravelMap
            stops={trip.stops}
            alternatives={trip.alternatives}
            days={trip.days}
            activeDay={activeDay}
            label={`高德地图：${trip.title}${trip.subtitle}旅行点位`}
          />
        </div>
      </section>

      <section className="section-shell plan-section" id="plan">
        <div className="section-head">
          <div>
            <span>02</span>
            <small>DAY BY DAY</small>
            <h2>逐日计划</h2>
          </div>
          <p>时间是节奏参考。排队过长时，保住动车和换城。</p>
        </div>
        <div className="day-grid">
          {trip.days.map((day, index) => (
            <article
              className="cyber-panel"
              key={day.date}
              style={{ "--local": day.color } as CSSProperties}
            >
              <header>
                <b>{day.label}</b>
                <small>
                  {day.date} // {day.city}
                </small>
              </header>
              <h3>{day.title}</h3>
              <p>{day.summary}</p>
              <ol>
                {day.schedule.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <footer>
                <span>{day.stay}</span>
                <button type="button" onClick={() => showDay(index)}>
                  MAP ↗
                </button>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="book-section" id="book">
        <div className="section-shell">
          <div className="section-head light">
            <div>
              <span>03</span>
              <small>MISSION QUEUE</small>
              <h2>预订清单</h2>
            </div>
            <p>只留影响成行的项目。</p>
          </div>
          <div className="book-grid">
            {trip.bookings.map((booking) => (
              <article key={booking.title}>
                <small>{booking.eyebrow}</small>
                <h3>{booking.title}</h3>
                <p>
                  {booking.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                {booking.link ? (
                  <a href={booking.link.href} target="_blank" rel="noreferrer">
                    {booking.link.label}
                  </a>
                ) : (
                  <em>{booking.footer}</em>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell city-notes">
        {trip.foods.map((food) => (
          <div key={food.city}>
            <small>{food.city}</small>
            <strong>{food.items.join(" · ")}</strong>
          </div>
        ))}
      </section>

      <footer className="footer">
        <div>
          <strong>
            {trip.title}//{trip.subtitle}
          </strong>
          <span>{trip.fullDateRange}</span>
        </div>
        <p>高德地图 JS API 2.0</p>
        <div className="footer-links">
          <a href="/">ALL TRIPS ↗</a>
          {trip.links.map((link) => (
            <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>
              {link.label}
            </a>
          ))}
          <a href="#top">TOP ↑</a>
        </div>
      </footer>
    </main>
  );
}
