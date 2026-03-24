# マトリックス
<demo vue="demos/Matrix/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/Matrix/index.vue"></demo>

::: tip
CSS `pointer-event:none` を使用して最初の列ホバーイベントを無効化します。
:::

## 注意事項
テーブルには高さが設定されている必要があります。そうしないと、customCellでルート要素に高さを設定しても機能しません。
```css
:deep(.stk-table .stk-table-main) {
    height: 100%; // 重要、ここに高さを追加する必要があります
}
```
