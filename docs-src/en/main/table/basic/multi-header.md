# Multi-Level Headers
## Configuration
`StkTableColumn['children']` configures multi-level headers
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

## Horizontal Virtual List<Badge type="tip" text="^1.0.0" />
With the help of AI, multi-level headers finally support horizontal virtual list!

Configure `props.virtualX` to enable it.
<demo vue="basic/multi-header/MultiHeaderVirtualX.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/multi-header/MultiHeaderVirtualX.vue"></demo>

::: tip
If a parent header has many child nodes, try splitting the headers for better virtual scrolling performance.
:::


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
<demo vue="basic/multi-header/MultiHeaderFixed.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/multi-header/MultiHeaderFixed.vue"></demo>
### Only Configure Leaf Node Fixing

<demo vue="basic/multi-header/MultiHeaderLeavesFixed.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/multi-header/MultiHeaderLeavesFixed.vue"></demo>
::: warning Horizontal virtual list (`props.virtualX`) does not support this mode yet.
:::

### Configure Arbitrary Fixing
<demo vue="basic/multi-header/MultiHeaderAnyFixed.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/multi-header/MultiHeaderAnyFixed.vue"></demo>
::: warning Horizontal virtual list (`props.virtualX`) does not support this mode yet.
:::

Isn't that interesting? This is also thanks to the sticky feature.








