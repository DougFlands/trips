# 补充高分点位与每日地图路线

## Goal

将审核后的三城点位与四天路线写入攻略，并在高德地图分组标注。

## Requirements

- 攻略沿用四天三城结构，写入已审核的烟台、威海、青岛线路。
- 点位拆为“要去的”和“6 分以上备选”；备选不得重复行程点，也不得包含明确不推荐项。
- 两类点位都显示评分、说明、高德导航链接，并标注在高德地图上。
- 地图按日期筛选；多点日程按顺序连线，单点日程显示唯一行程标记，备选点不参与路线连线。
- 保留鼠标滚轮、双击和移动端双指缩放。
- 维持静态站点与现有 React + 高德 JS API 架构，不增加依赖。

## Acceptance Criteria

- [x] D1 烟台、D2 威海、D3/D4 青岛的行程内容与审核结论一致。
- [x] 页面明确分开展示“要去的”和“6 分以上备选”。
- [x] 低于 6 分或明确不推荐的点位不出现在两个列表及地图中。
- [x] 地图同时显示两类点位；多点日程按每日颜色连线，单点日程显示行程标记。
- [x] 日期筛选后只显示当天行程点、当天路线及该城市的高分备选点。
- [x] 高德加载、缺失配置、失败状态和缩放交互保持有效。
- [x] `npm run check`、`npm audit` 通过，桌面和移动端页面完成浏览器检查。

## Notes

- Keep `prd.md` focused on requirements, constraints, and acceptance criteria.
- Lightweight tasks can remain PRD-only.
- For complex tasks, add `design.md` for technical design and `implement.md` for execution planning before `task.py start`.
