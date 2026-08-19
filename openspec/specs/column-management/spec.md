# column-management Specification

## Purpose
定义列管理交互的行为契约：列宽拖拽调整（colResizable）与表头拖动换序（headerDrag）的启用方式、`v-model:columns` 双向绑定语义、禁用配置与相关事件。

## Requirements

### Requirement: 列宽调整的启用与列宽回写

`props.colResizable` 为 `true` 或配置对象时 SHALL 开启列宽调整；列宽变化后组件 SHALL 直接变更对应 `StkTableColumn['width']` 的值，配合 `v-model:columns` 实现回写，并触发 `@col-resize` 事件（携带变更后的列对象）。开启列宽调整后，列宽 SHALL NOT 默认铺满容器。

#### Scenario: 拖拽调整列宽

- **WHEN** 启用 `colResizable` 且 `columns` 使用 `v-model:columns` 绑定，用户拖动列边缘
- **THEN** 该列 `width` 被更新并触发 `col-resize` 事件

#### Scenario: 通过事件手动维护列宽

- **WHEN** `columns` 未使用 `v-model`，使用方监听 `col-resize` 手动更新列宽
- **THEN** 表格按手动更新的列宽渲染

### Requirement: 列宽调整的禁用配置

`props.colResizable` 为配置对象时 SHALL 支持 `disabled: (col) => boolean`，返回 true 的列 MUST 禁用拖动调整列宽（如禁用最后一列）。

#### Scenario: 禁用某列的列宽调整

- **WHEN** `colResizable.disabled` 对某列返回 true
- **THEN** 该列边缘不可拖动调整宽度

### Requirement: 表头拖动换序的启用与模式

`props.headerDrag` SHALL 启用表头拖动换序，配合 `v-model:columns` 回写列顺序；配置对象支持 `mode`：`'insert'`（默认，插入）、`'swap'`（交换）、`'none'`（不做处理），以及 `disabled: (col) => boolean` 禁用指定列的拖动。

#### Scenario: 拖动表头插入到新位置

- **WHEN** 启用 `headerDrag`（默认 insert 模式）并将某表头拖至另一列
- **THEN** 被拖列插入到目标位置，`columns` 顺序更新

### Requirement: 表头拖动相关事件

拖动换序 SHALL 触发 `@col-order-change(dragStartKey, targetColKey)`；拖动开始与放下时分别 SHALL 触发 `@th-drag-start(dragStartKey)` 与 `@th-drop(targetColKey)`。使用方 MAY 不使用 `v-model`，仅通过 `col-order-change` 手动维护列顺序。

#### Scenario: 通过事件手动维护列顺序

- **WHEN** 使用方监听 `col-order-change` 并手动调整 `columns` 数组顺序
- **THEN** 表格按新顺序渲染列
