import { Component, ConcreteComponent, VNode } from 'vue';

/** 排序方式，asc-正序，desc-倒序，null-默认顺序 */
export type Order = null | 'asc' | 'desc';

type Sorter<T> = boolean | ((data: T[], option: { order: Order; column: any }) => T[]);

export type CustomCellProps<T extends Record<string, any>> = {
    row: T;
    col: StkTableColumn<T>;
    /** row[col.dataIndex] 的值 */
    cellValue: any;
    rowIndex: number;
    colIndex: number;
    /**
     * 当前行是否展开
     * - 不展开: null
     * - 展开: 返回column配置
     */
    expanded?: PrivateRowDT['__EXPANDED__'];
};

export type CustomHeaderCellProps<T extends Record<string, any>> = {
    col: StkTableColumn<T>;
    rowIndex: number;
    colIndex: number;
};

/**
 * 自定义渲染单元格
 *
 * `StkTableColumn.customCell` 类型直接定义 `Component<Props>` 如果 Props 属性为必选，则 通过`defineComponent` 创建的组件必须要定义所有的Prop，否则就不适配。但是在函数式组件中是正常使用的。customCell: (props) => {}。
 *
 * 如果定义 Props 所有属性均为可选时。`defineComponent` 定义的组件仅需实现个别的 Prop 即可。但是函数式组件的入参props就需要额外判断是否存在。这增加了使用成本。
 *
 * 因此这里重新组合了Component类型
 */
export type CustomCell<T extends CustomCellProps<U> | CustomHeaderCellProps<U>, U extends Record<string, any>> =
    | ConcreteComponent<T>
    | Exclude<Component<Partial<T>>, ConcreteComponent>
    | string;

/** 表格列配置 */
export type StkTableColumn<T extends Record<string, any>> = {
    /**
     * 列类型
     * - seq 序号列
     * - expand 展开列
     */
    type?: 'seq' | 'expand';
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
     * @param props.row 一行的记录。
     * @param props.col 列配置
     * @param props.cellValue row[col.dataIndex] 的值
     * @param props.rowIndex 行索引
     * @param props.colIndex 列索引
     */
    customCell?: CustomCell<CustomCellProps<T>, T>;
    /**
     * 自定义 th 渲染内容
     *
     * 组件prop入参:
     * @param props.col 列配置
     * @param props.rowIndex 行索引
     * @param props.colIndex 列索引
     */
    customHeaderCell?: CustomCell<CustomHeaderCellProps<T>, T>;
    /** 二级表头 */
    children?: StkTableColumn<T>[];
};

/** private StkTableColumn type. Add some private key */
export type PrivateStkTableColumn<T extends Record<string, any>> = StkTableColumn<T> & {
    /**
     * 父节点引用
     * @private
     */
    __PARENT__?: StkTableColumn<T> | null;
    /**
     * 保存计算的宽度。横向虚拟滚动用。
     * @private
     */
    __WIDTH__?: number;
};
/** private row keys */
export type PrivateRowDT = {
    /**
     * Only expanded row will add this key
     *
     * If user define the `__ROW_KEY__` in table data, this value will be used as the row key
     * @private
     */
    __ROW_KEY__: string;
    /**
     * if row expanded
     * @private
     */
    __EXPANDED__?: StkTableColumn<any> | null;
};

export type SortOption<T extends Record<string, any>> = Pick<StkTableColumn<T>, 'sorter' | 'dataIndex' | 'sortField' | 'sortType'>;

export type SortState<T> = {
    dataIndex: keyof T;
    order: Order;
    sortType?: 'number' | 'string';
};

export type UniqKey = string | number;
export type UniqKeyFun = (param: any) => UniqKey;
export type UniqKeyProp = UniqKey | UniqKeyFun;

export type SortConfig<T extends Record<string, any>> = {
    /** 空值始终排在列表末尾 */
    emptyToBottom?: boolean;
    /**
     * 默认排序（1.初始化时触发 2.排序方向为null时触发)
     * 类似onMounted时，调用setSorter点了下表头。
     */
    defaultSort?: {
        dataIndex: StkTableColumn<T>['dataIndex'];
        order: Order;
        sortField?: StkTableColumn<T>['sortField'];
        sortType?: StkTableColumn<T>['sortType'];
        sorter?: StkTableColumn<T>['sorter'];
        /** 是否禁止触发sort-change事件。默认false，表示触发事件。 */
        silent?: boolean;
    };
    /**
     * string排序是否使用 String.prototype.localCompare
     * 默认true ($*$应该false)
     */
    stringLocaleCompare?: boolean;
};

/** th td type */
export const enum TagType {
    TH,
    TD,
}

export type HighlightConfig = {
    /** Duration of the highlight in seconds */
    duration?: number;
    /** Frame rate of the highlight */
    fps?: number;
};

/**
 * Configuration options for the sequence column.
 */
export type SeqConfig = {
    /** 序号列起始下标 用于适配分页 */
    startIndex?: number;
};

/** Configuration options for the expand column  */
export type ExpandConfig = {
    height?: number;
};

export type ExpandedRow = PrivateRowDT & {
    __EXPANDED_ROW__: any;
    __EXPANDED_COL__: any;
};
