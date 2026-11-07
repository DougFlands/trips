# 北海道推荐景点接入 OpenFreeMap

## Goal

只改北海道页“哪些值得去”区块：把札幌、小樽、函馆的推荐点放到 OpenFreeMap 地图上，列表与地图联动，保留明信片风格。日程、来源、推荐排序和其他页面不变。

## Background

- 当前北海道页：`src/trips/hokkaido-winter/page.tsx`，推荐数据在 `trip.ts`，共札幌12项、小樽10项、函馆8项。
- 通用 OpenFreeMap 组件已在前置任务 `11-08-openfreemap-map` 完成：`src/OpenFreeMap.tsx`，基于 MapLibre GL JS；当前工作区已有相关未提交代码，接入时直接复用，不重新实现地图供应商。
- 官方 Quick Start 使用 MapLibre GL JS 和 `https://tiles.openfreemap.org/styles/liberty`，无需地图 Key；页面需要保留 OpenStreetMap/OpenMapTiles 署名。[官方文档](https://openfreemap.org/quick_start/)
- 现有高德页参考 `src/trips/qingdao-yantai-weihai/page.tsx` 的列表、点位聚焦和右侧页面滚动按钮。

## Requirements

### R1 地图范围

- 地图放在“哪些值得去”标题和推荐列表之间，默认显示全部30个推荐地点。
- 推荐城市 Tabs 增加“全部／札幌／小樽／函馆”；切换时列表和地图同步过滤。城市数量仍显示12、10、8。
- 每个推荐点必须有稳定 id、名称、城市、说明、推荐档位、WGS84 `[经度, 纬度]`；30个点全部有标记。点位是景点概览坐标，不承诺导航入口精度。
- 地图默认自动取景；单点或列表选中后居中、放大并打开 Popup。Popup 显示名称、城市、推荐档位、时长和一句理由。
- 地图使用现有 `OpenFreeMap`，不使用天地图，不新增地图 Key，不修改高德页。

### R2 地图交互

- 保留 MapLibre 原生放大、缩小和定位控件；控件在移动端不挡 Popup 和署名。
- 推荐列表每行可点击、Enter/Space 可操作；点击后地图聚焦对应标记，标记选中状态可见。
- 地图标记可点击；点击后同步当前城市和推荐列表，并把对应行滚入列表可视范围。
- 当前城市没有点时显示空状态，不残留上一个城市的标记或 Popup。
- 地图加载中、失败、部分底图错误时地点列表仍可读；失败可重试。不要凭空 canvas 判断加载成功。

### R3 右侧滚动

- 页面右侧固定上下按钮，视觉沿用当前暗红／靛蓝明信片配色；分别滚动约半个视口。
- 按钮有中文 aria-label，支持键盘，移动端不遮住主要内容；遵守 reduced-motion。

### R4 明信片风格

- 地图外框、标题、列表、按钮沿用 `.hokkaido-page` 的米白纸底、靛蓝文字、暗红点缀和细虚线。
- 地图本身使用 OpenFreeMap Liberty 底图，不套颜色滤镜、不盖整页遮罩。
- 地图区域只属于“哪些值得去”，不把地图扩展到行程、提醒或来源。

## Out of Scope

- 不改11天行程、景点推荐顺序/档位、来源、餐厅、航班和其他旅行页。
- 不做地点搜索、路线规划、实时天气、聚合、编辑/保存点位。
- 不替换高德地图；不重新开发 OpenFreeMap 通用组件；不增加地图 API Key。
- 不把概览坐标当成导航入口或精确到店路线。

## Acceptance Criteria

- [ ] AC1：北海道页“哪些值得去”默认有 OpenFreeMap 地图，全部30个点均可见或可通过自动取景查看。（R1）
- [ ] AC2：全部／札幌／小樽／函馆切换时，列表数量与地图标记一致；切换不会残留旧 Popup/标记。（R1、R2）
- [ ] AC3：列表行、Enter/Space、地图标记三条路径均能聚焦同一地点并显示详情；行列表会跟随地图选点。（R2）
- [ ] AC4：放大、缩小、定位、署名和失败重试可用；无 Key 提示不出现，地点列表在地图失败时仍可读。（R2）
- [ ] AC5：右侧上下按钮固定可见、可键盘操作、滚动半页；手机不遮挡推荐内容。（R3）
- [ ] AC6：页面保留明信片风，行程、提醒、来源和其他旅行页无回归。（R4）
- [ ] AC7：`npm run lint`、`npm run typecheck`、`npm run build`、`npm audit` 通过；浏览器完成桌面/390px、真实底图、交互和失败状态检查。

## Technical Notes

- 前置 OpenFreeMap 组件要求坐标为 WGS84；北海道推荐数据当前没有坐标，新增独立地图数据映射，避免污染 `TripPlace` 的旧高德坐标契约。
- 地图 Popup 复用推荐的 priority、duration、reason 和 sources，不复制一套文案。
- 列表滚动只作用于推荐列表容器，不使用会把地图移出视口的 `scrollIntoView`；页面右侧按钮才负责整页滚动。
- 本任务依赖前置 `11-08-openfreemap-map` 的组件和 `maplibre-gl` 依赖。若前置任务尚未提交，验证按工作区现状进行；实施顺序写入 `implement.md`。

## Plan Status

本版已按用户最新要求从天地图改为 OpenFreeMap。尚未运行 `task.py start`，等待本版方案确认后进入实现。
