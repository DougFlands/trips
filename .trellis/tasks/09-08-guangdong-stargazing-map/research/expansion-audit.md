# 扩充目录来源覆盖审计

审计日期：2026-09-08。只读检查本地已落盘研究证据；未重新联网、未逐图鉴伪、未修改产品或来源数据。本报告基于当时的 4 个 `group-*/expansion-places.json`，后续修改另行说明。

结论：27 个扩充点的 27 个主帖均有详情阅读证据；石离磅的第二来源也有详情记录，共 28 个不同来源帖。未发现明确关闭地点仍作为可直接进入机位、已承认 AI 星空图仍作为主实拍依据、外省同名坐标被收入的阻塞问题。有 2 处字段表述需要收紧。

## 具体问题

1. **猴岩乡镇冲突未在目录字段保留。** `group-c/expansion-details.jsonl:7` 已记录“正文称沙田镇金青村，但百度猴岩风车山POI在回龙镇”，且筛选理由要求优先保留新丰县名称。`group-c/expansion-places.json` 的 `houyan.district` 仍直接写“新丰县 · 回龙镇”。县内同名 POI 匹配有证据，尚不能证明不同乡镇描述等价。建议 district 只写“新丰县”，或明确“地图POI位于回龙镇；原帖乡镇有冲突”。不需要因此丢弃整个新丰猴岩方向。

2. **缺牙山导航别名换字缺少证据。** `group-c/expansion-details.jsonl:12` 的作者导航与 placeMentions 都是“禅子顶”；`queyashan.name` 和 mapUrl 搜索词却使用“蝉子顶”。现有文件没有两字为同一地名的核验记录。建议统一为原帖“禅子顶”，或名称与导航仅使用已核准的“缺牙山”，避免未经核验的别名导向另一地点。经纬度本身来自缺牙山 OSM 节点，未发现外省错配。

## 重点交叉核对

- **横琴黑角湾：** A 组详情第 6 行记作者 08-10 说“封了”、采集时 4 天前说“不能”。该帖没有进入任何扩充点 sources；排除有效。
- **鸡笼顶：** `group-main/expansion-details.jsonl:1` 的 AI 修图作者与正式主帖是两个不同帖子。目录主帖为 `68c645a4000000001c036100`（同文件第 2 行）的独立到访观星记录；AI 图未当主要天空质量证据，caution 也提醒不按网络照片预期肉眼效果。旧坐标日志 `group-c/geocode-nominatim.json` 明确采用阳春市、阳江市、广东省结果，拒绝杭州/湖州同名峰。
- **石离磅：** `group-a/details.md:58` 有 2025-07-25 “没了 种树了”的旧岩石机位变化证据；新增主帖 2025-04 实拍早于该变化，新辅帖只证明 2026 年附近农田拍摄，作者未找到目标石林。当前名称已限定“石林周边”，precision 为村庄区域参考，caution 写明种树和土地变化，因此可保留区域方向。应继续避免恢复成“固定岩石机位可达”的推荐。辅帖承认萤火虫为后期添加，目录未宣传萤火虫；主帖蓝调地景与银河合成也不能当单张直出。
- **地图精度：** 阿婆六、蓝坪、后山顶均明确村落参考；后山顶名称也含“后山村参考”，并声明天气及暗空不能当山顶实况。东涌大排头为社区参考、小三门岛为岛域参考、万绿湖为约45公里湖域参考。未发现这些数据字段将参考坐标改称精确山顶、机位、登岸点或停车位。
- **通行限制：** 阿婆六预约要求保留；猴岩铁门、野猪嶂拦车、缺牙山历史封路均写出不确定性。桃花湖、禾云基地、岭南红叶、云峰山的日间景区营业时间未被当作通宵开放证明，字段另要求核对夜间/住宿安排。
- **同名与影像口径：** 金仙寨湖南、茶坪水库广西等已排除；清远桃花湖未用深圳/四川同名点；猴岩未用清远同名点；电白罗坑未混成韶关罗坑；汕尾风车岛使用实际同名地图POI，没有擅改遮浪。莲麻与缺牙山争议光迹均未当流星确认。凤凰天池、横石基、桃花湖等已保留肉眼弱于照片或光害较强的说明。

