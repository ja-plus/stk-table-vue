# 너비/높이

테이블의 너비와 높이는 루트 컨테이너의 너비와 높이에 의해 결정됩니다.

따라서 테이블을 `flex` 컨테이너에 배치하고 `flex`로 높이를 관리하여 너비와 높이를 수동으로 설정할 필요가 없습니다.

## 고정 너비/높이

::: tip
`style`을 통해 테이블 너비와 높이를 제어합니다.
:::

<demo vue="basic/size/Default.vue"></demo>

## Flex 레이아웃

::: tip
외부 `flex`弹性盒의 높이를 제어하면 테이블 높이가 자동으로 조정됩니다.
:::

<demo vue="basic/size/Flex.vue"></demo>
