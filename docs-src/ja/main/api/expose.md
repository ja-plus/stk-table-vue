# Expose

## API
### initVirtualScroll
仮想リストの可視領域の行数と列数を初期化します。`initVirtualScrollX` と `initVirtualScrollY` の両方を呼び出すことと同等です。

テーブルの `props.autoResize` はデフォルトで `true` なので、幅または高さが変更的时候会自動でこの関数が呼び出されます。

仮想リスト的可視領域を手動で再計算する場合にもこの関数を呼び出すことができます。例如：ユーザーが手動でドラッグして幅または高さを調整した後のマウスアップイベントで呼び出します。

高さパラメータが提供されていない場合、テーブルコンテナの高さがデフォルトになります。更多くの行をレンダリングしたい場合は、コンテナ高さを取得した後にいくつかの行の高さを追加します。


```ts
/**
 * 仮想スクロールパラメータを初期化します
 * @param {number} [height] 仮想スクロールの高さ
 */
initVirtualScroll(height?: number)
```

### initVirtualScrollX
横方向仮想スクロールの列数を初期化します。

```ts
/**
 * 横方向仮想スクロールパラメータを初期化します
 */
initVirtualScrollX()
```

### initVirtualScrollY
縦方向仮想スクロールの行数を初期化します。

```ts
/**
 * 縦方向仮想スクロールパラメータを初期化します
 * @param {number} [height] 仮想スクロールの高さ
 */
initVirtualScrollY(height?: number)
```

### clearMergeCellsCache
`mergeCells` の結果キャッシュをクリアし、マージ結果の再計算を強制します。

マージ結果のキャッシュは `dataSource` / `columns` が変更されたときのみ自動的にクリアされます。行フィールドを**その場で変更**した場合（行オブジェクトの参照が変わらない場合。例：リアクティブな行オブジェクトを直接変更）、かつ `mergeCells` の戻り値がこれらのフィールドに依存する場合、変更後にこのメソッドを呼び出す必要があります。呼び出さないと、rowspan/colspan は古いキャッシュ結果を使用し続けます。

```ts
/**
 * mergeCells の結果キャッシュをクリアし、マージ結果の再計算を強制する
 */
clearMergeCellsCache()
```

```ts
// 行フィールドをその場で変更した後、マージキャッシュを手動で無効化する
row.rowspan = { continent: 3 };
nextTick(() => {
    tableRef.value.clearMergeCellsCache();
});
```

::: tip
`dataSource` を置き換える（新しい配列を渡す）方法でデータを更新する場合、キャッシュは自動的にクリアされるため、このメソッドを呼び出す必要はありません。
:::

### setCurrentRow
現在選択されている行を設定します。

```ts
/**
 * 行を選択
 * @param {string} rowKeyOrRow 選択されたrowKey、選択解除するにはundefined
 * @param {boolean} option.silent `@current-change` をトリガーしないようにtrueに設定。デフォルト: false
 * @param {boolean} option.deep 子行を递归的に選択するためにtrueに設定。デフォルト: false
 */
function setCurrentRow(rowKeyOrRow: string | undefined | DT, option = { silent: false, deep: false })
```

### setSelectedCell
現在選択されているセルを設定します（props.cellActive=trueの場合に効果的）。

```ts
/**
 * 現在選択されているセルを設定（props.cellActive=true）
 * @param row ハイライトされたセル、選択解除するにはundefined
 * @param col 列オブジェクト
 * @param option.silent `@current-change` をトリガーさないようにtrueに設定。デフォルト: false
 */
function setSelectedCell(row?: DT, col?: StkTableColumn<DT>, option = { silent: false })
```

### setHighlightDimCell

ハイライトされ、薄暗くなったセルを設定します。

```ts
/**
 * セルをハイライト。仮想スクロールハイライト状態メモリはまだサポートされていません。
 * @param rowKeyValue 行のキー
 * @param colKeyValue 列キー
 * @param options.method css- CSSレンダリングを使用、animation- animation apiを使用。デフォルト: animation;
 * @param option.className カスタムCSSアニメーションクラス。
 * @param option.keyframe カスタムキーフレームが提供されている場合、highlightConfig.fpsは無効になります。キーフレーム: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
 * @param option.duration アニメーション継続時間。'css' メソッド状態では、classを削除するために使用されます。classNameが提供されている場合はカスタムアニメーション時間と一致する必要があります。
 */
function setHighlightDimCell(rowKeyValue: UniqKey, colKeyValue: string, option: HighlightDimCellOption = {})
```

### setHighlightDimRow
ハイライトされ、薄暗くなった行を設定します。

