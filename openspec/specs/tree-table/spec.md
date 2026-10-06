# tree-table Specification

## Purpose
定义树形表格与行展开的行为契约：通过 `tree-node` 类型列与数据 `children` 字段展示层级数据，支持默认展开配置、子节点懒加载与 setTreeExpand 程序化展开控制；通过 `expand` 类型列与 `#expand` 插槽展示自定义展开行内容，并约束组件注入字段的处理方式；`tree-node` 列可通过 `treeConfig.showGuide` 按层级展示竖向引导线。

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

### Requirement: 树形子节点懒加载

`props.treeConfig.lazy` 为 `true` 时，展开一个"标记有子节点但子节点尚未加载"的行，组件 SHALL 调用 `treeConfig.loadMethod(row, col)` 获取子节点；`loadMethod` SHALL 返回一个 resolve 为子行数组的 Promise，组件在 resolve 后将该数组挂到该行的 `children` 并并入展平数据展示。`lazy` 默认 `false`，关闭时既有"数据自带完整 children"的树形行为 MUST 保持不变。

#### Scenario: 展开未加载分支触发取数并展示

- **WHEN** `treeConfig.lazy = true`，某行标记有子节点但 `children` 未加载，用户点击其展开按钮
- **THEN** 组件调用 `loadMethod(row, col)`，Promise resolve 后子节点行紧随父行展示

#### Scenario: 收起再展开不重复调用

- **WHEN** 某节点已成功加载子节点后被关闭，再次展开
- **THEN** 组件直接展示已缓存的子节点，MUST NOT 再次调用 `loadMethod`

### Requirement: 可展开标志判定

懒加载模式下，组件 SHALL 依据数据字段判定某行是否"有子节点"（可展开），默认字段名 `hasChildren`，可经 `treeConfig.hasChildField` 配置。当行的 `children` 已存在 **或** 该可展开字段为真时，tree-node 单元格 SHALL 显示展开箭头；两者皆无 SHALL 视为叶子节点不显示箭头。

#### Scenario: 未加载但标记有子节点显示箭头

- **WHEN** 一行 `children` 为空/未定义但 `hasChildren = true` 且 `lazy` 开启
- **THEN** 该行 tree-node 单元格显示展开箭头，允许被点击展开

#### Scenario: 叶子节点不显示箭头

- **WHEN** 一行 `children` 未定义且 `hasChildren` 为假
- **THEN** 该行不显示展开箭头

### Requirement: 懒加载加载态反馈

懒加载取数期间，组件 SHALL 给出加载中标识：在行上注入 `@private` 状态字段 `__T_LOADING__`（对外不可见）并为该行（`<tr>`）追加 `is-tree-loading` 类名，同时在 tree-node 单元格以内置 loading 图标替换展开箭头；加载完成或失败后加载态 MUST 消失。

#### Scenario: 加载中显示 loading 态

- **WHEN** `loadMethod` 已调用且 Promise 尚未 settle
- **THEN** 该行 `__T_LOADING__` 为真、整行(`<tr>`)带 `is-tree-loading` 类并显示 loading 图标

#### Scenario: 加载结束恢复

- **WHEN** `loadMethod` 的 Promise resolve 或 reject 完成
- **THEN** `__T_LOADING__` 清除，loading 图标消失，恢复展开箭头

### Requirement: 懒加载失败处理

`loadMethod` 返回的 Promise 被 reject 时，组件 SHALL 中止该次展开（该行保持折叠、不并入任何子节点），清除其加载态，MUST NOT 将失败节点标记为"已加载"（以便下次展开可重试）；若配置了 `treeConfig.onLoadError(error, row, col)` 组件 SHALL 调用之。

#### Scenario: 取数失败保持折叠可重试

- **WHEN** `loadMethod` 的 Promise reject
- **THEN** 该行保持折叠且未标记已加载，下次展开会重新触发 `loadMethod`

### Requirement: 单节点强制刷新

组件 SHALL expose 实例方法 `reloadTreeNode(rowKeyOrRow)`：对该已展开或已加载的节点强制重新调用 `loadMethod` 拉取子节点并替换其现有子树（含其后代展平行的重算）。

#### Scenario: 重载替换子树

- **WHEN** 对一个已加载并展开的节点调用 `reloadTreeNode(row)`
- **THEN** 组件重新调用 `loadMethod` 并用新结果替换该节点的子节点，展开区随之更新

### Requirement: lazy 与批量展开及 parents 定位的交互约束

`treeConfig.lazy` 为 `true` 时：`treeConfig.defaultExpandAll` / `defaultExpandLevel` 与 `setTreeExpand(..., { all: true })` / `{ level }` 在遇到"未加载的分支节点"时 SHALL 停止向下展开，MUST NOT 隐式发起链式加载。`setTreeExpand(row, { parents: true })` 的路径经过未加载祖先时 SHALL 依次 `await loadMethod` 链式加载这些祖先后再展开目标路径；任一祖先加载失败时 MUST 在该处中断并告警。

#### Scenario: 全展开遇未加载分支即停

