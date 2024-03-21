import { Component, VNode } from 'vue';

/** 排序方式，asc-正序，desc-倒序，null-默认顺序 */
export type Order = null | 'asc' | 'desc';

type Sorter<T> = boolean | ((data: T[], option: { order: Order; column: any }) => T[]);

export type CustomCellFunc<T extends Record<string, any>> = (props: { row: T; col: StkTableColumn<T>; cellValue: any }) => VNode;
export type CustomHeaderCellFunc<T extends Record<string, any>> = (props: { col: StkTableColumn<T> }) => VNode;

/** 表格列配置 */
export type StkTableColumn<T extends Record<string, any>> = {
    /**
     * 列类型
     * - seq 序号列
     */
    type?: 'seq';
    /** 取值id */
    dataIndex: keyof T & string;
    /** 表头文字 */
    title?: string;
    /** 列内容对齐方式 */
    align?: 'right' | 'left' | 'center';
    /** 表头内容对齐方式 */
    headerAlign?: 'right' | 'left' | 'center';
    /** 筛选 */
    sorter?: Sorter<T>;
    /** 列宽。横向虚拟滚动时必须设置。 */
    width?: string | number;
    /** 最小列宽。非x虚拟滚动生效。 */
    minWidth?: string | number;
    /** 最大列宽。非x虚拟滚动生效。 */
    maxWidth?: string | number;
    /**th class */
    headerClassName?: string;
    /** td class */
    className?: string;
    /** 排序字段。default: dataIndex */
    sortField?: keyof T;
    /** 排序方式。按数字/字符串 */
    sortType?: 'number' | 'string';
    /** 固定列 */
    fixed?: 'left' | 'right' | null;
    /** private */ rowSpan?: number;
    /** private */ colSpan?: number;
    /**
     * 自定义 td 渲染内容。
     *
     * 组件prop入参:
     * - props.row 一行的记录。
     * - props.col 列配置
     */
    customCell?: Component | VNode | CustomCellFunc<T>;
    /**
     * 自定义 th 渲染内容
     *
     * 组件prop入参:
     * - props.col 列配置
     */
    customHeaderCell?: Component | VNode | CustomHeaderCellFunc<T>;
    /** 二级表头 */
    children?: StkTableColumn<T>[];
    /** 父节点引用 */
    __PARENT__?: StkTableColumn<T> | null;
    /** 保存计算的宽度。横向虚拟滚动用。 */
    __WIDTH__?: number;
};

export type SortOption<T extends Record<string, any>> = Pick<StkTableColumn<T>, 'sorter' | 'dataIndex' | 'sortField' | 'sortType'>;

/** 排序状态 */
export type SortState<T> = {
    dataIndex: T;
    order: null | 'asc' | 'desc';
    sortType?: 'number' | 'string';
};

/** 唯一键 */
export type UniqKey = string | number;
export type UniqKeyFun = (param: any) => UniqKey;
export type UniqKeyProp = UniqKey | UniqKeyFun;

/** 排序配置 */
export type SortConfig<T extends Record<string, any>> = {
    /** 空值始终排在列表末尾 */
    emptyToBottom?: boolean;
    /**
     * 默认排序（1.初始化时触发 2.排序方向为null时触发)
     * 类似onMounted时，调用setSorter点了下表头。
     */
    defaultSort?: {
        dataIndex: keyof T;
        order: Order;
        /** 是否禁止触发sort-change事件。默认false，表示触发事件。 */
        silent?: boolean;
    };
    /**
     * string排序是否使用 String.prototype.localCompare
     * 默认true (&$&应该false)
     */
    stringLocaleCompare?: boolean;
};

/** th td类型 */
export const enum TagType {
    TH,
    TD,
}

/** 高亮配置 */
export type HighlightConfig = {
    /** 高亮持续时间(s) */
    duration?: number;
    /** 高亮帧率 */
    fps?: number;
};

/** 序号列配置 */
export type SeqConfig = {
    /** 序号列起始下标 用于适配分页 */
    startIndex?: number;
};
