# 任务清单：变高模式纵向虚拟滚动性能优化

设计见 design.md（D1-D7），行为契约见 specs/auto-row-height-virtual-scroll/spec.md。

## 1. 行高累计和数据结构（D1/D2）

- [x] 1.1 在 `src/StkTable/useVirtualScroll.ts` 新增行高 Fenwick 树实现（Float64Array：单点增量更新、前缀和查询、累计和下界查找 findFirstPrefixGE、total 维护），纯 TS，无新 Vue API
- [x] 1.2 新增行高索引缓存（仿 `useColWidthCache`）：以 `dataSourceCopy.value` 数组引用为缓存键，懒重建 `{ tree, keyIndex: Map<rowKey, index>, total }`；建树时各行高度取 `getRowHeightFn(row)` 当前值
- [x] 1.3 缓存重建时修剪 `autoRowHeightMap`：删除不在新数据 rowKey 集合中的条目（D6）；移除对应 FIXME 注释

## 2. 滚动定位改造（D3）

- [x] 2.1 `updateVirtualScrollY` 变高分支：startIndex 定位改为树上二分（累计和含本行 ≥ sTop 的首个行），offsetTop 取前缀和；替换 L672-L680 的线性循环
- [x] 2.2 endIndex 定位改为树上二分（自 startIndex 后累计高度首次 ≥ containerHeight）；替换线性循环；保留 `stripe` 偶数对齐、`maxRowSpan` 跨界修正、`viewportStart/EndIndex`、`optimizeVue2Scroll` 延时回收等下游逻辑不动
- [x] 2.3 滚动帧内新测量的行高（trRef 批量测量分支）写入 `autoRowHeightMap` 后，经 keyIndex 做树的单点增量更新

## 3. 总高度与占位高度（D4/D5）

- [x] 3.1 `updateVirtualScrollY` 中变高模式 `scrollHeight` 改取 `total + tableHeaderHeight`；`initVirtualScrollY` 的 `maxScrollTop` 钳制同步改用真实总高
- [x] 3.2 `virtual_offsetBottom` autoRowHeight 分支改为 `total − query(endIndex)`，删除尾部累加循环

## 4. API 兼容

- [x] 4.1 `setAutoHeight` / `clearAllAutoHeight` 接入树的单点更新/回退估算值；行键不在当前数据中时仅更新 Map（语义与现状一致）
- [x] 4.2 核对行展开/收起、树展开、排序、过滤路径均经 `dataSourceCopy` 引用替换触发懒重建（无需新增 watch）

## 5. 测试

- [x] 5.1 新增差分单测（happy-dom）：随机变高数据集（含小数行高、expectedHeight 函数、未测量行）上，新定位与旧逐行累加参考实现的 startIndex/endIndex/offsetTop 逐位一致
- [x] 5.2 新增行为单测：scrollHeight 等于实测+估算高度和；数据替换后旧行键行高被回收；setAutoHeight 后定位与总高立即生效
- [x] 5.3 全量运行既有单测（含 `trReuse.repro.test.js`、mergeCells/virtualX 相关回归用例），确保无回归

## 6. 性能基准（D7）

- [x] 6.1 扩展 `test/perf/scrollPerf.test.js`：新增 autoRowHeight 场景（10K/50K 变高行：mount、DOM 节点数、浅滚与 90% 深滚重算耗时）
- [x] 6.2 运行 `test/perf/run-perf-benchmark.mjs`，结果落盘 `test/perf/results/<分支名>.json`，并在 `test/perf/results/REPORT.md` 追加对比列

## 7. 文档同步（Code-Docs Sync）

- [x] 7.1 用关键词（autoRowHeight、scrollHeight、setAutoHeight、clearAllAutoHeight）检索 `docs-src/`，更新中文主文档：props 说明页相关 `::: tip` 行为描述、`docs-src/main/api/expose.md` 中涉及时机语义的说明
- [x] 7.2 `CHANGELOG.md` 记录：滚动定位性能优化与 scrollHeight 精确化的行为修正；如可一并翻译，同步 `docs-src/en|ja|ko` 镜像页面
