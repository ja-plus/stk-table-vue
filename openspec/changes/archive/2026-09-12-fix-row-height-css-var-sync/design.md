## Context

行高类配置动态失效的根因分布在「一个只写一次的 store 字段」与「缺失/错误的 watcher」两处：

- `src/StkTable/StkTable.vue` L34 把 CSS 变量绑到 `virtualScroll.rowHeight`（store 快照）；
- `src/StkTable/useVirtualScroll.ts` L136-L148 用 `shallowRef` 初始化该字段后，`initVirtualScrollY`（L605）与 `updateVirtualScrollY`（L747-L757、L765）的 `assignVs` patch 都不再包含 `rowHeight`，全仓库也无 `virtualScroll.value.rowHeight = ...` 的写入；
- `src/StkTable/StkTable.vue` L1217 `watch(() => props.rowHeight, initVirtualScrollY)` 把 watch 的新值（行高）当作 `initVirtualScrollY(height)` 的**容器高度**参数传入，使 `pageSize = ceil(行高 / 行高) = 1`；
- `headerRowHeight` / `footerRowHeight` / `expandConfig.height` 无对应 watch。

行高的读取现状（决定改动落点）：

| 消费点 | 当前取值来源 | 是否随 props 变化 |
| --- | --- | --- |
| `--row-height`（模板 L34） | `virtualScroll.rowHeight`（store 快照） | ✗ 需修 |
| `--header-row-height` / `--footer-row-height`（L35-L36） | `props` | ✓ |
| 展开行行高（`getTRProps` L1545-L1549） | `props.expandConfig.height` | ✓（样式侧） |
| 虚拟滚动计算（`getRowHeightFn` L524-L537） | `props`（computed） | ✓ |
| `pageSize` / 总高 / `offsetTop` | store + 行高树，仅在 `initVirtualScrollY`/`updateVirtualScrollY` 时重算 | 依赖是否有重算入口 |
| `SRBRTotalHeight`/`SRBRBottomHeight`（L880、L885）、`useAreaSelection` L1030 | `virtualScroll.rowHeight` | ✗ 随 store 修复自动恢复 |
| 样式消费方：`tbody tr`/`tbody td` 高（style.less L326、L329、L469）、占位 tr `calc(var(--row-height) * N)`（L259、L265）、无数据行 `line-height`（L700） | `var(--row-height)` | ✗ 随模板修复 |

## Goals / Non-Goals

**Goals:**

- `--row-height` 与虚拟滚动计算严格同源，行高变化后视觉与几何一次到位。
- `row-height` / `header-row-height` / `footer-row-height` / `expand-config.height` 动态变化后自动重算，无需用户手动调用 `initVirtualScroll`。
- 修正 watch 回调把行高当容器高度传参的缺陷。
- 零热路径开销：新增写入只在 prop 变化 / 初始化时发生，不影响每帧滚动（保留 `assignVs` 的 `hasChanged` 语义与 `SILENT_Y_KEYS` 静默机制）。

**Non-Goals:**

- 不改变 `autoRowHeight` 的实测优先语义：已实测行高（`autoRowHeightMap`）不因期望行高（`rowHeight`）变化而失效，容器在变高模式下继续不输出 `--row-height`。
- 不为 `footer-row-height` 新增总高/`pageSize` 补偿公式（虚拟滚动总高公式至今只补偿表头高度，属既有限制，本次只在文档中如实说明）。
- 不改公共 API 签名、不改 `initVirtualScroll*` 的对外语义（`height` 仍表示虚拟滚动高度）。
- 不处理 `autoRowHeight` 开关本身从 false↔true 的切换重算（模式切换属数据/配置重建路径，若实现阶段发现同源缺陷可另开 change）。

## Decisions

### 决策 1：`rowHeight` 由 `initVirtualScrollY` 写入 store（单一事实来源）

`useVirtualScroll.ts` 的 `initVirtualScrollY` 已在 L586 计算好基准行高 `const rowHeight = getRowHeightFn.value();`（无参调用时该函数恒返回 `props.rowHeight || DEFAULT_ROW_HEIGHT`，`autoRowHeight` / 展开行分支只在带行参数时才返回行级高度）。把它并入 L605 的 patch：

```ts
assignVs(virtualScroll, { rowHeight, containerHeight, pageSize, scrollHeight });
```

**理由**：

