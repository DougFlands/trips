import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { foodAreas, foodPlaces, foodSources } from "./food";

export function FoodList() {
  return (
    <Tabs defaultValue="札幌" className="mt-6 gap-5">
      <TabsList variant="line" className="w-full max-w-lg" aria-label="美食所在区域">
        {foodAreas.map((city) => (
          <TabsTrigger key={city} value={city}>
            {city}<span className="font-mono text-xs">{foodPlaces.filter((place) => place.city === city).length}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {foodAreas.map((city) => (
        <TabsContent key={city} value={city}>
          {city === "新千岁机场" && <p className="mb-4 text-sm leading-7 text-muted-foreground">机场吃喝与伴手礼候选，来自两篇旅行笔记。原帖跨抵达和返程两段体验；先确认航站楼、楼层及安检前后区域，另留值机安检时间。</p>}
          <div key={city} role="region" aria-label={`${city}美食列表，可滚动`} tabIndex={0} className="h-[min(60vh,32rem)] overflow-y-auto overscroll-y-contain rounded-lg border border-border bg-card px-4 [scrollbar-gutter:stable] focus-visible:outline-2 focus-visible:outline-primary sm:px-6">
            <ul className="divide-y divide-dashed divide-border">
              {foodPlaces.filter((place) => place.city === city).sort((a, b) => (b.tabelogScore ?? 0) - (a.tabelogScore ?? 0)).map((place) => (
                  <li key={place.id} className="flex min-w-0 flex-col gap-2 py-5">
                    <h3 className="text-base font-semibold sm:text-lg">
                      {place.mapUrl ? <a href={place.mapUrl} target="_blank" rel="noreferrer" title={`在谷歌地图查看${place.name}（新窗口打开）`} className="rounded-sm underline decoration-border underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">
                        {place.name}<span aria-hidden="true" className="ml-1 text-sm text-muted-foreground">↗</span>
                      </a> : place.name}
                    </h3>
                    <p className="text-sm leading-7">{place.description}</p>
                    {place.tabelogScore !== undefined && place.tabelogUrl && <a href={place.tabelogUrl} target="_blank" rel="noreferrer" title={`在 Tabelog 查看${place.name}（评分核对于 2026-11-20，新窗口打开）`} className="w-fit max-w-full truncate text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">
                      Tabelog：{place.tabelogScore.toFixed(2)} ↗
                    </a>}
                    {city === "新千岁机场" && <a href={foodSources[place.source].url} target="_blank" rel="noreferrer" className="w-fit text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">来源：{foodSources[place.source].title} ↗</a>}
                  </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
