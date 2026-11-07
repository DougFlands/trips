# 技术设计

## 边界

- `src/TravelMap.tsx` 继续负责高德实现，保留现有公开 API 和生产代理依赖。
- 新增 `src/TiandituMap.tsx`，只负责天地图 SDK 生命周期、地图实例、覆盖物、弹窗、控件和定位。
- 抽取共享的地图业务类型/props 到 `src/map/types.ts`（或等价的地图目录），避免两个组件复制 `MapPlace`、日程筛选和点位契约。
- 天地图 Key 只通过 `import.meta.env.VITE_TIANDITU_KEY` 注入；不改动高德安全密钥代理。

## 组件契约

`TiandituMap` 接受与现有 `TravelMap` 相同的联合 props：

- `places` 模式：观星等普通点位。
- `stops`、`alternatives`、`days`、`activeDay` 模式：旅行日程和路线。
- `focusPlaceId`、`focusZoom`、`fitMaxZoom`、`onSelectPlace`、`theme`、`label` 保持一致。

业务页面选择供应商时直接导入组件；不增加 provider context、环境开关或页面按钮。

## 数据流

1. 组件读取共享 props 和 `VITE_TIANDITU_KEY`。
2. Key 缺失时直接进入 `missing` 状态，不注入脚本。
3. 加载器以带 `tk` 的官方 JS API URL 注入一次脚本，并缓存 Promise；脚本加载后取得全局 `T` 命名空间。
4. 组件创建 `T.Map`，将共享坐标映射为 `T.LngLat`，把路线、标记和信息窗挂载到地图。
5. 点位点击先调用 `onSelectPlace`；受控聚焦更新后再打开信息窗，沿用现有回归测试要求。
6. 浏览器定位使用 `navigator.geolocation`，将位置转换为天地图 SDK 所需坐标后创建用户标记并设置中心。
7. effect 清理信息窗、覆盖物、用户标记、地图实例；脚本本身保持缓存，供后续组件复用。

## 兼容和风险

- 天地图和高德坐标基准/SDK 对象不同，坐标转换必须集中在天地图适配层，不能修改现有旅行数据或全局转换工具。
- 天地图 SDK 的自动边界、信息窗和控件接口可能与高德不同；若没有等价 API，使用点位坐标计算边界和项目自有按钮实现。
- 生产环境浏览器端 Key 会进入 bundle，必须依赖天地图控制台的域名白名单和配额；服务端 Key/服务 API 不在本任务范围。
- 两个 SDK 不由同一组件同时加载，避免全局命名空间和 CSS/事件冲突。

## 回滚

删除天地图组件、共享类型抽取的兼容导出和 `VITE_TIANDITU_KEY` 文档即可恢复原有高德路径；不触碰 `_AMapService`。
