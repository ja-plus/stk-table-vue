# table-layout: fixed

## 設定
`props.fixedMode` を有効にすると table-layout: fixed になります

## 例
1つの列を固定幅にし、残りの列を均等に分割するシナリオを実現するには、ネイティブtable-layout: fixedの均等列幅分散の動作を活用する必要があります。

::: warning 
このモードは `StkTableColumn['width']` にのみ影響します
:::

<demo vue="basic/fixed-mode/FixedMode.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/fixed-mode/FixedMode.vue"></demo>

## 多階層ヘッダー <Badge type="tip" text="^1.0.3" />
多階層ヘッダーのシナリオでも、子列に宣言された `width` は同様に有効になります。親列の幅はすべての子列の幅の合計になります。

<demo vue="basic/fixed-mode/FixedModeMultiHeader.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/fixed-mode/FixedModeMultiHeader.vue"></demo>
