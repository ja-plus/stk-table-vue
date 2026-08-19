# tasks.md

## 1. 补充 OpenSpec 项目配置

- [x] 1.1 在 `openspec/config.yaml` 的 `context` 中写入项目定位（Vue 3 / Vue 2.7 高性能虚拟滚动表格组件库、零运行时依赖）与技术栈（Vue 3/2.7、Vite 7、TypeScript 5、Less、pnpm、Vitest、VitePress 文档站）
- [x] 1.2 在 `openspec/config.yaml` 的 `rules` 中写入开发约定：代码改动必须同步 docs-src 文档（含 en/ja/ko 多语言镜像与 CHANGELOG.md）、公共 API 需登记到 docs-src/main/api/expose.md、commit message 使用英文、OpenSpec 工件用中文书写

## 2. 基线规格与源码/文档交叉核对

> 规格草稿已在规划阶段完成（specs/ 下 11 个能力），本组任务逐个核对事实准确性，发现偏差以源码为准修正规格。

- [x] 2.1 核对 `virtual-scroll`：对照 src/StkTable/useVirtualScroll.ts、useAutoResize.ts 与 docs-src/main/table/advanced/virtual.md
- [x] 2.2 核对 `fixed-columns`：对照 useFixedCol.ts、useFixedStyle.ts、useGetFixedColPosition.ts 与 docs-src/main/table/basic/fixed.md、fixed-mode.md
- [x] 2.3 核对 `multi-level-header`：对照 useTableColumns.ts 与 docs-src/main/table/basic/multi-header.md
- [x] 2.4 核对 `sorting`：对照 useSorter.ts、utils/index.ts（tableSort）与 docs-src/main/table/basic/sort.md、advanced/custom-sort.md
- [x] 2.5 核对 `tree-table`：对照 useTree.ts、useRowExpand.ts 与 docs-src/main/table/basic/tree.md、expand-row.md
- [x] 2.6 核对 `merge-cells`：对照 useMergeCells.ts、mergeCellsCache.ts、useMaxRowSpan.ts 与 docs-src/main/table/basic/merge-cells.md
- [x] 2.7 核对 `cell-highlight`：对照 useHighlight.ts、types/highlightDimOptions.ts 与 docs-src/main/table/advanced/highlight.md
- [x] 2.8 核对 `area-selection`：对照 features/useAreaSelection.ts、registerFeature.ts 与 docs-src/main/table/advanced/area-selection.md
- [x] 2.9 核对 `column-management`：对照 useColResize.ts、useThDrag.ts 与 docs-src/main/table/advanced/column-resize.md、header-drag.md
- [x] 2.10 核对 `row-drag`：对照 useTrDrag.ts 与 docs-src/main/table/advanced/row-drag.md，确认 row-order-change 参数差异标注无误
- [x] 2.11 核对 `custom-cells`：对照 src/StkTable/custom-cells/ 各工厂与 docs-src/main/table/advanced/custom-cells/*.md

## 3. 验证与归档

- [x] 3.1 运行 `openspec validate add-project-specs --strict` 并修复所有告警（如 Purpose 过短、Scenario 格式）
- [x] 3.2 用能力关键词（如 setTreeExpand、clearMergeCellsCache、headerDrag）在规格中抽查关键 API 是否均有对应 Requirement
- [x] 3.3 确认后归档变更（`openspec archive add-project-specs`），使 11 份规范写入 openspec/specs/ 成为正式基线
