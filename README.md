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

## 常用命令

```bash
npm run lint
npm run typecheck
npm run build
npm run check
```

## 增加旅行

1. 在 `src/trips/<slug>/trip.ts` 新增一份 `Trip` 数据。
2. 在 `src/trips/<slug>/page.tsx` 新增该旅行的页面组件和 Tailwind 样式。
3. 在 `src/trips/index.ts` 注册数据与页面组件。
4. 访问 `/trips/<slug>/`。

景点直接放在该旅行的 `stops` 数组中。只有景点存在专属页面或大量资源时，才单独建目录。

`src/App.tsx` 只负责路径解析和入口状态；旅行页面可以共享 `TravelMap`、类型和 UI primitives，但不要复制其他旅行的页面样式。

## Cloudflare Pages

- Framework preset：`Vite`
- Build command：`npm run build`
- Build output directory：`dist`
- 构建变量：`VITE_AMAP_KEY`
- Pages Secret：`AMAP_SECURITY_JS_CODE`（加密保存，供 `functions/_AMapService` 使用）

生产环境通过 Pages Function 代理高德请求，安全密钥不会进入浏览器产物。开发环境仍可在 `.env.local` 中填写 `VITE_AMAP_SECURITY_JS_CODE`。

站点没有自定义 `404.html`，Cloudflare Pages 会将未知路径交给单页应用入口，详情页可直接访问。
