# マルチレベルヘッダー
## 設定
`StkTableColumn['children']` でマルチレベルヘッダーを設定します
::: warning
マルチヘッダーテーブルはまだ **横方向仮想リスト**（`props.virtualX`）をサポートしていません。
:::

```ts 
const columns: StkTableColumn<any>[] = [
    {
        dataIndex: '基本',
        title: '基本',
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


## 列固定
### 最も一般的な列固定
::: tip
マルチヘッダーテーブルでの固定列の値は現在のヘッダーノードにのみ影響します。親ヘッダーを固定したい場合は、fixedも設定する必要があります。
:::

```ts 
const columns: StkTableColumn<any>[] = [
    {
        dataIndex: '基本',
        title: '基本',
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
### リーフノード固定のみ設定
<demo vue="basic/multi-header/MultiHeaderLeavesFixed.vue"></demo>
### 任意の固定を設定
<demo vue="basic/multi-header/MultiHeaderAnyFixed.vue"></demo>

楽しめましたか？これもsticky機能のおかげです。
