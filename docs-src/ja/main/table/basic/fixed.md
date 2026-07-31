# 固定列

`StkTableColumn['fixed'] = 'left'` または `'right'` を設定して、左または右の固定列を実現します。

::: info 新しい固定列インタラクション
テーブルは `sticky` を使用して固定列を実装しているため、**列吸着**機能をサポートしています。任意列を固定列に設定でき、列が可視領域を超えると初めて固定されます。
:::

## 基本

列設定デモ
```typescript{2,6,10}
const columns: StkTableColumn<any>[] = [
    { title: '名前', dataIndex: 'name', fixed: 'left', width: 100 },
    { title: '年齢', dataIndex: 'age', width: 100 }, 
    { title: '住所', dataIndex: 'address', width: 200 }, 
    // 性別列より前のすべての列はwidthを指定する必要があります
    { title: '性別', dataIndex: 'gender', width: 50, fixed: 'left' },
    { title: 'メール', dataIndex: 'email' },
    { title: '電話', dataIndex: 'phone' },
    { title: '会社', dataIndex: 'company'  },
    { title: '操作', dataIndex: 'operation', fixed: 'right', width: 100 },
];

```
::: warning
**固定列**の吸着位置を列幅で計算するために、左固定列より前のすべての列は**widthを指定する必要があります**。

上記のテーブルのように、`性別` 列より前のすべての列はwidthが設定されている必要があります。右固定列也同样です。
:::

::: warning 右固定列が「異常」？
右固定列は通常**`columns` の末尾に宣言します**。この場合、これらの列は列幅の設定に依存せず、常に固定されたままになります。

ただし、**吸着効果**（列が可視領域を超えたときにのみ吸着する効果、および固定列シャドウ）が必要な場合は、**すべての列に列幅を指定する必要があります**。吸着位置は各列の列幅を累積して計算するため、中間のある列（下記の `url` 列など）に `width` がないと、計算結果が実際のレンダリング幅と一致せず、吸着のタイミングが異常になります。

```typescript
const columns: StkTableColumn<any>[] = [
    { title: '名前', dataIndex: 'name', width: 100 },
    { title: '配信URL', dataIndex: 'url' }, // ❌ width未設定。吸着の計算が不正確になる
    { title: '操作', dataIndex: '_action', fixed: 'right', width: 150 },
];
```
:::

<demo vue="basic/fixed/Fixed.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/fixed/Fixed.vue"></demo>

横スクロールすると、`性別` 列が自動的に左に吸着するのがわかります。

::: tip
すべての左固定列を一番左に配置したい場合は、`columns` 配列の先頭に配置します。同様に、すべての右固定列を `columns` 配列の末尾に配置します。
:::

## 固定列シャドウ

デフォルトでは、固定列にはシャドウ効果はありません。シャドウ効果が必要な場合は、`fixed-col-shadow` プロパティを `true` に設定できます。

```html
<StkTable fixed-col-shadow></StkTable>
```

## 仮想リスト列固定


<demo vue="basic/fixed/FixedVirtual.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/fixed/FixedVirtual.vue"></demo>

::: warning
`props.virtual-x`（横方向仮想リスト）が設定されている場合、widthが指定されていない列は強制的に100pxになります
:::
