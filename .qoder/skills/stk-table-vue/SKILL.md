---
name: stk-table-vue
description: >
  High-performance virtual scrolling table component for Vue 3 / Vue 2.7.
  Provides usage guidance for StkTable component including virtual scroll,
  fixed columns, tree table, area selection, cell highlighting, custom cells,
  sorting, merge cells, and column resize.
  Use when the project uses stk-table-vue, StkTable component, or when the
  user mentions virtual table, sticky table, or high-performance data grid.
---

# Stk Table Vue

High-performance virtual scrolling table component based on Vue 3 / Vue 2.7. Smooth performance with tens of thousands of rows. Designed for real-time data display with built-in highlighting and animation effects.

- Vue 3 & Vue 2.7 support
- Virtual scrolling (X & Y axis)
- CSS `sticky` based fixed columns & fixed header
- Multi-level header with horizontal virtual scroll
- Tree table & expandable rows
- Area selection with keyboard navigation
- Cell highlighting with Animation API
- Built-in custom cells: Filter, Editable, Checkbox, Number, Change
- Column resize, header drag, row drag
- Merge cells (virtual mode, huge rowspan/colspan supported)
- Sortable & filterable
- Theme support (dark / light)
- CSS variables for easy customization
- Based on native `<table>` element
- Zero third-party runtime dependencies

Official docs: https://ja-plus.github.io/stk-table-vue/

## Installation

```bash
npm install stk-table-vue
```

## Basic Usage

```vue
<script setup>
import { StkTable } from 'stk-table-vue'
import { ref } from 'vue'

const tableRef = ref()
const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Address', dataIndex: 'address' },
]
const dataSource = [
  { id: 1, name: 'John', age: 32, address: 'New York' },
  { id: 2, name: 'Jim', age: 42, address: 'London' },
]
</script>

<template>
  <StkTable
    ref="tableRef"
    row-key="id"
    :columns="columns"
    :data-source="dataSource"
  />
</template>
```

## Column Configuration (StkTableColumn)

```ts
type StkTableColumn<T> = {
  dataIndex: string       // Required. Field name from row data
  key?: any               // Column unique key. Default: dataIndex
  title?: string          // Header text
  type?: 'seq' | 'expand' | 'dragRow' | 'tree-node'  // Special column types
  width?: string | number // Column width. Required for virtualX
  minWidth?: string | number
  maxWidth?: string | number
  fixed?: 'left' | 'right' | null  // Fixed column position
  hidden?: boolean        // Hide column
  align?: 'right' | 'left' | 'center'
  headerAlign?: 'right' | 'left' | 'center'
  sorter?: boolean | ((data: T[], option: { order: Order; column: any }) => T[])
  sortField?: string      // Sort by different field
  sortType?: 'number' | 'string'
  sortConfig?: object     // Per-column sort config
  className?: string      // td class
  headerClassName?: string // th class
  customCell?: Component   // Custom td render. Props: { row, col, cellValue, rowIndex, colIndex }
  customHeaderCell?: Component // Custom th render. Props: { col, rowIndex, colIndex }
  customFooterCell?: Component // Custom tfoot td render
  children?: StkTableColumn[] // Multi-level header
  mergeCells?: (param: { row, col, rowIndex, colIndex }) => { rowspan?: number; colspan?: number } | undefined
}
```

**Important**: `columns` is shallow-watched. When pushing/splicing, update the reference:
```ts
columns.value = columns.value.slice()
```

