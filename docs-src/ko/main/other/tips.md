# 팁

## 힌트

### 마우스를 헤더에 올릴 때 title 을 표시하지 않음
* `StkTableColumn` 의 `title` 필드를 ""(빈 문자열) 로 설정합니다. 이렇게 하면 th 에 title 이 없습니다.
* `StkTableColumn` 의 `customHeaderCell` 속성을 사용하여 헤더 셀을 사용자 정의합니다.

### Filter 필터
* ~~현재는 지원되지 않습니다. `customHeaderCell` 을 통해 사용자 정의 기능을 구현할 수 있습니다.~~
* 내장 커스텀 필터 컴포넌트. [FilterCell](/main/table/advanced/custom-cells/filter-cell)

### props.fixedMode
* **낮은 버전의 브라우저**에서는 css 를 통해 `.stk-table-main` 의 width 를 설정해야 합니다 (default: width=fit-content 가 효과 없음). 그렇지 않으면 열 너비가 0 으로 됩니다.

### customCell 너비 제어
* `customCell` 은 `td` 의 자식 요소이므로, `customCell` 의 flex 너비 제어가 작동하지 않는 경우, `StkTableColumn['width']` 에 더 작은 너비를 설정하여 flex 컨테이너가 계산하도록 할 수 있습니다. 그렇지 않으면, `flex` 컨테이너는 자식 요소의 텍스트(max-content) 너비를 계산합니다.