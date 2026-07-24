# 실시간 셀 병합

`area-selection`(영역 선택) 기능으로 여러 셀을 선택한 후 우클릭하여 메뉴를 열고 셀을 실시간으로 병합/분할할 수 있습니다.

## 구현 방법

1. `area-selection` 영역 선택 기능을 활성화하고 `area-selection-change` 이벤트를 감지하여 선택 범위를 가져옵니다
2. `row-menu` 이벤트(우클릭)를 감지하여 사용자 정의 컨텍스트 메뉴를 표시합니다
3. "셀 병합" 클릭 시 선택 범위를 `rowspan`/`colspan` 정보로 변환하여 Map에 저장합니다
4. 열 설정의 `mergeCells` 콜백이 Map에서 병합 정보를 읽어 반환합니다
5. "셀 분할" 클릭 시 선택 범위 내의 병합 정보를 삭제합니다

<demo vue="demos/RealtimeMergeCells/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/RealtimeMergeCells/index.vue"></demo>

## 핵심 로직

```typescript
// 병합 상태 저장 key: `${rowId}__${colIndex}` value: { rowspan, colspan }
const mergeMap = reactive(new Map<string, { rowspan: number; colspan: number }>());

// 열 설정의 mergeCells 콜백
function mergeCells({ row, col }) {
  const colIndex = columns.findIndex(c => c.dataIndex === col.dataIndex);
  return mergeMap.get(`${row.id}__${colIndex}`);
}

// 선택한 셀 병합
function mergeSelectedCells() {
  const range = selectionRanges.at(-1);
  const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
  const startRow = dataSource.value[minRow];

  // 범위 내 기존 병합 정보를 제거하여 충돌 방지
  for (let r = minRow; r <= maxRow; r++)
    for (let c = minCol; c <= maxCol; c++)
      mergeMap.delete(`${dataSource.value[r].id}__${c}`);

  // 왼쪽 상단 셀에 병합 정보 설정
  mergeMap.set(`${startRow.id}__${minCol}`, {
    rowspan: maxRow - minRow + 1,
    colspan: maxCol - minCol + 1,
  });

  // 테이블 강제 재렌더링
  dataSource.value = dataSource.value.slice();
}

// 선택한 셀 분할
function splitSelectedCells() {
  for (const range of selectionRanges) {
    const { minRow, maxRow, minCol, maxCol } = normalizeRange(range);
    for (let r = minRow; r <= maxRow; r++)
      for (let c = minCol; c <= maxCol; c++)
        mergeMap.delete(`${dataSource.value[r].id}__${c}`);
  }
  dataSource.value = dataSource.value.slice();
}
```

::: tip 참고
1. 병합 후 왼쪽 상단 셀의 내용만 표시됩니다. 덮인 셀의 데이터는 데이터 소스에 유지되며 분할 후 복원됩니다
2. 새 병합 작업은 선택 범위 내 기존 병합 정보를 자동으로 제거하여 충돌을 방지합니다
3. 이 방식은 가상 스크롤 모드에서도 작동합니다
:::
