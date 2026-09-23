# Slots 슬롯

| slots | props | 설명 |
| ---- | ---- | ---- |
| `tableHeader` | `{col}` | 헤더, 일반적으로 customHeaderCell 사용 권장. 이 슬롯은 일괄 커스텀 헤더 시 더 편리함. |
| `empty` | -- | 빈 데이터 상태 |
| `expand` |  `{col, row}` | 확장 행 |
| `customBottom` | -- | 테이블 하단. |

::: info
셀을 커스텀하려면 `StkTableColumn['customCell']` 속성을 사용하세요.
:::

## customCell 쪽 슬롯 <Badge type="tip" text="^1.2.7" />

아래는 **사용자의 customCell 컴포넌트** 슬롯입니다(StkTable 최상위 슬롯이 아님). 열에 `customCell`을 지정한 경우에만 전달되며, 내장 장식을 직접 배치할 수 있도록 돌려줍니다:

| slots | 내장 내용 | 설명 |
| ---- | ---- | ---- |
| `stkFoldIcon` | 펼침 컨트롤: 화살표 / 지연 로딩 / 말단 행 자리표시자 | 렌더링하면 내장 모양과 펼침 회전을 그대로 얻습니다. 생략하면 직접 컨트롤을 그리고 `data-stk-fold`를 붙여야 합니다 |
| `stkTreeIndent` | 레벨 들여쓰기 칸 + 단계 가이드선(`treeConfig.showGuide`) | `tree-node` 열용. `showGuide`가 꺼지면 들여쓰기만 남음 |
| `stkDragIcon` | 행 드래그 핸들 | `type: 'dragRow'` 열용 |

::: warning 배치 계약
이 슬롯을 사용할 때 셀 루트 요소에는 `height: 100%; display: flex; align-items: center;`가 필요합니다. 가이드선은 들여쓰기 칸 안에 그려지고 행 높이 전체로 늘어나므로, 행 높이를 채우는 flex 행이 아니면 선이 도중에 잘립니다.
:::

::: tip 예시
[파일 관리 트리](/ko/demos/file-tree)를 참조하세요.
:::


## customBottom

<demo vue="api/slots/CustomBottom.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/api/slots/CustomBottom.vue"></demo>

::: tip
`customBottom`은 테이블 하단에 요소를 추가하는 데 사용할 수 있으며, `IntersectionObserver`를 사용하여 테이블 하단으로 스크롤했는지 감시합니다.
:::
