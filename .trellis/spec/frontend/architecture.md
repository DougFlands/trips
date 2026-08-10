# Frontend Architecture

## Current Shape

- `src/main.tsx` 是唯一浏览器入口。
- `src/App.tsx` 解析 `/`、`/trips/<slug>/` 与站内 404。
- `src/TripPage.tsx` 是唯一旅行详情渲染器。
- `src/TravelMap.tsx` 隔离高德地图脚本、实例与覆盖物。
- `src/trips/index.ts` 是旅行注册表。
- `src/trips/<slug>/trip.ts` 保存单趟旅行数据。
- `src/styles.css` 保存全站黄色赛博朋克视觉系统。

## Local Patterns

- 每趟旅行一个目录；景点放在 `stops` 数组中。
- 旅行数据只使用可序列化的 TypeScript 值。
- UI 筛选使用组件本地状态，不增加状态库。
- 路由使用 `window.location.pathname` 和普通链接，不增加路由库。
- 只有跨旅行复用的 UI 才进入公共组件。

## Design Decision: Trip Folder, Stop Data

旅行是独立维护和发布的内容单元，因此使用目录。景点数量多、结构重复，默认作为旅行数据项。只有景点拥有专属页面或大量资源时再建立目录。

```text
src/trips/qingdao-yantai-weihai/trip.ts  # correct
src/trips/qingdao/yantai-station/...     # avoid
```

## Scenario: Static Trip and AMap Contract

### 1. Scope / Trigger

增加旅行、修改旅行 URL、调整点位数据或高德环境变量时适用。

### 2. Signatures

```ts
findTrip(slug: string): Trip | undefined
TravelMap(props: {
  stops: TripStop[];
  days: TripDay[];
  activeDay: number | "all";
  label: string;
}): JSX.Element
```

页面 URL：`/trips/<Trip.slug>/`。

### 3. Contracts

- `TripStop.day`：`Trip.days` 的零基索引。
- `TripStop.coord`：高德坐标系 `[longitude, latitude]`。
- `VITE_AMAP_KEY`：高德 Web 端 JS API Key，地图加载必需。
- `VITE_AMAP_SECURITY_JS_CODE`：高德安全密钥，地图加载必需。
- 所有 `VITE_` 值会进入浏览器产物，不能放服务端密钥。

### 4. Validation & Error Matrix

| Condition | Behavior |
|---|---|
| 未知 slug | 渲染站内 404，提供首页链接 |
| 任一高德变量缺失 | 显示 `missing` 配置提示，不加载脚本 |
| Loader、Key、白名单失败 | 显示 `error` 提示 |
| 高德加载中 | 显示 `loading` 提示 |
| 日期筛选 | 只显示该日点位与路线 |

### 5. Good / Base / Bad Cases

- Good：新增旅行目录并在 `src/trips/index.ts` 注册，首页和详情页自动复用现有 UI。
- Base：没有高德配置时，行程内容可读，地图区域明确提示配置方式。
- Bad：复制 `TripPage`、把 AMap 实例写入旅行数据、让多个文件各自加载高德脚本。

### 6. Tests Required

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- 浏览器检查 `/`、已知详情 URL、未知 URL、日期筛选和缺失配置状态。
- 移动端检查地图容器与触摸缩放配置。

### 7. Wrong vs Correct

```ts
// Wrong: 每个旅行复制页面
export function QingdaoPage() { /* copied renderer */ }

// Correct: 数据进入唯一渲染器
<TripPage trip={findTrip(slug)} />
```

## Avoid

- 全局 store、路由库、UI 框架或请求库，除非已有功能无法用平台能力完成。
- 直接瓦片 URL、地图 CSS 滤镜或覆盖全页的扫描线遮罩。
- 在组件里重复旅行内容或环境变量名称。
