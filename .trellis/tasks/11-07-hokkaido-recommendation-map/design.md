# OpenFreeMap 推荐区设计

## 页面结构

```text
02 / 哪些值得去
按本次冬季慢游排序……
[地图：OpenFreeMap Liberty，默认全部30点]
[全部30] [札幌12] [小樽10] [函馆8]
┌ 推荐列表（可滚动） ────────────────┐
│ 01 大通公园雪祭 · 优先             │
│ 02 北海道神宫 · 优先               │
└───────────────────────────────────┘
```

地图高度桌面约560px、手机约440px；推荐列表仍直接展示在地图下方，避免地图和长列表争夺同一屏。城市 Tabs 是推荐区局部状态，不影响行程 Tabs 或 URL。

## 组件与数据

- 复用 `src/OpenFreeMap.tsx` 的 `places` 模式；不得导入 `TiandituMap` 或 `TravelMap`。
- 新建北海道同目录的推荐地图数据映射，从 `recommendations` 生成 `MapPlace[]`。每个地点保存 WGS84 概览坐标、markerLabel、markerColor、meta、note、url/linkLabel。
- 现有 `recommendations` 保留名称、排序、推荐档位、时长、理由和来源，避免为地图重写一套文案。地图 Popup 的 `meta` 由城市、档位和时长组成，`note` 使用 reason + condition。
- 坐标来自公开地图地标中心/入口的 WGS84 近似值，集中放在地图数据文件；显示“概览点位，不作导航入口”的短提示。不把旧高德 GCJ-02 点位直接传给 OpenFreeMap。
- 页面新增 `activeRecommendationCity: "all" | City` 与 `focusedRecommendationId`。筛选后的 `MapPlace[]` 派生自同一份推荐数据；focus 无效时清空，交给地图重新 fitBounds。

## 联动流程

1. 默认 `activeRecommendationCity = "all"`，地图接收30点。
2. 点城市 Tab：更新筛选城市，清空 focus；地图 effect 删除旧 markers/popup 后 fitBounds 当前点集。
3. 点列表行：设置 focus id；地图 `onSelectPlace` 不反向重复改状态；推荐列表滚动容器按 `data-recommendation-id` 居中。
4. 点地图 Marker：OpenFreeMap 回调 id；页面根据 id 计算城市并切换 Tab，再设置 focus；当前列表行定位到可视区。
5. 推荐点 Popup 中不放坐标复制或导航按钮，避免暗示精确导航。
6. 空列表时地图仍显示底图但没有 marker；列表显示“该城市暂无点位”。

## 右侧滚动按钮

- 复用青岛页面的 `window.scrollBy({ top: direction * Math.round(window.innerHeight * 0.5), behavior: "smooth" })`。
- 按钮固定在 `right: 12px`（桌面18px），z-index 置于页面导航下方或同级，避免盖住 MapLibre 控件；宽度34px，背景靛蓝，箭头暗红/米白。
- `aria-label="向上滚动半页"`、`aria-label="向下滚动半页"`；用户偏好减少动效时由全局规则切成即时滚动。

## 视觉与错误

- 推荐地图外层使用 `.hokkaido-recommendation-map`，颜色变量引用 `.hokkaido-page`，不用全局滤镜或底图覆盖。
- 地图上方以小字标注“概览点位 · WGS84 · 不作导航入口”；地图署名由 MapLibre/OpenFreeMap 保留。
- MapLibre 自带 controls；页面只补失败重试状态，不复制缩放按钮。
- 地图失败不会折叠列表；列表继续展示完整推荐。部分底图错误采用组件已有状态提示。

## 兼容与风险

- 前置组件为当前工作区未提交变更；集成前确认 `OpenFreeMap` 导出和 `MapPlace` 字段与本设计一致。若前置任务改名，按实际路径调整导入，不复制组件。
- 30个手工概览坐标是内容数据，不代表路线规划精度；实施时逐项做唯一 id 和城市数量断言。
- 公共 OpenFreeMap 无 SLA，网络失败需在浏览器上看到 error/retry，构建不能代替真实底图验收。
- 只新增推荐区局部样式和状态，回退时移除该区导入、数据文件及固定滚动按钮即可。
