import { Component, VNode } from 'vue';
/** 排序方式，asc-正序，desc-倒序，null-默认顺序 */
export type Order = null | 'asc' | 'desc';
type Sorter = boolean | ((data: any[], option: {
    order: Order;
    column: any;
}) => any[]);
export type CustomCellFunc<T extends Record<string, any>> = (props: {
    row: T;
    col: StkTableColumn<T>;
    cellValue: any;
}) => VNode;
export type CustomHeaderCellFunc<T extends Record<string, any>> = (props: {
    col: StkTableColumn<T>;
}) => VNode;
/** 表格列配置 */
export type StkTableColumn<T extends Record<string, any>> = {
    /** 取值id */
    dataIndex: keyof T & string;
    /** 表头文字 */
    title?: string;
    /** 列内容对齐方式 */
    align?: 'right' | 'left' | 'center';
    /** 表头内容对齐方式 */
    headerAlign?: 'right' | 'left' | 'center';
    /** 筛选 */
    sorter?: Sorter;
    /** 列宽。横向虚拟滚动时必须设置。 */
    width?: string;
    /** 最小列宽。非x虚拟滚动生效。 */
    minWidth?: string;
    /** 最大列宽。非x虚拟滚动生效。 */
    maxWidth?: string;
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
    /**自定义 td 渲染内容 */
    customCell?: Component | VNode | CustomCellFunc<T>;
    /** 自定义 th 渲染内容 */
    customHeaderCell?: Component | VNode | CustomHeaderCellFunc<T>;
    /** 二级表头 */
    children?: StkTableColumn<T>[];
};
export type SortOption = Pick<StkTableColumn<any>, 'sorter' | 'dataIndex' | 'sortField' | 'sortType'>;
export type SortState<T> = {
    dataIndex: T;
    order: null | 'asc' | 'desc';
    sortType?: 'number' | 'string';
};
export type UniqKey = string | ((param: any) => string);
export type StkProps = Partial<{
    width: string;
    /** 最小表格宽度 */
    minWidth: string;
    /** 表格最大宽度*/
    maxWidth: string;
    /** 是否使用 table-layout:fixed */
    fixedMode: boolean;
    /** 是否隐藏表头 */
    headless: boolean;
    /** 主题，亮、暗 */
    theme: 'light' | 'dark';
    /** 虚拟滚动 */
    virtual: boolean;
    /** x轴虚拟滚动 */
    virtualX: boolean;
    /** 表格列配置 */
    columns: StkTableColumn<any>[];
    /** 表格数据源 */
    dataSource: any[];
    /** 行唯一键 */
    rowKey: UniqKey;
    /** 列唯一键 */
    colKey: UniqKey;
    /** 空值展示文字 */
    emptyCellText: string;
    /** 暂无数据兜底高度是否撑满 */
    noDataFull: boolean;
    /** 是否展示暂无数据 */
    showNoData: boolean;
    /** 是否服务端排序，true则不排序数据 */
    sortRemote: boolean;
    /** 表头是否溢出展示... */
    showHeaderOverflow: boolean;
    /** 表体溢出是否展示... */
    showOverflow: boolean;
    /** 是否增加行hover class */
    showTrHoverClass: boolean;
    /** 表头是否可拖动 */
    headerDrag: boolean;
    /**
     * 给行附加className<br>
     * FIXME: 是否需要优化，因为不传此prop会使表格行一直执行空函数，是否有影响
     */
    rowClassName: (row: any, i: number) => string;
    /**
     * 列宽是否可拖动<br>
     * **不要设置**列minWidth，**必须**设置width<br>
     * 列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效。table width会变为"fit-content"。
     */
    colResizable: boolean;
    /** 可拖动至最小的列宽 */
    colMinWidth: number;
    /**
     * 单元格分割线。
     * 默认横竖都有
     * horizontal - 仅展示横线
     */
    border: boolean | 'horizontal';
}>;
export {};
