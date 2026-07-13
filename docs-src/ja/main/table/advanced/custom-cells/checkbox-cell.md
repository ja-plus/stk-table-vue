# CheckboxCell チェックボックス <Badge type="tip" text="^1.0.0" /> <Badge type="warning" text="Beta" />

CheckboxCell は、セルレベルで全選択/半選択機能をサポートする組み込みのチェックボックスセルコンポーネントです。

### 基本的な使い方

`createCheckboxCell` ファクトリ関数を使用して `CheckboxCell` と `CheckboxAllCell` コンポーネントを作成し、それぞれ `customCell` と `customHeaderCell` として使用します。

<demo vue="advanced/custom-cells/CheckboxCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/index.vue"></demo>

### サードパーティコンポーネントの使用

`checkboxComponent` にUIライブラリの Checkbox コンポーネントを渡して、プロジェクト全体のスタイルを統一することができます。

<demo vue="advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue"></demo>

### createCheckboxCell オプション

`createCheckboxCell` ファクトリ関数は設定オブジェクトを受け取ります：

```ts
interface createCheckboxCellOptions<T = any> {
    /** 行データ内の選択状態を表すフィールド名、デフォルト '_isChecked' */
    field?: string;
    /** カスタムチェックボックスコンポーネント（Element Plus / Ant Design Vue の Checkbox など） */
    checkboxComponent?: any;
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
| onChange | `(checked, row) => void` | - | セルチェックボックス状態変更時のコールバック |
| onSelectAll | `(checked) => void` | - | 全選択チェックボックス状態変更時のコールバック |
