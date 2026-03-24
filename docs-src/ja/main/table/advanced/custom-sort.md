# カスタム排序

`StkTableColumn['sorter']` でカスタム排序ルールを設定できます。これはすでに [排序セクション](/ja/main/table/basic/sort#Custom Sorting) で触れました。

この章では、コンポーネントが提供する組み込み排序関数を紹介します。

## setSorter メソッド
コンポーネントインスタンスは `setSorter` メソッドを提供して、ユーザーが手動で排序をトリガーできるようにします。例如：外部ボタンをクリックしてテーブル排序をトリガーします。

```ts
stkTableRef.value?.setSorter('rate', 'desc');
```
<demo vue="advanced/custom-sort/CustomSort/index.vue"></demo>

### パラメータ説明

```ts
/**
 * テーブルヘッダーの排序状態を設定します。
 * @param colKey 一意の列キー。排序状態をリセットするには `resetSorter` を使用します
 * @param order 排序方向 'asc'|'desc'|null
 * @param option.sortOption 排序パラメータを指定します。StkTableColumn の排序関連フィールドと同じ。列から検索することをお勧めします。
 * @param option.sort 排序をトリガーするかどうか - デフォルト true
 * @param option.silent コールバックのトリガーを防ぐかどうか - デフォルト true
 * @param option.force 強制的に排序するかどうか - デフォルト true
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
* `option.sortOption` の目的は、渡された `colKey` が `columns` にない場合に排序パラメータを指定することです。列を非表示にしているがその列のフィールドで排序仍然したい場合は便利です。
    - 最高優先順位：設定されている場合、`colKey` を使用して対応する列を検索して排序することはしません。

## 組み込み排序関数
コンポーネントからエクスポートされる排序関数をインポートして、テーブルの組み込み排序動作と整合させることができます。
```ts
import { tableSort, insertToOrderedArray } from 'stk-table-vue';
```
### tableSort
#### 使用シナリオ
より適切なデータ更新パフォーマンスを得るために、`props.sortRemote` を設定してテーブルの組み込み排序を無効にできます。データを更新するときには、以下に示す `insertToOrderedArray` 関数を使用します。

ヘッダーをクリックして排序をトリガーするとき、仍然組み込み排序を使用したい場合は、`@sort-change` コールバックでこの関数を使用できます。

#### コード例
```ts
// @sort-change="handleSortChange"
function handleSortChange(col: StkTableColumn<any>, order: Order, data: any[], sortConfig: SortConfig<any>) {
    // 追加の操作をここで行えます
    dataSource.value = tableSort(col, order, data, sortConfig);
}
```

#### パラメータ説明
```ts
/**
 * テーブル排序抽象化
 * リモート排序を設定することで、コンポーネントの外部でテーブル排序を実装できます。
 * ユーザーは @sort-change イベントでテーブルprops 'dataSource' を更新して排序を完了できます。
 *
 * sortConfig.defaultSort は order が null の場合に有効です
 * @param sortOption 列設定
 * @param order 排序方向
 * @param dataSource 排序される配列
 */
export function tableSort<T extends Record<string, any>>(
    sortOption: SortOption<T>,
    order: Order,
    dataSource: T[],
    sortConfig: SortConfig<T> = {},
): T[] 
```

### insertToOrderedArray
リアルタイムでデータが絶えず更新されるシナリオでは、二分挿入を使用すると排序時間を効果的に短縮し、パフォーマンスを向上させることができます。
#### コード例
```ts
dataSource.value = insertToOrderedArray(tableSortStore, item, dataSource.value);
```
#### パラメータ説明
```ts
/**
 * 順序付き配列に新しいデータを挿入します
 *
 * 注意：元の配列は変更せず、新しい配列を返します
 * @param sortState 排序状態
 * @param sortState.dataIndex 排序フィールド
 * @param sortState.order 排序方向
 * @param sortState.sortType 排序方法
 * @param newItem 挿入されるデータ
 * @param targetArray テーブルデータ
 * @param sortConfig SortConfig参照 https://github.com/ja-plus/stk-table-vue/blob/master/src/StkTable/types/index.ts
 * @param sortConfig.customCompare カスタム比較ルール
 * @return targetArrayのシャローコピー
 */
export function insertToOrderedArray<T extends object>(
    sortState: SortState<T>,
    newItem: T,
    targetArray: T[],
    sortConfig: SortConfig<T> & { customCompare?: (a: T, b: T) => number } = {}
): T[] 

```

### 例
以下の例は `tableSort` と `insertToOrderedArray` の使用方法を示しています。クリックして行を挿入し、挿入排序の效果を確認してください。

<demo vue="advanced/custom-sort/InsertSort.vue"></demo>
