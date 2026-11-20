# 通用表格与数据同步设计

## 边界与实施顺序

本任务是一条完整的表格保存流程，保留单任务，按依赖顺序实现。先完成纯组件、通用 hook 和本地验收，再连接 Cloudflare；不拆成需要单独发布的子任务。

1. `EditableTable` 负责编辑与行列展示。
2. `useSyncedDocument<T>` 负责通用 JSON 文档状态与同步，不依赖表格字段。
3. HTTP transport 负责同源接口；验证用可控 transport，不把模拟数据当作云端数据。
4. 页面负责资源 ID、密码入口和状态文案。
5. 后续 Pages Functions + D1 实现相同协议，复用现有部署。

## 组件与数据

建议落点：`src/components/editable-table.tsx`、`src/hooks/use-synced-document.ts`、`src/lib/synced-document.ts`、`src/tools/tables/page.tsx`。只有真实复用需要时再拆文件。

```ts
type TableData = {
  schemaVersion: 1;
  columns: { id: string; name: string }[];
  rows: { id: string; cells: Record<string, string> }[];
};

type EditableTableProps = {
  value: TableData;
  onChange: (value: TableData) => void;
  readOnly?: boolean;
};
```

- 首版单元格均为文本，日期、价格、链接先按文本填写；不预设民宿字段类型。
- 行列 ID 使用 `crypto.randomUUID()`；列名可以修改，cells 始终按列 ID 关联。
- 双击编辑，Enter/失焦提交，Escape 取消；中文输入法组合输入不提交。键盘可聚焦并用 Enter 编辑；触屏提供可见编辑入口。
- 编辑器内的尚未提交文字也算本地编辑，后台刷新不得替换该输入。页面可将编辑中状态传给同步 hook 的读取应用保护参数。
- 本次仅新增行列和改内容，不额外引入删除、排序、公式或批量操作。
- 复用 Table、Input、Button、Field、Alert、Badge 和语义 tokens。工具路由建议 `/tools/tables/`，在首页加普通链接，表格数据不写入旅行源码。

## 通用同步契约

`T` 必须为可 JSON 序列化的业务数据；资源 ID 区分文档，例如 `tables:travel-notes`。hook 不解析 columns/rows，也不认识民宿。

```ts
type VersionedDocument<T> = {
  data: T;
  revision: number;
  updatedAt: string;
};

type DocumentTransport<T> = {
  read: (id: string, signal: AbortSignal) => Promise<VersionedDocument<T> | null>;
  write: (
    id: string,
    data: T,
    expectedRevision: number,
    signal: AbortSignal,
  ) => Promise<VersionedDocument<T>>;
};
```

hook 接受 `id`、初始值、transport、远端数据校验器、`canEdit`、可配置保存/拉取间隔；返回当前数据、更新入口、同步状态、错误、重试与冲突处理入口。初始读取失败不能当作空文档，也不能自动创建；只在明确读到不存在且用户实际修改后创建。

### 保存与读取

- 默认保存间隔 1 秒，尾部补发。持续修改每个间隔最多写一次；同时仅一个写请求，期间产生的新修改保留在待保存队列。
- 每次提交记录本地变更序号；旧响应只确认对应提交，不能把较新的本地值改回旧值。
- 远端读取默认 15 秒一次；页面隐藏时暂停，重新可见或网络恢复后补读。恢复网络时按草稿与基准 revision 重试保存，不能先把草稿清空。
- 读取返回时检查资源代次、revision、本地修改和编辑会话；过期响应忽略，有本地草稿时只保留远端快照，不覆盖输入。
- 资源切换和卸载清理定时器、监听与 AbortController；取消请求不等于服务端未提交，重试需通过 revision 对账。
- 未保存文档按资源 ID 暂存 localStorage，保留基准 revision；JSON 损坏或容量不足显示保存异常。重新进入先读取远端，再对账本地草稿，不盲目覆盖云端。
- 本地写入完成不等于云端同步；只有服务端确认对应版本后显示“已同步”。

### 冲突

用文档版本比较更新，避免两个页面读取旧版本后整份覆盖。冲突时保留本地草稿与远端新版本，暂停自动写入，提示用户选择使用云端或保留本地再提交。保留本地也必须针对最新 revision 条件写入；再次冲突仍需处理。不引入字段级合并或 CRDT。

第一版为小量 JSON 文档，建议 512 KiB 文档上限、50 列和 1000 行上限；界面在超限前给出提示，API 同步校验。未来数据量增长再拆记录级写入。

## 固定密码

- 独立编辑权限状态，`EditableTable` 只接收 `readOnly`。
- 共享密码由接入配置提供；本地保存用户输入的密码，用于后续核对，不使用单独的 `unlocked=true` 判断权限。
- 本地演示可注入密码验证方法；接入云端后由服务端核对固定密码，写入也核对同一凭据。无登录系统、用户表或 token 生命周期。
- 初次打开无有效凭据时显示只读内容与密码输入；核对成功开启编辑。再次进入用保存的凭据核对，错误或 401 清除编辑态；网络故障不能误判密码正确，也不删除未保存草稿。
- 主动锁定清除本地凭据并停止写入；已有草稿保留并显示未保存。密码具体值在接入时配置，组件开发无需实际密码。

## Cloudflare 接入阶段

- 现有静态前端继续使用 Cloudflare Pages；在现有 `functions/` 下增加通用文档 API，无需另建常驻服务。
- D1 表 `documents(id TEXT PRIMARY KEY, data TEXT NOT NULL, revision INTEGER NOT NULL, updated_at TEXT NOT NULL)`。数据列保存 JSON；避免为每类业务提前建表。
- GET `/api/documents/:id` 返回文档，不存在返回 404；响应禁缓存。PATCH 或 PUT 提交 `{data, expectedRevision}`。服务端校验资源 ID、体积和 JSON 形态。
- 创建使用唯一键约束和 `expectedRevision=0`；更新使用 `WHERE id=? AND revision=?` 原子比较更新，返回已提交版本。0 行更新返回 409，不执行无条件覆盖。
- 写凭据随请求头发送，密码配置为 Pages Secret；数据库 binding 建议 `DB`。未配置时返回明确 503，不能假装保存成功。
- 通过固定密码验证端点恢复编辑态；公开读取，写入检查共享密码。仅返回必要状态，错误不回显凭据。
- 用户已提供 Edge 登录状态；本轮优先本地代码。创建 D1、绑定、设置密码和上线在组件验收后的接入步骤处理，不把浏览器已登录等同于已部署。

## 验证和回退

- 本地可控 transport 覆盖慢响应、失败、冲突、重试、资源切换与非表格 JSON；本地多页面验证可用测试服务共享状态。
- 浏览器验证编辑、输入法、只读、解锁恢复、触屏与窄屏；复用现有 Vite 浏览器测试页方式。
- D1 接入后验证 SQL 条件写入、未授权写入失败和两个页面的真实同步。
- 新工具独立目录和路由，回退入口与对应文件不影响已有旅行数据。数据库迁移仅新增独立表，保留数据，回退不删除线上表。
