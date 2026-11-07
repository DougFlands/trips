# OpenFreeMap 组件设计

## Architecture

- 新增 `src/OpenFreeMap.tsx`，直接使用 `maplibre-gl`；不增加 React 地图封装库、供应商工厂或全局配置。
- 新组件采用地点数组接口，复用 `MapPlace` 的展示字段及现有 label、focusPlaceId、onSelectPlace、fitMaxZoom、focusZoom 语义；导出明确的组件 props。新组件的 coord 契约为 WGS84 `[longitude, latitude]`，不自动接收或猜测 GCJ-02。
- 样式使用 `https://tiles.openfreemap.org/styles/liberty`；按安装版本配置 Vite Worker，引入 MapLibre CSS。专用样式按需放在 `src/map/`，不依赖某趟旅行主题。
- 当前无天地图业务调用者，以 `tests/openfreemap-map.html` 展示组件和交互，不为接入而修改旅行数据。

## Data and interaction

- React effect 创建/销毁地图；底图初始化完成后同步标记。组件卸载清理监听、marker、popup、ResizeObserver 和地图实例。
- 每个地点使用有可访问名称的按钮标记；原生按钮支持 Enter/空格。弹窗以 DOM/textContent 构造，外链限制为 HTTP(S)，设置 target/rel。
- 地点点击通知 onSelectPlace；受控 focus 更新后定位并打开对应弹窗。无回调时组件直接定位、开窗；重复点击当前点可以重开弹窗。
- 有效 focus 优先于自动取景。多点 fitBounds、单点 jumpTo；停止此前相机动画，自动取景不留下延迟覆盖选点的动画。数据过滤导致 focus 无效时关闭旧弹窗并重新取景。
- 加载状态为 loading/ready/error；无 Key 因而无需 missing-config。捕获初始化/底图失败及超时，不把零星已恢复的瓦片错误当成永久失败。地图失败时仍有地点列表可读。
- 使用 MapLibre 原生缩放与定位控件，避免重复实现浏览器权限处理。默认署名保持可见。地图容器尺寸变化时调用 resize。

## Migration

- 删除 `src/TiandituMap.tsx`、`tests/tianditu-map.html`。
- 删除 `.env.example` 和本地环境文件中精确匹配的 `VITE_TIANDITU_KEY` 配置行，检查时不得输出其他密钥值。
- README 更新依赖说明、组件导入与 WGS84 示例；架构规范将天地图契约替换为新组件契约，保留用户已有修改。
- 历史任务与日志不批量改名或删除。高德组件、代理和现有数据不变。

## Validation and risks

- 官方案例和 API： https://openfreemap.org/quick_start/ 、 https://maplibre.org/maplibre-gl-js/docs/ 、 https://maplibre.org/maplibre-gl-js/docs/API/classes/Marker/ 。此前已核对官方文档。
- MapLibre API 与 Worker 路径以实际安装版本为准，通过 TypeScript、生产构建及浏览器验证。
- 公开底图可用性依赖网络，免费公共服务无 SLA；失败提示须真实可见，不能仅凭 canvas 存在判定底图成功。
- WGS84/GCJ-02 混用会偏移，因此新组件接口文档必须明确坐标要求，不迁移旧地图调用点。
- 只为当前少量旅行地点使用 DOM Marker；大量点位聚合另行考虑。
- 回退只撤回本任务文件变更和新增依赖，不能覆盖已有未提交修改。
