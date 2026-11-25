import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CalendarDays, CloudSnow, Footprints, MountainSnow, Snowflake, TrainFront } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SyncedTable } from "@/components/synced-table";
import { OpenFreeMap } from "../../OpenFreeMap";
import type { Trip } from "../types";
import { buildHokkaidoMapPlaces, type HokkaidoMapPlace } from "./recommendation-map";
import { recommendationCities, dayPlans, nights, recommendations, stayAreas, type RecommendationCity } from "./trip";
import { sources } from "./sources";
import { FoodList } from "./food-list";
import { ticketGroups } from "./tickets";
import "./styles.css";

const reminders = [
  { icon: CalendarDays, title: "两场雪节，日期别记错", text: "札幌雪祭2/4–11；小樽雪灯2/6–13。2/5没有正式雪灯，2/6点灯时间待公告。", sources: ["O1", "O2"] },
  { icon: TrainFront, title: "函馆转场，留半天", text: "2/2函馆到札幌约4小时，实际从中午开始玩。北斗全车指定席，先订座；雪天出发前查停运。", sources: ["O7", "O9", "O10"] },
  { icon: MountainSnow, title: "索道停运，就取消登山", text: "函馆山冬季不能打车上山；天狗山先看能见度。冬季团注明有珠山1/12–3/13停运，本次不排。", sources: ["O3", "O4", "O5", "N29"] },
  { icon: CloudSnow, title: "朝里、发寒，看清停站", text: "2/5坐09:25普通车停朝里，2/7坐08:55普通车停发寒；09:33 Airport31号不停朝里，09:22 Airport52号不停发寒。", sources: ["N17", "N19"] },
  { icon: Footprints, title: "坡道慢走，随时取暖", text: "穿防滑防水鞋；结冰就缩短坡道路线。室外与室内交替，累了删可选点。", sources: ["T02", "T13", "K09"] },
  { icon: Snowflake, title: "白天短，不追满场", text: "札幌2/4日落16:50。白天留给雪景，通常20点收尾；朝里遇风雪就不下车，留时间逛小樽。", sources: ["O14"] },
];

