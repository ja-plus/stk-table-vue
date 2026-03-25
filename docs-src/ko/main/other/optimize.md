# 추가 성능 최적화

## tr 레이어화
* CSS 에서 `transform:translateZ(0)` 을 설정하여 각 tr 행을 레이어화합니다. 이것은 성능에 도움이 됩니다.
  - 합성 레이어 승격으로 인해 검은 배경과 빨간 텍스트의 텍스트 색상이 변경될 수 있습니다.
  - ~~다음과 같은 경우 이 기능을 활성화해 보세요~~
    - ~~복잡한 `customCell` 컴포넌트가 많은 경우~~
    - ~~강조 애니메이션이 많은 경우~~

스크롤 지연 감소가 눈에 띄는지 확인하기 위해 다음 CSS 를 추가해 보세요 (저성능 머신에서 더 두드러집니다).

```css
.stk-table tbody tr {
  transform: translateZ(0);
}
```

## 스크롤 시 백색 화면
1. 네이티브 스크롤바
  1. 행 단위 스크롤을 시도하세요. [scroll-row-by-row](/ko/main/table/basic/scroll-row-by-row.md)
  2. tr 레이어화를 시도하세요.
  3. `.stk-table` 요소에 배경색을 추가하지 마세요.
2. 내장 스크롤바 사용. [scrollbar](/ko/main/table/basic/scrollbar.md)
    
## 강조
* 강조 프레임레이트를 지정하려면 `props.highlightConfig.fps`를 설정하세요. 프레임레이트를 낮추면 리소스 사용량 감소에 도움이 됩니다.
  - 권장값: 30fps. 최소 권장값: 15fps

## relative fixed
* `props.cellFixedMode`가 `relative`로 설정된 경우, 고정 열과 헤더는 상대 위치를 사용하여 구현되며 `sticky` 구현과 비교하여 렌더링 합성 레이어가 적습니다.
* 문제: 세로 방향 가상 스크롤이 활성화되고 가로 방향 가상 스크롤이 비활성화된 경우, 일부 열 너비가 설정되지 않으면 세로 스크롤로 인한 열 너비 변경이 오른쪽 고정 열 계산 오차를 일으킬 수 있습니다.

## props.autoResize
* 감시 성능 비용을 제거하려면 수동으로 `props.autoResize=false` 를 설정하세요. 너비와 높이가 고정된 테이블에 적합합니다.

## props.smoothScroll
* 일부 브라우저 버전에는 기본 관성 스크롤이 있습니다. 스크롤이 너무 빠르면 백색 화면이 발생할 수 있습니다. 따라서 Chrome > 85 에서는 기본값으로 비활성화되어 있으며 `onwheel` 을 사용하여 스크롤을 프록시하고 백색 화면을 방지합니다.
