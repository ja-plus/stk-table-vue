# 设计：变高模式纵向虚拟滚动性能优化

## Context

动机与范围见 proposal.md（Why / What Changes），行为契约见 `specs/auto-row-height-virtual-scroll/spec.md`。

现状关键约束（`src/StkTable/useVirtualScroll.ts`）：

- 定高模式定位已是 O(1)（`Math.floor(sTop / rowHeight)`），无需改动；问题集中在 `autoRowHeight || hasExpandCol` 分支：`updateVirtualScrollY` 每次从第 0 行线性累加定位 startIndex，再线性累加定位 endIndex（约 L672-L689）。
- 行高来源链：`autoRowHeightMap`（实测，string rowKey → number）→ `props.autoRowHeight.expectedHeight`（常量或函数）→ 默认行高，由 `getRowHeightFn` 组合；展开行高度来自 `expandConfig.height`（`getRowHeightFn` 中经 `__EXP_R__` 判断）。
- `dataSourceCopy` 是 shallowRef，**所有**数据变化路径（排序、过滤、树展开、行展开、外部 dataSource 变更）都会整体替换数组引用——这是缓存失效判定的可靠锚点。
- 横向虚拟滚动已有同构先例：`useColWidthCache`（累计宽度数组 + `binarySearch`），本设计在纵向上对齐该模式。
- 项目需同时兼容 Vue 3 与 Vue 2.7，新逻辑应为纯 TS 数据结构，不引入新的 Vue API。

## Goals / Non-Goals

**Goals:**

- 变高模式滚动定位从 O(n)/帧降到 O(log n)/帧，且定位结果与既有逐行累加语义逐位一致。
- `scrollHeight` 在变高模式下取真实累计高度；`virtual_offsetBottom` 消除尾部线性累加。
- `autoRowHeightMap` 不再随数据替换无限残留。
- 全部改动可回退（revert 单个提交即可），无公共 API 变更。

**Non-Goals:**

- 不改定高模式路径（已是 O(1)）。
- 不改横向虚拟滚动、mergeCells/maxRowSpan 修正、stripe 修正的既有逻辑（它们消费定位结果，输入语义不变）。
- 不引入 ResizeObserver 逐行监听等新的行高测量机制（测量时机维持现状：滚动帧内批量读取 `trRef` 的 offsetHeight）。
- 不调整 `optimizeVue2Scroll` 的延时回收策略。

## Decisions

### D1：数据结构选 Fenwick 树（树状数组），而非普通前缀和数组

- **选择**：`Float64Array` 实现的 Fenwick 树，规模 = 当前数据行数；支持 O(log n) 前缀和查询与 O(log n) 单点增量更新，另维护 O(1) 的 `totalHeight` 累加量。
- **理由**：实测行高是在滚动过程中**增量到达**的（每帧为新进入视口的行补测高度）。若用普通前缀和数组，任何一次补测都要 O(n) 重建，首次遍历全表期间每帧仍是 O(n)——优化被抵消。Fenwick 树对「单点更新 + 前缀查询」两个操作都是 O(log n)，无重建窗口。
- **备选**：(a) 前缀和数组 + 脏标记延迟重建——首次深滚动路径仍 O(n)/帧，放弃；(b) 分段块状前缀和（sqrt decomposition）——复杂度收益不及 Fenwick 且代码更多，放弃。

### D2：失效与重建策略——以 `dataSourceCopy` 数组引用为缓存键（懒重建）

- **选择**：仿照 `useColWidthCache`：缓存对象持有 `{ data: PrivateRowDT[] | null, tree, keyIndex: Map<UniqKey, number>, total }`；获取时若 `cache.data !== dataSourceCopy.value` 则整体重建（O(n) 顺序建树 + 建 rowKey→index 映射）。重建时机是懒求值（定位/总高查询入口），不挂 watch。
- **理由**：所有数据变化路径都替换数组引用（见 Context），引用比较即可覆盖排序、过滤、树/行展开、外部替换；避免在多个 watch 里手动失效的遗漏风险。数据变化是低频事件，O(n) 一次性重建可接受。
- **增量更新**：滚动帧内新测量到的行高、`setAutoHeight`/`clearAllAutoHeight` 调用，经 `keyIndex` 找到索引后做 O(log n) 单点更新（增量 = 新高度 − 建树时该行使用的估算高度）。

### D3：定位语义逐位保留

