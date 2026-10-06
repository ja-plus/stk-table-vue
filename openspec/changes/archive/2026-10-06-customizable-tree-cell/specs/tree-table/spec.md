## MODIFIED Requirements

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

## ADDED Requirements

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
