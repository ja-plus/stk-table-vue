## Why

`package.json` 中 `sideEffects` 字段仅声明了 `["./src/**"]`，导致使用者通过 `import 'stk-table-vue/lib/style.css'` 引入样式时，webpack 在生产模式下将其视为无副作用的导入并 tree-shake 掉，CSS 不生效。

## What Changes

- 修改 `package.json` 的 `sideEffects` 字段，新增 `"./lib/**/*.css"` 模式，确保构建产物中的 CSS 文件不被 tree-shake。
- 变更前后对比：
  - 前：`"sideEffects": ["./src/**"]`
  - 后：`"sideEffects": ["./src/**", "./lib/**/*.css"]`

## Capabilities

### New Capabilities

无（纯配置修复，不涉及行为规格变化，已设置 `skip_specs: true`）。

### Modified Capabilities

无。

## Impact

- **受影响文件**：`package.json`
- **受影响场景**：所有通过 webpack 构建、以 `import 'stk-table-vue/lib/style.css'` 方式引入样式的消费方。Vite（Rollup）用户不受影响，但此修复对其也无害。
- **API / 依赖**：无变化。
- **文档同步**：无需更新文档（不涉及公共 API 或行为变更）。
