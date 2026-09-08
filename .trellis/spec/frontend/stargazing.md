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
- 模型 Bortle 保存原区间、SQM、年份、查询 WGS84。未知在升降序都排最后；区间用 max 保守排序，同级按距离、ID 稳定排序。
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

## UI composition and motion

- 搜索与排序复用 Input、Select、FieldGroup/Field；FieldGroup 带 inline-size containment，在 flex 工具栏里必须给可用宽度，不能仅设 w-auto（固有宽度会归零）。
- 七晚选择使用 single ToggleGroup；空 value 不清除当前日期。方向键移动焦点，空格选择日期。
- 列表复用 Card 子组件、Button、Separator 和 ScrollArea；卡片不缩高、摘要不截断。滚动视口 max-height 限制列表，单点筛选时高度自然收缩。
- 天气表复用 Table，containerLabel 使真实横向滚动容器可聚焦且有名称；不是给外层不滚动的容器加 tabIndex。
- 提示使用 Alert，空状态使用 Empty，来源使用 Accordion；更新状态使用 Spinner 与 Progress。Progress 必须把 value 传给 Radix Root，保持 aria-valuenow 与可见进度一致。
- 轻量动画限定在本页：卡片颜色/按压、列表及详情入场、日期天气切换、Accordion高度过渡和请求进度。天气刷新不重挂地图；日期切换不重挂整页。prefers-reduced-motion 同时关闭 animation 和 transition。
- 注册表生成代码的 cn 必须指向 @/lib/utils，不安装同名 cn 包。图标使用配置的 lucide-react；检查生成组件的依赖与可访问语义。

- 内置预览中原生select曾出现点击不显示选项；排序使用Radix Select。SelectContent渲染到portal，必须附带本页主题类及popover颜色、减少动态效果规则。
- 下拉验收必须实际点击Trigger、确认可见listbox、点击Option并检查列表首项；selectOption直接设置值不能证明菜单可点击。至少覆盖内置浏览器、键盘选择及窄屏弹层边界。

- 地点详情遵循最新精简约定：顶部以波尔特级别替代“地点笔记”，右上角并排“图层”“查看地点”纯文字按钮；不展示位置精度段落、光污染前缀或模型年份说明。模型出处保留在数据与来源中；不重复天气区标题/介绍。精度仍保留在数据与地图说明，表格可访问标题保留地点和日期。
