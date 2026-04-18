# テーマ
組み込みの `light` と `dark` テーマがあります。

`props.theme` = `light`|`dark` でテーマを切り替えます。対応するスタイルセレクターは `.stk-table.light` `.stk-table.dark` 

ページの右上のテーマ切替ボタンをクリックすると效果を確認できます。

<demo vue="basic/stripe/Stripe.vue"></demo>

## CSS 変数

StkTable は豊富な CSS 変数を提供しており、テーブルのスタイルをカスタマイズできます。これらの変数を上書きすることで、パーソナライズされたカスタマイズが可能です。

### インタラクティブデモ

以下はインタラクティブデモで、CSS 変数をリアルタイムに調整して効果を確認できます：

<demo vue="basic/theme/CssVarsDemo.vue"></demo>

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
