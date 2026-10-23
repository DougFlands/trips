# Technical design

## Boundaries

```text
.trellis/tasks/10-23-shanwei-two-day-trip/research/
  search-records.jsonl       # 可复算的搜索卡片记录
  detail-records.jsonl       # 实际打开的详情证据
  search-summary.json        # 每词、同词、跨词、详情统计
  places.json                # 合并别名后的景点候选与限制
  restaurants.md             # 餐厅/小吃候选、正反证据与复核项
  itinerary.md               # 研究版路线与替换条件
src/trips/shanwei-two-day-trip/
  trip.ts                    # 序列化 Trip 数据
  page.tsx                   # 汕尾专属页面组合
  styles.css                 # 地图 marker/popup 与少量主题样式
src/trips/index.ts           # 注册 Trip 与页面组件
```

`src/App.tsx` 继续只做路径解析和首页/404 分发；新增旅行通过注册表进入首页和详情页。高德脚本、地图生命周期和错误状态继续由 `TravelMap` 负责。

## Research-to-data flow

1. 用 Codex 内置浏览器读取小红书可见搜索卡片，按查询和帖子 ID 写入 `search-records.jsonl`。
2. 从各组中选择有地点/餐厅线索的卡片，打开详情正文、图片说明和评论，写入 `detail-records.jsonl`；只保留规范帖子路径，不写入会话令牌。
3. 按地点别名、城市片区和景点类型合并候选；把真实开放、排队、天气、潮汐、租车和口味分歧写入 `places.json` / `restaurants.md`。
4. 使用官方文旅和地图资料交叉核验景区存在性、区域关系和参考坐标；参考坐标不表示精确拍摄机位或开放许可。
5. 将通过审计的本地顺序编译为 `Trip`：D1 城区吃逛，D2 红海湾拍照；金町湾、玻璃海、浅水湾和室内点作为替换或触发项。

## Page structure

- 顶部：汕尾本地两天一夜标题、时间边界、路线说明和“出发前复核”提示。
- 地图：使用 `TravelMap` 展示 `stops` 与 `alternatives`；主线按 D1/D2 分组，替换点不连线。
- 逐日计划：以时间段描述吃饭、城区拍照、红海湾机位和 16:00 结束余量；不写深圳出发段，也不假定用户住哪一块。
- 吃饭计划：五马路本地小吃、二马路夜逛和经过正反核验的餐厅；每项保留 Plan B 与排队/价格风险。
- 复核清单：开放状态、天气/潮汐、租车/寄存、门店营业和海鲜时价。

页面使用现有 shadcn `Button`、`Badge`、`Card`、`Alert`、`Tabs`、`ScrollArea`、`Separator` 等源码组件；不引入新运行时依赖。旅行主题只放在目录内，AMap imperative DOM 继续用少量局部 CSS。

## Compatibility and contracts

- `TripStop.day` 为零基索引，`TripPlace.coord` 遵守现有 `[longitude, latitude]` 契约。
- `Trip.alternatives` 不与 `stops` 重复，`score > 6`；待核验点不能进入主线地图标记。
- 所有外链使用 `target="_blank"` 与 `rel="noreferrer"`。
- 无高德配置时，页面内容仍可读，地图显示现有 missing-config 状态。
- 不新增路由库、全局状态、服务端请求或自动天气请求。

## Trade-offs

- 采用轻量采集量，把时间放在详情核验和反向证据；不足的查询记录实际缺口，避免用大量未读卡片制造虚假确定性。
- 不设固定起止点，适配不同到达方式；页面用“远端拍摄 14:30 左右收队、为 16:00 留余量”表达约束，执行时由用户接入自己的返程点。
- 用景区/片区参考坐标换取可靠性，明确不把参考点写成精确机位；需要更细机位时另开核验任务。

## Rollback

研究文件、汕尾目录和注册表改动相互独立。若页面或地图回归，可先移除注册表入口并保留研究文件；若数据审计发现问题，只重建 `trip.ts`，不回滚公共地图或现有旅行。
