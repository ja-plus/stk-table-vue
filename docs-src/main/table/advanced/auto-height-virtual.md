# 不定高虚拟列表

## 配置
| 属性  | 类型  | 默认值 | 说明  |
| ----- | ----- | ----- | ----- |
| props.autoRowHeight | `boolean` \| `AutoRowHeightConfig<DT>` | false | 是否开启自动行高 |
| props.rowHeight | `number` | -- | `props.autoRowHeight` 为 `true` 时，将表示为期望行高，用于计算。不再影响实际行高。 |

### AutoRowHeightConfig&lt;DT&gt;
```ts
type AutoRowHeightConfig<DT> = {
    /** 期望行高 */
    expectedHeight?: number | ((row: DT, index: number) => number);
};
```

::: tip 期望行高
预计一行的高度为多少，用于计算当前表格高度下，能放下几行。
:::
::: tip 优先级
`props.autoRowHeight.expectedHeight` > `props.rowHeight`
:::


## 示例

<demo vue="advanced/auto-height-virtual/AutoHeightVirtual/index.vue"></demo>

如果你你想控制单元格上下的padding，可以通过覆盖css变量实现：
```css
.stk-table {
    --cell-padding-y: 8px;
}
```

## 单列表
请移步至[虚拟单列表-不等高](/demos/virtual-list.html#不等高)
