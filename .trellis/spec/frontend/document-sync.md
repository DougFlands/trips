# 通用文档同步

## 1. Scope / Trigger

改表格、通用数据持久化、密码编辑状态、Pages Functions 或 D1 时阅读。前端仍静态部署；通用小量动态数据通过同源 Pages Functions 读写。

## 2. Signatures

- `RecordTable({ value, onChange, readOnly, onEditingChange })`；`EditableTable` 为兼容导出。`TableData = { schemaVersion: 2, columns: {id,name,type,options?}[], rows: {id,cells}[] }`；`CellValue = string | number | boolean | string[] | null`。
- `createTableTransport(getPassword)` 读取 v1/v2，返回 v2；`table-data.ts` 提供纯校验/迁移/字段转换/行移动。`SyncedTable({id,title?})` 包装权限和同步；单元格编辑/字段设置与 ReUI 上游源码分目录。
- `useSyncedDocument<T>({ id, initialValue, validate, transport, canEdit?, saveDelay?, pollInterval? })`。
- transport：`read(id, signal) -> VersionedDocument<T> | null`；`write(id, data, expectedRevision, signal) -> VersionedDocument<T>`。
- GET/PUT `/api/documents/:id`；POST `/api/edit-access`。
- `functions/api/_middleware.js::onRequest({request,next})` 统一处理开发源 CORS；OPTIONS 预检不进入密码/数据库处理器。
- D1：`documents(id PRIMARY KEY, data JSON text, revision INTEGER, updated_at TEXT)`，迁移 `migrations/0001_documents.sql`。

## 3. Contracts

- 响应 `{data, revision, updatedAt}`；PUT `{data, expectedRevision}`。首次创建预期版本 0，成功为 1；后续原子条件更新并递增。
- ID 为 `[a-zA-Z0-9][a-zA-Z0-9:_-]{0,127}`，JSON 上限 512 KiB。表格额外限制 50 列、1000 行；列/行稳定 ID 独立于名称和位置。
- 行顺序以 `rows` 数组为准；通过拖拽手柄移动整行，保留 ID 与全部单元格，沿用自动同步与版本冲突处理。只读隐藏手柄，不提供额外上下移动按钮。
- ReUI 使用 TanStack v9 `useTable` + `dataGridFeatures`，显式 `manualPagination: true`、关闭排序；稳定 `getRowId` 与 DnD `dataIds` 一致。拖拽、单元格编辑、字段设置通过 `onEditingChange` 暂停远端覆盖；取消/锁定/卸载释放。使用自定义编辑器保留多行 Enter 换行；编辑器内部切焦点不提交。
- 九种字段为 text/multiline/number/currency/date/select/multiselect/checkbox/url。数字必须有限，空数字为 null，0/false 不作空；金额只在展示时保留两位。日期为校验过的 YYYY-MM-DD；网址仅 HTTP(S)。单行文本拒绝换行；选项最多100个且唯一。
- v1 全字符串列在内存中变为 multiline，保持值、ID、顺序、revision、updatedAt；读取不写，首次实际修改才保存 v2。不推测旧字段类型。字段转换必须整列成功，失败返回行号；禁止删除已使用选项或截断文本（如 `001` 转数字）。旧客户端读到 v2 拒绝解码，旧 revision 写入由 409 拦截。
- ReUI registry 的 Checkbox 需适配项目 Radix API：部分选中用 `checked="indeterminate"`；沿用 `@/lib/utils` 的 cn，不能引入同名第三方包。保留上游 `use no memo` 指令，目前构建的指令提示不影响未启用 React Compiler 的项目。
- Pages Functions 的 `params.id` 保留 URL 编码，路由边界必须 `decodeURIComponent` 一次后交给业务校验；格式错误返回 400。API 测试复用真实路由入口，覆盖 `tables%3Anotes` 的创建/读取，避免本地提前解码掩盖生产差异。
- DB binding `DB`；Secret `TABLE_EDIT_PASSWORD`。客户端发送 `X-Edit-Password: encodeURIComponent(password)`；服务端核对，不能仅信任客户端 unlocked 布尔值。
- 只有读取的 404 表示不存在；格式错误、网络失败、503 不可当空文档。所有 API 响应禁缓存。
- `requestDocumentApi` 在 Vite DEV 环境将 `/api/...` 拼接到 `https://trip.flands.com`，由浏览器直接访问，生产环境保持同源；读、写、密码验证必须经过同一入口。不使用 Vite Node 转发（不自动继承 Windows 系统代理，曾导致频繁12秒超时），不启动本地数据库。12秒超时转换为中文 DocumentError(504)，调用方取消保持原取消信号；HTML响应仍拒绝解码。
- CORS 精确允许 HTTP/HTTPS 的 localhost、127.0.0.1 源及任意合法端口；不接受 null、其他域名、域名后缀或局域网IP。同源/无Origin请求沿用原流程。允许源的 GET/PUT/POST 预检只放行 Content-Type、X-Edit-Password，返回204；未知来源/方法/头返回403。成功和400/401/404/409/413/503响应均带对应 Allow-Origin 与 Vary: Origin，禁止通配符及 Allow-Credentials；写操作仍验证密码/revision。
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
| 字段转换失败/删除已用选项 | 提示具体行号，整列和原配置保持不变 |
| v1 读取 | 内存升级 v2，云端版本与 JSON 不变 |
| 允许的本地源 OPTIONS | 204，允许方法和请求头，无数据库操作 |
| 未批准跨域来源/预检头 | 403；未知来源不返回 Allow-Origin |
| 请求12秒超时 | 中文错误，页面保留修改；用户取消不改写为超时 |

