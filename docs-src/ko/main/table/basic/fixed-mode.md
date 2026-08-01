# table-layout: fixed

## 설정
`props.fixedMode` 를 사용하면 table-layout 이 fixed 가 됩니다.

## 예시
한 열의 너비를 고정하고 나머지 열을 균등하게 배분하는 시나리오를 구현하기 위해, 
네이티브 table-layout: fixed 의 균등 배분 동작을 활용해야 합니다.

::: warning 
이 모드는 `StkTableColumn['width']` 에만 영향을 미칩니다.
:::

<demo vue="basic/fixed-mode/FixedMode.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/fixed-mode/FixedMode.vue"></demo>

## 다단계 헤더 <Badge type="tip" text="^1.0.3" />
다단계 헤더 시나리오에서도 하위 열에 선언된 `width` 가 동일하게 적용됩니다. 상위 열의 너비는 모든 하위 열 너비의 합계가 됩니다.

<demo vue="basic/fixed-mode/FixedModeMultiHeader.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/fixed-mode/FixedModeMultiHeader.vue"></demo>
