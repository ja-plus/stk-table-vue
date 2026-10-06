# Custom Cell

* Customize **body** cell content via `StkTableColumn['customCell']`.
* Customize **header** cell content via `StkTableColumn['customHeaderCell']`.

`customCell` and `customHeaderCell` are used similarly. Here we'll use `customCell` as an example.

::: warning Recommendations
* It's recommended to wrap `customCell` with an element (div, span, etc.), otherwise having `TextNode` as the child of &lt;td&gt; may cause layout issues.
* Be **cautious** when setting root elements of `customCell` as inline elements (inline, inline-block, inline-flex, etc.), as this layout may stretch row heights in **virtual lists**.
:::

::: tip Tree node / expand columns
A `tree-node` / `expand` column can also declare `customCell`. The built-in "per-level indent + guide lines" and "arrow / lazy loading" come back to you through the `stkTreeIndent` and `stkFoldIcon` slots, and `CustomCellProps` additionally provides `level` / `expandable` / `treeLoading`. The full recipe lives in [File Management Tree](/en/demos/file-tree).
:::

### Public tree cell components

The package exports three reusable components:

- `StkTreeCell`: a complete tree cell driven by the `customCell` context, ready to assign to a `tree-node` column.
- `StkTreeIndent`: renders per-level indentation and optional guide lines from `level`; `offset` (a CSS length) **shifts the guide lines only**, to re-align them with a custom expand icon (custom icons must share one width when used on both sides of `StkTreeIndent`). The built-in arrow centers `4px` inside the cell and the lines align with it by default; a centered icon of the same width centers at half of `--tree-indent-width`, so pass `offset="4px"` (the difference).
- `StkTreeFoldIcon`: renders the arrow, loading state, or leaf placeholder from `expandable`, `loading`, and `expanded`.

```ts
import { StkTreeCell, StkTreeFoldIcon, StkTreeIndent } from 'stk-table-vue';

const columns = [{ type: 'tree-node', dataIndex: 'name', customCell: StkTreeCell }];
```

`StkTreeFoldIcon` is a controlled visual component. Inside `StkTable`, expandable states automatically receive `data-stk-fold` for delegated toggling, while loading states do not. Override `--tree-indent-width`, `--tree-guide-color`, `--tree-guide-width`, or `--tree-guide-mask` for styling.

### Using with Vue SFC
Supports passing Vue SFC components. The props of the Vue component need to be specially defined with the `CustomCellProps` type.

::: tip Best Practice
Define columns in a separate file and export them.
:::

::: code-group
```ts [column.ts]
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';
import type { DataType } from './types';
import YieldCell from './YieldCell.vue';
export const columns: StkTableColumn<DataType> = [{
    title: 'Yield Rate',
    dataIndex: 'yield',
    customCell: YieldCell
}]
```
```vue [YieldCell.vue]
<script lang="ts" setup>
import { computed } from 'vue';
import { DataType } from './types';
import { CustomCellProps } from 'stk-table-vue/src/StkTable/types/index';

const props = defineProps<CustomCellProps<DataType>>();
const className = computed(() => {
    let name = '';
    if (props.cellValue > 0) {
        name = 'color-up';
    } else if (props.cellValue < 0) {
        name = 'color-down';
    }
    return name;
});
</script>
<template>
    <span :class="className">{{ props.cellValue > 0 ? '+' : '' }}{{ (props.cellValue * 100).toFixed(4) }}%</span>
</template>
<style>
.color-up {
    color: #2fc87b;
}
.color-down {
    color: #ff2b48;
}
</style>
```
```ts [types.ts]
export type DataType = {
    name: string;
    yield: number;
};

```
:::

<demo vue="advanced/custom-cell/CustomCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cell/CustomCell/index.vue"></demo>

<demo vue="advanced/custom-cell/PublicTreeCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cell/PublicTreeCell/index.vue"></demo>

### Using with Render Function h
For simple modifications, using the render function directly is more convenient.

For example, we can **multiply the value by 100** and add a **unit**.
```ts
import { h } from 'vue';
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';
const columns: StkTableColumn<any>[] = [
    {
        title: 'Yield Rate',
        dataIndex: 'yield',
        customCell: ({ cellValue }) => h('span', cellValue * 100 + '%'),
    },
]
```

### Using with JSX
To use JSX, you need to install the JSX environment.

| Build Tool | Plugin |
|---|---|
| vite | @vitejs/plugin-vue-jsx |
| webpack + babel | @vue/babel-plugin-jsx |
| webpack + swc | swc-plugin-vue-jsx |
| rspack | swc-plugin-vue-jsx |

```tsx
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';

const columns:StkTableColumn<any>[] = [
    {
        title: 'Name',
        dataIndex: 'name',
        customCell: ({ row, col, cellValue }) => {
            return <span style="color: red">{cellValue}</span>;
        },
    },
]
```



## API
| Property | props | Default | Description |
|---|---|---|---|
| customCell | (props: CustomCellProps) => VNode | - | Custom cell rendering function |
| customHeaderCell | (props: CustomHeaderCellProps) => VNode | - | Custom header cell rendering function |

### types
customCell props type
```ts
export type CustomCellProps<T extends Record<string, any>> = {
    row: T;
    col: StkTableColumn<T>;
    /** Value of row[col.dataIndex] */
    cellValue: any;
    rowIndex: number;
    /** 
     * Column index (starting from 0)
     * 
     * Note:
     * - In virtual-x, otherwise it represents the index in the virtual list
     */
    colIndex: number;
    /**
     * Whether the current row is expanded
     * - Not expanded: null
     * - Expanded: returns column configuration
     */
    expanded?: StkTableColumn<any>;
    /** Whether the current tree node row is expanded */
    treeExpanded?: boolean;
    /** Tree level (root is 0). Always `0` for non-tree data */
    level?: number;
    /** Whether the row is expandable (children loaded, or marked as having children in lazy mode). Always `false` for non-tree data */
    expandable?: boolean;
    /** Whether the row's children are being lazy-loaded. Always `false` for non-tree data and non-lazy modes */
    treeLoading?: boolean;
    /** Whether to draw level guide lines per `treeConfig.showGuide`. Only set for `tree-node` columns */
    showGuide?: boolean;
};

export type CustomHeaderCellProps<T extends Record<string, any>> = {
    col: StkTableColumn<T>;
    rowIndex: number;
    /** 
     * Column index (starting from 0)
     * 
     * Note:
     * - In virtual-x, otherwise it represents the index in the virtual list
     */
    colIndex: number;
};



```