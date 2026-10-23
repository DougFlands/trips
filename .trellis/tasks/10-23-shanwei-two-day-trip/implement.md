# Implementation plan

## Ordered checklist

1. [ ] 按 `research/search-plan.md` 完成 8–10 个小红书查询；每词记录约 30 个不同帖子 ID，真实缺口照实写入。
2. [ ] 每个查询组打开至少 5 篇详情；保存 `search-records.jsonl`、`detail-records.jsonl`、`search-summary.json`，审计同词/跨词去重和详情数。
3. [ ] 读取正反美食与红海湾经验，合并地点别名，补充 `places.json`、`restaurants.md`、`itinerary.md`；核对官方景区存在性、区域关系和参考坐标。
4. [ ] 从审计后的研究数据编写 `src/trips/shanwei-two-day-trip/trip.ts`：D1 城区吃逛、D2 红海湾拍照、金町湾和室内点替换线，保留来源与风险说明。
5. [ ] 新建汕尾专属 `page.tsx` 与 `styles.css`，复用 `TravelMap` 和 shadcn 源码组件；实现地图分组、逐日计划、吃饭计划、替换条件和复核清单。
6. [ ] 在 `src/trips/index.ts` 注册数据与页面，更新首页/README 路线入口说明；确认没有把深圳出发或固定住宿写进主线。
7. [ ] 运行质量检查：`npm run lint`、`npm run typecheck`、`npm run build`、`npm audit`、`node --check 'functions/_AMapService/[[path]].js'`。
8. [ ] 浏览器检查首页、汕尾详情页、未知路径、D1/D2 筛选、地图缺配置状态、外链和窄屏布局；检查主线/替换点不会重复连线。
9. [ ] 完成全范围 Trellis check，必要时修复；更新前端 spec（仅在发现长期适用的新约定时），再进入提交前复核。

## Validation commands

```powershell
npm run lint
npm run typecheck
npm run build
npm audit
node --check 'functions/_AMapService/[[path]].js'
rg -n 'shanwei|汕尾|深圳出发|xsec_token' src .trellis/tasks/10-23-shanwei-two-day-trip/research
```

## Risk points

- 小红书搜索卡片和详情内容会重复、混入营销或发生临时不可读；所有数量与缺口按实际记录，详情证据单独保存。
- 红海湾点位分散，天气、潮汐、人流和租车/返程可能改变可执行性；主线只放互补的 2–3 个机位，玻璃海等候选按条件触发。
- 餐厅口味和营业信息变化快；页面写复核时间和风险，不把单篇高热度内容变成确定承诺。
- `TravelMap` 的坐标必须符合现有 `[longitude, latitude]` 约定；区域参考点不能暗示精确机位或夜间开放。
- 新页面不应复制或污染青岛页面的主题选择器；地图 imperative DOM 样式限定在汕尾目录。

## Review gate before activation

- `prd.md` 已无未决产品问题，采集量和“不设固定起止点”已确认。
- `design.md` 与本文件覆盖研究记录、页面边界、数据契约、验证命令和回滚方式。
- 用户需在下一条消息明确批准本次规划摘要，之后才能运行 `task.py start` 和编辑产品代码。
