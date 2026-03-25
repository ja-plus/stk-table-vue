# 패널 트리
## 데모
<demo vue="demos/PanelTree/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/PanelTree/index.vue"></demo>

## 주요 포인트
### 확장 가능한 행의 선택 비활성화
행에 자식이 있을 때 선택을 비활성화하기 위해 `row-active` 에서 `disabled` 함수를 설정합니다.
### 확장 가능한 행의 hover 스타일 제거
1. 행에 자식이 있을 때 `panel-header-row` 클래스 이름을 추가하기 위해 `row-class-name` 을 설정합니다.
2. `panel-header-row` -> `--tr-hover-bgc: var(--th-bgc);` 를 설정하여 헤더 배경색과 일치시킵니다.
### 확장 가능한 행의 '--' 제거
행에 자식이 있을 때 빈 문자열을 반환하도록 `empty-cell-text` 를 설정합니다.
### 확장 가능한 행의 텍스트 오버플로
CSS 를 통해 기본 텍스트 오버플로 스타일을 제거합니다.
```css
:deep(.panel-header-row .table-cell-wrapper) {
    overflow: initial;
}
```