## 5. Good / Base / Bad

- Good：纯组件只接收数据、只读和回调；业务注入通用 hook；端点基于 revision 原子写入。
- Base：`npm run dev:tables` 是 `npm run dev` 的兼容别名，开发和线上使用相同数据。测试用内存 SQLite 验证 SQL，不作为应用存储。
- Bad：把整表塞到 KV 后无条件覆盖，或用 localStorage 的 `unlocked=true` 代替密码校验。

## 6. Tests Required

- `npm run test:tables`：节流尾部、慢写入、新编辑、并发冲突、离线恢复、响应丢失、初始读取失败、旧实例响应、重开页面仅加载云端数据；实际 SQLite 执行与 D1 同语义的 SQL。
- `npm run check`；`npx wrangler pages functions build functions --outdir work/pages-functions`。
- 浏览器桌面和窄屏：双击、铅笔、Enter 换行、Ctrl/⌘+Enter 或失焦保存、Escape 取消、IME、改表头、行列新增、密码恢复/锁定、两页面同步、当前页面离线重试。单元格与表头使用自动高度 Textarea（field-sizing-content），显示时保留换行。
- `/tests/synced-document.html`：普通备忘 JSON 复用同一 hook，不能只测试表格。
- `/tests/record-table.html`：内存样例覆盖九种字段、12行不分页、变高行拖拽、只读和窄屏横向滚动。`table-data.test.mjs` 覆盖类型/迁移/无损转换；`table-transport.test.mjs` 使用真实 API 处理器与内存 SQLite 覆盖只读迁移不写、v2回读、401/409，不连接生产数据库。
- CORS测试必须覆盖预检不进入业务、精确源校验、拒绝未知头、401/409可读、真实路由PUT/GET保持密码/版本契约；开发 transport 测试断言请求绝对线上URL。发布后用浏览器本地页面确认跨域成功，不能仅依靠 curl（curl不执行CORS策略）。

## 7. Wrong vs Correct

```sql
-- Wrong: 两个客户端可静默覆盖
UPDATE documents SET data = ? WHERE id = ?;
-- Correct: 比较并更新，RETURNING 返回本次写入的精确版本
UPDATE documents SET data = ?, revision = revision + 1, updated_at = ?
WHERE id = ? AND revision = ? RETURNING data, revision, updated_at;
```
