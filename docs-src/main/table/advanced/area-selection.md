# 区域选取 <Badge type="tip" text="^0.10.0" /> <Badge type="warning" text="Need Register" /> 
通过 `props.areaSelection` 启用表格的单元格拖拽选区。
- 支持复制到剪贴板（Ctrl/Cmd + C）。
- Esc 取消选区
- 支持键盘选择（方向键, Shift, Tab）。
- 支持 Ctrl 多选区域（可配置）
- 支持 Shift 扩展选区（可配置）

::: tip 需要注册 
该功能需要注册后才能使用。
:::
注册方式：
```ts
import { registerFeature, useAreaSelection } from 'stk-table-vue';
// 注册区域选取功能
registerFeature(useAreaSelection);
```



```js
<StkTable
    area-selection // [!code ++]
></StkTable>
```

<demo vue="advanced/area-selection/AreaSelection.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/area-selection/AreaSelection.vue"></demo>

## Props
- [`areaSelection`](/main/api/table-props.md#areaselection)

## Emit
- [area-selection-change 区域变更触发](/main/api/emits.html#area-selection-change) 

## Exposed
- [getSelectedArea](/main/api/expose.md#getselectedarea)
- [clearSelectedArea](/main/api/expose.md#clearselectedarea)
- [copySelectedArea](/main/api/expose.md#copyselectedarea)