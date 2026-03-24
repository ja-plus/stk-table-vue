# Slots 슬롯

| slots | props | 설명 |
| ---- | ---- | ---- |
| `tableHeader` | `{col}` | 헤더, 일반적으로 customHeaderCell 사용 권장. 이 슬롯은批量커스텀 헤더 시 더 편리함. |
| `empty` | -- | 빈 데이터 상태 |
| `expand` |  `{col, row}` | 확장 행 |
| `customBottom` | -- | 테이블 하단. |

::: info
셀을 커스텀하려면 `StkTableColumn['customCell']` 속성을 사용하세요.
:::


## customBottom

<demo vue="api/slots/CustomBottom.vue"></demo>

::: tip
`customBottom`은 테이블 하단에 요소를 추가하는 데 사용할 수 있으며, `IntersectionObserver`를 사용하여 테이블 하단으로 스크롤했는지 감시합니다.
:::
