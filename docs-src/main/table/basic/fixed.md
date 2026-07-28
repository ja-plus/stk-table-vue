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

::: warning 右侧固定列「不生效」？
固定列基于 `position: sticky` 实现，**只有当表格总宽度超过容器、出现横向滚动时，固定列才会吸附**。

如果中间某一列（如下面的 `url` 列）没有设置 `width`，在默认的 `table-layout: auto` 下浏览器会把这一列**拉伸去填满剩余空间**，导致表格总宽永远等于容器宽度、不产生横向溢出，右侧固定列因此看起来「没生效」（其实它就贴在最右边，只是没有可滚动的内容来体现吸附）。

```typescript
const columns: StkTableColumn<any>[] = [
    { title: '主播名称', dataIndex: 'name', width: 100 },
    { title: '直播间URL', dataIndex: 'url' }, // ❌ 未设置列宽，会撑满剩余空间，表格不溢出
    { title: '操作', dataIndex: '_action', fixed: 'right', width: 150 },
];
```

解决办法（任选其一）：

- 给未设宽度的列补上 `width` 或 `minWidth`（推荐 `minWidth`，既能自适应又能保证总宽可超过容器）：`{ title: '直播间URL', dataIndex: 'url', minWidth: 200 }`；
- 开启 `props.virtual-x` 横向虚拟列表（此时未设宽度的列会被强制设为 100px）；
- 使用 `props.fixedMode`（`table-layout: fixed`）配合表格 `width`，让列宽被严格遵守。
:::

<demo vue="basic/fixed/Fixed.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/fixed/Fixed.vue"></demo>

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


<demo vue="basic/fixed/FixedVirtual.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/fixed/FixedVirtual.vue"></demo>

::: warning
设置了 `props.virtual-x` 横向虚拟列表时，未设置列宽的列都会被强制设置为100px
:::
