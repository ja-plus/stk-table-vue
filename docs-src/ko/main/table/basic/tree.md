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


<demo vue="basic/tree/Tree.vue"></demo>

## 기본값 전개 노드

### 모두 전개
`treeConfig.defaultExpandAll = true`

<demo vue="basic/tree/TreeDefaultExpandAll.vue"></demo>

### 지정 레벨 전개
`treeConfig.defaultExpandLevel = 1`

<demo vue="basic/tree/TreeDefaultExpandLevel.vue"></demo>

### 지정 노드 전개
`treeConfig.defaultExpandedKeys = ['Asia', 'China', 'Zhejiang']`

<demo vue="basic/tree/TreeDefaultExpandKeys.vue"></demo>


## 가상 리스트

<demo vue="basic/tree/TreeVirtualList.vue"></demo>

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
