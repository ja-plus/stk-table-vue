# 列宽调整

## 配置
* `props.colResizable` 即可打开列宽调整。
* `props.columns` 需要修改为 `v-model` 修饰符，列宽修改后会直接变更 `StkTableColumn['width']` 的值。
* `columns` 需要用 `ref` 包裹，以支持响应式。

```js
<StkTable
    col-resizable // [!code ++]
    :columns="columns" // [!code --]
    v-model:columns="columns" // [!code ++]
></StkTable>
```

::: warning
打开列宽调整后，列宽不会默认铺满容器。表格的 `width` 将被设置为 `fit-content`。如果有异常，请检查是否传入了 `props.width` 。
:::

<demo vue="advanced/column-resize/ColResizable.vue"></demo>


## 通过事件更改列宽
```ts
/**
 * 列宽变动时触发
 *
 *  ```(cols: StkTableColumn<DT>)```
 */
(e: 'col-resize', cols: StkTableColumn<DT>): void;
```

这样，您可以不用在 `columns` 前添加 `v-model` 修饰符，手动更新 `StkTableColumn['width']` 的值即可。

## 列宽铺满容器hack方式
如果您希望列宽铺满容器，可以手动设置 `props.width` 为 `unset`，这样表格将铺满容器。

然后把某一列`minWidth`替换为 `width`，这样这一列就会自动占满剩余宽度，其他列依然是设置的宽度 。

通过 `props.colResizable.disabled`禁用最后一列的拖动列宽调整。

下面的 demo 设置了最后一列的 minWidth。
<demo vue="advanced/column-resize/ColResizableFullHack.vue"></demo>


## API
### props.colResizable:
| type | 说明 |
| --- | --- | 
| boolean | 是否开启列宽调整  |
| ColResizableConfig | 配置 |

### ColResizableConfig
| 属性 | 类型 | 默认值| 说明 |
| --- | --- | ---- | --- |
| disabled | `(col:StkTableColumn) => boolean` | -- | 是否开启列宽调整 |


