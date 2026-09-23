# ファイル管理ツリー

`tree-node` 列に `customCell` を指定してファイル管理ツリーを実装します。単列 + `headless`（ヘッダー非表示）のエクスプローラー風リストで、名前列はセル全体を自作し（フォルダ / ファイルアイコン、行内リネーム入力欄）、セル全体がドラッグ熱区になります。組み込みの「レベル別のインデント + ガイド線」と「矢印 / 遅延ローディング」はそれぞれ `stkTreeIndent`・`stkFoldIcon` スロットとして渡されます（これらは**あなたのセルコンポーネント**のスロットで、StkTable のトップレベルスロットではありません）。描画するかどうか、どこに置くかを自由に決められます。

<demo vue="demos/FileTree/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/FileTree/index.vue"></demo>

## ファイル管理機能

1枚目の表（フォルダ / ファイルアイコンを自作）には、エクスプローラー風の操作を一通り組み合わせています。すべてデモ側で組み立てたものです：

- **既定で展開するのは第1層だけ**：`treeConfig.defaultExpandLevel = 1`。`defaultExpandAll` は使いません。
- **行をクリックして展開 / 折りたたみ**：`cell-click` を監視し、フォルダ行に当たったら現在の展開状態に応じて `setTreeExpand(row, { expand })` で反転します。展開コントロールに当たったクリックは `cell-click` を発火しないため二度切りされません。行内リネーム入力欄上のクリックは独自で除外してください。
- **右クリックメニュー**：`row-menu` イベントで [ja-contextmenu](https://github.com/ja-plus/ja-contextmenu) を表示します。フォルダ行では「新しいファイル / 新しいフォルダ」が追加され、クリップボードに内容があるときだけフォルダ行に「貼り付け」が現れます。
- **行内リネーム**：メニューの「名前の変更」を選ぶと名前列の中に直接 `<input>` を描画します（ポップアップは開きません、VSCode 同様）。フォーカス時は拡張子を除いた主文件名を選択し、Enter / フォーカス喪失で確定、Esc で取消し。空欄は取消し扱い、同名の兄弟がある場合は確定を阻止し、未確定の新規行は取消しで削除されます。
- **新しいファイル / フォルダ**：フォルダの末尾に追加し、すぐ行内リネームに入ります。確定するまではプレースホルダ行です。
- **ドラッグで移動**：組み込みの `dragRow` ハンドル列は使いません。名前セル全体に `draggable` を持たせ、セル側でネイティブのドラッグイベント（`dragstart` / `dragover` / `drop`）を自分で扱います。フォルダ行にドロップすればそのフォルダへ移動、ファイル行にドロップした場合はポインタが格子の上半分 / 下半分にあるかで直前 / 直後に挿入し、ドロップ位置にはハイライトまたは挿入線を表示します。フォルダを自分の子孫にドロップすることは阻止され、編集中の行は入力欄が選べるよう一時的に `draggable` を外します。
- **切り取り / コピー / 貼り付け**：クリップボードは行参照のみを保持します。切り取り中の行はグレー表示になり、貼り付け時は切り取りなら移動、コピーなら深いコピー（名前に ` copy` 付加）です。

2枚目の表は同じデータを使い、別の配置方法を示します。組み込みの矢印とガイド線を残し（`stkFoldIcon` スロットを描画）、フォルダ名にラベルを付けるだけです。描画の比較用であり、ファイル管理操作は1枚目の表が対象です。

## 契約

- セルのルート要素には `height: 100%; display: flex; align-items: center;` を指定してください。ガイド線はインデントマスの中に描画され、行の高さいっぱいに伸びるため、行高を埋める flex 行でないと線が途中で切れます。
- 自作の展開コントロールには `data-stk-fold` が必須で、1セルにつき1個だけ指定してください。ラベルなどに付けるとそこもクリック判定対象になります。展開コントロールに当たったクリックは `cell-click` / `cell-selected` を発火しません。
- 矢印の見た目だけ変えたい場合は `<slot name="stkFoldIcon" />` を描画すれば組み込みの矢印（遅延ローディングのプレースホルダや展開時の回転込み）がそのまま使えます。
- アイコンがデフォルトの 16px より広い場合は `--tree-indent-width` を上書きし、インデントマス・コントロール枠・ガイド線のピッチが連動するようにしてください（例では `20px`）。

## Cell skeleton

```vue
<script lang="ts" setup>
import type { CustomCellProps } from 'stk-table-vue/src/StkTable/types/index';

defineProps<CustomCellProps<any>>();
</script>
<template>
    <div class="folder-cell">
        <!-- built-in: per-level indent + guide lines -->
        <slot name="stkTreeIndent" />
        <!-- self-drawn expand control: data-stk-fold is required; open/closed state comes from treeExpanded -->
        <span v-if="expandable" class="folder-cell__icon" data-stk-fold>{{ treeExpanded ? '▾' : '▸' }}</span>
        <span v-else class="folder-cell__icon" />
        <span>{{ cellValue }}</span>
    </div>
</template>
<style>
.folder-cell {
    height: 100%;
    display: flex;
    align-items: center;
}
.folder-cell__icon {
    flex-shrink: 0;
    width: var(--tree-indent-width);
    text-align: center;
    cursor: pointer;
}
</style>
```

::: tip 補足
列設定は組み込みのツリーテーブルと同じで、列は `type: 'tree-node'` のまま、描画だけを `customCell` に移しています：

```ts
const columns = [{ type: 'tree-node', title: 'Name', dataIndex: 'name', customCell: NameCell }];
const treeConfig = { defaultExpandLevel: 1, showGuide: true };
```

基本の使い方や遅延読み込みは[ツリーテーブル](/ja/main/table/basic/tree.html)を参照してください。
:::