const routeQa = [
  {
    question: "大通雪祭什么时候开始？",
    answer: "2027年2月4日（周四）开始，2月11日结束。本计划2/4看开幕，2/7可补看。",
    sources: ["O1"],
  },
  {
    question: "小樽雪灯之路什么时候开始？",
    answer: "2027年2月6日（周六）开始，2月13日结束。2/5还没有正式雪灯，想看就至少留到2/6傍晚；2027年具体点灯时段待官方公告。",
    sources: ["O2"],
  },
  {
    question: "落地住哪里，次晨怎么去函馆？",
    answer: "1/30住千岁站附近。1/31约07:45–08:00出门，08:40→08:43 Airport32号到南千岁，09:12→12:33北斗6号到函馆，换乘29分钟。北斗不停千岁、也不进机场；08:19北斗84号为临时车，未确认当天运行。",
    sources: ["N05", "N14", "N22"],
  },
  {
    question: "2日到札幌，能玩一整天吗？",
    answer: "推荐08:56→12:41北斗5号。札幌站寄存→北大南部→旧道厅→回站取行李，再去西线9条酒店；寄存满员就先去酒店并删减景点。狸小路留2/4。站到酒店打车每车单程预算¥2,000–3,200，默认市电接地下步行街。",
    sources: ["N16", "O1"],
  },
  {
    question: "5日怎么经朝里去小樽，住几晚？",
    answer: "约08:00从西线9条酒店出发，市电接地下步行街到札幌站。09:25普通156M→朝里，10:42普通162M→小樽。先去站前酒店寄存，再接驳音乐盒堂本馆，从南向北逛堺町、运河。风雪大或带大箱就取消朝里短停；住5、6日两晚。",
    sources: ["N17", "O2", "O3"],
  },
  {
    question: "去小樽能把大箱子留在札幌吗？",
    answer: "札幌2/2–4和2/7尽量订同一家，先确认允许跨两晚寄存；允许就只带两晚换洗小包。若不能寄存，5日带箱直达小樽、取消朝里短停；7日先回札幌酒店放箱，再改地铁往返白色恋人。",
    sources: ["N10"],
  },
  {
    question: "白色恋人怎样顺路去？哪些车不停站？",
    answer: "2/7坐08:55普通149M，约09:32到发寒，打车到公园预算每车单程¥1,000–1,800；报价超¥3,000改JR到札幌、地铁经大通到宫之泽，游园顺延。结束后宫之泽→西11丁目→中央区役所前市电→西线9条酒店。09:22 Airport52号不停发寒，09:33 Airport31号不停朝里。",
    sources: ["N17", "N19", "N30", "N31"],
  },
  {
    question: "朝里、发寒的到站时间准确吗？能存行李吗？",
    answer: "官方总时刻表在这两站列的是发车时刻，到站略早，所以写约10:05、约09:32；返程上车按发车时间提前候车。白色恋人有免费柜，但尺寸和空位不保证；朝里按无寄存安排，只带小包短停。",
    sources: ["N17", "N19", "N32"],
  },
  {
    question: "3日一日游怎么订，包含温泉和有珠山吗？",
    answer: "候选冬季团适用2027/1/30–2/23，2/3余位仍待确认。08:30电视塔集合，约18:20返回；基础¥7,600起，冰涛节平日票¥1,000、餐费另计。选湖畔A线，不含泡汤；产品注明有珠山索道1/12–3/13停运，不安排上山。",
    sources: ["N29"],
  },
  {
    question: "冰涛节能看夜景吗？函馆山有几次机会？",
    answer: "候选团2/3预计16:10–17:10停留冰涛节，亮灯与路况以现场为准。函馆山默认2/1，接元町步行线；若1/31更晴，交换五棱郭与元町＋函馆山的安排，并缩短或取消金森、公会堂。双日停运则取消夜景。",
    sources: ["N29", "N02", "O4", "O5"],
  },
  {
    question: "打车预算怎么算？超过¥3,000怎么办？",
    answer: "按普通车、每车单程看总价，不按人均拆分。札幌站↔西线9条预算¥2,000–3,200，默认公共交通；电视塔或神宫短途¥1,800–2,800，发寒→白色恋人¥1,000–1,800，小樽站前→音乐盒堂本馆粗估¥1,200–2,000。酒店门牌未定，均为预算区间，非叫车报价；上车前看含迎车等费用的全额预估，超¥3,000优先公共交通。雪天低速等候可能继续加价，2027年出发前再核。",
    sources: ["N34", "N35"],
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
  const [activeRecommendationCity, setActiveRecommendationCity] = useState<"all" | RecommendationCity>("all");
  const [focusedRecommendationId, setFocusedRecommendationId] = useState<string | null>(null);
  const recommendationListRef = useRef<HTMLDivElement>(null);
  const mapPlaces = useMemo(() => buildHokkaidoMapPlaces(recommendations), []);
  const visibleMapPlaces = useMemo(() => activeRecommendationCity === "all"
    ? mapPlaces
    : mapPlaces.filter((place) => place.city === activeRecommendationCity), [activeRecommendationCity, mapPlaces]);

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
      return <a key={id} href={source.url} target="_blank" rel="noreferrer" className="source-ref" aria-label={`查看来源 ${id}：${source.title}`} title={source.title} onClick={(event) => event.stopPropagation()}>{id}</a>;
    });
  }

  return (
    <div className="hokkaido-page min-h-screen bg-background text-foreground">
      <a href="#itinerary" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:bg-background focus:p-3">跳到每日行程</a>
      <nav aria-label="页面导航" className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-2 text-sm"><ArrowLeft className="size-4" aria-hidden="true" /><span>旅行列表</span></a>
          <div className="flex gap-3 text-sm sm:gap-8"><a href="#itinerary">行程</a><a href="#places">推荐</a><a href="#food">美食</a><a href="#reminders">提醒</a><a href="#qa">QA</a></div>
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
              <p className="mt-3 text-sm leading-7 text-muted-foreground">转场日7点起 · 游玩日8:30–9点起 · 抵达夜住千岁</p>
            </div>
            <WinterPostcard />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-dashed border-border px-6 py-5 sm:px-10">
            <div className="flex flex-wrap gap-x-5 gap-y-2">{nights.map(({ city, count }) => <span key={city} className="text-sm">{city} <b className="ml-1 font-mono text-xl text-primary">{count}</b> 晚</span>)}</div>
            <p className="text-xs text-muted-foreground">1/30–2/7共9晚 · 1/30 16:30抵达新千岁</p>
          </div>
        </header>

        <div className="my-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:my-10 sm:gap-x-5 sm:text-sm" aria-label="城市路线">
          <span>千岁</span><span aria-hidden="true" className="text-primary">→</span><span>函馆</span><span aria-hidden="true" className="text-primary">→</span><span>札幌（洞爷湖·登别·冰涛节一日游）</span><span aria-hidden="true" className="text-primary">→</span><span>朝里·小樽</span><span aria-hidden="true" className="text-primary">→</span><span>白色恋人·札幌</span>
        </div>

        <section id="itinerary" aria-labelledby="itinerary-heading">
          <SectionHeading number="01" title="每天怎么走" id="itinerary-heading" description="日本当地时间 · 推荐列车附前后备选 · 寄存与接驳写在当天" />
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
                    <CardDescription>{day.stay ? `住${day.stay} · ${stayAreas[day.stay]}` : "住宿按实际航班"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="flex flex-col gap-3">
                      {day.slots.map((slot) => <li key={slot.time} className="grid grid-cols-[5.2rem_1fr] items-start gap-3 text-sm leading-6 sm:grid-cols-[6.7rem_1fr]">
                        <span className="pt-0.5 font-mono text-xs text-muted-foreground">{slot.time}</span>
                        <span>{slot.text}{slot.optional && <span className="ml-1.5 text-xs text-primary">〔可选〕</span>}</span>
                      </li>)}
                    </ol>
                    <p className="mt-4 border-t border-dashed pt-3 text-xs leading-6 text-muted-foreground"><span className="font-semibold text-foreground">行李 · </span>{day.luggage}</p>
                    {day.trains?.map((train) => (
                      <div key={train.route} className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-xs leading-6">
                        <p className="font-semibold">{train.route} · 列车备选</p>
                        <dl className="mt-2 grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-2 gap-y-1">
                          <dt className="text-muted-foreground">提前</dt><dd>{train.earlier}</dd>
                          <dt className="font-semibold text-primary">推荐</dt><dd className="font-semibold text-primary">{train.recommended}</dd>
                          <dt className="text-muted-foreground">延后</dt><dd>{train.later}</dd>
                        </dl>
                        <p className="mt-2 text-muted-foreground">{train.note}</p>
                        <div className="mt-2 flex flex-wrap gap-2">{sourceRefs(train.sources)}</div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="mt-auto flex-col items-start gap-2 border-t border-dashed">
                    <p className="text-xs leading-6 text-muted-foreground"><span className="font-semibold text-foreground">说明 · </span>{day.note}</p>
                    {day.sources && <div className="flex flex-wrap gap-2">{sourceRefs(day.sources)}</div>}
                  </CardFooter>
                </Card>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">打车预算均为普通车每车单程估算，按酒店片区规划，非固定报价；札幌参考现行运价，小樽短途仅作粗估。上车前确认含迎车、预约等费用的全额预估，超过¥3,000优先公共交通。冬季加价、低速等候、车种及酒店门牌会影响实际费用。公共交通价格按成人每人计；具体接驳预算见下方“打车预算”标签。{sourceRefs(["N34", "N35"])}</p>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">JR按2026.11.20–21核验的现行时刻规划，2027年出行前复核。2/3一日游已公布冬季路线，余位待确认；北斗提前订指定席，换班先改签。朝里、发寒的约到站时间按总表发车栏估算；停站已逐班核对，雪天留足换乘、取票与寄存时间。</p>
        </section>

        <section id="places" aria-labelledby="places-heading" className="mt-14 sm:mt-20">
          <SectionHeading number="02" title="哪些值得去" id="places-heading" description="按本次冬季慢游排序；优先安排经典，可选按体力，可省不用补齐。" />
          <div className="hokkaido-recommendation-map mt-6">
            <p className="mb-2 text-xs text-muted-foreground">位置参考 · 山岳标索道山麓站，五棱郭标塔楼；街区与园区为参考点，导航时核对入口。电视塔与T38、伏见稻荷与头大佛已分开标点。</p>
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
              const next = value === "all" || recommendationCities.includes(value as RecommendationCity) ? value as "all" | RecommendationCity : "all";
              setActiveRecommendationCity(next);
              setFocusedRecommendationId(null);
            }}
            className="mt-6 gap-5"
          >
            <TabsList variant="line" className="grid w-full grid-cols-4 group-data-[orientation=horizontal]/tabs:h-auto sm:grid-cols-7" aria-label="选择城市">
              <TabsTrigger value="all">全部<span className="font-mono text-xs">{mapPlaces.length}</span></TabsTrigger>
              {recommendationCities.map((city) => <TabsTrigger key={city} value={city}>{city}<span className="font-mono text-xs">{recommendations[city].length}</span></TabsTrigger>)}
            </TabsList>
            <TabsContent value={activeRecommendationCity} forceMount>
              <div ref={recommendationListRef} className="hokkaido-recommendation-list">
                {(activeRecommendationCity === "all" ? recommendationCities : [activeRecommendationCity]).map((city) => (
                  <section key={city} aria-labelledby={`recommendation-${city}`}>
                    <h3 id={`recommendation-${city}`} className="flex items-baseline justify-between border-t border-foreground/50 px-1 py-3 text-sm font-semibold">
                      <span>{city}</span><span className="font-mono text-xs text-muted-foreground">{recommendations[city].length} 个点</span>
                    </h3>
                    <ol>
                      {recommendations[city].map((place, index) => {
                        const mapPlace = mapPlaces.find((item) => item.id === place.id);
                        if (!mapPlace) return null;
                        const isScheduled = place.schedule.includes("已安排");
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
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2"><h4 className="text-base font-semibold sm:text-lg">{place.name}</h4><Badge variant={place.priority === "优先" ? "default" : place.priority === "可选" ? "secondary" : "outline"}>{place.condition ?? place.priority}</Badge>{!isScheduled && <Badge variant="outline" className="border-primary/60 text-primary">{place.day ? "备选" : "未安排"}</Badge>}</div>
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

        <section id="food" aria-labelledby="food-heading" className="mt-14 scroll-mt-24 sm:mt-20">
          <SectionHeading number="03" title="吃点什么" id="food-heading" description="按城市找店 · 列表内可滚动 · 口味评价来自原帖作者" />
          <FoodList />
        </section>

        <section id="stays" aria-labelledby="stays-heading" className="mt-14 scroll-mt-24 sm:mt-20">
          <div className="mb-6">
            <h2 id="stays-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">住宿与预订记录</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">记下酒店、民宿和预订信息。输入编辑密码后，双击填写，自动保存。</p>
          </div>
          <SyncedTable id="hokkaido-stays" title="北海道住宿" hideWhenLocked />
        </section>

        <section id="tickets" aria-labelledby="tickets-heading" className="mt-14 scroll-mt-24 sm:mt-20">
          <SectionHeading number="04" title="哪些票要先买" id="tickets-heading" description="票价按成人每人 · 打车按每车单程 · 金额均为日元 · JR单独买票" />
          <Tabs defaultValue="rail" className="mt-6 gap-5">
            <TabsList variant="line" className="grid w-full max-w-3xl grid-cols-3 group-data-[orientation=horizontal]/tabs:h-auto sm:grid-cols-5" aria-label="购票类型">
              {ticketGroups.map((group) => <TabsTrigger key={group.id} value={group.id}>{group.label}</TabsTrigger>)}
            </TabsList>
            {ticketGroups.map((group) => (
              <TabsContent key={group.id} value={group.id}>
                <ul className="grid gap-4 md:grid-cols-2">
                  {group.items.map((ticket) => (
                    <li key={ticket.name} className="flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold">{ticket.name}</h3>
                        <Badge variant={ticket.status === "提前订" ? "default" : ticket.status === "按需预约" ? "secondary" : "outline"}>{ticket.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">使用：{ticket.date}</p>
                      <p className="font-mono text-sm text-primary">{ticket.price}</p>
                      <p className="text-sm leading-6"><span className="font-semibold">购买时间 · </span>{ticket.timing}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{ticket.note}</p>
                      <div className="mt-auto flex flex-wrap items-center gap-2"><span className="text-xs text-muted-foreground">来源参考</span>{sourceRefs(ticket.sources)}</div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs leading-6 text-muted-foreground">{group.note}</p>
              </TabsContent>
            ))}
          </Tabs>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">已公布票价与规则核验于2026.11.20–21，2027出行前复核；打车区间仅作预算，一日游以选定日期报价与余位为准。JR开售时间为北京时间09:00／日本时间10:00；集合、乘车与游览时间均为日本当地时间。</p>
        </section>

        <section id="reminders" aria-labelledby="reminders-heading" className="mt-14 sm:mt-20">
          <SectionHeading number="05" title="出发前，记这几件事" id="reminders-heading" description="天气差就减项目，把时间留给吃饭、休息和交通。" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {reminders.map(({ icon: Icon, title, text, sources: ids }) => <Alert key={title} role="note">
              <Icon aria-hidden="true" /><AlertTitle>{title}</AlertTitle><AlertDescription><p>{text}</p><div className="mt-2 flex flex-wrap gap-2">{sourceRefs(ids)}</div></AlertDescription>
            </Alert>)}
          </div>
        </section>

        <section id="qa" aria-labelledby="qa-heading" className="mt-14 sm:mt-20">
          <SectionHeading number="06" title="路线 QA" id="qa-heading" description="把城市顺序和可调整的地方说清楚。" />
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
