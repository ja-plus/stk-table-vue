# 매트릭스
<demo vue="demos/Matrix/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/Matrix/index.vue"></demo>

::: tip
CSS `pointer-event:none` 를 사용하여 첫 번째 열의 hover 이벤트를 비활성화합니다.
:::

## 주의 사항
테이블에 높이가 설정되어 있어야 합니다. 그렇지 않으면 customCell 에서 루트 요소에 높이를 설정해도 작동하지 않습니다.
```css
:deep(.stk-table .stk-table-main) {
    height: 100%; // 중요, 여기에 높이를 추가해야 합니다
}
```
