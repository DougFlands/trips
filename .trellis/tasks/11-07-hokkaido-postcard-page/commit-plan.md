# 提交计划

待用户确认后执行一个工作提交：`feat: add Hokkaido postcard trip page`。

## 包含

- src/trips/hokkaido-winter/trip.ts
- src/trips/hokkaido-winter/page.tsx
- src/trips/hokkaido-winter/styles.css
- src/trips/hokkaido-winter/sources.ts
- src/trips/index.ts：注册北海道
- src/App.tsx：仅地图点数量为0时隐藏徽标这一hunk
- .trellis/spec/frontend/architecture.md：无地图旅行约定
- .trellis/tasks/11-07-hokkaido-postcard-page/：需求、设计、实施和质量记录

## 排除

- src/style-previews/：之前已有的主题预览
- src/App.tsx中此前已有的StylePreviewsPage导入、路由、标题和描述改动
- tests/tianditu-map.html及.trellis/tasks/11-07-verify-tianditu-key/：其他会话的天地图核验
- 任何其他会话新增的改动

不得直接git add整个App.tsx。使用基于HEAD的最小补丁暂存本次hunk，并检查cached diff后再提交。提交前再次核对工作区，避免混入并行编辑。归档和日志按Trellis流程另行执行。
