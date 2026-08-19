# 虚拟滚动性能优化（autoRowHeight 路径）

## Why

项目已完成大量性能优化（mergeCellsCache、横向列宽缓存 + 二分查找、raf 节流、keyed diff、占位行合并），但 **`autoRowHeight` / 展开列模式下的纵向虚拟滚动仍是 O(n) 线性扫描**：每次滚动帧都从第 0 行累加行高来定位 `startIndex`（[useVirtualScroll.ts L672-L689](../../../src/StkTable/useVirtualScroll.ts)），数万行数据滚动到深处时每帧全量扫描，是基准测试覆盖不到但真实场景最痛的热点。同时该路径还有 3 个关联问题：`virtual_offsetBottom` 每次视口变化 O(n) 累加、`scrollHeight` 用「行数 × 默认行高」估算导致滚动条总高度失真、`autoRowHeightMap` 普通 Map 随数据替换无限残留（源码已有 FIXME 注释）。

## What Changes

- **新增行高前缀和缓存**：在 `useVirtualScroll` 中维护按行索引的行高累计和数组（依赖 `dataSourceCopy`、`autoRowHeightMap`、展开状态），`updateVirtualScrollY` 的定位计算从 O(n) 线性扫描降为 O(log n) 二分查找（复用现有 `binarySearch` 工具，与横向 `useColWidthCache` 模式对齐）。
- **`virtual_offsetBottom` 消除尾部线性累加**：autoRowHeight 模式下用「总高 − 视口末端累计高」替代尾部 O(n) 累加，复杂度降至 O(log n)。
- **`scrollHeight` 精确化**：autoRowHeight 模式下总高度取前缀和实际值（未测量行按 `expectedHeight`/默认行高估算），替代 `行数 × 默认行高` 的估算——这是可观察的行为修正（滚动条总高度/位置更准）。
- **行高缓存生命周期治理**：`dataSourceCopy` 变化时回收不在当前数据中的行高记录，消除 `autoRowHeightMap` 内存残留；公共 API `setAutoHeight`/`clearAllAutoHeight` 语义保持不变。
- **性能基准回归**：为 autoRowHeight 场景新增/扩展 `test/perf` 基准用例，运行后把结果写入 `test/perf/results/` 并在 `REPORT.md` 追加对比列。

## Capabilities

### New Capabilities

- `auto-row-height-virtual-scroll`: 变高（autoRowHeight/展开列）模式下纵向虚拟滚动的行为要求——视口索引定位、上下占位高度、滚动区总高度的计算语义与复杂度约束，以及行高测量缓存的生命周期。

### Modified Capabilities

<!-- openspec/specs/ 下暂无已登记的主规格，无既有 capability 需要修改 -->

## Impact

- **代码**：`src/StkTable/useVirtualScroll.ts`（核心改动）、`src/StkTable/StkTable.vue`（数据变化时触发缓存失效的接线）。
- **公共 API**：无新增/删除；`setAutoHeight`、`clearAllAutoHeight`、`initVirtualScrollY` 签名不变。`scrollHeight` 在 autoRowHeight 下数值更准确，属行为修正。
- **测试**：`test/perf/scrollPerf.test.js` 扩展 autoRowHeight 场景；既有 `auto-height-virtual` 相关用例需全部通过。
- **文档**（Code-Docs Sync 规则）：`docs-src/main/api/expose.md`（若行为描述涉及时机语义）、autoRowHeight 相关 props 说明页及 `::: tip`、CHANGELOG.md；多语言镜像至少更新中文主文档。