- 一处改动同时治好 `--row-height`、`SRBRTotalHeight`、`SRBRBottomHeight`、`useAreaSelection` 四个消费方；若只把模板改成 `props.rowHeight + 'px'`，后三者仍读陈旧值。
- 保持「模板读 store」的现状 → CSS 变量与参与计算的值同源，不会再出现两套行高。
- 复用已有 `assignVs` 的变化判定，值未变不 `triggerRef`，不引入多余重渲染。
- `getRowHeightFn.value()` 自带 `|| DEFAULT_ROW_HEIGHT` 兜底，比直接把 `props.rowHeight`（可能为 `undefined`/`0`）写进 store 更安全。

**备选方案**：
- 模板直读 `props.rowHeight`：改动更小，但 `vs.rowHeight`（区域选取）与 SRBR 两处仍陈旧，问题只解决一半。
- 新增 `bodyRowHeight` computed 并替换全部消费方：语义最清晰，但要改 4 处以上读取点并新增类型字段，收益与决策 1 相同、成本更高。

### 决策 2：行高类 props 收敛为一个 watcher，无参 + `nextTick` 调用，源为「拼接后的原始值」

`StkTable.vue` L1217 替换为：

```ts
watch(
    () => `${props.rowHeight}|${props.headerRowHeight}|${props.footerRowHeight}|${props.expandConfig?.height}`,
    () => nextTick(initVirtualScrollY),
);
```

**理由**：

- 无参调用消除「行高被当容器高度」传参缺陷（另一写法是在 `initVirtualScrollY` 内部校验入参类型，但那只会默默掩盖调用方错误，也不解决 `pageSize` 已被算错的事实）。
- `nextTick`：`--row-height` / 表头行高 / 展开行 `--row-height` 都是渲染后才应用到 DOM 的样式，而 `initVirtualScrollY` 要读 `tableContainerRef.clientHeight`/`scrollHeight`，变高模式下还要批量测量 `tr.offsetHeight`（L783-L800）。挂载后首次重算必须等新样式生效，否则测到旧行高。`watch(() => props.virtual)`（L1210-L1215）与 `watch(() => props.virtualX)`（L1219-L1229）已是同一模式，保持一致。
- 合并为单个 watcher：避免四个 watcher 在同一 tick 内重复重算；行高树缓存以 `getRowHeightFn` 的 computed 引用为键（L644-L663），`expandConfig.height` 真变化时会自动触发 O(n) 重建，无需手动 `clearAllAutoHeight`。
- **MUST NOT 用「单 getter 返回数组」**（实施期性能评估的新发现）：getter 返回数组时每次求值都是新数组，Vue 做身份比较必然判定「已变化」；而 `props` 是 shallowReactive，父组件传内联对象字面量（**官方示例 `:expand-config="{ height: 40 }"` 即此写法**）会使 `expandConfig` 依赖在每次父重渲染时变化，让 watcher 空跑。实测（happy-dom）：展开列 + 50K 行下，数组 getter 版每次父重渲染 `13.9~14.4ms`，拼接原始值版 `2.5ms`，未纳入 expandConfig 的基线 `2.7~5.4ms`——多出的 ~10ms 来自空跑连带 `getRowHeightFn` computed 重算（其函数引用是行高树缓存键）→ 行高树 O(n) 重建。拼接为字符串后仅值真正变化才触发，每次求值只分配一个短字符串，成本可忽略。

**备选方案**：

- 每个 prop 单独 `watch` —— 与现有代码风格最贴近，但同 tick 多项变化会多次重算，且容易再漏一个 prop。
- `watch([() => props.rowHeight, () => props.expandConfig?.height], ...)`（多源 getter 数组，Vue 3 逐元素比较）—— 实测在 Vue 3.5 下不误触发，但 Vue 2.7 的 `Watcher.run()` 对数组值走 `isObject` 分支、每次重求值均回调，本库声明支持 Vue 2.7，故不采用。

### 决策 3：模板绑定与 `autoRowHeight` 分支保持不变

`'--row-height': props.autoRowHeight ? void 0 : virtualScroll.rowHeight + 'px'` 继续读 store（此时已同步），变高模式仍不输出该变量。理由见 Non-Goals 第 1 条：变高模式下行高由内容撑开，容器输出统一行高会让视口上方的空 tr 塌陷（`StkTable.vue` L1437-L1440 注释记录的既有教训）。

## Risks / Trade-offs

