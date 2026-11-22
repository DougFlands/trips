# 实施

- [x] 用户批准方案与开发；工作区干净，已读取ReUI/shadcn及同步规范。
- [x] 增加Popover primitive与布局模型/测试。
- [x] 拆分字段Popover、列拖拽表头、编辑会话hook，接入RecordTable。
- [x] 实现无按钮编辑、选中输入、中文输入与焦点恢复。
- [x] 浏览器验收本地内存样例和只读线上旧表。
- [x] npm run test:tables / npm run check；文档与spec同步。
- [x] 提交推送、部署检查；进入任务归档与journal收尾。

## 验收记录（2026-11-22）

- GPT Edge插件，新建标签页恢复旧标签的Debugger unattached；通过插件Playwright/CDP操作UI，无生产数据写入。
- 单击aria-selected/focused，键入a进入编辑且首字保留；Tab跳到下列；双击/Enter编辑、Esc取消非法数字；非法数字点击其他格仍保留错误草稿。
- 九种字段编辑提交，多行三行输入高度88px与scrollHeight一致；多选末项Tab提交并选中勾选列。已用中文IME composition输入ni→你好，组合期间Enter不提交，结束后Enter正常保存。Windows实体输入法从非输入格启动的首字路径未实机覆盖；代码处理Process/229。
- 字段弹层在按钮下方，保存改名、新增字段、Esc关闭；390px视口弹层left12/right332，不溢出。
- 键盘横向列移动，鼠标列拖拽/边缘自动滚动；列宽240→340写回JSON；变高行拖拽仍可用。只读双击/打字不编辑，行列手柄隐藏。
- 修复两个验收发现：嵌套DnD辅助div须portal出table；编辑器键盘处理须capture，避免ReUI原生Escape监听抢先触发blur。
- localhost真实hokkaido-stays只读页面显示已同步，旧数据完整读取，控制台无error/warn。截图work/table-column-popover.jpg为纯内存样例。
- test:tables：23/23；check：lint、tsc、Vite构建通过；npm audit：0漏洞（直连失败，显式使用现有系统代理后成功）。构建仅保留既有大包与ReUI use-no-memo提示。未改后端路由和同步协议；布局由已有transport测试验证API回读。
- 工作提交8dcfe10已推送main，Cloudflare Pages检查success。线上index-DSF4lTTW.js包含新提示、列拖拽与编辑器；公开sync-check-20261121仍为revision3/schemaVersion1，读取未写入升级。
