# Implementation Plan

## 1. Static Vite baseline

- 精简 `package.json`、`vite.config.ts` 与 `tsconfig.json`。
- 新增 `index.html` 和浏览器入口。
- 将环境变量改为 Vite 命名。

## 2. Multi-trip content model

- 定义 `Trip`、`TripDay`、`TripStop` 等少量领域类型。
- 将青烟威内容迁入独立旅行目录。
- 建立旅行注册表和无依赖路径解析。

## 3. Shared renderer and AMap

- 将现有页面改为接收 `Trip` 数据的通用渲染器。
- 将高德地图改为 Vite 环境变量与动态天数颜色。
- 保留黄色赛博朋克风格，移除覆盖地图的全局视觉层。

## 4. Remove obsolete runtime

- 删除 Next、Vinext、Worker、Sites Hosting 配置和实现。
- 清理旧构建缓存。
- 更新 README，写明新增旅行与 Cloudflare Pages 配置。

## 5. Verify and record

- 运行 lint、类型检查和生产构建。
- 搜索残留引用。
- 本地验证首页与旅行详情 URL。
- 更新 Trellis 规范与任务验收项，记录完成状态。
