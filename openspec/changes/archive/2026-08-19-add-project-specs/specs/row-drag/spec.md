# row-drag 规格（delta）

## Purpose

定义行拖动换序的行为契约：提供内置 dragRow 列类型实现行拖拽排序，通过 row-order-change 事件通知使用方更新数据顺序。

## ADDED Requirements

### Requirement: 内置 dragRow 列类型

`StkTableColumn['type']` 为 `'dragRow'` 时 SHALL 渲染内置的行拖动手柄列；该列 MAY 通过 `StkTableColumn['key']`（配合 `props.colKey`）指定唯一键而不依赖 `dataIndex`。使用方 MAY 自行基于原生 draggable API 实现自定义行拖动。

#### Scenario: 拖动手柄列换序

- **WHEN** 配置 `type: 'dragRow'` 列且用户拖动某行至目标行位置
- **THEN** 拖动手柄可发起拖拽，drop 后按配置的 mode 完成换序并触发 `row-order-change` 事件

### Requirement: 行拖动模式与内部换序

`props.dragRowConfig.mode` SHALL 支持 `'insert'`（默认，插入）、`'swap'`（交换）与 `'none'`（不处理）；mode 非 `'none'` 时，组件 SHALL 在 drop 后自动更新内部展示数据的行顺序；拖到原位置（sourceIndex === endIndex）时 MUST 不触发任何变更。

#### Scenario: 默认插入模式换序

- **WHEN** 使用内置 dragRow 拖动某行至新位置并 drop
- **THEN** 被拖行插入到目标行位置，表格展示顺序更新

#### Scenario: none 模式不处理

- **WHEN** 配置 `dragRowConfig.mode = 'none'` 并拖动行 drop
- **THEN** 组件不改变内部行顺序，仅触发事件由使用方自行处理

### Requirement: 行拖动事件契约

行拖动换序 SHALL 触发 `@row-order-change(sourceIndex, endIndex)`，携带被拖行与目标行在当前数据中的索引。已知差异：文档中的事件类型声明参数为 rowKey，与当前实现的行索引不一致，本规格以实际实现为准，后续变更 SHOULD 统一二者。

#### Scenario: 事件参数正确

- **WHEN** 用户将索引为 2 的行拖至索引为 5 的行并 drop
- **THEN** 触发 `row-order-change` 事件且参数为 `(2, 5)`
