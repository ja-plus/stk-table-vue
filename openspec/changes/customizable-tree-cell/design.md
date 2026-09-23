## Context

见 `proposal.md - Why`。此处只记录约束当前实现、且直接决定方案形态的事实（行号以当前 master 为准）：

- **渲染优先级已存在**：`StkTable.vue:207` 即 `v-if="col.customCell"`，`TreeNodeCell`（:237）与 `type:'expand'` 的 `TriangleIcon`（:251）都在其后的 `v-else-if` 分支。因此「树列 + customCell」today 就是接管关系，本变更不需要改动优先级。
- **点击完全依赖单次委托**：`<tbody @click="onCellClick">`（:154）→ `closest('.stk-fold-icon')` → `triangleClick`（:1729,1713）。`TreeNodeCell.vue:5` 上的 `@click="emit('click')"` 在主组件侧未绑定监听，是空转的；`TriangleIcon.vue` 自身无监听。
- **展开态与单元格实现解耦**：`getTDProps`（`:1676`）在 `tree-node` 列的 **`<td>`** 上打 `tree-expanded`（`expand` 列为 `expanded`）类，样式（`style.less:743`）据此对其内部 `.stk-fold-icon::before` 做 `rotate(90deg)`；`:1555` 在 `<tr>` 上打 `is-tree-loading`。自定义单元格天然继承这些状态。
- **`#stkFoldIcon` 已在传入**：`:220` 已经把内置箭头塞进 `customCell` 的 `stkFoldIcon` 插槽；`CHANGELOG` 0.8.11 曾以一句话提及该插槽（「slot `stkFoldIcon` implements default event」），故它是既有的、未成文的公共契约，不可改名。内置 `custom-cells/` 中当前无消费者。
- **16px 是散落的硬编码**：`TreeNodeCell.vue` 的 `padding-left: level*16`、叶子占位 `padding-left:16`、`guideWidth=(level+(expandable?0:1))*16`，加上 `style.less` 中 `repeating-linear-gradient(... transparent ... 16px)` 的节拍，共同构成缩进/引导线的对齐前提。

## Goals / Non-Goals

**Goals:**

- 使用方能在不依赖未成文实现细节的前提下，替换或自绘树/展开列的箭头。
- 内置装饰（缩进+引导线、箭头/loading）在 customCell 下可获得、可丢弃，且不出现「悄悄丢功能」。
- 把行为契约（哪个元素是展开控件）与样式契约（类名）分离，并使前者可文档化。
- 不配 `customCell` 的既有树表在渲染与交互上零变化。

**Non-Goals:**

- 不新增顶层 `#expandIcon` 之类的一等公民插槽，也不引入 `treeConfig.expandIcon` 之类的渲染函数 prop。
- 不导出面向使用方的「树单元格外壳」公共组件。
- 不改动箭头/引导线的默认视觉，不改 `showGuide` 的开关语义与默认值。
- 不做区域选取/键盘导航对自定义树单元格的语义调整。

## Decisions

**D1 · 走「正规化 customCell」而非新增插槽或外壳组件。**
备选①顶层 `#expandIcon` 插槽：需要为箭头重做点击链路，与 customCell 路线并存形成两套机制，且只解决箭头、解决不了缩进/引导线在 customCell 下丢失的问题。备选②导出官方外壳组件：与「把内置节点经插槽透传」等效但多一层公共 API，使用方仍需理解摆放契约，收益不抵成本。选择沿用 `:220` 已有的透传机制，把它的缺口补齐。

**D2 · 行为契约落到 `data-stk-fold` 属性，委托选择器改为 `[data-stk-fold], .stk-fold-icon`。**
现状下 `.stk-fold-icon` 同时是样式类与点击判据；一旦文档写「自绘请挂该类」，内部样式类名即永久锁死，且使用方白拿了 border 三角形样式还得反向覆盖。改为显式属性后，样式与行为各走各路。内置展开控件件同时带 `data-stk-fold` 与既有类名（实现后为 `TreeFoldIcon.vue`）。旧类名**继续匹配但不写入文档、不承诺兼容**（自 0.8.11 起无人依它做自绘）。备选：给 `CustomCellProps` 一个 `toggleTreeExpand()` 回调——被否，因为它引入第二套触发机制，而箭头位于深层子组件时还要逐层传递，内置路径的委托照样得留。

**D3 · 切缝为两块：「缩进+引导线」一件、「箭头/loading」一件。**
引导线是覆盖在缩进空白上的绝对定位层（`style.less:804`），自身不产生缩进；与箭头分开透传会导致使用方各算一遍 `level*16`，一处不同步即错位。因此内置件 `TreeIndent` 承载「按层级 `padding-left` + 引导线覆盖层」，`showGuide` 的判断内置其中；箭头位沿用既有 `stkFoldIcon` 插槽，其内容按「加载中 → loading 圈 / 可展开 → 箭头 / 叶子 → 空占位」自行取舍（把 `TreeNodeCell.vue:4-6` 这段逻辑移入内置件，不重复实现）。

**D4 · 新内置件命名 `src/StkTable/components/TreeIndent.vue`，插槽名 `stkTreeIndent`。**
避开 `TreeGuide`：`docs-demo/basic/tree/TreeGuide.vue` 已被引导线演示页占用，同名易混。

实现落地形态（实现期确定）：箭头件命名为 `TreeFoldIcon.vue`，三态共用**一个**元素（`stk-fold-icon` / `stk-tree-loading-icon` / `stk-fold-holder`），以便作为单根组件传进 customCell 的插槽（多根模板对 Vue 2.7 目标不安全）。叶子行的占位由「给 label 加 inline `padding-left:16px`」改为「内置件输出一个占位格元素」，使该件自包含可透传；代价是内置树单元格 DOM 多一个空 span，视觉与几何不变（引导线格数计算未变），无测试断言过这段 padding。原 `TriangleIcon.vue` 随之删除（未对外导出，箭头样式仍由 `.stk-fold-icon` 类承载，类名保持兼容）。

