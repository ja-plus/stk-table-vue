# virtual-scroll Specification

## Purpose
定义 StkTable 纵向/横向虚拟滚动的行为契约：仅渲染可视区域内的行与列以支撑数万行数据的流畅渲染，并规定容器尺寸变化时可自动或手动重算可视区。

## Requirements

### Requirement: 纵向虚拟滚动仅渲染可视区行

设置 `props.virtual` 为 `true` 时，组件 SHALL 仅渲染可视区域及必要缓冲范围内的行，滚动时随滚动位置动态替换渲染的行集合；行高 MUST 不受单元格内容影响（由 `rowHeight` 等配置决定）。

#### Scenario: 大数据量下仅渲染可视行

- **WHEN** 数据源包含数万行且启用 `virtual`，表格完成渲染
- **THEN** DOM 中的行数量仅与可视区行数相关，而非与总行数相同

### Requirement: 横向虚拟滚动仅渲染可视区列

设置 `props.virtualX` 为 `true` 时，组件 SHALL 仅渲染可视区域内的列；未设置宽度的列 MUST 使用默认宽度 100px。

#### Scenario: 未配置宽度的列按默认宽度参与横向虚拟滚动

- **WHEN** 启用 `virtualX` 且部分列未设置 `width`
- **THEN** 这些列按 100px 宽度计算位置并参与可视列范围计算

### Requirement: 容器尺寸变化时自动重算可视区

`props.autoResize` 默认为 `true`，组件 SHALL 基于 ResizeObserver（不支持时以 window resize 兜底）监听表格尺寸变化并自动重算可视区；`autoResize` 也可传入回调，在 resize 后被调用。设置为 `false` 时 MUST 关闭自动重算。

#### Scenario: 容器高度变化后自动重算

- **WHEN** `autoResize` 为默认值且表格容器高度发生变化
- **THEN** 组件自动重算纵向可视区行数，无需手动调用初始化方法

#### Scenario: 关闭自动重算

- **WHEN** `autoResize` 设置为 `false` 且容器尺寸变化
- **THEN** 组件不自动重算可视区，需用户手动调用实例方法

### Requirement: 提供手动初始化可视区的实例方法

组件 SHALL expose `initVirtualScroll(height?)`、`initVirtualScrollY(height?)`、`initVirtualScrollX()` 三个方法；`initVirtualScroll` 等价于同时调用纵向与横向初始化；`height` 参数不传时使用表格容器高度，传入更大高度可多渲染若干行。

#### Scenario: 手动拖动改变表格尺寸后重算

- **WHEN** 用户手动拖动改变表格宽高后，调用 `initVirtualScroll`
- **THEN** 可视区按新的容器尺寸重新计算并正确渲染
