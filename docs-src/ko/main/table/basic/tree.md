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