**D5 · `CustomCellProps` 增量：`level` / `expandable` / `treeLoading`。**
命名对齐既有 `treeExpanded`。仅对 `tree-node` 列注入实义值，`expand` 列按既有语义保留 `expanded`，其余列这三个字段无值（MUST NOT 变成必填，避免既有 customCell 类型报错）。用途是给「两块插槽都不渲染、整格自绘」的使用方。

**D6 · 把 16px 收成 CSS 变量 `--tree-indent-width`（默认 `16px`）。**
自绘更大箭头的使用方需要能同步缩进与引导线节拍，否则箭头宽度 ≠ 引导线格宽，层级线必然错位。变量同时用于 `repeating-linear-gradient` 的步长与内置件的缩进计算，并入既有「引导线样式可主题覆盖」的主题体系（与 `--tree-guide-color` / `--tree-guide-width` 同族）。

实现落地口径（实现期确定）：内置件**只输出格数**，像素宽度全部在样式表里按变量算（`.stk-tree-indent` / `.stk-tree-guide` 各自读 `--stk-tree-indent-cells` / `--stk-tree-guide-cells`）。原因是内联 `width: calc(var(--tree-indent-width) * N)` 在测试环境（happy-dom 的 CSSOM）会被整条丢弃，格数断言无法成立；改为「件给格数、样式表给宽度」后，单一真相仍在（只有 `--tree-indent-width` 一处定义像素），且格数成为可直接断言的观测值。因此 `test/treeGuideLine.test.ts` 中三处宽度断言由 `width: 16px` 改为对应的 `--stk-tree-guide-cells: N`。

**D7 · `type:'expand'` 列与 `tree-node` 列同等纳入。**
两者都被 customCell 分支吃掉、都走同一次委托，只做 `tree-node` 会留下不对称的意外。

**D8 · 受影响的文档页面（与代码视为同一改动）。**

| 页面 | 同步内容 |
|---|---|
| `docs-src/main/table/advanced/custom-cell.md` | 新增「自定义树节点/展开单元格」小节：props 上下文、两个内置插槽、摆放契约（根元素 `height:100%; display:flex; align-items:center`）、自绘须带 `data-stk-fold`、`--tree-indent-width` 与箭头宽度的对齐关系 |
| `docs-src/main/api/slots.md` | 登记 customCell 侧插槽 `stkFoldIcon`（既有，补文档）与 `stkTreeIndent`，明确「非 StkTable 顶层插槽」这一层易混语义 |
| `docs-src/main/table/basic/tree.md`、`docs-src/main/api/table-props.md` | 交叉引用；`showGuide` 与懒加载 loading 在接管下的表现 |
| `docs-src/main/api/stk-table-column.md` | `customCell` 与 `type` 组合的优先级说明 |
| `src/StkTable/types/index.ts`、`llms.txt`、`CHANGELOG.md` | JSDoc 与速查表、变更记录 |
| `docs-src/en\|ja\|ko/` 同路径 | 镜像同步 |
| `docs-demo/` | 一个可运行配方示例（内置插槽版 + 自绘版），同时作为回归锚点 |

## Risks / Tradeoffs

- **使用方根元素不是撑满行高的 flex 行** → 引导线在缩进格内随行高伸展，未撑满时线被截断。缓解：文档把摆放契约写成 MUST（`height:100%; display:flex; align-items:center`），`docs-demo` 给可直接复制的最小骨架。
  （实现期修正：引导线改为定位在内置缩进格内，`position:relative` 不再要求使用方提供，原「固定列 `td` 为 sticky 会抢走包含块」的风险随之消失；同时取消叶子行自身格的线，件只输出 `--stk-tree-indent-cells`。）
- **`data-stk-fold` 仍是约定式契约，点不下去时难排查** → 接受该代价（换取单一触发机制）。缓解：文档写明「自绘控件需带该属性」，并在内置路径回归测试中把委托判据固定下来。
- **委托选择器加宽后，使用方误在多个元素上标 `data-stk-fold`（如箭头与标签各标一次）** → 一行内首个命中即切换，行为仍确定，只是点击热区变大。缓解：文档限定「每格一个展开控件」。
- **插槽为所有 customCell 无条件构造，可能带来渲染开销** → 插槽内容惰性求值，未消费时不产生 vnode；虚拟滚动下成本可忽略，仍需在 5k 行树表上顺手确认一次展开/滚动不劣化。
- **内置件重构 `TreeNodeCell` 有回归风险** → 以「内置路径 DOM 与类名逐字节不变」为验收线：现有 `test/treeGuideLine.test.ts` 等用例必须原样通过，不靠改断言迁就实现。

## Migration Plan

纯增量，无使用方迁移：既有 `.stk-fold-icon` 委托继续匹配、不配 customCell 的路径行为不变、`CustomCellProps` 新字段为可选。回滚即 revert 本 change 的提交（`data-stk-fold` 与 `--tree-indent-width` 未被写入前不应出现在文档外的位置）。发布为 minor。

## Open Questions

- 是否需要把 loading 从 `stkFoldIcon` 里再拆成独立插槽（当前判断：不拆，二者互斥占同一位置，拆了增加使用方组合负担）。
- `--tree-indent-width` 是否顺带做成 `treeConfig.indentWidth`（当前判断：不做，CSS 变量已够，避免第二个真相来源）。
