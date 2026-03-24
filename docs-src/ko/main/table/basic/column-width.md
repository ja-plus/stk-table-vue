# 열 너비

## 기본
다음으로 열 너비를 설정합니다:
* `StkTableColumn['width']` : `number|string`
* `StkTableColumn['minWidth']` : `number|string`
* `StkTableColumn['maxWidth']` : `number|string`

열 너비 동작을 설정하고, `number` 타입을 전달하면 단위는 px입니다.

문자열로 단위를 직접 지정할 수도 있습니다, 예: `%`, `em`, `ch` 등 (**가상 리스트는 px만 지원**).



::: info
`StkTableColumn['width']`를 설정하면 동시에 `StkTableColumn['minWidth']`와 `StkTableColumn['maxWidth']`도 설정됩니다.
:::

<demo vue="basic/column-width/ColumnWidth.vue"></demo>


## 테이블 전체 채우지 않기
컴포넌트의 테이블은 기본적으로 전체 컨테이너를 채웁니다. 따라서 `모든 열 너비 합계` < `컨테이너 너비`일 때, 설정된 열 너비 비율에 따라 자동으로 조정되어 테이블이 전체 컨테이너를 채웁니다. (이는 기본 테이블의 기본 동작이기도 합니다)

채우지 않으려면, CSS 선택자 `.stk-table-main`에 `flex: none`을 설정하여 구현할 수 있습니다.

<demo vue="basic/column-width/TableWidthFit.vue"></demo>

## 가로 가상 리스트
일반(비가상 리스트) 모드와 가상 리스트 모드에서 열 너비 제어 동작이 다릅니다.

`props.virtual-x` (가로 가상 리스트)를开启할 경우, 열 너비를 사용하여 계산해야 합니다.

::: warning
열 너비를 설정하지 않으면 모든 열의 너비가 `100`으로 설정됩니다.
:::

## 고정 열 관련 문제
고정 열 위치에 문제가 있는 경우, 열 너비를 설정했는지 확인하세요. 자세한 내용은 [고정 열](/ko/main/table/basic/fixed)을 참고하세요.
