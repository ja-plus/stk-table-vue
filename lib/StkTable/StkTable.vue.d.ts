/**
 * @author JA+
 * 不支持低版本浏览器非虚拟滚动表格的表头固定，列固定，因为会卡。
 * TODO:存在的问题：
 * [] column.dataIndex 作为唯一键，不能重复
 * [] 计算的高亮颜色，挂在数据源上对象上，若多个表格使用同一个数据源对象会有问题。需要深拷贝。(解决方案：获取组件uid)
 * [] highlight-row 颜色不能恢复到active的颜色
 */
import { SortOption, StkTableColumn } from '../StkTable/types/index';
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
/** 滚动 */
declare function scrollTo(top?: number, left?: number): void;
/** 获取当前状态的表格数据 */
declare function getTableData(): any[];
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Partial<{
    width: string;
    minWidth: string;
    maxWidth: string;
    fixedMode: boolean;
    headless: boolean;
    theme: "light" | "dark";
    virtual: boolean;
    virtualX: boolean;
    columns: StkTableColumn<any>[];
    dataSource: any[];
    rowKey: import('../StkTable/types/index').UniqKey;
    colKey: import('../StkTable/types/index').UniqKey;
    emptyCellText: string;
    noDataFull: boolean;
    showNoData: boolean;
    sortRemote: boolean;
    showHeaderOverflow: boolean;
    showOverflow: boolean;
    showTrHoverClass: boolean;
    headerDrag: boolean;
    rowClassName: (row: any, i: number) => string;
    /** rowKey缓存 */
    colResizable: boolean;
    colMinWidth: number;
}>>, {
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
}>, {
    setCurrentRow: typeof setCurrentRow;
    setHighlightDimCell: (rowKeyValue: string, dataIndex: string) => void;
    setHighlightDimRow: (rowKeyValues: (string | number)[]) => void;
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
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Partial<{
    width: string;
    minWidth: string;
    maxWidth: string;
    fixedMode: boolean;
    headless: boolean;
    theme: "light" | "dark";
    virtual: boolean;
    virtualX: boolean;
    columns: StkTableColumn<any>[];
    dataSource: any[];
    rowKey: import('../StkTable/types/index').UniqKey;
    colKey: import('../StkTable/types/index').UniqKey;
    emptyCellText: string;
    noDataFull: boolean;
    showNoData: boolean;
    sortRemote: boolean;
    showHeaderOverflow: boolean;
    showOverflow: boolean;
    showTrHoverClass: boolean;
    headerDrag: boolean;
    rowClassName: (row: any, i: number) => string;
    /** rowKey缓存 */
    colResizable: boolean;
    colMinWidth: number;
}>>, {
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
    colKey: import('../StkTable/types/index').UniqKey;
    fixedMode: boolean;
    headless: boolean;
    theme: "light" | "dark";
    virtual: boolean;
    virtualX: boolean;
    columns: StkTableColumn<any>[];
    dataSource: any[];
    rowKey: import('../StkTable/types/index').UniqKey;
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