- **WHEN** `lazy` 开启且调用 `setTreeExpand(root, { expand: true, all: true })`，某后代分支尚未加载
- **THEN** 已加载部分正常展开，遇到首个未加载分支即停止，不触发该分支的 `loadMethod`

#### Scenario: parents 链式加载定位深层行

- **WHEN** `lazy` 开启，对某深层子节点调用 `setTreeExpand(rowKey, { expand: true, parents: true })`，其祖先链存在未加载节点
- **THEN** 组件按从根到目标顺序链式调用 `loadMethod` 加载这些祖先并展开，使目标行可见

### Requirement: 树形层级引导线展示

`props.treeConfig.showGuide` 为 `true` 时，`tree-node` 列单元格 SHALL 在其**祖先各层级的缩进格**（第 0 层到第 level-1 层）内绘制竖向引导线，使用户可直观判断各行的层级归属；行自身的控件格（箭头 / 占位格）MUST NOT 绘制引导线，故第 0 层无引导线。`showGuide` 默认 `false`，关闭时 tree-node 单元格 MUST 保持既有纯缩进行为，不渲染任何引导线。引导线 SHALL 在启用 `virtual` 时随可见行正确渲染，并 SHALL 随 `--tree-indent-width` 的取值同步缩放。

#### Scenario: 开启后按层级渲染引导线

- **WHEN** `treeConfig.showGuide = true` 且某行处于第 N 层（N ≥ 1）
- **THEN** 该行缩进区域为经过的每一祖先层级各显示一条竖向引导线，共 N 条，自身控件格内无线

#### Scenario: 关闭时保持既有行为

- **WHEN** 未配置 `treeConfig.showGuide` 或其为 `false`
- **THEN** tree-node 单元格仅按层级缩进，不渲染任何引导线，与既有行为一致

#### Scenario: 根层节点无引导线

- **WHEN** `treeConfig.showGuide = true` 且某行处于第 0 层（根节点）
- **THEN** 该行缩进区域为空，不显示引导线（无论该行是否可展开）

#### Scenario: 虚拟滚动下随滚动渲染

- **WHEN** `treeConfig.showGuide = true` 且树形数据启用 `virtual` 并纵向滚动
- **THEN** 每个可见行独立渲染其祖先层级的引导线段，滚出/滚入时引导线随行动态创建与销毁，不残留错位

### Requirement: 引导线样式可主题覆盖

引导线的颜色与线宽 SHALL 通过 CSS 变量暴露，暗色与亮色主题下 MUST 有默认可见取值，使用方 SHALL 能通过覆盖对应 CSS 变量自定义引导线外观，而无需修改组件内部结构。

#### Scenario: 使用方覆盖颜色变量

- **WHEN** 使用方在主题中覆盖引导线颜色 CSS 变量
- **THEN** 引导线以覆盖后的颜色渲染，无需改动组件代码

### Requirement: 树节点列与展开列可被自定义单元格接管

`tree-node` 列与 `expand` 列同时声明 `customCell` 时，该单元格的内容渲染权 SHALL 归 `customCell` 组件；组件 MUST NOT 再叠加内置的 `tree-node` / `expand` 单元格渲染。行级展开状态反馈（展开态、懒加载态）SHALL 仍与单元格实现无关地生效，使使用方仅替换视觉即可保留状态表达。

接管后，内置的「层级缩进 + 引导线」与「展开控件 / 懒加载 loading」SHALL 以命名插槽内容的形式提供给该 `customCell` 组件，使用方可自行决定渲染与否及摆放位置；两者均不使用时，使用方 MUST 能在自带展开控件的前提下保持展开/折叠可用。

#### Scenario: 使用方接管后内置装饰可放回任意位置

- **WHEN** `tree-node` 列配置了 `customCell`，且该组件渲染了内置的缩进装饰与展开控件
- **THEN** 缩进、层级引导线、箭头及其展开态旋转、懒加载 loading 与内置（未配 `customCell`）时表现一致，仅摆放位置随使用方布局变化

#### Scenario: 使用方自绘展开控件仍可切换

- **WHEN** `tree-node` 列的 `customCell` 不渲染内置展开控件，而渲染自带的、标记为展开控件的元素
- **THEN** 点击该元素切换该行展开/折叠，且该次点击 MUST NOT 另行触发 `cell-selected` 与 `cell-click`

#### Scenario: 未接管时行为不变

- **WHEN** `tree-node` / `expand` 列未配置 `customCell`
- **THEN** 单元格渲染与交互与本能力既有要求完全一致

### Requirement: 展开控件的点击归属

树节点列与展开列中，一次点击 SHALL 至多归属一类语义：命中展开控件时切换展开/折叠并结束本次处理；未命中时按普通单元格点击处理（可触发选中与 `cell-click`）。同一单元格内的非控件区域点击 MUST NOT 触发展开/折叠。

#### Scenario: 点击标签文本不折叠

- **WHEN** 用户点击 tree-node 单元格中标签文本而非展开控件
- **THEN** 行展开状态不变，正常发出单元格点击相关事件
