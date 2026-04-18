# Theme
Built-in `light` and `dark` themes.

Switch theme by `props.theme` = `light`|`dark`. Corresponding to style selectors, `.stk-table.light` `.stk-table.dark` 

You can click the theme switch button in the top right corner of the page to see the effect.

<demo vue="basic/stripe/Stripe.vue"></demo>

## CSS Variables

StkTable provides rich CSS variables that allow you to customize the table style. You can achieve personalized customization by overriding these variables.

### Interactive Demo

Below is an interactive demo where you can adjust CSS variables in real-time and see the effects:

<demo vue="basic/theme/CssVarsDemo.vue"></demo>

### Usage Example

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

Or override via CSS:

```css
.my-custom-table {
    --row-height: 36px;
    --border-color: #e0e0e0;
    --td-bgc: #fafafa;
    --th-bgc: #f0f0f0;
    --highlight-color: #ff5722;
}
```