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

点击下方表格 `姓名` 列排序观察其行为。
:::
<demo vue="basic/sort/DefaultSort.vue"></demo>

## 使用localCompare 排序String
配置 `props.sortConfig.stringLocaleCompare = true` 后，会使用 [`String.prototype.localeCompare`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) 对字符串排序。

作用: 中文会按照拼音首字母排序。

## 服务端排序

配置 `props.sort-remote` 为 `true`，这样就不会触发组件内部的排序逻辑。

点击表头后，会触发 `@sort-change` 事件，您可以在事件中发起 ajax 请求，然后重新对 `props.dataSource` 赋值，完成排序。

```vue
<StkTable sort-remote></StkTable>
```
<demo vue="basic/sort/SortRemote.vue"></demo>

## 树节点深度排序
配置 `props.sortConfig.sortChildren = true` 后，点击表头排序时，会对 `children` 子节点也进行排序。

<demo vue="basic/sort/SortChildren.vue"></demo>

## 多列排序 <Badge type="tip" text="^0.11.2" />

配置 `props.sortConfig.multiSort = true` 即可开启多列排序模式。

在多列排序模式下：
- 点击不同的列会同时保持多个排序条件
- 先点击的列优先级更高（排序时先按该列排序）
- 再次点击同一列切换排序方向（desc → asc → null）
- 第三次点击取消该列排序
- 可通过 `props.sortConfig.multiSortLimit` 限制最大排序列数（默认 3）

<demo vue="basic/sort/MultiSort.vue"></demo>

## API
### StkTableColumn列配置

`StkTableColumn` 列配置中与排序相关的参数。

```ts
const columns: StkTableColumn[] = [{
    sorter: true,
    sortField: 'xxx',
    sortType: 'number',
    sortConfig: Omit<SortConfig<T>, 'defaultSort'>;
}]
```

| 参数 | 类型 | 默认值 | 说明 |
| ---- | ---- | ---- | ---- |
| sorter | `boolean` \| `((data: T[], option: { order: Order; column: any }) => T[])` | `false` | 指定是否开启排序。为 `true` 时开启默认排序；为函数时使用自定义排序规则。 |
| sortField | `string` | 同 `dataIndex` | 指定排序的字段。当需要使用不同于显示字段的数据进行排序时使用。 |
| sortType | `'string'` \| `'number'` | 自动检测 | 指定排序的类型。默认自动检测该列第一行的数据类型。 |
| sortConfig | `Omit<SortConfig<T>, 'defaultSort'>` | - | 配置当前列的排序规则，优先级高于全局 `props.sortConfig`。 |

### props.sortConfig

全局排序配置。

```ts
type SortConfig<T extends Record<string, any>> = {
    /**
     * 默认排序（1.初始化时触发 2.排序方向为null时触发）
     * 类似 onMounted 时调用 setSorter 点了下表头
     */
    defaultSort?: {
        /** 列唯一键，如果配置了 props.colKey 则这里表示列唯一键的值 */
        key?: StkTableColumn<T>['key'];
        /** 排序字段 */
        dataIndex: StkTableColumn<T>['dataIndex'];
        /** 排序方向 */
        order: Order;
        /** 指定排序字段 */
        sortField?: StkTableColumn<T>['sortField'];
        /** 排序类型 */
        sortType?: StkTableColumn<T>['sortType'];
        /** 自定义排序函数 */
        sorter?: StkTableColumn<T>['sorter'];
        /** 是否禁止触发 sort-change 事件，默认 false */
        silent?: boolean;
    };
    /** 空值始终排在列表末尾 */
    emptyToBottom?: boolean;
    /** 使用 String.prototype.localeCompare 对字符串排序，默认 false */
    stringLocaleCompare?: boolean;
    /** 是否对子节点也进行排序，默认 false */
    sortChildren?: boolean;
    /** 是否启用多列排序，默认 false */
    multiSort?: boolean;
    /** 多列排序时的最大列数限制，默认 3 */
    multiSortLimit?: number;
};
```

| 参数 | 类型 | 默认值 | 说明 |
| ---- | ---- | ---- | ---- |
| defaultSort | `object` | - | 默认排序配置。初始化时和排序方向为 null 时触发。 |
| defaultSort.key | `string` | - | 列唯一键。 |
| defaultSort.dataIndex | `string` | - | 排序字段，**必填**。 |
| defaultSort.order | `Order` | - | 排序方向：`'asc'` \| `'desc'` \| `null`，**必填**。 |
| defaultSort.silent | `boolean` | `false` | 是否禁止触发 `sort-change` 事件。 |
| emptyToBottom | `boolean` | `false` | 空值是否始终排在列表末尾。 |
| stringLocaleCompare | `boolean` | `false` | 是否使用 `localeCompare` 对字符串排序（中文按拼音排序）。 |
| sortChildren | `boolean` | `false` | 树形数据下，是否对子节点也进行排序。 |
| multiSort | `boolean` | `false` | 是否启用多列排序模式。 |
| multiSortLimit | `number` | `3` | 多列排序时的最大列数限制。 |

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
     * 重置 sorter 状态
     */
    resetSorter,
    /**
     * 表格排序列顺序
     */
    getSortColumns,
    /**
     * 多列排序状态数组（多列排序模式时使用）
     */
    sortStates,
})
```
详情参考 [Expose 实例方法](/main/api/expose)

