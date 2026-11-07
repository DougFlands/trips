import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, CalendarDays, CloudSnow, Footprints, MountainSnow, Snowflake, TrainFront } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpenFreeMap } from "../../OpenFreeMap";
import type { Trip } from "../types";
import { buildHokkaidoMapPlaces, type HokkaidoMapPlace } from "./recommendation-map";
import { cityNames, dayPlans, nights, recommendations, type City } from "./trip";
import { sourceGroups, sources } from "./sources";
import "./styles.css";

const reminders = [
  { icon: CalendarDays, title: "两场雪节，日期别记错", text: "札幌雪祭2/4–11；小樽雪灯2/6–13。2/5没有正式雪灯，2/6点灯时间待公告。", sources: ["O1", "O2"] },
  { icon: TrainFront, title: "函馆转场，留半天", text: "北斗号约4小时，全车指定席；终点选“函館”。先订座，雪天出发前查停运。", sources: ["O7", "O9", "O10"] },
  { icon: MountainSnow, title: "索道停运，就取消登山", text: "函馆山冬季道路封闭，不能改打车上山。天狗山先看能见度，再买索道票。", sources: ["O3", "O4", "O5"] },
  { icon: CloudSnow, title: "2/7留在札幌", text: "返程前一天回札幌，不补远处景点。酒店尽量近站，雪天候车和步行多留余量。", sources: ["O10"] },
  { icon: Footprints, title: "坡道慢走，随时取暖", text: "穿防滑防水鞋；结冰就缩短坡道路线。室外与室内交替，累了删可选点。", sources: ["T02", "T13", "K09"] },
  { icon: Snowflake, title: "白天短，不追满场", text: "札幌2/4日落16:50。白天留给雪景，晚饭后回酒店；函馆、小樽日落另看当地信息。", sources: ["O14"] },
];

const routeQa = [
  {
    question: "为什么函馆结束后先回札幌？",
    answer: "2/3是长途转场缓冲，2/4正好接札幌雪祭。函馆到小樽通常要经札幌转车，直接去小樽会把换乘、寄存和入住叠在一起。",
    sources: ["O1", "O7", "O10"],
  },
  {
    question: "能不能函馆后先去小樽，再去札幌？",
    answer: "可以，但要接受更长的转场和第二天一早回札幌。若要看2/6小樽雪灯，住小樽两晚、2/7再回札幌会更稳。",
    sources: ["O1", "O2", "O10"],
  },
  {
    question: "这条路线是不是绕路？",
    answer: "地图上像回头，铁路衔接上札幌本来就是函馆与小樽之间的中转节点。先在札幌休息一晚，再去小樽，少一次长途日换酒店。",
    sources: ["O7", "O10"],
  },
  {
    question: "什么情况下值得改成函馆→小樽→札幌？",
    answer: "不参加札幌雪祭或小樽雪灯，或已经订好小樽住宿时可以改。只保留小樽运河、堺町等市区内容，天狗山按天气和转场余量取舍。",
    sources: ["O1", "O2", "T04"],
  },
];

