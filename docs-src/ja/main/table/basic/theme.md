# テーマ
組み込みの `light` と `dark` テーマがあります。

`props.theme` = `light`|`dark` でテーマを切り替えます。対応するスタイルセレクターは `.stk-table.light` `.stk-table.dark` 

ページの右上のテーマ切替ボタンをクリックすると效果を確認できます。

<demo vue="basic/stripe/Stripe.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/stripe/Stripe.vue"></demo>

## CSS 変数

StkTable は豊富な CSS 変数を提供しており、テーブルのスタイルをカスタマイズできます。これらの変数を上書きすることで、パーソナライズされたカスタマイズが可能です。

### インタラクティブデモ

以下はインタラクティブデモで、CSS 変数をリアルタイムに調整して効果を確認できます：

<demo vue="basic/theme/CssVarsDemo.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/theme/CssVarsDemo.vue"></demo>

### 使用例

```vue
<template>
    <StkTable :style="customVars" :columns="columns" :data-source="data" />
</template>

<script setup>
import { ref } from 'vue';

const customVars = ref({
    '--row-height': '36px',
    '--border-color': '#e0e0e0',
    '--td-bgc': '#fafafa',
    '--th-bgc': '#f0f0f0',
    '--highlight-color': '#ff5722',
});
</script>
```

または CSS で上書き：

```css
.my-custom-table {
    --row-height: 36px;
    --border-color: #e0e0e0;
    --td-bgc: #fafafa;
    --th-bgc: #f0f0f0;
    --highlight-color: #ff5722;
}
```

::: warning
`--row-height` は見た目の行の高さのみを決めます。仮想リストモードではスクロールの幾何計算（表示行数・総高さ・スペーサの高さ）が `row-height` prop に基づいて行われるため、CSS 変数だけを変更して `row-height` を変えないと両者が一致せず、空白帯や行のずれが発生します。

可変行高モード（`auto-row-height`）ではコンポーネントは `--row-height` を出力せず、行の高さはセルの内容で決まります。
:::
