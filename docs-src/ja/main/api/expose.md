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
指定位置までスクロール。数値オーバーロード（後方互換）と options オーバーロード（行/列の指定に対応）の 2 種類の呼び出し形式をサポート。

```ts
/**
 * スクロールバー位置を設定
 * - 数値オーバーロード：top/left はピクセル座標、null は該当軸を変更しない、省略時は 0
 * - options オーバーロード：各軸にピクセル数値または { index, key, px } ターゲットを指定可能、省略した軸は位置を変更しない
 */
function scrollTo(top?: number | null, left?: number | null): void;
function scrollTo(options: ScrollToOptions): void;

interface ScrollToOptions {
    /** 縦方向ターゲット：ピクセル座標または行ターゲット */
    top?: number | ScrollAxisTarget;
    /** 横方向ターゲット：ピクセル座標または列ターゲット */
    left?: number | ScrollAxisTarget;
    /** スクロール挙動、ネイティブの ScrollToOptions.behavior と同じ、デフォルト 'auto'（即時ジャンプ） */
    behavior?: ScrollBehavior;
}

interface ScrollAxisTarget {
    /** ターゲットインデックス（0 始まり）、key と同時指定時は index を優先 */
    index?: number;
    /** ターゲットキー：top 軸は rowKey に対応する行キー、left 軸は列の dataIndex */
    key?: string | number;
    /** 基準オフセットに加算するピクセルオフセット、負値可。px のみの場合の基準は 0 */
    px?: number;
}
```

* インデックス空間：`top` 軸の `index` は現在の表示順序（ソート/フィルター/ツリー展開後）の行インデックス、`left` 軸の `index` はリーフ列（最深ヘッダー階層）のインデックス。
* ターゲットを解決できない場合（index が範囲外 / key が存在しない）、該当軸は黙ってスキップされ位置は変わらない。
* `behavior: 'smooth'` 指定時はアニメーションでスクロール。アニメーション中の新しい `scrollTo` 呼び出しは古いアニメーションをキャンセルする。ホイール/タッチ操作でもキャンセルされる。

::: tip
2 つのオーバーロードで「省略」の意味が異なる：
* options オーバーロード：省略した軸は現在位置を**維持**、`scrollTo({})` は何もスクロールしない；
* 数値オーバーロード：省略した引数は **0** がデフォルト、`scrollTo()` は左上隅へスクロールする。
:::

```js
// 数値オーバーロード（後方互換）
stkTableRef.value.scrollTo(100, 200);
stkTableRef.value.scrollTo(null, 200); // 横方向のみ変更

// options オーバーロード：ピクセル座標
stkTableRef.value.scrollTo({ top: 100, left: 200 });

// 5 行目へスクロール（0 始まり）
stkTableRef.value.scrollTo({ top: { index: 5 } });

// rowKey が 'row-42' の行へスクロール
stkTableRef.value.scrollTo({ top: { key: 'row-42' } });

// 5 行目 + 10px オフセットへスクロール
stkTableRef.value.scrollTo({ top: { index: 5, px: 10 } });

// 行列を同時に指定しスムーズスクロール（列は dataIndex で指定）
stkTableRef.value.scrollTo({ top: { index: 5 }, left: { key: 'name' }, behavior: 'smooth' });
```

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

::: tip タイミング意味
即時に反映されます：設定した行高はただちにスクロール位置の特定とコンテンツ全体の高さ（scrollHeight）の計算に参加し、次のレンダリングでの実測を待つ必要はありません。行キーが現在のデータに存在しない場合、高さのみ保存され、現在の位置特定と全体の高さには影響しません。
:::

### clearAllAutoHeight
auto-row-heightに保存されたすべての高さをクリア。クリア後、行高は推定値（`expectedHeight` / `rowHeight`）に戻り、コンテンツ全体の高さもそれに応じて再計算されます。

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

