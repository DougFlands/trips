# Frontend Architecture

## Current Shape

- `src/main.tsx` 是唯一浏览器入口。
- `src/App.tsx` 解析 `/`、`/trips/<slug>/` 与站内 404。
- `src/trips/<slug>/page.tsx` 是旅行详情渲染器；`src/trips/index.ts` 将 slug 映射到页面组件。
- `src/TravelMap.tsx` 隔离高德地图脚本、实例与覆盖物。
- `src/trips/index.ts` 是旅行注册表。
- `src/trips/<slug>/trip.ts` 保存单趟旅行数据。
- `src/styles.css` 保存 Tailwind 入口、shadcn tokens 与通用浏览器规则；旅行主题样式属于旅行目录。

## Local Patterns

- 每趟旅行一个目录；已排景点放在 `stops`，高分备选放在 `alternatives`。
- 旅行数据只使用可序列化的 TypeScript 值。
- UI 筛选使用组件本地状态，不增加状态库。
- 路由使用 `window.location.pathname` 和普通链接，不增加路由库。
- 只有跨旅行复用的 UI 才进入公共组件。

### Convention: Feature-owned trip pages

旅行注册表同时保存数据和页面组件映射；入口只解析 slug，不复制旅行渲染器。

```ts
const tripPages: Record<string, ComponentType<{ trip: Trip }>> = {
  [qingdaoYantaiWeihaiTrip.slug]: QingdaoTripPage,
};

const Page = findTripPage(trip.slug);
return Page ? <Page trip={trip} /> : <NotFound />;
```

旅行专属的 `page.tsx`、`styles.css` 和区块组件放在 `src/trips/<slug>/`。页面使用 Tailwind utilities；全局 `src/styles.css` 只保留 Tailwind import、shadcn CSS variables、基础 reset 和通用 focus/reduced-motion 规则。AMap imperatively-created marker/popup 可以继续使用旅行目录内的少量 CSS。

### Convention: Source-owned UI registries

普通控件从 `src/components/ui` 的 shadcn 源码组件组合；需要复杂交互时，按需从 `@reui` registry 或 Kibo CLI 下载源码到 `src/components/reui` / `src/components/kibo-ui`。安装后必须阅读生成文件、修正项目别名并运行 lint/typecheck/build，不能把整套 registry 当运行时依赖。

### Convention: Editorial trips without maps

`hokkaido-winter` 使用本页 `DayPlan`、`Recommendation` 与公开 `sources`，从同一份日程映射 `Trip.days`。没有地图的旅行可将 `stops`、`alternatives` 留空，首页仅在两者数量之和大于零时展示地图节点徽标。

- 编辑推荐使用“优先／可选／可省”和独立安排状态；不要为旧地图的 `TripPlace.score/coord` 编造分数或坐标。
- 来源随前端发布，使用公开 URL 和稳定 sourceId；不能链接 `.trellis` 工作区文件或保留会话 token。
- 引用被折叠的来源时，先展开所在分组，再定位并聚焦链接；键盘与鼠标行为一致。
- 验证日期连续、住宿晚数、城市推荐数量，以及每个 sourceId 和日程引用均能解析。

## Design Decision: Trip Folder, Place Data

旅行是独立维护和发布的内容单元，因此使用目录。景点数量多、结构重复，默认作为旅行数据项。`stops` 是按天排序的确定行程，`alternatives` 是未排入行程的高分点；两者复用 `TripPlace`。只有景点拥有专属页面或大量资源时再建立目录。

```text
src/trips/qingdao-yantai-weihai/trip.ts  # correct
src/trips/qingdao/yantai-station/...     # avoid
```

### Convention: Editorial Recommendation Maps

旅行页已有推荐排序、时长和理由时，地图点位放在该旅行目录的独立映射文件中。映射只补 WGS84 概览坐标和地图展示字段，不改旧高德 `TripPlace` 坐标契约；城市筛选、列表文案和弹窗详情都从同一份推荐数据派生。

```tsx
const mapPlaces = useMemo(() => buildRecommendationMapPlaces(recommendations), []);
<OpenFreeMap places={shownMapPlaces} focusPlaceId={focusedId} onSelectPlace={selectFromMap} />
```

地图点位必须在映射构建时检查稳定 ID、两项有限坐标和城市归属。页面筛选后传入当前点集，选点状态由页面控制；列表滚动只作用于列表容器，不能把地图移出视口。

