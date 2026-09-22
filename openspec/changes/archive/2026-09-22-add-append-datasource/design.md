## Context

动机见 `proposal.md - Why`，对外行为契约见 `specs/data-append/spec.md`。此处只记录影响实现方案现状与约束：

- 现有一条数据变更链路：`watch(() => props.dataSource)` → [updateDataSource()](file:///d:/mycode/stk-table-vue/src/StkTable/StkTable.vue#L1345) → [initDataSource()](file:///d:/mycode/stk-table-vue/src/StkTable/StkTable.vue#L1285)（`slice` + `sortData` + 树扁平化 + 筛选，末尾给 `dataSourceCopy.value` 赋**新数组引用**）+ `updateMaxRowSpan()` + 长度变化时 `initVirtualScrollY()`。
- `dataSourceCopy` 是 `shallowRef`；换引用会触发 `useMergeCells` 的清空 watch（`mergeCellsCache.clear()`）与全量重渲染。既有经验：`useMaxRowSpan` 无法复用 `mergeCellsCache`（清空时序 + O(N×M) 内存膨胀风险）。
- 已导出 `binarySearch` / `insertToOrderedArray` 供有序插入，但对"尾部追加"非必需。
- 需同时支持 Vue 3 与 Vue 2.7，二者响应式细节不同。

## Goals / Non-Goals

**Goals:**
- 提供 `appendDataSource`，在"无排序/声明有序 + 非树 + 无跨行合并 + 尾部追加"时把单次追加从 O(N) 降到 O(新增行数)。
- 不满足条件时无条件回退到既有全量链路，保证零功能回归。
- 追加不跳视口、不清既有选中、行键/合并结果对既有行保持稳定。

**Non-Goals:**
- v1 不做"树形/跨行动态合并"下的增量（直接回退）。
- v1 不做乱序数据的有序增量插入（回退到 re-sort）。
- 不改变 `props.dataSource` 整体替换语义，`appendDataSource` 是新增并列入口。
- 不引入任何第三方依赖。

## Decisions

### D1：以 `defineExpose` 方法而非 prop 开关承载"追加"意图
组件必须区分"尾部追加"与"整体替换"才能走增量。若用 prop 标志位，会与 `props.dataSource` 的 watch 产生时序竞争（标志位与数组引用谁先到不确定）。因此暴露显式方法 `appendDataSource(rows, options)`，在方法内直接驱动增量流程，不依赖 `props.dataSource` watch。
- 备选：`dataSource` 保持引用不变、内部监听 push —— 需要 `deep`/手写 trigger，成本高且易误判，弃用。

### D2：增量路径保持 `dataSourceCopy` 同一数组引用 + `triggerRef`
换引用会清空合并/行键缓存并全量重渲染，抵消增量收益。因此增量时对**同一数组** `push` 新行，再 `triggerRef(dataSourceCopy)` 仅驱动依赖它的窗口渲染，不清 `mergeCellsCache` / `rowKeyGenCache`。渲染本就只画可视窗口，故只有新入窗行触发 `mergeCells` 回调。
- Vue 2.7 兼容：`triggerRef` 在 2.7 可用；实现前先写最小验证用例确认 2.7 下窗口能正确刷新（见 Open Questions / 任务）。若不可用则退化为"仅对窗口相关的最小重渲染"方案。
- 备选：赋新引用 + 局部不清缓存 —— 赋新引用即触发清空 watch，需额外绕开，复杂且脆弱，弃用。

### D3：快速路径判定用集中式布尔门，命中即增量、否则委托 `updateDataSource`
在新增 `useAppendDataSource.ts` 中计算 `canFastAppend`：无本地排序 **或** `options.sorted===true`；非树形（`isTreeData` 为假）；无跨行合并（存在 `rowspan` 型 `mergeCells` 即判否，纯 `colspan` 每行独立不影响）；筛选不生效或已对新行单独过滤。任一为假 → 直接调用既有 `updateDataSource(props.dataSource 合成后的全量)` 回退。
- 好处：把"难保证正确性"的合并/树/乱序全部挡在回退侧，增量路径只处理可安全尾加的情形。
- 备选：为合并/树也做增量 —— 正确性风险与工时过高，v1 弃用。

### D4：虚拟滚动/行高增量扩展
- 固定/统一行高：总高度按 `新增行数 × rowHeight` O(1) 扩展，仅更新滚动条与边界，不 `initVirtualScrollY()` 全量。
- 自适应行高：优先对新行做增量入结构；若现有行高实现不支持增量入，则 v1 在此情形**回退** `initVirtualScrollY()`（O(N) 但仍省掉 re-sort/缓存清空），并在文档标注限制。实现前用基准确认该回退是否值得保留（见性能验收）。

### D5：`options` 采用最小可用集
`{ sorted?: boolean; silent?: boolean }`。`sorted` 声明"新数据已按当前排序有序且不小于末值"，允许跳过 re-sort；组件**信任**该声明（不做全量校验，仅在 debug 模式可选抽查），校验放文档警告中。`silent` 控制是否发对外回调。

## Risks / Trade-offs

- [调用方误用 `sorted:true` 传入乱序数据] → 结果顺序错误。缓解：JSDoc/文档显著标注前置条件；dev 模式可选做一次末值单调性断言并告警。
- [Vue 2.7 下 `triggerRef` 刷新窗口不彻底] → 追加后视口不更新。缓解：D2 的先行验证用例；不通过则该路径在 2.7 回退赋新引用（牺牲部分收益保正确）。
- [同引用 `push` 破坏外部对 `dataSource` 的不可变假设] → 若 `dataSourceCopy` 与 `props.dataSource` 共用底层数组会导致外部数组被改写。缓解：增量维护 `dataSourceCopy` 自有数组，不回写 `props.dataSource`；文档说明追加不修改传入的原 `dataSource`。
- [自适应行高回退仍 O(N)] → 该子场景收益缩水。缓解：文档明确适用边界；基准数据决定是否值得。
- [合并边界判定保守回退] → 实时合并场景拿不到增量收益。缓解：作为 v1 已知限制，后续可针对"仅末行可扩展的合并"做定向增量。

## Migration Plan

1. 纯新增，不改既有 `props.dataSource` 路径，向后兼容，无破坏性变更。
2. 先加内部 `useAppendDataSource` + expose 方法（默认逻辑），文档/示例与 `sorted` 前置条件同步。
3. 回滚策略：移除 expose 与 hook 即回到现状，无数据格式迁移。

## Open Questions

- Vue 2.7 `shallowRef` + `triggerRef` 是否可靠驱动仅可视窗口重渲染？（实现首步用最小 demo 验证，结论影响 D2 在 2.7 的落地方式，不改对外契约。）
- 自适应行高结构是否支持 O(新增行数) 尾部入？（决定 D4 是增量还是回退；两种都不改对外行为，仅改性能。）

## 受影响文档（代码改动与文档同一改动）

- `docs-src/main/api/expose.md`：登记 `appendDataSource`（用途、签名、参数、适用/不适用场景、示例）。
- 新增/更新示例页（`docs-src/main/table/advanced/` 或 `docs-demo/` 流式追加 demo），示例须可直接运行且与签名一致。
- 多语言镜像 `docs-src/en|ja/ko/` 对应页面（至少先更中文，能翻译则同步）。
- `CHANGELOG.md` 记录公共 API 新增。
- `llms.txt` 增补该方法与坑（`sorted` 前置条件、合并/树回退），随后 `pnpm ai:check`。
