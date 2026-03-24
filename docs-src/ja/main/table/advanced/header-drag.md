# ヘッダードラッグ

* `headerDrag` プロパティを設定して、列ドラッグ並べ替えを有効にします。
* `columns` は `v-model` モディファイアで設定する必要があります。

```js
<StkTable
    header-drag // [!code ++]
    :columns="columns" // [!code --]
    v-model:columns="columns" // [!code ++]
></StkTable>
```

ヘッダーをドラッグしてみてください

<demo vue="advanced/header-drag/HeaderDrag.vue"></demo>

## イベントで順序を変更
```ts
/**
 * ヘッダー列ドラッグイベント
 * ```(dragStartKey: string, targetColKey: string)```
 */
(e: 'col-order-change', dragStartKey: string, targetColKey: string): void;
```

この方法では、`columns` の前に `v-model` モディファイアを追加する必要はありません。`columns` 配列の順序を手動で更新できます。

## API

### props.headerDrag

```ts
/** ヘッダードラッグ設定 */
export type HeaderDragConfig<DT extends Record<string, any> = any> =
    | boolean
    | {
          /**
           * 列交換モード
           * - none - 何もしない
           * - insert - 挿入（デフォルト）
           * - swap - 交換
           */
          mode?: 'none' | 'insert' | 'swap';
          /** ドラッグを無効にする列 */
          disabled?: (col: StkTableColumn<DT>) => boolean;
      };
```

### emit
```ts
/**
 * ヘッダー列ドラッグイベント
 * ```(dragStartKey: string, targetColKey: string)```
 */
(e: 'col-order-change', dragStartKey: string, targetColKey: string): void;
/**
 * ヘッダー列ドラッグ開始
 * ```(dragStartKey: string)```
 */
(e: 'th-drag-start', dragStartKey: string): void;
/**
 * ヘッダー列ドラッグドロップ
 * ```(targetColKey: string)```
 */
(e: 'th-drop', targetColKey: string): void;
```
