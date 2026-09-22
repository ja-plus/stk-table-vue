> **状态：已放弃，不实施（决策记录，勿 apply）**
>
> 探索实现链路后确认本特性收益不成立：
>
> 1. 唯一真正贵的每追加开销是本地全量 re-sort（O(N log N)+比较器），而 `sortRemote` 已让用户自维护有序数组、跳过内部排序，白拿到这份收益，无需新 API。
> 2. 定高/非树/无合并大表在 `sortRemote` 下每次追加仅 O(N) 轻量引用拷贝（`slice` memcpy，亚毫秒）+ 便宜的 `initVirtualScrollY`/早退的 `updateMaxRowSpan`，无有意义的增量空间。
> 3. 原设计的"同引用 `push`+`triggerRef`"会踩两个坑：`mergeCellsCache` 仍被 `watch([dataSourceCopy])` 清空；行高 Fenwick 缓存以数组引用相等为重建判据，同引用导致返回不含新行的旧树，`autoRowHeight`/展开行总高算错。
>
> 结论：现有"整体替换 `dataSource`"+ `sortRemote` 已覆盖目标场景，不再新增 `appendDataSource`。以下为原始提案，保留备查。

## Why

当前向表格新增数据只有一条路径：用户整体替换 `props.dataSource` → `updateDataSource()` 对**全量**数据重走一遍链路（`slice()` O(N)、本地排序 O(N log N)、树扁平化、筛选、`mergeCellsCache` 全清、`updateMaxRowSpan()` O(N×合并列)、`initVirtualScrollY()` O(N)）。对"数万行实时数据"这一核心场景（每秒多次追加、数据持续增长），单次追加付 O(N)、累积退化为 O(N²)，深滚到大行数时每次追加掉数帧。vxe-table 通过 `loadData`/`insert` 增量入口规避此问题。

## What Changes

- 新增公共实例方法 `appendDataSource(rows, options?)`（`defineExpose`）：语义化地向表格**尾部追加**数据，携带"这是追加、请走增量"的意图，使组件敢于跳过全量重算。
- 新增**增量快速路径**：在满足「无本地排序（或数据单调有序）& 非树形 & 无跨行动态合并 & 追加到尾部」时，仅对新行做处理（保持 `dataSourceCopy` 同一数组引用 `push` + `triggerRef`，不清空合并/行键缓存，行高树/虚拟滚动总高度增量扩展），单次追加成本从 O(N) 降到 O(新增行数)。
- 新增**自动回退**：不满足快速路径条件（有本地排序且非单调、树形、跨行动态合并、筛选生效等）时，内部回退到既有 `updateDataSource()` 全量链路，保证零功能回归。
- `options` 至少含：`{ sorted?: boolean }`（声明新数据是否已按当前排序有序，允许跳过 re-sort）、`{ silent?: boolean }`（是否抑制数据变更相关回调）。
- 文档同步范围（公共 API 新增）：`docs-src/main/api/expose.md` 登记方法、新增/更新使用示例页、`docs-src/en|ja|ko` 镜像、`CHANGELOG.md`、`llms.txt`（并跑 `pnpm ai:check`）。

## Capabilities

### New Capabilities
- `data-append`: 定义 `appendDataSource` 的对外语义、增量快速路径的适用/回退判定、追加后各类缓存与虚拟滚动状态的一致性契约，以及流式追加的性能防回退验收。

### Modified Capabilities
<!-- 无既有 capability 的 REQUIREMENT 文本变化；性能验收作为 data-append 内的场景约束，不单独改 performance 规格。 -->

## Impact

- 代码：`src/StkTable/StkTable.vue`（新增 expose + 快速路径，复用 `updateDataSource`/`initDataSource`/`onDataSourceChange`）、`src/StkTable/types/index.ts`（方法签名与 options 类型）、可能新增 `useAppendDataSource.ts` 拆分逻辑。
- 受影响内部状态：`dataSourceCopy`（shallowRef，需 `triggerRef` 而非换引用）、`mergeCellsCache`、`rowKeyGenCache`、`useMaxRowSpan`、`useVirtualScroll`（总高度/行高 Fenwick）、`useScrollRowByRow`、区域选取与当前行选中态。
- 兼容：Vue 3 与 Vue 2.7 双版本（`triggerRef` 可用性需确认，2.7 需等价方案）。
- 性能验收：`test/perf` 新增流式追加对照场景；`test/` 新增单测覆盖快速路径与回退分支。
- 文档/AI 资产：expose.md、示例页、多语言镜像、CHANGELOG.md、llms.txt。
