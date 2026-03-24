# 행 높이

* `props.rowHeight` 테이블 본문 행 높이 설정, 기본값 `28px`.
* `props.headerRowHeight` 테이블 헤더 행 높이 설정, 기본값 `28px`.
* `props.footerRowHeight` 테이블 푸터 행 높이 설정, 기본값 `28px`.

## 예시
다음과 같이 테이블 헤더 행 높이를 `50px`로, 테이블 본문 행 높이를 `40px`로 설정했습니다.
```vue
<template>
    <StkTable row-height="40" header-row-height="50"></StkTable>
</template>
```
::: info
**일반**(비가상 리스트) 모드에서, 콘텐츠가 행 높이를 초과하면 행 높이가撑开됩니다.

**가상 리스트** 모드에서, 행 높이는 항상 설정된 값입니다.
:::

<demo vue="basic/row-height/RowHeight.vue"></demo>

가상 리스트를开启하면 스크롤 시 열 너비가 변경되는데, 이는 열 너비가 설정되지 않았기 때문입니다.



## 탄성 행 높이
먼저 `<StkTable>` 컴포넌트의 높이가 충분해야 합니다. `flex`, `grid` 등의 탄성 레이아웃에 배치하거나 높이를 `100%`로 설정할 수 있습니다. 이렇게 하면 부모 요소가 높이를 결정하고 하위 요소가撑开하지 않습니다.

다음으로 `.stk-table .stk-table-scroll-container`의 `flex`를 `1`로 설정합니다

 다음과 같이
```css
:deep(.stk-table .stk-table-scroll-container) {
    flex: 1;
}
```

아래 높이 조절기를 드래그하면 탄성 행 높이를 볼 수 있습니다.
<demo vue="basic/row-height/RowHeightFull.vue"></demo>
**행 수가 고정된** 테이블에 유용합니다.

::: info
height가一定程度まで縮小될 때, 최소 높이가 여전히 테이블의 콘텐츠에 의해 결정되는 것을 볼 수 있습니다 (min-content).
:::
