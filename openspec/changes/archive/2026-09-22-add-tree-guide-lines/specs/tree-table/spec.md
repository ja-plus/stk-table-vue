## ADDED Requirements

### Requirement: 树形层级引导线展示

`props.treeConfig.showGuide` 为 `true` 时，`tree-node` 列单元格 SHALL 在其缩进区域按层级绘制竖向引导线，使用户可直观判断各行的层级归属；`showGuide` 默认 `false`，关闭时 tree-node 单元格 MUST 保持既有纯缩进（`padding-left`）行为，不渲染任何引导线。引导线 SHALL 在启用 `virtual` 时随可见行正确渲染。

#### Scenario: 开启后按层级渲染引导线

- **WHEN** `treeConfig.showGuide = true` 且某行处于第 N 层（N ≥ 1）
- **THEN** 该行 tree-node 单元格的缩进区域为经过的每一层级各显示一条竖向引导线

#### Scenario: 关闭时保持既有行为

- **WHEN** 未配置 `treeConfig.showGuide` 或其为 `false`
- **THEN** tree-node 单元格仅按层级缩进，不渲染任何引导线，与既有行为一致

#### Scenario: 根层节点无引导线

- **WHEN** `treeConfig.showGuide = true` 且某行处于第 0 层（根节点）
- **THEN** 该行缩进区域为空，不显示引导线

#### Scenario: 虚拟滚动下随滚动渲染

- **WHEN** `treeConfig.showGuide = true` 且树形数据启用 `virtual` 并纵向滚动
- **THEN** 每个可见行独立渲染其经过层级的引导线段，滚出/滚入时引导线随行动态创建与销毁，不残留错位

### Requirement: 引导线样式可主题覆盖

引导线的颜色与线宽 SHALL 通过 CSS 变量暴露，暗色与亮色主题下 MUST 有默认可见取值，使用方 SHALL 能通过覆盖对应 CSS 变量自定义引导线外观，而无需修改组件内部结构。

#### Scenario: 使用方覆盖颜色变量

- **WHEN** 使用方在主题中覆盖引导线颜色 CSS 变量
- **THEN** 引导线以覆盖后的颜色渲染，无需改动组件代码
