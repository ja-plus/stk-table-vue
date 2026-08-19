# sorting Specification

## Purpose
定义 StkTable 列排序的行为契约：本地排序（默认/自定义排序函数/sortField）、服务端排序、多列排序、默认排序配置，以及排序相关的实例方法与事件语义。

## Requirements

### Requirement: 列排序的开启与方向切换

`StkTableColumn['sorter']` 为 `true` 时该列 SHALL 开启排序，点击表头触发排序并在 desc → asc → null 之间切换；`sorter` 为函数 `(data, { column, order })` 时 SHALL 使用函数返回值作为排序后的展示数据。

#### Scenario: 点击表头循环切换排序方向

- **WHEN** 用户连续三次点击开启排序的表头
- **THEN** 排序方向依次为倒序、正序、取消排序（null）

#### Scenario: 自定义排序函数生效

- **WHEN** `sorter` 配置为函数并触发排序
- **THEN** 表格使用该函数的返回值展示数据

### Requirement: 支持指定排序字段与排序类型

列配置 `sortField` 存在时 SHALL 使用该字段而非 `dataIndex` 排序；`sortType` 为 `'string'` 或 `'number'` 时按指定类型比较，未指定时 SHALL 自动检测该列首行数据类型。

#### Scenario: sortField 指定独立排序字段

- **WHEN** 某列配置了 `sortField` 并触发排序
- **THEN** 按 `sortField` 对应字段的值排序，展示仍为 `dataIndex` 字段

### Requirement: 全局排序配置

`props.sortConfig` SHALL 支持：`emptyToBottom`（空值恒置底部）、`stringLocaleCompare`（字符串用 localeCompare 比较）、`sortChildren`（树形数据对子节点排序）、`defaultSort`（初始化及排序方向为 null 时应用的默认排序）。列级 `sortConfig` 优先级 MUST 高于全局配置。

#### Scenario: 空值始终置于底部

- **WHEN** 配置 `sortConfig.emptyToBottom = true` 并排序
- **THEN** 空字段行在正序与倒序下均位于列表底部

#### Scenario: 默认排序在取消排序时生效

- **WHEN** 配置了 `defaultSort` 且用户将某列排序切换至 null
- **THEN** 表格按 `defaultSort` 指定的字段与方向排序

### Requirement: 服务端排序模式

`props.sortRemote` 为 `true` 时，组件 SHALL NOT 执行内部排序逻辑，点击表头仅触发 `@sort-change` 事件，由使用方自行更新 `dataSource`。

#### Scenario: 远程排序不改变本地数据顺序

- **WHEN** 启用 `sortRemote` 并点击表头
- **THEN** 组件不重排数据，触发 `sort-change` 事件携带列、方向、数据与 sortConfig

### Requirement: 多列排序

`props.sortConfig.multiSort = true` 时 SHALL 支持同时保持多个排序条件：先点击的列优先级更高，重复点击同列切换方向，第三次点击取消该列排序；`multiSortLimit`（默认 3）SHALL 限制最大排序列数。

#### Scenario: 多列排序优先级

- **WHEN** 多列排序模式下先后点击 A、B 两列
- **THEN** 数据先按 A 列排序再按 B 列排序，两列排序状态同时保持

### Requirement: 排序相关实例方法与状态

组件 SHALL expose `setSorter(colKey, order, option)`（设置表头排序状态，返回当前表格数据；`option.force` 可在 `sortRemote` 下强制排序、`option.silent` 禁止触发回调、`option.sortOption` 指定排序参数且优先级最高）、`resetSorter()`、`getSortColumns()`、`sortCol` 与 `sortStates`。

#### Scenario: setSorter 静默设置排序

- **WHEN** 调用 `setSorter(colKey, 'desc', { silent: true })`
- **THEN** 表格按该列倒序展示且不触发 `sort-change` 事件
