# area-selection Specification

## Purpose
定义区域选取功能的行为契约：通过 feature 注册机制按需启用单元格拖拽选区，支持键盘选择、复制选区到剪贴板，并提供选区查询与设置的实例方法。

## Requirements

### Requirement: 区域选取需注册后启用

区域选取功能 SHALL NOT 默认包含在组件中；使用方 MUST 先调用 `registerFeature(useAreaSelection)` 注册该 feature，再通过 `props.areaSelection` 启用。

#### Scenario: 未注册时启用无效

- **WHEN** 未调用 `registerFeature(useAreaSelection)` 而设置 `area-selection` 属性
- **THEN** 区域选取功能不生效

### Requirement: 拖拽与键盘选区交互

启用后，组件 SHALL 支持鼠标拖拽选择单元格区域、方向键 / Shift / Tab 键盘选择、Shift 扩展选区与 Ctrl 多选区域（可配置），Esc MUST 取消当前选区。

#### Scenario: 拖拽选择区域

- **WHEN** 用户在表格上按住鼠标拖拽多个单元格
- **THEN** 拖拽范围形成选区并触发选区变更事件

#### Scenario: Esc 取消选区

- **WHEN** 存在选区时用户按下 Esc
- **THEN** 选区被清除

### Requirement: 复制选区到剪贴板

组件 SHALL 支持 Ctrl/Cmd + C 将选区内容复制到剪贴板，并 expose `copySelectedArea()` 返回复制的文本内容（TSV 格式）。

#### Scenario: 快捷键复制选区

- **WHEN** 存在选区时按下 Ctrl/Cmd + C
- **THEN** 选区内容以 TSV 格式写入剪贴板

### Requirement: 选区查询与设置的实例方法

组件 SHALL expose `getSelectedArea()`（返回 `{ rows, cols, ranges }`）、`setAreaSelection(ranges, { silent?, scrollToView? })`（silent 为 true 时 MUST NOT 触发 `@area-selection-change`，scrollToView 为 true 时自动滚动到选区）与 `clearSelectedArea()`。

#### Scenario: 程序化设置选区并滚动到可视

- **WHEN** 调用 `setAreaSelection(ranges, { scrollToView: true })`
- **THEN** 选区被设置且表格自动滚动使选区可见，并触发选区变更事件
