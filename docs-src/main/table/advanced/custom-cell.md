# 自定义单元格

* 通过 `StkTableColumn['customCell']` 自定义**表体**单元格内容。
* 通过 `StkTableColumn['customHeaderCell']` 自定义**表头**单元格内容。

`customCell` 和 `customHeaderCell` 使用方式基本相同，下面以 `customCell` 为例子进行说明。

::: warning 建议
* `customCell` 建议套上一层元素(div,span等)，否则 &lt;td&gt; 子节点为 `TextNode` 可能导致布局问题。
* `customCell` 的根元素请**谨慎**设置 `inline`/`inline-block`/`inline-flex` 等行内元素，此布局在**虚拟列表**中可能会撑开行高。
:::

### 通过vue SFC 使用
支持传入vue SFC 组件，vue 组件的 props 需要用 `CustomCellProps` 类型特殊定义。

::: tip 最佳实践
 columns 单独写在一个文件中导出使用。
:::

::: code-group
```ts [column.ts]
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';
import type { DataType } from './types';
import YieldCell from './YieldCell.vue';
export const columns: StkTableColumn<DataType> = [{
    title: '收益率',
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

### 通过渲染函数h使用
简单的修改，直接使用渲染函数会比较方便。

比如我们对数值**乘以100**再加**单位**。
```ts
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';
const columns: StkTableColumn<any>[] = [
    {
        title: '收益率',
        dataIndex: 'yield',
        customCell: ({ cellValue }) => h('span', cellValue * 100 + '%'),
    },
]
```

### 通过jsx 使用
使用jsx 需要安装jsx 的环境。

| 构建工具 | 插件 |
|---|---|
| vite | @vitejs/plugin-vue-jsx |
| webpack + babel | @vue/babel-plugin-jsx |
| webpack + swc | swc-plugin-vue-jsx |
| rspack | swc-plugin-vue-jsx |

```tsx
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';

const columns:StkTableColumn<any>[] = [
    {
        title: '姓名',
        dataIndex: 'name',
        customCell: ({ row, col, cellValue }) => {
            return <span style="color: red">{cellValue}</span>;
        },
    },
]
```



## API
| 属性 | props | 默认值 | 说明 |
|---|---|---|---|
| customCell | (props: CustomCellProps) => VNode | - | 自定义单元格渲染函数 |
| customHeaderCell | (props: CustomHeaderCellProps) => VNode | - | 自定义表头渲染函数 |

### types
customCell props 类型
```ts
export type CustomCellProps<T extends Record<string, any>> = {
    row: T;
    col: StkTableColumn<T>;
    /** row[col.dataIndex] 的值 */
    cellValue: any;
    rowIndex: number;
    colIndex: number;
    /**
     * 当前行是否展开
     * - 不展开: null
     * - 展开: 返回column配置
     */
    expanded?: PrivateRowDT['__EXPANDED__'];
};

export type CustomHeaderCellProps<T extends Record<string, any>> = {
    col: StkTableColumn<T>;
    rowIndex: number;
    colIndex: number;
};



```