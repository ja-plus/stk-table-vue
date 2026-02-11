# Expose 

## API
### initVirtualScroll
Initializes the number of rows and columns in the visible area of the virtual list. Equivalent to calling both `initVirtualScrollX` and `initVirtualScrollY`.

The table's `props.autoResize` is `true` by default, so this function is automatically called when the width or height changes.

You can also call this function to recalculate the visible area of the virtual list manually. For example, call it after the mouse up event when the user manually drags to adjust the width or height.

If the height parameter is not provided, it defaults to the height of the table container. If you want to render more rows, you can add the height of several rows after obtaining the container height.


```ts
/**
 * Initialize virtual scroll parameters
 * @param {number} [height] Virtual scroll height
 */
initVirtualScroll(height?: number)
```

### initVirtualScrollX
Initializes the number of columns for horizontal virtual scrolling.

```ts
/**
 * Initialize horizontal virtual scroll parameters
 */
initVirtualScrollX()
```

### initVirtualScrollY
Initializes the number of rows for vertical virtual scrolling.

```ts
/**
 * Initialize vertical virtual scroll parameters
 * @param {number} [height] Virtual scroll height
 */
initVirtualScrollY(height?: number)
```

### setCurrentRow
Sets the currently selected row.

```ts
/**
 * Select a row
 * @param {string} rowKeyOrRow Selected rowKey, undefined to deselect
 * @param {boolean} option.silent Set to true to not trigger `@current-change`. Default: false
 * @param {boolean} option.deep Set to true to recursively select child rows. Default: false
 */
function setCurrentRow(rowKeyOrRow: string | undefined | DT, option = { silent: false, deep: false })
```

### setSelectedCell
Sets the currently selected cell (effective when props.cellActive=true).

```ts
/**
 * Set the currently selected cell (props.cellActive=true)
 * @param row Set highlighted cell, undefined to clear selection
 * @param col Column object
 * @param option.silent Set to true to not trigger `@current-change`. Default: false
 */
function setSelectedCell(row?: DT, col?: StkTableColumn<DT>, option = { silent: false })
```

### setHighlightDimCell

Sets a highlighted and dimmed cell.

```ts
/**
 * Highlight a cell. Virtual scroll highlight state memory is not supported yet.
 * @param rowKeyValue Key of a row
 * @param colKeyValue Column key
 * @param options.method css-use CSS rendering, animation-use animation api. Default: animation;
 * @param option.className Custom CSS animation class.
 * @param option.keyframe If custom keyframe is provided, highlightConfig.fps will be invalid. Keyframe: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
 * @param option.duration Animation duration. In 'css' method state, it's used to remove the class. If className is provided, it should match the custom animation time.
 */
function setHighlightDimCell(rowKeyValue: UniqKey, colKeyValue: string, option: HighlightDimCellOption = {})
```

### setHighlightDimRow
Sets highlighted and dimmed rows.

```ts
/**
 * Highlight rows
 * @param rowKeyValues Array of unique row keys
 * @param option.method css-use CSS rendering, animation-use animation api. Default: animation
 * @param option.className Custom CSS animation class.
 * @param option.keyframe If custom keyframe is provided, highlightConfig.fps will be invalid. Keyframe: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
 * @param option.duration Animation duration. In 'css' method state, it's used to remove the class. If className is provided, it should match the custom animation time.
 */
function setHighlightDimRow(rowKeyValues: UniqKey[], option: HighlightDimRowOption = {})
```

### sortCol
Table sort column dataIndex

### getSortColumns
Get sort column information `{key:string,order:Order}[]`

### setSorter
```ts
/**
 * Set table header sort state.
 * @param colKey Column unique key field. If you want to cancel the sort state, please use `resetSorter`
 * @param order Sort order 'asc'|'desc'|null
 * @param option.sortOption Specify sort parameters. Same as sort-related fields in StkTableColumn. It is recommended to find it from columns.
 * @param option.sort Whether to trigger sorting - default: true
 * @param option.silent Whether to suppress triggering callbacks - default: true
 * @param option.force Whether to force triggering sorting - default: true
 * @returns Returns current table data
 */
function setSorter(
    colKey: string, 
    order: Order,
    option: { 
        sortOption?: SortOption<DT>; 
        force?: boolean; 
        silent?: boolean; 
        sort?: boolean 
    } = {}
): DT[];
```

* When `option.force` is true, sorting will be triggered even if `props.sortRemote` is true.
* When `option.silent` is true, the `@sort-change` callback will not be triggered.
* The role of `option.sortOption` is that if the passed `colKey` is not in `columns`, you can specify sorting parameters. This is useful when hiding a column but still wanting to sort by that column's field.
    - Highest priority; if this is configured, it will not use `colKey` to find the corresponding column for sorting.

### resetSorter
Reset sort state

### scrollTo
Scroll to specified position

```ts
/**
 * Set scrollbar position
 * @param top Set to null to not change position
 * @param left Set to null to not change position
 */
function scrollTo(top: number | null = 0, left: number | null = 0) 
```

### getTableData
Get table data, returns array in current table sort order

### setRowExpand
Set expanded row

```ts
/**
 *
 * @param rowKeyOrRow rowKey or row
 * @param expand Whether to expand
 * @param data { col?: StkTableColumn<DT> }
 * @param data.silent Set to true to not trigger `@toggle-row-expand`. Default: false
 */
function setRowExpand(rowKeyOrRow: string | undefined | DT, expand?: boolean, data?: { col?: StkTableColumn<DT>; silent?: boolean })
```

### setAutoHeight
In variable row height virtual list, sets the height saved by auto-row-height for specified rows. If row height changes, you can call this method to clear or change the row height
```ts
function setAutoHeight(rowKey: UniqKey, height?: number | null)
```

### clearAllAutoHeight
Clear all heights saved by auto-row-height

### setTreeExpand
Set tree structure expanded row
```ts
/**
 * @param row rowKey or row or row
 * @param option.expand If not provided, it will toggle based on current state
 */
function setTreeExpand(row: (UniqKey | DT) | (UniqKey | DT)[], option?: { expand?: boolean })
```

### getSelectedArea 
Get selected cells information

```ts
function getSelectedArea(): {
    rows: DT[];
    cols: StkTableColumn<DT>[];
    range: AreaSelectionRange
}
```

### clearSelectedArea
Clear selected cells