- **选择**：新定位必须与原循环输出完全一致：`startIndex` = 满足「累计高度（含本行）≥ sTop」的首个行；`offsetTop` = 前 startIndex 行高度和；`endIndex` = 自 startIndex 之后累计高度首次 ≥ containerHeight 的行。实现为 Fenwick 树的标准「累计和下界查找」（树上二分，O(log n)）。
- **理由**：`maxRowSpan` 跨界修正、stripe 偶数对齐、`viewportStartIndex/EndIndex`、vue2 延时回收都建立在现有索引语义上，语义漂移会引入难查的回归。
- **边界**：`getRowHeightFn` 保证行高恒正（最终兜底默认行高），树上二分依赖前缀和严格递增，恒正假设成立；sTop=0、数据为空、容器高度为 0 等退化情况沿用现有分支（`virtual_on` 判断在前）。
- **验证**：编写差分测试——随机变高数据集上，新实现与旧算法（保留为测试内参考实现）的 startIndex/endIndex/offsetTop 逐位比对。

### D4：scrollHeight 精确化

- **选择**：`updateVirtualScrollY` 中 `scrollHeight` 在变高模式下取 `tree.total + tableHeaderHeight`；`initVirtualScrollY` 的 `maxScrollTop` 钳制同步改用该总高。定高模式维持 `行数 × rowHeight`。
- **理由**：见 proposal（滚动条几何失真）。未测量行已按 expectedHeight/默认行高计入树，随实测到达逐步修正，滚动条自然收敛到真实值。
- **影响面**：`useScrollbar` 消费 scrollHeight，无需改动；属行为修正，CHANGELOG 需记录。

### D5：offsetBottom 消除尾部累加

- **选择**：`virtual_offsetBottom`（autoRowHeight 分支）改为 `total − query(endIndex)`（query 为含 endIndex 的前缀和），复杂度 O(log n)，替代现有从 endIndex+1 到末尾的累加循环。
- **说明**：spec 中「O(1) 推导」指不再与剩余行数线性相关；严格复杂度为 O(log n)，满足「不随剩余行数线性增长」的验收场景。

### D6：行高缓存回收（解决 FIXME）

- **选择**：缓存重建时顺带修剪 `autoRowHeightMap`：遍历 Map 键，删除不在新数据 `keyIndex` 中的条目（O(m)，m 为缓存行数，仅在数据变化时发生）。
- **理由**：WeakMap 不可行——公共 API `setAutoHeight(rowKey, height)` 以 rowKey（string）为键，WeakMap 要求对象键且无法按 rowKey 查找。修剪方案保留 API 语义，成本只出现在低频的数据变更点。

### D7：基准与回归验证策略

- **功能回归**：差分测试（D3）+ 现有全部单测（重点 `docs-demo/advanced/auto-height-virtual` 相关用例、`trReuse.repro.test.js`）。
- **性能基准**：扩展 `test/perf/scrollPerf.test.js`，新增 autoRowHeight 场景（如 10K/50K 变高行：mount、DOM 节点数、浅滚/90% 深滚重算耗时）；通过 `test/perf/run-perf-benchmark.mjs` 运行并落盘 `results/<当前分支名>.json`，在 `REPORT.md` 追加对比列。

## Risks / Trade-offs

- [rowKey→index 映射与数据不同步（如某条数据变更路径原地 mutate 而非替换引用）] → 已核对 `initDataSource` 为唯一写入口且总是 `dataSourceCopy.value = 新数组`；差分测试 + 既有功能测试兜底，若发现新写入口统一走引用替换。
- [浮点行高的比较边界（>=）与原实现的舍入差异] → 树上二分的比较谓词严格按「累计和 ≥ 目标」实现，差分测试用小数高度（如 27.5、30.25）覆盖。
- [深滚动首次遍历期间每帧仍有 pageSize 次 DOM 测量] → 测量本身是既有成本且已批量读取，本变更不恶化；不在本次范围内优化。
- [内存峰值：Float64Array(n) + keyIndex Map(n)] → 50K 行约 1MB 量级，可接受；数据替换时旧缓存整体被 GC。
- [行为修正（scrollHeight 变准）可能改变依赖旧估算值的调用方表现] → 属正确性修复，CHANGELOG 标注；滚动条交互只会更准。
- [Vue 2.7 兼容] → 纯 TS 数据结构改动，无新 Vue API；双版本单测套件验证。

## Migration Plan

- 纯库内改动，无 API 破坏，随下一个版本正常发布；CHANGELOG 记录 scrollHeight 行为修正。
- 回退策略：单个提交 revert 即可恢复旧线性扫描实现（旧代码路径以参考实现形式保留在差分测试中，不作为运行时代码保留）。