## 来源覆盖表

文件路径均相对本 research 目录。每行对应正式扩充点；地理编码失败结果和 heldCandidates 未作为推荐计数。后山顶第 13 行是已明确标识的旧详情复用，并已与 `group-c/details.jsonl:2` 对照，不算本轮新打开详情。

| 组 | 点位 | 已读详情证据 |
| --- | --- | --- |
| group-a | apoliu · 阿婆六 · 山顶观星台 | `group-a/expansion-details.jsonl:1` |
| group-a | lianma · 莲麻 · 黄沙坑附近路段 | `group-a/expansion-details.jsonl:2` |
| group-a | wanshandao · 万山岛 | `group-a/expansion-details.jsonl:3` |
| group-a | hengshiji · 横石基沙滩 | `group-a/expansion-details.jsonl:4` |
| group-a | dongaodao · 东澳岛 · 观景台 | `group-a/expansion-details.jsonl:5` |
| group-a | xikeng · 高明西坑水库 · 外围 | `group-a/expansion-details.jsonl:7` |
| group-b | dongchong-dapaitou · 东涌大排头 | `group-b/expansion-details.jsonl:1` |
| group-b | xiaosanmen-island · 小三门岛山顶 | `group-b/expansion-details.jsonl:2` |
| group-b | wanlvhu · 万绿湖 | `group-b/expansion-details.jsonl:6` |
| group-b | huidong-dananshan · 惠东大南山 | `group-b/expansion-details.jsonl:7` |
| group-b | fenghuang-tianchi · 凤凰山天池 | `group-b/expansion-details.jsonl:12` |
| group-b | lanping · 蓝坪村 | `group-b/expansion-details.jsonl:8` |
| group-b | fengchedao · 汕尾风车岛 | `group-b/expansion-details.jsonl:10` |
| group-b | yezhuzhang · 野猪嶂 | `group-b/expansion-details.jsonl:11` |
| group-c | moliugong · 莫六公 · 横山水星空营地 | `group-c/expansion-details.jsonl:2` |
| group-c | taohuahu · 清远桃花湖 | `group-c/expansion-details.jsonl:3` |
| group-c | shilipang · 石离磅 · 石林周边 | `group-c/expansion-details.jsonl:4`；`group-c/expansion-details.jsonl:5` |
| group-c | tiantangding · 天塘顶 · 禾云滑翔基地 | `group-c/expansion-details.jsonl:6` |
| group-c | houyan · 新丰猴岩风车山 | `group-c/expansion-details.jsonl:7` |
| group-c | queyashan · 缺牙山 · 禅子顶区域 | `group-c/expansion-details.jsonl:12` |
| group-c | qinglianshan · 乐昌青莲山 | `group-c/expansion-details.jsonl:8` |
| group-c | lingnanhongye · 岭南红叶世界 | `group-c/expansion-details.jsonl:10` |
| group-c | yunfengshan · 南雄云峰山 | `group-c/expansion-details.jsonl:11` |
| group-c | houshanding · 后山顶 · 后山村参考 | `group-c/expansion-details.jsonl:13` |
| group-main | jilongding · 阳春鸡笼顶 | `group-main/expansion-details.jsonl:2` |
| group-main | luokeng · 电白罗坑水库 | `group-main/expansion-details.jsonl:3` |
| group-main | qingshanzui · 青山咀灯塔 | `group-main/expansion-details.jsonl:4` |

## 检查范围与限制

A/B/C/main 分别 6/8/10/3 个点。按来源 ID 对照实际详情内容，未使用 search-card 标记补充详情证据。27 个点都有坐标精度字段；Baidu转换值和 OSM 采用结果均有来源路径可追溯。仅凭本地记录不重新证明当前夜间许可、照片原创性或精确拍摄点；这些不确定性在目录字段里仍需展示。

## 主代理处理

- 猴岩 district 已收紧为新丰县；不选择有冲突的乡镇。
- 缺牙山名称与高德检索词已统一为原帖的“禅子顶”，无未经核准别名。
- 石离磅仅为周边区域参考，保留旧机位变化说明。
