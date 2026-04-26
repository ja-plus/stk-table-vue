# Table Props テーブル設定
```ts
<StkTable
  ...[props]
/>
```
## API

### width

テーブル幅

```ts
width?: string;
```

### minWidth

最小テーブル幅 @deprecated 0.9.1 cssセレクター`.stk-table-main`で設定

```ts
minWidth?: string;
```

### maxWidth

テーブル最大幅 @deprecated 0.9.1 cssセレクター`.stk-table-main`で設定

```ts
maxWidth?: string;
```

### stripe

シマシマ条纹

```ts
stripe?: boolean;
```

### fixedMode

table-layout:fixedを使用するか

```ts
fixedMode?: boolean;
```

### headless

ヘッダーを非表示にするか

```ts
headless?: boolean;
```

### theme

テーマ、ライト、ダーク

```ts
theme?: 'light' | 'dark';
```

### rowHeight

行の高さ
- `props.autoRowHeight` が `true` の場合、期待値として計算に使用されます。実際の行の高さには影響しません。

```ts
rowHeight?: number;
```

### autoRowHeight

可変行の高さにするか
- `true`に設定すると、`props.rowHeight` は期待値として計算に使用されます。実際の行の高さには影響しません。

```ts
autoRowHeight?: boolean | {
  /** 推定行の高さ（rowHeightより優先） */
  expectedHeight?: number | ((row: DT) => number);
};
```

### rowHover

マウスホバー時の行をハイライトするか

```ts
rowHover?: boolean;
```

### rowActive

選択した行をハイライトするか

```ts
rowActive?: boolean | {
  /** 行選択機能を有効にするか default: true */
  enabled?: boolean;
  /** 行選択を無効にするか default: () => false */
  disabled?: (row: DT) => boolean;
  /** 選択を解除できるか default: true */
  revokable?: boolean;
};
```

### headerRowHeight

ヘッダー行の高さ。default = rowHeight

```ts
headerRowHeight?: number | null;
```

### footerRowHeight

フッター行の高さ。default = rowHeight

```ts
footerRowHeight?: number | string | null;
```

### virtual

仮想スクロール

```ts
virtual?: boolean;
```

### virtualX

横方向仮想スクロール（列幅を設定する必要があります）

```ts
virtualX?: boolean;
```

### columns

テーブル列設定

浅い監視、変更時は参照を修正してください

```ts
columns?: StkTableColumn<any>[];
```

### dataSource

データソース

浅い監視、変更時は参照を修正してください

```ts
dataSource?: any[];
```

### rowKey

行の一意キー（行の一意値はundefinedにできません）

```ts
rowKey?: UniqKeyProp;
```

### colKey

列の一意キー。デフォルト`dataIndex`

```ts
colKey?: UniqKeyProp;
```

### emptyCellText

空値の表示テキスト

```ts
emptyCellText?: string | ((option: { row: DT; col: StkTableColumn<DT> }) => string);
```

### noDataFull

データなしの高さがいっぱいになるか

```ts
noDataFull?: boolean;
```

### showNoData

データなしを表示するか

```ts
showNoData?: boolean;
```

### sortRemote

サーバーサイドソートかどうか、trueの場合はデータをソートしません

```ts
sortRemote?: boolean;
```

### showHeaderOverflow

ヘッダーがオーバーフロー時に...を表示するか

```ts
showHeaderOverflow?: boolean;
```

### showOverflow

ボディがオーバーフロー時に...を表示するか

```ts
showOverflow?: boolean;
```

### showTrHoverClass

行hover classを追加するか

```ts
showTrHoverClass?: boolean;
```

### cellHover

マウスホバー時のセルをハイライトするか

```ts
cellHover?: boolean;
```

### cellActive

選択したセルをハイライトするか

```ts
cellActive?: boolean;
```

### selectedCellRevokable

セルをもう一度クリックして選択を解除できるか (cellActive=true)

```ts
selectedCellRevokable?: boolean;
```

### areaSelection

セル範囲選択（ドラッグ選択）を有効にするか

```ts
areaSelection?: boolean | {
  /**
   * コピー時のセルテキストフォーマットコールバック。
   * customCellカスタム描画を使用している場合、コピー内容が表示内容と一致するようにこのコールバックを提供するべきです。
   * @param row 行データ
   * @param col 列設定
   * @param rawValue row[col.dataIndex]の元の値
   * @returns クリップボードにコピーするテキスト
   */
  formatCellForClipboard?: (row: DT, col: StkTableColumn<DT>, rawValue: any) => string;
  /**
   * キーボードで選択範囲を移動を有効にするか。
   * 有効にすると、方向キー/Tab/Shift+Tabで選択範囲を移動でき、Excelのような動作になります。
   * この機能を有効にすると、元のキーボードスクロール動作は無効になります。
   * @default false
   */
  keyboard?: boolean;
};
```

### headerDrag

ヘッダーをドラッグできるか。コールバック関数をサポート。

```ts
headerDrag?:
  | boolean
  | {
      /**
       * 列交換モード
       * - none - 何もしない
       * - insert - 挿入（デフォルト値）
       * - swap - 交換
       */
      mode?: 'none' | 'insert' | 'swap';
      /** ドラッグを無効にする列 */
      disabled?: (col: StkTableColumn<DT>) => boolean;
    };
```

