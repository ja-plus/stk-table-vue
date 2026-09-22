# 트리형  <Badge type="tip" text="^0.7.0" />

다음 두 단계로 트리형 기능을开启합니다

1. `StkTableColumn['type']`를 `tree-node`로 설정하여 트리형 전개 버튼의 위치를 지정합니다
```ts
const columns: StkTableColumn<any>[] = [
    { type: 'tree-node', title: 'Area', dataIndex: 'area' },
]
```

2. 데이터 소스에 `children` 필드를 추가합니다. 클릭 후 데이터의 `children` 필드의 내용을 하위 노드로 표시합니다.
```ts
export const getDataSource = () => [ 
    {
        area: 'Asia',
        gdp: 10000,
        population: 50000000,
        gdpPerCapita: 20000,
        children: [
            { area: 'China', gdp: 5000, population: 1400000000, gdpPerCapita: 35000, }, 
            { area: 'Japan', gdp: 4000, population: 126000000, gdpPerCapita: 33000, }
        ],
    },
];
```

## 간단한 트리형


<demo vue="basic/tree/Tree.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/Tree.vue"></demo>

## 기본값 전개 노드

::: warning 
`props.treeConfig`를 통해 설정된 전개는 테이블이 처음 렌더링될 때만 적용됩니다.

