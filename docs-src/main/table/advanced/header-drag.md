# 列拖动更换顺序

* 配置 `headerDrag` 属性，可以启用列拖动更换顺序的功能。
* `columns` 配置为 `v-model`修饰。

```js
<StkTable
    header-drag // [!code ++]
    :columns="columns" // [!code --]
    v-model:columns="columns" // [!code ++]
></StkTable>
```

<demo vue="advanced/header-drag/HeaderDrag.vue"></demo>

## API

### type
`props.headerDrag`

```ts
/** header drag config */
export type HeaderDragConfig<DT extends Record<string, any> = any> =
    | boolean
    | {
          /**
           * 列交换模式
           * - none - 不做任何事
           * - insert - 插入(默认值)
           * - swap - 交换
           */
          mode?: 'none' | 'insert' | 'swap';
          /** 禁用拖动的列 */
          disabled?: (col: StkTableColumn<DT>) => boolean;
      };
```

### emit
```ts
/**
 * 表头列拖动事件
 * ```(dragStartKey: string, targetColKey: string)```
 */
(e: 'col-order-change', dragStartKey: string, targetColKey: string): void;
/**
 * 表头列拖动开始
 * ```(dragStartKey: string)```
 */
(e: 'th-drag-start', dragStartKey: string): void;
/**
 * 表头列拖动drop
 * ```(targetColKey: string)```
 */
(e: 'th-drop', targetColKey: string): void;
```
