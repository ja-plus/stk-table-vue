# Sorting

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

For more sorting methods, please refer to [Custom Sorting](/en/main/table/advanced/custom-sort)

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
When default sorting is set, if **no sorting is applied**, it will sort by the **default sort** field.

Click on the `Name` column in the table below to observe its behavior.
:::
<demo vue="basic/sort/DefaultSort.vue"></demo>

## Using localCompare for String Sorting
After configuring `props.sortConfig.stringLocaleCompare = true`, strings will be sorted using [`String.prototype.localeCompare`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare).

Effect: Chinese characters will be sorted according to the first letter of their pinyin.

## Server-side Sorting

Set `props.sort-remote` to `true`, which will not trigger the component's internal sorting logic.

After clicking the table header, the `@sort-change` event will be triggered. You can initiate an ajax request in the event, then reassign `props.dataSource` to complete the sorting.

```vue
<StkTable sort-remote></StkTable>
```
<demo vue="basic/sort/SortRemote.vue"></demo>

## Tree Node Deep Sorting
After configuring `props.sortConfig.sortChildren = true`, when clicking on the table header to sort, the `children` sub-nodes will also be sorted.

<demo vue="basic/sort/SortChildren.vue"></demo>

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
    /**
     * Default sorting (1. Triggered during initialization 2. Triggered when sorting direction is null)
     * Similar to clicking the table header via setSorter during onMounted.
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
        /** Whether to prohibit triggering the sort-change event. Default false, meaning the event is triggered. */
        silent?: boolean;
    };
    /** Empty values are always placed at the end of the list */
    emptyToBottom?: boolean;
    /**
     * Use `String.prototype.localCompare` to sort strings
     * default: false
     */
    stringLocaleCompare?: boolean;
    /** Whether to also sort child nodes */
    sortChildren?: boolean;
};
```

### @sort-change
defineEmits type:
```ts
/**
 * Triggered when sorting changes. When defaultSort.dataIndex is not found, col will return null.
 *
 * ```(col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>)```
 */
(
    e: 'sort-change',
    /** Sorting column */
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
     * Table sort column order
     */
    getSortColumns,
})
```
For details, see [Expose Instance Methods](/en/main/api/expose)

