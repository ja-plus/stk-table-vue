import { Component, ComputedRef, ConcreteComponent } from 'vue';

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

export type MergeCellsParam<T extends Record<string, any>> = {
    row: T;
    col: StkTableColumn<T>;
    rowIndex: number;
    colIndex: number;
};

export type MergeCellsFn<T extends Record<string, any>> = (data: MergeCellsParam<T>) => { rowspan?: number; colspan?: number } | undefined;

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
     * 列唯一键，(可选)，不传则默认取dataIndex 字段作为列唯一键。
     */
    key?: any;
    /**
     * 列类型
     * - seq 序号列
     * - expand 展开列
     * - dragRow 拖拽列(使用sktTableRef.getTableData 获取改变后的顺序)
     * - tree-node 树节点列，这一列前面有展开收起箭头
     */
    type?: 'seq' | 'expand' | 'dragRow' | 'tree-node';
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
    /** 配置当前列的排序规则 */
    sortConfig?: Omit<SortConfig<T>, 'defaultSort'>;
    /** 固定列 */
    fixed?: 'left' | 'right' | null;
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
    /** 单元格合并 */
    mergeCells?: MergeCellsFn<T>;
};

/** private StkTableColumn type. Add some private key */
export type PrivateStkTableColumn<T extends Record<string, any>> = StkTableColumn<T> & {
    /** header rowSpan */
    __R_SP__?: number;
    /** header colSpan */
    __C_SP__?: number;
    /**
     * parent not ref
     * @private
     */
    __PARENT__?: StkTableColumn<T> | null;
    /**
     * Save the calculated width. Used for horizontal virtual scrolling.
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
    __ROW_KEY__?: string;
    /**
     * if row expanded
     * @private
     */
    __EXPANDED__?: StkTableColumn<any> | null;
    /**
     * if tree node row expanded
     * @private
     */
    __T_EXPANDED__?: boolean;
    /**
     * tree parent key
     * @private
     */
    __T_PARENT_K__?: UniqKey;
    /**
     * tree level
     * @private
     */
    __T_LV__?: number;
};

export type SortOption<T extends Record<string, any>> = Pick<StkTableColumn<T>, 'sorter' | 'dataIndex' | 'sortField' | 'sortType'>;

export type SortState<T extends Record<string, any>> = Pick<StkTableColumn<T>, 'dataIndex' | 'sortField' | 'sortType'> & {
    order: Order;
};

export type UniqKey = string | number;
export type UniqKeyFun = (param: any) => UniqKey;
export type UniqKeyProp = UniqKey | UniqKeyFun;

export type SortConfig<T extends Record<string, any>> = {
    /**
     * 1. trigger when init
     * 2. trigger when sort direction is null
     */
    defaultSort?: {
        /**
         * colKey
         *
         * if set `props.colKey`
         *
         * default: StkTableColumn<T>['dataIndex']
         */
        key?: StkTableColumn<T>['key'];
        dataIndex: StkTableColumn<T>['dataIndex'];
        order: Order;
        sortField?: StkTableColumn<T>['sortField'];
        sortType?: StkTableColumn<T>['sortType'];
        sorter?: StkTableColumn<T>['sorter'];
        /**
         * whether to disable trigger`sort-change` event. default: false
         */
        silent?: boolean;
    };
    /** empty value always sort to bottom */
    emptyToBottom?: boolean;
    /**
     * string sort if use `String.prototype.localCompare`
     * default: false
     */
    stringLocaleCompare?: boolean;
    /**
     * whether to sort children when sort current column. default: false
     */
    sortChildren?: boolean;
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
    /** The initial subscript of the sequence number column is used to adapt the paging. */
    startIndex?: number;
};

/** Configuration options for the expand column  */
export type ExpandConfig = {
    /** worked in virtual mode */
    height?: number;
};

export type ExpandedRow = PrivateRowDT & {
    __EXPANDED_ROW__: any;
    __EXPANDED_COL__: any;
};

/** drag row config */
export type DragRowConfig = {
    mode?: 'none' | 'insert' | 'swap';
    // disabled?: (row: T, rowIndex: number) => boolean;
};

export type TreeConfig = {
    // childrenField?: string;
    defaultExpandAll?: boolean;
    defaultExpandKeys?: UniqKey[];
    defaultExpandLevel?: number;
};

/** header drag config */
export type HeaderDragConfig<DT extends Record<string, any> = any> = {
    /**
     * col switch mode
     * - none
     * - insert - (default)
     * - swap
     */
    mode?: 'none' | 'insert' | 'swap';
    /** disabled drag col */
    disabled?: (col: StkTableColumn<DT>) => boolean;
};

export type AutoRowHeightConfig<DT> = {
    /** Estimated row height */
    expectedHeight?: number | ((row: DT) => number);
};

export type ColResizableConfig<DT extends Record<string, any>> = {
    disabled: (col: StkTableColumn<DT>) => boolean;
};

export type RowKeyGen = (row: any) => UniqKey;

export type ColKeyGen = ComputedRef<(col: StkTableColumn<any>) => UniqKey>;

export type CellKeyGen = (row: any, col: StkTableColumn<any>) => string;

export type RowActiveOption<DT> = {
    enabled?: boolean;
    /** disabled row active */
    disabled?: (row: DT) => boolean;
    /** current row again click can revoke active */
    revokable?: boolean;
};
