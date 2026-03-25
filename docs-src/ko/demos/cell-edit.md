# 셀 편집
각 프로젝트마다 다른 요구 사항이 있기 때문에 테이블에는 내장된 셀 편집 기능이 없습니다. `customCell` 을 사용하여 직접 구현해야 합니다.

간단한 구현을 아래에示합니다:

* 셀을 더블 클릭하여 편집: `Enter` 를 눌러 저장, `Esc` 를 누르거나 blur 하여 취소.
* 행 편집 모드: 편집 행에 체크하여 행 편집 모드로 진입합니다. 이 모드에서는 저장하기 위해 `Enter` 를 누를 필요가 없습니다.

<demo vue="demos/CellEdit/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/CellEdit/index.vue"></demo>

## 구현 설명
`customCell` 을 사용하여 입력을 커스터마이즈함으로써 구현됩니다.

::: tip change 이벤트
이벤트 버스 ([CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) / [mitt](https://www.npmjs.com/package/mitt)) 또는 기타 방법을 통해 `EditCell` 의 change 이벤트를 외부에 알릴 수 있습니다.
:::
