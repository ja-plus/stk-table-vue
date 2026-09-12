# 테마
내장 `라이트`, `다크` 두 가지 테마.

`props.theme` = `light`\|`dark`로 전환. 대응되는 스타일 선택자, `.stk-table.light` `.stk-table.dark`


오른쪽 상단 테마 전환 버튼을 클릭하여 효과를 확인하세요.

<demo vue="basic/stripe/Stripe.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/stripe/Stripe.vue"></demo>

## CSS 변수

StkTable 은 풍부한 CSS 변수를 제공하여 테이블 스타일을 커스터마이징할 수 있습니다. 이러한 변수를 재정의하여 개인화된 커스터마이징이 가능합니다.

### 인터랙티브 데모

다음은 CSS 변수를 실시간으로 조정하고 효과를 확인할 수 있는 인터랙티브 데모입니다:

<demo vue="basic/theme/CssVarsDemo.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/theme/CssVarsDemo.vue"></demo>

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

::: warning
`--row-height`는 보이는 행 높이만 결정합니다. 가상 리스트 모드에서는 스크롤 기하(표시 행 수, 총 높이, 자리표시자 높이)가 `row-height` prop 으로 계산되므로, CSS 변수만 바꾸고 `row-height`를 함께 바꾸지 않으면 둘이 어긋나 빈 영역이나 행 정렬 어긋남이 발생합니다.

가변 행 높이 모드(`auto-row-height`)에서는 컴포넌트가 `--row-height`를 출력하지 않으며, 행 높이는 셀 내용에 의해 결정됩니다.
:::
