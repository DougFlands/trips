# 验收记录 · 2026-11-21

## 已验证

- `npm run test:tables`：20/20，包含真实 API 处理器 + 内存 SQLite 的表格 transport 测试。v1读取仅内存升级，不写库；v2金额0/false/日期/多选回读保持类型，过期revision返回409，错误密码返回401。
- `npm run check`：Oxlint、TypeScript、Vite构建通过。构建保留现有大包提示及 ReUI `use no memo` 指令提示；项目未启用 React Compiler。
- `npm audit`：0 vulnerabilities。
- Edge 九字段内存样例：文本、多行、数字、金额、日期、单选、多选、勾选、网址编辑；非法数字/网址不提交，使用中的选项不可删除；日期2027-02-08可保存；新增字段及行成功，12行全部显示。
- 多行输入高度随内容增长，Ctrl+Enter保存；代码保留 IME guard（未自动模拟中文输入法候选过程）。
- Edge 鼠标拖动首行至第三行（中间有变高行），顺序正确；键盘拖拽提交/取消，取消后顺序不变，状态回到空闲。
- 只读隐藏编辑/设置/新增/移动按钮。桌面与390px窄屏均为表格内部横向滚动，页面无横向溢出。
- 两入口已读线上数据：通用验收表 `sync-check-20261121` 与北海道住宿区。北海道8行/4列正常显示并显示已同步；原换行保留。
- 线上验收旧记录仍为 schemaVersion1 / revision3 / 原updatedAt，确认浏览不自动改写。
- 测试页 HMR 重建 root 提示已通过 dispose unmount修正；浏览器扩展偶发消息通道日志与应用无关。

## 验证限制

当前浏览器记忆的编辑密码已被服务器拒绝，未读取隐藏凭据、未重置密码，也未修改真实住宿记录。生产双页面 v2 写入尚未复验。对应迁移、类型回读、并发与密码行为由隔离集成测试及既有同步控制器测试覆盖。

本地连接线上接口偶发12秒网络超时，随后轮询恢复已同步；表格在失败时保留页面内容并显示失败。线上直接GET已成功。

## 复用与范围

纯受控 RecordTable、CellEditor/CellDisplay、ColumnSettings、纯 table-data、table-transport 分离。SyncedTable 继续封装密码与通用 hook；两个现有入口自动使用新组件。README含其他页面接入示例，document-sync spec 已更新。

保持无关的北海道 page/recommendation-map/sources/tickets/trip 文件与 route-audit research 原样，不纳入本任务提交。
