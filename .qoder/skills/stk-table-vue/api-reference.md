# Stk Table Vue - API Reference

Complete API reference for stk-table-vue component.

## Props

### Layout & Appearance

```ts
// Table dimensions
width?: string                    // Table width
height?: string                   // Table height (required for virtual scroll)

// Visual style
theme?: 'light' | 'dark'         // Theme. Default: none
stripe?: boolean                  // Zebra stripes
bordered?: boolean | 'h' | 'v' | 'body-v' | 'body-h'  // Borders. Default: true (both)
fixedMode?: boolean               // Use table-layout: fixed
headless?: boolean                // Hide header
fixedColShadow?: boolean          // Show shadow on fixed columns. Default: false
noDataFull?: boolean              // Empty state fills container height
showNoData?: boolean              // Show "no data" placeholder

// Overflow text
showOverflow?: boolean            // Ellipsis for cell overflow
showHeaderOverflow?: boolean      // Ellipsis for header overflow
emptyCellText?: string | ((option: { row: DT; col: StkTableColumn<DT> }) => string)
```

### Data

```ts
columns?: StkTableColumn<DT>[]    // Column config. Shallow watch - update reference on mutation
dataSource?: DT[]                 // Row data. Shallow watch
rowKey?: string | ((row: DT) => UniqKey)  // Row unique key. Required
colKey?: string                   // Column unique key field. Default: 'dataIndex'
footerData?: DT[]                 // Footer summary rows
```

### Row Behavior

```ts
rowHeight?: number                // Row height (px). With autoRowHeight: estimated height
autoRowHeight?: boolean | { expectedHeight?: number | ((row: DT) => number) }
rowHover?: boolean                // Highlight row on hover
rowActive?: boolean | {
  enabled?: boolean               // Default: true
  disabled?: (row: DT) => boolean // Disable selection for specific rows
  revokable?: boolean             // Click again to deselect. Default: true
}
rowClassName?: (row: DT, index: number) => string
headerRowHeight?: number | null   // Default: rowHeight
footerRowHeight?: number | string | null  // Default: rowHeight
```

### Cell Behavior

```ts
cellHover?: boolean               // Highlight cell on hover
cellActive?: boolean              // Enable cell selection
selectedCellRevokable?: boolean   // Click again to deselect cell
```

### Virtual Scroll

```ts
virtual?: boolean                 // Enable vertical virtual scroll
virtualX?: boolean                // Enable horizontal virtual scroll (requires column widths)
autoResize?: boolean | (() => void)  // Auto recalculate viewport on resize. Default: true
smoothScroll?: boolean            // Smooth scroll behavior
scrollRowByRow?: boolean | 'scrollbar'  // Integer row scrolling
scrollbar?: boolean | {
  enabled?: boolean
  width?: number                  // Vertical scrollbar width. Default: 8
  height?: number                 // Horizontal scrollbar height. Default: 8
  minWidth?: number               // Thumb min width. Default: 20
  minHeight?: number              // Thumb min height. Default: 20
}
```

### Sorting

```ts
sortRemote?: boolean              // Server-side sort (skip local sort)
sortConfig?: {
  emptyToBottom?: boolean         // Empty values sort to bottom
  defaultSort?: {
    key?: string                  // Column key (respects colKey)
    dataIndex: string             // Column dataIndex
    order: 'asc' | 'desc' | null
    sortField?: string            // Sort by different field
    sortType?: 'number' | 'string'
    sorter?: Sorter<DT>
    silent?: boolean              // Suppress sort-change event. Default: false
  }
  stringLocaleCompare?: boolean   // Use localeCompare for strings. Default: true
  sortChildren?: boolean          // Sort tree children too. Default: false
  multiSort?: boolean             // Enable multi-column sort. Default: false
  multiSortLimit?: number         // Max sort columns. Default: 3
}
```

### Interaction

