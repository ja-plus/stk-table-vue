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
 * @param option.silent `@current-change` をトリガーしないようにtrueに設定。デフォルト: false
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
指定位置までスクロール

```ts
/**
 * スクロールバー位置を設定
 * @param top nullに設定して位置を変更しない
 * @param left nullに設定して位置を変更しない
 */
function scrollTo(top: number | null = 0, left: number | null = 0) 
```

### getTableData
テーブルデータを取得、現在のテーブル排序順序の配列を返します

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
 * @param row rowKeyまたはrowまたはrow
 * @param option.expand 提供されていない場合、現在の状态に基づいて切り替えられます
 */
function setTreeExpand(row: (UniqKey | DT) | (UniqKey | DT)[], option?: { expand?: boolean })
```

### getSelectedArea 
選択されたセル情報を取得

```ts
function getSelectedArea(): {
    rows: DT[];
    cols: StkTableColumn<DT>[];
    range: AreaSelectionRange
}
```

### clearSelectedArea
選択されたセルをクリア

### copySelectedArea
選択されたエリアコンテンツをクリップボードにコピー。コピーされたテキストコンテンツ（TSV形式）を返します。

```ts
function copySelectedArea(): string
```

### getSelectedRows
行ドラッグ選択された行情報を取得します

```ts
function getSelectedRows(): {
    rows: DT[];
    range: RowDragSelectionRange | null;
}
```

### clearSelectedRows
行ドラッグ選択された行をクリアします
