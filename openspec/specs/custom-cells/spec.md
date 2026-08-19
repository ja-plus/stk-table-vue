# custom-cells Specification

## Purpose
定义内置自定义单元格工厂的行为契约：通过 createXxxCell 工厂函数生成可直接用于 `customCell` / `customHeaderCell` 的单元格组件，覆盖筛选、编辑、多选、数字格式化与涨跌染色场景。

## Requirements

### Requirement: 工厂函数导出与使用方式

包 SHALL 导出 `createFilterCell`、`createEditableCell`、`createCheckboxCell`、`createNumberCell`、`createChangeCell` 五个工厂函数及 `formatNumber` 工具；工厂返回的组件 SHALL 可直接赋值给 `StkTableColumn['customCell']`（或表头组件赋值给 `customHeaderCell`）。

#### Scenario: 工厂组件作为 customCell 使用

- **WHEN** 使用工厂函数创建单元格组件并配置为某列的 `customCell`
- **THEN** 该列单元格按工厂组件的行为渲染

### Requirement: EditableCell 可编辑单元格

`createEditableCell` 生成的单元格 SHALL 支持触发事件（`trigger`，默认 `'dblclick'`，可选 `'click'`）进入编辑模式；编辑模式下 Enter MUST 保存并退出、Escape MUST 取消并恢复原值；编辑完成后 SHALL 调用 `onChange(newValue, row, dataIndex)` 回调。

#### Scenario: 双击编辑并回车保存

- **WHEN** 用户双击单元格进入编辑，修改值后按 Enter
- **THEN** 新值被保存，退出编辑模式并触发 onChange 回调

#### Scenario: Escape 取消编辑

- **WHEN** 编辑过程中按 Escape
- **THEN** 恢复原值并退出编辑模式，不触发 onChange

### Requirement: CheckboxCell 多选框单元格

`createCheckboxCell` SHALL 生成 `CheckboxCell`（行级多选框）与 `CheckboxAllCell`（表头全选/半选）两个组件；选中状态 SHALL 读写行数据上 `field` 指定的字段（默认 `'_isChecked'`）；支持通过 `checkboxComponent` 替换为第三方 Checkbox 组件，并在状态变更时分别触发 `onChange` 与 `onSelectAll` 回调。

#### Scenario: 表头全选联动行多选框

- **WHEN** 用户点击表头 CheckboxAllCell 全选
- **THEN** 所有行的选中字段被置为选中并触发 `onSelectAll` 回调

### Requirement: NumberCell 数字格式化单元格

`createNumberCell` 生成的单元格 SHALL 按配置选项（小数位数、正负号、百分比、前后缀等）格式化展示数字值，格式化能力由 `formatNumber` 提供。

#### Scenario: 按小数位数格式化

- **WHEN** 配置 `decimals: 2` 且单元格值为数字
- **THEN** 单元格展示保留两位小数的格式化结果

### Requirement: ChangeCell 涨跌染色单元格

`createChangeCell` 生成的单元格 SHALL 在 NumberCell 格式化之上按值的正负染色：大于 0 为上涨、小于 0 为下跌、等于 0 或空值为平盘；默认 A 股配色（涨红跌绿），`colorReverse: true` 时切换为国际配色（涨绿跌红）；SHALL 支持 `arrow` 显示涨跌箭头与自定义 rise/fall/flat 颜色；染色 MUST 适配表格明暗主题。

#### Scenario: 负值显示下跌色与箭头

- **WHEN** 配置 `{ arrow: true }` 且单元格值为负数
- **THEN** 单元格以下跌色渲染并显示 ▼ 箭头

### Requirement: FilterCell 筛选单元格

`createFilterCell` 生成的表头单元格 SHALL 提供列筛选交互与状态展示；组件 SHALL expose `setFilter(status, { remote?, silent? })` 实例方法用于程序化设置筛选状态（传 null 清除所有筛选，`remote` 为 true 时不自动触发数据过滤），设置后 MUST 触发 `@filter-change` 事件（除非 `silent: true`）。

#### Scenario: 程序化设置筛选

- **WHEN** 调用 `setFilter(status)` 设置某列筛选状态
- **THEN** 表头展示筛选状态，本地数据按筛选过滤并触发 `filter-change` 事件
