import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Field, FieldGroup, FieldLabel } from "../../components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Empty, EmptyHeader, EmptyDescription, EmptyContent } from "../../components/ui/empty";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/ui/accordion";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "../../components/ui/table";
import { Progress } from "../../components/ui/progress";
import { Spinner } from "../../components/ui/spinner";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { RefreshCw, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { TravelMap } from "../../TravelMap";
import { distanceKm } from "../../lib/coordinates";
import { bortleLabel, checkedAt, darkSkyUrl, places, shenzhenOrigin, sortPlaces, toMapPlace, type SortKey, type StargazingPlace } from "./places";
import { fetchWeather, fieldNames, formatTime, nightDates, nightHours, readWeatherCache, saveWeatherCache, weatherFields, weatherSummary, type WeatherHour, type WeatherRecord } from "./weather";
import research from "./research-summary.json";
import "./styles.css";

const mapPlaces = places.map(toMapPlace);
const displayValue = (value: number | null, suffix = "%") => value === null ? "—" : `${Math.round(value)}${suffix}`;

export default function StargazingPage() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("distance");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [date, setDate] = useState(() => nightDates()[0]);
  const [cache, setCache] = useState<Record<string, WeatherRecord>>({});
  const [cacheLoading, setCacheLoading] = useState(true);
  const [storageNotice, setStorageNotice] = useState("");
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const controller = useRef<AbortController | null>(null);
  const unsavedPlaces = useRef(new Set<string>());
  const mounted = useRef(false);
  const dates = nightDates(now);
  const busy = progress !== null;
  const visible = useMemo(() => sortPlaces(places.filter(place =>
    `${place.name} ${place.city} ${place.district} ${place.terrain}`.toLowerCase().includes(query.trim().toLowerCase())), sortKey, direction), [query, sortKey, direction]);
  const shownMapPlaces = useMemo(() => mapPlaces.filter(place =>
    places.some(source => source.id === place.id && `${source.name} ${source.city} ${source.district} ${source.terrain}`.toLowerCase().includes(query.trim().toLowerCase()))), [query]);
  const selected = visible.find(place => place.id === selectedId) ?? visible[0];

  useEffect(() => {
    let cancelled = false;
    mounted.current = true;
    // Only the labels/available nights tick; this never requests weather.
    const clock = window.setInterval(() => setNow(Date.now()), 60000);
    readWeatherCache(places)
      .then(records => { if (!cancelled) setCache(records); })
      .catch(() => { if (!cancelled) setStorageNotice("无法读取本地缓存。仍可手动获取天气，本次结果会保留在页面中。"); })
      .finally(() => { if (!cancelled) setCacheLoading(false); });
    return () => { cancelled = true; mounted.current = false; window.clearInterval(clock); controller.current?.abort(); };
  }, []);

  const tonight = dates[0];
  useEffect(() => { if (date < tonight) setDate(tonight); }, [date, tonight]);

  async function updateWeather(targets: StargazingPlace[]) {
    if (controller.current || cacheLoading) return;
    const run = new AbortController();
    controller.current = run;
    setProgress({ done: 0, total: targets.length });
    setNotice("");
    let succeeded = 0;
    let failed = 0;
    try {
      // Small static catalog: one batch at a time, up to ten locations per request.
      for (let offset = 0; offset < targets.length; offset += 10) {
        const batch = targets.slice(offset, offset + 10);
        try {
          const results = await fetchWeather(batch, run.signal);
          if (run.signal.aborted || !mounted.current) break;
          const records = results.flatMap(result => result.record ? [result.record] : []);
          succeeded += records.length;
          failed += results.length - records.length;
          setCache(previous => ({ ...previous, ...Object.fromEntries(records.map(record => [record.placeId, record])) }));
          setErrors(previous => {
            const next = { ...previous };
            for (const result of results) {
              if (result.error) next[result.point.id] = result.error;
              else delete next[result.point.id];
            }
            return next;
          });
          if (records.length) {
            try {
              await saveWeatherCache(records);
              records.forEach(record => unsavedPlaces.current.delete(record.placeId));
              if (mounted.current && !unsavedPlaces.current.size) setStorageNotice("");
            } catch {
              records.forEach(record => unsavedPlaces.current.add(record.placeId));
              if (mounted.current) setStorageNotice("有天气已获取但未能保存到此浏览器。刷新后这些结果可能丢失，请重新更新天气。");
            }
          }
        } catch (error) {
          if (run.signal.aborted || !mounted.current) break;
          failed += batch.length;
          const message = error instanceof Error && error.name === "TimeoutError" ? "天气请求超时，请稍后重试" : "天气获取失败，请检查网络后重试";
          setErrors(previous => ({ ...previous, ...Object.fromEntries(batch.map(point => [point.id, message])) }));
        }
        if (mounted.current) setProgress({ done: Math.min(offset + batch.length, targets.length), total: targets.length });
      }
      if (mounted.current) setNotice(run.signal.aborted ? "已停止获取，已有天气仍保留。" : `本次成功 ${succeeded} 个${failed ? `，失败 ${failed} 个；旧天气仍保留` : ""}。`);
    } finally {
      controller.current = null;
      if (mounted.current) setProgress(null);
    }
  }

  return (
    <main className="stargazing min-h-screen bg-background text-foreground">
      <nav className="mx-auto max-w-[1440px] border-b border-border px-5 py-3 sm:px-10" aria-label="页面导航">
        <a href="/" className="text-sm font-semibold text-primary hover:underline">← 旅行手记</a>
      </nav>
      <header className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-3 px-5 py-6 sm:px-10">
        <h1 className="font-serif text-3xl leading-tight sm:text-4xl">广东观星地图</h1>
        <span className="text-xs text-muted-foreground">资料核验 {checkedAt}</span>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 pb-14 sm:px-10">
        <section className="flex flex-wrap items-end justify-between gap-3 border-y border-border py-3" aria-label="地点筛选与天气更新">
          <FieldGroup className="w-full flex-row flex-wrap items-end gap-3 sm:w-[570px]">
            <Field className="w-full gap-2 sm:w-[250px]">
              <FieldLabel htmlFor="stargazing-search">找地点</FieldLabel>
              <Input id="stargazing-search" type="search" placeholder="搜地点、城市或地形…" value={query} onChange={event => setQuery(event.target.value)} />
            </Field>
            <Field className="w-[190px] shrink-0 gap-2">
              <FieldLabel htmlFor="stargazing-sort">排序依据</FieldLabel>
              <Select value={sortKey} onValueChange={value => { if (value === "distance" || value === "bortle") setSortKey(value); }}>
                <SelectTrigger id="stargazing-sort"><SelectValue /></SelectTrigger>
                <SelectContent className="stargazing stargazing-select-content" position="popper" align="start">
                  <SelectGroup>
                    <SelectItem value="distance">距深圳直线距离</SelectItem>
                    <SelectItem value="bortle">波尔特等级</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Button variant="outline" aria-label={direction === "asc" ? "当前升序，切换降序" : "当前降序，切换升序"} onClick={() => setDirection(value => value === "asc" ? "desc" : "asc")}>{direction === "asc" ? <ArrowUp data-icon="inline-start" /> : <ArrowDown data-icon="inline-start" />}{direction === "asc" ? "升序" : "降序"}</Button>
          </FieldGroup>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-muted-foreground">{cacheLoading ? "读取本地天气…" : `已缓存 ${Object.keys(cache).length} / ${places.length} 地点`}</span>
            <Button disabled={cacheLoading || busy} onClick={() => void updateWeather(places)}>{busy ? <Spinner aria-hidden="true" data-icon="inline-start" /> : <RefreshCw data-icon="inline-start" />}{busy ? `获取中 ${progress.done}/${progress.total}` : "更新全部天气"}</Button>
            {busy && <Button variant="ghost" onClick={() => controller.current?.abort()}>停止</Button>}
          </div>
        </section>
        <div className="flex flex-wrap justify-between gap-2 py-3 text-xs leading-5 text-muted-foreground">
          <span>起点：深圳市民中心 · 直线距离，不含驾车绕行</span><span>天气只在点击时获取，保存在此浏览器</span>
        </div>
        <div aria-live="polite" className="flex flex-col gap-2">
          {progress && <Progress className="mb-2 h-1" aria-label="天气更新进度" value={progress.done / progress.total * 100} />}
          {notice && <Alert role="status" className="stargazing-enter mb-2 py-2"><AlertDescription>{notice}</AlertDescription></Alert>}
          {storageNotice && <Alert variant="destructive" className="stargazing-enter mb-2 py-2"><AlertDescription>{storageNotice}</AlertDescription></Alert>}
        </div>

        <section className="mb-5 flex flex-wrap items-center gap-2" aria-label="选择观星夜晚">
          <span className="mr-2 text-xs font-semibold text-muted-foreground">哪一晚</span>
          <ToggleGroup type="single" value={date} onValueChange={value => { if (value) setDate(value); }} variant="outline" size="sm" spacing={1} className="flex-wrap" aria-label="观星日期">
            {dates.map((night, i) => <ToggleGroupItem key={night} value={night}>{i === 0 ? "今晚" : `${Number(night.slice(5, 7))}/${Number(night.slice(8))}`}</ToggleGroupItem>)}
          </ToggleGroup>
          <span className="text-xs text-muted-foreground">18:00 — 次日06:00 · 北京时间</span>
        </section>

        <div className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
          <section aria-label="观星地点列表" className="min-w-0">
            <div className="mb-2 text-xs text-muted-foreground">地点 / {visible.length}</div>
            <ScrollArea key={`${query.trim()}:${sortKey}:${direction}`} className="stargazing-place-scroll stargazing-enter" type="auto"><div className="flex flex-col gap-1 p-1 pr-3">
              {!visible.length && <Empty className="border px-3 py-6"><EmptyHeader><EmptyDescription>没有找到匹配地点。</EmptyDescription></EmptyHeader><EmptyContent><Button variant="outline" onClick={() => setQuery("")}>清空搜索</Button></EmptyContent></Empty>}
              {visible.map(place => {
                const record = cache[place.id];
                const hours = nightHours(record, date);
                const summary = weatherSummary(hours);
                const isSelected = place.id === selected?.id;
                return <Card key={place.id} data-selected={isSelected} className="stargazing-place-card shrink-0 gap-0 rounded-sm p-0">
                  <Button variant="ghost" className="stargazing-place-select block h-auto w-full px-2.5 pt-2 pb-1.5 text-left whitespace-normal" aria-pressed={isSelected} onClick={() => setSelectedId(place.id)}>
                    <CardHeader className="gap-1 px-0">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="min-w-0"><h2 className="font-serif text-base leading-5">{place.name}</h2></CardTitle>
                        <div className="shrink-0 text-right text-xs leading-4">
                          <div className="font-mono font-semibold">{Math.round(distanceKm(shenzhenOrigin, place.wgs84))}<span className="ml-1 font-normal text-muted-foreground">km</span></div>
                          <div className="text-primary">{place.bortle ? <>波尔特 <b>{bortleLabel(place.bortle)}</b> 级 <small className="text-muted-foreground">估算</small></> : "波尔特待核验"}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-x-2 text-[11px] leading-4 text-muted-foreground"><span>{place.city} · {place.district}</span><span>{place.terrain}</span></div>
                    </CardHeader>
                    <CardDescription className="stargazing-place-summary mt-1">{place.summary}</CardDescription>
                  </Button>
                  <CardContent className="px-2.5"><Separator className="mb-1" /><div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {hours.length ? <><span>平均云量 <b className="text-foreground">{displayValue(summary.cloud)}</b></span><span>最高降水 <b className="text-foreground">{displayValue(summary.rain)}</b></span>{hours.length < 12 && <span>仅{hours.length}/12小时</span>}</> : <span>{record ? "所选夜晚暂无预报" : "天气未获取"}</span>}
                  </div></CardContent>
                  <CardFooter className="flex-wrap justify-between gap-x-2 px-2.5 py-0.5"><CacheAge record={record} now={now} /><Button size="xs" variant="ghost" className="-mr-1" disabled={busy || cacheLoading} aria-label={`更新${place.name}天气`} onClick={() => void updateWeather([place])}><RefreshCw data-icon="inline-start" />更新天气</Button></CardFooter>
                  {errors[place.id] && <p className="px-2.5 pb-1.5 text-xs leading-5 text-destructive" role="status">{errors[place.id]}{record && "；保留旧天气"}</p>}
                </Card>;
              })}
            </div></ScrollArea>
          </section>

          <div className="flex min-w-0 flex-col gap-5">
            <section className="overflow-hidden rounded-sm border border-border bg-card shadow-[4px_4px_0_#e5dfcf]" aria-label="广东观星地图">
              <div className="flex justify-end border-b border-border px-2 py-1"><Button size="xs" variant="ghost" onClick={() => { setSelectedId(null); setQuery(""); }}>查看全图</Button></div>
              <TravelMap places={shownMapPlaces} focusPlaceId={visible.some(place => place.id === selectedId) ? selectedId : null} onSelectPlace={setSelectedId} label="广东流星雨与星空拍摄地点地图" theme="paper" fitMaxZoom={8} focusZoom={11} />
            </section>
            {selected && <PlaceDetail key={selected.id} place={selected} record={cache[selected.id]} date={date} now={now} />}
          </div>
        </div>

        <Accordion type="single" collapsible className="mt-8 border-y border-border"><AccordionItem value="method">
          <AccordionTrigger>数据与来源</AccordionTrigger><AccordionContent>
          <div className="mt-5 grid gap-6 leading-7 md:grid-cols-2">
            <div><p>通过 Edge 浏览器搜索小红书，12个关键词各读取至少50条不同帖子ID。原始搜索共 {research.associations} 条关键词关联，跨词去重 {research.uniquePosts} 篇；定向补查新增 {research.supplementalPosts} 篇，累计实际读详情 {research.detailPosts} 篇。其余为搜索卡片，不算精读。</p><div className="mt-3 flex flex-wrap gap-2">{research.keywords.map(item => <Badge variant="outline" key={item.query}>{item.query} · {item.count}</Badge>)}</div></div>
            <div className="flex flex-col gap-3"><p>收录有拍摄或实地观星来源、坐标依据的广东地点；区域参考与具体机位分别说明。明确封闭的横琴黑角湾、四号沙滩礁石区不收录；旧机位变化、预约与夜间管理写在各点笔记中。</p><p>光污染采用 <a className="underline" href="https://www.lightpollutionmap.info/help.html#FAQ31" target="_blank" rel="noreferrer">Light Pollution Map / Sky Brightness 2025</a> 天顶模型，约1km分辨率。数值对应所标参考点，不代表整个湖区或山脉；不能反映临时灯光、云和月亮。区间按上限排序，待核验值排末尾。</p><p>天气来自 <a className="underline" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>，仅手动获取。超过6小时提示旧缓存，清理浏览器站点数据会清除天气。坐标资料含 <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors / ODbL</a> 与百度、高德公开POI。</p></div>
          </div>
        </AccordionContent></AccordionItem></Accordion>
      </div>
    </main>
  );
}

