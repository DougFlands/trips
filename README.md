# 旅行攻略

基于 Vite、React、TypeScript、Tailwind CSS、高德地图 JS API 2.0 与 MapLibre GL JS / OpenFreeMap 的静态旅行站点。

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

地图组件按业务页面直接选择：`src/TravelMap.tsx` 使用高德，`src/OpenFreeMap.tsx` 使用 MapLibre GL JS 渲染 OpenFreeMap 底图。OpenFreeMap 无需 Key；高德沿用上述配置。两套组件独立维护，不使用运行时供应商切换。

### OpenFreeMap 地点标记

`OpenFreeMap` 只接收 **WGS84 `[经度, 纬度]`**，不要直接传入旧高德页面的 GCJ-02 坐标。支持自定义标记、详情弹窗、受控选点、全图取景、缩放与浏览器定位。

```tsx
import { useState } from "react";
import { OpenFreeMap } from "./OpenFreeMap";
import type { MapPlace } from "./map/types";

const places: MapPlace[] = [
  { id: "sapporo", name: "札幌", coord: [141.3545, 43.0618], note: "城市参考位置", markerLabel: "1" },
];

function PlacesMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return <OpenFreeMap places={places} label="旅行地点地图"
    focusPlaceId={selectedId} onSelectPlace={setSelectedId} />;
}
```

省略 `onSelectPlace` 时点击标记直接定位并开窗。`fitMaxZoom` 默认 12，`focusZoom` 默认 14。地点可附加 `markerColor`、`meta`、`url`、`linkLabel`；外链只接受 HTTP(S)。清空选中 ID 可回到全图；传入空数组清理标记。

运行 `npm run dev`，打开 `/tests/openfreemap-map.html` 查看真实地图并点击“运行回归检查”；`?fail=1` 验证网络失败和重试。组件已导入 MapLibre CSS 并配置 Vite Worker；保留底图自动署名。定位需浏览器权限及 HTTPS（localhost 可用）。公共底图依赖网络，失败时可继续阅读地点列表。此组件不提供地点搜索或路线计算。

浏览器打开：

- 旅行列表：`http://localhost:5173/`
- 青烟威详情：`http://localhost:5173/trips/qingdao-yantai-weihai/`
- 汕尾本地两天一夜：`http://localhost:5173/trips/shanwei-two-day-trip/`
- 广东观星地图：`http://localhost:5173/trips/guangdong-stargazing/`

## 常用命令

```bash
npm run lint
npm run typecheck
npm run build
npm run check
node --test tests/stargazing.test.mjs
```

## 观星地点搜索规范

下次搜索其他城市时，沿用这套流程：

1. **设计关键词**：准备 10–12 个组合词，覆盖“城市/周边 + 观星、星空、银河、流星雨、摄影、露营”等表达。每词收集至少 50 个不同帖子 ID；分别统计同词去重和跨词去重。
2. **记录原始来源**：只读 Edge 中可见的小红书页面，保存 `query`、`noteId`、标题、原帖 URL、采集时间、阅读深度和地点提及。搜索卡片不算详情阅读，不能把搜索数量写成已核验数量。
3. **读详情取证**：优先读正文、图片说明和评论，记录实际拍摄证据、地点关系、交通、夜间开放、灯光和天气风险。同作者横评与汇总不要重复计为独立证据。
4. **逐点核坐标**：用天文通按地点搜索，确认选中的地名、腾讯坐标、波尔特、SQM、图层年份和实际搜索词；记录原始匹配名称。再用 LightPollution 在同一 WGS84 点读取估算值、日期、SQM 和匹配标签。两站数据分开保存，查不到就留 `null`。
5. **保留定位精度**：村、景区、山峰、水库、乡政府只能标为参考位置，不能写成精确机位、停车点或开放许可。省外同名、地点关系不清、坐标未核对的记录放入待核清单，不生成地图点。
6. **整理和验收**：每个地图点保留真实详情来源、坐标来源、匹配地名和限制说明；检查 ID 唯一、来源可打开、坐标与两站读数对应。建议输出 `search-records.jsonl`、`detail-records.jsonl`、`places.json` 和 `point-verification.md`。

