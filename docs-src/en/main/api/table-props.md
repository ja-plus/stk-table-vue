# Table Props

```ts
export type StkProps = {
  width?: string;
  /** Minimum table width @deprecated 0.9.1 Use css selector `.stk-table-main` to set*/
  minWidth?: string;
  /** Maximum table width @deprecated 0.9.1 Use css selector `.stk-table-main` to set*/
  maxWidth?: string;
  /** Zebra stripes */
  stripe?: boolean;
  /** Whether to use table-layout:fixed */
  fixedMode?: boolean;
  /** Whether to hide table header */
  headless?: boolean;
  /** Theme, light or dark */
  theme?: 'light' | 'dark';
  /**
   * Row height
   * - When `props.autoRowHeight` is `true`, this represents the expected row height for calculation. It no longer affects the actual row height.
   */
  rowHeight?: number;
  /**
   * Whether to use variable row height
   * - When set to `true`, `props.rowHeight` represents the expected row height for calculation. It no longer affects the actual row height.
   */
  autoRowHeight?: boolean | {
    /** Estimated row height (higher priority than rowHeight) */
    expectedHeight?: number | ((row: DT) => number);
  };
  /** Whether to highlight the row on mouse hover */
  rowHover?: boolean;
  /** Whether to highlight the selected row boolean | RowActiveOption */
  rowActive?: boolean | {
    /** Whether to enable row selection function default: true */
    enabled?: boolean;
    /** Whether to disable row selection default: () => false */
    disabled?: (row: DT) => boolean;
    /** Whether selection can be revoked default: true */
    revokable?: boolean;
  };
  /** Header row height. default = rowHeight */
  headerRowHeight?: number | null;
  /** Virtual scrolling */
  virtual?: boolean;
  /** Horizontal virtual scrolling (must set column width) */
  virtualX?: boolean;
  /** 
   * Table column configuration 
   * 
   * Shallow listen, please modify the reference when changed
   */
  columns?: StkTableColumn<any>[];
  /** 
   * Table data source 
   * 
   * Shallow listen, please modify the reference when changed
   */
  dataSource?: any[];
  /** Row unique key (row unique value cannot be undefined) */
  rowKey?: UniqKeyProp;
  /** Column unique key. Default is `dataIndex` */
  colKey?: UniqKeyProp;
  /** Empty cell display text */
  emptyCellText?: string | ((option: { row: DT; col: StkTableColumn<DT> }) => string);
  /** Whether the fallback height for no data fills the container */
  noDataFull?: boolean;
  /** Whether to show no data message */
  showNoData?: boolean;
  /** Whether to use server-side sorting, true means not sorting data */
  sortRemote?: boolean;
  /** Whether header content overflows with ellipsis */
  showHeaderOverflow?: boolean;
  /** Whether body content overflows with ellipsis */
  showOverflow?: boolean;
  /** Whether to add row hover class */
  showTrHoverClass?: boolean;
  /** Whether to highlight the cell on mouse hover */
  cellHover?: boolean;
  /** Whether to highlight the selected cell */
  cellActive?: boolean;
  /** Whether clicking the cell again can deselect it (cellActive=true) */
  selectedCellRevokable?: boolean;
  /** Whether to enable cell range selection (drag selection) */
  cellSelection?: boolean | {
    /**
     * Custom cell text formatter for clipboard copy.
     * If you use customCell to render cells, you should provide this callback to ensure the copied text matches the displayed content.
     * @param row Row data
     * @param col Column configuration
     * @param rawValue row[col.dataIndex] raw value
     * @returns Text to be copied to clipboard
     */
    formatCellForClipboard?: (row: DT, col: StkTableColumn<DT>, rawValue: any) => string;
  };
  /** Whether header can be dragged. Supports callback function. */
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
  /**
   * Add className to rows<br>
   * FIXME: Need optimization because not passing this prop will cause table rows to always execute an empty function. Does it have any impact?
   */
  rowClassName?: (row: any, i: number) => string;
  /**
   * Whether column width is resizable (requires setting v-model:columns)<br>
   * **Do not set** column minWidth, **must** set width<br>
   * When resizing column width, each column must have a width, and minWidth/maxWidth will not take effect. Table width will become "fit-content".
   * - Will automatically update the width property in props.columns
   */
  colResizable?: boolean;
  /** Minimum column width when resizing */
  colMinWidth?: number;
  /**
   * Cell border.
   * Default has both horizontal and vertical borders
   * "h" - Only show horizontal lines
   * "v" - Only show vertical lines
   * "body-v" - Only show vertical lines in body
   */
  bordered?: boolean | 'h' | 'v' | 'body-v';
  /**
   * Automatically recalculate virtual scroll height and width. Default true
   * [Non-reactive]
   * Passing a method represents a callback after resize
   */
  autoResize?: boolean | (() => void);
  /** Whether to show fixed column shadow. For performance, default false. */
  fixedColShadow?: boolean;
  /** Optimize vue2 scrolling */
  optimizeVue2Scroll?: boolean;
  /** Sort configuration */
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
  /** Hide header mouse hover title. Can pass dataIndex array */
  hideHeaderTitle?: boolean | string[];
  /** Highlight configuration */
  highlightConfig?: {
    /** Highlight duration (s) */
    duration?: number;
    /** Highlight frame rate */
    fps?: number;
  };
  /** Sequence column configuration */
  seqConfig?: {
    /** Sequence column start index for pagination adaptation */
    startIndex?: number;
  };
  /** Expand row configuration */
  expandConfig?: {
    height?: number;
  };
  /** Row drag configuration */
  dragRowConfig?: {
    mode?: 'none' | 'insert' | 'swap';
  };
  /**
   * Fixed header and column implementation method.
   * [Non-reactive]
   * relative: Fixed columns can only be placed on both sides of props.columns.
   * - Use with caution if column width may change.
   * - Use with caution for fixed columns in multi-level headers
   * 
   * Older browsers can only use 'relative', 
   */
  cellFixedMode?: 'sticky' | 'relative';
  /**
   * Whether to enable smooth scrolling
   * - default: chrome < 85 || chrome > 120 ? true : false
   * - false: Use wheel event for scrolling. To prevent white screen caused by scrolling too fast.
   * - true: Do not use wheel event for scrolling. Smoother scrolling with mouse wheel. May cause white screen when scrolling too fast.
   */
  smoothScroll?: boolean;
  /**
   * Scroll vertically by integer rows
   * - scrollbar: Only effective when dragging the scrollbar, can be used to solve the white screen problem when dragging (v0.7.2)
   */
  scrollRowByRow?: boolean | 'scrollbar';
  /**
   * Custom scrollbar configuration
   * - false: Disable custom scrollbar
   * - true: Enable custom scrollbar with default configuration
   * - ScrollbarOptions: Enable and configure custom scrollbar
   */
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
};
```