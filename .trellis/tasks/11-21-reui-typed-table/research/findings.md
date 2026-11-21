# 研究证据（2026-11-21）

- 官方文档/预览：https://reui.io/docs/data-grid
- 免费组件许可：https://reui.io/legal/license（free primitives/examples/hooks 为 MIT，Pro blocks另有许可）
- 实际 registry：https://reui.io/r/new-york/data-grid.json，快照 `data-grid-registry.json`。
- CLI `npx shadcn@latest search @reui -q data-grid --limit 6` 找到免费 ui 项 @reui/data-grid。
- registry 的 DataGridTableDndRows 接受 handleDragEnd、dataIds、onDragStart/onDragCancel、collisionDetection、modifiers 等；导出 DataGridTableDndRowHandle。
- DataGrid 使用 table instance，内含 dataGridFeatures，TanStack v9，非 data/columns 直接传入。
- cellEdit.control 只内置 text/textarea；其他类型可经 onCellEditRequest 或自定义 cell renderer。内置 Enter 提交、Shift/Alt+Enter换行，须适配既有键位。
- registry 包含完整 cell selection/clipboard、virtualization 模块，但本任务仅开启必要能力。
- registry 依赖 @base-ui/react、@dnd-kit/core/modifiers/sortable/utilities、@tanstack/react-table/react-virtual、cn；cn 为导入修复项，使用已有 @/lib/utils。
- npm @tanstack/react-table/latest=9.3.1，peer React>=18；当前 React19可用。
- 现有 server/documents.js 保存任意 JSON，按 expectedRevision 原子写；无需 D1 schema迁移。
- 现有 useSyncedDocument 1秒节流、15秒轮询、暂停远端编辑覆盖；本任务扩展保护到拖拽和字段配置。

已安装并核对：仅保留所需模块，去除 cn 与未用 react-virtual 依赖；Radix Checkbox API 已适配。实现/验收见 verification.md。