function WinterPostcard() {
  return (
    <div className="winter-art" aria-hidden="true">
      <div className="postmark"><span>HOKKAIDO</span><b>2027</b><span>WINTER · JAPAN</span></div>
      <svg viewBox="0 0 520 300" fill="none" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <circle cx="113" cy="78" r="32" fill="var(--primary)" opacity=".8" />
        <g stroke="var(--foreground)" strokeWidth="1" opacity=".2">
          <path d="M0 72H70M0 83H61M0 94H70M386 180h134M400 190h120M414 200h106" />
        </g>
        <path d="M0 230 129 121 190 179 294 65 520 234v66H0Z" fill="var(--background)" />
        <path d="m129 121 61 58 104-114 226 169" stroke="var(--foreground)" strokeWidth="2" />
        <path d="m255 111 39-46 65 73-44-13-25 12-14-28Z" fill="var(--foreground)" opacity=".13" />
        <path d="M0 253q116-50 254-5t266-6" stroke="var(--foreground)" strokeWidth="1.5" />
        <path d="M0 272q116-40 254-5t266-6" stroke="var(--foreground)" opacity=".22" />
        <g fill="var(--foreground)">
          <path d="m63 234 17-15 17 15v22H63Zm45 6 14-12 14 12v16h-28Zm42-18 19-18 19 18v34h-38Zm47 17 13-13 13 13v17h-26Z" />
          <path d="M158 204v-17h4v17Zm-5-11h14v3h-14Z" />
        </g>
        <g fill="var(--background)"><path d="M76 236h8v10h-8Zm89-12h8v10h-8Zm-9 17h7v8h-7Zm19 0h7v8h-7Z" /></g>
        <g stroke="var(--foreground)" strokeWidth="1.5"><path d="M357 228v26m-13-9 13-20 13 20m-10-2 10-15 10 15m-10-15v26M410 222v33m-16-9 16-25 16 25" /></g>
        <g fill="var(--background)"><circle cx="205" cy="56" r="2" /><circle cx="389" cy="77" r="2" /><circle cx="69" cy="160" r="2" /><circle cx="447" cy="132" r="2" /></g>
      </svg>
      <span className="absolute bottom-4 right-5 font-mono text-[10px] tracking-[.2em]">43°N · 北海道</span>
    </div>
  );
}

