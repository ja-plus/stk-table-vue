# 행/셀 선택/호버

## demo
<demo vue="basic/row-cell-mouse-event/RowCellHoverSelect.vue"></demo>

## 행 선택 비활성화
`rowActive.disabled`를 사용하면 특정 행의 선택 기능을 비활성화할 수 있습니다.
::: warning 주의
`rowActive.disabled`: 행은 클릭하여 선택할 수 없습니다. 그러나 `setCurrentRow` 메서드를 통해 여전히 해당 행을 선택할 수 있습니다.
:::

## 현재 행 설정
컴포넌트 메서드 [expose setCurrentRow](/ko/main/api/expose.html#setcurrentrow)를 호출하여 현재 행을 선택할 수 있습니다

## 선택된 셀 설정 
컴포넌트 메서드 [expose setSelectedCell](/ko/main/api/expose.html#setselectedcell)을 호출하여 현재 셀을 선택할 수 있습니다


## API
### 관련 Props:
| key | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| rowHover | boolean | true | 마우스 호버 시 행 강조 여부 |
| rowActive | boolean \| RowActiveOption | true | 선택된 행 강조 여부 |
| ~~rowCurrentRevokable~~ `deprecated(v0.8.9)`는 `rowActive.revokable` 사용하세요 | ~~boolean~~ | ~~true~~ | ~~현재 행 다시 클릭 시 선택 취소 여부 (rowActive=true)~~ |
| cellHover | boolean | false | 마우스 호버 시 셀 강조 여부 |
| cellActive | boolean | false | 선택된 셀 강조 여부 |
| selectedCellRevokable | boolean | true | 셀 다시 클릭 시 선택 취소 여부 (cellActive=true) |

::: tip
`rowActive`를 false로 설정하면 컴포넌트 내부 스타일만 숨기며, tr에 여전히 `active` 클래스가 추가되어 커스텀 스타일에便利합니다
:::

### RowActiveOption
| key | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| enabled | boolean | true | 행 선택 기능 활성화 여부 |
| disabled | (row: DT) => boolean | () => false | 행 선택 비활성화 여부 |
| revokable | boolean | true | 선택 취소 가능 여부 |
