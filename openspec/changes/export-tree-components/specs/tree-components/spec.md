## Purpose

为树形表格和自定义树节点界面提供可复用、类型明确且不依赖表格私有行字段的缩进与展开控件公共组件。

## ADDED Requirements

### Requirement: 公共入口导出树形组件

包的公共入口 SHALL 导出 `StkTreeCell`、`StkTreeIndent` 与 `StkTreeFoldIcon` 三个组件，并为 Vue 3 与 Vue 2.7 使用方提供可解析的组件类型声明。导出组件不得要求使用方导入 `src/` 下的内部路径。

#### Scenario: 从包入口导入组件

- **WHEN** 使用方从 `stk-table-vue` 导入 `StkTreeCell`、`StkTreeIndent` 或 `StkTreeFoldIcon`
- **THEN** 三个值均可作为 Vue 组件注册或在模板中直接使用，且无需额外运行时依赖

#### Scenario: 类型检查公共组件

- **WHEN** TypeScript 使用方为组件传入合法 props 或故意传入不存在的 props
- **THEN** 合法 props 通过类型检查，不存在的 props 按组件声明产生类型错误

### Requirement: 完整树单元格组件

`StkTreeCell` SHALL 是一个可直接赋给 `StkTableColumn.customCell` 的完整树单元格组件。它 SHALL 使用 customCell 提供的公开上下文渲染标签、层级缩进、引导线和展开控件，并 SHALL 接收 `level`、`expandable`、`treeLoading`、`treeExpanded` 等公开状态，而不得要求使用方提供或修改 `__T_*`、`__EXP_*` 等私有字段。组件 SHALL 支持控制引导线显示的配置，并在表格中保持现有默认树单元格的视觉和展开行为。

#### Scenario: 作为 customCell 使用

- **WHEN** 使用方将 `StkTreeCell` 配置到 `tree-node` 列的 `customCell`
- **THEN** 组件使用表格传入的 `level`、`expandable`、`treeLoading` 和 `treeExpanded` 渲染完整树单元格，且无需读取私有行字段

#### Scenario: 公共上下文驱动状态

- **WHEN** 表格行的层级、可展开性、懒加载状态或展开状态发生变化
- **THEN** `StkTreeCell` 的缩进、箭头/loading 和展开态视觉随公开 props 更新

#### Scenario: 保持展开委托

- **WHEN** 用户点击 `StkTreeCell` 内的展开控件
- **THEN** `StkTable` 能按现有委托规则切换行状态，并且不额外触发普通单元格点击语义

### Requirement: 树形缩进组件

`StkTreeIndent` SHALL 接收可选的 `level?: number`、可选的 `showGuide?: boolean` 与可选的 `offset?: string`；`level` 未传入 SHALL 等价于根层级（缩进 0 格）。它 SHALL 按层级渲染与内置树单元格一致的缩进宽度；当 `showGuide` 为真时 SHALL 渲染祖先层级引导线，当其为假或未传入时 SHALL 只保留缩进而不渲染引导线。`offset` SHALL 为 CSS 长度，且 SHALL 只平移引导线图案，用于校正自定义展开图标中心；MUST NOT 改变缩进宽度、标签位置或引导线间距，未传入时 SHALL 不产生偏移。组件 SHALL 使用现有 `--tree-indent-width`、`--tree-guide-color`、`--tree-guide-width` 和 `--tree-guide-mask` 样式变量，且默认视觉与内置树单元格一致。

#### Scenario: 根层级只渲染零宽缩进

- **WHEN** `StkTreeIndent` 的 `level` 为 `0`
- **THEN** 组件不显示引导线，且不会产生可见的层级缩进

#### Scenario: 未传层级时按根层级处理

- **WHEN** 未传入 `level`
- **THEN** 组件按 0 格缩进渲染（等价于根层级），不报错也不产生引导线

#### Scenario: 深层级显示对应缩进

- **WHEN** `level` 为大于 `0` 的整数
- **THEN** 组件的缩进宽度按 `--tree-indent-width * level` 计算，并与内置树节点的标签起始位置对齐

#### Scenario: 引导线开关

