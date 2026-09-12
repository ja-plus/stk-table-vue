# 主题
内置 `亮色`，`暗色`两种主题。

通过 `props.theme` = `light`|`dark` 切换。对应到样式选择器，`.stk-table.light` `.stk-table.dark` 


您可以点击页面右上角的主题切换按钮看看效果。

<demo vue="basic/stripe/Stripe.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/stripe/Stripe.vue"></demo>

## CSS 变量

StkTable 提供了丰富的 CSS 变量，允许您自定义表格的样式。您可以通过覆盖这些变量来实现个性化定制。

### 交互式演示

下面是一个交互式演示，您可以实时调整 CSS 变量并查看效果：

<demo vue="basic/theme/CssVarsDemo.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/theme/CssVarsDemo.vue"></demo>

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

::: warning
`--row-height` 只决定视觉行高。虚拟列表等场景下，滚动几何（可视行数、总高、占位高度）由 `row-height` prop 计算，只改 CSS 变量而不改 `row-height` 会使二者不一致，出现空白带或行错位。

变高模式（`auto-row-height`）下组件不输出 `--row-height`，行高由单元格内容撑开。
:::