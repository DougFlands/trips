import { useEffect } from "react";
import { findTrip, findTripPage, trips } from "./trips";

const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
const segments = pathname.split("/").filter(Boolean);
const trip =
  segments.length === 2 && segments[0] === "trips"
    ? findTrip(segments[1])
    : undefined;

export function App() {
  const isIndex = pathname === "/";
  const title = trip
    ? `${trip.title}${trip.subtitle ? ` · ${trip.subtitle}` : ""}`
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

  if (trip) {
    const Page = findTripPage(trip.slug);
    if (Page) return <Page trip={trip} />;
  }
  if (isIndex) return <TripIndex />;

  return (
    <main className="min-h-screen bg-[#f4f1e7] px-6 py-[12vh] text-[#15191d] sm:px-[max(24px,calc((100vw-1120px)/2))]">
      <p className="font-mono text-[11px] font-extrabold tracking-[0.2em] text-[#596052]">[ ROUTE NOT FOUND ]</p>
      <h1 className="mt-5 text-[clamp(100px,22vw,260px)] font-black leading-[0.8]">404</h1>
      <p className="text-[#596052]">这条旅行路线还没有录入。</p>
      <a className="mt-8 inline-flex items-center gap-7 bg-[#182126] px-5 py-3 font-mono text-xs font-black text-[#f2dc00] shadow-[6px_6px_0_rgb(21_25_29_/_18%)] hover:bg-[#d93047]" href="/">
        返回旅行列表 <b>↗</b>
      </a>
    </main>
  );
}

function TripIndex() {
  return (
    <main className="min-h-screen bg-[#f4f1e7] text-[#15191d]">
      <nav className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[#15191d]/20 bg-[#f4f1e7]/90 px-5 font-mono text-[11px] font-bold tracking-[0.11em] backdrop-blur-md sm:px-[max(20px,calc((100vw-1120px)/2))]">
        <a className="flex items-center gap-2" href="/">
          <i className="size-2 bg-[#15191d]" /> TRAVEL//INDEX
        </a>
        <span className="flex items-center gap-2 text-[#117b55]">
          <i className="size-1.5 rounded-full bg-[#117b55] shadow-[0_0_12px_#117b55]" /> {String(trips.length).padStart(2, "0")} GUIDE ONLINE
        </span>
      </nav>

      <header className="mx-auto min-h-[390px] w-[min(1120px,calc(100%-2.5rem))] py-24">
        <p className="font-mono text-[11px] font-extrabold tracking-[0.2em] text-[#596052]">[ MAINTAINED TRAVEL ROUTES ]</p>
        <h1 className="my-5 max-w-[900px] text-[clamp(60px,9vw,112px)] font-black leading-[0.86] tracking-[-0.07em]">
          旅行攻略<span className="text-[#d93047]">//</span>
        </h1>
        <p className="max-w-[650px] text-[17px] leading-[1.8] text-[#596052]">逐日行程、高德地图点位与临行清单。选一条路线开始。</p>
      </header>

      <section className="mx-auto w-[min(1120px,calc(100%-2.5rem))] pb-24" aria-label="旅行列表">
        {trips.map((item, index) => {
          const cities = [...new Set(item.days.map((day) => day.city))];

          return (
            <a
              className="mb-3 block min-h-[280px] border border-[#15191d]/25 bg-[#fff] p-8 shadow-[8px_8px_0_rgb(21_25_29_/_10%)] transition-transform hover:-translate-x-1 hover:-translate-y-1"
              href={`/trips/${item.slug}/`}
              key={item.slug}
            >
              <small className="font-mono text-[10px] font-extrabold text-[#d93047]">ROUTE {String(index + 1).padStart(2, "0")}</small>
              <h2 className="my-5 text-[clamp(38px,6vw,72px)] font-bold leading-[0.95]">
                {item.title}
                {item.subtitle && <span className="text-[#d93047]">//{item.subtitle}</span>}
              </h2>
              <p className="max-w-[640px] leading-[1.7] text-[#596052]">{item.intro}</p>
              <div className="my-7 flex flex-wrap gap-2">
                <span className="border border-[#15191d]/25 bg-[#f2dc00]/25 px-2 py-1.5 font-mono text-[9px]">{item.fullDateRange}</span>
                <span className="border border-[#15191d]/25 bg-[#f2dc00]/25 px-2 py-1.5 font-mono text-[9px]">{cities.join(" · ")}</span>
                <span className="border border-[#15191d]/25 bg-[#f2dc00]/25 px-2 py-1.5 font-mono text-[9px]">
                  {item.stops.length + item.alternatives.length} MAP NODES
                </span>
              </div>
              <b className="font-mono text-[11px] font-black text-[#008f9c]">OPEN ROUTE ↗</b>
            </a>
          );
        })}
      </section>

      <footer className="flex items-center justify-between gap-5 bg-[#182126] px-5 py-7 text-[#fff3a6] sm:px-[max(20px,calc((100vw-1120px)/2))]">
        <strong className="text-[#f2dc00]">TRAVEL//GUIDES</strong>
        <span className="font-mono text-[9px] font-bold text-[#c5c49e]">VITE · REACT · AMAP JS API 2.0</span>
      </footer>
    </main>
  );
}
