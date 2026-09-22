## 1. 类型与配置

- [x] 1.1 `src/StkTable/types/index.ts` 的 `TreeConfig` 增加 `showGuide?: boolean` 字段，补中文 + en JSDoc（用途、默认 `false`、关闭零回归），标注 `@version`
- [x] 1.2 确认 `treeConfig` 在组件内被正确读取（无需新增顶层 prop）

## 2. 渲染实现

- [x] 2.1 `src/StkTable/components/TreeNodeCell.vue` 新增 `showGuide` prop；`showGuide` 为假时保持既有仅 `padding-left` 分支不变
- [x] 2.2 `showGuide` 为真且 `__T_LV__ > 0` 时，按层级数渲染 `__T_LV__` 条竖向引导线段（`.stk-tree-guide` / `.stk-tree-guide-line`），每段占据对应 16px 缩进列、撑满单元格高度
- [x] 2.3 `StkTable.vue` 渲染 `col.type === 'tree-node'` 处向 `TreeNodeCell` 传 `:show-guide="props.treeConfig?.showGuide"`

## 3. 样式与主题

- [x] 3.1 新增 CSS 变量 `--tree-guide-color`、`--tree-guide-width`（沿用既有变量命名风格，与 `--stk-` 前缀对齐的偏差见 design 假设），提供亮/暗主题默认可见值
- [x] 3.2 引导线段样式写入组件样式（随构建进 `lib/style.css`），确保绝对定位以单元格为上下文

## 4. 测试

- [x] 4.1 `test/` 增加用例：`showGuide` 关闭时 tree-node 单元格无引导线元素（零回归）
- [x] 4.2 `showGuide` 开启时，第 N 层行渲染 N 条引导线段、根层 0 条
- [x] 4.3 结合 `virtual` 的展开/滚动场景下引导线随行动态渲染（可参考既有 tree 相关测试写法）
- [x] 4.4 运行 `pnpm test` 通过

## 5. 文档同步（与代码视为同一改动）

- [x] 5.1 `docs-src/main/api/table-props.md`：`treeConfig` 字段表新增 `showGuide` 说明
- [x] 5.2 `docs-src/main/table/basic/tree.md`：新增「层级引导线」小节，说明竖向缩进引导线风格、非精确树连接线、CSS 变量覆盖方式，并挂 demo
- [x] 5.3 `docs-demo/basic/tree/`：新增开启 `showGuide` 的示例 `.vue`
- [x] 5.4 同步多语言镜像：`docs-src/en|ja|ko/main/table/basic/tree.md` 与 `.../api/table-props.md`
- [x] 5.5 `CHANGELOG.md`：记录 `treeConfig.showGuide` 公共 API 新增（并同步 `llms.txt`，见 AGENTS.md 要求）
- [x] 5.6 运行 `pnpm docs:build` 通过；用关键词 `showGuide` 复查 `docs-src/` 各命中页面均已同步
