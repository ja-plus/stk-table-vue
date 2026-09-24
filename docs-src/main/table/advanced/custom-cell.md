# 自定义单元格

* 通过 `StkTableColumn['customCell']` 自定义**表体**单元格内容。
* 通过 `StkTableColumn['customHeaderCell']` 自定义**表头**单元格内容。

`customCell` 和 `customHeaderCell` 使用方式基本相同，下面以 `customCell` 为例子进行说明。

::: warning 建议
* `customCell` 建议套上一层元素(div,span等)，否则 &lt;td&gt; 子节点为 `TextNode` 可能导致布局问题。
* `customCell` 的根元素请**谨慎**设置 `inline`/`inline-block`/`inline-flex` 等行内元素，此布局在**虚拟列表**中可能会撑开行高。
:::

::: tip 树节点列 / 展开列
`tree-node` / `expand` 列同样可以配 `customCell`。内置的「按层级缩进 + 引导线」与「箭头 / 懒加载 loading」会经 `stkTreeIndent`、`stkFoldIcon` 插槽交回给你摆放，`CustomCellProps` 另提供 `level` / `expandable` / `treeLoading`。完整配方见[文件管理树](/demos/file-tree)。
:::

### 公共树单元格组件

包入口提供三个可复用组件：

- `StkTreeCell`：使用 `customCell` 上下文直接渲染完整树单元格，可直接配置给 `tree-node` 列的 `customCell`。
- `StkTreeIndent`：按 `level` 渲染缩进和可选引导线；`offset`（CSS 长度）**只平移引导线**，用于把线校正到自定义展开图标的中心（共享同一 `StkTreeIndent` 时，两侧图标宽度需一致）。内置箭头中心在格内 `4px` 处，引导线默认与它对齐；换成居中的等宽图标后中心移到 `--tree-indent-width` 的一半，此时传 `offset="4px"` 即可（即两者之差）。
- `StkTreeFoldIcon`：按 `expandable`、`loading`、`expanded` 渲染箭头、loading 或叶子占位格。

```ts
import { StkTreeCell, StkTreeFoldIcon, StkTreeIndent } from 'stk-table-vue';

const columns = [{
    type: 'tree-node',
    dataIndex: 'name',
    customCell: StkTreeCell,
}];
```

`StkTreeFoldIcon` 是受控视觉组件，不负责修改树数据。在 `StkTable` 中，可展开状态会自动带有 `data-stk-fold`，由表格统一处理展开；loading 状态不会带该属性。组件样式可通过 `--tree-indent-width`、`--tree-guide-color`、`--tree-guide-width` 和 `--tree-guide-mask` 覆盖。

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

<demo vue="advanced/custom-cell/CustomCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cell/CustomCell/index.vue"></demo>

<demo vue="advanced/custom-cell/PublicTreeCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cell/PublicTreeCell/index.vue"></demo>

### 通过渲染函数h使用
简单的修改，直接使用渲染函数会比较方便。

比如我们对数值**乘以100**再加**单位**。
```ts
import { h } from 'vue';
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
    /** 
     * 列索引(从0开始)。
     * 
     * 注意：
     * 在virtual-x 下，否则表示虚拟列表中的列索引
     */
    colIndex: number;
    /**
     * 当前行是否展开
     * - 不展开: null
     * - 展开: 返回column配置
     */
    expanded?: StkTableColumn<any>;
    /** 树节点当前行是否展开 */
    treeExpanded?: boolean;
    /** 树中层级（根为 0）。非树形数据恒为 0 */
    level?: number;
    /** 该行是否可展开（children 已存在，或懒加载标记有子节点）。非树形数据恒为 false */
    expandable?: boolean;
    /** 该行子节点是否正在懒加载。非树形数据与非懒加载模式恒为 false */
    treeLoading?: boolean;
    /** 是否按 `treeConfig.showGuide` 绘制层级引导线。仅 `tree-node` 列有值 */
    showGuide?: boolean;
};

export type CustomHeaderCellProps<T extends Record<string, any>> = {
    col: StkTableColumn<T>;
    rowIndex: number;
    /** 
     * 列索引(从0开始)。
     * 
     * 注意：
     * 在virtual-x 下，否则表示虚拟列表中的列索引
     */
    colIndex: number;
};



```