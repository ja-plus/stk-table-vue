## MODIFIED Requirements

### Requirement: 列可固定在左侧或右侧并支持吸附

`StkTableColumn['fixed']` 设置为 `'left'` 或 `'right'` 时，该列 SHALL 固定在对应侧；基于 sticky 特性，任意一列都 MAY 作为固定列，且仅当该列随滚动超出可视区时才发生吸附。

固定列的 CSS class（`fixed-cell`、`fixed-cell--active`、`fixed-cell--left`/`right` 等）SHALL 以空格分隔正确输出到 DOM 元素的 `class` 属性中，确保 `position: sticky` 样式能够生效。

#### Scenario: 横向滚动时固定列吸附

- **WHEN** 中间某列配置 `fixed: 'left'` 且用户横向滚动使该列移出可视区
- **THEN** 该列吸附在表格左侧保持可见

#### Scenario: 固定列 class 正确序列化

- **WHEN** 某列配置了 `fixed: 'left'` 或 `fixed: 'right'`
- **THEN** 该列所有单元格（th/td/tf）的 `class` 属性 MUST 包含以空格分隔的固定列相关类名（如 `fixed-cell fixed-cell--left`），而非逗号连接的字符串
