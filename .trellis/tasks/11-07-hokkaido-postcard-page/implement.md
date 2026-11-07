# 实施清单

## 启动条件

- [x] 已检查规范、注册表、现有页面及浏览器主题。
- [x] 最新行程、排序、60条来源已找到；PRD收敛，设计齐全，无阻塞问题。
- [x] 用户在最终方案后回复“继续”，批准实施。
- [x] 已运行task.py start，进入实施。

## 顺序

1. 加载trellis-before-dev，读取frontend规范；复查git diff。按shadcn skill查实际使用组件文档。
2. 录入11天和12/10/8项推荐，保持最新慢游节奏；不从旧版或预览复制内容。
3. 整理60条原文与官网，验证sourceId完整、链接无会话参数。
4. 编写封面、路线、日程、推荐、提醒、来源与局部主题。每条文案给出时长、条件或理由。
5. 注册页面，首页隐藏零地图节点徽标；保护已有预览路由。
6. 核对11天、4/3/2晚、12/10/8项；2/5非雪灯会期、2/7保留缓冲、堺町时长不重复。
7. 检查和浏览器验收，修正后按影响范围复验。

## 验证

```sh
npm run lint
npm run typecheck
npm run build
npm audit
```

- 约1440px、390px：首屏、全部日程、各城推荐、提醒、来源，无横向溢出。
- 鼠标及键盘：Tabs、Accordion、来源定位、锚点、首页往返、外链。
- 路由：新页、首页、旧旅行、预览、未知URL。
- 首尾不编造航班；列车为目标时段，待公告保留标记。
- 本页不加载地图，旧地图不受影响；不运行无关代理网络验证。
- 不给静态文案添加镜像测试；必要数据核对用一次性检查，记录结果。

## 资料

- .trellis/spec/frontend/index.md、architecture.md、quality.md
- .trellis/tasks/archive/2026-11/11-07-hokkaido-winter-trip/research/itinerary-relaxed.md
- 同目录sources.jsonl、official-checks.md、quality-review.md、validation.json
- src/style-previews/page.tsx、styles.css仅作主题参考

## 收尾

按trellis-check核对全部验收项，记录结果与修改文件；不自动部署。当前inline流程，不分派子代理，不整理子代理JSONL。回退保护共享文件的既有改动。
