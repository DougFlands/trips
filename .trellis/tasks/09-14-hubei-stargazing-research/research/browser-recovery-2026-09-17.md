# 浏览器连接测试 · 2026-09-17

本轮仅排障。之前“只有打开接口，无法读取”的结论需要纠正：当前 `node_repl` 配合本地官方浏览器客户端可以读取并点击 Codex 内置浏览器。

## 已验证可用

通过 `mcp__node_repl__js` 初始化：

```js
const agent = await (await import('@oai/browser-desktop')).setupBrowserRuntime();
console.log(await agent.browsers.list());
// 从 list 返回值选择 type === 'iab' 且属于当前任务的浏览器；不要复用文档中的固定 ID。
const browser = await agent.browsers.get(returnedBrowserId);
console.log(await browser.documentation());
console.log(await browser.tabs.list());
const tab = await browser.tabs.get(returnedTabId);
console.log(await tab.playwright.domSnapshot());
```

- 可访问性接口 `tab.ax.write()` 曾超时；使用文档支持的 `playwright.domSnapshot()` 成功。读取较慢，`js` 超时设 60000ms，分开调用，避免多步操作累计超时导致内核重置。
- LightPollution：读取到当前广州参考坐标 113.250000, 23.116670、波尔特 9.0、SQM 17.59、Sep 2026 · EST.；点击 Search Location 后搜索输入框可见。
- 天文通：读取到当前深圳参考坐标 114.0596, 22.5429、光污染·2025 图层、波尔特 9.0、SQM 17.74；点击地图菜单后“搜索地点”等菜单项可见。
- 这些数值仅用于验证读取能力，不属于湖北地点核验结果，不写入湖北数据。

## Edge 尚未恢复

- 官方运行检查：Edge 正在运行。
- 官方扩展检查：Default 配置中扩展已安装、启用，版本 1.26.901.11451。
- 官方本地通信配置检查：清单、扩展来源、注册表路径正确。
- 浏览器目录能发现 Edge（用户配置 1），实际标签列表/会话操作仍返回 `nodeRepl.fetch request failed`。
- 按官方诊断脚本重新打开 Default 配置窗口后仍失败。
- 临时将手工 node_repl 配置的 browser 服务切换为当前安装包 `@oai/browser-desktop/service`，重置 JS 会话后 Edge 仍失败；已回退配置，TOML 与备份语义一致。没有重启 Codex 主程序。
- 没有更改安全设置、绕过 URL 检查或重建本地通信协议。Edge 根因尚未确认。

后续湖北逐点核验可使用已验证的内置浏览器 DOM 接口。需重新搜索真实机位，不能给此前未核坐标直接套用暗空数值。
