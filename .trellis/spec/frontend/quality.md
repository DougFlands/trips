# Frontend Quality

## TypeScript

- 保持 `strict` 与 `noEmit`。
- 公共组件 props 和旅行数据必须有明确类型。
- AMap 的无类型浏览器 API 只允许出现在 `src/TravelMap.tsx` 的小型本地接口中。
- 外部数据边界使用 `unknown`；禁止 `any` 和类型检查绕过。

## Runtime Behavior

- 外部脚本必须有 loading、missing-config 和 error 状态。
- effect 清理地图实例、覆盖物与信息窗。
- 外链使用 `target="_blank"` 与 `rel="noreferrer"`。
- 筛选按钮保留 `aria-pressed`，地图保留可读标签。
- 不在高德底图上增加滤镜或全局遮罩。

## Dependencies

- 复用现有 React、Radix/Base UI 与 shadcn 源码组件；`lucide-react` 对应 components.json 的图标配置。不要重复引入同用途的 UI 或动画运行库。
- 浏览器 API、CSS 或现有依赖能解决时，不添加新包。
- 替换工具时，一起删除导入、依赖、配置和生成脚手架。
- 依赖调整后运行 `npm audit`；修复版优先使用同一主版本。

## Verification

```bash
npm run lint
npm run typecheck
npm run build
npm audit
```

- `lint` 使用 Oxlint。
- `build` 同时执行 TypeScript 检查与 Vite 生产构建。
- 框架迁移后搜索旧包名、旧配置和旧环境变量名。
- 产品改动至少检查桌面详情页；涉及布局或地图时再检查移动端。
