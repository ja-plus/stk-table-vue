# scroll-navigation Specification

## Purpose
定义表格程序化滚动定位 API（实例方法 `scrollTo`）的行为契约：在保留数字坐标重载的基础上，新增 options 重载，使两个滚动轴（top/left）均可按像素坐标、行/列索引、行 key/列 dataIndex 定位目标，并支持原生语义的滚动行为（behavior）。

## Requirements

### Requirement: 数字重载保持向后兼容

组件 SHALL 保留 `scrollTo(top?: number | null, left?: number | null)` 数字重载，其签名与语义 MUST 与既有行为完全一致：`null` 表示不改变该轴，省略的参数默认 `0`。

#### Scenario: 数字参数设置双轴坐标

- **WHEN** 调用 `scrollTo(120, 240)`
- **THEN** 表格纵向滚动位置变为 120，横向滚动位置变为 240

#### Scenario: null 不改变对应轴

- **WHEN** 表格已滚动到某个位置后调用 `scrollTo(null, 90)`
- **THEN** 纵向滚动位置保持不变，横向滚动位置变为 90

#### Scenario: 省略参数默认为 0

- **WHEN** 调用 `scrollTo()`
- **THEN** 纵向与横向滚动位置均变为 0

### Requirement: options 重载按坐标滚动

组件 SHALL 支持 `scrollTo(options)` 重载，其中 `options.top` 与 `options.left` 可直接传数字，语义等价于数字重载对应轴的像素坐标。

#### Scenario: options 数字坐标

- **WHEN** 调用 `scrollTo({ top: 120, left: 240 })`
- **THEN** 表格纵向滚动位置变为 120，横向滚动位置变为 240

#### Scenario: options 中省略的轴不改变

- **WHEN** 表格已滚动到某个位置后调用 `scrollTo({ left: 80 })`
- **THEN** 横向滚动位置变为 80，纵向滚动位置保持不变

#### Scenario: 空 options 不产生任何滚动

- **WHEN** 表格已滚动到某个位置后调用 `scrollTo({})`
- **THEN** 纵向与横向滚动位置均保持不变

### Requirement: top 轴按行索引或行 key 定位

`options.top` SHALL 支持对象形式 `{ index?, key?, px? }`：`index` 为当前展示顺序（排序、筛选、树展开后）中 0 起始的行索引，`key` 按 `props.rowKey` 定位行；解析结果为该行顶部相对表格主体顶部的绝对像素偏移。

#### Scenario: 按行索引定位

- **WHEN** 行高固定且调用 `scrollTo({ top: { index: 5 } })`
- **THEN** 表格纵向滚动位置等于第 5 行（0 起始）顶部到表格主体顶部的距离

#### Scenario: 按行 key 定位

- **WHEN** 数据中存在 rowKey 值为 `k9` 的行且调用 `scrollTo({ top: { key: 'k9' } })`
- **THEN** 表格纵向滚动到该行顶部位置

#### Scenario: 变高模式按已知行高解析

- **WHEN** 处于变高行模式且目标行的行高已被测量或通过 `setAutoHeight` 提供，按 `index` 定位该行
- **THEN** 解析的纵向偏移等于其之前所有行的高度之和（未测量行按期望行高或默认行高估算）

### Requirement: left 轴按列索引或列 dataIndex 定位

`options.left` SHALL 支持与 `top` 同构的对象形式 `{ index?, key?, px? }`：`index` 为叶子列（最深层表头列）的 0 起始索引，`key` 按列的 `dataIndex` 定位列；解析结果为该列左边缘相对表格左边缘的绝对像素偏移。

#### Scenario: 按列索引定位

- **WHEN** 调用 `scrollTo({ left: { index: 3 } })`
- **THEN** 表格横向滚动位置等于第 3 个叶子列（0 起始）左边缘到表格左边缘的距离（即其之前所有列宽之和）

#### Scenario: 按列 dataIndex 定位

- **WHEN** 存在 `dataIndex` 为 `price` 的列且调用 `scrollTo({ left: { key: 'price' } })`
- **THEN** 表格横向滚动到该列左边缘位置

#### Scenario: 两轴同时定位

- **WHEN** 调用 `scrollTo({ top: { index: 5 }, left: { index: 3 } })`
- **THEN** 纵向滚动到第 5 行顶部，横向滚动到第 3 列左边缘

### Requirement: px 为解析后的附加偏移

轴对象中的 `px` SHALL 在索引/键解析出的基准偏移之上叠加，允许为负值；仅传 `{ px }` 时基准为 0，等价于直接传该数字坐标。

#### Scenario: index 与 px 叠加

- **WHEN** 调用 `scrollTo({ top: { index: 5, px: 10 } })`
- **THEN** 纵向滚动位置等于第 5 行顶部偏移再加 10

#### Scenario: 仅 px 等价于数字坐标

- **WHEN** 调用 `scrollTo({ top: { px: 100 } })`
- **THEN** 纵向滚动位置变为 100，横向不变

### Requirement: 无效目标的轴静默跳过

当轴对象无法解析出目标（行索引越界、行 key 不存在、列索引越界、列 dataIndex 不存在）时，该轴 MUST 保持当前位置不变，且不影响另一轴与 `behavior` 之外的参数解析；对象中 `index` 与 `key` 同时给出时 `index` 优先。

#### Scenario: 行 key 不存在

- **WHEN** 调用 `scrollTo({ top: { key: 'missing' }, left: 80 })`
- **THEN** 纵向位置不变，横向位置变为 80

#### Scenario: 列索引越界

- **WHEN** 调用 `scrollTo({ left: { index: 9999 } })`
- **THEN** 横向位置不变

#### Scenario: index 与 key 同时给出

- **WHEN** 调用 `scrollTo({ top: { index: 5, key: 'k9' } })` 且二者指向不同的行
- **THEN** 表格按 `index: 5` 定位，忽略 `key`

### Requirement: 解析坐标受滚动边界钳制

解析后的坐标 MUST 钳制在合法范围内：纵向不小于 0 且不超过最大可滚动高度，横向不小于 0 且不超过最大可滚动宽度。

#### Scenario: 超出下界钳制为 0

- **WHEN** 调用 `scrollTo({ top: { px: -100 }, left: { px: -50 } })`
- **THEN** 纵向与横向滚动位置均为 0

#### Scenario: 超出上界钳制为最大值

- **WHEN** 调用 `scrollTo({ top: { index: <超出最大可滚动范围的行号> } })`
- **THEN** 纵向滚动位置为最大可滚动高度，不发生溢出

### Requirement: behavior 与原生滚动行为一致

`options.behavior` SHALL 接受 `'auto' | 'instant' | 'smooth'`（同原生 `ScrollToOptions.behavior`），默认 `'auto'`（立即跳转）；`'smooth'` 时两轴均平滑过渡到目标位置，且在 experimental scrollY（transform 模拟纵向滚动）模式下同样生效。

#### Scenario: 默认立即跳转

- **WHEN** 调用 `scrollTo({ top: { index: 5 } })`（未传 behavior）
- **THEN** 滚动位置立即变为目标值，无动画

#### Scenario: smooth 平滑滚动

- **WHEN** 调用 `scrollTo({ top: { index: 5 }, left: { index: 3 }, behavior: 'smooth' })`
- **THEN** 纵向与横向滚动以动画方式过渡到目标位置，最终停在目标值
