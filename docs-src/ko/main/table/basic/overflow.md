# 오버플로우 콘텐츠 생략

## 기본

* `props.showOverflow`가 true이면, 콘텐츠가 넘칠 때 생략 부호가 표시됩니다.
* `props.showHeaderOverflow`가 true이면, 테이블 헤더 콘텐츠가 넘칠 때 생략 부호가 표시됩니다.

::: tip가상 리스트를开启하면 계산에 영향을 주지 않기 위해, 행 높이가 셀 콘텐츠에 의해 영향을 받지 않으며 `props.rowHeight` & `props.headerRowHeight`로 설정된 행 높이로 고정됩니다.
:::


<demo vue="basic/overflow/Overflow.vue"></demo>
