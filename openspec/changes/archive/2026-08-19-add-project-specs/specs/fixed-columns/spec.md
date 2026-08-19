# fixed-columns 规格（delta）

## Purpose

定义基于 CSS sticky 的固定列与固定表头行为契约：列可声明固定在左侧或右侧，仅在滚出可视区时吸附，并规定列宽约束与固定列阴影开关。

## ADDED Requirements

### Requirement: 列可固定在左侧或右侧并支持吸附

`StkTableColumn['fixed']` 设置为 `'left'` 或 `'right'` 时，该列 SHALL 固定在对应侧；基于 sticky 特性，任意一列都 MAY 作为固定列，且仅当该列随滚动超出可视区时才发生吸附。

#### Scenario: 横向滚动时固定列吸附

- **WHEN** 中间某列配置 `fixed: 'left'` 且用户横向滚动使该列移出可视区
- **THEN** 该列吸附在表格左侧保持可见

### Requirement: 固定列吸附位置依赖列宽配置

固定列的吸附位置 SHALL 通过列宽累加计算，因此固定左侧列之前的所有列 MUST 指定列宽；声明在 `columns` 最末尾的右侧固定列始终保持固定、不依赖列宽，但若要右侧固定列具备吸附效果与阴影，所有列 MUST 补齐列宽。

#### Scenario: 固定列前存在无宽度列

- **WHEN** 某 `fixed: 'left'` 列之前存在未设置宽度的列
- **THEN** 吸附位置计算与实际渲染宽度不一致，吸附时机出现偏差（此为已知约束，配置方 MUST 保证列宽齐全）

### Requirement: 固定列阴影默认关闭可开启

固定列默认 SHALL 无阴影效果；设置 `props.fixedColShadow` 为 `true` 时 MUST 展示固定列阴影。

#### Scenario: 开启固定列阴影

- **WHEN** 设置 `fixed-col-shadow` 且固定列发生吸附
- **THEN** 固定列边缘展示阴影效果

### Requirement: 固定列与虚拟滚动兼容

固定列 SHALL 在启用纵向虚拟滚动（`virtual`）时正常工作；启用 `virtualX` 时未设置列宽的列 MUST 被强制设置为 100px 以参与固定位置计算。

#### Scenario: 虚拟列表下固定列

- **WHEN** 同时启用 `virtual` 与固定列配置并纵向滚动
- **THEN** 固定列持续固定且行渲染正确

### Requirement: 表头固定

表头 SHALL 在纵向滚动时保持在可视区顶部（基于 sticky 实现）；设置 `props.headless` 为 `true` 时 MUST 不渲染表头。

#### Scenario: 纵向滚动时表头保持可见

- **WHEN** 表格纵向滚动
- **THEN** 表头始终吸附在表格可视区顶部
