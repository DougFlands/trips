# Stargazing map and cached forecasts

## 1. Scope / Trigger

`src/trips/guangdong-stargazing/` 是没有逐日行程的地点目录。修改其坐标、共享地图或天气存储时适用。

## 2. Signatures

- `TravelMap({ places: MapPlace[], focusPlaceId?, onSelectPlace?, theme: "paper", label })`。与行程 props 互斥；旧模式继续接收 stops/alternatives/days/activeDay。
- `wgs84ToGcj02([lng, lat]): [lng, lat]`、`distanceKm(a, b): number` 位于 `src/lib/coordinates.ts`。
- `decodeForecast(raw: unknown, points: WeatherPoint[], fetchedAt?): WeatherResult[]`。
- `fetchWeather(points, signal)`、`readWeatherCache(points)`、`saveWeatherCache(records)` 位于 feature 的 `weather.ts`。
- IndexedDB `travel-guides-stargazing` v1，`weather` store，keyPath `placeId`。

## 3. Contracts

- 地点保留 WGS84；天气与距深圳市民中心的 Haversine 计算使用 WGS84，高德 marker/定位使用 GCJ-02。深圳起点 `[114.0545223,22.5463725]`，距离为直线公里。
- POI 与地图视图中心不同。百度分享重定向的 `poi_x/poi_y` 是 BD09MC；`@x,y,z` 可能偏离真实地点数公里，不直接当 POI 坐标。
- 区域参考点写明精度，不把水库中心或山峰当驾车入口。地图普通点位不要求虚构 `score`、day/order，不连行程线。
- 光污染按 `lightPollution` 与 `tianwentong` 分别保存原区间、SQM、年份、核验日、实际采样坐标、坐标系与匹配地名；天文通还保存实际成功的搜索词。目录 WGS84 不被搜索结果覆盖。未知在升降序都排最后；区间用 max 保守排序，同级按距离、ID 稳定排序。
- 有实际拍摄/观星详情与可核地点坐标的点可以保留未知等级；模型未查到不等于地点无效。搜索卡片计数达标不能替代地点整理，定向补查与原始关键词统计分别保存。
- 天空亮度网页的旧弹窗可能遮挡地图点击；读取后必须核对弹窗坐标与当前点一致，不能把上一点数值归给新点。区域模型只代表采样参考位置。
- 天气参数 `forecast_days=8&timezone=Asia/Shanghai&timeformat=unixtime`，九项 hourly 字段与单位由 `weatherFields` 维护。单点 object、多点 array；首点 `location_id` 可能省略（代表0），其余依 ID 映射。网格坐标不能替换 POI。
- 窗口为本地日期18:00到次日06:00（右端不含），七晚；null保留缺测。总云量取已有时段平均，降水取已有时段最大值。
- 启动只读缓存，不请求天气。全量按钮使用完整目录；每批最多10点串行，单点与批量共用防重入锁，卸载取消请求。
- 缓存记录包含 version/provider/placeId/wgs84/fetchedAt/units/hours；时间范围由有序小时序列确定。版本、坐标、单位或数据结构不符的记录不读入。
- 只有 transaction complete 表示持久化成功；request success 后仍可能 abort。网络成功可在内存展示，存储失败必须提示。失败不覆盖旧成功数据。
- 超过10点的多批请求按地点ID保留未保存集合；后批保存成功不能清掉前批失败提示，重新成功保存相应地点才可移除。
- 每分钟仅更新日期/缓存年龄标签，绝不轮询天气。超过6小时提示旧缓存。

## 4. Validation & Error Matrix

| 条件 | 行为 |
| --- | --- |
| 地点数量/ID重复或越界 | 拒绝混乱映射，不写缓存 |
| 单项数组长度/数值范围/单位/时间顺序错误 | 此点失败，其余合法点可成功 |
| 网络失败/超时/取消 | 保留旧成功预报 |
| IndexedDB不可用/blocked | 显示存储提示，手动网络获取仍可用 |
| transaction abort/quota | 不宣称已保存，保留原事务前数据 |
| 日期超出缓存范围 | 无预报，不用0补齐 |
| 高德缺配置/加载失败 | 列表与天气仍可读，显示简短地图状态 |

## 5. Good / Base / Bad

- Good：同一地点可追溯实拍、坐标、2025模型；更新失败仍显示旧天气及其获取时间。
- Base：区域点明确标参考位置，待核信息保留未知。
- Bad：将VIIRS辐亮度或帖子主观等级冒充统一Bortle；把爬山口、山峰、水库中心混为同一点。

## 6. Tests Required

