# 技术设计

## 组件边界
- ReUI registry 源码提供 DataGrid、DataGridTableDndRows、DataGridTableDndRowHandle；由 TanStack useTable 驱动。
- 保持 EditableTable(value,onChange,readOnly,onEditingChange) 外部契约；将数据模型/校验/转换放到独立 `src/lib/table-data.ts`，列配置和类型编辑器可拆为表格子组件，避免把所有类型塞进同步 hook。
- SyncedTable 继续组装密码、同步、冲突和 UI。通用 SyncedDocument 仍不知道表格业务。
- 样式沿用项目 tokens；安装前检查依赖，避免覆盖已有 UI primitives。registry 中错误的 cn 导入改为 @/lib/utils，不引入 cn 包。

## 数据结构
- v2：{schemaVersion:2, columns:[{id,name,type,options?}], rows:[{id,cells:Record<columnId,CellValue>}]}。
- type: text | multiline | number | currency | date | select | multiselect | checkbox | url。
- CellValue: string | number | boolean | string[] | null。缺失 cells key 是空单元格；新勾选值默认 false；空数值/日期使用 null。
- options 为去重、非空字符串数组；单选值必须存在于 options，多选不得重复且每项都在 options 中。设置合理选项数量/长度上限并测试，避免无限 UI。
- 日期为真实 YYYY-MM-DD，不使用 Date 的本地/UTC 隐式转换。金额值保持用户数值精度，仅显示两位，不在存储层偷偷四舍五入。
- 网址校验只允许 HTTP(S)，外链带 rel=noreferrer。

## 兼容与迁移
- transport.read：原 JSON 按 v1/v2 分支校验；v1 无损转换为 v2 内存模型，旧列统一 multiline，保持所有值、行列 ID、顺序、revision、updatedAt。
- transport.write：只写校验后的 v2，仍用原 revision 条件更新。只读加载/自动轮询绝不写升级数据。
- 必须在表格专用 transport 适配 read/write，不能让通用解码把未经转换的 v1 假装成 v2；也不能破坏丢失写响应后的读取对账。
- 当前旧客户端只接受 schemaVersion=1，读到 v2 会停止加载；滞留已打开客户端的旧 revision 写入被 409 拦截。现有数据不离线批量迁移。
- 字段转换先对整列校验，全部可无损转换才一次提交；失败保持原字段和数据并提示行号。文本含非法数值/日期不得变成空/零。多选转单选只允许至多一项；已使用的选项不能直接删。

## 编辑与拖拽
- 数据由上层唯一持有；稳定 row.id，同时传入 getRowId 与 dataIds；onDragEnd 创建新 rows 数组，经 onChange 自动同步。
- 拖拽只在解锁且无编辑会话时开启。编辑/字段配置/拖拽期间通过 onEditingChange 暂停远端覆盖；取消、失焦、锁定和卸载均应释放。
- ReUI 内置编辑键位默认 Enter 提交，与现有需求不同。采用自定义 cell editor 或最小局部适配，保留 Enter 换行、Ctrl/⌘+Enter 保存。
- 单选/多选/日期组合现有或按需添加的 shadcn/ReUI 控件，编辑层正确处理 portal 的焦点，不能将每次弹层失焦作为提交。
- 默认不启用分页、排序、筛选和虚拟化：现有最多1000行，先保持多行自动高度与直观行序。显式关闭 TanStack 默认分页，避免只显示前10行。

## 依赖与范围
当前 registry 使用 TanStack v9；查询 npm latest=9.3.1，支持 React>=18。ReUI data-grid registry 内含编辑、DnD 等源文件，依赖 dnd-kit、TanStack react-table/react-virtual。采用实际下载版本核对类型，不混用 v8 示例。
D1 JSON 接口、数据库结构及密码配置不变，无需 Cloudflare 控制台操作。

## 风险与回滚
- 重点风险：DnD 和编辑抢焦点、不同高度行落点、选项变更丢值、v1转换后对账、宽表触摸、依赖默认分页。
- 发布后已有 v2 数据不能直接回滚到只支持 v1 的 UI；应保留新解码器并回退渲染实现，或先提供明确的数据导出/转换方案，不能覆盖云端数据。
- 工作区已有5个北海道行程文件改动（page/recommendation-map/sources/tickets/trip），本任务不修改、提交或恢复它们；组件入口已存在，可原位复用。
