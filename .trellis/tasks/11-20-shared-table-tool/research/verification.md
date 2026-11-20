# 本地实现与验收记录

日期：2026-11-20。主会话直接实现与检查，无子代理。

## 已实现

- EditableTable、useSyncedDocument<T>、HTTP transport、共享密码 hook 和 `/tools/tables/` 页面。
- Pages Functions、D1 SQL 迁移与 Node 原生 SQLite 本地开发服务；无新增 npm 依赖。
- 通用 Hook 可保存普通 `{note: string}`，示例在 `tests/synced-document.html`，与表格无导入依赖。

## 已验证

- `npm run check`：Oxlint、TypeScript、Vite 构建通过；仅原有大 chunk 提醒。
- `npm run test:tables`：核心同步竞争/恢复测试及实际 SQLite SQL、鉴权/版本/容量边界测试。
- `npx wrangler pages functions build functions --outdir work/pages-functions`：Worker 编译成功。
- Playwright + 隔离的 Edge 测试上下文访问真实本地服务：密码错误只读、正确解锁、双击编辑、表头修改、添加行列、刷新后数据和权限恢复。
- 两页面自动轮询读取另一页保存值；并发编辑显示冲突，选择云端版本成功。
- Escape 取消、合成 IME Enter 不提交；390px 视口文档宽度为 390，表格在 348px 容器内横向滚动。
- 浏览器离线写入产生失败状态及持久草稿，网络恢复后自动保存；主动锁定同步到另一标签页，刷新保持只读。
- 非表格 JSON Hook 验收页输入和刷新持久化成功。
- 截图：忽略目录 `work/table-desktop.png` 与 `work/table-mobile.png`。

## 生产环境配置（2026-11-21）

- 用户要求配置线上环境，并指定 GPT 插件控制 Edge。通过 Edge extension 连接已有 Cloudflare 登录态。
- 生产 Pages 项目 `trips`，GitHub `DougFlands/trips`，自动部署分支 `main`，域名 `trip.flands.com` / `trips-7o3.pages.dev`。
- D1 `travel-notes` 已创建，UUID `e5eae112-49ba-4e25-894c-09eb142f41dd`；控制台执行 `0001_documents.sql` 对应 SQL 成功。
- 生产环境绑定 `DB → travel-notes` 已保存；`TABLE_EDIT_PASSWORD` 已作为密钥加密保存。没有修改现有高德配置。
- 免费额度仪表板显示 5 GB 总存储、每天 500 万行读取 / 10 万行写入。
- 功能提交 `71bf689` 与路由修复 `eecaa29` 已推送 main，Pages 自动生产部署成功。预览环境未接生产数据库。
- 原有北海道餐饮修改和另一个研究目录未纳入本任务。

## 生产验收与修复

- 实际生产路由 `params.id` 保留 `%3A`，本地曾提前解码，导致首版线上读请求 400。修复为 Pages 路由解码一次，本地服务改为复用同一入口。
- 新增真实路由 + SQLite 回归：命名空间 ID 创建、编码/未编码读取、双重编码及畸形编码拒绝。12 项测试、完整 check 与 Functions 编译通过。
- Edge GPT 插件打开 `https://trip.flands.com/tools/tables/?id=sync-check-20261121`：错误密码仍只读，正确密码解锁，新增行后显示已同步。
- 第二页自动恢复密码，读取第一页面数据；第一页双击单元格写入“同步验收 A”，第二页无需手动刷新自动显示。
- 第二页备注写入“第二页回写成功”，第一页无需手动刷新自动显示；重新加载后数据及有效编辑权限保留。
- 测试数据仅保留在独立 `sync-check-20261121` 表，正式 `notes` 和 `stays` 未写入测试数据。
