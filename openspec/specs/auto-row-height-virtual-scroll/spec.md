# auto-row-height-virtual-scroll Specification

## Purpose

定义变高模式（`autoRowHeight` / 展开列）下纵向虚拟滚动的行为契约：视口行范围定位、滚动区总高度、视口下方占位高度的计算语义与复杂度约束，以及行高测量缓存的生命周期，保证大数据量下滚动流畅且滚动条几何信息准确。

## Requirements

### Requirement: 变高模式下视口行范围定位结果与逐行累加语义一致

在 `autoRowHeight` 或存在展开列时，组件 SHALL 依据各行实际高度（已测量值优先，未测量行按配置的 `expectedHeight`，再退化为默认行高）的累计和来定位给定滚动位置对应的 `startIndex` 与 `endIndex`，定位结果 MUST 与逐行累加的既有语义一致：`startIndex` 为累计高度首次达到 scrollTop 的行，`endIndex` 为自 `startIndex` 起累计高度首次达到容器高度的行。

#### Scenario: 大数据量深处滚动定位正确

- **WHEN** 表格启用 `autoRowHeight` 且数据量为数万行，滚动到接近底部的位置
- **THEN** 渲染的视口行范围与逐行累加算法得到的范围完全一致，视口内无空白或错位行

#### Scenario: 未测量行使用估算高度参与定位

- **WHEN** 部分行尚未渲染过（无实测高度）且未配置 `expectedHeight`
- **THEN** 这些行按默认行高参与累计和计算，定位行为与优化前一致

### Requirement: 变高模式下滚动定位复杂度为对数级

变高模式下，单次滚动帧内的视口行范围定位 MUST NOT 随总行数线性扫描全量数据，其复杂度 SHALL 为 O(log n)（n 为总行数），通过按行索引维护的行高前缀和与二分查找实现。

#### Scenario: 50K 行深处滚动单帧耗时

- **WHEN** 50K 行 autoRowHeight 数据滚动到 90% 深度触发一次滚动重算
- **THEN** 重算耗时应与浅处滚动同数量级，不出现随滚动深度增长而线性放大的耗时

### Requirement: 变高模式下滚动区总高度准确

启用 `autoRowHeight` 时，滚动区总高度（`scrollHeight`）SHALL 等于各行高度（实测优先、未测量按估算）之和加上表头高度，MUST NOT 使用「行数 × 默认行高」的粗略估算。

#### Scenario: 实测行高大于默认行高时总高度随之增大

- **WHEN** 若干行的实测高度大于默认行高，表格完成渲染并更新滚动参数
- **THEN** `scrollHeight` 等于各行实际/估算高度之和加表头高度，自定义滚动条滑块大小与可滚动范围与之匹配

### Requirement: 视口下方占位高度为非线性计算

变高模式下视口下方占位区域的高度 SHALL 等于视口末行之后至数据末尾所有行的高度之和，且该值 MUST 由行高累计和数据结构直接推导（复杂度不超过 O(log n)），不得从视口末端逐行累加到数据末尾。

#### Scenario: 视口变化时占位高度正确且廉价

- **WHEN** autoRowHeight 表格滚动导致 `endIndex` 变化
- **THEN** 视口下方占位行的高度等于剩余行高度之和，且该计算不随剩余行数线性增长

### Requirement: 行高测量缓存随数据变更回收

行高测量缓存 SHALL 仅保留当前数据集中存在的行记录。当数据源变更（行被移除或整体替换）后，已不存在行的行高记录 MUST 被回收，不得随数据反复替换而无限增长。

#### Scenario: 数据整体替换后旧行高不残留

- **WHEN** `dataSource` 被替换为一批全新行键的数据后再次触发滚动相关计算
- **THEN** 旧数据行键对应的行高记录不再占用内存，缓存规模与当前数据规模同数量级

#### Scenario: 手动行高管理 API 语义不变

- **WHEN** 调用方使用实例方法 `setAutoHeight` 设置/清除指定行的行高，或调用 `clearAllAutoHeight` 清空全部行高
- **THEN** 行为与既有文档描述一致：设置后立即参与后续定位与总高度计算，清除后该行回退为估算高度

### Requirement: 行高变化后前缀和即时失效

任何导致行高变化的事件——实测到新行高、`setAutoHeight` 调用、行展开/收起、数据源变更——发生后，下一次滚动定位与总高度计算 MUST 使用最新的高度值，不得使用过期缓存。

#### Scenario: setAutoHeight 后滚动定位立即生效

- **WHEN** 调用 `setAutoHeight(rowKey, newHeight)` 改变某已测量行的高度后滚动到该行附近
- **THEN** 定位与占位高度按新高度计算，滚动条总高度同步更新