```ts
/**
 * 行をハイライト
 * @param rowKeyValues 一意の行キーの配列
 * @param option.method css- CSSレンダリングを使用、animation- animation apiを使用。デフォルト: animation
 * @param option.className カスタムCSSアニメーションクラス。
 * @param option.keyframe カスタムキーフレームが提供されている場合、highlightConfig.fpsは無効になります。キーフレーム: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
 * @param option.duration アニメーション継続時間。'css' メソッド状態では、classを削除するために使用されます。classNameが提供されている場合はカスタムアニメーション時間と一致する必要があります。
 */
function setHighlightDimRow(rowKeyValues: UniqKey[], option: HighlightDimRowOption = {})
```

### sortCol
テーブル排序列dataIndex

### sortStates
複数列の排序状態配列。

```ts
/**
 * 排序状態配列
 * @see SortState[]
 */
sortStates: SortState[];
```

### getSortColumns
排序列情報を取得 `{key:string,order:Order}[]`

### setSorter
```ts
/**
 * テーブルヘッダーの排序状態を設定。
 * @param colKey 列の一意キーフィールド。排序状態をキャンセルしたい場合は `resetSorter` を使用してください
 * @param order 排序方向 'asc'|'desc'|null
 * @param option.sortOption 排序パラメータを指定。StkTableColumnの排序関連フィールドと同じ。列から検索することをお勧めします。
 * @param option.sort 排序をトリガーするかどうか - デフォルト: true
 * @param option.silent コールバックのトリガーを抑制するかどうか - デフォルト: true
 * @param option.force 排序のトリガーを強制するかどうか - デフォルト: true
 * @returns 現在のテーブルデータを返します
 */
function setSorter(
    colKey: string,
    order: Order,
    option: {
        sortOption?: SortOption<DT>;
        force?: boolean;
        silent?: boolean;
        sort?: boolean
    } = {}
): DT[];
```

* `option.force` が true の場合、`props.sortRemote` が true でも排序がトリガーされます。
* `option.silent` が true の場合、`@sort-change` コールバックはトリガーされません。
* `option.sortOption` の役割は、渡された `colKey` が `columns` にない場合に排序パラメータを指定できることです。列を非表示にしているがその列のフィールドで排序仍然したい場合は便利です。
    - 最高優先順位；これが設定されている場合、`colKey` を使用して対応する列を検索して排序することはしません。

### resetSorter
排序状態をリセット

### scrollTo
座標、行インデックス、行 key、または境界を指定してテーブルをスクロールします。API 形式はネイティブの `Element.scrollTo` および Naive UI Virtual List と同じです。

```ts
interface ScrollTo {
    (x: number, y: number): void
    (options: {
        left?: number
        top?: number
        behavior?: ScrollBehavior
        debounce?: boolean
    }): void
    (options: {
        index: number
        behavior?: ScrollBehavior
        debounce?: boolean
    }): void
    (options: {
        key: string | number
        behavior?: ScrollBehavior
        debounce?: boolean
    }): void
    (options: {
        position: 'top' | 'bottom'
        behavior?: ScrollBehavior
        debounce?: boolean
    }): void
}
```

- `(x, y)` の `x` は横方向の `left`、`y` は縦方向の `top` です。
- `index` は、ソート、フィルター、ツリー展開後の現在の表示順における 0 始まりの行インデックスです。
- `key` は `props.rowKey` を使用して現在表示されているデータの行を検索します。見つからない場合はスクロールしません。
- `debounce` は `index` / `key` にのみ適用され、既定値は `true` です。行が完全に表示されていれば何もせず、表示範囲外なら必要最小限だけスクロールします。`false` にすると常に行をテーブル本体の上端に揃えます。
- `behavior` はネイティブの `ScrollToOptions.behavior` と同じで、`'auto'`、`'instant'`、`'smooth'` を指定できます。
- `position` は上端または下端へ移動し、Naive UI と同様に横方向も先頭へ戻します。

```ts
// 101 行目へ移動（すでに表示されている場合は位置を維持）
tableRef.value?.scrollTo({ index: 100 })

// rowKey で検索し、行を本体上端へ滑らかに揃える
tableRef.value?.scrollTo({ key: orderId, behavior: 'smooth', debounce: false })

// 横方向を変えずに縦座標だけ変更
tableRef.value?.scrollTo({ top: 600 })

// テーブルの下端へ移動
tableRef.value?.scrollTo({ position: 'bottom' })
```

::: warning 互換性の変更
数値オーバーロードは旧 `(top, left)` からネイティブと同じ `(x, y)`、つまり `(left, top)` に変更されました。既存の `scrollTo(top, left)` は `scrollTo(left, top)` に変更するか、曖昧さのない `scrollTo({ top, left })` を使用してください。
:::

