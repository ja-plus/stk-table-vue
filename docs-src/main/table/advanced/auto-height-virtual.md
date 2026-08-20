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
    expectedHeight?: number | ((row: DT) => number);
};
```

::: tip 期望行高
预计一行的高度为多少，用于计算当前表格高度下，能放下几行。
:::
::: tip 优先级
`props.autoRowHeight.expectedHeight` > `props.rowHeight`
:::


## 示例

<demo vue="advanced/auto-height-virtual/AutoHeightVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/auto-height-virtual/AutoHeightVirtual/index.vue"></demo>

如果你你想控制单元格上下的padding，可以通过覆盖css变量实现：
```css
.stk-table {
    --cell-padding-y: 8px;
}
```

## 单列表
请移步至[虚拟单列表-不等高](/demos/virtual-list.html#不等高)

## 使用 Pretext 预计算行高

当行高可以通过内容提前计算得出时，推荐使用 [@chenglou/pretext](https://github.com/chenglou/pretext) 进行预计算，避免运行时测量行高带来的性能开销。同时防止滚动条抖动。

### 原理

1. 开启 `auto-row-height` 和 `virtual`
2. 使用 `prepare` 和 `layout` 方法计算文本高度
3. 通过 `setAutoHeight(rowKey, height)` 设置每行的实际高度

### 示例

<demo vue="advanced/auto-height-virtual/PretextAutoHeight/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/auto-height-virtual/PretextAutoHeight/index.vue"></demo>

### API

#### setAutoHeight(rowKey, height)

手动设置指定行的行高。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| rowKey | `string \| number` | 行的唯一标识，与 `row-key` 对应 |
| height | `number` | 行高度 |

::: tip 提示
- 需要在数据加载完成后调用
- 设置后立即生效，立即参与滚动定位与内容总高度（scrollHeight）计算
- 如果行高发生变化，需要重新调用此方法更新
- 传入 `null` 或 `undefined` 可以清除已设置的行高，恢复自动测量
:::

::: tip 性能
变高模式下的滚动定位已优化为 O(log n)（树状数组索引），内容总高度按各行真实/估算高度精确求和（而非行数 × 默认行高估算），大数据量深滚动依然流畅。数据源整体替换时，旧行键的实测行高会自动回收。
:::