```ts
colResizable?: boolean | {
  disabled?: (col: StkTableColumn<DT>) => boolean
}
colMinWidth?: number              // Min width when resizing

headerDrag?: boolean | {
  mode?: 'none' | 'insert' | 'swap'  // Default: 'insert'
  disabled?: (col: StkTableColumn<DT>) => boolean
}

areaSelection?: boolean | {
  enabled?: boolean               // Default: true
  keyboard?: boolean              // Arrow key navigation. Default: false
  ctrl?: boolean                  // Ctrl multi-select. Default: true
  shift?: boolean                 // Shift range select. Default: true
  formatCellForClipboard?: (row, col, rawValue) => string
  highlight?: {
    cell?: boolean                // Default: true
    row?: boolean                 // Default: false
  }
}

dragRowConfig?: {
  mode?: 'none' | 'insert' | 'swap'
}
```

### Tree Table

```ts
treeConfig?: {
  defaultExpandAll?: boolean
  defaultExpandKeys?: UniqKey[]
  defaultExpandLevel?: number
}
```

### Expand Row

```ts
expandConfig?: {
  height?: number                 // Expand row height (virtual mode)
}
```

### Highlight

```ts
highlightConfig?: {
  duration?: number               // Highlight duration in seconds
  fps?: number                    // Animation frame rate
}
```

### Sequence Column

```ts
seqConfig?: {
  startIndex?: number             // Starting index (for pagination). Default: 0
}
```

### Other

```ts
hideHeaderTitle?: boolean | string[]  // Hide header title tooltip
optimizeVue2Scroll?: boolean      // Vue 2.7 scroll optimization
cellFixedMode?: 'sticky' | 'relative'  // Fixed column implementation. Default: 'sticky'
experimental?: {
  scrollY?: boolean               // Use transform for scroll simulation
}
```

---

## Events

```ts
// Row events
(e: 'row-click', ev: MouseEvent, row: DT, data: { rowIndex: number }): void
(e: 'row-dblclick', ev: MouseEvent, row: DT, data: { rowIndex: number }): void
(e: 'row-menu', ev: MouseEvent, row: DT, data: { rowIndex: number }): void
(e: 'current-change', ev: MouseEvent | null, row: DT | undefined, data: { select: boolean }): void

// Cell events
(e: 'cell-click', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void
(e: 'cell-selected', ev: MouseEvent | null, data: { select: boolean; row: DT | undefined; col: StkTableColumn<DT> | undefined }): void
(e: 'cell-mouseenter', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void
(e: 'cell-mouseleave', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void
(e: 'cell-mouseover', ev: MouseEvent, row: DT, col: StkTableColumn<DT>): void
(e: 'cell-mousedown', ev: MouseEvent, row: DT, col: StkTableColumn<DT>, data: { rowIndex: number }): void

// Header events
(e: 'header-cell-click', ev: MouseEvent, col: StkTableColumn<DT>): void
(e: 'header-row-menu', ev: MouseEvent): void

// Sort events
(e: 'sort-change', col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>): void

// Scroll events
(e: 'scroll', ev: Event, data: { startIndex: number; endIndex: number }): void
(e: 'scroll-x', ev: Event): void

// Column events
(e: 'col-order-change', dragStartKey: string, targetColKey: string): void
(e: 'col-resize', col: StkTableColumn<DT>): void
(e: 'th-drag-start', dragStartKey: string): void
(e: 'th-drop', targetColKey: string): void
(e: 'update:columns', cols: StkTableColumn<DT>[]): void

// Row drag events
(e: 'row-order-change', dragStartKey: string, targetRowKey: string): void

// Expand events
(e: 'toggle-row-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void
(e: 'toggle-tree-expand', data: { expanded: boolean; row: DT; col: StkTableColumn<DT> | null }): void

// Selection events
(e: 'area-selection-change', ranges: AreaSelectionRange[]): void

// Filter events
(e: 'filter-change', status: Record<UniqKey, FilterStatus>): void
```

---

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `tableHeader` | `{ col: StkTableColumn }` | Custom header cell. Prefer `customHeaderCell` prop for single columns |
| `empty` | -- | Empty data state content |
| `expand` | `{ col: StkTableColumn, row: DT }` | Expand row content |
| `customBottom` | -- | Content at table bottom (for infinite scroll trigger) |

