# 树形  <Badge type="tip" text="^0.7.0" />

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


<demo vue="basic/tree/Tree.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/Tree.vue"></demo>

## 默认展开节点

::: warning 
通过 `props.treeConfig` 配置的展开只对第一次渲染表格的时候生效。

异步数据请使用 [expose.setTreeExpand()](/main/api/expose.html#settreeexpand) 函数控制。
:::

### 全部展开
`treeConfig.defaultExpandAll = true`

<demo vue="basic/tree/TreeDefaultExpandAll.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeDefaultExpandAll.vue"></demo>

### 展开指定层级
`treeConfig.defaultExpandLevel = 1`

<demo vue="basic/tree/TreeDefaultExpandLevel.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeDefaultExpandLevel.vue"></demo>

### 展开指定节点
`treeConfig.defaultExpandedKeys = ['Asia', 'China', 'Zhejiang']`

下方 `Toggle China` 按钮使用 [setTreeExpand()](/main/api/expose.html#settreeexpand) 来控制 `China` 行的展开关闭。

<demo vue="basic/tree/TreeDefaultExpandKeys.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeDefaultExpandKeys.vue"></demo>

### 手动展开节点

通过 [setTreeExpand](/main/api/expose.html#settreeexpand) 方法手动控制节点的展开/折叠。

下方示例展示了不同参数的用法：

- `Toggle All`：切换所有根节点的展开/折叠状态（传入整个 `dataSource` 数组，`{ all: true }`）
- `Collapse All`：折叠所有根节点（传入整个 `dataSource` 数组，`{ all: true, expand: false }`）
- `Toggle Asia`：切换 Asia 节点的展开/折叠状态
- `Expand All Asia`：展开 Asia 的所有后代节点（`{ expand: true, all: true }`）
- `Collapse All Asia`：折叠 Asia 的所有后代节点（`{ expand: false, all: true }`）
- `Expand Asia to Level 2`：展开 Asia 到第 2 层（`{ expand: true, level: 2 }`）
- `Collapse Asia to Level 1`：折叠 Asia 到第 1 层（`{ expand: false, level: 1 }`）
- `Expand Parents of Zhejiang`：自动展开 Zhejiang 的所有父节点（Asia → China），Zhejiang 自身因有子节点 Hangzhou 也会一并展开（`{ expand: true, parents: true }`）
- `Collapse Parents of Zhejiang`：收起 Zhejiang 的所有父节点（`{ expand: false, parents: true }`）

<demo vue="basic/tree/TreeSetExpand.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeSetExpand.vue"></demo>


## 虚拟列表

<demo vue="basic/tree/TreeVirtualList.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeVirtualList.vue"></demo>

::: warning 注意
组件会在dataSource的每一行中注入`__T_EXP__` 字段，用于控制是否展开。在更新一行的数据时，不要修改这个字段。因此样例中使用 `Object.assign` 来更新数据。
:::

::: warning 性能提醒
即使用了虚拟列表，由于 `props.dataSource` 的每一次变化，都会导致组件内部遍历 `dataSource` 来展平数据。因此对于频繁变化的数据，将占用电脑更多的计算资源。
如果对性能有一定要求，可参考[示例-大量数据](/demos/huge-data)，自行实现树形展开逻辑。
:::

## 排序
默认情况下，点击表头排序时，会对当前层级的数据进行排序。如果需要对子节点也进行排序，需要配置 `sortConfig.sortChildren = true`。 `v0.8.8`

详情见[排序](/main/table/basic/sort)
