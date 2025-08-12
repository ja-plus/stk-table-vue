# Multi-Level Headers
## Configuration
`StkTableColumn['children']` configures multi-level headers
::: warning
Multi-header tables do not support **horizontal virtual lists** (`props.virtualX`) yet.
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


## Column Fixing
### Most Common Column Fixing
::: tip
The fixed column value in multi-header tables only affects the current header node. If you want to fix parent headers, you also need to configure fixed.
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
### Only Configure Leaf Node Fixing
<demo vue="basic/multi-header/MultiHeaderLeavesFixed.vue"></demo>
### Configure Arbitrary Fixing
<demo vue="basic/multi-header/MultiHeaderAnyFixed.vue"></demo>

Isn't that interesting? This is also thanks to the sticky feature.








