# 实施与验收计划

## Gate

- [x] 已读取项目规范、北海道页、青岛地图用法和前置 OpenFreeMap 任务。
- [x] 已查官方 Quick Start：MapLibre GL JS、Liberty style URL、无需 Key、保留署名。
- [x] 已把地图供应商从天地图改为 OpenFreeMap；当前仍在 planning。
- [x] 用户确认本版方案后运行 `python ./.trellis/scripts/task.py start .trellis/tasks/11-07-hokkaido-recommendation-map`。

## 顺序

1. 加载 `trellis-before-dev`，复查前置 OpenFreeMap 组件、共享 `MapPlace` 契约和当前 git diff；不回退其他任务的未提交修改。 ✅
2. 录入30个推荐点的 WGS84 概览坐标，生成稳定 `MapPlace[]`；唯一 id 和有限坐标在构建映射时校验。 ✅
3. 在北海道推荐区导入 OpenFreeMap，加入“全部/札幌/小樽/函馆”状态、地图与列表双向聚焦、列表滚动容器；保持原推荐文案和来源引用。 ✅
4. 加入右侧上下滚动按钮，使用现有明信片配色和可访问标签；不复制青岛地图渲染代码。 ✅
5. 加入推荐区局部 CSS，确认 MapLibre 署名、控件、Popup 和失败状态不被遮挡；未修改通用 OpenFreeMap 组件。 ✅
6. 浏览器验证：桌面真实底图、默认30点、小樽10点、列表点选、Popup、缩放、定位和署名；移动端规则已补齐，待实际窄屏复核。 ✅
7. 运行完整质量检查；lint、typecheck、build、npm audit 通过。 ✅

## Validation

```sh
npm run lint
npm run typecheck
npm run build
npm audit
```

一次性数据检查：地图数据30个唯一 id；每个 `MapPlace.coord` 为两项有限 WGS84 数值；每个 id 均可在推荐数据中找到。

## Risks / rollback

- 公开底图受网络影响；浏览器失败状态为可接受的运行时路径，列表仍须可用。
- 前置组件任务可能尚未提交；不在本任务中清理或重写其文件。
- 回退仅删除北海道推荐区的 OpenFreeMap 接入、坐标映射、局部样式和滚动按钮；保留通用 OpenFreeMap 组件及其前置任务内容。
- 未经用户授权不发布或提交。
