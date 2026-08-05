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

### 열 병합 가상 리스트 <Badge type="tip" text="^1.0.5" />
<demo vue="basic/merge-cells/MergeCellsColVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsColVirtual/index.vue"></demo>

::: tip
가로 방향 가상 리스트 모드에서 병합 셀(colspan)의 앵커 열이 보이는 영역 밖으로 스크롤되면, 보이는 열 범위를 자동으로 확장하여 병합 셀이 완전히 렌더링되도록 보장합니다.
:::

## 행 병합
<demo vue="basic/merge-cells/MergeCellsRow.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRow.vue"></demo>

::: tip
테이블 데이터가 변경되면 `mergeCells` 함수를 다시 호출하여 계산합니다.
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
이렇게 하면 데이터에서 직접 병합 수량을 정의할 수 있으며, `mergeCells` 함수에서 判断할 필요가 없습니다.
```ts
{
    id: '1-1-1', continent: 'Asia', country: 'China', province: 'Beijing',
    rowspan: { continent: 12, country: 6, }
}
```
::: tip 성능
가상 리스트 모드에서는 **모든** 병합 셀(mergeCells 함수)을遍歴하여 성능에 일정 영향이 있습니다.
:::
::: warning 주의
rowspan가 특히 크면(예: 1000행) 여전히 이 병합 셀이 덮는 모든 행을 렌더링합니다. 따라서 rowspan가 너무 크지 않는 것을 권장합니다.
:::

#### 불규칙 병합
<demo vue="basic/merge-cells/MergeCellsRowVirtual/Special.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/merge-cells/MergeCellsRowVirtual/Special.vue"></demo>
