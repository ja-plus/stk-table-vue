# Tree  <Badge type="tip" text="^0.7.0" />

Enable tree function in two steps

1. Set `StkTableColumn['type']` to `tree-node` to specify the position of the tree expansion button
```ts
const columns: StkTableColumn<any>[] = [
    { type: 'tree-node', title: 'Area', dataIndex: 'area' },
]
```

2. Add `children` field to the data source. After clicking, the content in the `children` field of the data will be displayed as child nodes.
```ts
export const getDataSource = () => [ 
    {
        area: 'Asia',
        gdp: 10000,
        population: 50000000,
        gdpPerCapita: 20000,
        children: [
            { area: 'China', gdp: 5000, population: 1400000000, gdpPerCapita: 35000, }, 
            { area: 'Japan', gdp: 4000, population: 126000000, gdpPerCapita: 33000, }
        ],
    },
];
```

## Simple Tree

<demo vue="basic/tree/Tree.vue"></demo>

## Default Expanded Nodes

### Expand All
`treeConfig.defaultExpandAll = true`

<demo vue="basic/tree/TreeDefaultExpandAll.vue"></demo>

### Expand Specific Level
`treeConfig.defaultExpandLevel = 1`

<demo vue="basic/tree/TreeDefaultExpandLevel.vue"></demo>

### Expand Specific Nodes
`treeConfig.defaultExpandedKeys = ['Asia', 'China', 'Zhejiang']`

<demo vue="basic/tree/TreeDefaultExpandKeys.vue"></demo>


## Virtual List

<demo vue="basic/tree/TreeVirtualList.vue"></demo>

::: warning Note
The component will inject the `__T_EXP__` field into each row of the dataSource to control whether it is expanded. Do not modify this field when updating the data of a row. Therefore, `Object.assign` is used in the example to update data.
:::

::: warning Performance Note
Even with virtual lists, every change in `props.dataSource` will cause the component to internally traverse `dataSource` to flatten the data. Therefore, for frequently changing data, it will occupy more computing resources of the computer.
If you have certain performance requirements, you can refer to [Example - Huge Data](/en/demos/huge-data) to implement the tree expansion logic yourself.
:::

## Sorting
By default, when clicking on the table header to sort, only the data at the current level will be sorted. If you need to sort child nodes as well, you need to configure `sortConfig.sortChildren = true`. `v0.8.8`

For details, see [Sorting](/en/main/table/basic/sort)