波尔特数值越小通常越暗；模型估算不等于现场实测，也不把帖子主观等级、VIIRS 数值或“今夜光污染”当统一波尔特等级。

## 增加旅行

1. 在 `src/trips/<slug>/trip.ts` 新增一份 `Trip` 数据。
2. 在 `src/trips/<slug>/page.tsx` 新增该旅行的页面组件和 Tailwind 样式。
3. 在 `src/trips/index.ts` 注册数据与页面组件。
4. 访问 `/trips/<slug>/`。

景点直接放在该旅行的 `stops` 数组中。只有景点存在专属页面或大量资源时，才单独建目录。

`src/App.tsx` 只负责路径解析和入口状态；旅行页面可以共享 `TravelMap`、类型和 UI primitives，但不要复制其他旅行的页面样式。

`src/TravelMap.tsx` 支持旧行程模式和普通地点模式；`src/OpenFreeMap.tsx` 接收 `places` 地点数组与可选的 `focusPlaceId`、`onSelectPlace`。业务页面通过导入组件选择地图，并提供对应坐标系的数据。

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

### 通用表格与自动同步

入口：`/tools/tables/`，首页有“打开记录表格”链接。不同表格可使用不同地址，例如 `/tools/tables/?id=stays`、`?id=expenses`；ID 限字母、数字和连字符，最长 64 个字符。

