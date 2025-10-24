# StkTableColumn

Columns Configuration

```vue
<StkTable :columns="columns"></StkTable>
```
::: warning Shallow Watch
The component **does not** deep watch the `columns` property. Therefore, if you find that pushing columns does not take effect, consider updating the reference as follows:
:::

```ts
columns.value = columns.value.slice(); // Update array reference
```

### StkTableColumn Configuration
``` ts
export type StkTableColumn<T extends Record<string, any>> = {
    /**
     * Column unique key (optional). If not provided, the dataIndex field will be used as the column unique key by default.
     */
    key?: any;
    /**
     * Column type
     * - seq: Sequence column
     * - expand: Expandable column
     * - dragRow: Draggable row column (use sktTableRef.getTableData to get the changed order)
     */
    type?: 'seq' | 'expand' | 'dragRow';
    /** Data index */
    dataIndex: keyof T & string;
    /** Header text */
    title?: string;
    /** Column content alignment */
    align?: 'right' | 'left' | 'center';
    /** Header content alignment */
    headerAlign?: 'right' | 'left' | 'center';
    /** Sorting */
    sorter?: Sorter<T>;
    /** Column width. Must be set for horizontal virtual scrolling. */
    width?: string | number;
    /** Minimum column width. Effective when not using horizontal virtual scrolling. */
    minWidth?: string | number;
    /** Maximum column width. Effective when not using horizontal virtual scrolling. */
    maxWidth?: string | number;
    /** th class */
    headerClassName?: string;
    /** td class */
    className?: string;
    /** Sort field. Default: dataIndex */
    sortField?: keyof T;
    /** Sort type. By number/string */
    sortType?: 'number' | 'string';
    /** Fixed column */
    fixed?: 'left' | 'right' | null;
    /** private */ rowSpan?: number;
    /** private */ colSpan?: number;
    /**
     * Custom td rendering content.
     *
     * Component props:
     * @param props.row The record of a row.
     * @param props.col Column configuration
     * @param props.cellValue The value of row[col.dataIndex]
     * @param props.rowIndex Row index
     * @param props.colIndex Column index
     */
    customCell?: Component<CustomCellProps<T>> | string;
    /**
     * Custom th rendering content
     *
     * Component props:
     * @param props.col Column configuration
     * @param props.rowIndex Row index
     * @param props.colIndex Column index
     */
    customHeaderCell?: Component<CustomHeaderCellProps<T>> | string;
    /** Nested header */
    children?: StkTableColumn<T>[];
     /** Cell merging */
    mergeCells?: MergeCellsFn<T>;
};
```

## StkTableColumn.Sorter 
```ts
type Sorter<T> = boolean 
    | ((
        data: T[],
        option: { order: Order; column: any }
    ) => T[]);

```

## StkTableColumn.SortConfig
```ts
/** Sort configuration */
export type SortConfig<T extends Record<string, any>> = {
    /** Empty values always come last in the list */
    emptyToBottom?: boolean;
    /**
     * Default sort (1. Triggered on initialization 2. Triggered when sort direction is null)
     * Similar to calling setSorter and clicking the header when onMounted.
     */
    defaultSort?: {
        dataIndex: keyof T;
        order: Order;
        /** Whether to disable triggering the sort-change event. Default false, meaning the event is triggered. */
        silent?: boolean;
    };
    /**
     * Whether to use String.prototype.localCompare for string sorting
     * Default true ($*$ should be false)
     */
    stringLocaleCompare?: boolean;
    /** Whether to sort child items. Default false (v0.8.8)*/
    sortChildren?: boolean;
};
```

## StkTableColumn.MergeCellsFn

```ts
export type MergeCellsParam<T extends Record<string, any>> = {
    row: T;
    col: StkTableColumn<T>;
    rowIndex: number;
    colIndex: number;
};

export type MergeCellsFn<T extends Record<string, any>> =
    (data: MergeCellsParam<T>) => 
        { 
            rowspan?: number; 
            colspan?: number 
        } | undefined;
```