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

::: warning 右固定列が「効かない」？
固定列は `position: sticky` で実装されているため、**テーブルの総幅がコンテナを超えて横スクロールが発生した場合にのみ吸着します**。

中間のある列（下記の `url` 列など）に `width` が設定されていない場合、デフォルトの `table-layout: auto` ではブラウザがその列を**残りのスペースいっぱいに引き伸ばす**ため、テーブルの総幅が常にコンテナ幅と等しくなり、横方向のオーバーフローが発生せず、右固定列が「効かない」ように見えます（実際には一番右に貼り付いており、吸着を示すスクロール可能なコンテンツがないだけです）。

```typescript
const columns: StkTableColumn<any>[] = [
    { title: '名前', dataIndex: 'name', width: 100 },
    { title: '配信URL', dataIndex: 'url' }, // ❌ width未設定。残りのスペースを埋め、テーブルがオーバーフローしない
    { title: '操作', dataIndex: '_action', fixed: 'right', width: 150 },
];
```

解決方法（いずれか一つ）：

- width未設定の列に `width` または `minWidth` を設定する（`minWidth` 推奨。自適応しつつ総幅がコンテナを超えられる）：`{ title: '配信URL', dataIndex: 'url', minWidth: 200 }`；
- `props.virtual-x`（横方向仮想リスト）を有効にする（この場合、width未設定の列は強制的に100pxになります）；
- `props.fixedMode`（`table-layout: fixed`）をテーブルの `width` と組み合わせて使用し、列幅を厳密に遵守させる。
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
