# AI-API-REFERENCE.md

> Stk Table Vue 浓缩 API 速查手册（面向 AI / 快速查阅）。
> 权威定义始终以 `src/StkTable/types/index.ts` 与 `src/StkTable/StkTable.vue` 为准，本文档是便于快速检索的摘要。
> 完整文档见 `docs-src/main/api/*.md`。

## 组件定位

高性能虚拟滚动表格，Vue3 / Vue2.7，基于原生 `<table>`，零运行时第三方依赖。大数据量（万行实时数据）流畅渲染。

## 核心用法

```html
<script setup>
import { StkTable } from 'stk-table-vue'
import { ref } from 'vue'
const stkTableRef = ref()
const columns = [
    { title: 'name', dataIndex: 'name', width: 100, fixed: 'left' },
    { title: 'age', dataIndex: 'age', sorter: true },
]
const dataSource = [{ id: 1, name: 'John', age: 32 }]
</script>
<template>
    <StkTable ref="stkTableRef" row-key="id" :data-source="dataSource" :columns="columns" virtual virtual-x />
</template>
```

> 泛型约定：`T` / `DT` 均代表数据行类型（`dataSource` 元素），`StkTableColumn<T>` 中的 `T` 同义。

---

## Props（表格配置）

### 基础布局
| prop | 类型 | 说明 |
| --- | --- | --- |
| `width` | `string` | 表格宽度 |
| `height` | `string` | 表格高度 |
| `rowHeight` | `number` | 行高（`autoRowHeight` 时表示期望高）；可动态修改，自动重算可视区 |
| `headerRowHeight` | `number\|null` | 表头行高，默认=rowHeight；可动态修改，`pageSize` 随之重算 |
| `footerRowHeight` | `number\|string\|null` | 表尾行高，默认=rowHeight；可动态修改（表尾 sticky，不计入总高） |
| `fixedMode` | `boolean` | 使用 `table-layout:fixed` |
| `headless` | `boolean` | 隐藏表头 |
| `theme` | `'light'\|'dark'` | 主题 |
| `bordered` | `boolean\|'h'\|'v'\|'body-v'\|'body-h'` | 单元格分割线控制 |
| `stripe` | `boolean` | 斑马纹 |
| `noDataFull` / `showNoData` | `boolean` | 空数据兜底高度/展示 |
| `emptyCellText` | `string\|fn` | 空值展示文字 |

### 数据 & 列
| prop | 类型 | 说明 |
| --- | --- | --- |
| `columns` | `StkTableColumn<any>[]` | 列配置（浅监听，改引用） |
| `dataSource` | `any[]` | 数据源（浅监听，改引用） |
| `rowKey` | `UniqKeyProp` | 行唯一键（值不能 undefined） |
| `colKey` | `UniqKeyProp` | 列唯一键，默认 `dataIndex` |
| `footerData` | `DT[]` | 表尾合计行数据 |

### 虚拟滚动
| prop | 类型 | 说明 |
| --- | --- | --- |
| `virtual` | `boolean` | 启用 Y 轴虚拟滚动 |
| `virtualX` | `boolean` | 启用 X 轴虚拟滚动（必须设列宽） |
| `autoRowHeight` | `boolean\|{expectedHeight}` | 可变行高 |
| `autoResize` | `boolean\|fn` | 自动重算虚拟滚动宽高，默认 true |
| `smoothScroll` | `boolean` | 平滑滚动（默认 chrome<85 或 >120 才 true） |
| `scrollRowByRow` | `boolean\|'scrollbar'` | 按整数行纵向滚动 |
| `scrollbar` | `boolean\|ScrollbarOptions` | 自定义滚动条配置 |
| `optimizeVue2Scroll` | `boolean` | 优化 vue2 滚动 |

