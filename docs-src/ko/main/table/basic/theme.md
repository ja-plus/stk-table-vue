# 테마
내장 `라이트`, `다크` 두 가지 테마.

`props.theme` = `light`\|`dark`로 전환. 대응되는 스타일 선택자, `.stk-table.light` `.stk-table.dark`


오른쪽 상단 테마 전환 버튼을 클릭하여 효과를 확인하세요.

<demo vue="basic/stripe/Stripe.vue"></demo>

## CSS 변수

StkTable 은 풍부한 CSS 변수를 제공하여 테이블 스타일을 커스터마이징할 수 있습니다. 이러한 변수를 재정의하여 개인화된 커스터마이징이 가능합니다.

### 인터랙티브 데모

다음은 CSS 변수를 실시간으로 조정하고 효과를 확인할 수 있는 인터랙티브 데모입니다:

<demo vue="basic/theme/CssVarsDemo.vue"></demo>

### 사용 예시

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

또는 CSS 로 재정의:

```css
.my-custom-table {
    --row-height: 36px;
    --border-color: #e0e0e0;
    --td-bgc: #fafafa;
    --th-bgc: #f0f0f0;
    --highlight-color: #ff5722;
}
```
