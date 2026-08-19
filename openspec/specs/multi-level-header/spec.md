# multi-level-header Specification

## Purpose
定义多级表头的行为契约：通过列配置的 `children` 字段构建多层表头结构，支持横向虚拟滚动，并规定多级表头下固定列的配置方式与模式限制。

## Requirements

### Requirement: 通过 children 配置多级表头

`StkTableColumn['children']` 存在时，组件 SHALL 将该列渲染为父级表头，其 children 渲染为下级表头，支持任意层级嵌套；父级表头横向跨越其所有叶子列。

#### Scenario: 两级表头渲染

- **WHEN** 列配置包含一层 `children`
- **THEN** 表头渲染为两行，父级表头宽度覆盖其所有子列

### Requirement: 多级表头支持横向虚拟滚动

设置 `props.virtualX` 时，多级表头 SHALL 参与横向虚拟滚动，仅渲染可视区域内的表头列。

#### Scenario: 多级表头横向虚拟滚动

- **WHEN** 多级表头配置下启用 `virtualX` 并横向滚动
- **THEN** 表头与数据列的可视列范围同步，父级表头随其子列进出可视区正确渲染

### Requirement: 多级表头固定列按节点独立配置

多级表头下 `fixed` 配置 SHALL 仅作用于当前表头节点；要固定某个父级表头，MUST 同时为该节点及其需要固定的子节点分别配置 `fixed`。

#### Scenario: 父级与子级均配置固定

- **WHEN** 父级表头与其下所有叶子列均配置 `fixed: 'left'` 并横向滚动
- **THEN** 该组表头列整体固定在左侧

### Requirement: 特殊固定模式在横向虚拟滚动下的限制

「仅配置叶子节点固定」与「任意节点固定」的多级表头固定模式在 `virtualX` 下 SHALL NOT 被支持。

#### Scenario: virtualX 下仅叶子固定

- **WHEN** 启用 `virtualX` 且多级表头仅叶子节点配置固定
- **THEN** 该组合属于不支持的模式，行为不作保证