### 交互
| prop | 类型 | 说明 |
| --- | --- | --- |
| `rowHover` / `rowActive` | `boolean\|config` | 行 hover / 行选中高亮 |
| `cellHover` / `cellActive` | `boolean` | 单元格 hover / 选中 |
| `selectedCellRevokable` | `boolean` | 选中单元格可再次点击取消 |
| `areaSelection` | `boolean\|config` | 单元格区域选取（Excel 式） |
| `headerDrag` | `boolean\|config` | 表头拖拽换序 |
| `dragRowConfig` | `{mode:'none'\|'insert'\|'swap'}` | 行拖拽换序 |
| `colResizable` | `boolean\|config` | 列宽拖动（需 `v-model:columns`） |
| `colMinWidth` | `number` | 列宽可拖至最小 |
| `fixedColShadow` | `boolean` | 固定列阴影（默认 false 省性能） |
| `sortRemote` | `boolean` | 服务端排序（true 则不本地排序） |
| `sortConfig` | `SortConfig` | 排序配置（多列/空值置底等） |
| `showOverflow` / `showHeaderOverflow` | `boolean` | 表体/表头溢出省略 |
| `hideHeaderTitle` | `boolean\|string[]` | 隐藏表头悬浮 title |

### 其他
| prop | 类型 | 说明 |
| --- | --- | --- |
| `cellFixedMode` | `'sticky'\|'relative'` | 固定头/列实现方式（低版本浏览器仅 relative） |
| `highlightConfig` | `{duration,fps}` | 高亮配置 |
| `seqConfig` | `{startIndex}` | 序号列（分页适配） |
| `expandConfig` | `{height}` | 展开行配置 |
| `treeConfig` | `TreeConfig` | 树形配置 |
| `experimental` | `{scrollY}` | 实验性功能（transform 模拟滚动） |
| `rowClassName` | `fn(row,i)` | 行附加 class |

---

## StkTableColumn（列配置类型）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `any` | 列唯一键，默认取 `dataIndex` |
| `dataIndex` | `keyof T & string` | 取值字段（必填） |
| `title` | `string` | 表头文字 |
| `type` | `'seq'\|'expand'\|'dragRow'\|'tree-node'` | 特殊列类型 |
| `align` / `headerAlign` | `'right'\|'left'\|'center'` | 内容/表头对齐 |
| `width` | `string\|number` | 列宽（X 虚拟滚动必须） |
| `minWidth` / `maxWidth` | `string\|number` | 最小/最大列宽（非 X 虚拟滚动生效） |
| `fixed` | `'left'\|'right'\|null` | 固定列 |
| `hidden` | `boolean` | 隐藏列 |
| `sorter` | `boolean\|fn` | 是否可排序/自定义排序 |
| `sortField` | `keyof T` | 排序字段，默认 dataIndex |
| `sortType` | `'number'\|'string'` | 排序方式 |
| `sortConfig` | `Omit<SortConfig,'defaultSort'>` | 当前列排序规则 |
| `className` / `headerClassName` | `string` | td/th class |
| `children` | `StkTableColumn<T>[]` | 二级（多级）表头 |
| `mergeCells` | `fn(row,col,rowIndex,colIndex)=> {rowspan?,colspan?}` | 单元格合并 |
| `customCell` | `CustomCell` | 自定义 td 渲染 |
| `customHeaderCell` | `CustomCell` | 自定义 th 渲染 |
| `customFooterCell` | `CustomCell` | 自定义 tfoot td 渲染 |

> `customCell` 的 props：`{ row, col, cellValue, rowIndex, colIndex, expanded?, treeExpanded? }`。
> 推荐用函数式组件 `(props) => h(...)`，或 `defineComponent`（props 全可选时）。

### 私有字段（`@private`，勿用）
以 `__` 开头：`__P__`(父列)、`__R_SP__`/`__C_SP__`(rowSpan/colSpan)、`__W__`(计算宽)、`__LF_S__`/`__LF_E__`(叶子列区间)、`__VT_C_SP__`(虚拟 spacer)、行数据上的 `__R_K__`/`__EXP__`/`__T_EXP__`/`__T_P_K__`/`__T_LV__`。

---

## Emits 事件（常用）

