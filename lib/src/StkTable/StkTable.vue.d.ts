import { HighlightConfig, Order, SeqConfig, SortConfig, SortOption, SortState, StkTableColumn, UniqKeyProp } from './types/index';

/** Generic stands for DataType */
type DT = any;
/**
 * 选中一行
 * @param {string} rowKeyOrRow selected rowKey, undefined to unselect
 * @param {boolean} option.silent if emit current-change. default:false(not emit `current-change`)
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
 * 设置表头排序状态
 * @param dataIndex 列字段
 * @param order 正序倒序
 * @param option.sortOption 指定排序参数。同 StkTableColumn 中排序相关字段。建议从columns中find得到。
 * @param option.sort 是否触发排序-默认true
 * @param option.silent 是否禁止触发回调-默认true
 * @param option.force 是否触发排序-默认true
 */
declare function setSorter(dataIndex: string, order: Order, option?: {
    sortOption?: SortOption<DT>;
    force?: boolean;
    silent?: boolean;
    sort?: boolean;
}): any[];
/** 重置排序 */
declare function resetSorter(): void;
/**
 * 设置滚动条位置
 * @param top 传null 则不变动位置
 * @param left 传null 则不变动位置
 */
declare function scrollTo(top?: number | null, left?: number | null): void;
/** 获取当前状态的表格数据 */
declare function getTableData(): any[];
/** 获取当前排序列的信息 */
declare function getSortColumns(): Partial<SortState<DT>>[];
declare const _default: __VLS_WithTemplateSlots<import('vue').DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
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
    /** 行高 */
    rowHeight?: number | undefined;
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
    headerDrag?: boolean | ((col: StkTableColumn<any>) => boolean) | undefined;
    /**
     * 给行附加className<br>
     * FIXME: 是否需要优化，因为不传此prop会使表格行一直执行空函数，是否有影响
     */
    rowClassName?: ((row: any, i: number) => string) | undefined;
    /**
     * 列宽是否可拖动<br>
     * **不要设置**列minWidth，**必须**设置width<br>
     * 列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效。table width会变为"fit-content"。
     */
    colResizable?: boolean | undefined;
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
    /** 隐藏头部title。可传入dataIndex数组 */
    hideHeaderTitle?: boolean | string[] | undefined;
    /** 高亮配置 */
    highlightConfig?: HighlightConfig | undefined;
    /** 序号列配置 */
    seqConfig?: SeqConfig | undefined;
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
}>, {
    width: string;
    fixedMode: boolean;
    stripe: boolean;
    minWidth: string;
    maxWidth: string;
    headless: boolean;
    theme: string;
    rowHeight: number;
    rowHover: boolean;
    rowActive: boolean;
    rowCurrentRevokable: boolean;
    headerRowHeight: null;
    virtual: boolean;
    virtualX: boolean;
    columns: () => never[];
    dataSource: () => never[];
    rowKey: string;
    colKey: string;
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
    cellFixedMode: string;
    smoothScroll: boolean;
}>, {
    /** @see {@link initVirtualScroll} */
    initVirtualScroll: (height?: number | undefined) => void;
    /** @see {@link initVirtualScrollX} */
    initVirtualScrollX: () => void;
    /** @see {@link initVirtualScrollY} */
    initVirtualScrollY: (height?: number | undefined) => void;
    /** @see {@link setCurrentRow} */
    setCurrentRow: typeof setCurrentRow;
    /** @see {@link setSelectedCell} */
    setSelectedCell: typeof setSelectedCell;
    /** @see {@link setHighlightDimCell} */
    setHighlightDimCell: (rowKeyValue: import('./types/index').UniqKey, dataIndex: string, option?: {
        className?: string | undefined;
        method?: "animation" | "css" | undefined;
        keyframe?: Keyframe[] | PropertyIndexedKeyframes | null | undefined;
        duration?: number | undefined;
    }) => void;
    /** @see {@link setHighlightDimRow} */
    setHighlightDimRow: (rowKeyValues: import('./types/index').UniqKey[], option?: {
        method?: "animation" | "css" | "js" | undefined;
        useCss?: boolean | undefined;
        className?: string | undefined;
        keyframe?: Keyframe[] | PropertyIndexedKeyframes | null | undefined;
        duration?: number | undefined;
    }) => void;
    /** 表格排序列dataIndex */
    sortCol: import('vue').Ref<string | number | symbol | undefined>;
    /** @see {@link getSortColumns} */
    getSortColumns: typeof getSortColumns;
    /** @see {@link setSorter} */
    setSorter: typeof setSorter;
    /** @see {@link resetSorter} */
    resetSorter: typeof resetSorter;
    /** @see {@link scrollTo} */
    scrollTo: typeof scrollTo;
    /** @see {@link getTableData} */
    getTableData: typeof getTableData;
}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "sort-change": (col: StkTableColumn<any> | null, order: Order, data: any[], sortConfig: SortConfig<any>) => void;
    "row-click": (ev: MouseEvent, row: any) => void;
    "current-change": (ev: MouseEvent | null, row: any, data: {
        select: boolean;
    }) => void;
    "cell-selected": (ev: MouseEvent | null, data: {
        select: boolean;
        row: any;
        col: StkTableColumn<any> | undefined;
    }) => void;
    "row-dblclick": (ev: MouseEvent, row: any) => void;
    "header-row-menu": (ev: MouseEvent) => void;
    "row-menu": (ev: MouseEvent, row: any) => void;
    "cell-click": (ev: MouseEvent, row: any, col: StkTableColumn<any>) => void;
    "cell-mouseenter": (ev: MouseEvent, row: any, col: StkTableColumn<any>) => void;
    "cell-mouseleave": (ev: MouseEvent, row: any, col: StkTableColumn<any>) => void;
    "cell-mouseover": (ev: MouseEvent, row: any, col: StkTableColumn<any>) => void;
    "header-cell-click": (ev: MouseEvent, col: StkTableColumn<any>) => void;
    scroll: (ev: Event, data: {
        startIndex: number;
        endIndex: number;
    }) => void;
    "scroll-x": (ev: Event) => void;
    "col-order-change": (dragStartKey: string, targetColKey: string) => void;
    "th-drag-start": (dragStartKey: string) => void;
    "th-drop": (targetColKey: string) => void;
    "col-resize": (cols: StkTableColumn<any>) => void;
    "update:columns": (cols: StkTableColumn<any>[]) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
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
    /** 行高 */
    rowHeight?: number | undefined;
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
    headerDrag?: boolean | ((col: StkTableColumn<any>) => boolean) | undefined;
    /**
     * 给行附加className<br>
     * FIXME: 是否需要优化，因为不传此prop会使表格行一直执行空函数，是否有影响
     */
    rowClassName?: ((row: any, i: number) => string) | undefined;
    /**
     * 列宽是否可拖动<br>
     * **不要设置**列minWidth，**必须**设置width<br>
     * 列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效。table width会变为"fit-content"。
     */
    colResizable?: boolean | undefined;
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
    /** 隐藏头部title。可传入dataIndex数组 */
    hideHeaderTitle?: boolean | string[] | undefined;
    /** 高亮配置 */
    highlightConfig?: HighlightConfig | undefined;
    /** 序号列配置 */
    seqConfig?: SeqConfig | undefined;
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
}>, {
    width: string;
    fixedMode: boolean;
    stripe: boolean;
    minWidth: string;
    maxWidth: string;
    headless: boolean;
    theme: string;
    rowHeight: number;
    rowHover: boolean;
    rowActive: boolean;
    rowCurrentRevokable: boolean;
    headerRowHeight: null;
    virtual: boolean;
    virtualX: boolean;
    columns: () => never[];
    dataSource: () => never[];
    rowKey: string;
    colKey: string;
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
    cellFixedMode: string;
    smoothScroll: boolean;
}>>> & {
    onScroll?: ((ev: Event, data: {
        startIndex: number;
        endIndex: number;
    }) => any) | undefined;
    "onUpdate:columns"?: ((cols: StkTableColumn<any>[]) => any) | undefined;
    "onCol-resize"?: ((cols: StkTableColumn<any>) => any) | undefined;
    "onTh-drag-start"?: ((dragStartKey: string) => any) | undefined;
    "onCol-order-change"?: ((dragStartKey: string, targetColKey: string) => any) | undefined;
    "onTh-drop"?: ((targetColKey: string) => any) | undefined;
    "onSort-change"?: ((col: StkTableColumn<any> | null, order: Order, data: any[], sortConfig: SortConfig<any>) => any) | undefined;
    "onRow-click"?: ((ev: MouseEvent, row: any) => any) | undefined;
    "onCurrent-change"?: ((ev: MouseEvent | null, row: any, data: {
        select: boolean;
    }) => any) | undefined;
    "onCell-selected"?: ((ev: MouseEvent | null, data: {
        select: boolean;
        row: any;
        col: StkTableColumn<any> | undefined;
    }) => any) | undefined;
    "onRow-dblclick"?: ((ev: MouseEvent, row: any) => any) | undefined;
    "onHeader-row-menu"?: ((ev: MouseEvent) => any) | undefined;
    "onRow-menu"?: ((ev: MouseEvent, row: any) => any) | undefined;
    "onCell-click"?: ((ev: MouseEvent, row: any, col: StkTableColumn<any>) => any) | undefined;
    "onCell-mouseenter"?: ((ev: MouseEvent, row: any, col: StkTableColumn<any>) => any) | undefined;
    "onCell-mouseleave"?: ((ev: MouseEvent, row: any, col: StkTableColumn<any>) => any) | undefined;
    "onCell-mouseover"?: ((ev: MouseEvent, row: any, col: StkTableColumn<any>) => any) | undefined;
    "onHeader-cell-click"?: ((ev: MouseEvent, col: StkTableColumn<any>) => any) | undefined;
    "onScroll-x"?: ((ev: Event) => any) | undefined;
}, {
    width: string;
    minWidth: string;
    maxWidth: string;
    rowHeight: number;
    headerRowHeight: number | null;
    headless: boolean;
    stripe: boolean;
    fixedMode: boolean;
    theme: "light" | "dark";
    rowHover: boolean;
    rowActive: boolean;
    rowCurrentRevokable: boolean;
    virtual: boolean;
    virtualX: boolean;
    columns: StkTableColumn<any>[];
    dataSource: any[];
    rowKey: UniqKeyProp;
    colKey: UniqKeyProp;
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
    headerDrag: boolean | ((col: StkTableColumn<any>) => boolean);
    rowClassName: (row: any, i: number) => string;
    colResizable: boolean;
    colMinWidth: number;
    bordered: boolean | "h" | "v" | "body-v";
    autoResize: boolean | (() => void);
    fixedColShadow: boolean;
    optimizeVue2Scroll: boolean;
    sortConfig: SortConfig<any>;
    hideHeaderTitle: boolean | string[];
    highlightConfig: HighlightConfig;
    seqConfig: SeqConfig;
    cellFixedMode: "sticky" | "relative";
    smoothScroll: boolean;
}, {}>, {
    tableHeader?(_: {
        col: StkTableColumn<any>;
    }): any;
    empty?(_: {}): any;
}>;
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
