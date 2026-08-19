# tree-table Specification

## Purpose
定义树形表格与行展开的行为契约：通过 `tree-node` 类型列与数据 `children` 字段展示层级数据，支持默认展开配置与 setTreeExpand 程序化展开控制；通过 `expand` 类型列与 `#expand` 插槽展示自定义展开行内容，并约束组件注入字段的处理方式。

## Requirements

### Requirement: 树形数据的展示与展开交互

列配置 `type: 'tree-node'` SHALL 指定树形展开按钮所在列；数据行的 `children` 字段内容 SHALL 在该行展开时作为子节点展示，支持多层嵌套。

#### Scenario: 点击展开按钮展示子节点

- **WHEN** 数据行包含 `children` 且用户点击其展开按钮
- **THEN** 子节点行紧随父行展示，再次点击折叠

### Requirement: 默认展开配置仅首次渲染生效

`props.treeConfig` SHALL 支持 `defaultExpandAll`、`defaultExpandLevel`、`defaultExpandedKeys` 三种默认展开配置，且 MUST 仅在表格第一次渲染时生效；异步数据场景 SHALL 使用 `setTreeExpand` 控制。

#### Scenario: 首次渲染按层级默认展开

- **WHEN** 配置 `treeConfig.defaultExpandLevel = 1` 且表格首次渲染
- **THEN** 第 1 层节点默认展开，更深层节点折叠

### Requirement: setTreeExpand 程序化控制节点展开

组件 SHALL expose `setTreeExpand(row, option?)`，row 接受 rowKey / row 或它们的数组；`option.expand` 不传时按当前状态取反，`option.all` 展开所有后代，`option.level` 展开到指定层级，`option.parents` 将传入行视为目标子节点并展开/收起其所有父节点（目标行自身有子节点时展开操作会一并展开自身）；若当前筛选过滤掉了某祖先，parents 展开 MUST 在该处中断。

#### Scenario: parents 模式定位深层行

- **WHEN** 对深层子节点 rowKey 调用 `setTreeExpand(rowKey, { expand: true, parents: true })`
- **THEN** 其所有父节点被展开使该行可见，该行自身有子节点时也一并展开

### Requirement: 展开状态注入字段的约束

组件 SHALL 在 dataSource 的每一行注入 `__T_EXP__` 字段用于记录展开状态；使用方更新行数据时 MUST NOT 修改该字段（如使用 Object.assign 更新）。

#### Scenario: 更新行数据不破坏展开状态

- **WHEN** 使用 Object.assign 更新某展开行的字段
- **THEN** 该行展开状态保持不变

### Requirement: expand 行展开列与 setRowExpand

列配置 `type: 'expand'` SHALL 将该列渲染为可展开单元格，展开内容通过 `#expand="{ row, col }"` 插槽提供；展开行高度 SHALL 由 `props.expandConfig.height` 控制（默认为表格行高）。组件 SHALL expose `setRowExpand(rowKeyOrRow, expand?, { col?, silent? })`，`silent` 为 true 时 MUST NOT 触发 `@toggle-row-expand` 事件。

#### Scenario: 展开行展示插槽内容

- **WHEN** 某列配置 `type: 'expand'` 且用户点击其展开按钮
- **THEN** 该行下方渲染 `#expand` 插槽内容，再次点击收起

### Requirement: 树形与虚拟列表兼容

树形表格 SHALL 在启用 `virtual` 时正常工作；`dataSource` 每次变化组件都会遍历展平数据，频繁变化的大数据树形场景 SHALL 由使用方自行评估性能。

#### Scenario: 树形数据虚拟滚动

- **WHEN** 树形数据启用 `virtual` 并展开多个节点后纵向滚动
- **THEN** 展平后的可见行按虚拟滚动正确渲染