采用 [ReUI Data Grid](https://reui.io/docs/data-grid)，支持文本、多行文本、数字、金额、日期、单选、多选、勾选和网址。双击或铅笔按钮编辑；多行文本 Enter 换行，Ctrl/⌘+Enter 或失焦保存，Escape 取消。可添加行、添加字段、修改表头名称/类型/选项；行高随内容调整。最多 50 列、1000 行，单份 JSON 不超过 512 KiB。未解锁可读；固定密码验证成功后可编辑，浏览器记住密码，锁定后清除。

本地运行完整表格功能（Node >=22.13）：

```powershell
npm run dev
```

访问 `http://localhost:5173/tools/tables/`。Vite 将 `/api` 请求代理到 `https://trip.flands.com`，开发页面和线上页面共用 D1 数据与编辑密码；`npm run dev:tables` 是兼容别名。不再使用本地 SQLite 数据库。

自动同步：默认每 1 秒合并写入，每 15 秒读取远端；隐藏页面暂停轮询，恢复可见或网络恢复时补读。表格数据只存线上 D1，不写入浏览器存储；未保存修改仅留在当前页面内存，关闭前有浏览器提醒。浏览器仅记住编辑密码。同一份文档并发修改时提示选择保存当前内容或使用云端版本，不进行字段级合并。首次读取失败不会创建空数据覆盖旧记录。

拖动行号旁的手柄可调整整行顺序，也可使用上下箭头；首行不可上移、末行不可下移，只读时隐藏。移动保留所有单元格与 ID，顺序自动同步。编辑、配置字段或拖拽期间暂停应用远端刷新。

旧版字符串表格按多行文本完整读取，打开页面不会写入升级数据；首次修改才按原 revision 保存 v2。字段转换会检查整列：非法数字/日期、含换行文本转单行、删除仍被使用的选项等会提示并保留原数据。

复用入口：

- `src/components/record-table/record-table.tsx`：受控组件 `RecordTable({ value, onChange, readOnly, onEditingChange })`，不依赖密码或服务端；`editable-table.tsx` 保留兼容导出。
- `src/components/record-table/cell-editor.tsx`、`column-settings.tsx`：独立单元格展示/编辑与字段配置；ReUI 上游源码单独放在 `components/reui/data-grid/`。
- `src/lib/table-data.ts`：JSON 类型、校验、旧数据升级、字段转换与行移动；`table-transport.ts` 仅适配表格读写，不改变通用同步协议。
- `src/components/synced-table.tsx`：`SyncedTable({ id, title? })`，组合密码验证、同步状态与表格，可直接嵌入旅行页；北海道第 04 节前使用 `hokkaido-stays`，与 `/tools/tables/?id=hokkaido-stays` 共用数据。
- `src/hooks/use-synced-document.ts`：`useSyncedDocument<T>`，可用于任意通过校验的 JSON 数据；`id`、初始值、验证函数和 transport 保持稳定。
- `src/lib/synced-document.ts`：HTTP transport 与可测试的同步控制器，服务端契约为 `{ data, revision, updatedAt }`。
- `src/hooks/use-edit-access.ts`：共享密码验证、浏览器记忆与锁定。

其他页面直接接云端（相同 ID 共用记录，不同 ID 独立）：

```tsx
import { SyncedTable } from "@/components/synced-table";

<SyncedTable id="trip-expenses" title="旅行费用" />
```

已有自己的状态管理时，使用 `<RecordTable value={table} onChange={setTable} readOnly={false} />`，数据格式由 `TableData` 约束。开发服务的 `/tests/record-table.html` 提供九种字段的内存验收样例。

非表格数据示例（组件内；`initialNote` 和 `isNote` 放模块作用域）：

```tsx
const access = useEditAccess();
const transport = useMemo(
  () => createDocumentTransport(isNote, access.getPassword),
  [access.getPassword],
);
const note = useSyncedDocument({
  id: "notes:travel",
  initialValue: initialNote, // 例如 { text: "" }
  validate: isNote, // 从 unknown 校验业务数据
  transport,
  canEdit: access.canEdit,
});
// note.update({ text: "需要带护照" });
// 显示 note.status / error；用 resolveConflict 处理 note.remote。
```

`onEditingChange={document.setEditing}` 保护尚未提交的单元格输入。若自定义编辑器保有输入草稿，也应在编辑开始/结束时调用此方法。

生产项目为 `trips`，域名 `trip.flands.com`。2026-11-21 已创建 D1 `travel-notes`（`e5eae112-49ba-4e25-894c-09eb142f41dd`）、执行建表 SQL，并保存生产环境 `DB` binding 和加密的 `TABLE_EDIT_PASSWORD`。已部署并通过真实 HTTPS 双页面读写验收；密码不写入仓库。预览环境暂未绑定生产数据库。

线上入口：[通用记录](https://trip.flands.com/tools/tables/) · [住宿记录](https://trip.flands.com/tools/tables/?id=stays)。更换 `id` 即可使用独立表格。

迁移或新环境接入步骤（代码包含 `functions/api/`、`server/documents.js` 和 `migrations/0001_documents.sql`）：

1. 在目标账号创建 D1 数据库，在 D1 Console 执行 `migrations/0001_documents.sql`。
2. 在原 Pages 项目的 Settings → Bindings 添加 D1 binding，变量名 **DB**，选择该数据库。
3. 在 Settings → Variables and Secrets 添加 Secret **TABLE_EDIT_PASSWORD**，填写固定编辑密码。生产代码没有默认密码。
4. 将本次代码部署到同一 Pages 项目，使 API、binding 和 Secret 生效；预览环境也需单独配置。
5. 两个页面验证实际云端同步。未配置数据库/密码返回 503，不会显示保存成功。

读取接口公开，写入接口核对共享密码。密码不进入前端构建产物；按本工具的简单使用方式，验证后的密码保存在该浏览器 localStorage 中。

```powershell
npm run test:tables
npm run check
npx wrangler pages functions build functions --outdir work/pages-functions
```

非表格 Hook 验收页：开发服务下的 `/tests/synced-document.html`，使用同一 API 保存普通备忘 JSON。

### 现有站点部署

- Framework preset：`Vite`
- Build command：`npm run build`
- Build output directory：`dist`
- 构建变量：`VITE_AMAP_KEY`
- Pages Secret：`AMAP_SECURITY_JS_CODE`（加密保存，供 `functions/_AMapService` 使用）

生产环境通过 Pages Function 代理高德请求，安全密钥不会进入浏览器产物。开发环境仍可在 `.env.local` 中填写 `VITE_AMAP_SECURITY_JS_CODE`。

站点没有自定义 `404.html`，Cloudflare Pages 会将未知路径交给单页应用入口，详情页可直接访问。
