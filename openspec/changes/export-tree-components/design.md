## Context

当前两个组件已经承担了树单元格的视觉职责，但它们位于 `src/StkTable/components/` 内部：`TreeIndent` 仅接收层级和引导线开关，`TreeFoldIcon` 还读取表格私有行字段与列类型。与此同时，`StkTable` 已通过 `stkTreeIndent` / `stkFoldIcon` 插槽把它们透传给 `customCell`，并通过 `data-stk-fold` 与历史 `.stk-fold-icon` 选择器做事件委托。

本设计以 proposal 和 `tree-components` delta spec 为契约，要求新增公共入口但保持 Vue 3 / Vue 2.7、现有插槽、默认树表和零运行时依赖不变。

## Goals / Non-Goals

**Goals:**

- 提供稳定的 `StkTreeCell`、`StkTreeIndent` 与 `StkTreeFoldIcon` 公共导出和类型声明。
- 让 `StkTreeCell` 可直接作为 `StkTableColumn.customCell` 使用，并完全由 customCell 公开上下文驱动。
- 让两个组件都能脱离表格私有字段独立渲染。
- 让 `StkTable` 内部路径与 customCell 插槽继续使用相同的视觉组件契约。
- 保留现有 CSS 类、CSS 变量和 `data-stk-fold` 委托行为。
- 用测试锁定公共 props、三态渲染、展开态、loading 优先级和入口导出。

**Non-Goals:**

- 不导出一个负责数据、展开状态或拖拽逻辑的完整树单元格外壳。
- 不让 `StkTreeFoldIcon` 自己管理树数据或调用 `StkTable` 实例方法。
- 不新增 `treeConfig.indentWidth`、顶层展开图标插槽或新的运行时依赖。
- 不改变既有 `tree-node` / `expand` 列的展开算法、事件名或虚拟滚动逻辑。

## Decisions

### 1. 以现有文件为实现源，公共入口使用 `Stk*` 名称

保留 `TreeIndent.vue`、`TreeFoldIcon.vue` 与现有 `TreeNodeCell.vue` 作为实现文件，避免为同一视觉逻辑维护两份实现；在 `src/StkTable/index.ts` 增加：

- `StkTreeCell` -> `TreeNodeCell.vue`
- `StkTreeIndent` -> `TreeIndent.vue`
- `StkTreeFoldIcon` -> `TreeFoldIcon.vue`

公共名称使用 `Stk` 前缀，避免把短而通用的内部名称变成没有命名空间的公共 API。`TreeNodeCell.vue` 的组件名和实现可在内部保留，但其公共入口名称为 `StkTreeCell`。构建产物和 `vite-plugin-dts` 会从该入口生成声明。

备选方案是新建三份 `Stk*` 文件再让内部组件包装它们，但会产生重复组件层和状态映射；不选。

### 2. `StkTreeCell` 直接复用 customCell 上下文

现有 `StkTable` 已经向 `customCell` 注入 `level`、`expandable`、`treeLoading`、`treeExpanded`。将 `TreeNodeCell.vue` 重构为 customCell 兼容组件，使用这些 props 渲染 `StkTreeIndent`、`StkTreeFoldIcon` 和标签；不再通过 `row.__T_LV__` 计算层级，也不让公共组件读取私有行字段。

`StkTreeCell` 可增加一个纯视觉配置 prop（如 `showGuide`），默认跟随表格树配置的传值方式；它不拥有树数据、不执行展开逻辑，只输出带 `data-stk-fold` 的受控内容。

### 3. `TreeIndent` 保持无状态、无表格依赖

`TreeIndent` 继续只接收：

```ts
{
    level: number;
    showGuide?: boolean;
    offset?: string;
}
```

缩进格数通过现有 `--stk-tree-indent-cells` 传给样式，像素宽度继续由 `--tree-indent-width` 计算。`offset` 为 CSS 长度，经 `--stk-tree-guide-offset` 落到 `.stk-tree-guide` 的 `background-position-x`（默认 `0px`），只平移引导线图案。原因是引导线位置写死在每格 4px（与内置箭头中心对齐），换成居中的自定义图标后中心移到格宽一半而错位；平移图案可在不动元素盒、不改缩进宽度与标签位置的前提下校正，因此仍不引入第二个缩进宽度来源。引导线颜色、宽度和 mask 继续读取现有变量，避免在组件 props 和 CSS 变量之间建立第二套配置来源。

### 4. `TreeFoldIcon` 改为公开状态驱动

组件内部不再读取 `row`、`col` 或 `__T_*` / `__EXP_*` 字段，改为接收：