- `node --test tests/stargazing.test.mjs`：gcoord参考值、距离/区间/未知排序、单多点ID、null和非法单位、跨午夜七晚、缓存损坏。
- `npm run lint`、`npm run typecheck`、`npm run build`。
- Edge：首屏零天气请求、单点、筛选后的全量更新、刷新缓存、离线保留、部分失败、事务失败提示、七晚表格。
- 桌面/手机、地图双向选择、首页与旧旅行日期筛选。`/tests/stargazing-map-error.html` 是仅开发使用的 Loader 失败 fixture，刷新恢复真实页面。

## 7. Wrong vs Correct

```ts
// Wrong: filteredPlaces 不应决定全量更新范围；put 的成功也不是事务成功。
updateWeather(filteredPlaces);
request.onsuccess = () => resolve();

// Correct
updateWeather(places);
transaction.oncomplete = () => resolve();
transaction.onabort = () => reject(new Error("未保存"));
```

主题样式限定 `.stargazing` / `.stargazing-map` / `.stargazing-popup`；高德弹窗使用独立主题类。容器高度选择器须限定 `> div[aria-label]`，否则会误把同有 aria-label 的定位按钮拉高。

## 地图首次选点偏移（2026-09-08）

- **现象**：刷新后首次点击全图边缘图标或左侧列表，地图放大但目标未居中；凤凰山天池曾横向偏移约112px，列表首选东涌大排头曾偏移约61px/95px。
- **原因与证据**：高德 `setZoomAndCenter(..., true)` 不取消之前的 `setFitView(..., false)` 动画，旧动画结束后会覆盖新中心。实测调用先后为全图动画、`setZoomAndCenter(11, [114.573709, 22.493189], true)`，最终却回到 zoom 7.13 / center `[113.962401, 23.366699]`。原 effect 每次选点又启动一次全图动画，进一步放大问题。
- **历史区别**：`20a6db9` 曾把弹窗数组索引改为 `infoWindowByPlaceId`，解决点位与弹窗对应错误；该修复未覆盖缩放/自动平移时序。不可因相似症状再次改动坐标数据。
- **首次修复遗漏**：只让选点分支互斥、选点传 `immediately: true`，仍留下启动/查看全图时的动画。曾怀疑弹窗 `autoMove`，但关闭它后仍复现，不作为最终修复。旧替身错误地在立即定位时清空了旧动画；列表验收也只核对选中状态与开窗，未量取稳定后的标记位置。属于隐含 SDK 契约假设与回归覆盖缺口。
- **契约**：有效 `focusPlaceId` 优先；选点与全图/单点默认视图必须互斥。effect 内全部相机操作都立即执行：`setFitView(overlays, true, avoid, maxZoom)`、`setZoomAndCenter(zoom, coord, true)`。启动、筛选、查看全图均不能留下稍后回写的动画。定位后再开窗，保留弹窗原有自动避让。
- **点击分支**：有 `onSelectPlace` 且目标不同于当前 focus 时，仅通知父组件，由 focus effect 定位和开窗。重复点击当前点或无回调的旧地图直接开窗。键盘 Enter/空格共用此路径。

```ts
// Wrong：此前全图动画仍会在稍后覆盖这次立即定位。
map.setFitView(overlays, false);
map.setZoomAndCenter(focusZoom, coord, true);
popup.open(map, coord);

// Correct：按当前状态择一执行，所有分支都不遗留动画。
if (focusedPlace) {
  map.setZoomAndCenter(focusZoom, focusedPlace.coord, true);
  popup.open(map, focusedPlace.coord);
} else {
  map.setFitView(overlays, true, [55, 55, 55, 55], fitMaxZoom);
}
```

回归检查：启动 `npm run dev`，打开 `/tests/travel-map-focus.html`，应显示9项 PASS。fixture 使用真实 React effects 和 SDK 替身，保留旧动画直到显式结算，即使新定位传了 immediately 也不能清空旧动画。覆盖列表首选/跨区域切换、首次图标点击、Enter/空格切换、重复点击、查看全图后再选、单点默认视图/预选及无回调地图。需本地高德配置以通过组件配置守卫，但替身不请求高德。

真实 SDK 验收必须刷新页面重新首选，不能用 HMR 后的第二次点击代替。覆盖桌面/390px窄屏、边缘点、列表选点、查看全图后立即再选、关闭重开和旧行程日期筛选；等地图绘制稳定后，核对目标标记与弹窗同点，弹窗完整可见。最终实测：桌面列表首选东涌、全图后立即选东澳，偏差均约0.2px；390px下列表东涌和地图凤凰山点选均约0.1px（像素舍入）。将全图恢复为动画模式时，回归页首个列表测试应失败；立即模式9项全部通过。

## UI composition and motion

