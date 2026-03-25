# 팁

## 힌트

### 마우스를 헤더에 올릴 때 title 을 표시하지 않음
* `StkTableColumn` 의 `title` 필드를 ""(빈 문자열) 로 설정합니다. 이렇게 하면 th 에 title 이 없습니다.
* `StkTableColumn` 의 `customHeaderCell` 속성을 사용하여 헤더 셀을 사용자 정의합니다.

### Filter 필터
* 현재는 지원되지 않습니다. `customHeaderCell` 을 통해 사용자 정의 기능을 구현할 수 있습니다.

### props.fixedMode
* **낮은 버전의 브라우저**에서는 css 를 통해 `.stk-table-main` 의 width 를 설정해야 합니다 (default: width=fit-content 가 효과 없음). 그렇지 않으면 열 너비가 0 으로 됩니다.