# 研究组织

主会话通过 Edge 可见页面读取小红书，官方网页用于核验交通、开放与活动日期。航班按用户后续要求停止研究。不改应用，不增加依赖。

证据流：查询 → 搜索候选 → 详情正文及图片 → 摘要台账 → 主分组去重 → 景点和风险比较 → 官方核验 → 逐日计划。

`research/sources.jsonl` 每行一条笔记，字段为 group、query、noteId、title、url、publishedAt、collectedAt、readDepth、guide、places、findings、cautions。group 固定为 hokkaido/sapporo/otaru/hakodate；按 noteId 全局去重。有效详情才能计数，搜索候选与失败详情写独立日志。仅保存摘要与必要短摘录，规范链接不保留令牌。

`research/official-checks.md` 记录官方来源、核验时间、有效日期、结论与未决项。`research/itinerary.md` 汇总逐日安排、经典景点、避坑和来源编号。

冬季亲历经验优先；广告与孤立主观抱怨不能直接决定取舍。事实以当期官方信息核验，冲突经验保留适用条件。首尾交通日不绑定搜索到的航班，不擅自延长用户日期。

页面超时重试或恢复绑定；登录与验证码按工具要求交由用户。分批落盘，恢复时根据台账续查。错误证据标记无效并修改相关行程，其他任务保持独立。