function CacheAge({ record, now }: { record?: WeatherRecord; now: number }) {
  return <span className="text-[11px] leading-5 text-muted-foreground">{record ? <>{formatTime(record.fetchedAt, { month: "numeric", day: "numeric" })} 获取{now - record.fetchedAt > 6 * 3600000 && <b className="ml-2 text-destructive">缓存较旧</b>}</> : "点击后获取，不自动刷新"}</span>;
}

function PlaceDetail({ place, record, date, now }: { place: StargazingPlace; record?: WeatherRecord; date: string; now: number }) {
  const hours = nightHours(record, date);
  return <article className="stargazing-enter rounded-sm border border-border bg-card px-4 py-4 sm:px-5" aria-label={`${place.name}地点详情`}>
    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
      <Badge variant="secondary">{place.bortle ? `波尔特 ${bortleLabel(place.bortle)} 级` : "波尔特待核验"}</Badge>
      <div className="ml-auto flex gap-2">
        {place.bortle && <Button variant="outline" size="sm" asChild><a href={darkSkyUrl(place)} target="_blank" rel="noreferrer">图层</a></Button>}
        <Button variant="outline" size="sm" asChild><a href={place.mapUrl} target="_blank" rel="noreferrer">查看地点</a></Button>
      </div>
    </div>
    <h2 className="font-serif text-2xl">{place.name}</h2>
    <p className="mt-2 text-sm leading-5 text-muted-foreground">{place.summary}</p>
    <Separator className="mt-3" /><div className="grid gap-3 py-2 text-[13px] sm:grid-cols-2">
      <div><h3 className="mb-1 font-semibold">怎么到达</h3><p className="leading-5 text-muted-foreground">{place.access}</p></div>
      <div><h3 className="mb-1 font-semibold">夜间与现场</h3><p className="leading-5 text-muted-foreground">{place.nightAccess}</p></div>
    </div><Separator />
    <Alert role="note" className="stargazing-detail-note mt-2 px-3 py-2"><AlertDescription>{place.caution}</AlertDescription></Alert>

    <section key={date} className="stargazing-enter mt-3" aria-label="逐小时夜间天气">
      {!hours.length ? <Empty className="border px-3 py-4 md:p-4"><EmptyHeader><EmptyDescription>{record ? "所选夜晚已超出缓存预报范围，点击更新天气获取新预报。" : "还没有这处地点的天气。点击列表中的“更新天气”，或更新全部地点。"}</EmptyDescription></EmptyHeader></Empty> : <>
        {hours.length < 12 && <p className="mt-3 text-xs text-destructive">此夜仅有 {hours.length}/12 小时数据，其余时段缺测。</p>}
        <div className="min-w-0 rounded-sm border border-border">
          <Table className="stargazing-weather-table min-w-[770px] tabular-nums" containerLabel="逐小时天气表，可横向滚动">
            <TableCaption className="sr-only">{place.name} {date} 夜间天气，云量与降水为百分比，能见度为公里</TableCaption>
            <TableHeader><TableRow><TableHead scope="col">时间</TableHead>{fieldNames.map(field => <TableHead key={field} scope="col">{weatherFields[field].label}<span className="mt-1 block text-[10px] font-normal text-muted-foreground">{field === "visibility" ? "km" : weatherFields[field].unit}</span></TableHead>)}</TableRow></TableHeader>
            <TableBody>{hours.map(hour => <WeatherRow key={hour.time} hour={hour} now={now} />)}</TableBody>
          </Table>
        </div>
        <p className="mt-2 text-xs text-muted-foreground sm:hidden">左右滑动表格，查看云层、湿度、风速与能见度。</p>
      </>}
    </section>
    <Accordion type="single" collapsible className="mt-3 border-t border-border"><AccordionItem value="sources"><AccordionTrigger className="py-2">拍摄来源 · {place.sources.length} 篇</AccordionTrigger><AccordionContent><ul className="flex flex-col gap-2">{place.sources.map(source => <li key={source.url}><a className="underline decoration-border underline-offset-4 hover:text-primary" href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><span className="ml-2">{source.date}</span></li>)}</ul><p className="mt-3">小红书链接可能要求登录或打开App。来源为作者历史经历，核验日期 {checkedAt}。</p></AccordionContent></AccordionItem></Accordion>
  </article>;
}

function WeatherRow({ hour, now }: { hour: WeatherHour; now: number }) {
  const past = hour.time * 1000 < now;
  return <TableRow className={cn(past && "bg-secondary/40 text-muted-foreground")}><TableHead scope="row">{formatTime(hour.time * 1000)}{past && <span className="ml-1 text-[10px]">已过</span>}</TableHead>{fieldNames.map(field => <TableCell className={cn(field === "cloud_cover" && "font-semibold text-primary")} key={field}>{hour[field] === null ? "—" : field === "visibility" ? (hour[field] / 1000).toFixed(1) : Math.round(hour[field])}</TableCell>)}</TableRow>;
}
