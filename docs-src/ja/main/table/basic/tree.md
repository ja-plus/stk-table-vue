# ツリー  <Badge type="tip" text="^0.7.0" />

2ステップでツリー機能を有効にします

1. `StkTableColumn['type']` を `tree-node` に設定して、ツリー展開ボタンの位置を指定します
```ts
const columns: StkTableColumn<any>[] = [
    { type: 'tree-node', title: '地域', dataIndex: 'area' },
]
```

2. データソースに `children` フィールドを追加します。クリック後、データ内の `children` フィールドのコンテンツが子ノードとして表示されます。
```ts
export const getDataSource = () => [ 
    {
        area: 'アジア',
        gdp: 10000,
        population: 50000000,
        gdpPerCapita: 20000,
        children: [
            { area: '中国', gdp: 5000, population: 1400000000, gdpPerCapita: 35000, }, 
            { area: '日本', gdp: 4000, population: 126000000, gdpPerCapita: 33000, }
        ],
    },
];
```

## シンプルツリー

<demo vue="basic/tree/Tree.vue"></demo>

## デフォルト展開ノード

### すべて展開
`treeConfig.defaultExpandAll = true`

<demo vue="basic/tree/TreeDefaultExpandAll.vue"></demo>

### 特定レベルまで展開
`treeConfig.defaultExpandLevel = 1`

<demo vue="basic/tree/TreeDefaultExpandLevel.vue"></demo>

### 特定ノードを展開
`treeConfig.defaultExpandedKeys = ['アジア', '中国', '浙江']`

<demo vue="basic/tree/TreeDefaultExpandKeys.vue"></demo>


## 仮想リスト

<demo vue="basic/tree/TreeVirtualList.vue"></demo>

::: warning 注意
コンポーネントは各行のdataSourceに `__T_EXP__` フィールドを注入して、展開されているかどうかを制御します。行のデータを更新するときにこのフィールドを変更しないでください。因此、例ではObject.assignを使用してデータを更新しています。
:::

::: warning パフォーマンス注意
仮想リストがあっても、`props.dataSource` の変更ごとにコンポーネントが内部でdataSourceを走査してデータをフラット化します。因此、频繁に変わるデータについては、より多くのコンピュータ計算リソースを占有します。
特定のパフォーマンス要件がある場合は、[例 - 大量データ](/ja/demos/huge-data) を参照してツリー展開ロジックを自分で実装できます。
:::

## 排序
デフォルトでは、テーブルヘッダーをクリックして排序”时、現在のレベルのデータのみが排序されます。子ノードも排序する必要がある場合は、`sortConfig.sortChildren = true` を設定する必要があります。 `v0.8.8`

詳細については、[排序](/ja/main/table/basic/sort) を参照してください。
