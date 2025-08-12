# Sequence Column

Set `StkTableColumn['type']` to `seq` to use the built-in sequence column of the component.

::: tip
The sequence column is not affected by sorting and is displayed based on the array index of `props.data-source`.
:::

```ts
const columns: StkTableColumn<any>[] = [
    { type: 'seq', width: 50, dataIndex: '', title: 'No.' }, // [!code ++]
    { title: 'Name', dataIndex: 'name', sorter: true },
    { title: 'Age', dataIndex: 'age', sorter: true },
    { title: 'Address', dataIndex: 'address', sorter: true },
    { title: 'Gender', dataIndex: 'gender', sorter: true },
];
```

Here you can see that the `dataIndex` of the `seq` column is empty. This is because `dataIndex` is not only used as a value field but also as a key for v-for rendering. Since the sequence column does not need a key, it is left empty. **Be careful not to duplicate it**.

<demo vue="basic/seq/Seq.vue"></demo>


## Custom Sequence
You can configure `props.seqConfig.startIndex` to specify the starting value of the sequence.

This is particularly useful for pagination.

<demo vue="basic/seq/SeqStartIndex.vue"></demo>

