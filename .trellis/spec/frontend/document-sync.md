# 通用文档同步

## 1. Scope / Trigger

改表格、通用数据持久化、密码编辑状态、Pages Functions 或 D1 时阅读。前端仍静态部署；通用小量动态数据通过同源 Pages Functions 读写。

## 2. Signatures

- `EditableTable({ value, onChange, readOnly, onEditingChange })`；`TableData = { schemaVersion: 1, columns: {id,name}[], rows: {id,cells}[] }`。
- `useSyncedDocument<T>({ id, initialValue, validate, transport, canEdit?, saveDelay?, pollInterval? })`。
- transport：`read(id, signal) -> VersionedDocument<T> | null`；`write(id, data, expectedRevision, signal) -> VersionedDocument<T>`。
- GET/PUT `/api/documents/:id`；POST `/api/edit-access`。
- D1：`documents(id PRIMARY KEY, data JSON text, revision INTEGER, updated_at TEXT)`，迁移 `migrations/0001_documents.sql`。

## 3. Contracts

- 响应 `{data, revision, updatedAt}`；PUT `{data, expectedRevision}`。首次创建预期版本 0，成功为 1；后续原子条件更新并递增。
- ID 为 `[a-zA-Z0-9][a-zA-Z0-9:_-]{0,127}`，JSON 上限 512 KiB。表格额外限制 50 列、1000 行；列/行稳定 ID 独立于名称和位置。
- Pages Functions 的 `params.id` 保留 URL 编码，路由边界必须 `decodeURIComponent` 一次后交给业务校验；格式错误返回 400。API 测试复用真实路由入口，覆盖 `tables%3Anotes` 的创建/读取，避免本地提前解码掩盖生产差异。
- DB binding `DB`；Secret `TABLE_EDIT_PASSWORD`。客户端发送 `X-Edit-Password: encodeURIComponent(password)`；服务端核对，不能仅信任客户端 unlocked 布尔值。
- 只有读取的 404 表示不存在；格式错误、网络失败、503 不可当空文档。所有 API 响应禁缓存。
- `npm run dev` 使用 Vite，将 `/api` 代理到 `https://trip.flands.com`，共用线上 D1 与编辑密码，不启动本地数据库。客户端拒绝 200 HTML 回退响应，显示可读服务错误并保留当前页面修改。
- hook 的配置初始值、验证函数、transport 需稳定；组件 key 或 hook id 改变后，旧请求不得回写新资源。
- 1 秒尾部节流，写串行；15 秒轮询；隐藏页面暂停，online/visible 后恢复。新修改不能被旧写响应覆盖。
- 表格数据不写入 localStorage/sessionStorage，不恢复旧草稿；未保存修改仅留在页面内存，关闭前提示。仅编辑密码允许浏览器记忆。有未提交输入时通过 setEditing 暂停应用远端数据，离开时清理请求与定时器。
- 冲突保留双方版本并暂停保存；确认保留本地后仍以最新 revision 条件写入，不能无条件覆盖。
- `SyncedDocument<T>` 与表格类型分离；新业务只提供 JSON 校验函数、稳定初始值与 resource id。

## 4. Validation & Error Matrix

| 条件 | 结果 |
| --- | --- |
| 首次读失败 | 错误、不可写；不创建空记录 |
| 未配置 DB/密码 | 对应接口 503 |
| 密码错误 | 401，只读；当前页面保留未保存修改 |
| 同版本两个创建/更新 | 一个成功，另一个 409 |
| 非法 ID/JSON/版本号 | 400 |
| 请求或 JSON 超限 | 413 |
| 保存期间继续改动 | 旧响应仅确认其提交，尾部继续保存 |
| 成功写入但响应丢失 | 重读对账，相同数据确认成功，避免盲目重复写 |
| 离线 | 显示失败，修改仅在当前页面保留，不误报已同步 |

## 5. Good / Base / Bad

- Good：纯组件只接收数据、只读和回调；业务注入通用 hook；端点基于 revision 原子写入。
- Base：`npm run dev:tables` 是 `npm run dev` 的兼容别名，开发和线上使用相同数据。测试用内存 SQLite 验证 SQL，不作为应用存储。
- Bad：把整表塞到 KV 后无条件覆盖，或用 localStorage 的 `unlocked=true` 代替密码校验。

## 6. Tests Required

- `npm run test:tables`：节流尾部、慢写入、新编辑、并发冲突、离线恢复、响应丢失、初始读取失败、旧实例响应、重开页面仅加载云端数据；实际 SQLite 执行与 D1 同语义的 SQL。
- `npm run check`；`npx wrangler pages functions build functions --outdir work/pages-functions`。
- 浏览器桌面和窄屏：双击、铅笔、Enter/Escape、IME、改表头、行列新增、密码恢复/锁定、两页面同步、当前页面离线重试。
- `/tests/synced-document.html`：普通备忘 JSON 复用同一 hook，不能只测试表格。

## 7. Wrong vs Correct

```sql
-- Wrong: 两个客户端可静默覆盖
UPDATE documents SET data = ? WHERE id = ?;
-- Correct: 比较并更新，RETURNING 返回本次写入的精确版本
UPDATE documents SET data = ?, revision = revision + 1, updated_at = ?
WHERE id = ? AND revision = ? RETURNING data, revision, updated_at;
```
