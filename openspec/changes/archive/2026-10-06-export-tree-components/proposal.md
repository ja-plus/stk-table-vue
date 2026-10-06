## Why

当前 `TreeIndent` 与 `TreeFoldIcon` 只能通过 `customCell` 的内部插槽间接使用，用户无法在自定义树单元格、树形列表或其他配套 UI 中复用表格已经具备的缩进、引导线、箭头和 loading 视觉。直接复制内部实现又会依赖 `__T_*` 私有字段、内部列类型和未文档化样式类，容易与表格版本演进失配。

## What Changes

- 新增公共组件 `StkTreeCell`，作为可直接配置给 `customCell` 的完整默认树单元格。
- 新增公共组件 `StkTreeIndent`，用于渲染树层级缩进与可选引导线。
- 新增公共组件 `StkTreeFoldIcon`，用于渲染展开箭头、懒加载 loading 状态和叶子占位格。
- 从包公共入口导出三个组件，并生成可供 Vue 3 / Vue 2.7 使用的类型声明。
- 将现有内部 `TreeNodeCell` 重构为使用公开 customCell 上下文的 `StkTreeCell`，使用 `level`、`expandable`、`treeLoading`、`treeExpanded` 等公开 props，不再直接读取私有行字段。
- 将 `StkTreeFoldIcon` 的公共 props 与 `StkTable` 内部行数据解耦，改由公开状态参数驱动：`expandable`、`loading`、`expanded`。
- 保留现有 `stkTreeIndent` / `stkFoldIcon` customCell 插槽的渲染和点击兼容性；内部表格路径改用同一套公共组件契约。
- 保留 `data-stk-fold` 作为表格事件委托的展开控件标记；公共组件在可展开状态下自动输出该标记，但该标记本身不在组件外独立维护展开状态。
- 补充组件 API 文档、示例、类型测试、运行时测试及变更记录。
- 公共 API 文档同步范围：`docs-src/main/` 中文文档、`docs-src/en/`、`docs-src/ja/`、`docs-src/ko/` 镜像、`llms.txt`、`CHANGELOG.md`。

## Capabilities

### New Capabilities

- `tree-components`: 提供可作为 customCell 使用的完整树单元格，以及可独立复用的树形缩进和展开控件公共组件。

### Modified Capabilities

无。现有树表展开行为和 customCell 插槽语义保持不变，本变更只新增可复用的公共组件入口并统一内部实现契约。

## Impact

- 公共入口：`src/StkTable/index.ts`。
- 组件实现：`src/StkTable/components/TreeIndent.vue`、`src/StkTable/components/TreeFoldIcon.vue`、`src/StkTable/components/TreeNodeCell.vue`（重构为 `StkTreeCell`）、`src/StkTable/StkTable.vue`。
- 样式：树缩进宽度、引导线和展开控件现有 CSS 变量/类名需要保持兼容；默认视觉不变。
- 测试：新增公共组件行为测试、类型测试，并回归 customCell 插槽、树展开委托、懒加载 loading 和普通树表路径。
- 文档：新增组件 API 页面或现有树表/customCell 文档章节，并同步四语言镜像、AI 速查资料和 changelog。
- 不新增运行时依赖，不改变 `StkTable` 的 props、emits 或实例方法。
