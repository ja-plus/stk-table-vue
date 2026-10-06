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

<demo vue="basic/tree/Tree.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/Tree.vue"></demo>

## デフォルト展開ノード

::: warning 
`props.treeConfig` で設定された展開は、テーブルが最初にレンダリングされるときのみ有効です。

非同期データの場合は、[expose.setTreeExpand()](/ja/main/api/expose.html#settreeexpand) 関数を使用して制御してください。
:::

### すべて展開
`treeConfig.defaultExpandAll = true`

<demo vue="basic/tree/TreeDefaultExpandAll.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeDefaultExpandAll.vue"></demo>

### 特定レベルまで展開
`treeConfig.defaultExpandLevel = 1`

<demo vue="basic/tree/TreeDefaultExpandLevel.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeDefaultExpandLevel.vue"></demo>

### 特定ノードを展開
`treeConfig.defaultExpandedKeys = ['アジア', '中国', '浙江']`

下の `Toggle China` ボタンは、[setTreeExpand()](/ja/main/api/expose.html#settreeexpand) を使用して `China` 行の展開/折りたたみを制御します。

<demo vue="basic/tree/TreeDefaultExpandKeys.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeDefaultExpandKeys.vue"></demo>

### 手動でノードを展開

[setTreeExpand](/ja/main/api/expose.html#settreeexpand) メソッドを使用して、ノードの展開/折りたたみを手動で制御します。

以下の例は、さまざまなパラメータの使用方法を示しています：
- `Toggle All`：すべてのルートノードの展開/折りたたみ状態を切り替えます（`dataSource` 配列全体を渡す、`{ all: true }`）
- `Collapse All`：すべてのルートノードを折りたたみます（`dataSource` 配列全体を渡す、`{ all: true, expand: false }`）
- `Toggle Asia`：Asia ノードの展開/折りたたみ状態を切り替えます
- `Expand All Asia`：Asia のすべての子孫ノードを展開します（`{ expand: true, all: true }`）
- `Collapse All Asia`：Asia のすべての子孫ノードを折りたたみます（`{ expand: false, all: true }`）
- `Expand Asia to Level 2`：Asia をレベル 2 まで展開します（`{ expand: true, level: 2 }`）
- `Collapse Asia to Level 1`：Asia をレベル 1 まで折りたたみます（`{ expand: false, level: 1 }`）
- `Expand Parents of Zhejiang`：Zhejiang のすべての親ノード（Asia → China）を自動的に展開します。Zhejiang 自身は子ノード Hangzhou を持つため、合わせて展開されます（`{ parents: true }`）
- `Collapse Parents of Zhejiang`：Zhejiang のすべての親ノードを折りたたみます（`{ parents: true, expand: false }`）

<demo vue="basic/tree/TreeSetExpand.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeSetExpand.vue"></demo>

## 子ノードの遅延読み込み  <Badge type="tip" text="^1.2.7" />

ノードの子要素をオンデマンドで取得する必要がある場合（組織ツリー、ディレクトリツリー、数万ノード）は `treeConfig.lazy` を有効にします。「子ノードありマーク済み但未読み込み」の行を展開すると `treeConfig.loadMethod(row, col)` が呼ばれ、ローディング状態はすべてコンポーネントが管理します。利用者はデータ取得関数のみ提供すればよいです。

```ts
const treeConfig = {
    lazy: true,
    // 子行配列を resolve する Promise を返す
    loadMethod: (row, col) => fetchChildren(row.id),
    // 任意：「子ノードあり」を判定するフィールド名、既定は 'hasChildren'
    hasChildField: 'hasChildren',
    // 任意：読み込み失敗時のコールバック
    onLoadError: (error, row, col) => console.error(error),
};
```

ルール：

1. ルート層のデータは引き続き `props.dataSource` が提供し、子層は `loadMethod` がドリルダウン時に読み込みます。
2. 展開可能判定：行の `children` が存在する **または** `row.hasChildren` が真なら展開矢印を表示、どちらも無ければリーフノード。
3. 読み込み中は矢印の位置にローディングアイコンが表示され、**行全体（`<tr>`）**に `is-tree-loading` クラスが付与されます（スタイル上書き可能）。
4. 読み込み成功ノードはキャッシュされ、折りたたみ→再展開でも再リクエストしません。更新は [reloadTreeNode()](/ja/main/api/expose.html#reloadtreeenode) を呼んで強制再読み込みします。
5. reject 時はその行は折りたたみのまま「読み込み済み」にされず（次回展開で再試行）、`onLoadError` が発火します。
6. `lazy` 時、`defaultExpandAll` / `defaultExpandLevel` と `setTreeExpand(..., { all: true } / { level })` は未読み込み分岐で展開を停止します（暗黙的な連鎖リクエストなし）；`setTreeExpand(row, { parents: true })` は未読み込みの祖先をオンデマンドで連鎖読み込みします（この分岐は Promise を返す）。

<demo vue="basic/tree/TreeLazyLoad.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeLazyLoad.vue"></demo>


## インデントガイドライン  <Badge type="tip" text="^1.2.7" />

`treeConfig.showGuide`（デフォルト `false`）を有効にすると、`tree-node` 列が行のインデント領域に階層ごとに縦のガイドラインを描画し、子行がどの階層に属するかを直感的に判別できます。祖先のスロット（0..level-1）のみを描画し、行自身のコントロールマスには線を引きません。無効時は従来のインデントのみでガイドラインは描画されません。

```ts
const treeConfig = {
    // 階層ごとに縦のガイドラインを表示
    showGuide: true,
};
```

::: tip 説明
- ガイドラインは「各階層 1 本の縦線」スタイルで、精密な last-child 切断 / T 字型のツリーコネクタでは**ありません**。
- CSS 変数で見た目を変更可能：`--tree-guide-color`（色）、`--tree-guide-width`（線幅、デフォルト `1px`）、`--tree-guide-mask`（破線マスク、デフォルト `none` は実線。縦の repeating グラデーションで交差させて破線に、例：`repeating-linear-gradient(to bottom, #000 0 4px, transparent 4px 8px)`）。ダークテーマは個別のデフォルト値を持ちます。
- より広い矢印／アイコンに差し替える場合は `--tree-indent-width`（既定 `16px`）を上書きすれば、インデントマス・コントロール枠・ガイド線のピッチが連動します。`tree-node` 列に `customCell` を当ててセル全体を自作する描画（フォルダ開閉アイコンの例付き）は[ファイル管理ツリー](/ja/demos/file-tree)を参照してください。
:::

<demo vue="basic/tree/TreeGuide.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeGuide.vue"></demo>

### customCell でツリーセルをカスタム（展開アイコンを差し替え）  <Badge type="tip" text="^1.2.7" />

`tree-node` 列にも `customCell` を指定できます。セル全体をあなたが描画し、組み込みの「レベル別のインデント + ガイド線」と「矢印 / 遅延ローディング」はそれぞれ `stkTreeIndent`・`stkFoldIcon` スロットとして渡されます（これらは**あなたのセルコンポーネント**のスロットであり、StkTable のトップレベルスロットではありません）。

実行可能な例（フォルダ開 / 閉アイコンを自作する場合と、組み込み矢印を残してラベルだけ変える場合）、配置の契約とコード骨格は [ファイル管理ツリー](/ja/demos/file-tree) を参照してください。

## 仮想リスト

<demo vue="basic/tree/TreeVirtualList.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/basic/tree/TreeVirtualList.vue"></demo>

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
