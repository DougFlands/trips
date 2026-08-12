import { useState, type CSSProperties, type ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from "@/components/kibo-ui/announcement";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline";
import { amapUrl, TravelMap } from "@/TravelMap";
import type { Trip, TripPlace } from "@/trips/types";
import "./styles.css";

type DayFilter = number | "all";

const shell = "mx-auto w-[min(1120px,calc(100%-2.5rem))]";
const panel =
  "relative border border-[#15191d]/30 bg-[#fff3a6] shadow-[8px_8px_0_rgb(21_25_29_/_10%)] [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,16px_100%,0_calc(100%-16px))]";

function defaultDayForToday(days: Trip["days"]): DayFilter {
  const now = new Date();
  const today = `${String(now.getMonth() + 1).padStart(2, "0")}.${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  const dayIndex = days.findIndex((day) => day.date === today);
  return dayIndex >= 0 ? dayIndex : "all";
}

function stopAccent(trip: Trip, place: TripPlace) {
  return (
    trip.days.find((day) => day.city === place.city)?.color ?? "#008f9c"
  );
}

export function QingdaoTripPage({ trip }: { trip: Trip }) {
  const [activeDay, setActiveDay] = useState<DayFilter>(() =>
    defaultDayForToday(trip.days),
  );
  const [focusedPlaceId, setFocusedPlaceId] = useState<string | null>(null);
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
  const timelineStep = activeDay === "all" ? trip.days.length : activeDay + 1;
  const mealsByDay = trip.days.map((day) => ({
    day,
    meals: trip.meals.filter((meal) => meal.date === day.date),
  }));

  function showDay(day: number) {
    setActiveDay(day);
    document.querySelector("#map")?.scrollIntoView({ behavior: "smooth" });
  }

  function scrollPage(direction: -1 | 1) {
    window.scrollBy({
      top: direction * Math.round(window.innerHeight * 0.5),
      behavior: "smooth",
    });
  }

  function focusPlace(place: TripPlace) {
    setFocusedPlaceId(place.id);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f2dc00] text-[#15191d] [background-image:linear-gradient(rgb(21_25_29_/_5%)_1px,transparent_1px),linear-gradient(90deg,rgb(21_25_29_/_5%)_1px,transparent_1px)] [background-size:32px_32px]">
      <nav className="sticky top-0 z-[1000] flex h-14 items-center justify-between border-b border-[#15191d]/30 bg-[#f2dc00]/90 px-5 font-mono text-[11px] font-bold tracking-[0.11em] backdrop-blur-md sm:px-[max(20px,calc((100vw-1120px)/2))]">
        <a className="flex items-center gap-2" href="/">
          <i className="size-2 bg-[#15191d] shadow-[0_0_0_2px_rgb(21_25_29_/_16%)]" />
          {trip.code}
        </a>
        <div className="hidden gap-7 text-[#596052] md:flex">
          {[
            ["MAP", "#map"],
            ["PLAN", "#plan"],
            ["MEAL", "#meal"],
            ["BOOK", "#book"],
          ].map(([label, href]) => (
            <a className="hover:text-[#008f9c]" href={href} key={href}>
              {label}
            </a>
          ))}
        </div>
        <Badge className="gap-2 border-0 bg-transparent font-mono text-[10px] tracking-[0.1em] text-[#117b55]">
          <i className="size-1.5 rounded-full bg-[#117b55] shadow-[0_0_12px_#117b55]" />
          ROUTE ONLINE
        </Badge>
      </nav>

      <div
        className="fixed right-3 top-1/2 z-[900] grid -translate-y-1/2 gap-1.5 sm:right-[18px]"
        aria-label="页面滚动控制"
      >
        <Button
          className="size-[34px] rounded-none border-[#f2dc00]/70 bg-[#182126] p-0 font-mono text-base text-[#f2dc00] shadow-[3px_3px_0_rgb(21_25_29_/_18%)] hover:bg-[#d93047] hover:text-[#fff3a6]"
          variant="outline"
          size="icon"
          type="button"
          aria-label="向上滚动半页"
          onClick={() => scrollPage(-1)}
        >
          ↑
        </Button>
        <Button
          className="size-[34px] rounded-none border-[#f2dc00]/70 bg-[#182126] p-0 font-mono text-base text-[#f2dc00] shadow-[3px_3px_0_rgb(21_25_29_/_18%)] hover:bg-[#d93047] hover:text-[#fff3a6]"
          variant="outline"
          size="icon"
          type="button"
          aria-label="向下滚动半页"
          onClick={() => scrollPage(1)}
        >
          ↓
        </Button>
      </div>

      <header
        className={`${shell} relative min-h-[470px] py-20 sm:py-[90px]`}
        id="top"
      >
        <div className="font-mono text-[11px] font-extrabold tracking-[0.2em] text-[#274e53]">
          [ {trip.kicker} ]
        </div>
        <h1 className="relative my-5 max-w-[950px] text-[clamp(60px,9vw,112px)] font-black leading-[0.86] tracking-[-0.07em]">
          {trip.title}
          {trip.subtitle && (
            <>
              <span className="text-[#d93047] drop-shadow-[4px_3px_0_rgb(255_255_255_/_42%)]">
                //
              </span>
              <br />
              {trip.subtitle}
            </>
          )}
        </h1>
        <p className="max-w-[650px] text-[17px] leading-[1.8] text-[#42483f]">
          {trip.dateRange} · {trip.intro}
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          <Badge className="rounded-none border-[#15191d]/30 bg-[#fff8b5]/45 font-mono text-[10px] tracking-[0.08em] text-[#15191d]">
            {String(trip.days.length).padStart(2, "0")} DAYS
          </Badge>
          <Badge className="rounded-none border-[#15191d]/30 bg-[#fff8b5]/45 font-mono text-[10px] tracking-[0.08em] text-[#15191d]">
            {String(cities.length).padStart(2, "0")} CITIES
          </Badge>
          <Badge className="rounded-none border-[#15191d]/30 bg-[#fff8b5]/45 font-mono text-[10px] tracking-[0.08em] text-[#15191d]">
            {String(mapNodeCount).padStart(2, "0")} MAP NODES
          </Badge>
        </div>
        <Button
          asChild
          className="mt-8 gap-7 rounded-none bg-[#182126] px-5 py-3 font-mono text-xs font-black text-[#f2dc00] shadow-[6px_6px_0_rgb(21_25_29_/_18%)] hover:bg-[#d93047] hover:text-[#fff4a3]"
        >
          <a href="#map">
            ENTER MAP <b>↘</b>
          </a>
        </Button>
      </header>

      <section className="qingdao-horizontal-scroll overflow-x-auto overflow-y-hidden border-y border-[#15191d]/30 bg-[#e6cf00] px-5 py-5 sm:px-[max(20px,calc((100vw-1120px)/2))]">
        <Timeline
          orientation="horizontal"
          defaultValue={timelineStep}
          value={timelineStep}
          className="min-w-[760px]"
        >
          {trip.days.map((day, index) => (
            <TimelineItem
              key={day.date}
              step={index + 1}
              className="mt-8 min-w-[150px] pe-5"
              style={{ "--day-color": day.color } as CSSProperties}
            >
              <TimelineHeader>
                <TimelineSeparator className="bg-[#15191d]/25 group-data-completed/timeline-item:bg-[var(--day-color)]" />
                <TimelineDate className="font-mono text-[10px] uppercase text-[#596052]">
                  {day.date}
                </TimelineDate>
                <TimelineTitle className="text-base font-bold text-[#15191d]">
                  <button
                    className="text-left hover:text-[#008f9c]"
                    type="button"
                    onClick={() => showDay(index)}
                  >
                    {day.city}
                  </button>
                </TimelineTitle>
                <TimelineIndicator className="border-2 border-[var(--day-color)] bg-[#fff3a6] group-data-completed/timeline-item:bg-[var(--day-color)]" />
              </TimelineHeader>
              <TimelineContent className="pt-1 text-xs text-[#596052]">
                {day.title}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </section>

      {trip.alert && (
        <Alert
          className={`${shell} mt-8 grid gap-3 rounded-none border-[#d93047]/50 bg-[#fff3a6]/75 px-5 py-4 shadow-[5px_5px_0_rgb(217_48_71_/_12%)] sm:grid-cols-[auto_1fr_auto] sm:items-center`}
        >
          <span className="font-mono text-[10px] font-extrabold text-[#d93047]">
            {trip.alert.code}
          </span>
          <div>
            <AlertTitle className="text-[#d93047]">{trip.alert.title}</AlertTitle>
            <AlertDescription className="mt-1 text-[#4c5148]">
              {trip.alert.text}
            </AlertDescription>
          </div>
          <Announcement
            themed
            className="justify-self-start border-[#d93047]/50 bg-[#fff8b5] text-[#d93047] sm:justify-self-end"
          >
            <AnnouncementTag>CHECK</AnnouncementTag>
            <AnnouncementTitle>
              <a href={trip.alert.link.href} target="_blank" rel="noreferrer">
                {trip.alert.link.label} ↗
              </a>
            </AnnouncementTitle>
          </Announcement>
        </Alert>
      )}

      <section className={`${shell} pt-20 sm:pt-[90px]`} id="map">
        <SectionHeading number="01" eyebrow="AMAP ROUTE" title="点位地图">
          地图支持拖动、双击和移动端双指缩放；页面滚动不再嵌套。
        </SectionHeading>
        <Tabs
          className="mb-3"
          value={activeDay === "all" ? "all" : String(activeDay)}
          onValueChange={(value) =>
            setActiveDay(value === "all" ? "all" : Number(value))
          }
        >
          <TabsList
            variant="default"
            className="qingdao-horizontal-scroll flex h-auto max-w-full gap-2 overflow-x-auto overflow-y-hidden rounded-none !bg-transparent !p-0"
          >
            <TabsTrigger
              className="rounded-none border border-[#f2dc00]/35 !bg-[#15191d] px-3 py-2 font-mono text-[10px] !text-white data-[state=active]:!bg-[#15191d] data-[state=active]:!text-[#f2dc00] data-[state=active]:after:bg-[#f2dc00]"
              value="all"
              aria-pressed={activeDay === "all"}
            >
              ALL
            </TabsTrigger>
            {trip.days.map((day, index) => (
              <TabsTrigger
                className="rounded-none border border-[#f2dc00]/35 !bg-[#15191d] px-3 py-2 font-mono text-[10px] !text-white data-[state=active]:!bg-[#15191d] data-[state=active]:!text-[#f2dc00] data-[state=active]:after:bg-[#f2dc00]"
                value={String(index)}
                key={day.date}
                aria-pressed={activeDay === index}
              >
                {day.date}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className={`${panel} flex min-h-[680px] flex-col-reverse items-stretch md:grid md:grid-cols-[390px_1fr] md:items-start`}>
          <ScrollArea className="h-[520px] border-b border-[#15191d]/30 md:h-[680px] md:border-b-0 md:border-r">
            <div>
              <PointGroup
                title="要去的"
                count={visibleStops.length}
                dark
              >
                <ol>
                  {visibleStops.map((stop) => (
                    <PlaceRow
                      key={stop.id}
                      place={stop}
                      accent={trip.days[stop.day]?.color ?? "#008f9c"}
                      meta={`${stop.time} // ${stop.city} · ${stop.score.toFixed(1)}`}
                      score={String(stop.order)}
                      onFocus={() => focusPlace(stop)}
                    />
                  ))}
                </ol>
              </PointGroup>
              <PointGroup
                title="6 分以上 · 未排入"
                count={visibleAlternatives.length}
              >
                <ul>
                  {visibleAlternatives.map((place) => (
                    <PlaceRow
                      key={place.id}
                      place={place}
                      accent={
                        activeDay === "all"
                          ? stopAccent(trip, place)
                          : activeInfo?.color ?? "#008f9c"
                      }
                      meta={`${place.city} // HIGH SCORE`}
                      score={place.score.toFixed(1)}
                      alternative
                      onFocus={() => focusPlace(place)}
                    />
                  ))}
                </ul>
              </PointGroup>
            </div>
          </ScrollArea>
          <TravelMap
            stops={trip.stops}
            alternatives={trip.alternatives}
            days={trip.days}
            activeDay={activeDay}
            focusPlaceId={focusedPlaceId}
            label={`高德地图：${trip.title}${trip.subtitle}旅行点位`}
          />
        </div>
      </section>

      <section className={`${shell} pt-20 sm:pt-[90px]`} id="plan">
        <SectionHeading number="02" eyebrow="DAY BY DAY" title="逐日计划">
          时间是节奏参考。排队过长时，保住动车和换城。
        </SectionHeading>
        <div className="grid gap-3 md:grid-cols-2">
          {trip.days.map((day, index) => (
            <Card
              className={`${panel} gap-5 rounded-none border-0 p-6`}
              key={day.date}
              style={{ "--day-color": day.color } as CSSProperties}
            >
              <CardHeader className="p-0">
                <div className="flex items-center justify-between gap-3">
                  <Badge className="rounded-none border-0 bg-transparent p-0 font-mono text-lg font-black text-[var(--day-color)]">
                    {day.label}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-[#596052]">
                    {day.date} // {day.city}
                  </span>
                </div>
                <CardTitle className="mt-4 text-2xl">{day.title}</CardTitle>
                <CardDescription className="text-[#596052]">
                  {day.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ol className="min-h-0 list-decimal space-y-1 pl-5 text-[13px] leading-7 text-[#414a44] marker:text-[var(--day-color)]">
                  {day.schedule.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </CardContent>
              <CardFooter className="mt-auto justify-between border-t border-[#15191d]/30 p-0 pt-3">
                <span className="text-[11px] text-[#596052]">{day.stay}</span>
                <Button
                  className="h-auto bg-transparent p-0 font-mono text-[10px] font-black text-[var(--day-color)] hover:bg-transparent hover:text-[#d93047]"
                  variant="ghost"
                  type="button"
                  onClick={() => showDay(index)}
                >
                  MAP ↗
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className={`${shell} pt-20 sm:pt-[90px]`} id="meal">
        <SectionHeading number="03" eyebrow="MEAL PLAN" title="吃饭计划">
          按路线排主选；排队、关店或赶车就切换 Plan B。
        </SectionHeading>
        <div className="grid gap-3 md:grid-cols-2">
          {mealsByDay.map(({ day, meals }) => (
            <Card
              className="gap-5 rounded-none border-[#15191d]/30 bg-[#fff3a6] p-6 shadow-[6px_6px_0_rgb(21_25_29_/_10%)]"
              key={day.date}
              style={{ "--day-color": day.color } as CSSProperties}
            >
              <CardHeader className="p-0">
                <div className="flex items-center justify-between gap-3">
                  <Badge className="rounded-none border-0 bg-transparent p-0 font-mono text-lg font-black text-[var(--day-color)]">
                    {day.label}
                  </Badge>
                  <span className="text-right font-mono text-xs font-bold text-[#596052]">
                    {day.date} // {day.city}
                  </span>
                </div>
                <CardTitle className="mt-3 text-xl">{day.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-0">
                {meals.map((meal, index) => (
                  <div className="flex flex-col gap-3" key={`${meal.date}-${meal.slot}`}>
                    {index > 0 && <Separator className="bg-[#15191d]/20" />}
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <Badge className="rounded-none border-0 bg-transparent p-0 font-mono text-xs font-black text-[#d93047]">
                          {meal.slot}
                        </Badge>
                        <span className="font-mono text-xs font-bold text-[#596052]">{meal.city}</span>
                      </div>
                      <p className="mt-1 mb-0 text-sm font-bold text-[#414a44]">{meal.route}</p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <MealOption label="PLAN A" option={meal.planA} primary />
                      <MealOption label="PLAN B" option={meal.planB} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-20 border-y border-[#15191d]/30 bg-[#e7cf00] py-16" id="book">
        <div className={shell}>
          <SectionHeading number="04" eyebrow="MISSION QUEUE" title="预订清单" light>
            只留影响成行的项目。
          </SectionHeading>
          <div className="grid gap-3 md:grid-cols-3">
            {trip.bookings.map((booking) => (
              <Card className="gap-3 rounded-none border-[#15191d]/30 bg-[#fff3a6] p-6 shadow-[6px_6px_0_rgb(21_25_29_/_10%)]" key={booking.title}>
                <CardHeader className="p-0">
                  <span className="font-mono text-[9px] font-extrabold text-[#d93047]">
                    {booking.eyebrow}
                  </span>
                  <CardTitle className="mt-2 text-[22px]">{booking.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-[13px] leading-7 text-[#51574f]">
                  {booking.lines.map((line) => (
                    <span className="block" key={line}>{line}</span>
                  ))}
                </CardContent>
                <CardFooter className="p-0">
                  {booking.link ? (
                    <a className="font-mono text-[10px] font-extrabold text-[#006d78]" href={booking.link.href} target="_blank" rel="noreferrer">
                      {booking.link.label}
                    </a>
                  ) : (
                    <em className="font-mono text-[10px] not-italic text-[#006d78]">{booking.footer}</em>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="grid items-center gap-5 border-t border-[#182126] bg-[#182126] px-5 py-7 text-[#fff3a6] sm:grid-cols-[1fr_auto_1fr] sm:px-[max(20px,calc((100vw-1120px)/2))]">
        <div className="flex flex-col items-center gap-1 text-center sm:col-start-2">
          <strong className="text-[#f2dc00]">{trip.title}{trip.subtitle && `//${trip.subtitle}`}</strong>
          <span className="font-mono text-[9px] font-bold text-[#c5c49e]">{trip.fullDateRange}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 font-mono text-[9px] font-extrabold text-[#ff6575] sm:col-start-3 sm:justify-self-end">
          <a href="/">ALL TRIPS ↗</a>
          {trip.links.map((link) => (
            <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label}</a>
          ))}
          <a href="#top">TOP ↑</a>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading({
  number,
  eyebrow,
  title,
  light = false,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  light?: boolean;
  children: string;
}) {
  return (
    <div className="mb-7">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div className="grid grid-cols-[auto_1fr] items-end gap-x-3">
          <span className={`row-span-2 grid size-12 place-items-center border font-mono text-[13px] font-black ${light ? "border-[#d93047] text-[#d93047]" : "border-[#008f9c] text-[#008f9c] shadow-[4px_4px_0_rgb(0_143_156_/_13%)]"}`}>
            {number}
          </span>
          <small className={`font-mono text-[9px] font-extrabold tracking-[0.16em] ${light ? "text-[#d93047]" : "text-[#008f9c]"}`}>{eyebrow}</small>
          <h2 className="m-0 text-[30px] font-bold leading-none sm:text-[35px]">{title}</h2>
        </div>
        <p className={`m-0 max-w-[430px] text-[13px] leading-[1.6] ${light ? "text-[#51574f]" : "text-[#596052]"}`}>{children}</p>
      </div>
      <Separator className="mt-5 bg-[#15191d]/20 sm:hidden" />
    </div>
  );
}

function PointGroup({
  title,
  count,
  dark = false,
  children,
}: {
  title: string;
  count: number;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="border-b-[3px] border-[#15191d] last:border-b-0">
      <h3 className={`sticky top-0 z-10 m-0 flex items-center justify-between px-5 py-3 font-mono text-[10px] font-extrabold tracking-[0.1em] ${dark ? "bg-[#182126] text-[#fff7ad]" : "bg-[#e6cf00] text-[#15191d]"}`}>
        <span>{title}</span>
        <em className={`not-italic ${dark ? "text-[#f2dc00]" : "text-[#d93047]"}`}>{count}</em>
      </h3>
      {children}
    </section>
  );
}

function PlaceRow({
  place,
  accent,
  meta,
  score,
  alternative = false,
  onFocus,
}: {
  place: TripPlace;
  accent: string;
  meta: string;
  score: string;
  alternative?: boolean;
  onFocus: () => void;
}) {
  return (
    <li
      className={`grid cursor-pointer grid-cols-[28px_1fr_auto] gap-3 border-b border-[#15191d]/10 px-5 py-3.5 hover:bg-[#fff8b5]/70 focus-visible:outline-3 focus-visible:outline-[#d93047] focus-visible:-outline-offset-3 ${alternative ? "grid-cols-[40px_1fr_auto] bg-[#fff8b5]/25" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`在地图上查看${place.name}`}
      onClick={onFocus}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onFocus();
        }
      }}
      style={{ "--accent": accent } as CSSProperties}
    >
      <b className={`grid h-[26px] place-items-center font-mono text-[10px] font-black ${alternative ? "w-[38px] rounded-full border border-[var(--accent)] bg-transparent text-[var(--accent)]" : "w-[26px] bg-[var(--accent)] text-[#020509] shadow-[0_0_14px_color-mix(in_srgb,var(--accent)_40%,transparent)]"}`}>
        {score}
      </b>
      <div className="min-w-0">
        <small className="font-mono text-[9px] font-bold text-[var(--accent)]">{meta}</small>
        <strong className="mt-1 block text-sm">{place.name}</strong>
        <p className="mt-1.5 mb-0 text-[11px] leading-[1.45] text-[#596052]">{place.note}</p>
      </div>
      <a className="font-black text-[var(--accent)]" href={amapUrl(place)} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>↗</a>
    </li>
  );
}

function MealOption({
  label,
  option,
  primary,
}: {
  label: string;
  option: Trip["meals"][number]["planA"];
  primary?: boolean;
}) {
  return (
    <div className={`border bg-[#fff8b5]/40 px-4 py-3 ${primary ? "border-[#008f9c]" : "border-[#d93047]"}`}>
      <small className={`block font-mono text-[9px] font-extrabold tracking-[0.1em] ${primary ? "text-[#008f9c]" : "text-[#d93047]"}`}>{label}</small>
      <strong className="my-1 block text-[15px]">{option.name}</strong>
      <p className="m-0 mb-2 text-[11px] leading-[1.5] text-[#596052]">{option.note}</p>
      {option.link && <a className="font-mono text-[10px] font-extrabold text-[#006d78]" href={option.link.href} target="_blank" rel="noreferrer">{option.link.label}</a>}
    </div>
  );
}
