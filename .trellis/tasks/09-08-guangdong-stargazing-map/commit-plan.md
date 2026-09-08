# 提交清单

目录已扩至 35 点（新增 27 点），研究与页面修改已汇总。35 点模型核验、本轮自动检查与 Edge 复验已通过。用户已授权提交并推送；功能提交后按 Trellis 归档并记录日志。

拟按 1 次本地提交组织改动：`feat: add Guangdong stargazing map and cached weather`。包含后续 UI 组件、动画、下拉修复、紧凑排版、地图弹窗关闭与天气时间列固定。

包含：

- `src/App.tsx`：路由、页面元信息、首页入口。
- `src/TravelMap.tsx`：普通点位、双向选择、主题、WGS84定位转换。
- `src/lib/coordinates.ts`：坐标转换与直线距离。
- `src/trips/guangdong-stargazing/`：35 点资料、2025 暗空模型、天气、IndexedDB、页面与手帐风；包含跨批更新时按地点保留存储失败提示的修复。
- `tests/stargazing.test.mjs`、`tests/stargazing-map-error.html`：行为与地图失败验收。
- `README.md`、`.trellis/spec/frontend/index.md`、`.trellis/spec/frontend/stargazing.md`：使用与维护契约。
- `.trellis/tasks/09-08-guangdong-stargazing-map/`：方案、研究记录、详情/坐标/暗空依据和实际验证结果。原 12 词为 661 条关联、390 篇独立帖子；补搜新增 28 篇，合计 418 篇独立帖子、50 篇详情。27 个新增点均有已读主帖依据。

首版 8 点曾通过的检查保留为历史记录。本轮已完成 35 点目录、排序与地图、多批天气和跨批存储失败提示的自动/浏览器复验，具体结果以 research/verification.md 为准。

仅纳入核对过的本任务文件，包括新增 UI 源码组件、lucide-react 依赖与规范更新。目标分支 main，功能提交后归档、记录日志并推送 origin/main。
