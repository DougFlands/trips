# 设计

- 复用ReUI单格选择与onCellEditRequest；现有CellEditor保持九类型与多行键位，通过initialText开始替换输入。选择不阻断云端更新，编辑/拖动/调整宽度/Popover阻断。
- RecordTable组合专用编辑hook、表头布局组件、字段Popover；领域校验与布局操作仍在table-data。
- ReUI行拖拽增加可选headerContent插槽；专用表头通过ReUI Head/Cell/Resize原语与已有dnd-kit组合独立列拖拽上下文。只拖表头手柄，结束调整columns数组，单元格数据以ID关联。
- TanStack columnResizeMode=onEnd，列width为可选数值（120..960），默认240；width与columns顺序都存现有v2 JSON，无数据库迁移。字段改名/类型转换保留width。
- Radix shadcn Popover portal解决滚动裁切；字段表单保留保存/取消，单元格编辑无按钮。
- 单元格交接需同步提交旧编辑，再允许新编辑；无效输入阻止离开并显示错误。编辑完成恢复网格焦点；Tab按列顺序导航。
- 中文输入通过选中格的真实输入焦点/组合事件适配，避免仅keydown截取首字；手动与浏览器验收记录实际覆盖范围。
- 回滚可保留可选width字段，旧v2兼容；不改线上数据格式版本。