### rowClassName

行にclassNameを追加

```ts
rowClassName?: (row: any, i: number) => string;
```

### colResizable

列幅をドラッグできるか（v-model:columnsを設定する必要があります）
**設定しない** 列のminWidth、**必ず** widthを設定してください
列幅ドラッグ時、各列にはwidthが必要で、minWidth/maxWidthは効果がありません。table widthは"fit-content"になります。
- props.columnsのwidth属性が自動更新されます

```ts
colResizable?: boolean | {
  /** ドラッグを無効にする列 */
  disabled?: (col: StkTableColumn<DT>) => boolean;
};
```

### colMinWidth

ドラッグ可能な最小列幅

```ts
colMinWidth?: number;
```

### bordered

セル分割線。
デフォルトは横縦両方あり
"h" - 横線のみ
"v" - 縦線のみ
"body-v" - ボディのみ縦線
"body-h" - ボディのみ横線

```ts
bordered?: boolean | 'h' | 'v' | 'body-v' | 'body-h';
```

### autoResize

仮想スクロールの高さと幅を自動再計算。デフォルトtrue
[非反応式]
関数を渡すとリサイズ後のコールバックになります

```ts
autoResize?: boolean | (() => void);
```

### fixedColShadow

固定列の影を表示するか。パフォーマンス節約のため、デフォルトはfalse。

```ts
fixedColShadow?: boolean;
```

### optimizeVue2Scroll

vue2スクロールを最適化

```ts
optimizeVue2Scroll?: boolean;
```

### sortConfig

ソート設定

```ts
sortConfig?: {
  /** 空値を下に配置するか */
  emptyToBottom: boolean,
  /** デフォルトソート（1.初期化時にトリガー 2.ソート方向がnullのときにトリガー） */
  defaultSort?: {
      dataIndex: keyof T;
      order: Order;
  };
  /**
   * 文字列ソートにString.prototype.localCompareを使用するか
   * デフォルトtrue（歴史的な設計問題、互換性のためデフォルトtrue）
   */
  stringLocaleCompare?: boolean;
},
```

### hideHeaderTitle

ヘッダーマウスホバーのタイトルを非表示。dataIndex配列を渡せます

```ts
hideHeaderTitle?: boolean | string[];
```

### highlightConfig

ハイライト設定

```ts
highlightConfig?: {
  /** ハイライト持続時間(s) */
  duration?: number;
  /** ハイライトフレームレート*/
  fps?: number;
};
```

### seqConfig

番号列設定

```ts
seqConfig?: {
  /** 番号列の開始インデックス ページネーション対応 */
  startIndex?: number;
};
```

### expandConfig

展開行設定

```ts
expandConfig?: {
  height?: number;
};
```

### dragRowConfig

行ドラッグ設定

```ts
dragRowConfig?: {
  mode?: 'none' | 'insert' | 'swap';
};
```

### cellFixedMode

固定ヘッダー、固定列の実装方式。
[非反応式]
relative：固定列はprops.columnsの両端に配置する必要があります。
- 列幅が変更される可能性がある場合は慎重に使用してください。
- 複数レベルヘッダーの固定列は慎重に使用してください

低バージョンブラウザーでは只能是'relative'、

```ts
cellFixedMode?: 'sticky' | 'relative';
```

### smoothScroll

スムーズスクロールするか
- default: chrome < 85 || chrome > 120 ? true : false
- false: wheelイベントでスクロール。スクロール过快による白画面を防止。
- true: wheelイベントを使用しないスクロール。マウスホイールスクロールがよりスムーズに。白画面が発生する可能性あり。

```ts
smoothScroll?: boolean;
```

### scrollRowByRow

整数行単位の縦スクロール
- scrollbar：スクロールバードラッグのみ有効、白画面問題の処理に使用可能(v0.7.2)

```ts
scrollRowByRow?: boolean | 'scrollbar';
```

### scrollbar

カスタムスクロールバー設定
- false: カスタムスクロールバーを無効化
- true: デフォルト設定のカスタムスクロールバーを有効化
- ScrollbarOptions: カスタムスクロールバーを有効化して設定

```ts
scrollbar?: boolean | {
  /** スクロールバーを有効にするか */
  enabled?: boolean;
  /** 垂直スクロールバー幅 default: 8 */
  width?: number;
  /** 水平スクロールバー高さ default: 8 */
  height?: number;
  /** スクロールバースライダー最小幅 default: 20 */
  minWidth?: number;
  /** スクロールバースライダー最小高さ default: 20 */
  minHeight?: number;
};
```

### treeConfig

ツリー設定

```ts
treeConfig?: {
  /** デフォルトですべてのツリーノードを展開 */
  defaultExpandAll?: boolean;
  /** デフォルトで展開するノードキー */
  defaultExpandKeys?: UniqKey[];
  /** デフォルトで展開ずるレイヤー数 */
  defaultExpandLevel?: number;
};
```

### experimental

実験的機能設定

```ts
experimental?: {
  /** transformでスクロールをシミュレート */
  scrollY?: boolean;
};
```

### footerData

テーブルフッター合計行データ

```ts
footerData?: DT[];
```
