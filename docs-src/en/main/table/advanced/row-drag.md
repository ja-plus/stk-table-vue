# 行拖动更换顺序

拖动行，改变行在表格中的顺序。

## 示例
使用内置的拖动 `StkTableColumn['type']="dragRow"`

::: warning
 `dragRow` 的列配置里没有写 `dataIndex`, 因为通过 `props.colKey` 重写了唯一键，优先取 `StkTableColumn['key']` 字段。
:::

<demo vue="advanced/row-drag/RowDrag.vue"></demo>

也可以自己通过原生 draggable API 来实现，下面是参考：

<demo vue="advanced/row-drag/RowDragCustom.vue"></demo>

## API

### emits
```ts
/**
 * 行拖动事件
 *
 * ```(dragStartKey: string, targetRowKey: string)```
 */
(e: 'row-order-change', dragStartKey: string, targetRowKey: string): void;
```