- **[风险] 改 `rowHeight` 后 store 变化会触发整表重渲染** → 仅在值真变化时发生（`assignVs` 已恢复 `hasChanged` 语义），且行高变化本就需要整表重排；**不在滚动热路径**（每帧的 `updateVirtualScrollY` patch 不含 `rowHeight`，实测 50K 行每帧 0.004ms 与基线一致），接受。
- **[已修风险] watcher 源若写成「数组 getter」会在父重渲染时空跑** → 实测展开列 + 50K 行下多付 ~10ms/次（达一帧预算的 60%）；已改为拼接原始值，并由 `rowHeightSync.test.js` 的「行高 watcher 的触发条件（性能守卫）」用例守着（以 `containerHeight` 是否被重写为探针）。
- **[风险] `headerRowHeight` 纳入 watcher 后，`pageSize` 变小/变大会改变渲染行数** → 属预期修复；需回归 `test/autoRowHeightVirtualScroll.test.js`、`test/AutoHeightStripe` 等既有用例确认无「首行被表头遮挡」反向问题。
- **[风险] `nextTick` 后测量到的是新样式，但极端情况下浏览器换行/字体未稳定（autoRowHeight 首帧）** → 与 `onDataSourceChange`（L1253-L1259）既有路径一致，且实测值只写入一次、后续滚动会继续校正；沿用现有策略不额外处理。
- **[取舍] `footer-row-height` 进入 watcher 数学上是空操作**（总高公式不含表尾）→ 保留以维持「行高类配置变化必有一次重算入口」的契约一致性，代价为零。
- **[风险] 依赖旧错误行为的用户**（改 `rowHeight` 后表格只显示 1 行）→ 该行为本身是 bug，修复方向明确；在 CHANGELOG 与文档说明行高可动态修改。

## 测试设计

`test/rowHeightVarSync.repro.test.js` 转正为 `test/rowHeightSync.test.js`（沿用仓库 happy-dom + `@vue/test-utils` 守卫测试约定），断言层次：

1. **CSS 变量层**：读取根元素 inline style 的 `--row-height`，`setProps({ rowHeight: 40 })` + `nextTick` 后 MUST 为 `40px`；`autoRowHeight: true` 时 MUST 不出现该变量。
2. **store 层**：`setProps` 后检查曝光的 `initVirtualScrollY` 重算结果（经 `wrapper.vm` 读取或直接断言渲染行数量），`pageSize` MUST 按新行高变化（守住决策 2 的传参缺陷：`rowHeight` 从 28→40 时 `pageSize` 不得为 0/1，而应约为 `ceil(容器高/40) - 表头行数`）。
3. **几何一致层**：改行高并滚动到中段后，占位 tr（`vt-above-viewport-ph-row` / `vt-below-viewport-ph`）高度与 `paddingTop`/`offsetBottom` 之和 MUST 与「行数 × 新行高」一致，不出现空白带。
4. **表头/展开行层**：`setProps({ headerRowHeight })`、`setProps({ expandConfig: { height } })` 后 `pageSize` 与行高树总高（内部诊断 `getRowHeightCacheInfo`，见 `useVirtualScroll.ts` L665-L673）MUST 随之变化。
5. **触发条件层（性能守卫）**：以「只改 mock 的 `clientHeight`、再 `setProps` 同值新对象」为探针（`containerHeight` 仅由 `initVirtualScrollY` 写入）：`expandConfig` 换为新对象但 `height` 未变时 MUST NOT 重算；`height` 真变化时 MUST 重算并读到新容器高度。防止决策 2 的 watcher 源写法退化。

## 文档影响（受影响的 docs-src 页面）

| 文档页面 | 需同步的内容 |
| --- | --- |
| `docs-src/main/table/basic/row-height.md` | 新增说明：`row-height` / `header-row-height` / `footer-row-height` 支持动态修改，修改后自动重算可视区，无需手动 `initVirtualScroll`；并说明表尾高度不计入虚拟滚动总高公式 |
| `docs-src/main/table/basic/theme.md` | 补充约束：CSS 变量方式覆盖 `--row-height` 只影响视觉，固定/虚拟行高场景 MUST 同步设置 `row-height` prop，否则滚动几何与真实行高不一致 |
| `docs-src/main/table/basic/expand-row.md` | `expand-config.height` 动态修改后自动重算（如文档已描述该配置） |
| `docs-src/main/api/table-props.md` | `rowHeight` / `headerRowHeight` / `footerRowHeight` 条目补「动态修改后自动重算」行为描述（签名不变） |
| `docs-src/en/`、`docs-src/ja/`、`docs-src/ko/` 同名页面 | 与中文主文档一致的翻译同步 |
| `CHANGELOG.md` | 新增 bugfix 条目：`--row-height` 不随 `row-height` prop 更新；行高变化时 `pageSize` 误把行高当容器高度 |
| `AI-API-REFERENCE.md` | 若其中登记了行高相关 props 的行为描述，同步一行说明 |
