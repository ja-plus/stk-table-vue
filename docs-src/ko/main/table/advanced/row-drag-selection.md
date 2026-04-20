# 행 드래그 선택 <Badge type="tip" text="^0.12.0" /> <Badge type="warning" text="등록 필요" />
`props.rowDragSelection` 으로 연속된 행을 마우스 드래그로 선택할 수 있습니다.
- 위아래 방향 드래그를 지원합니다.
- 커서가 테이블 가장자리에 닿으면 자동 스크롤합니다.
- 일괄 작업이나 내보내기 전 범위 선택에 적합합니다.

::: tip 등록 필요
사용 전에 이 기능을 등록해야 합니다.
:::

등록 방법:

```ts
import { registerFeature, useRowDragSelection } from 'stk-table-vue';

registerFeature(useRowDragSelection);
```

```js
<StkTable
    row-drag-selection // [!code ++]
></StkTable>
```

<demo vue="advanced/row-drag-selection/RowDragSelection.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/row-drag-selection/RowDragSelection.vue"></demo>

## Emit
- [row-drag-selection-change 행 드래그 선택 변경 시 트리거](/ko/main/api/emits.html#row-drag-selection-change)

## Exposed
- [getSelectedRows](/ko/main/api/expose.md#getselectedrows)
- [clearSelectedRows](/ko/main/api/expose.md#clearselectedrows)
