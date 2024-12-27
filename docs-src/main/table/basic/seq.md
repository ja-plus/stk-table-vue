# 序号列

通过 `StkTableColumn['type']`设为`seq` 即可使用组件内置的序号列。

::: tip
序号列不会被排序影响，依赖 `props.data-source` 数组下标展示。
:::

```ts
const columns: StkTableColumn<any>[] = [
    { type: 'seq', width: 50, dataIndex: '', title: '序号' }, // [!code ++]
    { title: 'Name', dataIndex: 'name', sorter: true },
    { title: 'Age', dataIndex: 'age', sorter: true },
    { title: 'Address', dataIndex: 'address', sorter: true },
    { title: 'Gender', dataIndex: 'gender', sorter: true },
];
```

这里可以看到`seq`列的 `dataIndex` 为空，因为 `dataIndex` 除了作为取值字段之外，也用作v-for 渲染依赖的key，而序号列不需要key, 所以为空，**注意不要重复了**。

<demo vue="basic/seq/Seq.vue"></demo>


## 自定义序号
可以配置`props.seqConfig.startIndex`，指定序号开始的值

在分页下比较有用。

<demo vue="basic/seq/SeqStartIndex.vue"></demo>

