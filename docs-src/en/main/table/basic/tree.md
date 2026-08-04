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

<demo vue="basic/tree/Tree.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/Tree.vue"></demo>

## Default Expanded Nodes

::: warning 
Expansions configured via `props.treeConfig` only take effect when the table is first rendered.

For async data, please use the [expose.setTreeExpand()](/en/main/api/expose.html#settreeexpand) function to control.
:::

### Expand All
`treeConfig.defaultExpandAll = true`

<demo vue="basic/tree/TreeDefaultExpandAll.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeDefaultExpandAll.vue"></demo>

### Expand Specific Level
`treeConfig.defaultExpandLevel = 1`

<demo vue="basic/tree/TreeDefaultExpandLevel.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeDefaultExpandLevel.vue"></demo>

### Expand Specific Nodes
`treeConfig.defaultExpandedKeys = ['Asia', 'China', 'Zhejiang']`

The `Toggle China` button below uses [setTreeExpand()](/en/main/api/expose.html#settreeexpand) to control the expand/collapse of the `China` row.

<demo vue="basic/tree/TreeDefaultExpandKeys.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeDefaultExpandKeys.vue"></demo>

### Manually Expand Nodes

Use the [setTreeExpand](/en/main/api/expose.html#settreeexpand) method to manually control the expand/collapse of nodes.

The example below demonstrates different parameter usages:
- `Toggle All`: Toggle the expand/collapse state of all root nodes (pass the entire `dataSource` array, `{ all: true }`)
- `Collapse All`: Collapse all root nodes (pass the entire `dataSource` array, `{ all: true, expand: false }`)
- `Toggle Asia`: Toggle the expand/collapse state of the Asia node
- `Expand All Asia`: Expand all descendants of Asia (`{ expand: true, all: true }`)
- `Collapse All Asia`: Collapse all descendants of Asia (`{ expand: false, all: true }`)
- `Expand Asia to Level 2`: Expand Asia to level 2 (`{ expand: true, level: 2 }`)
- `Collapse Asia to Level 1`: Collapse Asia to level 1 (`{ expand: false, level: 1 }`)
- `Expand Parents of Zhejiang`: Automatically expand all ancestors (Asia → China) of Zhejiang. Zhejiang itself is also expanded since it has a child node Hangzhou (`{ parents: true }`)
- `Collapse Parents of Zhejiang`: Collapse all ancestors of Zhejiang (`{ parents: true, expand: false }`)

<demo vue="basic/tree/TreeSetExpand.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeSetExpand.vue"></demo>


## Virtual List

<demo vue="basic/tree/TreeVirtualList.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeVirtualList.vue"></demo>

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