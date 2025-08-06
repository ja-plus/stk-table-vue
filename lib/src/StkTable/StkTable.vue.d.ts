import { AutoRowHeightConfig, ColResizableConfig, DragRowConfig, ExpandConfig, HeaderDragConfig, HighlightConfig, Order, PrivateRowDT, PrivateStkTableColumn, SeqConfig, SortConfig, SortOption, StkTableColumn, TreeConfig, UniqKey, UniqKeyProp } from './types/index';

/** Generic stands for DataType */
type DT = any & PrivateRowDT;
/**
 * 选中一行
 * @param {string} rowKeyOrRow selected rowKey, undefined to unselect
 * @param {boolean} option.silent if set true not emit `current-change`. default:false
 */
declare function setCurrentRow(rowKeyOrRow: string | undefined | DT, option?: {
    silent: boolean;
}): void;
/**
 * set highlight active cell (props.cellActive=true)
 * @param row row if undefined, clear highlight
 * @param col column
 * @param option.silent if emit current-change. default:false(not emit `current-change`)
 */
declare function setSelectedCell(row?: DT, col?: StkTableColumn<DT>, option?: {
    silent: boolean;
}): void;
/**
 * 设置表头排序状态。
 * @param colKey 列唯一键字段。如果你想要取消排序状态，请使用`resetSorter`
 * @param order 正序倒序
 * @param option.sortOption 指定排序参数。同 StkTableColumn 中排序相关字段。建议从columns中find得到。
 * @param option.sort 是否触发排序-默认true
 * @param option.silent 是否禁止触发回调-默认true
 * @param option.force 是否触发排序-默认true
 * @return 表格数据
 */
declare function setSorter(colKey: string, order: Order, option?: {
    sortOption?: SortOption<DT>;
    force?: boolean;
    silent?: boolean;
    sort?: boolean;
}): any[];
declare function resetSorter(): void;
/**
 * set scroll bar position
 * @param top null to not change
 * @param left null to not change
 */
declare function scrollTo(top?: number | null, left?: number | null): void;
/** get current table data */
declare function getTableData(): any[];
/**
 * get current sort info
 * @return {{key:string,order:Order}[]}
 */
