# 不定高虚拟列表

## 配置
| 属性  | 类型  | 默认值 | 说明  |
| ----- | ----- | ----- | ----- |
| props.autoRowHeight | `boolean` \| `AutoRowHeightConfig<DT>` | false | 是否开启自动行高 |
| props.rowHeight | `number` | -- | `props.autoRowHeight` 为 `true` 时，将表示为期望行高，用于计算。不再影响实际行高。 |

### AutoRowHeightConfig&lt;DT&gt;
```ts
type AutoRowHeightConfig<DT> = {
    /** Estimated row height */
    expectedHeight?: number | ((row: DT, index: number) => number);
};
```

## 示例


### 单列表

<demo vue="advanced/auto-height-virtual/AutoHeightVirtualSingle/index.vue"></demo>
