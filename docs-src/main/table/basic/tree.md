# 树形
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
