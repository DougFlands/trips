# Technical Design

## Approach

将项目降为纯浏览器静态应用。Vite 输出 `dist`，Cloudflare Pages 直接托管。React 只负责旅行列表、详情页、筛选状态与高德地图生命周期。

## File Shape

```text
index.html
src/
  main.tsx
  App.tsx
  TripPage.tsx
  TravelMap.tsx
  styles.css
  trips/
    index.ts
    types.ts
    qingdao-yantai-weihai/
      trip.ts
```

- `main.tsx`：浏览器入口。
- `App.tsx`：用 `window.location.pathname` 解析首页、旅行详情和 404。不引入路由库。
- `TripPage.tsx`：唯一旅行详情渲染器。
- `TravelMap.tsx`：唯一高德 JS API 边界。
- `trips/index.ts`：旅行注册表和 slug 查询。
- 每个旅行目录只保存该旅行的数据与专属资源。

## URL Behavior

- `/`：旅行列表。
- `/trips/<slug>/`：旅行详情。
- 未知路径：站内 404，并提供返回首页链接。
- Cloudflare Pages 在没有顶层 `404.html` 时按 SPA 回退到 `index.html`；仓库不增加自定义 Worker。

## Data Contract

`Trip` 保存标题、日期、城市、提示、逐日安排、地图点位、预订事项、饮食提示和外部链接。`TripStop.day` 对应 `Trip.days` 的索引。点位坐标使用高德坐标系 `[lng, lat]`。

旅行数据保持可序列化；组件实例、DOM 节点和回调不进入旅行文件。景点仍是 `stops` 数组项。

## AMap Boundary

- 从 `import.meta.env.VITE_AMAP_KEY` 和 `VITE_AMAP_SECURITY_JS_CODE` 读取配置。
- 加载官方 `https://webapi.amap.com/loader.js`，再请求 JS API 2.0。
- 使用普通底图，不叠加全局滤镜或扫描线遮罩。
- 开启拖动、滚轮、双击、键盘和触摸缩放。
- 加载状态分为 `missing`、`loading`、`ready`、`error`。
- 点位切换时只重建覆盖物；组件卸载时销毁地图实例。

## Dependencies

运行依赖只保留 React 与 React DOM。开发依赖保留 Vite、React 插件、TypeScript、React 类型和 Oxlint。删除 Vinext、Cloudflare Vite 插件、Wrangler、RSC 与 `cross-env`。

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- 搜索旧框架名和旧环境变量名。
- 本地打开 `/` 与 `/trips/qingdao-yantai-weihai/`，检查响应和页面渲染。
- 有高德配置时检查底图；无配置时检查缺失配置提示。
