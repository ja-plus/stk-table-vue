# CheckboxCell チェックボックス <Badge type="tip" text="^1.0.0" />

CheckboxCell は、セルレベルで全選択/半選択機能をサポートする組み込みのチェックボックスセルコンポーネントです。

### 基本的な使い方

`createCheckboxCell` ファクトリ関数を使用して `CheckboxCell` と `CheckboxAllCell` コンポーネントを作成し、それぞれ `customCell` と `customHeaderCell` として使用します。

<demo vue="advanced/custom-cells/CheckboxCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/index.vue"></demo>

### サードパーティコンポーネントの使用

`checkboxComponent` にUIライブラリの Checkbox コンポーネントを渡して、プロジェクト全体のスタイルを統一することができます。

<demo vue="advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue"></demo>

### ツリーのチェックボックス連動 <Badge type="tip" text="^1.2.8" />

ツリーデータ（`children`）で `cascade: true` を設定するとチェックボックスの連動（親子連動 + 半選択）を有効化します：

- 親行をチェックすると、すべての子孫行が再帰的にチェック/解除されます；
- 親行のチェック状態は子孫から導出されます：すべての子孫がチェック済みの場合のみチェック扱いとなり、一部のみの場合は親行が半選択状態で表示されます；
- ヘッダーの全選択/半選択は葉行（`children` を持たない行）のみを集計し、親行の二重カウントはありません。遅延ロード（`treeConfig.lazy`）未ロードの行は葉として扱われます。

<demo vue="advanced/custom-cells/CheckboxCell/CheckboxCascadeCell.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/CheckboxCascadeCell.vue"></demo>

::: tip
- `cascade` はデフォルトで無効で、各行のチェック状態は互いに独立です（後方互換）。
- `onChange` にはユーザーが実際にクリックした行が渡されます。連動書き込みでは個別のコールバックは発生しません。
- 連動状態はコンポーネントが行データ（`field`）に書き込みます。`row[field]` を直接変更すると祖先の導出が行われないため、チェック操作を通じて状態を維持してください。
:::

### createCheckboxCell オプション

`createCheckboxCell` ファクトリ関数は設定オブジェクトを受け取ります：

```ts
interface createCheckboxCellOptions<T = any> {
    /** 行データ内の選択状態を表すフィールド名、デフォルト '_isChecked' */
    field?: string;
    /** カスタムチェックボックスコンポーネント（Element Plus / Ant Design Vue の Checkbox など） */
    checkboxComponent?: any;
    /** ツリーデータ（children）でチェックボックス連動（親子連動 + 半選択）を有効化、デフォルト false */
    cascade?: boolean;
    /** セルチェックボックス状態変更コールバック */
    onChange?: (checked: boolean, row: T) => void;
    /** 全選択チェックボックス状態変更コールバック */
    onSelectAll?: (checked: boolean) => void;
}
```

| プロパティ | 型 | デフォルト | 説明 |
|---|---|---|---|
| field | `string` | `'_isChecked'` | 行データ内の選択状態を表すフィールド名 |
| checkboxComponent | `Component` | - | カスタムチェックボックスコンポーネント、未指定時はネイティブ input[type=checkbox] を使用 |
| cascade | `boolean` | `false` | ツリーデータでチェックボックス連動（親子連動 + 半選択）を有効化、[ツリーのチェックボックス連動](#ツリーのチェックボックス連動)を参照 |
| onChange | `(checked, row) => void` | - | セルチェックボックス状態変更時のコールバック |
| onSelectAll | `(checked) => void` | - | 全選択チェックボックス状態変更時のコールバック |
