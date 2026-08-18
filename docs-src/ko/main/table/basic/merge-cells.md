# 셀 병합 <Badge type="tip" text="^0.8.0" /> 

`StkTableColumns['mergeCells']` 함수를 통해 병합할 셀을 지정합니다.

```ts
function mergeCells(data: { 
    row: any,
    col: StkTableColumn<any>,
    rowIndex: number,
    colIndex: number
}): {
    /** 열 병합 수량 */
    colspan:number, 
    /** 행 병합 수량 */
    rowspan:number
}
```
`{ colspan: number, rowspan: number }`를 반환하면 셀 병합 수량을 나타내며, `colspan`은 열 병합 수량을, `rowspan`은 행 병합 수량을 나타냅니다.

## 열 병합
<demo vue="basic/merge-cells/MergeCellsCol.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsCol.vue"></demo>

### 열 병합 가상 리스트 <Badge type="tip" text="^1.1.0" />
#### 간단한 병합
<demo vue="basic/merge-cells/MergeCellsColVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsColVirtual/index.vue"></demo>
코드에서 `mergeCells` 함수를 정의하여 행의 `colspan` 필드를 병합 수량으로 사용합니다.
```ts
mergeCells: ({ row }) => {
    return row.colspan ? { colspan: row.colspan } : void 0;
}
```

::: tip
가로 방향 가상 리스트 모드에서 병합 셀(colspan)의 앵커 열이 보이는 영역 밖으로 스크롤되면, 보이는 열 범위를 자동으로 확장하여 병합 셀이 완전히 렌더링되도록 보장합니다.
:::

#### 불규칙 병합
<demo vue="basic/merge-cells/MergeCellsColVirtual/Special.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsColVirtual/Special.vue"></demo>

#### 매우 큰 colspan
`colspan`이 매우 큰 경우(예: 150개 열 병합)에도 가로 방향 가상 스크롤은 올바르게 동작합니다: 병합 범위가 보이는 영역과 겹치는 동안 보이는 열 범위가 병합 범위 전체로 확장되어 병합 셀이 완전히 렌더링되며, 병합 범위 밖으로 스크롤하면 정상 렌더링으로 복귀합니다.
<demo vue="basic/merge-cells/MergeCellsColVirtual/HugeColspan.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsColVirtual/HugeColspan.vue"></demo>

## 행 병합
<demo vue="basic/merge-cells/MergeCellsRow.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRow.vue"></demo>

::: tip
테이블 데이터가 변경되면 `mergeCells` 함수를 다시 호출하여 계산합니다.

주의: 행 필드를 **제자리에서 수정**한 경우(행 객체 참조가 변하지 않고 새 `dataSource`를 다시 전달하지 않은 경우)이고 `mergeCells`가 해당 필드에 의존한다면, 수정 후 인스턴스 메서드 [`clearMergeCellsCache`](/ko/main/api/expose.html#clearmergecellscache)를 호출하여 병합 결과 캐시를 수동으로 무효화해야 합니다.
:::

### 행 병합 가상 리스트 <Badge type="tip" text="^0.8.4" /> 
#### 간단한 병합
<demo vue="basic/merge-cells/MergeCellsRowVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowVirtual/index.vue"></demo>
코드에서 `mergeCells` 함수를 정의하여 행의 `rowspan` 필드를 병합 수량으로 사용합니다.
```ts
function mergeCells({ row, col }: { row: any, col: StkTableColumn<any> }) {
    if (!row.rowspan) return;
    return { rowspan: row.rowspan[col.dataIndex] || 1 };
}
```
이렇게 하면 데이터에서 직접 병합 수량을 정의할 수 있으며, `mergeCells` 함수에서 판단할 필요가 없습니다.
```ts
{
    id: '1-1-1', continent: 'Asia', country: 'China', province: 'Beijing',
    rowspan: { continent: 12, country: 6, }
}
```
::: tip mergeCells 성능
가상 리스트 모드에서는 **모든** 병합 셀(mergeCells 함수)을 순회하여 성능에 일정 영향이 있습니다.
:::

#### 불규칙 병합
<demo vue="basic/merge-cells/MergeCellsRowVirtual/Special.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowVirtual/Special.vue"></demo>

#### 초대형 rowspan
`rowspan`이 매우 큰 경우(예: 1000~2000행), 가상 리스트는 병합 셀이 덮는 모든 행을 렌더링하므로 성능이 저하될 수 있습니다. 다음 예시는 이 극단적인 시나리오를 보여줍니다.
<demo vue="basic/merge-cells/MergeCellsRowVirtual/HugeRowspan.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowVirtual/HugeRowspan.vue"></demo>

::: tip 성능 최적화
rowspan 또는 colspan가 매우 큰 경우, **일반 셀** + **border 숨김** 방식으로 병합 셀 효과를 **모사**하는 것을 고려해 볼 수 있습니다.
:::

## 행·열 병합 <Badge type="tip" text="^1.1.0" />
행 병합(`rowspan`)과 열 병합(`colspan`)은 동시에 사용할 수 있으며, `virtual`과 `virtual-x` 가상 스크롤과도 호환됩니다.
<demo vue="basic/merge-cells/MergeCellsRowColVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowColVirtual/index.vue"></demo>

## 실시간 셀 병합
사용자 상호작용(영역 선택 + 우클릭 메뉴)으로 셀을 동적으로 병합/분할하려면 [실시간 셀 병합](/ko/demos/realtime-merge-cells)을 참고하세요.
