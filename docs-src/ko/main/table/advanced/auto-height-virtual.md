# 가변 높이 가상 리스트

## 설정
| 속성  | 타입  | 기본값 | 설명  |
| ----- | ----- | ----- | ----- |
| props.autoRowHeight | `boolean` \| `AutoRowHeightConfig<DT>` | false | 자동 행 높이 활성화 여부 |
| props.rowHeight | `number` | -- | `props.autoRowHeight`가 `true`일 때,期望行高로 사용하여 계산합니다. 실제 행 높이에 영향을 주지 않습니다. |

### AutoRowHeightConfig<DT>
```ts
type AutoRowHeightConfig<DT> = {
    /** 예상 행 높이 */
    expectedHeight?: number | ((row: DT) => number);
};
```

::: tip 예상 행 높이
一行의 높이가 얼마일지 예상하여 현재 테이블 높이에서 몇 행을 배치할 수 있는지 계산하는 데 사용됩니다.
:::
::: tip 우선순위
`props.autoRowHeight.expectedHeight` > `props.rowHeight`
:::


## 예시

<demo vue="advanced/auto-height-virtual/AutoHeightVirtual/index.vue"></demo>

셀 상하 패딩을 제어하려면 CSS 변수를 오버라이드하여实现할 수 있습니다：
```css
.stk-table {
    --cell-padding-y: 8px;
}
```

## 단일 열 리스트
자세한 내용은 [가상 단일 열 리스트 - 가변 높이](/ko/demos/virtual-list.html#가변-높이)를 참고하세요.
