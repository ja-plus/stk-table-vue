# 영역 선택 <Badge type="tip" text="^0.10.0" /> <Badge type="warning" text="등록 필요" /> 
`props.areaSelection`를 통해 테이블의 셀 드래그 선택 영역을 활성화합니다.
- 클립보드에 복사 지원 (Ctrl/Cmd + C).
- Esc로 선택 영역 취소
- 키보드 선택 지원 (방향키, Shift, Tab).
- Ctrl 다중 선택 지원 (설정 가능)
- Shift 확장 선택 지원 (설정 가능)

::: tip 등록 필요 
이 기능은 등록 후에만 사용할 수 있습니다.
:::
등록 방식:
```ts
import { registerFeature, useAreaSelection } from 'stk-table-vue';
// 영역 선택 기능 등록
registerFeature(useAreaSelection);
```



```js
<StkTable
    area-selection // [!code ++]
></StkTable>
```

<demo vue="advanced/area-selection/AreaSelection.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/area-selection/AreaSelection.vue"></demo>

## Props
- [`areaSelection`](/ko/main/api/table-props.md#areaselection)

## Emit
- [area-selection-change 영역 변경 트리거](/ko/main/api/emits.html#area-selection-change) 

## Exposed
- [getSelectedArea](/ko/main/api/expose.md#getselectedarea)
- [clearSelectedArea](/ko/main/api/expose.md#clearselectedarea)
- [copySelectedArea](/ko/main/api/expose.md#copyselectedarea)
