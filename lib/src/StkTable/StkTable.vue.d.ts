import { SortOption, StkTableColumn, UniqKey } from './types/index';
/**
 * 选中一行，
 * @param {string} rowKey
 * @param {boolean} option.silent 是否触发回调
 */
declare function setCurrentRow(rowKey: string, option?: {
    silent: boolean;
}): void;
/**
 * 设置表头排序状态
 * @param {string} dataIndex 列字段
 * @param {'asc'|'desc'|null} order
 * @param {object} option.sortOption 指定排序参数
 * @param {boolean} option.sort 是否触发排序
 * @param {boolean} option.silent 是否触发回调
 */
declare function setSorter(dataIndex: string, order: null | 'asc' | 'desc', option?: {
    sortOption?: SortOption;
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
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    width?: string | undefined;
    /** 最小表格宽度 */
    minWidth?: string | undefined;
    /** 表格最大宽度*/
    maxWidth?: string | undefined;
    /** 是否使用 table-layout:fixed */
    fixedMode?: boolean | undefined;
    /** 是否隐藏表头 */
    headless?: boolean | undefined;
    /** 主题，亮、暗 */
    theme?: "light" | "dark" | undefined;
    /** 虚拟滚动 */
    virtual?: boolean | undefined;
    /** x轴虚拟滚动 */
    virtualX?: boolean | undefined;
    /** 表格列配置 */
    columns?: StkTableColumn<any>[] | undefined;
    /** 表格数据源 */
    dataSource?: any[] | undefined;
    /** 行唯一键 */
    rowKey?: UniqKey | undefined;
    /** 列唯一键 */
    colKey?: UniqKey | undefined;
    /** 空值展示文字 */
    emptyCellText?: string | undefined;
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
    /** 是否增加行hover class */
    showTrHoverClass?: boolean | undefined;
    /** 表头是否可拖动 */
    headerDrag?: boolean | undefined;
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
     */
    autoResize?: boolean | undefined;
}>, {
    width: string;
    fixedMode: boolean;
    minWidth: string;
    maxWidth: string;
    headless: boolean;
    theme: string;
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
    headerDrag: boolean;
    rowClassName: () => "";
    colResizable: boolean;
    colMinWidth: number;
    bordered: boolean;
    autoResize: boolean;
}>, {
    initVirtualScroll: (height?: number | undefined) => void;
    initVirtualScrollX: () => void;
    initVirtualScrollY: (height?: number | undefined) => void;
    setCurrentRow: typeof setCurrentRow;
    setHighlightDimCell: (rowKeyValue: string, dataIndex: string) => void;
    setHighlightDimRow: (rowKeyValues: (string | number)[]) => void;
    sortCol: import("vue").Ref<string | null | undefined>;
    setSorter: typeof setSorter;
    resetSorter: typeof resetSorter;
    scrollTo: typeof scrollTo;
    getTableData: typeof getTableData;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    scroll: (...args: any[]) => void;
    "th-drag-start": (...args: any[]) => void;
    "col-order-change": (...args: any[]) => void;
    "th-drop": (...args: any[]) => void;
    columns: (...args: any[]) => void;
    "sort-change": (...args: any[]) => void;
    "row-click": (...args: any[]) => void;
    "current-change": (...args: any[]) => void;
    "row-dblclick": (...args: any[]) => void;
    "header-row-menu": (...args: any[]) => void;
    "row-menu": (...args: any[]) => void;
    "cell-click": (...args: any[]) => void;
    "header-cell-click": (...args: any[]) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<{
    width?: string | undefined;
    /** 最小表格宽度 */
    minWidth?: string | undefined;
    /** 表格最大宽度*/
    maxWidth?: string | undefined;
    /** 是否使用 table-layout:fixed */
    fixedMode?: boolean | undefined;
    /** 是否隐藏表头 */
    headless?: boolean | undefined;
    /** 主题，亮、暗 */
    theme?: "light" | "dark" | undefined;
    /** 虚拟滚动 */
    virtual?: boolean | undefined;
    /** x轴虚拟滚动 */
    virtualX?: boolean | undefined;
    /** 表格列配置 */
    columns?: StkTableColumn<any>[] | undefined;
    /** 表格数据源 */
    dataSource?: any[] | undefined;
    /** 行唯一键 */
    rowKey?: UniqKey | undefined;
    /** 列唯一键 */
    colKey?: UniqKey | undefined;
    /** 空值展示文字 */
    emptyCellText?: string | undefined;
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
    /** 是否增加行hover class */
    showTrHoverClass?: boolean | undefined;
    /** 表头是否可拖动 */
    headerDrag?: boolean | undefined;
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
     */
    autoResize?: boolean | undefined;
}>, {
    width: string;
    fixedMode: boolean;
    minWidth: string;
    maxWidth: string;
    headless: boolean;
    theme: string;
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
    headerDrag: boolean;
    rowClassName: () => "";
    colResizable: boolean;
    colMinWidth: number;
    bordered: boolean;
    autoResize: boolean;
}>>> & {
    onScroll?: ((...args: any[]) => any) | undefined;
    "onTh-drag-start"?: ((...args: any[]) => any) | undefined;
    "onCol-order-change"?: ((...args: any[]) => any) | undefined;
    "onTh-drop"?: ((...args: any[]) => any) | undefined;
    onColumns?: ((...args: any[]) => any) | undefined;
    "onSort-change"?: ((...args: any[]) => any) | undefined;
    "onRow-click"?: ((...args: any[]) => any) | undefined;
    "onCurrent-change"?: ((...args: any[]) => any) | undefined;
    "onRow-dblclick"?: ((...args: any[]) => any) | undefined;
    "onHeader-row-menu"?: ((...args: any[]) => any) | undefined;
    "onRow-menu"?: ((...args: any[]) => any) | undefined;
    "onCell-click"?: ((...args: any[]) => any) | undefined;
    "onHeader-cell-click"?: ((...args: any[]) => any) | undefined;
}, {
    width: string;
    minWidth: string;
    maxWidth: string;
    colKey: UniqKey;
    fixedMode: boolean;
    headless: boolean;
    theme: "light" | "dark";
    virtual: boolean;
    virtualX: boolean;
    columns: StkTableColumn<any>[];
    dataSource: any[];
    rowKey: UniqKey;
    emptyCellText: string;
    noDataFull: boolean;
    showNoData: boolean;
    sortRemote: boolean;
    showHeaderOverflow: boolean;
    showOverflow: boolean;
    showTrHoverClass: boolean;
    headerDrag: boolean;
    rowClassName: (row: any, i: number) => string;
    colResizable: boolean;
    colMinWidth: number;
    bordered: boolean | "h" | "v" | "body-v";
    autoResize: boolean;
}, {}>, {
    tableHeader?(_: {
        column: StkTableColumn<any>;
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
