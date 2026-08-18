# 多级表头
## 配置
`StkTableColumn['children']` 配置多级表头
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

## 横向虚拟列表<Badge type="tip" text="^1.0.0" />
经过AI的辅助，多级表头终于支持横向虚拟列表啦！

配置 `props.virtualX` 即可。
<demo vue="basic/multi-header/MultiHeaderVirtualX.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/multi-header/MultiHeaderVirtualX.vue"></demo>

::: tip
如果一个父节点表头有很多子节点，请尝试将表头拆分，利于虚拟滚动。
:::


## 列固定
### 最常见的列固定
::: tip
多级表头固定列值只影响当前表头节点。如果您想固定父级表头，也要配置fixed。
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
### 仅配置叶子节点固定

<demo vue="basic/multi-header/MultiHeaderLeavesFixed.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/multi-header/MultiHeaderLeavesFixed.vue"></demo>
::: warning 横向虚拟列表(`props.virtualX`)暂不支持此模式。
:::

### 配置任意固定
<demo vue="basic/multi-header/MultiHeaderAnyFixed.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/multi-header/MultiHeaderAnyFixed.vue"></demo>
::: warning 横向虚拟列表(`props.virtualX`)暂不支持此模式。
:::

很有趣不是吗？这也归功于sticky的特性。








