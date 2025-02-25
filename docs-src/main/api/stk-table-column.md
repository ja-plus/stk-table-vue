# StkTableColumn

传入的columns配置项

```vue
<StkTable :columns="columns"></StkTable>
```
::: warning 
组件内部**没有**深度监听(deep watch) `columns` 属性，因此如果您发现 push 列不生效，则考虑使用如下方式更新表格列配置。
:::

```ts
columns.value = [...columns.value]; // 触发更新
```

### StkTableColumn 列配置
``` ts
type Sorter<T> = boolean | ((data: T[], option: { order: Order; column: any }) => T[]);
export type StkTableColumn<T extends Record<string, any>> = {
   /**
     * 用于区分相同dataIndex 的列。
     * 需要自行配置colKey="(col: StkTableColumn<any>) => col.key ?? col.dataIndex"
     */
    key?: any;
    /**
     * 列类型
     * - seq 序号列
     * - expand 展开列
     * - dragRow 拖拽列(使用sktTableRef.getTableData 获取改变后的顺序)
     */
    type?: 'seq' | 'expand' | 'dragRow';
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
    customCell?: Component<CustomCellProps<T>> | string;
    /**
     * 自定义 th 渲染内容
     *
     * 组件prop入参:
     * @param props.col 列配置
     * @param props.rowIndex 行索引
     * @param props.colIndex 列索引
     */
    customHeaderCell?: Component<CustomHeaderCellProps<T>> | string;
    /** 二级表头 */
    children?: StkTableColumn<T>[];
};
```

## StkTableColumn.SortConfig
```ts
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
     * 默认true ($*$应该false)
     */
    stringLocaleCompare?: boolean;
};
```