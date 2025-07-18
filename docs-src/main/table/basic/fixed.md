# 固定列

通过配置 `StkTableColumn['fixed'] = 'left'` 或 `'right'` 即可实现固定左侧或右侧列的效果。

::: info 全新的固定列交互
由于表格使用了 `sticky` 实现固定列，因此支持**列吸附**的特性。您可以设置任意一列作为固定列，只有列超过可视区时才会被固定。
:::

## 基本

列配置demo
```typescript{2,6,10}
const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name', fixed: 'left', width: 100 },
    { title: 'Age', dataIndex: 'age', width: 100 }, 
    { title: 'Address', dataIndex: 'address', width: 200 }, 
    // Gender 列前面的列都必须指定列宽
    { title: 'Gender', dataIndex: 'gender', width: 50, fixed: 'left' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
    { title: 'Company', dataIndex: 'company'  },
    { title: 'Operation', dataIndex: 'operation', fixed: 'right', width: 100 },
];

```
::: warning
由于要用列宽来计算**固定列**的吸附位置，设置固定左侧列前面的所有列**必须指定列宽**。

如上表 `Gender` 列前的所有列必须都设置列宽。固定右侧同理。
:::

<demo vue="basic/fixed/Fixed.vue"></demo>

可以看到，上面表格横向滚动时， `Gender` 列会自动吸附到左侧。

::: tip
如果您想要把所有的列都放在最左侧，请在 `columns` 中把固定左侧的列放在 `columns` 的最前面。同理固定右侧的列请全部放在 `columns` 的最后面。
:::

## 固定列阴影

默认情况下，固定列没有阴影效果，如果您希望有阴影效果，可以设置 `fixed-col-shadow` 属性为 `true`。

```html
<StkTable fixed-col-shadow></StkTable>
```

## 虚拟列表列固定


<demo vue="basic/fixed/FixedVirtual.vue"></demo>

::: warning
设置了 `props.virtual-x` 横向虚拟列表时，未设置列宽的列都会被强制设置为100px
:::
