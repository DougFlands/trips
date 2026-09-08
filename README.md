# 旅行攻略

基于 Vite、React、TypeScript、Tailwind CSS 与高德地图 JS API 2.0 的静态旅行站点。

## 本地运行

将 `.env.example` 复制为 `.env.local`，再填写高德开放平台 Web 端 Key 与安全密钥。已有 `.env.local` 时直接修改变量名和值。

```powershell
npm install
npm run dev
```

UI 组件使用 shadcn/ui 的源码模式。ReUI 和 Kibo UI 通过 registry/CLI 按需下载源码，组件落在 `src/components/`，旅行专属组合和样式留在对应的 `src/trips/<slug>/` 目录。

```powershell
# 已配置 ReUI registry；按需安装一个组件
npx shadcn@latest add @reui/timeline

# Kibo UI 组件
npx kibo-ui add announcement
```

```env
VITE_AMAP_KEY=
VITE_AMAP_SECURITY_JS_CODE=
```

浏览器打开：

- 旅行列表：`http://localhost:5173/`
- 青烟威详情：`http://localhost:5173/trips/qingdao-yantai-weihai/`
- 广东观星地图：`http://localhost:5173/trips/guangdong-stargazing/`

## 常用命令

```bash
npm run lint
npm run typecheck
npm run build
npm run check
node --test tests/stargazing.test.mjs
```

## 增加旅行

1. 在 `src/trips/<slug>/trip.ts` 新增一份 `Trip` 数据。
2. 在 `src/trips/<slug>/page.tsx` 新增该旅行的页面组件和 Tailwind 样式。
3. 在 `src/trips/index.ts` 注册数据与页面组件。
4. 访问 `/trips/<slug>/`。

景点直接放在该旅行的 `stops` 数组中。只有景点存在专属页面或大量资源时，才单独建目录。

`src/App.tsx` 只负责路径解析和入口状态；旅行页面可以共享 `TravelMap`、类型和 UI primitives，但不要复制其他旅行的页面样式。

地图组件位于 `src/TravelMap.tsx`，按 `stops`、`alternatives`、`days`、`activeDay` 和 `focusPlaceId` 传入数据即可复用。

广东观星页独立维护于 `src/trips/guangdong-stargazing/`，当前收录 **35 个广东省内点位**，采用 Sketchbook 手帐风和地图的 `places` 模式。列表支持按距深圳市民中心的直线距离、波尔特等级排序，并查看七个夜晚的逐小时天气。天气通过单点或全部更新按钮获取并写入 IndexedDB；打开页面只读缓存，全部更新覆盖完整目录，不受地点筛选影响。跨批写入失败的地点会保留未保存提示，直到对应数据成功写入。

研究通过 Edge 检索小红书：原 12 词共 661 条关联、390 篇独立帖子，补搜新增 28 篇，合计 418 篇独立帖子，其中 50 篇读过详情。点位保留帖子依据、坐标精度和 2025 天空亮度模型来源，波尔特等级标为估算。地图上的区域参考位置不等于精确停车点或夜间开放许可。开发时访问 `/tests/stargazing-map-error.html` 可验收地图加载失败状态；刷新后回到正常页面。

## 风格参考库

以下链接只记录视觉方向，页面按旅行目录单独选用；它们不会成为运行时依赖。关键词用于后续检索，落地时再核对页面细节。

| 风格 | 关键词 | 适合页面 | 参考 |
| --- | --- | --- | --- |
| NERV / Tactical Surveillance | 深色战术控制台、角形切角、等宽字、状态轨道、密集信息 | 监控感路线、状态面板、运营视图 | [NERV surveillance](https://mdrbx.github.io/nerv-ui/examples/surveillance/) |
| Neonblade Badge | 徽章、短标签、状态色、轻量强调 | 地点评分、提醒、路线状态 | [Neonblade badge](https://neonbladeui.neuronrush.com/components/elements/badge) |
| Sketchbook / Hand-drawn | 手绘线条、纸张感、草图标题、随手记卡片 | 轻松旅行日记、手帐式页面 | [Sketchbook UI](https://sarthakrawat-1.github.io/sketchbook-ui/?utm_source=chatgpt.com) |
| Pxlkit Pixel / Linear | 8-bit 像素边框、按压阴影，也可用 linear 平面表面 | 像素旅行主题、地图节点、时间线 | [Pxlkit UI Kit](https://pxlkit.xyz/ui-kit?utm_source=chatgpt.com) |
| Retro UI | 像素组件、硬边框、复古终端、游戏化控件 | 复古城市、老街、游戏化页面 | [Retro UI](https://retroui.io/components) |
| Animal Island | 动物插画、圆润卡片、明快配色、亲子感 | 亲子旅行、轻量景点卡片、活动页 | [Animal Island UI](https://guokaigdg.github.io/animal-island-ui/?utm_source=chatgpt.com#/button) |

### 使用约定

- 页面级风格写在 `src/trips/<slug>/styles.css`，公共组件继续放在 `src/components/`。
- 先定风格关键词，再选字体、色板、边框、阴影和状态组件。
- 组件按需用 shadcn、ReUI、Kibo UI 源码实现，保持旅行页面之间的样式隔离。

## Cloudflare Pages

- Framework preset：`Vite`
- Build command：`npm run build`
- Build output directory：`dist`
- 构建变量：`VITE_AMAP_KEY`
- Pages Secret：`AMAP_SECURITY_JS_CODE`（加密保存，供 `functions/_AMapService` 使用）

生产环境通过 Pages Function 代理高德请求，安全密钥不会进入浏览器产物。开发环境仍可在 `.env.local` 中填写 `VITE_AMAP_SECURITY_JS_CODE`。

站点没有自定义 `404.html`，Cloudflare Pages 会将未知路径交给单页应用入口，详情页可直接访问。
