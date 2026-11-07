# 待确认的提交计划

## 1. feat: add OpenFreeMap markers and remove Tianditu

- 新增 `src/OpenFreeMap.tsx`
- 新增 `src/map/openfreemap.css`
- 新增 `tests/openfreemap-map.html`
- 新增 `tests/openfreemap-map.tsx`
- 删除 `src/TiandituMap.tsx`
- 删除 `tests/tianditu-map.html`
- 修改 `.env.example`
- 修改 `package.json`、`package-lock.json`
- 修改 `README.md`
- 仅提交 `.trellis/spec/frontend/architecture.md` 的地图契约替换；保留原先未提交的北海道 Editorial trips 段落在工作区。
- 当前任务 `.trellis/tasks/11-08-openfreemap-map/` 的需求、设计、实施及验收文档。

## 其他已有修改，不纳入本次提交

- `src/App.tsx`
- `src/trips/index.ts`
- `src/style-previews/`
- `src/trips/hokkaido-winter/`
- `.trellis/spec/frontend/architecture.md` 中已有的北海道 Editorial trips 段落。
- `.trellis/tasks/11-07-hokkaido-postcard-page/`
- `.trellis/tasks/11-07-hokkaido-recommendation-map/`

`.env.local` 是忽略文件，只删除旧地图的配置行，不提交、不显示密钥。`outputs/` 中截图和生产预览不提交。

用户确认后只执行本地提交，不推送；之后依项目流程归档本任务并记录开发日志。
