# StkTableColumn

列設定

```vue
<StkTable :columns="columns"></StkTable>
```
::: warning 浅い監視
コンポーネントは `columns` プロパティを深く監視**しません**。したがって、列のプッシュが效果がない場合は、次のように参照を更新することを検討してください：
:::

```ts
columns.value = columns.value.slice(); // 配列参照を更新
```

### StkTableColumn 設定
``` ts
export type StkTableColumn<T extends Record<string, any>> = {
    /**
     * 列の一意キー（オプション）。提供されていない場合、dataIndexフィールドがデフォルトで列の一意キーとして使用されます。
     */
    key?: any;
    /**
     * 列タイプ
     * - seq: シーケンス列
     * - expand: 展開可能列
     * - dragRow: ドラッグ可能行列（sktTableRef.getTableDataを使用して変更された順序を取得）
     * - tree-node: ツリーノード列、展開/折りたたみ矢印が前につきます
     */
    type?: 'seq' | 'expand' | 'dragRow' | 'tree-node';
    /** データインデックス */
    dataIndex: keyof T & string;
    /** ヘッダーテキスト */
    title?: string;
    /** 列コンテンツの配置 */
    align?: 'right' | 'left' | 'center';
    /** ヘッダーコンテンツの配置 */
    headerAlign?: 'right' | 'left' | 'center';
    /** 排序 */
    sorter?: Sorter<T>;
    /** 列幅。横方向仮想スクロールには必ず設定が必要です。 */
    width?: string | number;
    /** 最小列幅。横方向仮想スクロールを使用していない場合に効果的。 */
    minWidth?: string | number;
    /** 最大列幅。横方向仮想スクロールを使用していない場合に効果的。 */
    maxWidth?: string | number;
    /** th クラス */
    headerClassName?: string;
    /** td クラス */
    className?: string;
    /** 排序フィールド。デフォルト: dataIndex */
    sortField?: keyof T;
    /** 排序タイプ。number/string */
    sortType?: 'number' | 'string';
    /** 固定列 */
    fixed?: 'left' | 'right' | null;
    /** 列を非表示にするかどうか */
    hidden?: boolean;
    /** 現在の列の排序設定 */
    sortConfig?: Omit<SortConfig<T>, 'defaultSort'>;
    /**
     * カスタムtdレンダリングコンテンツ。
     *
     * コンポーネントprops:
     * @param props.row 行のレコード。
     * @param props.col 列設定
     * @param props.cellValue row[col.dataIndex] の値
     * @param props.rowIndex 行インデックス
     * @param props.colIndex 列インデックス（0から）virtual-xでは、そうでない場合は仮想リスト内のインデックスを表します
     */
    customCell?: Component<CustomCellProps<T>> | string;
    /**
     * カスタムthレンダリングコンテンツ
     *
     * コンポーネントprops:
     * @param props.col 列設定
     * @param props.rowIndex 行インデックス
     * @param props.colIndex 列インデックス（0から）virtual-xでは、そうでない場合は仮想リスト内のインデックスを表します
     */
    customHeaderCell?: Component<CustomHeaderCellProps<T>> | string;
    /**
     * カスタムtfoot tdレンダリングコンテンツ
     *
     * コンポーネントprops:
     * @param props.row tfoot行のレコード。
     * @param props.col 列設定
     * @param props.cellValue row[col.dataIndex] の値
     * @param props.rowIndex Tfoot行インデックス（0から開始）
     * @param props.colIndex 列インデックス
     */
    customFooterCell?: Component<CustomFooterCellProps<T>> | string;
    /** ネストされたヘッダー */
    children?: StkTableColumn<T>[];
     /** セルマージ */
    mergeCells?: MergeCellsFn<T>;
};
```

## StkTableColumn.Sorter 
```ts
type Sorter<T> = boolean 
    | ((
        data: T[],
        option: { order: Order; column: any }
    ) => T[]);

```

## StkTableColumn.SortConfig
```ts
/** 排序設定 */
export type SortConfig<T extends Record<string, any>> = {
    /** 空の値は常にリストの下部にきます */
    emptyToBottom?: boolean;
    /**
     * デフォルト排序（1.初期化時にトリガー 2.排序方向がnullの場合にトリガー）
     * onMountedでsetSorterを呼び出し、ヘッダーをクリックすること类似的行为。
     */
    defaultSort?: {
        dataIndex: keyof T;
        order: Order;
        /** sort-changeイベントの発生を無効にするかどうか。デフォルトfalse يعنيイベントが発生 */
        silent?: boolean;
    };
    /**
     * 文字列排序にString.prototype.localCompareを使用するかどうか
     * デフォルト true ($*$ should be false)
     */
    stringLocaleCompare?: boolean;
    /** 子アイテムを排序するかどうか。デフォルト false (v0.8.8)*/
    sortChildren?: boolean;
};
```

## StkTableColumn.MergeCellsFn

```ts
export type MergeCellsParam<T extends Record<string, any>> = {
    row: T;
    col: StkTableColumn<T>;
    rowIndex: number;
    colIndex: number;
};

export type MergeCellsFn<T extends Record<string, any>> =
    (data: MergeCellsParam<T>) => 
        { 
            rowspan?: number; 
            colspan?: number 
        } | undefined;
```