## Scenario: Static Trip and AMap Contract

### 1. Scope / Trigger

增加旅行、修改旅行 URL、调整点位数据或高德环境变量时适用。

### 2. Signatures

```ts
findTrip(slug: string): Trip | undefined
TravelMap(props: {
  stops: TripStop[];
  alternatives: TripPlace[];
  days: TripDay[];
  activeDay: number | "all";
  label: string;
}): JSX.Element

functions/_AMapService/[[path]].js:
onRequest(context): Promise<Response>
```

页面 URL：`/trips/<Trip.slug>/`。

### 3. Contracts

- `TripStop.day`：`Trip.days` 的零基索引。
- `TripPlace.coord`：高德坐标系 `[longitude, latitude]`。
- `TripPlace.score`：页面展示的一位小数推荐分。
- `Trip.stops`：确定要去的点，按 `day`、`order` 绘制每日路线。
- `Trip.alternatives`：分数必须大于 6，不能和 `stops` 重复，也不参与路线连线。
- `VITE_AMAP_KEY`：高德 Web 端 JS API Key，地图加载必需。
- `VITE_AMAP_SECURITY_JS_CODE`：只用于本地开发的高德安全密钥。
- `AMAP_SECURITY_JS_CODE`：生产环境 Cloudflare Pages Secret，不能使用 `VITE_` 前缀。
- 生产环境将 `_AMapSecurityConfig.serviceHost` 指向同源 `/_AMapService`；代理只接受 GET/HEAD、覆盖客户端 `jscode`，并把客户端 `Referer` 转发给高德，供域名白名单校验。
- 所有 `VITE_` 值会进入浏览器产物，不能放服务端密钥。

### 4. Validation & Error Matrix

| Condition | Behavior |
|---|---|
| 未知 slug | 渲染站内 404，提供首页链接 |
| 生产环境缺少 `VITE_AMAP_KEY` | 显示 `missing` 配置提示，不加载脚本 |
| 本地开发缺少任一高德变量 | 显示 `missing` 配置提示，不加载脚本 |
| Pages Secret 缺失 | 代理返回 503，不请求高德上游 |
| Referer 不在高德域名白名单 | 高德返回 `INVALID_USER_DOMAIN` |
| Loader、Key、白名单失败 | 显示 `error` 提示 |
| 高德加载中 | 显示 `loading` 提示 |
| 日期筛选 | 显示该日行程点、该日路线与同城高分备选 |
| 全部视图 | 显示所有点位，各日行程分别连线 |
| 单点日程 | 显示行程标记，不绘制无意义的零长度线 |

### 5. Good / Base / Bad Cases

- Good：生产页面使用同源代理，安全密钥留在 Pages Secret，代理转发真实 Referer。
- Base：没有高德配置时，行程内容可读，地图区域明确提示配置方式。
- Bad：把安全密钥放进 `VITE_` 变量，或代理丢弃 Referer 后再启用域名白名单。

### 6. Tests Required

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `node --check functions/_AMapService/[[path]].js`
- 用自定义域 Referer 请求 `/_AMapService`，断言高德返回 `status=1`；不带合法 Referer 时不得误报成功。
- 检查生产 bundle 不包含 `AMAP_SECURITY_JS_CODE` 的值。
- 检查 `stops` 与 `alternatives` 的 ID 不重复，且 `alternatives.score > 6`。
- 浏览器检查 `/`、已知详情 URL、未知 URL、日期筛选和缺失配置状态。
- 移动端检查地图容器与触摸缩放配置。

### 7. Wrong vs Correct

```ts
// Wrong: 新旅行复制青岛页面和样式
export function AnotherTripPage() { /* copied Qingdao renderer */ }

// Correct: 注册自己的页面，公共能力按需复用
const Page = findTripPage(slug);
return Page ? <Page trip={findTrip(slug)!} /> : <NotFound />;
```

```js
// Wrong: 开启域名白名单后丢弃 Referer
headers: { Accept: request.headers.get("Accept") ?? "*/*" }

// Correct: 只选择性转发高德校验需要的 Referer
if (referer) upstreamHeaders.set("Referer", referer);
```

## Avoid

- 全局 store、路由库、UI 框架或请求库，除非已有功能无法用平台能力完成。
- 直接瓦片 URL、地图 CSS 滤镜或覆盖全页的扫描线遮罩。
- 在组件里重复旅行内容或环境变量名称。