declare function getSortColumns(): {
    key: string | number | symbol | undefined;
    order: "desc" | "asc";
}[];
declare function __VLS_template(): {
    tableHeader?(_: {
        col: PrivateStkTableColumn<any>;
    }): any;
    expand?(_: {
        row: any;
        col: any;
    }): any;
    empty?(_: {}): any;
    customBottom?(_: {}): any;
};
declare const __VLS_component: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    width?: string;
    /** 最小表格宽度 */
    minWidth?: string;
    /** 表格最大宽度*/
    maxWidth?: string;
    /** 斑马线条纹 */
    stripe?: boolean;
    /** 是否使用 table-layout:fixed(低版本浏览器需要设置table) */
    fixedMode?: boolean;
    /** 是否隐藏表头 */
    headless?: boolean;
    /** 主题，亮、暗 */
    theme?: "light" | "dark";
    /**
     * 行高
     * - `props.autoRowHeight` 为 `true` 时，将表示为期望行高，用于计算。不再影响实际行高。
     */
    rowHeight?: number;
    /**
     * 是否可变行高
     * - 设置为 `true` 时, `props.rowHeight` 将表示为期望行高，用于计算。不再影响实际行高。
     */
    autoRowHeight?: boolean | AutoRowHeightConfig<DT>;
    /** 是否高亮鼠标悬浮的行 */
    rowHover?: boolean;
    /** 是否高亮选中的行 */
    rowActive?: boolean;
    /** 当前行再次点击否可以取消 (rowActive=true)*/
    rowCurrentRevokable?: boolean;
    /** 表头行高。default = rowHeight */
    headerRowHeight?: number | string | null;
    /** 虚拟滚动 */
    virtual?: boolean;
    /** x轴虚拟滚动(必须设置列宽)*/
    virtualX?: boolean;
    /** 表格列配置 */
    columns?: StkTableColumn<DT>[];
    /** 表格数据源 */
    dataSource?: DT[];
    /** 行唯一键 （行唯一值不能为undefined） */
    rowKey?: UniqKeyProp;
    /** 列唯一键 */
    colKey?: UniqKeyProp;
    /** 空值展示文字 */
    emptyCellText?: string | ((option: {
        row: DT;
        col: StkTableColumn<DT>;
    }) => string);
    /** 暂无数据兜底高度是否撑满 */
    noDataFull?: boolean;
    /** 是否展示暂无数据 */
    showNoData?: boolean;
    /** 是否服务端排序，true则不排序数据 */
    sortRemote?: boolean;
    /** 表头是否溢出展示... */
    showHeaderOverflow?: boolean;
    /** 表体溢出是否展示... */
    showOverflow?: boolean;
    /** 是否增加行hover class $*$ rename*/
    showTrHoverClass?: boolean;
    /** 是否高亮鼠标悬浮的单元格 */
    cellHover?: boolean;
    /** 是否高亮选中的单元格 */
    cellActive?: boolean;
    /** 单元格再次点击否可以取消选中 (cellActive=true)*/
    selectedCellRevokable?: boolean;
    /** 表头是否可拖动。支持回调函数。 */
    headerDrag?: boolean | HeaderDragConfig;
    /**
     * 给行附加className<br>
     * FIXME: 是否需要优化，因为不传此prop会使表格行一直执行空函数，是否有影响
     */
    rowClassName?: (row: DT, i: number) => string | undefined;
    /**
     * 列宽是否可拖动(需要设置v-model:columns)<br>
     * **不要设置**列minWidth，**必须**设置width<br>
     * 列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效。table width会变为"fit-content"。
     * - 会自动更新props.columns中的with属性
     */
    colResizable?: boolean | ColResizableConfig<DT>;
    /** 可拖动至最小的列宽 */
    colMinWidth?: number;
    /**
     * 单元格分割线。
     * 默认横竖都有
     * "h" - 仅展示横线
     * "v" - 仅展示竖线
     * "body-v" - 仅表体展示竖线
     */
    bordered?: boolean | "h" | "v" | "body-v";
    /**
     * 自动重新计算虚拟滚动高度宽度。默认true
     * [非响应式]
     * 传入方法表示resize后的回调
     */
    autoResize?: boolean | (() => void);
    /** 是否展示固定列阴影。为节省性能，默认false。 */
    fixedColShadow?: boolean;
    /** 优化vue2 滚动 */
    optimizeVue2Scroll?: boolean;
    /** 排序配置 */
    sortConfig?: SortConfig<DT>;
    /** 隐藏头部title。可传入colKey数组 */
    hideHeaderTitle?: boolean | string[];
    /** 高亮配置 */
    highlightConfig?: HighlightConfig;
    /** 序号列配置 */
    seqConfig?: SeqConfig;
    /** 展开行配置 */
    expandConfig?: ExpandConfig;
    /** 行拖动配置 */
    dragRowConfig?: DragRowConfig;
    /** 树形配置 */
    treeConfig?: TreeConfig;
    /**
     * 固定头，固定列实现方式。(非响应式)
     *
     * relative：固定列只会放在props.columns的两侧。
     * - 如果列宽会变动则谨慎使用。
     * - 多级表头固定列慎用
     *
     * 低版本浏览器强制为'relative'，
     */
    cellFixedMode?: "sticky" | "relative";
    /**
     * 是否平滑滚动。default: chrome < 85 || chrome > 120 ? true : false
     * - false: 使用 onwheel 滚动。为了防止滚动过快导致白屏。
     * - true: 不使用 onwheel 滚动。鼠标滚轮滚动时更加平滑。滚动过快时会白屏。
     */
    smoothScroll?: boolean;
    /**
     * 按整数行纵向滚动
     * - scrollbar：仅拖动滚动条生效
     */
    scrollRowByRow?: boolean | "scrollbar";
}>, {
    width: string;
    fixedMode: boolean;
    stripe: boolean;
    minWidth: string;
    maxWidth: string;
    headless: boolean;
    theme: string;
    rowHeight: number;
    autoRowHeight: boolean;
    rowHover: boolean;
    rowActive: boolean;
    rowCurrentRevokable: boolean;
    headerRowHeight: number;
    virtual: boolean;
    virtualX: boolean;
    columns: () => never[];
    dataSource: () => never[];
    rowKey: string;
    colKey: undefined;
    emptyCellText: string;
    noDataFull: boolean;
    showNoData: boolean;
    sortRemote: boolean;
    showHeaderOverflow: boolean;
    showOverflow: boolean;
    showTrHoverClass: boolean;
    cellHover: boolean;
    cellActive: boolean;
    selectedCellRevokable: boolean;
    headerDrag: boolean;
    rowClassName: () => "";
    colResizable: boolean;
    colMinWidth: number;
    bordered: boolean;
    autoResize: boolean;
    fixedColShadow: boolean;
    optimizeVue2Scroll: boolean;
    sortConfig: () => {
        emptyToBottom: boolean;
        stringLocaleCompare: boolean;
    };
    hideHeaderTitle: boolean;
    highlightConfig: () => {};
    seqConfig: () => {};
    expandConfig: () => {};
    dragRowConfig: () => {};
    treeConfig: () => {};
    cellFixedMode: string;
    smoothScroll: boolean;
    scrollRowByRow: boolean;
}>>, {
    /**
     * 重新计算虚拟列表宽高
     *
     * en: calc virtual scroll x & y info
     * @see {@link initVirtualScroll}
     */
    initVirtualScroll: (height?: number) => void;
    /**
     * 重新计算虚拟列表宽度
     *
     * en: calc virtual scroll x
     * @see {@link initVirtualScrollX}
     */
    initVirtualScrollX: () => void;
    /**
     * 重新计算虚拟列表高度
     *
     * en: calc virtual scroll y
     * @see {@link initVirtualScrollY}
     */
    initVirtualScrollY: (height?: number) => void;
    /**
     * 选中一行
     *
     * en：select a row
     * @see {@link setCurrentRow}
     */
    setCurrentRow: typeof setCurrentRow;
    /**
     * 取消选中单元格
     *
     * en: set highlight active cell (props.cellActive=true)
     * @see {@link setSelectedCell}
     */
    setSelectedCell: typeof setSelectedCell;
    /**
     * 设置高亮单元格
     *
     * en: Set highlight cell
     * @see {@link setHighlightDimCell}
     */
    setHighlightDimCell: (rowKeyValue: UniqKey, colKeyValue: string, option?: import('./types/highlightDimOptions').HighlightDimCellOption) => void;
    /**
     * 设置高亮行
     *
     * en: Set highlight row
     * @see {@link setHighlightDimRow}
     */
    setHighlightDimRow: (rowKeyValues: UniqKey[], option?: import('./types/highlightDimOptions').HighlightDimRowOption) => void;
    /**
     * 表格排序列colKey
     *
     * en: Table sort column colKey
     */
    sortCol: import('vue').Ref<string | number | symbol | undefined, string | number | symbol | undefined>;
    /**
     * 表格排序列顺序
     *
     * en: get current sort info
     * @see {@link getSortColumns}
     */
    getSortColumns: typeof getSortColumns;
    /**
     * 设置表头排序状态
     *
     * en: Set the sort status of the table header
     * @see {@link setSorter}
     */
    setSorter: typeof setSorter;
    /**
     * 重置sorter状态
     *
     * en: Reset the sorter status
     * @see {@link resetSorter}
     */
    resetSorter: typeof resetSorter;
    /**
     * 滚动至
     *
     * en: Scroll to
     * @see {@link scrollTo}
     */
    scrollTo: typeof scrollTo;
    /**
     * 获取表格数据
     *
     * en: Get table data
     * @see {@link getTableData}
     */
    getTableData: typeof getTableData;
    /**
     * 设置展开的行
     *
     * en: Set expanded rows
     * @see {@link setRowExpand}
     */
    setRowExpand: (rowKeyOrRow: string | undefined | PrivateRowDT, expand?: boolean | null, data?: {
        col?: StkTableColumn<PrivateRowDT>;
        silent?: boolean;
    }) => void;
    /**
     * 不定行高时，如果行高有变化，则调用此方法更新行高。
     *
     * en: When the row height is not fixed, call this method to update the row height if the row height changes.
     * @see {@link setAutoHeight}
     */
    setAutoHeight: (rowKey: UniqKey, height?: number | null) => void;
    /**
     * 清除所有行高
     *
     * en: Clear all row heights
     * @see {@link clearAllAutoHeight}
     */
    clearAllAutoHeight: () => void;
    /**
     * 设置树节点展开状态
     *
     * en: Set tree node expand state
     * @see {@link setTreeExpand}
     */
    setTreeExpand: (row: (UniqKey | (PrivateRowDT & {
        children?: (PrivateRowDT & /*elided*/ any)[];
    })) | (UniqKey | (PrivateRowDT & {
        children?: (PrivateRowDT & /*elided*/ any)[];
    }))[], option?: {
        expand?: boolean;
    }) => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "sort-change": (col: StkTableColumn<any> | null, order: Order, data: any[], sortConfig: SortConfig<any>) => void;
    "row-click": (ev: MouseEvent, row: any, data: {
        rowIndex: number;
    }) => void;
    "current-change": (ev: MouseEvent | null, row: any, data: {
        select: boolean;
    }) => void;
    "cell-selected": (ev: MouseEvent | null, data: {
        select: boolean;
        row: DT | undefined;
        col: StkTableColumn<DT> | undefined;
    }) => void;
    "row-dblclick": (ev: MouseEvent, row: any, data: {
        rowIndex: number;
    }) => void;
    "header-row-menu": (ev: MouseEvent) => void;
    "row-menu": (ev: MouseEvent, row: any, data: {
        rowIndex: number;
    }) => void;
    "cell-click": (ev: MouseEvent, row: any, col: StkTableColumn<any>, data: {
        rowIndex: number;
    }) => void;
    "cell-mouseenter": (ev: MouseEvent, row: any, col: StkTableColumn<any>) => void;
    "cell-mouseleave": (ev: MouseEvent, row: any, col: StkTableColumn<any>) => void;
    "cell-mouseover": (ev: MouseEvent, row: any, col: StkTableColumn<any>) => void;
    "cell-mousedown": (ev: MouseEvent, row: any, col: StkTableColumn<any>, data: {
        rowIndex: number;
    }) => void;
    "header-cell-click": (ev: MouseEvent, col: StkTableColumn<any>) => void;
    scroll: (ev: Event, data: {
        startIndex: number;
        endIndex: number;
    }) => void;
    "scroll-x": (ev: Event) => void;
    "col-order-change": (dragStartKey: string, targetColKey: string) => void;
    "th-drag-start": (dragStartKey: string) => void;
    "th-drop": (targetColKey: string) => void;
    "row-order-change": (dragStartKey: string, targetRowKey: string) => void;
    "col-resize": (col: StkTableColumn<any>) => void;
    "toggle-row-expand": (data: {
        expanded: boolean;
        row: DT;
        col: StkTableColumn<DT> | null;
    }) => void;
    "toggle-tree-expand": (data: {
        expanded: boolean;
        row: DT;
        col: StkTableColumn<DT> | null;
    }) => void;
    "update:columns": (cols: StkTableColumn<any>[]) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    width?: string;
    /** 最小表格宽度 */
    minWidth?: string;
    /** 表格最大宽度*/
    maxWidth?: string;
    /** 斑马线条纹 */
    stripe?: boolean;
    /** 是否使用 table-layout:fixed(低版本浏览器需要设置table) */
    fixedMode?: boolean;
    /** 是否隐藏表头 */
    headless?: boolean;
    /** 主题，亮、暗 */
    theme?: "light" | "dark";
    /**
     * 行高
     * - `props.autoRowHeight` 为 `true` 时，将表示为期望行高，用于计算。不再影响实际行高。
     */
    rowHeight?: number;
    /**
     * 是否可变行高
     * - 设置为 `true` 时, `props.rowHeight` 将表示为期望行高，用于计算。不再影响实际行高。
     */
    autoRowHeight?: boolean | AutoRowHeightConfig<DT>;
    /** 是否高亮鼠标悬浮的行 */
    rowHover?: boolean;
    /** 是否高亮选中的行 */
    rowActive?: boolean;
    /** 当前行再次点击否可以取消 (rowActive=true)*/
    rowCurrentRevokable?: boolean;
    /** 表头行高。default = rowHeight */
    headerRowHeight?: number | string | null;
    /** 虚拟滚动 */
    virtual?: boolean;
    /** x轴虚拟滚动(必须设置列宽)*/
    virtualX?: boolean;
    /** 表格列配置 */
    columns?: StkTableColumn<DT>[];
    /** 表格数据源 */
    dataSource?: DT[];
    /** 行唯一键 （行唯一值不能为undefined） */
    rowKey?: UniqKeyProp;
    /** 列唯一键 */
    colKey?: UniqKeyProp;
    /** 空值展示文字 */
    emptyCellText?: string | ((option: {
        row: DT;
        col: StkTableColumn<DT>;
    }) => string);
    /** 暂无数据兜底高度是否撑满 */
    noDataFull?: boolean;
    /** 是否展示暂无数据 */
    showNoData?: boolean;
    /** 是否服务端排序，true则不排序数据 */
    sortRemote?: boolean;
    /** 表头是否溢出展示... */
    showHeaderOverflow?: boolean;
    /** 表体溢出是否展示... */
    showOverflow?: boolean;
    /** 是否增加行hover class $*$ rename*/
    showTrHoverClass?: boolean;
    /** 是否高亮鼠标悬浮的单元格 */
    cellHover?: boolean;
    /** 是否高亮选中的单元格 */
    cellActive?: boolean;
    /** 单元格再次点击否可以取消选中 (cellActive=true)*/
    selectedCellRevokable?: boolean;
    /** 表头是否可拖动。支持回调函数。 */
    headerDrag?: boolean | HeaderDragConfig;
    /**
     * 给行附加className<br>
     * FIXME: 是否需要优化，因为不传此prop会使表格行一直执行空函数，是否有影响
     */
    rowClassName?: (row: DT, i: number) => string | undefined;
    /**
     * 列宽是否可拖动(需要设置v-model:columns)<br>
     * **不要设置**列minWidth，**必须**设置width<br>
     * 列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效。table width会变为"fit-content"。
     * - 会自动更新props.columns中的with属性
     */
    colResizable?: boolean | ColResizableConfig<DT>;
    /** 可拖动至最小的列宽 */
    colMinWidth?: number;
    /**
     * 单元格分割线。
     * 默认横竖都有
     * "h" - 仅展示横线
     * "v" - 仅展示竖线
     * "body-v" - 仅表体展示竖线
     */
    bordered?: boolean | "h" | "v" | "body-v";
    /**
     * 自动重新计算虚拟滚动高度宽度。默认true
     * [非响应式]
     * 传入方法表示resize后的回调
     */
    autoResize?: boolean | (() => void);
    /** 是否展示固定列阴影。为节省性能，默认false。 */
    fixedColShadow?: boolean;
    /** 优化vue2 滚动 */
    optimizeVue2Scroll?: boolean;
    /** 排序配置 */
    sortConfig?: SortConfig<DT>;
    /** 隐藏头部title。可传入colKey数组 */
    hideHeaderTitle?: boolean | string[];
    /** 高亮配置 */
    highlightConfig?: HighlightConfig;
    /** 序号列配置 */
    seqConfig?: SeqConfig;
    /** 展开行配置 */
    expandConfig?: ExpandConfig;
    /** 行拖动配置 */
    dragRowConfig?: DragRowConfig;
    /** 树形配置 */
    treeConfig?: TreeConfig;
    /**
     * 固定头，固定列实现方式。(非响应式)
     *
     * relative：固定列只会放在props.columns的两侧。
     * - 如果列宽会变动则谨慎使用。
     * - 多级表头固定列慎用
     *
     * 低版本浏览器强制为'relative'，
     */
    cellFixedMode?: "sticky" | "relative";
    /**
     * 是否平滑滚动。default: chrome < 85 || chrome > 120 ? true : false
     * - false: 使用 onwheel 滚动。为了防止滚动过快导致白屏。
     * - true: 不使用 onwheel 滚动。鼠标滚轮滚动时更加平滑。滚动过快时会白屏。
     */
    smoothScroll?: boolean;
    /**
     * 按整数行纵向滚动
     * - scrollbar：仅拖动滚动条生效
     */
    scrollRowByRow?: boolean | "scrollbar";
}>, {
    width: string;
    fixedMode: boolean;
    stripe: boolean;
    minWidth: string;
    maxWidth: string;
    headless: boolean;
    theme: string;
    rowHeight: number;
    autoRowHeight: boolean;
    rowHover: boolean;
    rowActive: boolean;
    rowCurrentRevokable: boolean;
    headerRowHeight: number;
    virtual: boolean;
    virtualX: boolean;
    columns: () => never[];
    dataSource: () => never[];
    rowKey: string;
    colKey: undefined;
    emptyCellText: string;
    noDataFull: boolean;
    showNoData: boolean;
    sortRemote: boolean;
    showHeaderOverflow: boolean;
    showOverflow: boolean;
    showTrHoverClass: boolean;
    cellHover: boolean;
    cellActive: boolean;
    selectedCellRevokable: boolean;
    headerDrag: boolean;
    rowClassName: () => "";
    colResizable: boolean;
    colMinWidth: number;
    bordered: boolean;
    autoResize: boolean;
    fixedColShadow: boolean;
    optimizeVue2Scroll: boolean;
    sortConfig: () => {
        emptyToBottom: boolean;
        stringLocaleCompare: boolean;
    };
    hideHeaderTitle: boolean;
    highlightConfig: () => {};
    seqConfig: () => {};
    expandConfig: () => {};
    dragRowConfig: () => {};
    treeConfig: () => {};
    cellFixedMode: string;
    smoothScroll: boolean;
    scrollRowByRow: boolean;
}>>> & Readonly<{
    onScroll?: ((ev: Event, data: {
        startIndex: number;
        endIndex: number;
    }) => any) | undefined;
    "onUpdate:columns"?: ((cols: StkTableColumn<any>[]) => any) | undefined;
    "onCol-resize"?: ((col: StkTableColumn<any>) => any) | undefined;
    "onToggle-row-expand"?: ((data: {
        expanded: boolean;
        row: DT;
        col: StkTableColumn<DT> | null;
    }) => any) | undefined;
    "onTh-drag-start"?: ((dragStartKey: string) => any) | undefined;
    "onTh-drop"?: ((targetColKey: string) => any) | undefined;
    "onCol-order-change"?: ((dragStartKey: string, targetColKey: string) => any) | undefined;
    "onRow-order-change"?: ((dragStartKey: string, targetRowKey: string) => any) | undefined;
    "onToggle-tree-expand"?: ((data: {
        expanded: boolean;
        row: DT;
        col: StkTableColumn<DT> | null;
    }) => any) | undefined;
    "onSort-change"?: ((col: StkTableColumn<any> | null, order: Order, data: any[], sortConfig: SortConfig<any>) => any) | undefined;
    "onRow-click"?: ((ev: MouseEvent, row: any, data: {
        rowIndex: number;
    }) => any) | undefined;
    "onCurrent-change"?: ((ev: MouseEvent | null, row: any, data: {
        select: boolean;
    }) => any) | undefined;
    "onCell-selected"?: ((ev: MouseEvent | null, data: {
        select: boolean;
        row: DT | undefined;
        col: StkTableColumn<DT> | undefined;
    }) => any) | undefined;
    "onRow-dblclick"?: ((ev: MouseEvent, row: any, data: {
        rowIndex: number;
    }) => any) | undefined;
    "onHeader-row-menu"?: ((ev: MouseEvent) => any) | undefined;
    "onRow-menu"?: ((ev: MouseEvent, row: any, data: {
        rowIndex: number;
    }) => any) | undefined;
    "onCell-click"?: ((ev: MouseEvent, row: any, col: StkTableColumn<any>, data: {
        rowIndex: number;
    }) => any) | undefined;
    "onCell-mouseenter"?: ((ev: MouseEvent, row: any, col: StkTableColumn<any>) => any) | undefined;
    "onCell-mouseleave"?: ((ev: MouseEvent, row: any, col: StkTableColumn<any>) => any) | undefined;
    "onCell-mouseover"?: ((ev: MouseEvent, row: any, col: StkTableColumn<any>) => any) | undefined;
    "onCell-mousedown"?: ((ev: MouseEvent, row: any, col: StkTableColumn<any>, data: {
        rowIndex: number;
    }) => any) | undefined;
    "onHeader-cell-click"?: ((ev: MouseEvent, col: StkTableColumn<any>) => any) | undefined;
    "onScroll-x"?: ((ev: Event) => any) | undefined;
}>, {
    width: string;
    minWidth: string;
    maxWidth: string;
    sortConfig: SortConfig<DT>;
    rowHeight: number;
    headless: boolean;
    autoRowHeight: boolean | AutoRowHeightConfig<DT>;
    stripe: boolean;
    optimizeVue2Scroll: boolean;
    rowKey: UniqKeyProp;
    headerRowHeight: number | string | null;
    colKey: UniqKeyProp;
    fixedMode: boolean;
    theme: "light" | "dark";
    rowHover: boolean;
    rowActive: boolean;
    rowCurrentRevokable: boolean;
    virtual: boolean;
    virtualX: boolean;
    columns: StkTableColumn<DT>[];
    dataSource: DT[];
    emptyCellText: string | ((option: {
        row: DT;
        col: StkTableColumn<DT>;
    }) => string);
    noDataFull: boolean;
    showNoData: boolean;
    sortRemote: boolean;
    showHeaderOverflow: boolean;
    showOverflow: boolean;
    showTrHoverClass: boolean;
    cellHover: boolean;
    cellActive: boolean;
    selectedCellRevokable: boolean;
    headerDrag: boolean | HeaderDragConfig;
    rowClassName: (row: DT, i: number) => string | undefined;
    colResizable: boolean | ColResizableConfig<DT>;
    colMinWidth: number;
    bordered: boolean | "h" | "v" | "body-v";
    autoResize: boolean | (() => void);
    fixedColShadow: boolean;
    hideHeaderTitle: boolean | string[];
    highlightConfig: HighlightConfig;
    seqConfig: SeqConfig;
    expandConfig: ExpandConfig;
    dragRowConfig: DragRowConfig;
    treeConfig: TreeConfig;
    cellFixedMode: "sticky" | "relative";
    smoothScroll: boolean;
    scrollRowByRow: boolean | "scrollbar";
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
