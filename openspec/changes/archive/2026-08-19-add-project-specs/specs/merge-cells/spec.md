# merge-cells 规格（delta）

## Purpose

定义单元格合并的行为契约：通过列配置 `mergeCells` 函数声明 rowspan/colspan，兼容纵向与横向虚拟滚动（含超长合并），并规定合并结果缓存的失效语义。

## ADDED Requirements

### Requirement: mergeCells 函数契约

`StkTableColumn['mergeCells']` 函数 SHALL 接收 `{ row, col, rowIndex, colIndex }` 参数，返回 `{ colspan?, rowspan? }` 表示该单元格的合并数量；返回 undefined 表示不合并。

#### Scenario: 按行数据声明合并数量

- **WHEN** `mergeCells` 根据行数据字段返回 `{ colspan }` 或 `{ rowspan }`
- **THEN** 对应单元格按声明的数量合并渲染，被合并覆盖的单元格不渲染

### Requirement: 行列合并与虚拟滚动兼容

行合并（rowspan）与列合并（colspan）SHALL 可同时使用，并 MUST 兼容 `virtual` 与 `virtualX` 虚拟滚动。

#### Scenario: 行列合并下的双向虚拟滚动

- **WHEN** 同时存在 rowspan 与 colspan 且启用 `virtual` 与 `virtualX` 滚动
- **THEN** 合并单元格在视口内完整正确渲染

### Requirement: 横向虚拟滚动下合并锚点列的可视区扩展

横向虚拟滚动模式下，合并单元格（colspan）的锚点列滚出可视区域时，组件 SHALL 自动扩展可视列范围，保证合并单元格完整渲染，包括超长 colspan（如合并上百列）场景。

#### Scenario: 锚点列滚出可视区

- **WHEN** 大 colspan 合并单元格的锚点列已滚出可视区，而合并区域仍与可视区相交
- **THEN** 可视列范围扩展到覆盖整个合并区域，合并单元格持续完整渲染

### Requirement: 超长 rowspan 的渲染语义

超大 rowspan（如上千行）时，虚拟列表 SHALL 渲染该合并单元格覆盖的视口行；该场景可能带来性能下降，属于已知行为而非缺陷。

#### Scenario: 超大 rowspan 滚动

- **WHEN** rowspan 达数千行且纵向滚动穿过该合并区域
- **THEN** 合并单元格持续正确渲染，不出现错位或空白

### Requirement: 合并结果缓存语义与手动失效

mergeCells 的计算结果 SHALL 被缓存，且仅在 `dataSource` / `columns` 变化时自动清空；原地修改行字段（行对象引用不变）且 mergeCells 依赖这些字段时，使用方 MUST 调用实例方法 `clearMergeCellsCache()` 手动失效缓存，否则合并结果继续使用旧缓存。

#### Scenario: 替换 dataSource 自动清空缓存

- **WHEN** 通过传入新数组替换 `dataSource`
- **THEN** 合并结果缓存自动清空并按新数据重算，无需手动调用

#### Scenario: 原地修改行字段后手动失效

- **WHEN** 原地修改行对象上影响合并的字段后调用 `clearMergeCellsCache()`
- **THEN** 合并结果按新字段值重新计算并渲染
