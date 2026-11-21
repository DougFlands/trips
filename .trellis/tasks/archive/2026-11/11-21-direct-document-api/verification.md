# 验收

- 功能提交 `0d8d4c9` 已推送并发布；线上 OPTIONS 已从405变为204。
- `npm run test:tables` 22/22；`npm run check`、Wrangler Pages Functions构建通过。依赖未变，保留既有大包及ReUI指令构建提示。
- Edge本地 localhost 页面显示“已同步”，CDP确认GET直接请求 `https://trip.flands.com/api/documents/...`，无 Vite转发。连续响应头耗时116/105/125/145/427/108/93ms，无超时。
- 对比修复前本地Vite转发超过15秒/3.24秒/6.62秒。Windows浏览器使用系统代理；Node转发不自动使用，删除中转修复根因。
- 线上允许开发源预检返回204；错误密码POST返回401并带正确Allow-Origin；未知example.com源预检403且无Allow-Origin。真实PUT/GET及密码/revision保护由内存SQLite+真实处理器测试覆盖，未写真实云端记录。
- CORS仅在/api中间件实现，权限校验保留于业务处理器；前端统一请求入口同时覆盖读取/写入/密码核对，无新包、无本地数据存储。
- 未纳入并行北海道行程文件及route-audit研究。
