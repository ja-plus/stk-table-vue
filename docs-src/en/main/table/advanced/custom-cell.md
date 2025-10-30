# Custom Cell

* Customize **body** cell content via `StkTableColumn['customCell']`.
* Customize **header** cell content via `StkTableColumn['customHeaderCell']`.

`customCell` and `customHeaderCell` are used similarly. Here we'll use `customCell` as an example.

::: warning Recommendations
* It's recommended to wrap `customCell` with an element (div, span, etc.), otherwise having `TextNode` as the child of &lt;td&gt; may cause layout issues.
* Be **cautious** when setting root elements of `customCell` as inline elements (inline, inline-block, inline-flex, etc.), as this layout may stretch row heights in **virtual lists**.
:::

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

<demo vue="advanced/custom-cell/CustomCell/index.vue"></demo>

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
    colIndex: number;
    /**
     * Whether the current row is expanded
     * - Not expanded: null
     * - Expanded: returns column configuration
     */
    expanded?: PrivateRowDT['__EXP__'];
};

export type CustomHeaderCellProps<T extends Record<string, any>> = {
    col: StkTableColumn<T>;
    rowIndex: number;
    colIndex: number;
};



```