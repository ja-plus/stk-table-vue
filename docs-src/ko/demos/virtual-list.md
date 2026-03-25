# 가상 단일 리스트

이는 본질적으로 **단일 열**만 있는 테이블이며, 다음 단계를 통해 구현됩니다:
* `props.bordered=false` 로 테이블 테두리를 제거합니다.
* `props.headless=true` 로 테이블 헤더를 제거합니다.
* `props.rowActive=false` 로 행 클릭 하이라이트를 제거합니다.
* `props.rowHover=false` 로 행 hover 스타일을 제거합니다.
* `props.rowHeight` 로 행 높이를 설정합니다.
* `StkTableColumn['customCell']` 로 셀 콘텐츠를 커스터마이즈합니다.


## 코드 예시
```ts
<StkTable
    row-key="id"
    style="height: 400px"
    virtual // [!code ++]
    headless // [!code ++]
    :row-height="200" // [!code ++]
    :bordered="false" // [!code ++]
    :row-active="false" // [!code ++]
    :row-hover="false" // [!code ++]
    :columns="columns"
    :data-source="data"
></StkTable>
```

## 예시

### 고정 높이
<demo vue="demos/VirtualList/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/VirtualList"></demo>

### 가변 높이
`props.autoRowHeight` 를 설정하여 자동 행 높이를 활성화합니다.

`props.autoRowHeight.expectedHeight` 를 통해 기대 높이를 설정합니다. 기본적으로 `props.rowHeight` 가 기대 높이로 사용됩니다.

<demo vue="demos/VirtualList/AutoHeightVirtualList/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/VirtualList/AutoHeightVirtualList"></demo>
