# 主题
内置 `亮色`，`暗色`两种主题。

通过 `props.theme` = `light`|`dark` 切换。对应到样式选择器，`.stk-table.light` `.stk-table.dark` 


您可以点击页面右上角的主题切换按钮看看效果。

<demo vue="basic/stripe/Stripe.vue"></demo>

## CSS 变量

StkTable 提供了丰富的 CSS 变量，允许您自定义表格的样式。您可以通过覆盖这些变量来实现个性化定制。

### 交互式演示

下面是一个交互式演示，您可以实时调整 CSS 变量并查看效果：

<demo vue="basic/theme/CssVarsDemo.vue"></demo>

### 使用示例

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

或者通过 CSS 覆盖：

```css
.my-custom-table {
    --row-height: 36px;
    --border-color: #e0e0e0;
    --td-bgc: #fafafa;
    --th-bgc: #f0f0f0;
    --highlight-color: #ff5722;
}
```