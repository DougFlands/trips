# 旅行攻略

基于 Vite、React、TypeScript 与高德地图 JS API 2.0 的静态旅行站点。

## 本地运行

将 `.env.example` 复制为 `.env.local`，再填写高德开放平台 Web 端 Key 与安全密钥。已有 `.env.local` 时直接修改变量名和值。

```powershell
npm install
npm run dev
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
2. 在 `src/trips/index.ts` 注册。
3. 访问 `/trips/<slug>/`。

景点直接放在该旅行的 `stops` 数组中。只有景点存在专属页面或大量资源时，才单独建目录。

## Cloudflare Pages

- Framework preset：`Vite`
- Build command：`npm run build`
- Build output directory：`dist`
- 环境变量：`VITE_AMAP_KEY`、`VITE_AMAP_SECURITY_JS_CODE`

站点没有自定义 `404.html`，Cloudflare Pages 会将未知路径交给单页应用入口，详情页可直接访问。
