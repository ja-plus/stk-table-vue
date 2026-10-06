## 1. 公共组件契约与实现

- [x] 1.1 将现有 `TreeNodeCell` 重构为可直接作为 `customCell` 使用的 `StkTreeCell`，改用 `level`、`expandable`、`treeLoading`、`treeExpanded` 等公开 props，并验证不读取私有行字段
- [x] 1.2 将 `TreeIndent` 的 props、缩进格数和引导线样式整理为稳定公共契约，保持 `--tree-indent-width`、`--tree-guide-*` 默认视觉不变，并通过组件渲染测试验证根层级、深层级和 showGuide 开关
- [x] 1.3 将 `TreeFoldIcon` 改为由 `expandable`、`loading`、`expanded` 驱动，移除对 `row`、`col` 和私有字段的直接依赖，并通过测试验证 loading、可展开和叶子占位三态及优先级
- [x] 1.4 保留 `data-stk-fold`、`.stk-fold-icon`、`.stk-tree-loading-icon`、`.stk-fold-holder` 兼容契约，补充独立使用时的 expanded 状态表达，并验证默认 CSS 视觉无回归
- [x] 1.5 为 `StkTreeIndent` / `StkTreeCell` 增加 `offset`（CSS 长度）引导线平移，用于校正自定义展开图标中心且不影响缩进与标签，并通过单元测试验证有值偏移与未传时无偏移

## 2. 表格内部适配与公共导出

- [x] 2.1 在 `StkTable` 和 `TreeNodeCell` 中把内部行状态适配为公共组件 props，覆盖 `tree-node`、`expand`、展开态和懒加载态，并通过默认树表回归测试验证展开/折叠行为不变
- [x] 2.2 保持 `stkTreeIndent`、`stkFoldIcon` customCell 插槽的输出和表格事件委托兼容，补充测试验证公共 `StkTreeFoldIcon` 点击只触发展开、不触发普通单元格事件
- [x] 2.3 从 `src/StkTable/index.ts` 导出 `StkTreeCell`、`StkTreeIndent` 与 `StkTreeFoldIcon`，并补充入口导出和 Vue 3 / Vue 2.7 类型测试；验证 `pnpm test:types` 通过

## 3. 测试与示例

- [x] 3.1 增加公共组件单元测试，覆盖 props 类型边界、DOM 状态标记、引导线数量、loading 优先级、叶子占位和 expanded 状态，并验证相关 Vitest 用例通过
- [x] 3.2 增加一个 customCell 示例，展示从包入口导入 `StkTreeCell`，以及组合 `StkTreeIndent` / `StkTreeFoldIcon` 的自定义方案；验证示例在文档开发环境中可渲染且树节点仍可展开
- [x] 3.3 执行既有树表、customCell、懒加载和虚拟滚动回归测试，验证 `pnpm test` 通过且未改变未配置 customCell 的默认路径

## 4. 文档与发布资料

- [x] 4.1 更新中文 API/树表/customCell 文档，说明组件 props、三态优先级、受控 expanded、`data-stk-fold`、CSS 变量和 customCell 用法，并验证文档示例引用路径正确
- [x] 4.2 同步 `docs-src/en/`、`docs-src/ja/`、`docs-src/ko/` 对应文档镜像，并通过 `pnpm docs:build` 验证四语言文档构建
- [x] 4.3 更新 `llms.txt`、相关类型 JSDoc 与 `CHANGELOG.md`，检查公共导出和版本变更描述一致
- [x] 4.4 完成发布前验证：执行 `pnpm test`、`pnpm test:types`、`pnpm docs:build` 和 `pnpm build`，确认生成的 `lib` 类型声明包含三个公共组件导出
