# UI组件与动画复查

按当前shadcn技能、frontend architecture/quality及stargazing契约检查。

| 原实现 | 本轮调整 |
| --- | --- |
| 原生input/select手写样式 | Input、NativeSelect及FieldGroup/FieldLabel |
| 7个手动选中Button | 单选ToggleGroup，支持方向键聚焦、空格选择，保留至少一个日期 |
| 卡片和分隔/滚动容器 | CardHeader/Title/Description/Content/Footer、Button、Separator、ScrollArea |
| 自定义提示与空状态 | Alert、Empty |
| 原生details展开无动画 | Accordion，height与透明度动画 |
| 天气原生table | Table系列；真实滚动容器可聚焦，保留表格标题与行列头 |
| 请求只有文字进度 | Spinner与Progress，Progress同步aria-valuenow |
| 页面动态反馈缺失 | 卡片hover/按压/选中，筛选列表和地点详情入场，日期天气切换与折叠过渡 |

原生标题、段落、article/section继续提供文档语义。高德命令式marker仍由TravelMap管理，未对其创建额外React根。九项天气字段为静态展示，无排序/列筛选，不需要数据网格组件。

新增组件经shadcn CLI安装并逐项阅读。保留已有Separator；生成代码的cn错误导入统一指向@/lib/utils并删除cn依赖。新增lucide-react与项目图标配置一致。FieldGroup在flex容器中给出明确响应宽度，解决inline-size containment导致的输入框宽度归零。Progress补充传递value到Root；Table增加可选containerLabel。

Edge验证：桌面1366×900、手机390×844，无整页横向溢出，35摘要未裁切；列表520/1070px上限，单点自然收缩；搜索清空后35点、等级升序阎罗头在前；日期箭头+空格有效、点击当前日期不清空；地图标记键盘选择青山咀后卡片/详情同步；来源展开CSS动画名有效；天气真实请求成功1点，加载时spinner及aria-valuenow=0、结束后进度移除且Alert显示结果。手机Table箭头横滑40px。

减少动态效果模拟下，entry与Accordion animation=none、卡片transition=0s。模拟、fetch暂停探针及临时视口全部恢复。

自动检查：lint、typecheck（build内）、build、7项行为测试全部通过；npm audit为0漏洞，git diff --check通过。最终JS415.07kB/gzip135.61kB。未提交、推送或部署。

## 下拉选择修复

用户反馈下拉无效。在内置浏览器实际点击NativeSelect只聚焦、没有可见菜单；此前Edge的selectOption验证只覆盖值更新，未覆盖用户点击路径。改用Radix Select/Trigger/Content/Group/Item，删除无调用的NativeSelect；onValueChange只接受distance/bortle。portal附带stargazing主题与popover颜色及减少动态效果规则。

回归：内置浏览器真实点击后出现两个option，选择波尔特后首项阎罗头，切回距离后首项西涌；Enter打开、ArrowDown和Enter选择通过。390px窄屏下两项完整可见，弹层在视口内，背景米白。视口已恢复。lint/build（含类型检查）、7项测试通过，audit零漏洞。没有新增运行依赖，复用现有Radix。
