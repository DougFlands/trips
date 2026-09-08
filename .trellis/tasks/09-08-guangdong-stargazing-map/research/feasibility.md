# 可行性记录 · 2026-09-08

## 项目

起始 Git main / HEAD 20a6db9，工作区干净。React 19 / Vite / TypeScript / Tailwind 4，pathname 分发，共享高德 TravelMap。没有 .openai/hosting.json。README.md:64 已保存 Sketchbook；过去会话只保存选项，未为新页选定风格。

## 天气实测

Python 标准库请求公开 Open-Meteo Forecast API，两个公开示例坐标，Origin=http://localhost:5173。HTTP 200，Access-Control-Allow-Origin=*，两组各 168 小时/7 天。

URL：https://api.open-meteo.com/v1/forecast

参数：
- latitude=22.54,23.1
- longitude=114.06,114.4
- hourly=temperature_2m,relative_humidity_2m,precipitation_probability,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,wind_speed_10m,visibility
- daily=sunrise,sunset
- forecast_days=7
- timezone=Asia/Shanghai

单位：气温 °C，湿度/降水概率/总云量/分层云量 %，风速 km/h，能见度 m。返回网格坐标约 (114.08714,22.530754)、(114.38284,23.093145)，不等于请求坐标；应保留请求位置与可靠映射。

正式方案的 forecast_days=8、timeformat=unixtime 已追加实测：单点返回 object、多点返回 array，均 192 个整小时间隔；timezone=Asia/Shanghai、utc_offset_seconds=28800，HTTP 200，CORS *。首个位置省略 location_id，第二个为 1，映射须处理首位置省略编号情况。测试不构成推荐地点或暗空证据。

官方文档 https://open-meteo.com/en/docs 可在 Edge 创建标签，但插件未能读取；命令行文档请求 HTTP 403。API 测试成功不能等同实际页面浏览器验证。

## 暗空来源

只读 HTTP 访问 https://www.lightpollutionmap.info/ 返回 200。公开 HTML 存在 Sky Brightness、World Atlas 2015、VIIRS 图层。尚未查询任何广东地点等级，尚未确认免费批量 API。

方案为研究阶段按点核验、静态保存来源等级。可读图层年份/口径留待点位阶段核对；不能编造数值或把卫星辐亮度直接换成等级。

## Edge

- cua.getState() 可枚举 Edge 用户配置 1，browser ID=2。
- createBrowserTab 创建 Open-Meteo 文档标签后 30 秒超时；后续枚举可见 tab 734200098。
- getTab 选择该标签返回 Debugger unattached。
- createBrowserTab 创建小红书页在 60 秒后超时并重置内核；未读取到小红书内容。
- 正式采集 0 条。需恢复插件网页控制后继续，不将其他方式的数据冒充小红书采集。

## 接管流程复查

用户已批准方案并打开小红书。按插件提供的 browser-troubleshooting 文档，保留 Edge browser 2 绑定，调用 user.openTabs 后用返回的完整小红书对象 claimTab；接管成功，返回 tab 734200156。随后 playwright.domSnapshot 与 screenshot({fullPage:false}) 均在约 21 秒后返回 Debugger unattached。

初次结论：能定位并接管标签，调试连接失败。后来用户再次打开后，成功读取登录后首页 DOM；独立代理标签又成功读取搜索结果。多个 browser 调用各自约 21 秒，组合调用超过 30 秒可能导致工具超时和内核重置。后续拆开调用、必要时 timeout_ms=60000，依照新鲜状态确认动作结果。此前 Windows Computer Use 自动安全检查拒绝窗口读取，不再依赖该窗口接口。

## 并行研究

用户明确要求多个子代理同时采集。已创建三组，各自拥有独立 Edge 标签与 research/group-a、group-b、group-c，分别负责全省 4 词、深圳惠州 4 词、其他区域 4 词。主代理负责汇总去重、天气与暗空来源核验；页面仍在资料完成后开发。

Light Pollution Map 实际页面当前默认选择 Sky Brightness / 2025，Help 说明其由 NASA Black Marble 2.0 VNP46A4/VJ146A4 建模生成。官方帮助正文保存在 lightpollution-help.txt；暂未查询任何具体点位等级。
