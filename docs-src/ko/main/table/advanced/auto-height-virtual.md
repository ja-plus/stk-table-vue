# 가변 높이 가상 리스트

## 설정
| 속성  | 타입  | 기본값 | 설명  |
| ----- | ----- | ----- | ----- |
| props.autoRowHeight | `boolean` \| `AutoRowHeightConfig<DT>` | false | 자동 행 높이 활성화 여부 |
| props.rowHeight | `number` | -- | `props.autoRowHeight`가 `true`일 때, 기대 행 높이로 사용하여 계산합니다. 실제 행 높이에 영향을 주지 않습니다. |

### AutoRowHeightConfig&lt;DT&gt;
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

::: tip 내장 스크롤바(`props.scrollbar`) 사용 권장
가변 높이 모드에서는 각 행의 높이를 런타임에 실측하므로 콘텐츠 전체 높이(scrollHeight)가 스크롤 중 계속 변합니다. 따라서 네이티브 스크롤바는 드래그 중 포인터 매핑을 잃어 **마우스를 따라오지 않는**(섬과 커서가 어긋나는) 현상이 발생합니다. 내장 스크롤바를 사용하는 것을 권장합니다:

```vue
<StkTable virtual auto-row-height scrollbar></StkTable>
```

자세한 내용은 [스크롤바](/ko/main/table/basic/scrollbar.md)를 참고하세요.
:::

## 예시

<demo vue="advanced/auto-height-virtual/AutoHeightVirtual/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/auto-height-virtual/AutoHeightVirtual/index.vue"></demo>

셀 상하 패딩을 제어하려면 CSS 변수를 오버라이드하여 구현할 수 있습니다:
```css
.stk-table {
    --cell-padding-y: 8px;
}
```

## 단일 열 리스트
자세한 내용은 [가상 단일 열 리스트 - 가변 높이](/ko/demos/virtual-list.html#가변-높이)를 참고하세요.

## Pretext로 행 높이 사전 계산

행 높이가 콘텐츠에서 사전에 계산 가능한 경우, [@chenglou/pretext](https://github.com/chenglou/pretext)를 사용하여 사전 계산하는 것을 권장합니다. 이렇게 하면 런타임에 행 높이를 측정하는 성능 오버헤드를 피할 수 있으며, 스크롤바 떨림을 방지할 수 있습니다.

### 작동 원리

1. `auto-row-height` 및 `virtual` 활성화
2. `prepare`와 `layout` 메서드를 사용하여 텍스트 높이 계산
3. `setAutoHeight(rowKey, height)`를 통해 실제 행 높이 설정

::: warning 사전 계산한 높이는 실제 렌더링과 일치해야 합니다
`setAutoHeight`로 설정한 행 높이는 권위 있는 값으로 취급됩니다(컴포넌트가 해당 행을 다시 측정하지 않습니다). 따라서 `prepare` / `layout`에 전달하는 **폰트, 줄 높이, 사용 가능한 너비, 셀 상하 padding**이 실제 적용된 CSS와 일치해야 합니다. 하나라도 어긋나면 가상 스크롤의 총 높이가 실제 콘텐츠 높이와 달라져, **맨 아래까지 드래그해도 마지막 행(들)이 렌더링되지 않는** 현상이 발생합니다(스크롤바는 끝인데 콘텐츠는 끝에 도달하지 않음). 예제에서는 폰트 / 줄 높이 / padding을 `getComputedStyle`(스타일 계산값, 레이아웃 불필요)로 읽고, 텍스트 너비는 `ResizeObserver`의 `contentRect`에서 가져옵니다. 테이블은 auto 레이아웃이므로 열 설정의 `width`는 하한일 뿐입니다(예제의 200px 열은 실제로 450px 이상으로 늘어납니다). 열 설정으로 추측하거나 동기 레이아웃(리플로우)을 유발하는 `clientWidth`를 읽지 마세요. 이러한 읽기는 초기화/크기 변경 시 한 번만 실행되며 스크롤 프레임에는 들어가지 않습니다.
:::

### 예시

<demo vue="advanced/auto-height-virtual/PretextAutoHeight/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/auto-height-virtual/PretextAutoHeight/index.vue"></demo>

### API

#### setAutoHeight(rowKey, height)

특정 행의 행 높이를 수동으로 설정합니다.

| 매개변수 | 타입 | 설명 |
| --- | --- | --- |
| rowKey | `string \| number` | 행 고유 식별자, `row-key`에 해당 |
| height | `number` | 행 높이 |

::: tip 팁
- 데이터 로드 후 호출해야 합니다
- 설정 후 즉시 반영되어 스크롤 위치 판정과 콘텐츠 전체 높이(scrollHeight) 계산에 즉시 참여합니다
- 행 높이가 변경되면 이 메서드를 다시 호출하여 업데이트해야 합니다
- `null` 또는 `undefined`를 전달하면 설정된 행 높이를 제거하고 자동 측정으로 복원됩니다
:::

::: tip 성능
가변 높이 모드에서 스크롤 위치 판정은 O(log n)(펜윅 트리 인덱스)로 최적화되었으며, 콘텐츠 전체 높이는 각 행의 실측/추정 높이의 정확한 합계(행 수 × 기본 행 높이 추정이 아님)로 계산되어 대용량 데이터 깊은 스크롤도 부드럽습니다. 데이터 소스를 통째로 교체하면 이전 행 키의 실측 높이는 자동으로 회수됩니다.
:::
