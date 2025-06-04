# 树形 
`v0.7.0` 新增 

通过下面两步开启树形功能

1. 配置 `StkTableColumn['type']` 为 `tree-node` 来指定树形展开按钮的位置
```ts
const columns: StkTableColumn<any>[] = [
    { type: 'tree-node', title: 'Area', dataIndex: 'area' },
]
```

2. 数据源加 `children` 字段。点击后会将数据中的 `children` 字段中的内容，作为子节点进行展示。
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

## 简单树形


<demo vue="basic/tree/Tree.vue"></demo>

## 默认展开节点

### 全部展开
`treeConfig.defaultExpandAll = true`

<demo vue="basic/tree/TreeDefaultExpandAll.vue"></demo>

### 展开指定层级
`treeConfig.defaultExpandLevel = 1`

<demo vue="basic/tree/TreeDefaultExpandLevel.vue"></demo>

### 展开指定节点
`treeConfig.defaultExpandedKeys = ['Asia', 'China', 'Zhejiang']`

<demo vue="basic/tree/TreeDefaultExpandKeys.vue"></demo>


## 虚拟列表

<demo vue="basic/tree/TreeVirtualList.vue"></demo>

::: warning 注意
组件会在dataSource的每一行中注入`__T_EXPANDED__` 字段，用于控制是否展开。在更新一行的数据时，不要修改这个字段。因此样例中使用 `Object.assign` 来更新数据。
:::

::: warning 性能提醒
即使用了虚拟列表，由于 `props.dataSource` 的每一次变化，都会导致组件内部遍历 `dataSource` 来展平数据。因此对于频繁变化的数据，将占用电脑更多的计算资源。
如果对性能有一定要求，可参考[示例-大量数据](/demos/huge-data)，自行实现树形展开逻辑。
:::