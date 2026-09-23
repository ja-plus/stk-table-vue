## Why

树形列（`tree-node`）与展开列（`expand`）的箭头目前是纯 CSS 三角形，使用方无法替换成自己的图标；唯一可行的变通（给该列配 `customCell`）虽然技术上已能工作，但依赖三个从未文档化的内部实现细节（`.stk-fold-icon` 类名充当点击判据、`<td>` 上的 `tree-expanded` 类、`StkTable.vue` 里空转且会重复触发一次切换的 `#stkFoldIcon` 插槽），一旦使用方走这条路还会静默丢失缩进、层级引导线与懒加载 loading 态。

与其新增一个 `#expandIcon` 顶层插槽扩大 API 面，不如把**已存在的 customCell 扩展点正规化**：补齐上下文、把点击契约从内部样式类搬到位显式属性、并把内置装饰（引导线/缩进、箭头/loading）像既有 `#stkFoldIcon` 那样封装后经插槽透传，由使用方决定摆放位置。

## What Changes

- **点击契约显式化**：表体事件委托的判据由 `closest('.stk-fold-icon')` 扩展为 `closest('[data-stk-fold], .stk-fold-icon')`；内置展开控件件（实现后为 `TreeFoldIcon.vue`，原 `TriangleIcon.vue` 并入）同时带上 `data-stk-fold`。旧类名继续匹配但不进入文档，不承诺兼容。
- **内置装饰经插槽透传**：向 `col.customCell` 增传 `#stkTreeIndent` 插槽（内置「按层级缩进 + 引导线覆盖层」，`showGuide` 关闭时只留缩进）；既有 `#stkFoldIcon` 纳入正式契约（内置「箭头 / 懒加载 loading 圈」，按可展开性自动取舍）。使用方可渲染、可移位、也可完全自绘（自绘时须带 `data-stk-fold`）。
- **`CustomCellProps` 扩充上下文**：新增 `level`、`expandable`、`treeLoading`，供「两块插槽都不要、整格自绘」的场景使用；非树/展开列时为 `undefined`。
- **范围**：`tree-node` 与 `expand` 两种列类型一并纳入；不配 `customCell` 的内置路径交互零变化。
- **引导线收口（实现期确定）**：引导线只覆盖祖先各格（第 0 层到 level-1），叶子行自身那格（控件占位格）不再画线；内置件只输出格数，像素由 `--tree-indent-width` 换算。`showGuide` 与本能力均未发布，故无使用方迁移。
- **文档同步（本项目规则要求，与代码视为同一改动）**：
  - `docs-src/main/table/advanced/custom-cell.md`：新增「自定义树节点单元格」配方（摆放契约：根元素 `height:100%; display:flex; align-items:center`）；
  - `docs-src/main/api/slots.md`：登记 customCell 侧的 `stkFoldIcon` / `stkTreeIndent`；
  - `docs-src/main/table/basic/tree.md` 与 `docs-src/main/api/table-props.md`：交叉引用与行为说明；
  - `src/StkTable/types/index.ts` JSDoc、`llms.txt`、`CHANGELOG.md`；
  - `docs-src/en|ja|ko/` 同路径镜像。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `openspec/specs/tree-table`：展开/收起箭头的点击触发口径改为显式属性契约；树节点列在自定义单元格下的缩进、层级引导线、懒加载 loading 态归属重新界定（可由内置插槽提供，也可由使用方自绘）。
- `openspec/specs/custom-cells`：`customCell` 与 `tree-node` / `expand` 列组合时的优先级、注入 props 上下文（`level` / `expandable` / `treeLoading`）与内置装饰插槽（`stkFoldIcon` / `stkTreeIndent`）成为受文档约束的公共契约。

## Impact

- 代码：`src/StkTable/StkTable.vue`（`onCellClick` 委托判据、customCell 分支的插槽与 props 注入）、`src/StkTable/components/`（新增 `TreeIndent.vue` / `TreeFoldIcon.vue`，删除 `TriangleIcon.vue`；`TreeNodeCell.vue` 改为组合两件）、`src/StkTable/style.less`（新增件的样式，不改既有类语义）、`src/StkTable/types/index.ts`（`CustomCellProps`）。
- 兼容性：无 **BREAKING**。既有 `.stk-fold-icon` 委托继续匹配；不配 `customCell` 的树表行为不变；新增 props 与插槽为纯增量。
- 测试：`test/` 需覆盖委托双判据、插槽默认渲染与自绘点击、props 取值、内置路径回归。
- 风险点：引导线定位在内置缩进格内，使用方根元素若不是撑满行高的 flex 行，线会被截断——摆放契约需在配方中显式声明；虚拟滚动下新增插槽为惰性求值，未消费时不产生 DOM。