export function HokkaidoWinterPage({ trip }: { trip: Trip }) {
  const [openSources, setOpenSources] = useState<string[]>([]);
  const [pendingSource, setPendingSource] = useState<string | null>(null);
  const [activeRecommendationCity, setActiveRecommendationCity] = useState<"all" | City>("all");
  const [focusedRecommendationId, setFocusedRecommendationId] = useState<string | null>(null);
  const recommendationListRef = useRef<HTMLDivElement>(null);
  const mapPlaces = useMemo(() => buildHokkaidoMapPlaces(recommendations), []);
  const visibleMapPlaces = useMemo(() => activeRecommendationCity === "all"
    ? mapPlaces
    : mapPlaces.filter((place) => place.city === activeRecommendationCity), [activeRecommendationCity, mapPlaces]);

  useEffect(() => {
    if (!pendingSource) return;
    const target = document.getElementById(`source-${pendingSource}`);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "center", behavior: "instant" });
    setPendingSource(null);
  }, [pendingSource, openSources]);

  useEffect(() => {
    if (!focusedRecommendationId) return;
    const container = recommendationListRef.current;
    const item = container?.querySelector<HTMLElement>(`[data-recommendation-id="${focusedRecommendationId}"]`);
    if (!container || !item) return;
    const top = item.offsetTop - (container.clientHeight - item.offsetHeight) / 2;
    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    container.scrollTo({ top: Math.max(0, top), behavior });
  }, [focusedRecommendationId, activeRecommendationCity]);

  function focusRecommendation(place: HokkaidoMapPlace) {
    setFocusedRecommendationId(place.id);
  }

  function selectFromMap(id: string) {
    const place = mapPlaces.find((item) => item.id === id);
    if (!place) return;
    setActiveRecommendationCity(place.city);
    setFocusedRecommendationId(id);
  }

  function scrollPage(direction: -1 | 1) {
    window.scrollBy({ top: direction * Math.round(window.innerHeight * 0.5), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function sourceRefs(ids: string[]) {
    return ids.map((id) => {
      const source = sources.find((item) => item.sourceId === id);
      if (!source) return null;
      return <a key={id} href={`#source-${id}`} className="source-ref" aria-label={`查看来源 ${id}：${source.title}`} onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenSources((current) => current.includes(source.group) ? current : [...current, source.group]);
        setPendingSource(id);
      }}>{id}</a>;
    });
  }

  return (
    <div className="hokkaido-page min-h-screen bg-background text-foreground">
      <a href="#itinerary" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:bg-background focus:p-3">跳到每日行程</a>
      <nav aria-label="页面导航" className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-2 text-sm"><ArrowLeft className="size-4" aria-hidden="true" /><span>旅行列表</span></a>
          <div className="flex gap-5 text-sm sm:gap-8"><a href="#itinerary">行程</a><a href="#places">推荐</a><a href="#reminders">提醒</a><a href="#qa">QA</a></div>
        </div>
      </nav>
      <div className="hokkaido-page-scroll-controls" aria-label="页面滚动">
        <button type="button" aria-label="向上滚动半页" onClick={() => scrollPage(-1)}>↑</button>
        <button type="button" aria-label="向下滚动半页" onClick={() => scrollPage(1)}>↓</button>
      </div>

      <main id="top" className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <header className="postcard-cover">
          <div className="grid md:grid-cols-[1.15fr_1fr]">
            <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10">
              <p className="mb-5 flex items-center gap-3 font-mono text-xs tracking-[.16em] text-primary"><span className="h-px w-8 bg-primary" />HOKKAIDO / WINTER 2027</p>
              <h1 className="text-[clamp(2.3rem,5vw,3.6rem)] font-semibold leading-[1.2] tracking-tight">北海道<br /><span className="font-serif text-primary">冬季慢游</span></h1>
              <p className="mt-5 font-mono text-sm tracking-wider">{trip.fullDateRange}</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">10点起 · 11点出门 · 晚饭后回酒店</p>
            </div>
            <WinterPostcard />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-dashed border-border px-6 py-5 sm:px-10">
            <div className="flex flex-wrap gap-x-5 gap-y-2">{nights.map(({ city, count }) => <span key={city} className="text-sm">{city} <b className="ml-1 font-mono text-xl text-primary">{count}</b> 晚</span>)}</div>
            <p className="text-xs text-muted-foreground">1/30–2/7共9晚 · 1/29抵达则另加一晚</p>
          </div>
        </header>

        <div className="my-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:my-10 sm:gap-x-5 sm:text-sm" aria-label="城市路线">
          <span>札幌</span><span aria-hidden="true" className="text-primary">→</span><span>函馆 <small className="text-muted-foreground">3晚</small></span><span aria-hidden="true" className="text-primary">→</span><span>札幌</span><span aria-hidden="true" className="text-primary">→</span><span>小樽 <small className="text-muted-foreground">2晚</small></span><span aria-hidden="true" className="text-primary">→</span><span>札幌</span>
        </div>

        <section id="itinerary" aria-labelledby="itinerary-heading">
          <SectionHeading number="01" title="每天怎么走" id="itinerary-heading" description="日本当地时间 · 每天最多两处重点 · 晚饭后回酒店" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {dayPlans.map((day, index) => (
              <article key={day.date} id={`day-${day.date}`} className={index === dayPlans.length - 1 ? "md:col-span-2" : undefined}>
                <Card className="h-full gap-4">
                  <CardHeader>
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                      <p className="font-mono text-sm text-primary"><time dateTime={`2027-${day.date}`}>{day.date.replace("-", ".")}</time><span className="ml-2 text-xs text-muted-foreground">{day.weekday}</span></p>
                      <Badge variant="outline">{day.city} · {day.pace}</Badge>
                    </div>
                    <CardTitle><h3>{day.title}</h3></CardTitle>
                    <CardDescription>{day.stay ? `住${day.stay}` : "住宿按实际航班"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="flex flex-col gap-3">
                      {day.slots.map((slot) => <li key={slot.time} className="grid grid-cols-[5.2rem_1fr] items-start gap-3 text-sm leading-6 sm:grid-cols-[6.7rem_1fr]">
                        <span className="pt-0.5 font-mono text-xs text-muted-foreground">{slot.time}</span>
                        <span>{slot.text}{slot.optional && <span className="ml-1.5 text-xs text-primary">〔可选〕</span>}</span>
                      </li>)}
                    </ol>
                  </CardContent>
                  <CardFooter className="mt-auto border-t border-dashed"><p className="text-xs leading-6 text-muted-foreground">{day.note}</p></CardFooter>
                </Card>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">列车为目标时段，按实际班次调整。酒店未定，交通按近站住宿估算；雪天或排队超时，先删可选点。</p>
        </section>

        <section id="places" aria-labelledby="places-heading" className="mt-14 sm:mt-20">
          <SectionHeading number="02" title="哪些值得去" id="places-heading" description="按本次冬季慢游排序；优先安排经典，可选按体力，可省不用补齐。" />
          <div className="hokkaido-recommendation-map mt-6">
            <p className="mb-2 text-xs text-muted-foreground">概览点位 · WGS84 · 不作导航入口</p>
            <OpenFreeMap
              places={visibleMapPlaces}
              focusPlaceId={focusedRecommendationId}
              onSelectPlace={selectFromMap}
              label="北海道推荐景点地图"
              fitMaxZoom={9}
              focusZoom={14}
            />
          </div>
          <Tabs
            value={activeRecommendationCity}
            onValueChange={(value) => {
              const next = value === "all" || cityNames.includes(value as City) ? value as "all" | City : "all";
              setActiveRecommendationCity(next);
              setFocusedRecommendationId(null);
            }}
            className="mt-6 gap-5"
          >
            <TabsList variant="line" className="w-full max-w-lg" aria-label="选择城市">
              <TabsTrigger value="all">全部<span className="font-mono text-xs">{mapPlaces.length}</span></TabsTrigger>
              {cityNames.map((city) => <TabsTrigger key={city} value={city}>{city}<span className="font-mono text-xs">{recommendations[city].length}</span></TabsTrigger>)}
            </TabsList>
            <TabsContent value={activeRecommendationCity} forceMount>
              <div ref={recommendationListRef} className="hokkaido-recommendation-list">
                {(activeRecommendationCity === "all" ? cityNames : [activeRecommendationCity]).map((city) => (
                  <section key={city} aria-labelledby={`recommendation-${city}`}>
                    <h3 id={`recommendation-${city}`} className="flex items-baseline justify-between border-t border-foreground/50 px-1 py-3 text-sm font-semibold">
                      <span>{city}</span><span className="font-mono text-xs text-muted-foreground">{recommendations[city].length} 个点</span>
                    </h3>
                    <ol>
                      {recommendations[city].map((place, index) => {
                        const mapPlace = mapPlaces.find((item) => item.id === place.id);
                        if (!mapPlace) return null;
                        return <li key={place.id} data-recommendation-id={place.id} className={`grid grid-cols-[2rem_1fr] gap-3 border-b border-dashed border-border py-5 sm:grid-cols-[3rem_1fr] sm:gap-5 sm:py-6 ${focusedRecommendationId === place.id ? "hokkaido-recommendation-item-active" : ""}`}>
                          <span className="font-mono text-xl text-primary/80 sm:text-2xl">{String(index + 1).padStart(2, "0")}</span>
                          <div
                            className="min-w-0 cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
                            role="button"
                            tabIndex={0}
                            aria-label={`在地图上查看${place.name}`}
                            onClick={() => focusRecommendation(mapPlace)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                focusRecommendation(mapPlace);
                              }
                            }}
                          >
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2"><h4 className="text-base font-semibold sm:text-lg">{place.name}</h4><Badge variant={place.priority === "优先" ? "default" : place.priority === "可选" ? "secondary" : "outline"}>{place.condition ?? place.priority}</Badge></div>
                            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs"><span className="font-mono text-muted-foreground">{place.duration}</span>{place.day ? <a href={`#day-${place.day}`} className="text-primary underline decoration-primary/40 underline-offset-4" onClick={(event) => event.stopPropagation()}>{place.schedule} ↗</a> : <span className="text-muted-foreground">{place.schedule}</span>}</div>
                            <p className="mt-2 text-sm leading-7">{place.reason}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2"><span className="text-[11px] text-muted-foreground">依据</span>{sourceRefs(place.sources)}</div>
                          </div>
                        </li>;
                      })}
                    </ol>
                  </section>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">推荐为本次行程的编辑判断。时长默认不含酒店往返；山顶项目已计接驳与排队，堺町总时长已含子景点。</p>
        </section>

        <section id="reminders" aria-labelledby="reminders-heading" className="mt-14 sm:mt-20">
          <SectionHeading number="03" title="出发前，记这几件事" id="reminders-heading" description="天气差就减项目，把时间留给吃饭、休息和交通。" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {reminders.map(({ icon: Icon, title, text, sources: ids }) => <Alert key={title} role="note">
              <Icon aria-hidden="true" /><AlertTitle>{title}</AlertTitle><AlertDescription><p>{text}</p><div className="mt-2 flex flex-wrap gap-2">{sourceRefs(ids)}</div></AlertDescription>
            </Alert>)}
          </div>
        </section>

        <section id="sources" aria-labelledby="sources-heading" className="mt-14 sm:mt-20">
          <SectionHeading number="04" title="调研来源" id="sources-heading" description="60篇小红书正文 · 北海道总体与三城各15篇 · 核验于2026.11.07" />
          <Accordion type="multiple" value={openSources} onValueChange={setOpenSources} className="mt-4">
            {sourceGroups.map((group) => {
              const entries = sources.filter((source) => source.group === group.id);
              return <AccordionItem key={group.id} value={group.id}>
                <AccordionTrigger>{group.label}<span className="ml-auto font-mono text-xs text-muted-foreground">{entries.length} 条</span></AccordionTrigger>
                <AccordionContent><ul className="grid gap-2 md:grid-cols-2">{entries.map((source) => <li key={source.sourceId}>
                  <a id={`source-${source.sourceId}`} href={source.url} target="_blank" rel="noreferrer" className="source-entry flex items-start gap-3 p-2 text-sm leading-6">
                    <span className="min-w-7 pt-0.5 font-mono text-[11px] text-primary">{source.sourceId}</span><span className="min-w-0 flex-1">{source.title}</span><ArrowUpRight className="mt-1 size-3 shrink-0" aria-hidden="true" />
                  </a>
                </li>)}</ul></AccordionContent>
              </AccordionItem>;
            })}
          </Accordion>
          <p className="mt-5 text-xs leading-6 text-muted-foreground">帖子提供个人经验，活动与运营以官方公告为准。点灯细节、临时停运和酒店位置，出发前再确认。</p>
        </section>
        <section id="qa" aria-labelledby="qa-heading" className="mt-14 sm:mt-20">
          <SectionHeading number="05" title="路线 QA" id="qa-heading" description="把城市顺序和可调整的地方说清楚。" />
          <Accordion type="multiple" className="mt-4">
            {routeQa.map(({ question, answer, sources: ids }) => <AccordionItem key={question} value={question}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>
                <p className="leading-7">{answer}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2"><span className="text-[11px] text-muted-foreground">依据</span>{sourceRefs(ids)}</div>
              </AccordionContent>
            </AccordionItem>)}
          </Accordion>
        </section>
        <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-foreground/40 pt-6 text-xs text-muted-foreground"><span className="font-mono tracking-widest">HOKKAIDO · WINTER 2027</span><a href="#top">回到顶部 ↑</a></footer>
      </main>
    </div>
  );
}

function SectionHeading({ number, title, id, description }: { number: string; title: string; id: string; description: string }) {
  return <div><div className="flex items-baseline gap-3"><span className="font-mono text-xs text-primary">{number} /</span><h2 id={id} className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2></div><p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p></div>;
}
