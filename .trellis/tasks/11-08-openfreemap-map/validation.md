# 验收记录

## Implementation

- 新组件：`src/OpenFreeMap.tsx`，样式：`src/map/openfreemap.css`。
- 演示/回归：`tests/openfreemap-map.html` + `.tsx`，开发端口 5174，生产预览端口 5175。
- MapLibre 6.16.0，官方 Vite Worker 配置；无地图 Key。
- 天地图组件、专用测试、环境样例及本地 `.env.local` 中对应 Key 已移除；本地密钥文件不提交。
- 兼容更新锁文件中的 Vite 8.2.1 → 8.3.6、source-map-js 1.2.1 → 1.2.2，修复审计结果；无主版本升级。

## Checks

| 检查 | 结果 |
| --- | --- |
| npm run lint | PASS |
| npm run typecheck | PASS |
| npm run build | PASS；保留非阻塞的大 chunk 提示 |
| npm audit | 0 vulnerabilities |
| node --test tests/stargazing.test.mjs | 8/8 PASS |
| 单独 TypeScript 检查地图演示 TSX | PASS |
| 搜索 src/tests/README/.env.example/当前 spec 的旧地图组件、SDK、Key 引用 | 无匹配 |
| git diff --check | PASS |

## Browser

ChatGPT 内置浏览器，真实 MapLibre / OpenFreeMap 公共服务，无 Key。

- 10/10：真实底图/标记/署名、首次列表选点、跨地点标记与回调、重复点击、全图后选择、筛选与单点、空数组、安全文本/外链、无回调选择、StrictMode 卸载重挂与预选。
- 对选点后的标记中心进行 DOM 几何测量，误差要求 <3px；等待 400ms 再核对首次定位未被旧动画覆盖。
- 原生 Enter/空格实际激活标记，回调各执行一次，焦点保留在对应按钮。标记/取景已拆成两个 effect，回归同时检查 activeElement。
- 390×844 视口（内容宽度375px，含滚动条）验证底图、弹窗、控件和署名；完整回归通过。
- 1280×900 桌面视口检查真实底图与三点标记。
- `?fail=1` 通过 fetch 故障注入使真实 SDK 的底图请求失败：2/2 PASS，错误提示、可读列表、重试后单一 canvas。
- 生产演示独立构建后，真实地图加载与 10 项回归通过；Worker 约519KB，MapLibre组件 chunk 约1.10MB（gzip约297KB）。组件尚未被业务页面导入，不进入现有首页 bundle。
- 旧高德 `tests/travel-map-focus.html` 9/9 PASS，青烟威业务入口可正常打开。
- 浏览器定位复用官方控件；未申请用户位置权限或获取真实位置。
- 截图：`outputs/openfreemap-desktop.jpg`（本地产物，gitignore）。

生产演示复现：

```powershell
node --input-type=module -e "import { build } from 'vite'; await build({ build: { outDir: 'outputs/openfreemap-preview', rolldownOptions: { input: 'tests/openfreemap-map.html' } } });"
npm run preview -- --outDir outputs/openfreemap-preview --host 127.0.0.1 --port 5175 --strictPort
```

## Review

- 共享类型未更改，WGS84 约定写入新组件 props 和 README；不修改已有高德坐标或业务页面。
- 弹窗使用 textContent；外链协议限制为 HTTP(S)；MapLibre 默认署名保留。
- 标记、popup、ResizeObserver、超时及地图实例清理；示例页增加 HMR dispose，避免开发中重复 createRoot 警告。
- 任务范围代码完成；只剩提交确认及归档记录。
