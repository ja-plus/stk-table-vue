# Table Props
```ts
<StkTable
  ...[props]
/>
```
## API

### width

Table width

```ts
width?: string;
```

### minWidth

Minimum table width @deprecated 0.9.1 Use css selector `.stk-table-main` to set

```ts
minWidth?: string;
```

### maxWidth

Maximum table width @deprecated 0.9.1 Use css selector `.stk-table-main` to set

```ts
maxWidth?: string;
```

### stripe

Zebra stripes

```ts
stripe?: boolean;
```

### fixedMode

Whether to use table-layout:fixed

```ts
fixedMode?: boolean;
```

### headless

Whether to hide table header

```ts
headless?: boolean;
```

### theme

Theme, light or dark

```ts
theme?: 'light' | 'dark';
```

### rowHeight

Row height
- When `props.autoRowHeight` is `true`, this represents the expected row height for calculation. It no longer affects the actual row height.

```ts
rowHeight?: number;
```

### autoRowHeight

Whether to use variable row height
- When set to `true`, `props.rowHeight` represents the expected row height for calculation. It no longer affects the actual row height.

```ts
autoRowHeight?: boolean | {
  /** Estimated row height (higher priority than rowHeight) */
  expectedHeight?: number | ((row: DT) => number);
};
```

### rowHover

Whether to highlight the row on mouse hover

```ts
rowHover?: boolean;
```

### rowActive

Whether to highlight the selected row

```ts
rowActive?: boolean | {
  /** Whether to enable row selection function default: true */
  enabled?: boolean;
  /** Whether to disable row selection default: () => false */
  disabled?: (row: DT) => boolean;
  /** Whether selection can be revoked default: true */
  revokable?: boolean;
};
```

### headerRowHeight

Header row height. default = rowHeight

```ts
headerRowHeight?: number | null;
```

### footerRowHeight

Footer row height. default = rowHeight

```ts
footerRowHeight?: number | string | null;
```

### virtual

Virtual scrolling

```ts
virtual?: boolean;
```

### virtualX

Horizontal virtual scrolling (must set column width)

```ts
virtualX?: boolean;
```

### columns

Table column configuration

Shallow listen, please modify the reference when changed

```ts
columns?: StkTableColumn<any>[];
```

### dataSource

Data source

Shallow listen, please modify the reference when changed

```ts
dataSource?: any[];
```

### rowKey

Row unique key (row unique value cannot be undefined)

```ts
rowKey?: UniqKeyProp;
```

### colKey

Column unique key. Default is `dataIndex`

```ts
colKey?: UniqKeyProp;
```

### emptyCellText

Empty cell display text

```ts
emptyCellText?: string | ((option: { row: DT; col: StkTableColumn<DT> }) => string);
```

### noDataFull

Whether the fallback height for no data fills the container

```ts
noDataFull?: boolean;
```

### showNoData

Whether to show no data message

```ts
showNoData?: boolean;
```

### sortRemote

Whether to use server-side sorting, true means not sorting data

```ts
sortRemote?: boolean;
```

### showHeaderOverflow

Whether header content overflows with ellipsis

```ts
showHeaderOverflow?: boolean;
```

### showOverflow

Whether body content overflows with ellipsis

```ts
showOverflow?: boolean;
```

### showTrHoverClass

Whether to add row hover class

```ts
showTrHoverClass?: boolean;
```

### cellHover

Whether to highlight the cell on mouse hover

```ts
cellHover?: boolean;
```

### cellActive

Whether to highlight the selected cell

```ts
cellActive?: boolean;
```

### selectedCellRevokable

Whether clicking the cell again can deselect it (cellActive=true)

```ts
selectedCellRevokable?: boolean;
```

### areaSelection

Whether to enable cell range selection (drag selection)

```ts
areaSelection?: boolean | {
  /**
   * Custom cell text formatter for clipboard copy.
   * If you use customCell to render cells, you should provide this callback to ensure the copied text matches the displayed content.
   * @param row Row data
   * @param col Column configuration
   * @param rawValue row[col.dataIndex] raw value
   * @returns Text to be copied to clipboard
   */
  formatCellForClipboard?: (row: DT, col: StkTableColumn<DT>, rawValue: any) => string;
  /**
   * Whether to enable keyboard control for selection area.
   * When enabled, arrow keys / Tab / Shift+Tab can control selection area movement, similar to Excel behavior.
   * When this feature is enabled, the original keyboard scrolling behavior will be disabled.
   * @default false
   */
  keyboard?: boolean;
};
```

### rowDragSelection

Enable mouse drag row selection

```ts
rowDragSelection?: boolean | {
  /** default: true */
  enabled?: boolean;
};
```

### headerDrag

Whether header can be dragged. Supports callback function.

