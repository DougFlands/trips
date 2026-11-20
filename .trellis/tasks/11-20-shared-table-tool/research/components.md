# 组件选型与仓库证据

核对日期：2026-11-20。未安装新的运行时依赖。

## 当前组件

- `src/components/ui/table.tsx`：语义 table、thead、tbody、th、td，已有横向滚动容器和可访问标签支持。
- `src/components/ui/input.tsx`、`button.tsx`、`field.tsx`、`alert.tsx`、`badge.tsx`：编辑、密码、操作与状态的现有基础控件。
- `src/styles.css`：暖纸色背景与现有语义色；可直接沿用。
- `package.json`：未安装 TanStack Table 或 react-data-grid，无需为简单文本编辑新增表格引擎。
- `README.md` 的 Cloudflare Pages 部分与 `functions/_AMapService/[[path]].js`：已有同源 Functions 路径，可继续采用 Pages Functions 接入 D1。

## 开源方案比较

| 方案 | 证据 | 取舍 |
| --- | --- | --- |
| 已有 shadcn Table + Input | 仓库源码已核对；https://ui.shadcn.com/docs/components/radix/table | 本任务推荐。已有样式和依赖，补受控编辑行为即可。 |
| TanStack React Table | npm 元数据：9.3.1，MIT，React >=18，依赖 table-core/react-store；https://tanstack.com/table | 无头表格引擎；排序、筛选、分组需求增长后再考虑。当前仍需自行实现编辑及动态列 UI。 |
| react-data-grid | npm 元数据：7.0.0-beta.64，MIT，React/React DOM ^19.2；https://github.com/Comcast/react-data-grid | 适合完整网格编辑；当前功能少，增加引擎与主题适配成本不划算。 |
| ReUI Data Grid | `npx --yes shadcn@latest search @reui -q editable` 与 `view @reui/data-grid` 成功；https://reui.io/docs/data-grid | Registry 返回 Base UI、dnd-kit、TanStack table/virtual 等依赖，还需要多个 registry 控件。功能覆盖更广，当前暂不引入。预览及文档：https://reui.io/docs/data-grid 。 |

shadcn `docs table input button` 命令因 registry 连接超时失败；Input、Button 官方文档已通过 HTTP 读取，Table 文档第一次 HTTP 读取 SSL EOF。当前 API 判断以已安装源码为准；实现前补齐 Table 文档读取。

## 决策

用已有开源基础组件组合轻量 EditableTable，不安装新表格库。同步使用平台 fetch、AbortController、定时器与 React hooks；D1/Pages Functions 在后续接入阶段提供真实持久化。无需外加 Worker 项目或路由库。