::: tip
可変行高モードでは、`index` / `key` は測定済みの行高と `setAutoHeight` で設定した値を使用します。未測定の行は `autoRowHeight.expectedHeight`、次に `rowHeight` を使用します。
:::

### getTableData
テーブルデータを取得、現在のテーブル排序順序の配列を返します

### getRowIndex
rowKeyに基づいて行インデックスを取得

```ts
/**
 * 行インデックスを取得
 * @param row rowKey または row データ
 * @returns 行インデックス、見つからない場合は -1
 */
function getRowIndex(row: UniqKey | DT): number
```

### getColumnIndex
colKeyに基づいて列インデックスを取得

```ts
/**
 * 列インデックスを取得
 * @param col colKey または列オブジェクト
 * @returns 列インデックス、見つからない場合は -1
 */
function getColumnIndex(col: string | StkTableColumn<DT>): number
```

### setRowExpand
展開行を設定

```ts
/**
 *
 * @param rowKeyOrRow rowKeyまたはrow
 * @param expand 展開するかどうか
 * @param data { col?: StkTableColumn<DT> }
 * @param data.silent `@toggle-row-expand` をトリガーしないようにtrueに設定。デフォルト: false
 */
function setRowExpand(rowKeyOrRow: string | undefined | DT, expand?: boolean, data?: { col?: StkTableColumn<DT>; silent?: boolean })
```

### setAutoHeight
可変行高仮想リストで、指定された行のauto-row-heightに保存された高さを設定します。行高が変更された場合、このメソッドを呼び出して行の高さをクリアまたは変更できます
```ts
function setAutoHeight(rowKey: UniqKey, height?: number | null)
```

### clearAllAutoHeight
auto-row-heightに保存されたすべての高さをクリア

### setTreeExpand
ツリー構造展開行を設定
```ts
/**
 * @param row rowKey / row / またはその配列
 * @param option.expand 展開するかどうか、未指定の場合は現在の状態に基づいて切り替え
 * @param option.all 全ての子ノードを展開するかどうか、デフォルト false
 * @param option.level n 番目のレベルまで展開
 * @param option.parents 渡された row を対象の子ノードとみなし、そのすべての親ノードを展開/折りたたみする。展開時に対象行自身が子ノードを持つ場合は合わせて展開される。単一の rowKey / row のみサポート
 */
function setTreeExpand(row: (UniqKey | DT) | (UniqKey | DT)[], option?: { expand?: boolean; all?: boolean; level?: number; parents?: boolean })
```
::: tip
`option.parents` が `true` の場合、深い階層の子ノードの rowKey を渡すだけで、そのすべての親ノードが自動的に展開され、対象行が表示されます。対象行自身が子ノードを持つ場合は合わせて展開されます（行への位置移動など）。フィルタによってある親ノードが除外されている場合、展開はそこで中断されます。
:::

- `option.all` <Badge type="tip" text="^1.0.4" />
- `option.level` <Badge type="tip" text="^1.0.4" />
- `option.parents` <Badge type="tip" text="^1.1.0" />

### getSelectedArea
選択されたセル情報を取得

```ts
function getSelectedArea(): {
    rows: DT[];
    cols: StkTableColumn<DT>[];
    ranges: AreaSelectionRange[]
}
```

### setAreaSelection
ドラッグ選択範囲を設定

```ts
/**
 * ドラッグ選択範囲を設定
 * @param ranges 選択範囲配列
 * @param option.silent trueに設定すると `@select-area-change` をトリガーしません。デフォルト: false
 * @param option.scrollToView trueに設定すると選択範囲まで自動スクロールします。デフォルト: false
 */
function setAreaSelection(ranges: AreaSelectionRange[], option?: { silent?: boolean; scrollToView?: boolean })
```

### clearSelectedArea
選択されたセルをクリア

### copySelectedArea
選択されたエリアコンテンツをクリップボードにコピー。コピーされたテキストコンテンツ（TSV形式）を返します。

```ts
function copySelectedArea(): string
```

### setFilter(Beta)
フィルター状態を設定(Beta)。設定後に `filter-change` イベントをトリガーします。

```ts
/**
 * フィルター状態を設定
 * @param status フィルター状態オブジェクト、null を渡すとすべてのフィルターをクリア
 * @param option.remote true に設定すると自動データフィルタリングをスキップ、リモートフィルタリングに適しています
 * @param option.silent true に設定すると `filter-change` イベントをトリガーしません、デフォルト false
 */
function setFilter(status: Record<UniqKey, FilterStatus> | null, option?: { remote?: boolean; silent?: boolean })
```
