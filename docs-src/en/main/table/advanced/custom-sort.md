# Custom Sorting

`StkTableColumn['sorter']` allows custom sorting rules. This was already mentioned in the [Sorting section](/main/table/basic/sort#Custom Sorting).

This chapter introduces the built-in sorting functions provided by the component.

## setSorter Method
The component instance provides a `setSorter` method for users to manually trigger sorting. For example, clicking an external button to trigger table sorting.

```ts
stkTableRef.value?.setSorter('rate', 'desc');
```
<demo vue="advanced/custom-sort/CustomSort/index.vue"></demo>

### Parameter Description

```ts
/**
 * Set the header sorting state.
 * @param colKey Unique column key. To reset sorting state, use `resetSorter`
 * @param order Sort order 'asc'|'desc'|null
 * @param option.sortOption Specify sorting parameters. Same as sorting-related fields in StkTableColumn. Recommended to find from columns.
 * @param option.sort Whether to trigger sorting - default true
 * @param option.silent Whether to prevent triggering callbacks - default true
 * @param option.force Whether to force sorting - default true
 * @returns Returns current table data
 */
function setSorter(
    colKey: string, 
    order: Order,
    option: { 
        sortOption?: SortOption<DT>; 
        force?: boolean; 
        silent?: boolean; 
        sort?: boolean 
    } = {}
): DT[];
```

* When `option.force` is true, sorting will be triggered even if `props.sortRemote` is true.
* When `option.silent` is true, the `@sort-change` callback will not be triggered.
* The purpose of `option.sortOption` is to specify sorting parameters if the passed `colKey` is not in `columns`. Useful when hiding a column but still wanting to sort by that column's field.
    - Highest priority: if configured, it won't use `colKey` to find the corresponding column for sorting.

## Built-in Sorting Functions
You can import sorting functions exported from the source code to align with the table's built-in sorting behavior.
```ts
import { tableSort, insertToOrderedArray } from 'stk-table-vue';
```
### tableSort
#### Usage Scenario
For better data update performance, you can set `props.sortRemote` to disable the table's built-in sorting. When updating data, use the `insertToOrderedArray` function provided below to insert new data.

When clicking the header to trigger sorting, if you still want to use the built-in sorting, you can use this function in the `@sort-change` callback.

#### Code Example
```ts
// @sort-change="handleSortChange"
function handleSortChange(col: StkTableColumn<any>, order: Order, data: any[], sortConfig: SortConfig<any>) {
    // Additional operations can be performed here
    dataSource.value = tableSort(col, order, data, sortConfig);
}
```

#### Parameter Description
```ts
/**
 * Table sorting abstraction
 * You can implement table sorting outside the component by configuring remote sorting.
 * Users can update the table props 'dataSource' in the @sort-change event to complete sorting.
 *
 * sortConfig.defaultSort takes effect when order is null
 * @param sortOption Column configuration
 * @param order Sorting order
 * @param dataSource Array to be sorted
 */
export function tableSort<T extends Record<string, any>>(
    sortOption: SortOption<T>,
    order: Order,
    dataSource: T[],
    sortConfig: SortConfig<T> = {},
): T[] 
```

### insertToOrderedArray
In scenarios where real-time data is constantly updated, binary insertion can effectively reduce sorting time and improve performance.
#### Code Example
```ts
dataSource.value = insertToOrderedArray(tableSortStore, item, dataSource.value);
```
#### Parameter Description
```ts
/**
 * Insert new data into an ordered array
 *
 * Note: Does not modify the original array, returns a new array
 * @param sortState Sorting state
 * @param sortState.dataIndex Field to sort by
 * @param sortState.order Sorting order
 * @param sortState.sortType Sorting method
 * @param newItem Data to be inserted
 * @param targetArray Table data
 * @param sortConfig SortConfig reference https://github.com/ja-plus/stk-table-vue/blob/master/src/StkTable/types/index.ts
 * @param sortConfig.customCompare Custom comparison rule
 * @return Shallow copy of targetArray
 */
export function insertToOrderedArray<T extends object>(
    sortState: SortState<T>,
    newItem: T,
    targetArray: T[],
    sortConfig: SortConfig<T> & { customCompare?: (a: T, b: T) => number } = {}
): T[] 

```

### Example
The following example demonstrates the use of `tableSort` and `insertToOrderedArray`. Click to insert a row and observe the insertion sort effect.

<demo vue="advanced/custom-sort/InsertSort.vue"></demo>

