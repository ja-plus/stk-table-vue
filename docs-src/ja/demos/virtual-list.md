# 仮想単位リスト

これは本质的に**単位列だけ**を持つテーブルであり、以下のステップで実装されます：
* `props.bordered=false` でテーブルボーダーを削除。
* `props.headless=true` でテーブルヘッダーを削除。
* `props.rowActive=false` で行クリックハイライトを削除。
* `props.rowHover=false` で行ホバースタイルを削除。
* `props.rowHeight` で行の高さを設定。
* `StkTableColumn['customCell']` でセルコンテンツをカスタマイズ。


## コード例
```ts
<StkTable
    row-key="id"
    style="height: 400px"
    virtual // [!code ++]
    headless // [!code ++]
    :row-height="200" // [!code ++]
    :bordered="false" // [!code ++]
    :row-active="false" // [!code ++]
    :row-hover="false" // [!code ++]
    :columns="columns"
    :data-source="data"
></StkTable>
```

## 例

### 等高さ
<demo vue="demos/VirtualList/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/VirtualList"></demo>

### 可変高さ
`props.autoRowHeight` を設定して自動行高を有効にします。

`props.autoRowHeight.expectedHeight` を通じて期待高さを設定します。デフォルトでは、`props.rowHeight` が期待高さとして使用されます。

<demo vue="demos/VirtualList/AutoHeightVirtualList/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/VirtualList/AutoHeightVirtualList"></demo>
