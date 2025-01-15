import { AutoRowHeightConfig, DragRowConfig, ExpandConfig, HeaderDragConfig, HighlightConfig, Order, PrivateRowDT, SeqConfig, SortConfig, SortOption, StkTableColumn, UniqKeyProp, ColResizableConfig } from './types/index';
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
/**
 *
 * @param rowKeyOrRow rowKey or row
 * @param expand expand or collapse
 * @param data { col?: StkTableColumn<DT> }
 * @param data.silent if set true, not emit `toggle-row-expand`, default:false
 */
declare function setRowExpand(rowKeyOrRow: string | undefined | DT, expand?: boolean, data?: {
    col?: StkTableColumn<DT>;
    silent?: boolean;
}): void;
declare const _default: __VLS_WithTemplateSlots<import('vue').DefineComponent<{
    width?: string | undefined;
    /** 最小表格宽度 */
    minWidth?: string | undefined;
    /** 表格最大宽度*/
    maxWidth?: string | undefined;
    /** 斑马线条纹 */
    stripe?: boolean | undefined;
    /** 是否使用 table-layout:fixed(低版本浏览器需要设置table) */
    fixedMode?: boolean | undefined;
    /** 是否隐藏表头 */
    headless?: boolean | undefined;
    /** 主题，亮、暗 */
    theme?: "light" | "dark" | undefined;
    /**
     * 行高
     * - `props.autoRowHeight` 为 `true` 时，将表示为期望行高，用于计算。不再影响实际行高。
     */
    rowHeight?: number | undefined;
    /**
     * 是否可变行高
     * - 设置为 `true` 时, `props.rowHeight` 将表示为期望行高，用于计算。不再影响实际行高。
     */
    autoRowHeight?: boolean | AutoRowHeightConfig<any> | undefined;
    /** 是否高亮鼠标悬浮的行 */
    rowHover?: boolean | undefined;
    /** 是否高亮选中的行 */
    rowActive?: boolean | undefined;
    /** 当前行再次点击否可以取消 (rowActive=true)*/
    rowCurrentRevokable?: boolean | undefined;
    /** 表头行高。default = rowHeight */
    headerRowHeight?: number | null | undefined;
    /** 虚拟滚动 */
    virtual?: boolean | undefined;
    /** x轴虚拟滚动(必须设置列宽)*/
    virtualX?: boolean | undefined;
    /** 表格列配置 */
    columns?: StkTableColumn<any>[] | undefined;
    /** 表格数据源 */
    dataSource?: any[] | undefined;
    /** 行唯一键 （行唯一值不能为undefined） */
    rowKey?: UniqKeyProp | undefined;
    /** 列唯一键 */
    colKey?: UniqKeyProp | undefined;
    /** 空值展示文字 */
    emptyCellText?: string | ((option: {
        row: any;
        col: StkTableColumn<any>;
    }) => string) | undefined;
    /** 暂无数据兜底高度是否撑满 */
    noDataFull?: boolean | undefined;
    /** 是否展示暂无数据 */
    showNoData?: boolean | undefined;
    /** 是否服务端排序，true则不排序数据 */
    sortRemote?: boolean | undefined;
    /** 表头是否溢出展示... */
    showHeaderOverflow?: boolean | undefined;
    /** 表体溢出是否展示... */
    showOverflow?: boolean | undefined;
    /** 是否增加行hover class $*$ rename*/
    showTrHoverClass?: boolean | undefined;
    /** 是否高亮鼠标悬浮的单元格 */
    cellHover?: boolean | undefined;
    /** 是否高亮选中的单元格 */
    cellActive?: boolean | undefined;
    /** 单元格再次点击否可以取消选中 (cellActive=true)*/
    selectedCellRevokable?: boolean | undefined;
    /** 表头是否可拖动。支持回调函数。 */
    headerDrag?: HeaderDragConfig | undefined;
    /**
     * 给行附加className<br>
     * FIXME: 是否需要优化，因为不传此prop会使表格行一直执行空函数，是否有影响
     */
    rowClassName?: ((row: any, i: number) => string) | undefined;
    /**
     * 列宽是否可拖动(需要设置v-model:columns)<br>
     * **不要设置**列minWidth，**必须**设置width<br>
     * 列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效。table width会变为"fit-content"。
     * - 会自动更新props.columns中的with属性
     */
    colResizable?: boolean | ColResizableConfig<any> | undefined;
    /** 可拖动至最小的列宽 */
    colMinWidth?: number | undefined;
    /**
     * 单元格分割线。
     * 默认横竖都有
     * "h" - 仅展示横线
     * "v" - 仅展示竖线
     * "body-v" - 仅表体展示竖线
     */
    bordered?: boolean | "h" | "v" | "body-v" | undefined;
    /**
     * 自动重新计算虚拟滚动高度宽度。默认true
     * [非响应式]
     * 传入方法表示resize后的回调
     */
    autoResize?: boolean | (() => void) | undefined;
    /** 是否展示固定列阴影。为节省性能，默认false。 */
    fixedColShadow?: boolean | undefined;
    /** 优化vue2 滚动 */
    optimizeVue2Scroll?: boolean | undefined;
    /** 排序配置 */
    sortConfig?: SortConfig<any> | undefined;
    /** 隐藏头部title。可传入colKey数组 */
    hideHeaderTitle?: boolean | string[] | undefined;
    /** 高亮配置 */
    highlightConfig?: HighlightConfig | undefined;
    /** 序号列配置 */
    seqConfig?: SeqConfig | undefined;
    /** 展开行配置 */
    expandConfig?: ExpandConfig | undefined;
    /** 行拖动配置 */
    dragRowConfig?: DragRowConfig | undefined;
    /**
     * 固定头，固定列实现方式。(非响应式)
     *
     * relative：固定列只会放在props.columns的两侧。
     * - 如果列宽会变动则谨慎使用。
     * - 多级表头固定列慎用
     *
     * 低版本浏览器强制为'relative'，
     */
    cellFixedMode?: "sticky" | "relative" | undefined;
    /**
     * 是否平滑滚动。default: chrome < 85 ? true : false
     * - false: 使用 onwheel 滚动。为了防止滚动过快导致白屏。
     * - true: 不使用 onwheel 滚动。鼠标滚轮滚动时更加平滑。滚动过快时会白屏。
     */
    smoothScroll?: boolean | undefined;
}, {
    /**
     * 重新计算虚拟列表宽高
     *
     * en: calc virtual scroll x & y info
     * @see {@link initVirtualScroll}
     */
    initVirtualScroll: (height?: number | undefined) => void;
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
    initVirtualScrollY: (height?: number | undefined) => void;
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
    setHighlightDimCell: (rowKeyValue: import('./types/index').UniqKey, colKeyValue: string, option?: import('./types/highlightDimOptions').HighlightDimCellOption) => void;
    /**
     * 设置高亮行
     *
     * en: Set highlight row
     * @see {@link setHighlightDimRow}
     */
    setHighlightDimRow: (rowKeyValues: import('./types/index').UniqKey[], option?: import('./types/highlightDimOptions').HighlightDimRowOption) => void;
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
    setRowExpand: typeof setRowExpand;
    /**
     * 不定行高时，如果行高有变化，则调用此方法更新行高。
     *
     * en: When the row height is not fixed, call this method to update the row height if the row height changes.
     * @see {@link setAutoHeight}
     */
    setAutoHeight: (rowKey: import('./types/index').UniqKey, height?: number | null | undefined) => void;
    /**
     * 清除所有行高
     *
     * en: Clear all row heights
     * @see {@link clearAllAutoHeight}
     */
    clearAllAutoHeight: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import('vue').PublicProps, Readonly<{
    width?: string | undefined;
    /** 最小表格宽度 */
    minWidth?: string | undefined;
    /** 表格最大宽度*/
    maxWidth?: string | undefined;
    /** 斑马线条纹 */
    stripe?: boolean | undefined;
    /** 是否使用 table-layout:fixed(低版本浏览器需要设置table) */
    fixedMode?: boolean | undefined;
    /** 是否隐藏表头 */
    headless?: boolean | undefined;
    /** 主题，亮、暗 */
    theme?: "light" | "dark" | undefined;
    /**
     * 行高
     * - `props.autoRowHeight` 为 `true` 时，将表示为期望行高，用于计算。不再影响实际行高。
     */
    rowHeight?: number | undefined;
    /**
     * 是否可变行高
     * - 设置为 `true` 时, `props.rowHeight` 将表示为期望行高，用于计算。不再影响实际行高。
     */
    autoRowHeight?: boolean | AutoRowHeightConfig<any> | undefined;
    /** 是否高亮鼠标悬浮的行 */
    rowHover?: boolean | undefined;
    /** 是否高亮选中的行 */
    rowActive?: boolean | undefined;
    /** 当前行再次点击否可以取消 (rowActive=true)*/
    rowCurrentRevokable?: boolean | undefined;
    /** 表头行高。default = rowHeight */
    headerRowHeight?: number | null | undefined;
    /** 虚拟滚动 */
    virtual?: boolean | undefined;
    /** x轴虚拟滚动(必须设置列宽)*/
    virtualX?: boolean | undefined;
    /** 表格列配置 */
    columns?: StkTableColumn<any>[] | undefined;
    /** 表格数据源 */
    dataSource?: any[] | undefined;
    /** 行唯一键 （行唯一值不能为undefined） */
    rowKey?: UniqKeyProp | undefined;
    /** 列唯一键 */
    colKey?: UniqKeyProp | undefined;
    /** 空值展示文字 */
    emptyCellText?: string | ((option: {
        row: any;
        col: StkTableColumn<any>;
    }) => string) | undefined;
    /** 暂无数据兜底高度是否撑满 */
    noDataFull?: boolean | undefined;
    /** 是否展示暂无数据 */
    showNoData?: boolean | undefined;
    /** 是否服务端排序，true则不排序数据 */
    sortRemote?: boolean | undefined;
    /** 表头是否溢出展示... */
    showHeaderOverflow?: boolean | undefined;
    /** 表体溢出是否展示... */
    showOverflow?: boolean | undefined;
    /** 是否增加行hover class $*$ rename*/
    showTrHoverClass?: boolean | undefined;
    /** 是否高亮鼠标悬浮的单元格 */
    cellHover?: boolean | undefined;
    /** 是否高亮选中的单元格 */
    cellActive?: boolean | undefined;
    /** 单元格再次点击否可以取消选中 (cellActive=true)*/
    selectedCellRevokable?: boolean | undefined;
    /** 表头是否可拖动。支持回调函数。 */
    headerDrag?: HeaderDragConfig | undefined;
    /**
     * 给行附加className<br>
     * FIXME: 是否需要优化，因为不传此prop会使表格行一直执行空函数，是否有影响
     */
    rowClassName?: ((row: any, i: number) => string) | undefined;
    /**
     * 列宽是否可拖动(需要设置v-model:columns)<br>
     * **不要设置**列minWidth，**必须**设置width<br>
     * 列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效。table width会变为"fit-content"。
     * - 会自动更新props.columns中的with属性
     */
    colResizable?: boolean | ColResizableConfig<any> | undefined;
    /** 可拖动至最小的列宽 */
    colMinWidth?: number | undefined;
    /**
     * 单元格分割线。
     * 默认横竖都有
     * "h" - 仅展示横线
     * "v" - 仅展示竖线
     * "body-v" - 仅表体展示竖线
     */
    bordered?: boolean | "h" | "v" | "body-v" | undefined;
    /**
     * 自动重新计算虚拟滚动高度宽度。默认true
     * [非响应式]
     * 传入方法表示resize后的回调
     */
    autoResize?: boolean | (() => void) | undefined;
    /** 是否展示固定列阴影。为节省性能，默认false。 */
    fixedColShadow?: boolean | undefined;
    /** 优化vue2 滚动 */
    optimizeVue2Scroll?: boolean | undefined;
    /** 排序配置 */
    sortConfig?: SortConfig<any> | undefined;
    /** 隐藏头部title。可传入colKey数组 */
    hideHeaderTitle?: boolean | string[] | undefined;
    /** 高亮配置 */
    highlightConfig?: HighlightConfig | undefined;
    /** 序号列配置 */
    seqConfig?: SeqConfig | undefined;
    /** 展开行配置 */
    expandConfig?: ExpandConfig | undefined;
    /** 行拖动配置 */
    dragRowConfig?: DragRowConfig | undefined;
    /**
     * 固定头，固定列实现方式。(非响应式)
     *
     * relative：固定列只会放在props.columns的两侧。
     * - 如果列宽会变动则谨慎使用。
     * - 多级表头固定列慎用
     *
     * 低版本浏览器强制为'relative'，
     */
    cellFixedMode?: "sticky" | "relative" | undefined;
    /**
     * 是否平滑滚动。default: chrome < 85 ? true : false
     * - false: 使用 onwheel 滚动。为了防止滚动过快导致白屏。
     * - true: 不使用 onwheel 滚动。鼠标滚轮滚动时更加平滑。滚动过快时会白屏。
     */
    smoothScroll?: boolean | undefined;
}> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any[] | unknown[]) => any) | undefined;
}>, {
    width: string;
    minWidth: string;
    maxWidth: string;
    sortConfig: SortConfig<any>;
    rowHeight: number;
    headerRowHeight: number | null;
    headless: boolean;
    autoRowHeight: boolean | AutoRowHeightConfig<any>;
    stripe: boolean;
    optimizeVue2Scroll: boolean;
    rowKey: UniqKeyProp;
    colKey: UniqKeyProp;
    fixedMode: boolean;
    theme: "light" | "dark";
    rowHover: boolean;
    rowActive: boolean;
    rowCurrentRevokable: boolean;
    virtual: boolean;
    virtualX: boolean;
    columns: StkTableColumn<any>[];
    dataSource: any[];
    emptyCellText: string | ((option: {
        row: any;
        col: StkTableColumn<any>;
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
    headerDrag: HeaderDragConfig;
    rowClassName: (row: any, i: number) => string;
    colResizable: boolean | ColResizableConfig<any>;
    colMinWidth: number;
    bordered: boolean | "h" | "v" | "body-v";
    autoResize: boolean | (() => void);
    fixedColShadow: boolean;
    hideHeaderTitle: boolean | string[];
    highlightConfig: HighlightConfig;
    seqConfig: SeqConfig;
    expandConfig: ExpandConfig;
    dragRowConfig: DragRowConfig;
    cellFixedMode: "sticky" | "relative";
    smoothScroll: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>, {
    tableHeader?(_: {
        col: StkTableColumn<any>;
    }): any;
    expand?(_: {
        row: any;
        col: any;
    }): any;
    empty?(_: {}): any;
    customBottom?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