- **WHEN** `showGuide` 为真且 `level` 大于 `0`
- **THEN** 组件显示祖先层级引导线，数量与祖先层级一致，不覆盖当前行自身的展开控件格

- **WHEN** `showGuide` 为假或未传入
- **THEN** 组件仍保留缩进，但不渲染引导线

#### Scenario: offset 只平移引导线

- **WHEN** 传入 `offset` 为 CSS 长度（如 `'4px'`）
- **THEN** 引导线图案整体平移该长度以对齐自定义展开图标中心，缩进宽度、标签位置与引导线间距均不变

- **WHEN** 未传入 `offset`
- **THEN** 不产生任何偏移，引导线与内置箭头中心对齐，表现与未增加该属性时一致

### Requirement: 树形展开控件组件

`StkTreeFoldIcon` SHALL 由公开状态 props 驱动，而不得要求使用方提供或修改 `__T_*`、`__EXP_*` 等表格私有字段。组件 SHALL 支持 `expandable?: boolean`、`loading?: boolean` 与 `expanded?: boolean`，并按 loading 优先、可展开其次、叶子占位最后的顺序表达状态。

#### Scenario: 可展开节点显示展开控件

- **WHEN** `expandable` 为真且 `loading` 为假
- **THEN** 组件显示可展开控件，并输出 `data-stk-fold` 标记供 `StkTable` 的点击委托识别

#### Scenario: 展开状态可被表达

- **WHEN** `expanded` 在 `false` 与 `true` 之间变化
- **THEN** 组件的视觉状态随之变化，且使用方可以据此同步自己的展开图标状态

#### Scenario: 懒加载状态优先

- **WHEN** `loading` 为真
- **THEN** 组件显示 loading 状态，不输出可触发展开切换的 `data-stk-fold` 标记

#### Scenario: 叶子节点保持占位对齐

- **WHEN** `expandable`、`loading` 均为假
- **THEN** 组件渲染与展开控件同宽的占位格，使叶子节点内容与可展开节点对齐

### Requirement: 与 StkTable 展开委托兼容

`StkTreeFoldIcon` 在 `StkTable` 的 `tree-node` 或 `expand` customCell 中使用时 SHALL 与现有展开委托兼容。命中其展开控件时，表格 SHALL 切换对应行的展开状态并结束本次单元格点击处理，不额外触发普通 `cell-selected` 或 `cell-click` 语义；未命中展开控件时，既有普通单元格点击行为 SHALL 保持不变。

#### Scenario: 公共展开控件接入树 customCell

- **WHEN** customCell 使用 `StkTreeFoldIcon` 渲染可展开节点并将该节点放在表格单元格内
- **THEN** 点击该控件切换树节点展开状态，且与使用 `stkFoldIcon` 插槽中的内置控件具有相同的委托行为

#### Scenario: 自定义布局仍可放置缩进和控件

- **WHEN** customCell 同时使用 `StkTreeIndent` 与 `StkTreeFoldIcon`，并将二者放入自己的 flex 行布局
- **THEN** 缩进、引导线、展开控件和标签可以由使用方重新排序，表格展开交互仍然有效

#### Scenario: 非表格场景独立使用

- **WHEN** 使用方在 `StkTable` 外部渲染 `StkTreeFoldIcon`
- **THEN** 组件只负责根据 props 渲染受控视觉状态，不擅自修改外部树数据或维护展开状态

### Requirement: 既有内部插槽兼容

现有 customCell 侧的 `stkTreeIndent` 与 `stkFoldIcon` 插槽 SHALL 继续可用，且不要求已有使用方改写模板。内置 `StkTable` 树单元格的默认视觉、引导线开关、懒加载 loading 和展开委托行为 SHALL 保持不变。

#### Scenario: 既有插槽调用不变

- **WHEN** 已有 customCell 通过 `<slot name="stkTreeIndent" />` 或 `<slot name="stkFoldIcon" />` 消费内置内容
- **THEN** 插槽仍能获得对应的缩进或展开视觉，且无需改用公共组件名称

#### Scenario: 未使用 customCell 的树表回归

- **WHEN** `tree-node` 或 `expand` 列未配置 customCell
- **THEN** 树表的缩进、箭头、loading、展开态和点击行为与变更前一致