비동기 데이터의 경우 [expose.setTreeExpand()](/ko/main/api/expose.html#settreeexpand) 함수를 사용하여 제어하세요.
:::

### 모두 전개
`treeConfig.defaultExpandAll = true`

<demo vue="basic/tree/TreeDefaultExpandAll.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeDefaultExpandAll.vue"></demo>

### 지정 레벨 전개
`treeConfig.defaultExpandLevel = 1`

<demo vue="basic/tree/TreeDefaultExpandLevel.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeDefaultExpandLevel.vue"></demo>

### 지정 노드 전개
`treeConfig.defaultExpandedKeys = ['Asia', 'China', 'Zhejiang']`

아래 `Toggle China` 버튼은 [setTreeExpand()](/ko/main/api/expose.html#settreeexpand)를 사용하여 `China` 행의 전개/축소를 제어합니다.

<demo vue="basic/tree/TreeDefaultExpandKeys.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeDefaultExpandKeys.vue"></demo>

### 수동으로 노드 전개

[setTreeExpand](/ko/main/api/expose.html#settreeexpand) 메서드를 사용하여 노드의 전개/축소를 수동으로 제어합니다.

아래 예시에서는 다양한 매개변수 사용법을 보여줍니다:
- `Toggle All`: 모든 루트 노드의 전개/축소 상태를 전환합니다 (`dataSource` 배열 전체를 전달, `{ all: true }`)
- `Collapse All`: 모든 루트 노드를 축소합니다 (`dataSource` 배열 전체를 전달, `{ all: true, expand: false }`)
- `Toggle Asia`: Asia 노드의 전개/축소 상태를 전환합니다
- `Expand All Asia`: Asia의 모든 하위 노드를 전개합니다 (`{ expand: true, all: true }`)
- `Collapse All Asia`: Asia의 모든 하위 노드를 축소합니다 (`{ expand: false, all: true }`)
- `Expand Asia to Level 2`: Asia를 2번째 레벨까지 전개합니다 (`{ expand: true, level: 2 }`)
- `Collapse Asia to Level 1`: Asia를 1번째 레벨까지 축소합니다 (`{ expand: false, level: 1 }`)
- `Expand Parents of Zhejiang`: Zhejiang의 모든 부모 노드(Asia → China)를 자동으로 확장합니다. Zhejiang 자체는 자식 노드 Hangzhou를 가지므로 함께 확장됩니다 (`{ parents: true }`)
- `Collapse Parents of Zhejiang`: Zhejiang의 모든 부모 노드를 축소합니다 (`{ parents: true, expand: false }`)

<demo vue="basic/tree/TreeSetExpand.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeSetExpand.vue"></demo>

## 자식 노드 지연 로딩  <Badge type="tip" text="^1.2.7" />

노드의 자식을 온디맨드로 가져와야 하는 경우(조직 트리, 디렉터리 트리, 수만 노드) `treeConfig.lazy`를 활성화하면, “자식이 있다고 표시되었으나 아직 로딩되지 않은” 행을 펼칠 때 `treeConfig.loadMethod(row, col)`를 호출합니다. 로딩 상태는 컴포넌트가 전면 관리하며, 사용자는 데이터 조회 함수만 제공하면 됩니다.

```ts
const treeConfig = {
    lazy: true,
    // 자식 행 배열을 resolve하는 Promise를 반환
    loadMethod: (row, col) => fetchChildren(row.id),
    // 선택: “자식 있음” 판별 필드명, 기본값 'hasChildren'
    hasChildField: 'hasChildren',
    // 선택: 로딩 실패 콜백
    onLoadError: (error, row, col) => console.error(error),
};
```

규칙:

1. 최상위층 데이터는 계속 `props.dataSource`가 제공하며, 하위층은 `loadMethod`가 드릴다운 시 로딩합니다.
2. 펼침 가능 판정: 행의 `children`이 존재하거나 `row.hasChildren`이 참이면 펼침 화살표 표시, 둘 다 없으면 리프 노드.
3. 로딩 중에는 화살표 자리에 로딩 아이콘이 표시되고 **행 전체(`<tr>`)에** `is-tree-loading` 클래스가 붙습니다 (스타일 overriding 가능).
4. 로딩 성공 노드는 캐시되어 접었다 다시 펼쳐도 재요청하지 않습니다. 갱신은 [reloadTreeNode()](/ko/main/api/expose.html#reloadtreeenode)를 호출하세요.
5. reject 시 해당 행은 접힌 상태로 유지되고 “로딩 완료”로 표시되지 않아 다음 펼침 시 재시도되며, `onLoadError`가 호출됩니다.
6. `lazy` 상태에서는 `defaultExpandAll` / `defaultExpandLevel`과 `setTreeExpand(..., { all: true } / { level })`가 미로딩 분기에서 펼침을 중지합니다 (암시적 연쇄 요청 없음); `setTreeExpand(row, { parents: true })`는 미로딩 조상을 필요에 따라 연쇄 로딩합니다 (이 분기는 Promise를 반환).

<demo vue="basic/tree/TreeLazyLoad.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeLazyLoad.vue"></demo>


## 들여쓰기 가이드 라인  <Badge type="tip" text="^1.2.7" />

`treeConfig.showGuide`(기본 `false`)를 활성화하면 `tree-node` 열이 각 행의 들여쓰기 영역에 단계별로 세로 가이드 라인을 그려 자식 행이 어떤 단계에 속하는지 직관적으로 파악할 수 있습니다. 비활성화 시 기존 들여쓰기만 유지되며 가이드 라인은 그려지지 않습니다.

```ts
const treeConfig = {
    // 단계별 세로 가이드 라인 표시
    showGuide: true,
};
```

::: tip 참고
- 가이드 라인은 “단계당 하나의 세로 선” 스타일이며, 정밀한 last-child 차단 / T자형 트리 커넥터가 **아닙니다**.
- CSS 변수로 외형을 조정할 수 있습니다: `--tree-guide-color`(색상), `--tree-guide-width`(선 두께, 기본 `1px`). 다크 테마는 각각의 기본값을 합니다.
:::

<demo vue="basic/tree/TreeGuide.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeGuide.vue"></demo>

## 가상 리스트

<demo vue="basic/tree/TreeVirtualList.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeVirtualList.vue"></demo>

::: warning 주의
컴포넌트는 dataSource의 모든 행에 `__T_EXP__` 필드를注入하여 전개 여부를 제어합니다. 행 데이터를 업데이트할 때 이 필드를 수정하지 마세요. 따라서 샘플에서 `Object.assign`을 사용하여 데이터를 업데이트합니다.
:::

::: warning 성능 알림
가상 리스트를 사용하더라도 `props.dataSource`의 모든 변경은 컴포넌트 내부에서 `dataSource`를遍歴하여 데이터를展平합니다. 따라서 자주 변경되는 데이터는 더 많은 컴퓨터 계산 자원을 사용합니다.
성능에 일정 요구가 있으면 [예시-대량 데이터](/ko/demos/huge-data)를 참고하여 트리형 전개 로직을 직접实现하세요.
:::

## 정렬
기본적으로 테이블 헤더를 클릭하여 정렬하면 현재 레벨의 데이터가 정렬됩니다. 하위 노드도 정렬해야 하면 `sortConfig.sortChildren = true`를 설정하세요. `v0.8.8`

세부 사항은 [정렬](/ko/main/table/basic/sort)을 참고하세요.
