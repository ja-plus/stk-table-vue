# virtual-scroll Specification

## Purpose
定义 StkTable 纵向/横向虚拟滚动的行为契约：仅渲染可视区域内的行与列以支撑数万行数据的流畅渲染，并规定容器尺寸变化时可自动或手动重算可视区，以及行高类配置动态变化时视觉高度与滚动几何的一致性与重算的触发条件。

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

### Requirement: 行高类配置动态变化时视觉与几何同步重算

`props.rowHeight`、`props.headerRowHeight`、`props.footerRowHeight`、`props.expandConfig.height` 在组件挂载后发生变化时，组件 SHALL 使新的行高同时生效于**实际渲染高度**与**虚拟滚动几何计算**（可视区窗口 `startIndex`/`endIndex`、`pageSize`、总高 `scrollHeight`、占位/偏移高度），MUST NOT 出现「样式已更新而滚动计算仍用旧行高」或反之的半更新状态。

固定行高模式下，表体行高由容器内联 CSS 变量 `--row-height` 决定（`tbody tr` / `tbody td` 高度、视口上下占位行的高度、无数据提示行行高均消费该变量），该变量 MUST 随 `props.rowHeight` 响应式更新；`props.autoRowHeight` 为真时容器 MUST NOT 输出 `--row-height`（行高由单元格内容与实测高度决定）。

#### Scenario: 动态修改 row-height 后 CSS 变量同步

- **WHEN** 表格以 `rowHeight: 28` 渲染后，将 `rowHeight` 改为 `40`
- **THEN** 容器内联样式的 `--row-height` MUST 变为 `40px`，表体行实际高度随之变为 40px

#### Scenario: 动态修改 row-height 后滚动几何一致

- **WHEN** 虚拟滚动表格的 `rowHeight` 从 28 改为 40 且数据行数超过可视区容量
- **THEN** 可视区行数按新行高重算，滚动条总高、上下占位高度与实际渲染行高三者一致，滚动到任意位置不出现空白带或行错位

#### Scenario: 依赖行高的派生高度同步

- **WHEN** `rowHeight` 动态变化且启用 `scrollRowByRow` 或区域选取
- **THEN** 按行滚动的总高计算与区域选取键盘滚动的目标行定位 MUST 使用新行高，不得使用挂载时的旧值

#### Scenario: 动态修改 header-row-height 后重算可视区

- **WHEN** 多级或单级表头表格的 `headerRowHeight` 在挂载后被修改
- **THEN** 表头实际行高与 `pageSize`（表头占用的表体行数）同时更新，表头不再遮挡首行且首行不被裁切，无需用户手动调用 `initVirtualScroll`

#### Scenario: 动态修改展开行高后重算行高累计

- **WHEN** 存在展开行列且 `expandConfig.height` 在挂载后被修改
- **THEN** 展开行实际高度与行高累计（总高、`offsetTop`）按新值重算，展开/收起后不残留旧行高造成的偏移误差

#### Scenario: 变高模式不输出统一行高变量

- **WHEN** `autoRowHeight` 为真且 `rowHeight` 被动态修改
- **THEN** 容器 MUST NOT 输出 `--row-height`，`rowHeight` 仅作为期望行高参与计算，已实测的行高不被其覆盖

### Requirement: 行高重算仅在值真正变化时发生

行高类配置的重算入口 MUST NOT 因「配置值未变但对象引用变了」而触发。尤其 `expandConfig` 常以模板内联对象字面量传入（如 `:expand-config="{ height: 40 }"`），父组件每次重渲染都会生成新对象，此时行高类监听 MUST 保持静默，MUST NOT 发起可视区重算。固定行高模式下每帧滚动的重算 MUST NOT 因行高同步能力而新增开销。

#### Scenario: 父组件重渲染不引发行高重算

- **WHEN** 存在展开行列、以 `:expand-config="{ height: 40 }"` 内联写法传入配置，父组件因无关响应式状态重渲染（`height` 值不变）
- **THEN** 虚拟滚动几何 MUST NOT 重算，行高累计缓存 MUST NOT 重建（避免 50K 行量级下每次父重渲染多出约 10ms 的空跑开销）

#### Scenario: 真值变化时正常触发重算

- **WHEN** `expandConfig.height` 从 40 改为 80
- **THEN** 重算正常发生，展开行高度与行高累计按新值生效

#### Scenario: 滚动热路径开销不变

- **WHEN** 50K 行固定行高表格连续滚动
- **THEN** 每帧滚动重算的开销量级与引入行高同步之前一致，行高仅在可视区初始化时写入，值未变时不触发重渲染
