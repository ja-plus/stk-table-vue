# Fixed Columns

Configure `StkTableColumn['fixed'] = 'left'` or `'right'` to achieve fixed left or right columns.

::: info New Fixed Column Interaction
Because the table uses `sticky` to implement fixed columns, it supports the feature of **column adsorption**. You can set any column as a fixed column, and it will only be fixed when the column exceeds the visible area.
:::

## Basic

Column configuration demo
```typescript{2,6,10}
const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name', fixed: 'left', width: 100 },
    { title: 'Age', dataIndex: 'age', width: 100 }, 
    { title: 'Address', dataIndex: 'address', width: 200 }, 
    // All columns before the Gender column must specify width
    { title: 'Gender', dataIndex: 'gender', width: 50, fixed: 'left' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
    { title: 'Company', dataIndex: 'company'  },
    { title: 'Operation', dataIndex: 'operation', fixed: 'right', width: 100 },
];

```
::: warning
To calculate the adsorption position of **fixed columns** using column widths, all columns before the fixed left column **must specify widths**.

As in the table above, all columns before the `Gender` column must have widths set. The same applies to fixed right columns.
:::

<demo vue="basic/fixed/Fixed.vue"></demo>

You can see that when scrolling horizontally, the `Gender` column automatically adsorbs to the left.

::: tip
If you want to place all fixed left columns at the far left, put them at the beginning of the `columns` array. Similarly, put all fixed right columns at the end of the `columns` array.
:::

## Fixed Column Shadow

By default, fixed columns have no shadow effect. If you want a shadow effect, you can set the `fixed-col-shadow` property to `true`.

```html
<StkTable fixed-col-shadow></StkTable>
```

## Virtual List Column Fixing


<demo vue="basic/fixed/FixedVirtual.vue"></demo>

::: warning
When `props.virtual-x` (horizontal virtual list) is set, columns without specified widths will be forced to 100px
:::
