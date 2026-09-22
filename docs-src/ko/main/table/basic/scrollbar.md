# 스크롤바

## 스크롤바 스타일 설정

컴포넌트는 기본적으로 **네이티브 스크롤바**를 사용하며, 브라우저의 스크롤바 스타일에 완전히 의존합니다.

스크롤바 스타일을 커스터마이징하려면 CSS 를 통해 구현할 수 있습니다. `StkTable` 노드에 `class` 를 추가하면 됩니다.

```vue
<StkTable class="scrollbar"></StkTable>
```
```css
.scrollbar::-webkit-scrollbar {
    /* ..... */
}
```

다음 예제에서는 `::-webkit-scrollbar` 를 사용하여 스크롤바 스타일을 설정합니다.

<demo vue="basic/scrollbar-style/ScrollbarStyle.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/scrollbar-style/ScrollbarStyle.vue"></demo>

`Blink` 또는 `webkit` 엔진 브라우저 (Chrome, Safari, Opera) 에서만 유효합니다 ([::-webkit-scrollbar | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::-webkit-scrollbar) 참조).

## 내장 스크롤바 (`^0.9.0`)

DOM 기반의 내장 스크롤바는 `props.scrollbar` 를 통해 활성화할 수 있습니다.

<span style="color: #ff9800;">스크롤 백색 화면 문제를 해결할 수 있습니다.</span>

```ts 
<StkTable 
  virtual
  scrollbar //[!code ++]
></StkTable>
<StkTable
  virtual
  :scrollbar="{ width: 10, height: 10 }" // [!code ++]
></StkTable>
```
::: tip 주의
* 가상 목록 (virtual) 에서만 유효합니다.
* 모바일 기기에서는 작동하지 않습니다. (`^0.11.13`)
:::

<demo vue="basic/scrollbar-style/CustomScrollbar.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/scrollbar-style/CustomScrollbar.vue"></demo>

### API 참조

#### ScrollbarOptions 타입

```typescript
interface ScrollbarOptions {
  /** 스크롤바 활성화 여부 */
  enabled?: boolean;
  /** 수직 스크롤바 너비 default: 8 */
  width?: number;
  /** 수평 스크롤바 높이 default: 8 */
  height?: number;
  /** 스크롤바 썸 최소 너비 default: 20 */
  minWidth?: number;
  /** 스크롤바 썸 최소 높이 default: 20 */
  minHeight?: number;
}
```

### 스타일 커스터마이징

CSS 변수를 통해 스크롤바 외관을 커스터마이징할 수 있습니다:

```css
.stk-table {
  --scrollbar-thumb-color: #c1c1d7;
  --scrollbar-thumb-hover-color: #a8a8c1;
  --scrollbar-track-color: transparent;
}

/* 다크 테마 */
.stk-table.dark {
  --scrollbar-thumb-color: rgba(93, 96, 100, .9);
  --scrollbar-thumb-hover-color: #727782;
}
```

## 키보드 스크롤

> **전제 조건**: **가상 스크롤이 활성화**된 경우에만 화살표 키를 가로챕니다 (비활성 시에는 브라우저 기본 스크롤 사용). 다음 중 하나를 만족해야 합니다:
>
> 1. 마우스가 테이블 위에 호버되어 있거나;
> 2. **테이블 또는 내부 요소가 키보드 포커스를 가지고 있음**: Tab 으로 컨테이너에 포커스 (가상 스크롤 활성화 시 자동으로 `tabindex="0"`), 또는 정렬 가능한 헤더에 포커스.
>
> 조건 2 에 의해 키보드만 사용하는 사용자(마우스를 한 번도 사용하지 않음)도 화살표 키로 스크롤할 수 있습니다.

| 키 | 설명 | 기능 |
| --- | --- | --- |
| `ArrowUp` | 위 방향키 | 한 줄 위로 스크롤 |
| `ArrowDown`| 아래 방향키 | 한 줄 아래로 스크롤 |
| `ArrowLeft`| 왼쪽 방향키 | 왼쪽으로 50px 스크롤 |
| `ArrowRight`| 오른쪽 방향키 | 오른쪽으로 50px 스크롤 |
| `PageUp`| -- | 한 페이지 위로 스크롤 |
| `PageDown`| -- | 한 페이지 아래로 스크롤 |
| `Home`| -- | 상단으로 스크롤 |
| `End`| -- | 하단으로 스크롤 |
