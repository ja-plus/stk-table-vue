# 添加项目规范（基线能力规范 + OpenSpec 项目配置）

## Why

本项目（stk-table-vue）是一个功能成熟的虚拟滚动表格组件库，但 `openspec/specs/` 目前为空：没有任何基线能力规范，导致后续变更缺少行为契约基准，AI 与开发者无法通过 OpenSpec 快速了解组件的行为边界。同时 `openspec/config.yaml` 缺少项目上下文（技术栈、开发约定），AI 生成 proposal/spec/tasks 时缺少项目级约束（尤其是代码与文档同步规则）。

## What Changes

- 补充 `openspec/config.yaml`：在 `context` 中记录技术栈（Vue 3 / Vue 2.7、Vite、TypeScript、pnpm、Less、Vitest、VitePress）与项目定位；在 `rules` 中加入关键开发约定（代码改动必须同步 docs-src 文档、英文 commit message、specs 用中文书写）。
- 新增 11 份基线能力规范（描述**现有行为**，均为 ADDED Requirements），覆盖组件主要功能：
  - 虚拟滚动（纵向/横向/autoResize/手动初始化）
  - 固定列与固定表头（CSS sticky、吸附、阴影）
  - 多级表头（含横向虚拟滚动支持）
  - 排序（本地/远程/多列/默认排序）
  - 树形表格与行展开（树节点展开/默认展开/setTreeExpand、expand 列/setRowExpand）
  - 单元格合并（rowspan/colspan、虚拟滚动兼容、缓存语义）
  - 行/单元格高亮动画（animation/css 方式）
  - 区域选取（拖选、键盘、复制、feature 注册机制）
  - 列管理（列宽调整、表头拖动换序）
  - 行拖动换序
  - 内置自定义单元格工厂（Filter/Editable/Checkbox/Number/Change）

## Capabilities

### New Capabilities

- `virtual-scroll`: 纵向/横向虚拟滚动的启用、可视区计算、容器尺寸变化自动重算（autoResize）与手动初始化方法语义
- `fixed-columns`: 基于 CSS sticky 的固定列/固定表头行为、列宽约束、吸附时机与固定列阴影
- `multi-level-header`: 多级表头结构定义、与横向虚拟滚动的兼容性及固定列模式限制
- `sorting`: 列排序（默认/自定义/sortField）、远程排序、多列排序、默认排序及排序相关 expose API 语义
- `tree-table`: 树形数据的展示、节点展开控制（默认展开配置与 setTreeExpand）、expand 行展开列（setRowExpand）、注入字段约束与虚拟列表兼容
- `merge-cells`: mergeCells 函数契约、行列合并、虚拟滚动下的合并渲染、合并结果缓存语义与 clearMergeCellsCache
- `cell-highlight`: setHighlightDimRow / setHighlightDimCell 的高亮方式（animation/css）、全局配置与约束
- `area-selection`: 区域选取的注册机制、拖选/键盘/复制行为与选区 expose API
- `column-management`: 列宽调整（colResizable）与表头拖动换序（headerDrag）的行为、v-model:columns 契约与相关事件
- `row-drag`: 行拖动换序的内置 dragRow 列类型与 row-order-change 事件契约
- `custom-cells`: 内置自定义单元格工厂（createFilterCell / createEditableCell / createCheckboxCell / createNumberCell / createChangeCell）的导出与职责

### Modified Capabilities

无（`openspec/specs/` 目前为空，本次全部为新增基线规范）。

## Impact

- **OpenSpec 结构**：`openspec/specs/` 下新增 11 个能力目录；`openspec/config.yaml` 增加 context 与 rules。
- **代码**：不修改任何运行时代码。基线规范以现有实现与官方文档（docs-src/、README.md）为事实来源进行描述。
- **文档**：不涉及 docs-src/ 站点内容变更（本变更只写 OpenSpec 规范文件）。
- **依赖**：无新增依赖。