| emit | 载荷 |
| --- | --- |
| `sort-change` | `(col, order, data, sortConfig)` |
| `row-click` / `row-dblclick` / `row-menu` | `(ev, row, {rowIndex})` |
| `current-change` | `(ev\|null, row\|undefined, {select})` |
| `cell-click` / `cell-mousedown` / `cell-mouseenter` / `cell-mouseleave` / `cell-mouseover` | `(ev, row, col, {rowIndex})` |
| `cell-selected` | `(ev\|null, {select, row, col})` |
| `header-cell-click` | `(ev, col)` |
| `header-row-menu` | `(ev)` |
| `scroll` / `scroll-x` | `(ev, {startIndex,endIndex})` |
| `col-order-change` / `th-drag-start` / `th-drop` | `(key, [targetKey])` |
| `row-order-change` | `(dragStartKey, targetRowKey)` |
| `col-resize` | `(col)` |
| `filter-change` | `(status)` |
| `toggle-row-expand` / `toggle-tree-expand` | `({expanded, row, col})` |
| `area-selection-change` | `(ranges)` |
| `update:columns` | `(cols)`（列宽拖动时更新） |

---

## Slots 插槽

| slot | props | 说明 |
| --- | --- | --- |
| `tableHeader` | `{col}` | 表头（批量自定义推荐） |
| `empty` | — | 空数据状态 |
| `expand` | `{col,row}` | 展开行 |
| `customBottom` | — | 表格底部（可配 IntersectionObserver） |

---

## Expose 实例方法（ref 调用）

### 虚拟滚动
- `initVirtualScroll(height?)` / `initVirtualScrollX()` / `initVirtualScrollY(height?)` — 重算可视区
### 选中 / 高亮
- `setCurrentRow(rowKeyOrRow, {silent,deep})` — 选中行
- `setSelectedCell(row?, col?, {silent})` — 选中单元格
- `setHighlightDimCell(rowKey, colKey, {method,className,keyframe,duration})` — 高亮单元格渐暗
- `setHighlightDimRow(rowKeyValues[], {method,className,keyframe,duration})` — 高亮行渐暗
### 排序
- `sortCol` / `sortStates` / `getSortColumns()` — 排序状态
- `setSorter(colKey, order, {sortOption,force,silent,sort})` / `resetSorter()` — 设置/重置排序
### 滚动 & 数据
- `scrollTo(top?, left?)` — 设置滚动位置
- `getTableData()` — 按当前排序顺序返回数据
- `getRowIndex(row)` / `getColumnIndex(col)` — 索引查询
### 展开 / 树
- `setRowExpand(rowKeyOrRow, expand?, {col,silent})`
- `setAutoHeight(rowKey, height?)` / `clearAllAutoHeight()`
- `setTreeExpand(row, {expand,all,level,parents})`
### 区域选取
- `getSelectedArea()` — 返回 `{rows,cols,ranges}`
- `setAreaSelection(ranges, {silent,scrollToView})`
- `clearSelectedArea()` / `copySelectedArea()`（返回 TSV 文本）
### 筛选
- `setFilter(status\|null, {remote,silent})`

---

## 内置自定义单元格（从包入口导出）

| 导出 | 说明 |
| --- | --- |
| `createFilterCell(options)` | 筛选单元格（配合 setFilter） |
| `createEditableCell(options)` | 可编辑单元格 |
| `createCheckboxCell(options)` | 多选框单元格 |
| `createNumberCell(options)` | 数字格式化单元格 |
| `createChangeCell(options)` | 涨跌单元格 |
| `formatNumber(value, options)` | 数字格式化工具 |

---

## 其他导出

```ts
import { useAreaSelection, registerFeature } from 'stk-table-vue'
// 工具函数
import { binarySearch, insertToOrderedArray, strCompare, tableSort } from 'stk-table-vue'
```

## 关键实现文件索引

| 文件 | 职责 |
| --- | --- |
| `src/StkTable/StkTable.vue` | 主组件装配（见文件头地图） |
| `src/StkTable/types/index.ts` | 全部 API 类型权威定义 |
| `src/StkTable/useVirtualScroll.ts` | XY 虚拟滚动 |
| `src/StkTable/useTableColumns.ts` | 多级表头摊平 |
| `src/StkTable/useMergeCells.ts` | 单元格合并 |
| `src/StkTable/features/useAreaSelection.ts` | 区域选取 |
| `src/StkTable/useSorter.ts` | 排序 |
| `src/StkTable/custom-cells/*` | 内置单元格 |
