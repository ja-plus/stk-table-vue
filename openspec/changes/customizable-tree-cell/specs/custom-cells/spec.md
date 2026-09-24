## ADDED Requirements

### Requirement: 自定义单元格的展开相关上下文

`customCell` 组件接收的 props 中，除既有 `row` / `col` / `cellValue` / `rowIndex` / `colIndex` / `expanded` / `treeExpanded` 外，SHALL 提供树形与展开列所需的上下文：所在层级、该行是否可展开、该行是否处于子节点懒加载加载态。这三个字段 SHALL 对所有列都传入取值，非树形数据取中性默认值（层级为 `0`、可展开与加载态为 `false`），以避免使用方额外做 `undefined` 兜底；MUST NOT 因此把任何字段变成必填，也 MUST NOT 借这些字段暴露表格私有行字段。

展开/折叠 MUST NOT 要求使用方调用额外实例方法——使用方既可依赖内置装饰，也可自绘控件后由组件接管切换。

#### Scenario: 懒加载未展开的行给出可展开判定

- **WHEN** 懒加载模式下一行标记有子节点但尚未加载，其所在 `tree-node` 列配置了 `customCell`
- **THEN** 该 `customCell` 收到「可展开为真、层级为该行层级、加载态为假」，可据此决定是否绘制展开控件

#### Scenario: 加载中给出加载态

- **WHEN** 某行正在通过懒加载拉取子节点
- **THEN** 该行的 `customCell` 上下文中加载态为真，行展开态仍按既有约定提供

#### Scenario: 普通列收到中性默认值

- **WHEN** 一个 `dataIndex` 普通列（无 `type`）配置 `customCell`
- **THEN** 其 `level` / `expandable` / `treeLoading` 分别为 `0` / `false` / `false`，其余 props 与本能力新增上下文之前一致，渲染与交互不变

### Requirement: 内置装饰以命名插槽提供给自定义单元格

`customCell` 组件 SHALL 能以命名插槽取回内置装饰节点：展开控件（含懒加载 loading 的自动取舍）与「层级缩进 + 引导线」。插槽内容未被使用时 MUST NOT 产生任何 DOM；`treeConfig.showGuide` 关闭时，缩进装饰 MUST 只保留缩进而无引导线，使用方 MUST NOT 需要感知该配置。

使用这些插槽时其根元素须提供撑满整行高的 flex 行布局（引导线在缩进格内随行高伸展）；该摆放要求 SHALL 写入文档。

#### Scenario: 不消费插槽时无残留

- **WHEN** `customCell` 组件未渲染这些内置装饰插槽
- **THEN** 单元格内不出现对应装饰的 DOM 节点，外观完全由使用方决定

#### Scenario: 引导线开关由内置装饰自行处理

- **WHEN** `treeConfig.showGuide` 为 `false` 且 `customCell` 渲染了内置缩进装饰
- **THEN** 该行仍有按层级的缩进，但无引导线，与内置单元格在此配置下的表现一致
