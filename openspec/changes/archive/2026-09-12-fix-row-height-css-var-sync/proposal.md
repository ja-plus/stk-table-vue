## Why

用户动态修改行高类配置（`row-height` / `header-row-height` / `footer-row-height` / `expand-config.height`）时，**视觉行高与虚拟滚动几何计算不同步**，表现为改行高后底部大片空白、行错位、按行滚动跳动、区域选取键盘定位偏移。

已定位的根因（`row-height` 主链路，已用复现测试实证）：

1. 容器内联样式把 CSS 变量绑到了 store 快照：`src/StkTable/StkTable.vue` 第 34 行
   `'--row-height': props.autoRowHeight ? void 0 : virtualScroll.rowHeight + 'px'`；
2. `virtualScroll` 是 `shallowRef`，其 `rowHeight` 字段仅在 setup 创建时求值一次（`useVirtualScroll.ts` L136-L148）；
3. 全仓库**没有任何一处再写** `virtualScroll.value.rowHeight`：`initVirtualScrollY` 只 patch `containerHeight/pageSize/scrollHeight`（L605），`updateVirtualScrollY` 只 patch `scrollHeight/translateY/scrollTop/startIndex/...`（L747-L757、L765）。该字段实际是「只写一次的死字段」；
4. 已有的 `watch(() => props.rowHeight, initVirtualScrollY)`（StkTable.vue L1217）只让**计算侧**用上新行高（`getRowHeightFn` 直接读 `props.rowHeight`），CSS 变量仍是旧值 → 算出的偏移/占位高度与真实渲染高度不一致。
5. 同一行的次要缺陷：`initVirtualScrollY(height?)` 的第一形参是「虚拟滚动容器高度」，直接作为 watch 回调会把**新行高当成容器高度**传入（L576-L589 中 `containerHeight = height || clientHeight`），导致改行高时 `pageSize` 被按 `ceil(行高 / 行高) = 1` 计算，只渲染约 1 行。

同一陈旧字段还被三处消费，一并受影响：`SRBRTotalHeight`（L880）、`SRBRBottomHeight`（L885-L886）、`features/useAreaSelection.ts` L1030 的键盘滚动定位。

相邻缺口（本次一并纳入范围）：`header-row-height` 变化会影响 `pageSize`（`initVirtualScrollY` L592-L593 用 `tableHeaderHeight` 扣减表头占高）与表头/汇总行 sticky 定位，但**没有对应 watch**，虚拟窗口残留旧 `pageSize` 直到下次数据/尺寸变化；`expand-config.height` 变化会改变行高函数 `getRowHeightFn` 与行高 Fenwick 树（`useVirtualScroll.ts` L531-L535、L644-L663），同样没有触发重算，需等到下一次滚动才自愈。

## What Changes

- **修复 `--row-height` 不同步**：虚拟滚动 store 的 `rowHeight` 在每次 Y 轴初始化时随 `props.rowHeight` 重算并写入，使 CSS 变量、`tbody tr/td` 高度、占位 tr 的 `calc(var(--row-height) * N)`、无数据行 `line-height` 全部同步。
- **行高类配置动态变化统一重算**：`row-height`、`header-row-height`、`footer-row-height`、`expand-config.height` 任一变化时，SHALL 重算虚拟滚动几何（`pageSize` / 可视区窗口 / 总高 / 行高树），不再出现「视觉已变、计算未变」的半更新状态。
- **修正 watch 回调误传参**：行高类 props 的 watcher 不得把 prop 值作为 `initVirtualScrollY(height)` 的容器高度传入（改为无参调用，并在 `nextTick` 后执行以等待新样式应用到 DOM）。该缺陷同时使动态改行高时 `pageSize` 被算成 1（只渲染约 1 行），一并修复。
- **公共 API 无新增/删除**：`rowHeight` 等 props 签名不变，仅修复其动态更新语义 → 需在文档登记「行高类配置支持动态修改，修改后自动重算」的行为说明（见下方文档同步范围）。
- **文档同步范围**（按仓库 code-docs-sync 规则，与代码视为同一改动）：
  - `docs-src/main/table/basic/row-height.md`：补充「行高可动态修改并自动生效」说明；
  - `docs-src/main/table/basic/theme.md`：补充约束——通过 CSS 变量覆盖 `--row-height` 只影响视觉，固定行高/虚拟模式下 MUST 同步 `row-height` prop，否则滚动几何与真实行高不一致；
  - `docs-src/main/api/table-props.md`：`rowHeight` / `headerRowHeight` / `footerRowHeight` 条目补充「可动态修改，变更后自动重算可视区」；
  - 多语言镜像 `docs-src/en|ja|ko/` 对应页面同步；
  - `CHANGELOG.md` 记录 bugfix 条目。

## Capabilities

### New Capabilities

（无新增能力）

### Modified Capabilities

- `virtual-scroll`: 新增行为契约——行高类配置动态变化时，CSS 行高变量与虚拟滚动几何必须同步重算（此行为本应存在，因 store 字段只写一次而失效）。

## Impact

- **受影响代码**：
  - `src/StkTable/useVirtualScroll.ts`：`initVirtualScrollY` 的 `assignVs` patch 补 `rowHeight`；
  - `src/StkTable/StkTable.vue`：行高类 props 的 watch（现有 `watch(() => props.rowHeight, initVirtualScrollY)` 扩展为覆盖 `headerRowHeight` / `footerRowHeight` / `expandConfig.height` 的统一入口，需 `nextTick` 等 DOM 应用新样式后再测量）；
  - `src/StkTable/features/useAreaSelection.ts`：无需改动，`vs.rowHeight` 随 store 修复自动恢复正确。
- **公共 API**：props / emits / slots / expose 签名均无变化。
- **测试**：`test/rowHeightVarSync.repro.test.js` 由红色复现用例转正为回归守卫，并扩展到 `header-row-height`、`expand-config.height` 场景。
- **文档**：见「What Changes」文档同步范围。
- **不修复项（明确边界）**：`footer-row-height` 至今不参与 `scrollHeight` / `pageSize` 计算（`initVirtualScrollY` L596-L599 只补偿表头高度），本次不新增表尾几何补偿，仅保证表尾行高变化后视觉正确且触发一次重算，避免遗留半更新状态。