---

## Expose Methods (Full Signatures)

### initVirtualScroll

```ts
initVirtualScroll(height?: number): void
// Initialize virtual scroll viewport. Called automatically when autoResize=true and size changes.
// height: virtual scroll height. Default: container height
```

### initVirtualScrollX / initVirtualScrollY

```ts
initVirtualScrollX(): void
initVirtualScrollY(height?: number): void
```

### scrollTo

```ts
// Number overload: null = no change for that axis, omitted = 0
scrollTo(top?: number | null, left?: number | null): void

// Options overload: omitted axis = no change
scrollTo(options: ScrollToOptions): void

interface ScrollToOptions {
  top?: number | ScrollAxisTarget
  left?: number | ScrollAxisTarget
  behavior?: 'auto' | 'smooth'
}

interface ScrollAxisTarget {
  index?: number    // Row/column index (0-based). Priority over key
  key?: string | number  // Row key or column dataIndex
  px?: number       // Pixel offset from target
}
```

### setHighlightDimRow

```ts
setHighlightDimRow(
  rowKeyValues: UniqKey[],
  option?: {
    method?: 'css' | 'animation' | 'js'  // Default: 'animation'
    className?: string      // Custom CSS class (for method: 'css')
    keyframe?: Keyframe[]   // Custom animation keyframes
    duration?: number       // Animation duration (ms)
  }
): void
```

### setHighlightDimCell

```ts
setHighlightDimCell(
  rowKeyValue: UniqKey,
  colKeyValue: string,
  option?: {
    method?: 'css' | 'animation'
    className?: string
    keyframe?: Keyframe[]
    duration?: number
  }
): void
```

### setCurrentRow

```ts
setCurrentRow(
  rowKeyOrRow: string | undefined | DT,
  option?: {
    silent?: boolean   // Don't trigger @current-change. Default: false
    deep?: boolean     // Recursively select children. Default: false
  }
): void
```

### setSelectedCell

```ts
setSelectedCell(
  row?: DT,
  col?: StkTableColumn<DT>,
  option?: { silent?: boolean }
): void
// Requires props.cellActive = true
```

### setSorter

```ts
setSorter(
  colKey: string,
  order: 'asc' | 'desc' | null,
  option?: {
    sortOption?: SortOption<DT>  // Override sort config (useful for hidden columns)
    force?: boolean              // Force sort even if sortRemote=true. Default: true
    silent?: boolean             // Don't trigger @sort-change. Default: true
    sort?: boolean               // Whether to sort. Default: true
  }
): DT[]
```

### resetSorter

```ts
resetSorter(): void
```

### setTreeExpand

```ts
setTreeExpand(
  row: (UniqKey | DT) | (UniqKey | DT)[],
  option?: {
    expand?: boolean    // true=expand, false=collapse, undefined=toggle
    all?: boolean       // Expand all descendants
    level?: number      // Expand to specific depth
    parents?: boolean   // Treat row as target, expand/collapse all its ancestors
  }
): void
```

### setRowExpand

```ts
setRowExpand(
  rowKeyOrRow: string | undefined | DT,
  expand?: boolean,
  data?: {
    col?: StkTableColumn<DT>
    silent?: boolean    // Don't trigger @toggle-row-expand
  }
): void
```

### getTableData

```ts
getTableData(): DT[]
// Returns current data in sort order
```

### getRowIndex / getColumnIndex

```ts
getRowIndex(row: UniqKey | DT): number    // -1 if not found
getColumnIndex(col: string | StkTableColumn<DT>): number  // -1 if not found
```

### setAutoHeight / clearAllAutoHeight

```ts
setAutoHeight(rowKey: UniqKey, height?: number | null): void
// Set cached height for a row in autoRowHeight mode. Takes effect immediately.

clearAllAutoHeight(): void
// Clear all cached row heights. Heights revert to estimated values.
```

### clearMergeCellsCache

