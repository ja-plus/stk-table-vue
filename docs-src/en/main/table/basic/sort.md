# 排序


## 基础排序
列配置中`StkTableColumn['sorter']` 设置为 `true` 即可开启排序。

点击表头即可触发排序。
<demo vue="basic/sort/Sort.vue"></demo>

## 自定义排序
列配置中`StkTableColumn['sorter']` 可以设置为一个函数。

通过 `sorter(data, { column, order })` 自定义排序规则。

该函数会在排序时触发，表格将使用函数的**返回值**展示。

| 参数 | 类型 | 说明 |
| ---- | ---- | ---- |
| data| DataType[] | 表格的数据。 |
| column | StkTableColumn | 当前排序的列。
| order | `'desc'` \| `'asc'` \| `null` | 当前排序的顺序。

下述表格中自定义了 `Rate` 列字段的大小排序规则。
<demo vue="basic/sort/CustomSort.vue"></demo>

更多排序用法请移步 [自定义排序](/main/table/advanced/custom-sort)

## sortField 排序字段
有些字段可能会使用独立的字段来排序，比如年、月、日字段，此时可提供的一个排序专用字段，年、月都转换为最小单位日，便于排序，此时通过 `sortField` 指定该排序字段。

下面表格 `period` 列指定了 `periodNumber` 作为排序字段。
<demo vue="basic/sort/SortField.vue"></demo>

## 空字段不参与排序
配置 `props.sortConfig.emptyToBottom` 空字段将始终置于列表底部
```vue
<StkTable :sort-config="{emptyToBottom: true}"></StkTable>
```
<demo vue="basic/sort/SortEmptyValue.vue"></demo>

## 指定默认排序列
配置 `props.sortConfig.defaultSort` 控制默认排序。
::: warning
设置了默认排序时，如果**没有排序**则会排序**默认排序**字段。

点击下方表格 `Name` 列排序观察其行为。
:::
<demo vue="basic/sort/DefaultSort.vue"></demo>


## 服务端排序

配置 `props.sort-remote` 为 `true`，这样就不会触发组件内部的排序逻辑。

点击表头后，会触发 `@sort-change` 事件，您可以在事件中发起 ajax 请求，然后重新对 `props.dataSource` 赋值，完成排序。

```vue
<StkTable sort-remote></StkTable>
```
<demo vue="basic/sort/SortRemote.vue"></demo>

## API
### StkTableColumn列配置

`StkTableColumn` 列配置参数。
``` ts
const columns: StkTableColumn[] = [{
    sorter: true,
    sortField: 'xxx',
    sortType: 'number',
}]
``` 
| 参数 | 类型 | 默认值| 说明 |
| ---- | ---- | ---- | ---- |
| sorter | `boolean` \| `((data: T[], option: { order: Order; column: any }) => T[])` | `false` | 指定是否开启排序。 |
| sortField | `string` | 同 StkTableColumn['dataIndex']  | 指定排序的字段。 |
| sortType | `'string'` \| `'number'` | 默认检测该列第一行的数据类型，判断 `'string'` 或 `'number'` 排序。| 指定排序的类型。 |

### props.sortConfig
SortConfig 类型：
```ts
type SortConfig<T extends Record<string, any>> = {
    /** 空值始终排在列表末尾 */
    emptyToBottom?: boolean;
    /**
     * 默认排序（1.初始化时触发 2.排序方向为null时触发)
     * 类似onMounted时，调用setSorter点了下表头。
     */
    defaultSort?: {
        /**
         * 列唯一键，
         *
         * 如果您配了 `props.colKey` 则这里表示的列唯一键的值
         */
        key?: StkTableColumn<T>['key'];
        dataIndex: StkTableColumn<T>['dataIndex'];
        order: Order;
        sortField?: StkTableColumn<T>['sortField'];
        sortType?: StkTableColumn<T>['sortType'];
        sorter?: StkTableColumn<T>['sorter'];
        /** 是否禁止触发sort-change事件。默认false，表示触发事件。 */
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
defineEmits 类型：
```ts
/**
 * 排序变更触发。defaultSort.dataIndex 找不到时，col 将返回null。
 *
 * ```(col: StkTableColumn<DT> | null, order: Order, data: DT[], sortConfig: SortConfig<DT>)```
 */
(
    e: 'sort-change',
    /** 排序的列 */
    col: StkTableColumn<DT> | null, 
    /** 正序/倒序 */
    order: Order,
    /** 排序后的值 */
    data: DT[], 
    sortConfig: SortConfig<DT>
): void;

```

### Expose
```ts
defineExpose({
    /**
     * 设置表头排序状态
     */
    setSorter,
    /**
     * 重置sorter状态
     */
    resetSorter,
    /**
     * 表格排序列顺序
     */
    getSortColumns,
})
```
详情参考 [Expose 实例方法](/main/api/expose)

