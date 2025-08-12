# 自定义排序

`StkTableColumn['sorter']` 可传入自定义排序规则。已经在 [排序章节](/main/table/basic/sort#自定义排序) 中提到过。

本章介绍组件提供的内置排序函数。

## setSorter 方法
实例提供了`setSorter`方法，供用户自行触发排序。比如点击外部按钮，触发表格排序。

```ts
stkTableRef.value?.setSorter('rate', 'desc');
```
<demo vue="advanced/custom-sort/CustomSort/index.vue"></demo>

### 参数说明

```ts
/**
 * 设置表头排序状态。
 * @param colKey 列唯一键字段。如果你想要取消排序状态，请使用`resetSorter`
 * @param order 正序倒序 'asc'|'desc'|null
 * @param option.sortOption 指定排序参数。同 StkTableColumn 中排序相关字段。建议从columns中find得到。
 * @param option.sort 是否触发排序-默认true
 * @param option.silent 是否禁止触发回调-默认true
 * @param option.force 是否触发排序-默认true
 * @returns 返回当前表格数据
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

* `option.force` 为 true 时，即使 `props.sortRemote` 为true，也会触发排序。
* `option.silent` 为 true 时，不会触发 `@sort-change` 回调。
* `option.sortOption` 的作用的是，如果 传入的 `colKey` 不在 `columns` 中，可以指定排序参数。在隐藏某一列时，但仍然要按照那一列的字段排序的情况下有用。
    - 优先级最高，如果配置了这个，则不会用 `colKey` 去找对应的列排序。

## 内置排序函数
可以引入源码导出的排序函数，对齐表格内置的排序行为。
```ts
import { tableSort, insertToOrderedArray } from 'stk-table-vue';
```
### tableSort 表格排序
#### 使用场景
为了获取更好的数据更新性能，可设置`props.sortRemote`来取消表格内置排序。在数据更新时，通过下面提供的 `insertToOrderedArray` 函数插入新数据。

而点击表头触发排序时，我们依然想用内置的排序，则可以在 `@sort-change` 回调中，使用此函数进行排序。

#### 代码示例
```ts
// @sort-change="handleSortChange"
function handleSortChange(col: StkTableColumn<any>, order: Order, data: any[], sortConfig: SortConfig<any>) {
    // 可以做其他操作
    dataSource.value = tableSort(col, order, data, sortConfig);
}
```

#### 参数说明
```ts
/**
 * 表格排序抽离
 * 可以在组件外部自己实现表格排序，组件配置remote，使表格不排序。
 * 使用者在@sort-change事件中自行更改table props 'dataSource'完成排序。
 *
 * sortConfig.defaultSort 会在order为null时生效
 * @param sortOption 列配置
 * @param order 排序方式
 * @param dataSource 排序的数组
 */
export function tableSort<T extends Record<string, any>>(
    sortOption: SortOption<T>,
    order: Order,
    dataSource: T[],
    sortConfig: SortConfig<T> = {},
): T[] 
```

### insertToOrderedArray 二分插入
在实时数据不断更新的场景下，二分插入能够有效减少排序时间，提升性能。
#### 代码示例
```ts
dataSource.value = insertToOrderedArray(tableSortStore, item, dataSource.value);
```
#### 参数说明
```ts
/**
 * 对有序数组插入新数据
 *
 * 注意：不会改变原数组，返回新数组
 * @param sortState 排序状态
 * @param sortState.dataIndex 排序的字段
 * @param sortState.order 排序顺序
 * @param sortState.sortType 排序方式
 * @param newItem 要插入的数据
 * @param targetArray 表格数据
 * @param sortConfig SortConfig参考 https://github.com/ja-plus/stk-table-vue/blob/master/src/StkTable/types/index.ts
 * @param sortConfig.customCompare 自定义比较规则
 * @return targetArray 的浅拷贝
 */
export function insertToOrderedArray<T extends object>(
    sortState: SortState<T>,
    newItem: T,
    targetArray: T[],
    sortConfig: SortConfig<T> & { customCompare?: (a: T, b: T) => number } = {}
): T[] 

```

### 示例
以下示例包含了 `tableSort` 和 `insertToOrderedArray` 的使用。点击插入一行观察插入排序效果。

<demo vue="advanced/custom-sort/InsertSort.vue"></demo>

