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

## Lazy Load Children  <Badge type="tip" text="^1.2.7" />

When a node's children must be fetched on demand (org trees, directory trees, 10K+ nodes), enable `treeConfig.lazy`. Expanding a row that is "marked as having children but not yet loaded" calls `treeConfig.loadMethod(row, col)`. The component manages the whole loading state; you only provide the fetch function.

```ts
const treeConfig = {
    lazy: true,
    // returns a Promise resolving to an array of child rows
    loadMethod: (row, col) => fetchChildren(row.id),
    // optional: field marking "has children", default 'hasChildren'
    hasChildField: 'hasChildren',
    // optional: load failure callback
    onLoadError: (error, row, col) => console.error(error),
};
```

Rules:

1. Root-level data is still provided by `props.dataSource`; child levels are loaded by `loadMethod` on drill-down.
2. Expandable check: the arrow shows when `children` exists **or** `row.hasChildren` is truthy; neither means a leaf node.
3. While loading, the arrow is replaced by a loading icon and the **whole row (`<tr>`)** gets the `is-tree-loading` class (overridable).
4. Loaded nodes are cached; collapse + re-expand does not re-request. Call [reloadTreeNode()](/en/main/api/expose.html#reloadtreeenode) to force a refresh.
5. On reject the row stays collapsed, is not marked loaded (retry on next expand), and `onLoadError` fires.
6. With `lazy`, `defaultExpandAll` / `defaultExpandLevel` and `setTreeExpand(..., { all: true } / { level })` stop at unloaded branches (no implicit N chained requests); `setTreeExpand(row, { parents: true })` chain-loads unloaded ancestors on demand (this branch returns a Promise).

<demo vue="basic/tree/TreeLazyLoad.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeLazyLoad.vue"></demo>


## Indent Guide Lines  <Badge type="tip" text="^1.2.7" />

When `treeConfig.showGuide` (default `false`) is enabled, the `tree-node` column draws one vertical guide line per level within each row's indentation, making it easy to tell which level a child row belongs to. Lines only cover the ancestor slots (level 0 .. level-1); a row never draws a line through its own control slot. When disabled, the existing padding-only indentation is kept with no guide lines.

```ts
const treeConfig = {
    // show vertical guide lines per level
    showGuide: true,
};
```

::: tip Notes
- Guide lines use a "one continuous vertical line per level" style, **not** precise last-child truncation / T-shaped tree connectors.
- Style via CSS variables: `--tree-guide-color` (color), `--tree-guide-width` (line width, default `1px`), `--tree-guide-mask` (dash mask, default `none` = solid; set a vertical repeating gradient to intersect, e.g. `repeating-linear-gradient(to bottom, #000 0 4px, transparent 4px 8px)`); the dark theme has its own defaults.
- When swapping in a wider arrow/icon, override `--tree-indent-width` (default `16px`) so the indent cell, the control placeholder and the guide line pitch scale together. Rendering the whole cell through `customCell` on a `tree-node` column (folder open/close example included) is covered in [File Management Tree](/en/demos/file-tree).
:::

<demo vue="basic/tree/TreeGuide.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeGuide.vue"></demo>

### Custom tree node cell via customCell (replace the expand icon)  <Badge type="tip" text="^1.2.7" />

A `tree-node` column accepts `customCell` as well: you render the whole cell, while the built-in "per-level indent + guide lines" and "arrow / lazy loading" come back through the `stkTreeIndent` and `stkFoldIcon` slots (note these are slots of **your cell component**, not top-level StkTable slots), so you decide whether and where to render them.

Runnable examples (self-drawn folder icons, and keeping the built-in arrow while customizing the label), the placement contract and a code skeleton live in [File Management Tree](/en/demos/file-tree).

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