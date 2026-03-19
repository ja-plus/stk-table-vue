import { Component, ComputedRef, ConcreteComponent } from 'vue';

/** 排序方式，asc-正序，desc-倒序，null-默认顺序 */
export type Order = null | 'asc' | 'desc';
type Sorter<T> = boolean | ((data: T[], option: {
    order: Order;
    column: any;
}) => T[]);
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
    expanded?: PrivateRowDT['__EXP__'];
    /** if tree expanded */
    treeExpanded?: PrivateRowDT['__T_EXP__'];
};
export type CustomHeaderCellProps<T extends Record<string, any>> = {
    col: StkTableColumn<T>;
    rowIndex: number;
    colIndex: number;
};
export type CustomFooterCellProps<T extends Record<string, any>> = {
    col: StkTableColumn<T>;
    row: T;
    cellValue: any;
    rowIndex: number;
    colIndex: number;
};
export type MergeCellsParam<T extends Record<string, any>> = {
    row: T;
    col: StkTableColumn<T>;
    rowIndex: number;
    colIndex: number;
};
export type MergeCellsFn<T extends Record<string, any>> = (data: MergeCellsParam<T>) => {
    rowspan?: number;
    colspan?: number;
} | undefined;
/**
 * 自定义渲染单元格
 *
 * `StkTableColumn.customCell` 类型直接定义 `Component<Props>` 如果 Props 属性为必选，则 通过`defineComponent` 创建的组件必须要定义所有的Prop，否则就不适配。但是在函数式组件中是正常使用的。customCell: (props) => {}。
 *
 * 如果定义 Props 所有属性均为可选时。`defineComponent` 定义的组件仅需实现个别的 Prop 即可。但是函数式组件的入参props就需要额外判断是否存在。这增加了使用成本。
 *
 * 因此这里重新组合了Component类型
 */
export type CustomCell<T extends CustomCellProps<U> | CustomHeaderCellProps<U>, U extends Record<string, any>> = ConcreteComponent<T> | Exclude<Component<Partial<T>>, ConcreteComponent> | string;
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
    /** 是否隐藏列 */
    hidden?: boolean;
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
    /**
     * 自定义 tfoot td 渲染内容
     *
     * 组件prop入参:
     * @param props.row tfoot行的记录。
     * @param props.col 列配置
     * @param props.cellValue row[col.dataIndex] 的值
     * @param props.rowIndex tfoot行索引（从0开始）
     * @param props.colIndex 列索引
     */
    customFooterCell?: CustomCell<CustomFooterCellProps<T>, T>;
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
    __P__?: StkTableColumn<T> | null;
    /**
     * Save the calculated width. Used for horizontal virtual scrolling.
     * @private
     */
    __W__?: number;
};
/** private row keys */
export type PrivateRowDT = {
    /**
     * Only expanded row will add this key
     *
     * If user define the `__R_K__` in table data, this value will be used as the row key
     * @private
     */
    __R_K__?: string;
    /**
     * if row expanded
     * @private
     */
    __EXP__?: StkTableColumn<any>;
    /**
     * if tree node row expanded
     * @private
     */
    __T_EXP__?: boolean;
    /**
     * tree parent key
     * @private
     */
    __T_P_K__?: UniqKey;
    /**
     * tree level
     * @private
     */
    __T_LV__?: number;
    /** expanded row */
    __EXP_R__?: any;
    /** expanded col */
    __EXP_C__?: StkTableColumn<any>;
    children?: any[];
};
export type SortOption<T extends Record<string, any>> = Pick<StkTableColumn<T>, 'sorter' | 'dataIndex' | 'sortField' | 'sortType'>;
/**
 * 单列排序状态
 */
export type SortState<T extends Record<string, any>> = Pick<StkTableColumn<T>, 'key' | 'dataIndex' | 'sortField' | 'sortType'> & {
    order: Order;
};
export type UniqKey = string | number;
export type UniqKeyFun = (param: any) => UniqKey;
export type UniqKeyProp = UniqKey | UniqKeyFun;
/**
 * 默认排序配置
 */
export type DefaultSortConfig<T extends Record<string, any>> = {
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
export type SortConfig<T extends Record<string, any>> = {
    /**
     * TODO: Sort icon display strategy
     * - only-sort[default]: Only show sort icon in sorted column
     * - always
     * - none
     */
    /**
     * 1. trigger when init
     * 2. trigger when sort direction is null
     */
    defaultSort?: DefaultSortConfig<T>;
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
    /**
     * 是否启用多列排序
     * - false (default): 单列排序，点击新列会取消之前列的排序
     * - true: 多列排序，支持同时按多列排序，通过点击顺序决定优先级
     */
    multiSort?: boolean;
    /**
     * 多列排序时的最大列数限制
     * default: 3
     */
    multiSortLimit?: number;
};
/** th td type */
export declare const enum TagType {
    TH = 0,
    TD = 1,
    /** tfoot */
    TF = 2
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
/** drag row config */
export type DragRowConfig = {
    mode?: 'none' | 'insert' | 'swap';
};
export type TreeConfig = {
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
/** 单元格选区范围 */
export type AreaSelectionRange = {
    startRowIndex: number;
    startColIndex: number;
    endRowIndex: number;
    endColIndex: number;
};
/** 单元格选区配置 */
export type AreaSelectionConfig<T extends Record<string, any> = any> = {
    enabled?: boolean;
    /**
     * 复制时的单元格文本格式化回调。
     * 如果你使用了 customCell 自定义渲染，应该提供此回调以确保复制内容与展示内容一致。
     * @param row 行数据
     * @param col 列配置
     * @param rawValue row[col.dataIndex] 的原始值
     * @returns 复制到剪贴板的文本
     */
    formatCellForClipboard?: (row: T, col: StkTableColumn<T>, rawValue: any) => string;
    /**
     * 是否启用键盘控制选区移动。
     * 启用后，方向键/Tab/Shift+Tab 可控制选区移动，类似 Excel 行为。
     * 启用此功能后，原有的键盘滚动行为将失效。
     * @default false
     */
    keyboard?: boolean;
};
/** 实验性功能配置 */
export type ExperimentalConfig = {
    /** use transform to simulate scroll */
    scrollY?: boolean;
};
/** 表格底部配置 */
export type FooterConfig = {
    /**
     * 表格底部吸附位置
     * - bottom: 吸附在表格底部（默认）
     * - top: 吸附在表格顶部
     */
    position?: 'bottom' | 'top';
};
export {};