## Scenario: Independent Map Components

### 1. Scope / Trigger

`src/TravelMap.tsx` 服务现有高德页面；`src/OpenFreeMap.tsx` 使用 MapLibre GL JS + OpenFreeMap 展示独立地点数组。页面通过显式导入选择组件，无全局 provider。

### 2. Signatures

```ts
TravelMap(props: TravelMapProps): JSX.Element
OpenFreeMap(props: {
  places: MapPlace[];
  label: string;
  focusPlaceId?: string | null;
  onSelectPlace?: (id: string) => void;
  fitMaxZoom?: number; // default 12
  focusZoom?: number;  // default 14
}): JSX.Element
```

### 3. Contracts

- `MapPlace` 位于 `src/map/types.ts`，只复用展示字段；OpenFreeMap 的 `coord` 必须为 WGS84 `[longitude, latitude]`，旧高德页面传入 GCJ-02。禁止直接复用已转换的高德点数组。
- OpenFreeMap 无 Key，组件配置官方 Liberty style URL、MapLibre CSS 和 Vite Worker。不要硬编码底层瓦片路径。保留默认署名。
- `onSelectPlace` + `focusPlaceId` 组成受控选择；无回调则点击直接定位并开窗。重复点击可重开详情。按钮标记使用原生键盘激活，不再叠加 Marker.setPopup 的键盘监听。
- 标记构建与选点取景使用独立 effect；仅改变 focus 不重建 DOM 标记，否则原生键盘焦点会丢失。回归需断言选点前后的 activeElement 一致。
- 有效 focus 优先；全图、单点和选点取景互斥，使用 stop + jumpTo / duration: 0 的 fitBounds，避免旧动画覆盖目标位置。
- 地点过滤/清空须删除旧标记和弹窗；effect 清理监听、控件、popup、ResizeObserver 和地图。StrictMode 重挂不能留下重复实例。
- 弹窗文本使用 DOM/textContent，外链只接受 HTTP(S)，设置 target/rel。失败时地点列表仍可读。
- 新组件有 loading/ready/error，20 秒加载超时可重试；无 missing-config 状态。初始化失败和全量底图失败不可仅凭 canvas 存在判断成功；部分瓦片错误显示提示，后续成功加载可以恢复。
- 专用样式限定 `.openfreemap*`，不依赖某趟旅行主题。窄屏不能遮挡控件和署名，容器尺寸改变要 resize。

### 4. Validation & Error Matrix

| 条件 | 行为 |
| --- | --- |
| 无 Key | 新组件仍可加载真实底图 |
| 多点且无 focus | 全图取景，最大缩放 fitMaxZoom |
| 单点 | 居中；有 focus 时使用 focusZoom 并开窗 |
| focus 在当前点集中不存在 | 关闭旧弹窗，重新按当前点集取景 |
| 空数组 | 无标记、无弹窗，地点列表显示空状态 |
| SDK/网络失败 | 提示失败并可重试，列表继续可读 |
| 当前高德页面 | 沿用高德 SDK、Key、代理、坐标与接口 |

### 5. Good / Base / Bad

- Good：新地点数组使用原始 WGS84，React 管选择、MapLibre 管渲染，选点保留键盘焦点。
- Base：底图失败显示可重试提示，地点与外链继续可读。
- Bad：直接传入高德已偏移坐标，或每次选择都销毁并重建按钮标记。

### 6. Tests Required

- `npm run lint`、`npm run typecheck`、`npm run build`、`npm audit`。
- `/tests/openfreemap-map.html` 的真实 SDK 回归检查：取景、受控/无回调选点、筛选、空点集、危险文本/外链、StrictMode 重挂。
- `/tests/openfreemap-map.html?fail=1` 的网络失败与重试回归。
- 浏览器桌面和窄屏实际检查底图、标记、弹窗、键盘 Enter/空格及署名；生产构建还须验证 Worker/CSS 输出。
- 高德 `/tests/travel-map-focus.html` 的既有回归保持通过。

### 7. Wrong vs Correct

```tsx
// Wrong: 将现有高德适配器输出误当 WGS84。
<OpenFreeMap places={catalog.map(toMapPlace)} label="地点" />

// Correct: 提供原始 WGS84 坐标，展示字段按需映射。
<OpenFreeMap places={catalog.map(place => ({
  id: place.id, name: place.name, coord: place.wgs84, note: place.note,
}))} label="地点" />
```