```ts
{
    expandable?: boolean;
    loading?: boolean;
    expanded?: boolean;
}
```

状态选择固定为：

```text
loading === true       -> loading 图标
否则 expandable=true  -> 展开控件
否则                   -> 叶子占位格
```

可展开状态的根元素继续带 `data-stk-fold`，并保留 `.stk-fold-icon` 类以兼容当前委托和样式。`expanded` 用于公共组件独立使用时的视觉状态；在表格内部，`td.tree-expanded` 的既有样式仍可继续驱动箭头旋转，避免默认路径产生差异。必要时为公共独立路径增加组件自身的 expanded 状态类/属性，但不移除旧父级选择器。

`loading` 状态不输出 `data-stk-fold`，防止加载中点击再次触发展开逻辑。叶子占位保持与箭头同宽。

### 5. 在 `StkTable` 中做显式状态适配

内部两个使用点统一传公开状态：

- `tree-node`：`expandable` 来自 `isTreeExpandable(row)`，`loading` 来自 `row.__T_LOADING__`，`expanded` 来自 `row.__T_EXP__`。
- `expand`：`expandable` 按该列已有可展开语义传入，`loading` 为假，`expanded` 来自 `row.__EXP__` 与该列匹配关系。

`StkTreeCell` 同样只接收公开状态并传给公共组件，不再让 `TreeFoldIcon` 直接了解私有行结构。customCell 的既有插槽继续由 `StkTable` 注入同一个公共实现，因此已有 `<slot name="stkFoldIcon" />` 和 `<slot name="stkTreeIndent" />` 不需要迁移。

### 6. 保持事件委托而不增加组件事件 API

`StkTreeFoldIcon` 不新增 `toggle` 或 `click` 事件作为表格专用机制。表格仍依靠 `data-stk-fold` 在 tbody 上委托，命中后由 `StkTable` 统一执行展开并结束普通单元格点击处理。组件在表格外只表达受控视觉，不试图推断或修改外部状态。

这样避免形成两套展开路径，也保持当前自绘控件通过 `data-stk-fold` 接入的契约。

### 7. 文档和验证按公共组件 API 组织

文档增加独立的树组件 API 章节，至少包含 props、三态优先级、受控 `expanded` 语义、`data-stk-fold` 的表格兼容用途、CSS 变量和 customCell 示例。同步页面包括：

- `docs-src/main/api/` 中新增或合适的组件 API 页面；
- `docs-src/main/table/advanced/custom-cell.md` 与树表相关页面的交叉引用；
- `docs-src/en/`、`docs-src/ja/`、`docs-src/ko/` 对应镜像；
- `llms.txt` 与 `CHANGELOG.md`。

测试分为公共组件渲染测试、包入口导出/类型测试、既有 customCell 插槽回归和默认树表回归；不以修改现有断言来掩盖默认路径变化。

## Risks / Trade-offs

- **公共组件名与内部文件名不一致** → 在公共入口、文档和类型测试中只承诺 `StkTreeCell` / `StkTreeIndent` / `StkTreeFoldIcon`，内部文件名仅作为实现细节。
- **`TreeFoldIcon` 从私有字段改为公开 props 后，内部传参可能遗漏某种列类型** → 为 `tree-node`、`expand`、懒加载、叶子和展开态分别增加场景测试，并保留未配置 customCell 的回归测试。
- **独立使用时 `expanded` 的视觉样式与表格父级 `.tree-expanded` 可能出现两套来源** → 保留旧父级选择器，同时为组件自身状态提供明确且不冲突的状态类/属性；以最终 DOM 截图或 class 断言验证两种场景。
- **`data-stk-fold` 被误用在 loading 或叶子占位上** → 三态组件测试明确检查该属性只出现在可展开控件状态。
- **Vue 2.7 的 SFC 类型推导和多根节点兼容性** → 组件保持单根元素，运行 `pnpm test:types` 并在 Vue 2.7 兼容配置下运行构建。
- **文档四语言同步遗漏** → 将四语言文档和 changelog 列为独立 tasks，并以 `pnpm docs:build` 作为收尾验证。

## Migration Plan

这是一个向后兼容的 minor 级增量变更。现有用户无需迁移：原有导入、customCell 插槽、`.stk-fold-icon` 兼容选择器和 `data-stk-fold` 行为保持不变。新用户可从包入口导入两个组件；回滚时只需移除公共导出和相关文档/测试，不需要数据迁移。

## Open Questions

无。公共名称、状态 props、表格适配方式和兼容边界已在规格中确定。
