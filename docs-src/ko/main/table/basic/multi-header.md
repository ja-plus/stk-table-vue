# 멀티 레벨 헤더
## 설정
`StkTableColumn['children']`으로 멀티 레벨 헤더 설정
::: warning
멀티 레벨 헤더는 현재 **가로 방향 가상 리스트**(`props.virtualX`)를 지원하지 않습니다.
:::

```ts 
const columns: StkTableColumn<any>[] = [
    {
        dataIndex: 'Basic',
        title: 'Basic',
        children: [ // [!code highlight]
            { dataIndex: 'id',title: 'ID', width: 100,},
            {
                dataIndex: 'lv2',
                title: 'Lv 2',
                width: 100,
                children: [ // [!code highlight]
                    { dataIndex: 'lv2_1', title: 'Lv 2.1', width: 100,}, 
                    { dataIndex: 'lv2_2', title: 'Lv 2.2', width: 100,},
                ],
            },
        ],
    },
]
```



<demo vue="basic/multi-header/MultiHeader.vue"></demo>


## 열 고정
### 가장 일반적인 열 고정
::: tip
멀티 레벨 헤더 고정 열 값은 현재 테이블 헤더 노드에만 영향을 줍니다. 부모 테이블 헤더를 고정하려면 fixed도 설정해야 합니다.
:::

```ts 
const columns: StkTableColumn<any>[] = [
    {
        dataIndex: 'Basic',
        title: 'Basic',
        fixed: 'left', // [!code ++]
        children: [
            { 
                dataIndex: 'id',
                title: 'ID',
                width: 100,
                fixed: 'left'  // [!code ++]
             },
            {
                dataIndex: 'lv2',
                title: 'Lv 2',
                width: 100,
                fixed: 'left', // [!code ++]
                children: [
                    { 
                        dataIndex: 'lv2_1',
                        title: 'Lv 2.1', 
                        width: 100, 
                        fixed: 'left'// [!code ++]
                    }, 
                    { 
                        dataIndex: 'lv2_2',
                        title: 'Lv 2.2', 
                        width: 100, 
                        fixed: 'left' // [!code ++]
                    }, 
                ],
            },
        ],
    },
]
```
<demo vue="basic/multi-header/MultiHeaderFixed.vue"></demo>

### 리프 노드만 고정 설정
<demo vue="basic/multi-header/MultiHeaderLeavesFixed.vue"></demo>

### 임의 고정 설정
<demo vue="basic/multi-header/MultiHeaderAnyFixed.vue"></demo>

매우 흥미롭지 않나요? 이것도 sticky의 특성에 기인합니다.
