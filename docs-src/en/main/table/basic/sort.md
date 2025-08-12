# Sort

## Basic Sorting
Set `StkTableColumn['sorter']` to `true` in column configuration to enable sorting.

Click the table header to trigger sorting.
<demo vue="basic/sort/Sort.vue"></demo>

## Custom Sorting
`StkTableColumn['sorter']` can be set to a function in column configuration.

Customize sorting rules through `sorter(data, { column, order })`.

This function will be triggered during sorting, and the table will display using the **return value** of the function.

| Parameter | Type | Description |
| ---- | ---- | ---- |
| data| DataType[] | Table data. |
| column | StkTableColumn | Currently sorted column.
| order | `'desc'` \| `'asc'` \| `null` | Current sorting order.

The following table customizes the size sorting rules for the `Rate` column field.
<demo vue="basic/sort/CustomSort.vue"></demo>

For more sorting methods, please refer to [Custom Sorting](/main/table/advanced/custom-sort)

## sortField Sorting Field
Some fields may use independent fields for sorting, such as year, month, and day fields. In this case, you can provide a special sorting field where year and month are converted to the smallest unit (day) for easy sorting. Specify this sorting field through `sortField`.

The `period` column in the following table specifies `periodNumber` as the sorting field.
<demo vue="basic/sort/SortField.vue"></demo>

## Empty Fields Excluded from Sorting
Configure `props.sortConfig.emptyToBottom` to always place empty fields at the bottom of the list
```vue
<StkTable :sort-config="{emptyToBottom: true}"></StkTable>
```
<demo vue="basic/sort/SortEmptyValue.vue"></demo>

## Specify Default Sort Column
Configure `props.sortConfig.defaultSort` to control the default sorting.
::: warning
When default sorting is set, if there is **no sorting**, the **default sorting** field will be sorted.

Click the `Name` column in the table below to sort and observe its behavior.
:::
<demo vue="basic/sort/DefaultSort.vue"></demo>


## Server-side Sorting

Set `props.sort-remote` to `true`, which will not trigger the component's internal sorting logic.

After clicking the table header, the `@sort-change` event will be triggered. You can initiate an ajax request in the event, then reassign `props.dataSource` to complete the sorting.

```vue
<StkTable sort-remote></StkTable>
```
<demo vue="basic/sort/SortRemote.vue"></demo>

## API
### StkTableColumn Configuration

`StkTableColumn` configuration parameters.
``` ts
const columns: StkTableColumn[] = [{
    sorter: true,
    sortField: 'xxx',
    sortType: 'number',
}]
``` 
| Parameter | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| sorter | `boolean` \| `((data: T[], option: { order: Order; column: any }) => T[])` | `false` | Specify whether to enable sorting. |
| sortField | `string` | Same as StkTableColumn['dataIndex']  | Specify the sorting field. |
| sortType | `'string'` \| `'number'` | Automatically detects the data type of the first row of the column to determine `'string'` or `'number'` sorting. | Specify the sorting type. |

### props.sortConfig
SortConfig type:
```ts
type SortConfig<T extends Record<string, any>> = {
    /** Empty values are always placed at the end of the list */
    emptyToBottom?: boolean;
    /**
     * Default sorting (1. Triggered during initialization 2. Triggered when sorting direction is null)
     * Similar to calling setSorter and clicking the table header during onMounted.
     */
    defaultSort?: {
        /**
         * Column unique key,
         *
         * If you have configured `props.colKey`, this represents the value of the column unique key
         */
        key?: StkTableColumn<T>['key'];
        dataIndex: StkTableColumn<T>['dataIndex'];
        order: Order;
        sortField?: StkTableColumn<T>['sortField'];
        sortType?: StkTableColumn<T>['sortType'];
        sorter?: StkTableColumn<T>['sorter'];
        /** Whether to prevent triggering the sort-change event. Default is false, meaning the event is triggered. */
        silent?: boolean;
    };
    /**
     * string sort if use `String.prototype.localCompare`
     * default: false
     */
    stringLocaleCompare?: boolean;
};
```

### @sort-change
defineEmits type:
```ts
/**
 * Triggered when sorting changes. If defaultSort.dataIndex is not found, col will return null.
 *
 * ```(col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>)```
 */
(
    e: 'sort-change',
    /** Sorted column */
    col: StkTableColumn<DT> | null, 
    /** Ascending/descending order */
    order: Order,
    /** Sorted values */
    data: DT[], 
    sortConfig: SortConfig<DT>
): void;

```

### Expose
```ts
defineExpose({
    /**
     * Set table header sorting state
     */
    setSorter,
    /**
     * Reset sorter state
     */
    resetSorter,
    /**
     * Table sorted column order
     */
    getSortColumns,
})
```
For details, refer to [Expose Instance Methods](/main/api/expose)

