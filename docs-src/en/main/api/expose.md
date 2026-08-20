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

### clearMergeCellsCache
Clears the cached `mergeCells` results and forces the merge results to be recalculated.

The merge result cache is only cleared automatically when `dataSource` / `columns` change. If you **mutate** row fields in place (the row object reference stays the same, e.g. directly modifying a reactive row object) and the return value of `mergeCells` depends on these fields, you must call this method after the mutation; otherwise rowspan/colspan will still use the stale cached result.

```ts
/**
 * Clear the mergeCells result cache and force recalculation of merge results
 */
clearMergeCellsCache()
```

```ts
// After mutating row fields in place, manually invalidate the merge cache
row.rowspan = { continent: 3 };
nextTick(() => {
    tableRef.value.clearMergeCellsCache();
});
```

::: tip
If you update data by replacing `dataSource` (passing a new array), you don't need to call this method, as the cache will be cleared automatically.
:::

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

### sortStates
Multi-column sort states array.

```ts
/**
 * Sort states array
 * @see SortState[]
 */
sortStates: SortState[];
```

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
Scroll to specified position. Two call forms are supported: the numeric overload (backward compatible) and the options overload (with row/column targeting).

```ts
/**
 * Set scrollbar position
 * - Numeric overload: top/left are pixel coordinates, null keeps the axis unchanged, omitted defaults to 0
 * - Options overload: each axis accepts a pixel number or an { index, key, px } target, omitted axes keep their position
 */
function scrollTo(top?: number | null, left?: number | null): void;
function scrollTo(options: ScrollToOptions): void;

interface ScrollToOptions {
    /** Vertical target: pixel coordinate or row target */
    top?: number | ScrollAxisTarget;
    /** Horizontal target: pixel coordinate or column target */
    left?: number | ScrollAxisTarget;
    /** Scroll behavior, same as native ScrollToOptions.behavior, default 'auto' (jump immediately) */
    behavior?: ScrollBehavior;
}

interface ScrollAxisTarget {
    /** Target index (0-based). Takes precedence over key when both are given */
    index?: number;
    /** Target key: row key (rowKey) for the top axis; column dataIndex for the left axis */
    key?: string | number;
    /** Extra pixel offset added to the base offset, may be negative. Base is 0 when only px is given */
    px?: number;
}
```

* Index space: the `top` axis `index` is the row index in the current display order (after sorting/filtering/tree expansion); the `left` axis `index` is the leaf column (deepest header level) index.
* When a target cannot be resolved (index out of range / key not found), that axis is silently skipped and its position is unchanged.
* With `behavior: 'smooth'` the table animates to the target position; a new `scrollTo` call cancels an in-progress animation, as does wheel/touch interaction.

::: tip
The two overloads treat "omitted" differently:
* Options overload: an omitted axis **keeps** its current position, `scrollTo({})` performs no scrolling;
* Numeric overload: an omitted parameter defaults to **0**, so `scrollTo()` scrolls to the top-left corner.
:::

```js
// Numeric overload (backward compatible)
stkTableRef.value.scrollTo(100, 200);
stkTableRef.value.scrollTo(null, 200); // change horizontal only

// Options overload: pixel coordinates
stkTableRef.value.scrollTo({ top: 100, left: 200 });

// Scroll to row 5 (0-based)
stkTableRef.value.scrollTo({ top: { index: 5 } });

// Scroll to the row whose rowKey is 'row-42'
stkTableRef.value.scrollTo({ top: { key: 'row-42' } });

// Scroll to row 5 plus a 10px offset
stkTableRef.value.scrollTo({ top: { index: 5, px: 10 } });

// Target both axes with smooth scrolling (column targeted by dataIndex)
stkTableRef.value.scrollTo({ top: { index: 5 }, left: { key: 'name' }, behavior: 'smooth' });
```

### getTableData
Get table data, returns array in current table sort order

### getRowIndex
Get row index based on rowKey

```ts
/**
 * Get row index
 * @param row rowKey or row data
 * @returns Row index, returns -1 if not found
 */
function getRowIndex(row: UniqKey | DT): number
```

### getColumnIndex
Get column index based on colKey

```ts
/**
 * Get column index
 * @param col colKey or column object
 * @returns Column index, returns -1 if not found
 */
function getColumnIndex(col: string | StkTableColumn<DT>): number
```

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

::: tip Timing semantics
Takes effect immediately: the height immediately participates in scroll positioning and content height (scrollHeight) calculation, without waiting for the next render measurement. If the rowKey does not exist in the current data, the height is only stored and does not affect current positioning or total height.
:::

### clearAllAutoHeight
Clear all heights saved by auto-row-height. After clearing, row heights fall back to estimated values (`expectedHeight` / `rowHeight`), and the content height is recalculated accordingly.

### setTreeExpand
Set tree structure expanded row
```ts
/**
 * @param row rowKey / row / or an array of them
 * @param option.expand Whether to expand, if not provided, it will toggle based on current state
 * @param option.all Whether to expand all descendants, default false
 * @param option.level Expand to the nth level
 * @param option.parents Treat the given row as a target child, expand/collapse all its ancestors. The target row itself is also expanded when expanding if it has children. Only a single rowKey / row is supported
 */
function setTreeExpand(row: (UniqKey | DT) | (UniqKey | DT)[], option?: { expand?: boolean; all?: boolean; level?: number; parents?: boolean })
```
::: tip
When `option.parents` is `true`, passing the rowKey of a deep child node will automatically expand all its ancestors to make the row visible, and the row itself is also expanded if it has children (e.g. locating a row). If a filter currently excludes one of the ancestors, the expansion will stop there.
:::

- `option.all` <Badge type="tip" text="^1.0.4" />
- `option.level` <Badge type="tip" text="^1.0.4" />
- `option.parents` <Badge type="tip" text="^1.1.0" />

### getSelectedArea
Get selected cells information

```ts
function getSelectedArea(): {
    rows: DT[];
    cols: StkTableColumn<DT>[];
    ranges: AreaSelectionRange[]
}
```

### setAreaSelection
Set drag selection range

```ts
/**
 * Set drag selection range
 * @param ranges Selection range array
 * @param option.silent Set to true to not trigger `@select-area-change`. Default: false
 * @param option.scrollToView Set to true to auto scroll to the selection. Default: false
 */
function setAreaSelection(ranges: AreaSelectionRange[], option?: { silent?: boolean; scrollToView?: boolean })
```

### clearSelectedArea
Clear selected cells

### copySelectedArea
Copy selected area content to clipboard. Returns the copied text content (TSV format).

```ts
function copySelectedArea(): string
```

### setFilter(Beta)
Set filter status(Beta). Triggers the `filter-change` event after setting.

```ts
/**
 * Set filter status
 * @param status Filter status object, pass null to clear all filters
 * @param option.remote Set to true to skip automatic data filtering, suitable for remote filtering scenarios
 * @param option.silent Set to true to not trigger `filter-change` event, default false
 */
function setFilter(status: Record<UniqKey, FilterStatus> | null, option?: { remote?: boolean; silent?: boolean })
```

