# 가상 리스트
대량 데이터 렌더링 시 성능을 향상시키는 데 사용됩니다.

## 설정
props:

| 속성 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| virtual | `boolean` | `false` | 가상 리스트 활성화 여부 |
| virtualX | `boolean` | `false` | 가로 방향 가상 리스트 활성화 여부 |
| autoResize | `boolean`\| `() => void` | `true` | 가시 영역 자동 재계산 여부. 콜백 함수를 전달하면 resize 후 이 함수가 호출됩니다 |


## 세로 방향 가상 리스트
::: warning
행 높이가 콘텐츠의 영향을 받지 않습니다. 자세한 내용은 [행 높이](/ko/main/table/basic/row-height) 챕터를 참고하세요.
:::
```vue
<StkTable virtual></StkTable>
```
<demo vue="advanced/virtual/VirtualY.vue"></demo>

## 가로 방향 가상 리스트
::: warning
`StkTableColumn['width']`의 기본값은 `100px`입니다.
:::

```vue
<StkTable virtual-x></StkTable>
```
<demo vue="advanced/virtual/VirtualX.vue"></demo>

## 가시 영역 자동 재계산 autoResize
많은 상황에서 가상 리스트 영역의 높이와 너비가 다양한 이유로 인해 변경되며, 이때 가시 영역을 다시 계산해야 합니다.

컴포넌트 내부는 이미 `ResizeObserver` 를 기반으로 `StkTable` 의 크기 변화를 감지하며, 크기가 변경될 때 자동으로 가시 영역을 다시 계산합니다. 이 기능은 기본적으로 활성화되어 있습니다.


::: warning
`ResizeObserver` 를 지원하지 않는 브라우저는 `onresize` 를 사용하여 폴백합니다.
:::

특정 상황에서는 여전히 수동으로 가상 리스트의 가시 영역을 다시 계산해야 하며, 이때 컴포넌트의 expose 메서드를 호출할 수 있습니다.

```ts
/**
 * 세로 가상 리스트의 가시 영역 초기화
 * @param {number} [height] 가상 스크롤의 높이
 */
initVirtualScrollY(height?: number)
/**
 * 가로 가상 리스트의 가시 영역 초기화
 */
initVirtualScrollX()
/**
 * 세로 및 가로 가상 리스트의 가시 영역 초기화
 */
initVirtualScroll(height?: number)
```
`initVirtualScroll` 은 `initVirtualScrollY` + `initVirtualScrollX` 와 동일합니다.

### 자동 계산 비활성화
```vue
<StkTable :autoResize="false"></StkTable>
```

## 단일 열 리스트
자세한 내용은 [가상 단일 열 리스트](/ko/demos/virtual-list.html)를 참고하세요.