- 省份切换使用 Tabs/TabsList/TabsTrigger/TabsContent；列表/地图 useMemo 必须依赖当前 catalog。列表 ScrollArea key 包含省份，切换回到列表顶部。
- 启动读取两个省份已定位目录的 IndexedDB 缓存，页面缓存计数按当前 catalog 过滤。批量更新只处理当前省份的完整已定位目录；进度和完成提示标注发起省份。
- 湖北逐点记录见 `.trellis/tasks/09-14-hubei-stargazing-research/research/verified-*.json`；`build-hubei.mjs` 生成静态目录，保持旧 ID 以配合按坐标校验缓存。尚未定位的点保留在 `hubeiPending`，不产生地图标记、距离或天气请求。模型未知可保持 null，不能复用另一站读数。
- 地名搜索可能返回乡政府、景区中心或省外同名；只有可说明与原帖关系的具名参考点可入目录。参考位置不得冒充营地、弯道、酒店后土路。天文通保留腾讯原坐标，目录另用 GCJ-02 反算 WGS84，并说明原始显示精度。

- 搜索与排序复用 Input、Select、FieldGroup/Field；FieldGroup 带 inline-size containment，在 flex 工具栏里必须给可用宽度，不能仅设 w-auto（固有宽度会归零）。
- 七晚选择使用 single ToggleGroup；空 value 不清除当前日期。方向键移动焦点，空格选择日期。
- 列表复用 Card 子组件、Button、Separator 和 ScrollArea；卡片不缩高、摘要不截断。滚动视口 max-height 限制列表，单点筛选时高度自然收缩。
- 地图选点由 `selectFromMap(id)` 更新选择并按卡片 `data-place-id` 在当前排序/筛选后的列表定位。只调用 ScrollArea 的 `[data-slot="scroll-area-viewport"]` 的 `scrollTo`，卡片已完整可见时不滚动；否则居中显示。不要直接 `scrollIntoView` 连带滚动整页、把地图移出屏幕。减少动态效果时使用 `instant`，正常时 `smooth`；重复点击同一点也可找回已被手动滚走的卡片。列表自身点击不触发自动滚动。
- 天气表复用 Table，containerLabel 使真实横向滚动容器可聚焦且有名称；不是给外层不滚动的容器加 tabIndex。
- 提示使用 Alert，空状态使用 Empty，来源使用 Accordion；更新状态使用 Spinner 与 Progress。Progress 必须把 value 传给 Radix Root，保持 aria-valuenow 与可见进度一致。
- 轻量动画限定在本页：卡片颜色/按压、列表及详情入场、日期天气切换、Accordion高度过渡和请求进度。天气刷新不重挂地图；日期切换不重挂整页。prefers-reduced-motion 同时关闭 animation 和 transition。
- 注册表生成代码的 cn 必须指向 @/lib/utils，不安装同名 cn 包。图标使用配置的 lucide-react；检查生成组件的依赖与可访问语义。

- 内置预览中原生select曾出现点击不显示选项；排序使用Radix Select。SelectContent渲染到portal，必须附带本页主题类及popover颜色、减少动态效果规则。
- 下拉验收必须实际点击Trigger、确认可见listbox、点击Option并检查列表首项；selectOption直接设置值不能证明菜单可点击。至少覆盖内置浏览器、键盘选择及窄屏弹层边界。

- 地点详情展示两站波尔特、SQM 与各自图层按钮；保留匹配地名和采样坐标供复查。模型年份说明放“数据与来源”；不重复天气区标题/介绍。精度仍保留在数据与地图说明，表格可访问标题保留地点和日期。

## 双站光污染核验（2026-09-14）

- `lightpollutionmap.app/?lat=...&lng=...&zoom=11` 已通过 Edge 验证：定位 WGS84 并展开详情。2025 年图层与详情的 `Sep 2026 · EST.` 不同，采用详情估计值必须记为 2026。
- `darkmap.cn` 的已试 lat/lng/zoom 参数未定位，不能拼出未经验证的坐标链接。图层按钮打开官网并尝试复制 `searchQuery`；页面提示从“地图菜单 → 搜索地点”按 `matchedLocation` 选择。复制失败显示可手动输入的搜索词。
- 天文通读“光污染·2025”下主弹窗波尔特/SQM，不取中国暗夜环境等级、不取随时刻变动的“今夜光污染”。保存“腾讯地图显示坐标”，不直接标 WGS84。
- 搜索结果同名不代表同位置。西涌公司条目落在深圳内陆、蓝坪村首条与云峰山首条偏离约8公里，均已排除。详情数值可能先于底部坐标更新；等新坐标出现后才保存。相邻村落/湖岸参考必须在匹配名称中说明。
- 官网称 LightPollutionMap.app 为天文通国际版，不把两站称为独立测量。两站各自排序、地图等级按钮切换只改标记数值，导航/天气坐标保持目录点。
- `research/light-pollution/` 保存35点/70条读数、搜索词、匹配名称和排除记录。旧 `lightpollutionmap.info` 读数不再用于页面。
