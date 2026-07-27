---
kind: logging_system
name: 日志系统（无专用框架，仅使用 console）
category: logging_system
scope:
    - '**'
source_files:
    - package.json
---

该仓库未实现专用的日志系统。核心库代码（src/ 目录）中未发现任何日志框架依赖或结构化日志输出；所有调试与错误信息均直接使用浏览器原生 `console.log` / `console.warn` / `console.error` 等 API 输出，且主要出现在 `.port-tmp/` 下的临时补丁脚本和 `docs-demo/` 演示组件中，用于开发期调试与示例展示。包依赖（package.json）中也没有引入任何第三方日志库（如 pino、winston、log4js 等）。因此，本仓库不存在统一的日志级别管理、结构化字段规范或日志路由机制。