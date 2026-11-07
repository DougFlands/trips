# 实施与验收计划

## Gate

- [x] 用户同意创建任务并规划。
- [x] 检查组件、全部调用者、共享类型、坐标约定、配置与测试。
- [x] 写好 PRD、设计与实施清单。
- [x] 用户回复“继续”批准最终规划，已执行 `task.py start`。
- inline 模式由主会话直接实施和检查，不派子代理；无需生成派发用 jsonl。

## Implementation

1. 记录实施前 git diff，读取 trellis-before-dev 与当前任务；补读必要指南。
2. 安装 `maplibre-gl` 并核对版本、类型、Vite Worker 配置。
3. 编写 OpenFreeMap 组件，接入地点标记、详情、双向选点、取景、控件、错误状态及生命周期清理。
4. 新建演示/回归页，提供多点、单点、空数据、受控选择、数据过滤、卸载重挂场景；留下最小可运行回归检查。
5. 删除天地图组件与专用测试，精确清理环境变量及当前文档。历史任务不动。
6. 更新当前架构契约与 README 使用示例，保留已有文档改动。

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm audit`（区分新增依赖问题与原有问题，不擅自执行大版本修复）
- `node --test tests/stargazing.test.mjs`（旧地图共用契约的回归）
- 搜索运行代码、配置和当前文档的 TiandituMap / VITE_TIANDITU_KEY / api.tianditu 引用，确认清理。
- 浏览器检查真实底图、网络错误、标记文字与颜色、弹窗、鼠标/键盘选点、筛选清理、空数据、单点、重挂。
- 桌面和约 390px 窄屏检查控件/署名/弹窗边界；高德现有页面保持原入口可用。
- 生产构建检查 Worker/CSS 资源，不以开发模式成功代替生产验证。

## Finish

- 使用 trellis-check 核对完整差异、规格及检查结果。
- 按项目收尾流程记录结果；提交范围只能包含本任务改动。
- 未经用户授权不发布站点。

## Execution status

- [x] 步骤 1–6 已完成；新组件与回归页可用，旧接入已清理。
- [x] 静态检查、真实 SDK、窄屏、生产 Worker/CSS 及旧组件回归通过，详见 `validation.md`。
- [x] 当前架构规范已同步坐标、错误恢复与键盘焦点契约。
- [ ] Phase 3.4：等待用户对 `commit-plan.md` 的一次性提交确认，然后归档并记录日志。
