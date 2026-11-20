import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cityNames } from "./trip";
import { foodPlaces, foodSources } from "./food";

export function FoodList() {
  return (
    <Tabs defaultValue="札幌" className="mt-6 gap-5">
      <TabsList variant="line" className="w-full max-w-lg" aria-label="美食所在城市">
        {cityNames.map((city) => (
          <TabsTrigger key={city} value={city}>
            {city}<span className="font-mono text-xs">{foodPlaces.filter((place) => place.city === city).length}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {cityNames.map((city) => (
        <TabsContent key={city} value={city}>
          <div key={city} role="region" aria-label={`${city}美食列表，可滚动`} tabIndex={0} className="h-[min(60vh,32rem)] overflow-y-auto overscroll-y-contain rounded-lg border border-border bg-card px-4 [scrollbar-gutter:stable] focus-visible:outline-2 focus-visible:outline-primary sm:px-6">
            <ul className="divide-y divide-dashed divide-border">
              {foodPlaces.filter((place) => place.city === city).map((place) => {
                const source = foodSources[place.source];
                return (
                  <li key={place.id} className="flex min-w-0 flex-col gap-2 py-5">
                    <h3 className="text-base font-semibold sm:text-lg">{place.name}</h3>
                    <p className="text-sm leading-7">{place.description}</p>
                    <a href={source.url} target="_blank" rel="noreferrer" title={`来源：${source.title} · ${source.author}（新窗口打开）`} className="w-fit max-w-full truncate text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-primary">
                      来源：{source.title} · {source.author} ↗
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
