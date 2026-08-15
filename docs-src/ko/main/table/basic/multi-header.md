# 멀티 레벨 헤더
## 설정
`StkTableColumn['children']`으로 멀티 레벨 헤더 설정
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



<demo vue="basic/multi-header/MultiHeader.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/multi-header/MultiHeader.vue"></demo>

## 가로 방향 가상 리스트<Badge type="tip" text="^1.0.0" />
AI의 도움으로 멀티 레벨 헤더가 마침내 가로 방향 가상 리스트를 지원하게 되었습니다!

`props.virtualX`를 설정하면 됩니다.
<demo vue="basic/multi-header/MultiHeaderVirtualX.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/multi-header/MultiHeaderVirtualX.vue"></demo>

::: tip
부모 헤더 노드에 자식 노드가 많은 경우, 가상 스크롤 성능 향상을 위해 헤더를 분할해 보세요.
:::


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
<demo vue="basic/multi-header/MultiHeaderFixed.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/multi-header/MultiHeaderFixed.vue"></demo>

### 리프 노드만 고정 설정

<demo vue="basic/multi-header/MultiHeaderLeavesFixed.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/multi-header/MultiHeaderLeavesFixed.vue"></demo>
::: warning 가로 방향 가상 리스트(`props.virtualX`)는 이 모드를 아직 지원하지 않습니다.
:::

### 임의 고정 설정
<demo vue="basic/multi-header/MultiHeaderAnyFixed.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/multi-header/MultiHeaderAnyFixed.vue"></demo>
::: warning 가로 방향 가상 리스트(`props.virtualX`)는 이 모드를 아직 지원하지 않습니다.
:::

매우 흥미롭지 않나요? 이것도 sticky의 특성에 기인합니다.
