## Purpose

定义表格"增量追加数据"能力的对外行为契约：`appendDataSource` 实例方法的语义、增量快速路径的适用与自动回退判定、追加后视口与各类状态的稳定性，以及流式追加场景的性能验收要求。

## ADDED Requirements

### Requirement: 提供 appendDataSource 增量追加接口

组件 SHALL 通过公共实例方法 `appendDataSource(rows, options?)` 向当前数据源**尾部追加**若干行，追加后表格 MUST 渲染出这些新行，且最终可见结果与"把新行拼到 `dataSource` 末尾后整体替换"保持一致。`rows` 为非空数组时按顺序追加；`options.silent` 为 `true` 时 MUST NOT 触发数据变更相关对外回调。

#### Scenario: 尾部追加即时可见

- **WHEN** 表格已有 N 行，调用 `appendDataSource([r1, r2])`
- **THEN** 表格总行数变为 N+2，r1、r2 按给定顺序出现在数据尾部，滚动到底部可见

#### Scenario: 空表首次追加

- **WHEN** 表格当前无数据，调用 `appendDataSource(rows)`
- **THEN** 表格展示 `rows`，无空数据占位，虚拟滚动窗口正确计算

#### Scenario: 与整体替换结果等价

- **WHEN** 分别用 `appendDataSource(rows)` 与 `dataSource = [...old, ...rows]` 追加相同数据
- **THEN** 两种方式的最终行顺序与渲染内容一致

### Requirement: 增量快速路径的适用条件与自动回退

当追加满足「无本地排序生效，或调用方通过 `options.sorted=true` 声明新数据已按当前排序有序 & 非树形数据 & 无跨行动态合并 & 追加发生在尾部」时，组件 SHALL 走增量路径，只对新增行做处理。任一条件不满足时，组件 MUST 自动回退到与整体替换等价的全量处理，保证结果正确性，且对外行为（最终顺序、合并、展开态、筛选结果）不变。

#### Scenario: 满足条件走增量

- **WHEN** 无排序、非树形、无跨行合并的表格调用 `appendDataSource(rows)`
- **THEN** 追加成功且结果与整体替换一致（内部走增量不改变对外可见结果）

#### Scenario: 声明有序时跳过重排

- **WHEN** 表格正按某列升序排序，调用方以 `appendDataSource(rows, { sorted: true })` 追加一批已按该列升序且不小于当前末值的数据
- **THEN** 新行顺序保持在末尾，MUST NOT 打乱既有排序

#### Scenario: 未声明有序且存在本地排序时回退

- **WHEN** 表格正按某列排序，调用 `appendDataSource(rows)` 追加乱序数据且未声明 `sorted`
- **THEN** 组件回退全量重排，最终顺序仍满足当前排序规则

#### Scenario: 树形/动态合并/筛选生效时回退

- **WHEN** 表格处于树形展开、跨行动态合并或筛选生效状态时调用 `appendDataSource(rows)`
- **THEN** 组件回退全量处理，展开层级、合并锚点与筛选结果均保持正确

### Requirement: 追加不重置既有可视与交互状态

增量追加 MUST NOT 使表格滚动位置或当前可视窗口发生非预期跳变，MUST NOT 清空用户既有的当前行选中与区域选区（除非追加导致所选数据本身被移除的语义变化）。

#### Scenario: 滚动中途追加不跳位

- **WHEN** 用户已滚动到表格中部，此时在尾部 `appendDataSource(rows)`
- **THEN** 视口停留在原位置，不发生跳回顶部或内容闪动，仅总高度/滚动条比例随行数增加而更新

#### Scenario: 选中状态保持

- **WHEN** 用户已选中某当前行，随后追加新行
- **THEN** 原当前行高亮保持不变

### Requirement: 追加后状态一致性

追加后，新行的合并单元格回调、行唯一键与既有缓存 MUST 保持一致性：对既有行不得因追加而产生错误的结果变化，跨越"旧数据/新数据"边界的合并锚点 MUST 按合并规则正确重算。

#### Scenario: 行唯一键稳定

- **WHEN** 追加新行后触发重渲染
- **THEN** 既有行的行唯一键不发生变化，新行按其 rowKey 规则获得正确且唯一的键

#### Scenario: 边界合并正确重算

- **WHEN** 启用行合并且新追加行与末行满足合并条件
- **THEN** 跨边界的合并 rowspan 正确扩展，不出现错位或残留旧合并结果

### Requirement: 兼容 Vue 3 与 Vue 2.7

`appendDataSource` 在 Vue 3 与 Vue 2.7 两种运行环境下 MUST 提供一致的对外行为与渲染结果。

#### Scenario: 双版本行为一致

- **WHEN** 分别在 Vue 3 与 Vue 2.7 消费方调用 `appendDataSource(rows)`
- **THEN** 追加结果、视口稳定性与状态一致性表现一致

### Requirement: 流式追加性能防回退验收

仓库 SHALL 为流式追加提供可复现的性能验收：在"数据持续增长、多次尾部追加"场景下，走增量路径的单次追加耗时 MUST NOT 随当前总行数线性增长；相对既有全量替换链路，灌满同等数据量的总耗时 MUST 有可测量的下降。回退场景下相关指标 MUST NOT 劣于既有基线 10%。

#### Scenario: 单次追加耗时近似不随规模增长

- **WHEN** 在无排序大表上从 1 万行持续追加到 5 万行，记录每次追加耗时
- **THEN** 走增量路径的单次追加耗时基本保持常数级，不随总行数线性上升

#### Scenario: 灌满总量总耗时下降

- **WHEN** 以固定批大小灌满 5 万行，对比增量追加与整体替换两条链路的总耗时
- **THEN** 增量链路总耗时显著低于整体替换链路

#### Scenario: 回退不引起基准回退

- **WHEN** 在排序/树形/合并等回退场景运行 `test/perf` 既有基准
- **THEN** 各场景指标不劣于变更前基线 10% 以上