## Key Props

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `StkTableColumn[]` | Column config array. Shallow watch. |
| `dataSource` | `any[]` | Data source. Shallow watch. |
| `rowKey` | `string \| ((row) => key)` | Row unique key field. Required. |
| `virtual` | `boolean` | Enable vertical virtual scroll |
| `virtualX` | `boolean` | Enable horizontal virtual scroll (columns must have width) |
| `rowHeight` | `number` | Row height (or estimated height when autoRowHeight) |
| `autoRowHeight` | `boolean \| { expectedHeight? }` | Variable row height mode |
| `stripe` | `boolean` | Zebra stripes |
| `bordered` | `boolean \| 'h' \| 'v' \| 'body-v' \| 'body-h'` | Cell borders |
| `theme` | `'light' \| 'dark'` | Theme |
| `width` | `string` | Table width |
| `headless` | `boolean` | Hide header |
| `rowHover` | `boolean` | Highlight row on hover |
| `rowActive` | `boolean \| { enabled?, disabled?, revokable? }` | Row selection highlight |
| `cellHover` | `boolean` | Highlight cell on hover |
| `cellActive` | `boolean` | Selected cell highlight |
| `showOverflow` | `boolean` | Show ellipsis for overflow content |
| `showHeaderOverflow` | `boolean` | Show ellipsis for header overflow |
| `noDataFull` | `boolean` | Empty state fills height |
| `sortRemote` | `boolean` | Server-side sorting (don't sort data locally) |
| `sortConfig` | `SortConfig` | Sort configuration |
| `colResizable` | `boolean \| { disabled? }` | Column width resizable (requires v-model:columns) |
| `headerDrag` | `boolean \| { mode?, disabled? }` | Header draggable. mode: 'insert'(default) \| 'swap' \| 'none' |
| `areaSelection` | `boolean \| { enabled?, keyboard?, ctrl?, shift?, formatCellForClipboard? }` | Cell range selection |
| `treeConfig` | `{ defaultExpandAll?, defaultExpandKeys?, defaultExpandLevel? }` | Tree table config |
| `expandConfig` | `{ height? }` | Expand row config |
| `dragRowConfig` | `{ mode?: 'insert' \| 'swap' \| 'none' }` | Row drag config |
| `highlightConfig` | `{ duration?, fps? }` | Highlight animation config |
| `seqConfig` | `{ startIndex? }` | Sequence column config (for pagination) |
| `autoResize` | `boolean \| (() => void)` | Auto recalculate virtual viewport. Default: true |
| `fixedColShadow` | `boolean` | Show fixed column shadow |
| `scrollbar` | `boolean \| ScrollbarOptions` | Custom scrollbar |
| `smoothScroll` | `boolean` | Smooth scrolling |
| `scrollRowByRow` | `boolean \| 'scrollbar'` | Integer row scrolling |
| `footerData` | `DT[]` | Footer summary rows |
| `emptyCellText` | `string \| (option) => string` | Text for empty cells |
| `rowClassName` | `(row, i) => string` | Row className callback |
| `colKey` | `string` | Column unique key field. Default: 'dataIndex' |

## Expose Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `scrollTo` | `(top?, left?) \| (options: ScrollToOptions)` | Scroll to position. Options: `{ top?, left?, behavior? }` where each axis accepts pixel or `{ index?, key?, px? }` |
| `setHighlightDimRow` | `(rowKeys: UniqKey[], option?)` | Highlight row with fade animation. option: `{ method?, className?, keyframe?, duration? }` |
| `setHighlightDimCell` | `(rowKey, colKey, option?)` | Highlight cell with fade animation |
| `setCurrentRow` | `(rowKeyOrRow?, option?)` | Select a row. option: `{ silent?, deep? }` |
| `setSelectedCell` | `(row?, col?, option?)` | Select a cell (cellActive=true). option: `{ silent? }` |
| `setSorter` | `(colKey, order, option?)` | Set sort state. order: 'asc'\|'desc'\|null. option: `{ sort?, silent?, force?, sortOption? }` |
| `resetSorter` | `()` | Reset sort state |
| `setTreeExpand` | `(row, option?)` | Expand/collapse tree node. option: `{ expand?, all?, level?, parents? }` |
| `setRowExpand` | `(rowKeyOrRow, expand?, data?)` | Expand/collapse row. data: `{ col?, silent? }` |
| `getTableData` | `()` | Get sorted table data array |
| `getRowIndex` | `(rowKeyOrRow) => number` | Get row index (-1 if not found) |
| `getColumnIndex` | `(colKeyOrCol) => number` | Get column index (-1 if not found) |
| `initVirtualScroll` | `(height?)` | Recalculate virtual viewport |
| `initVirtualScrollX` | `()` | Recalculate horizontal virtual viewport |
| `initVirtualScrollY` | `(height?)` | Recalculate vertical virtual viewport |
| `setAutoHeight` | `(rowKey, height?)` | Set variable row height |
| `clearAllAutoHeight` | `()` | Clear all variable row heights |
| `clearMergeCellsCache` | `()` | Clear merge cells cache (needed after in-place data mutation) |
| `setAreaSelection` | `(ranges, option?)` | Set selection ranges. option: `{ silent?, scrollToView? }` |
| `getSelectedArea` | `()` | Get selected area: `{ rows, cols, ranges }` |
| `clearSelectedArea` | `()` | Clear selection |
| `copySelectedArea` | `() => string` | Copy selection as TSV text |
| `setFilter` | `(status \| null, option?)` | Set filter. option: `{ remote?, silent? }` |
| `getSortColumns` | `()` | Get sort columns: `{ key, order }[]` |

### scrollTo Usage

```ts
// Pixel coordinates
tableRef.value.scrollTo(100, 200)        // top=100, left=200
tableRef.value.scrollTo(null, 200)       // only change left

// Options overload (omitted axis = no change)
tableRef.value.scrollTo({ top: 100, left: 200 })
tableRef.value.scrollTo({ top: { index: 5 } })                    // scroll to 5th row
tableRef.value.scrollTo({ top: { key: 'row-42' } })               // scroll to row by key
tableRef.value.scrollTo({ top: { index: 5, px: 10 } })            // row + offset
tableRef.value.scrollTo({ left: { key: 'name' }, behavior: 'smooth' }) // smooth scroll to column
```

## Events

| Event | Callback Signature | Description |
|-------|-------------------|-------------|
| `sort-change` | `(col, order, data, sortConfig)` | Sort changed |
| `row-click` | `(ev, row, { rowIndex })` | Row click |
| `row-dblclick` | `(ev, row, { rowIndex })` | Row double click |
| `current-change` | `(ev, row \| undefined, { select })` | Row selection changed |
| `cell-click` | `(ev, row, col, { rowIndex })` | Cell click |
| `cell-selected` | `(ev, { select, row, col })` | Cell selection changed |
| `header-cell-click` | `(ev, col)` | Header cell click |
| `row-menu` | `(ev, row, { rowIndex })` | Row right click |
| `header-row-menu` | `(ev)` | Header right click |
| `scroll` | `(ev, { startIndex, endIndex })` | Table scroll |
| `scroll-x` | `(ev)` | Horizontal scroll |
| `col-order-change` | `(dragStartKey, targetColKey)` | Column drag reorder |
| `col-resize` | `(col)` | Column width changed |
| `row-order-change` | `(dragStartKey, targetRowKey)` | Row drag reorder |
| `toggle-row-expand` | `({ expanded, row, col })` | Row expand/collapse |
| `toggle-tree-expand` | `({ expanded, row, col })` | Tree expand/collapse |
| `area-selection-change` | `(ranges)` | Selection changed |
| `filter-change` | `(status)` | Filter changed |
| `update:columns` | `(cols)` | v-model:columns update (col resize) |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `tableHeader` | `{ col }` | Custom header (prefer customHeaderCell for single column) |
| `empty` | -- | Empty data state |
| `expand` | `{ col, row }` | Expand row content |
| `customBottom` | -- | Table bottom area (use IntersectionObserver for infinite scroll) |

## Custom Cells

Use `customCell` to render custom cell content:

```vue
<script setup>
import { defineComponent, h } from 'vue'

// Functional component (simplest)
const columns = [{
  dataIndex: 'name',
  customCell: (props) => h('span', { style: { color: 'red' } }, props.cellValue)
}]

// Or use defineComponent for reactive cells
const columns2 = [{
  dataIndex: 'status',
  customCell: defineComponent({
    setup(props) {
      // props: { row, col, cellValue, rowIndex, colIndex, expanded?, treeExpanded? }
      return () => h('span', props.cellValue > 0 ? 'Active' : 'Inactive')
    }
  })
}]
</script>
```

## Built-in Custom Cells

```ts
import { createFilterCell } from 'stk-table-vue'
import { createEditableCell } from 'stk-table-vue'
import { createCheckboxCell } from 'stk-table-vue'
import { createNumberCell } from 'stk-table-vue'
import { createChangeCell } from 'stk-table-vue'
import { formatNumber } from 'stk-table-vue'
```

## Common Patterns

For detailed code examples, see [examples.md](./examples.md):
- Virtual scroll with large data
- Fixed columns & header
- Sorting (single/multi/remote)
- Tree table
- Expand rows
- Cell highlighting
- Area selection + keyboard navigation
- Column resize + drag
- Merge cells
- Variable row height

## Additional Resources

- Full API reference: [api-reference.md](./api-reference.md)
- Official documentation: https://ja-plus.github.io/stk-table-vue/
- GitHub: https://github.com/ja-plus/stk-table-vue
- Online Demo: https://stackblitz.com/edit/vitejs-vite-ad91hh?file=src%2FDemo%2Findex.vue
