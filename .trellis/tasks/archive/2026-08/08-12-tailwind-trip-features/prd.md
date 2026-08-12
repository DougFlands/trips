# Tailwind UI and independent trip features

## Goal

把现有旅行站点改成 Tailwind 驱动、可按旅行独立演进的静态 React 页面。青岛—烟台—威海是第一个独立 feature；后续目的地可以拥有自己的视觉样式和页面模块，同时继续复用应用入口、旅行注册与地图能力。

## Background and confirmed facts

- 当前是 Vite + React 19 + TypeScript 单页静态站点，浏览器入口是 `src/main.tsx`，入口解析在 `src/App.tsx`。
- 当前旅行详情由 `src/TripPage.tsx` 统一渲染，青岛数据在 `src/trips/qingdao-yantai-weihai/trip.ts`，注册表在 `src/trips/index.ts`，高德地图隔离在 `src/TravelMap.tsx`。
- 现有 `src/styles.css` 约 1,000 行，承载整站黄色赛博朋克样式；用户要求详情页样式不再成为所有旅行的默认样式。
- 工作区已有用户未提交改动，不能重置、覆盖或回滚；改造需在现状上增量完成。
- Tailwind、shadcn/ui、ReUI、Kibo UI 都围绕源码可控的 Tailwind 组件方式工作：shadcn 作为基础组件来源，ReUI/Kibo UI 通过 registry/CLI 按需加入源码，不安装整套不可控运行时。

## Requirements

### R1. Tailwind 基础

- 安装并配置 Tailwind CSS，使用 Vite 插件和项目现有 Vite/React/TypeScript 架构。
- 建立 shadcn 兼容配置（`components.json`、`src/components/ui`、路径别名和 CSS 变量主题）。
- 依赖和配置可通过 `npm install`、`npm run build` 复现；不引入路由库、全局状态库或地图替代实现。

### R2. 组件与 skills 基础

- 提供可检查、可修改的本地 UI primitives，并以 Tailwind utility classes 为组件样式来源。
- 配置 shadcn registry，并预留 ReUI、Kibo UI registry/CLI 的安装入口和项目内使用说明；按需安装少量能服务当前旅行页的组件，不把三个 registry 的全部组件复制进仓库。
- 在项目 skills 目录增加面向后续 agent 的 shadcn/ReUI/Kibo UI 使用说明，包含查找、安装、审查生成源码和验证步骤。

### R3. 青岛旅行独立 feature

- 将青岛—烟台—威海详情页及其专属数据、地图旁列表、逐日计划、吃饭计划、预订清单、页脚样式迁移到 `src/features/qingdao/`（或等价清晰的 feature 边界）。
- 青岛 feature 保持当前 URL `/trips/qingdao-yantai-weihai/`、逐日筛选、点位聚焦、地图 loading/missing/error 状态、外链和移动端行为。
- 青岛视觉样式改为该 feature 的 Tailwind class/局部样式；未来 feature 不需要复制青岛页面样式即可使用自己的外观。

### R4. 公共边界

- `src/App.tsx` 和 `src/main.tsx` 保持应用入口职责；旅行注册表、类型和高德地图能力保留公共位置或抽成明确公共模块。
- 只有跨旅行确实复用的 UI 才进入公共组件；旅行内容和旅行专属布局留在 feature 目录。
- 新增旅行时，只需新增 feature/data 并注册，不复制整个应用入口。

## Acceptance Criteria

- [ ] `package.json`、lockfile、Vite/Tailwind/shadcn 配置和 README 能说明并复现本地安装与开发流程。
- [ ] 详情页主要布局不再依赖旧的全局页面 CSS；青岛专属样式集中在 feature 范围，且首页/404 不被青岛主题意外污染。
- [ ] `/`、`/trips/qingdao-yantai-weihai/`、未知路径均可渲染；青岛日期筛选、地图点位/路线、点位聚焦和外链行为保持可用。
- [ ] 至少一个本地 shadcn 风格 primitive 在页面中实际使用；ReUI/Kibo UI 的 registry/skills 配置可用于后续按需添加组件。
- [ ] `npm run lint`、`npm run typecheck`、`npm run build`、`npm audit` 通过；生成的生产 bundle 不包含服务端高德安全密钥。
- [ ] 桌面和窄屏布局检查通过，地图保留明确 loading、missing-config 和 error 状态。

## Component audit and resolved scope

根据当前 `TripPage` 的交互，第一批按需下载并使用这些源码组件：

| 页面模块 | 组件 | 来源 | 用途 |
|---|---|---|---|
| CTA、滚动、定位、地图跳转 | `Button` | shadcn/ui | 统一键盘焦点、变体和外链动作 |
| 日期筛选 | `Tabs` | shadcn/ui | 受控的 `all`/日期筛选，保留 `aria-pressed` 等可访问语义 |
| 指标、分数、状态 | `Badge` | shadcn/ui | DAYS/CITIES/MAP NODES、评分、在线状态 |
| 日程、餐饮、预订卡片 | `Card` | shadcn/ui | 统一卡片结构，青岛主题通过 class 覆盖 |
| 临行提示 | `Alert` | shadcn/ui | 旅行数据中的 alert 信息 |
| 点位长列表 | `ScrollArea` | shadcn/ui | 地图侧栏滚动容器 |
| 模块分隔 | `Separator` | shadcn/ui | 章节和卡片内部层次 |
| 路线日期条 | `Timeline` | ReUI | 将当前横向 route strip 表达成可筛选路线节点 |
| 重要通知 | `Announcement` | Kibo UI | 作为 alert 的可组合通知外壳；不新增复杂交互 |

不下载 Data Grid、Calendar、Gantt、Kanban、Editor、Dropzone 等与静态旅行页无关的组件。地图 canvas、marker、popup 保留当前 AMap 专用 DOM/CSS，因为它们不是普通 UI 组件。

对应 skills：接入官方 shadcn skill；接入 ReUI skill；项目内增加一份 Kibo UI 使用约定（Kibo 官方提供 CLI/registry，但当前未提供同等 Codex skill），三者都要求先查真实 API、审查生成源码、再接入 feature。

以上组件审查和下载范围已按用户回复确定，不再保留产品决策问题。

## Out of scope

- 不改高德代理协议、环境变量命名或旅行数据内容。
- 不为本轮新增第二个真实旅行目的地。
- 不复制或全量 vendoring 三个 registry 的组件，不引入完整 UI 框架运行时。
- 不改变现有 URL 解析方式为路由库。