```ts
headerDrag?:
  | boolean
  | {
      /**
       * Column swap mode
       * - none - Do nothing
       * - insert - Insert (default)
       * - swap - Swap
       */
      mode?: 'none' | 'insert' | 'swap';
      /** Columns that are disabled from dragging */
      disabled?: (col: StkTableColumn<DT>) => boolean;
    };
```

### rowClassName

Add className to rows

```ts
rowClassName?: (row: any, i: number) => string;
```

### colResizable

Whether column width is resizable (requires setting v-model:columns)
**Do not set** column minWidth, **must** set width
When resizing column width, each column must have a width, and minWidth/maxWidth will not take effect. Table width will become "fit-content".
- Will automatically update the width property in props.columns

```ts
colResizable?: boolean | {
  /** Columns that are disabled from resizing */
  disabled?: (col: StkTableColumn<DT>) => boolean;
};
```

### colMinWidth

Minimum column width when resizing

```ts
colMinWidth?: number;
```

### bordered

Cell border.
Default has both horizontal and vertical borders
"h" - Only show horizontal lines
"v" - Only show vertical lines
"body-v" - Only show vertical lines in body
"body-h" - Only show horizontal lines in body

```ts
bordered?: boolean | 'h' | 'v' | 'body-v' | 'body-h';
```

### autoResize

Automatically recalculate virtual scroll height and width. Default true
[Non-reactive]
Passing a method represents a callback after resize

```ts
autoResize?: boolean | (() => void);
```

### fixedColShadow

Whether to show fixed column shadow. For performance, default false.

```ts
fixedColShadow?: boolean;
```

### optimizeVue2Scroll

Optimize vue2 scrolling

```ts
optimizeVue2Scroll?: boolean;
```

### sortConfig

Sort configuration

```ts
sortConfig?: {
  /** Whether empty values are sorted at the bottom */
  emptyToBottom: boolean,
  /** Default sort (1. Triggered on initialization 2. Triggered when sort direction is null) */
  defaultSort?: {
      dataIndex: keyof T;
      order: Order;
  };
  /**
   * Whether to use String.prototype.localCompare for string sorting
   * Default true (due to historical design issues, default is true for compatibility)
   */
  stringLocaleCompare?: boolean;
},
```

### hideHeaderTitle

Hide header mouse hover title. Can pass dataIndex array

```ts
hideHeaderTitle?: boolean | string[];
```

### highlightConfig

Highlight configuration

```ts
highlightConfig?: {
  /** Highlight duration (s) */
  duration?: number;
  /** Highlight frame rate */
  fps?: number;
};
```

### seqConfig

Sequence column configuration

```ts
seqConfig?: {
  /** Sequence column start index for pagination adaptation */
  startIndex?: number;
};
```

### expandConfig

Expand row configuration

```ts
expandConfig?: {
  height?: number;
};
```

### dragRowConfig

Row drag configuration

```ts
dragRowConfig?: {
  mode?: 'none' | 'insert' | 'swap';
};
```

### cellFixedMode

Fixed header and column implementation method.
[Non-reactive]
relative: Fixed columns can only be placed on both sides of props.columns.
- Use with caution if column width may change.
- Use with caution for fixed columns in multi-level headers

Older browsers can only use 'relative',

```ts
cellFixedMode?: 'sticky' | 'relative';
```

### smoothScroll

Whether to enable smooth scrolling
- default: chrome < 85 || chrome > 120 ? true : false
- false: Use wheel event for scrolling. To prevent white screen caused by scrolling too fast.
- true: Do not use wheel event for scrolling. Smoother scrolling with mouse wheel. May cause white screen when scrolling too fast.

```ts
smoothScroll?: boolean;
```

### scrollRowByRow

Scroll vertically by integer rows
- scrollbar: Only effective when dragging the scrollbar, can be used to solve the white screen problem when dragging (v0.7.2)

```ts
scrollRowByRow?: boolean | 'scrollbar';
```

### scrollbar

Custom scrollbar configuration
- false: Disable custom scrollbar
- true: Enable custom scrollbar with default configuration
- ScrollbarOptions: Enable and configure custom scrollbar

```ts
scrollbar?: boolean | {
  /** Whether to enable scrollbar */
  enabled?: boolean;
  /** Vertical scrollbar width default: 8 */
  width?: number;
  /** Horizontal scrollbar height default: 8 */
  height?: number;
  /** Scrollbar thumb minimum width default: 20 */
  minWidth?: number;
  /** Scrollbar thumb minimum height default: 20 */
  minHeight?: number;
};
```

### treeConfig

Tree configuration

```ts
treeConfig?: {
  /** Whether to expand all tree nodes by default */
  defaultExpandAll?: boolean;
  /** Keys of nodes to expand by default */
  defaultExpandKeys?: UniqKey[];
  /** Level to expand to by default */
  defaultExpandLevel?: number;
};
```

### experimental

Experimental configuration

```ts
experimental?: {
  /** Use transform to simulate scroll */
  scrollY?: boolean;
};
```

### footerData

Footer summary row data

```ts
footerData?: DT[];
```