```ts
clearMergeCellsCache(): void
// Call after in-place mutation of row data that affects mergeCells results.
// Not needed when replacing dataSource with a new array reference.
```

### setAreaSelection / getSelectedArea / clearSelectedArea / copySelectedArea

```ts
setAreaSelection(
  ranges: AreaSelectionRange[],
  option?: { silent?: boolean; scrollToView?: boolean }
): void

getSelectedArea(): {
  rows: DT[]
  cols: StkTableColumn<DT>[]
  ranges: AreaSelectionRange[]
}

clearSelectedArea(): void

copySelectedArea(): string  // Returns TSV text
```

### setFilter

```ts
setFilter(
  status: Record<UniqKey, FilterStatus> | null,
  option?: {
    remote?: boolean   // Don't auto-filter (for server-side filtering)
    silent?: boolean   // Don't trigger @filter-change
  }
): void
// Pass null to clear all filters
```

### getSortColumns

```ts
getSortColumns(): { key: string; order: Order }[]
```

---

## Types

### StkTableColumn

```ts
type StkTableColumn<T extends Record<string, any>> = {
  key?: any
  type?: 'seq' | 'expand' | 'dragRow' | 'tree-node'
  dataIndex: keyof T & string
  title?: string
  align?: 'right' | 'left' | 'center'
  headerAlign?: 'right' | 'left' | 'center'
  sorter?: boolean | ((data: T[], option: { order: Order; column: any }) => T[])
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  headerClassName?: string
  className?: string
  sortField?: keyof T
  sortType?: 'number' | 'string'
  sortConfig?: Omit<SortConfig<T>, 'defaultSort'>
  fixed?: 'left' | 'right' | null
  hidden?: boolean
  customCell?: CustomCell<CustomCellProps<T>, T>
  customHeaderCell?: CustomCell<CustomHeaderCellProps<T>, T>
  customFooterCell?: CustomCell<CustomFooterCellProps<T>, T>
  children?: StkTableColumn<T>[]
  mergeCells?: MergeCellsFn<T>
}
```

### CustomCell Props

```ts
// customCell receives these props:
type CustomCellProps<T> = {
  row: T
  col: StkTableColumn<T>
  cellValue: any          // row[col.dataIndex]
  rowIndex: number
  colIndex: number
  expanded?: ColumnConfig | null   // null = not expanded
  treeExpanded?: boolean
}

// customHeaderCell receives:
type CustomHeaderCellProps<T> = {
  col: StkTableColumn<T>
  rowIndex: number
  colIndex: number
}

// customFooterCell receives:
type CustomFooterCellProps<T> = {
  col: StkTableColumn<T>
  row: T
  cellValue: any
  rowIndex: number
  colIndex: number
}
```

### MergeCellsFn

```ts
type MergeCellsFn<T> = (data: {
  row: T
  col: StkTableColumn<T>
  rowIndex: number
  colIndex: number
}) => { rowspan?: number; colspan?: number } | undefined
```

### AreaSelectionRange

```ts
type AreaSelectionRange = {
  index: {
    x: [number, number]        // [startCol, endCol] @deprecated
    y: [number, number]        // [startRow, endRow] @deprecated
    begin: { row: number; col: number }
    end: { row: number; col: number }
  }
}
```

### SortConfig

```ts
type SortConfig<T> = {
  emptyToBottom?: boolean
  defaultSort?: {
    key?: string
    dataIndex: string
    order: 'asc' | 'desc' | null
    sortField?: string
    sortType?: 'number' | 'string'
    sorter?: Sorter<T>
    silent?: boolean
  }
  stringLocaleCompare?: boolean
  sortChildren?: boolean
  multiSort?: boolean
  multiSortLimit?: number
}
```

### Utility Types

```ts
type UniqKey = string | number
type Order = 'asc' | 'desc' | null
type SortOption<T> = Pick<StkTableColumn<T>, 'sorter' | 'dataIndex' | 'sortField' | 'sortType'>
type SortState<T> = Pick<StkTableColumn<T>, 'key' | 'dataIndex' | 'sortField' | 'sortType'> & { order: Order }
```
