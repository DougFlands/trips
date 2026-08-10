# Refactor travel site for Cloudflare Pages

## Goal

将现有青岛旅行页重构为可长期维护的静态旅行站点。站点部署到 Cloudflare Pages，后续可持续增加不同旅行目的地，同时保持依赖、目录和构建流程精简。

## Confirmed Context

- 当前项目使用 Vinext、Worker 与 Sites 相关配置，超出纯静态旅行页的需要。
- 页面继续使用 React、TypeScript、Vite 与高德地图 JS API 2.0。
- 保留现有 8 月 26 日起的行程、黄色赛博朋克风格、桌面端滚轮和移动端手势缩放。
- 高德 Key 与安全密钥由项目根目录环境变量提供，用户自行填写。
- 后续会增加其他旅行地点，因此内容与通用页面组件需要分离。

## Requirements

### Runtime and deployment

- 使用纯 Vite + React + TypeScript 生成静态站点。
- Cloudflare Pages 构建命令为 `npm run build`，输出目录为 `dist`。
- 删除 Vinext、Next、Worker、Wrangler、Sites Hosting 等不再使用的代码、配置与依赖。
- 不引入服务端运行时、数据库、CMS 或测试框架。

### Content architecture

- 每趟旅行使用一个目录，存放该旅行的数据及其专属资源。
- 景点默认作为旅行数据中的对象维护，不为每个景点建立文件夹。
- 地图、行程时间线、卡片和页面框架作为跨旅行复用组件。
- 增加新旅行时，只需新增旅行目录并在轻量注册表中登记。

### Map and environment

- 只使用高德地图 JS API 2.0，不保留其他地图实现。
- 使用 `VITE_AMAP_KEY` 与 `VITE_AMAP_SECURITY_JS_CODE`。
- 根目录保留 `.env.example`，真实 `.env` 不提交。
- 地图需要清楚可读，保留缩放、拖动、点位和路线展示。
- Key 缺失、脚本加载中、加载失败时显示明确状态。

### Quality and maintenance

- 使用 Oxlint 做快速静态检查。
- 保留 TypeScript 严格检查与生产构建检查。
- 提供 `lint`、`typecheck`、`build`、`check` 脚本。
- README 说明本地启动、环境变量、增加旅行和 Cloudflare Pages 部署。
- 避免为了抽象而拆分小文件；只有跨旅行复用的 UI 才进入公共组件。

## Acceptance Criteria

- [x] `npm run lint` 通过。
- [x] `npm run typecheck` 通过。
- [x] `npm run build` 通过并生成 `dist`。
- [x] 仓库不再引用 Vinext、Next、Worker、Wrangler 或 `.openai/hosting.json`。
- [x] 当前旅行内容可访问，9 月 26 日起的行程与黄色主题保持完整。
- [x] 高德地图能通过根目录 Vite 环境变量加载，支持滚轮和触摸缩放。
- [x] 新旅行只需新增一个旅行目录和一条注册记录。
- [x] 景点仍以数据项维护，不产生大量景点文件夹。
- [x] README 中的 Cloudflare Pages 构建配置与仓库实际配置一致。

## Validation Record

- `npm run check`：通过。
- `npm audit`：0 vulnerabilities。
- Vite production preview：`/`、旅行详情与未知路径均返回静态应用入口。
- 浏览器：桌面与 390px 移动端通过；09.27 筛选显示 5 个威海点位。
- 高德配置未由任务写入，缺失配置状态已验证；用户填写 `VITE_AMAP_*` 后加载真实底图。

## Out of Scope

- 创建或发布真实 Cloudflare Pages 项目。
- 在线编辑、用户账户、数据库或内容管理后台。
- 为每个景点建立独立详情页。
- 单元测试、端到端测试及其运行框架。

## Decision

- `/` 显示旅行列表。
- `/trips/<slug>/` 显示旅行详情。
- 当前旅行使用 `/trips/qingdao-yantai-weihai/`。
