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
很多情况下，虚拟列表区域的宽高会因为各种原因发生变化，这时需要重新计算可视区域。

组件内部已基于 `ResizeObserver` 监听 `StkTable` 的尺寸变化，当尺寸变化时，会自动重新计算可视区域，该功能默认打开。


::: warning
不支持 `ResizeObserver` 的浏览器会使用 `onresize`兜底。
:::

某些情况下，仍需要手动重新计算虚拟列表的可视区域，此时可以调用组件expose的方法。

```ts
/**
 * 初始化纵向虚拟列表的可视区域
 * @param {number} [height] 虚拟滚动的高度
 */
initVirtualScrollY(height?: number)
/**
 * 初始化横向虚拟列表的可视区域
 */
initVirtualScrollX()
/**
 * 初始化纵向和横向虚拟列表的可视区域
 */
initVirtualScroll(height?: number)
```
`initVirtualScroll` 等价于 `initVirtualScrollY` + `initVirtualScrollX`

### 关闭自动计算
```vue
<StkTable :autoResize="false"></StkTable>
```

## 단일 열 리스트
자세한 내용은 [가상 단일 열 리스트](/ko/demos/virtual-list.html)를 참고하세요.
