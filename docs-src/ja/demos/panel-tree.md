# パネルツリー
## デモ
<demo vue="demos/PanelTree/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/PanelTree/index.vue"></demo>

## 要点
### 展開可能な行の選択を無効化
行に子があるときに選択を無効にするために `row-active` で `disabled` 関数を設定します。
### 展開可能な行のホバースタイルを削除
1. 行に子があるときに `panel-header-row` クラス名を追加するために `row-class-name` を設定します。
2. `panel-header-row` -> `--tr-hover-bgc: var(--th-bgc);` を設定してヘッダー背景色と整合させます。
### 展開可能な行の '--' を削除
行に子があるときに空文字列を返すように `empty-cell-text` を設定します。
### 展開可能な行のテキストオーバーフロー
CSS介してデフォルトのテキストオーバーフロースタイルを削除します。
```css
:deep(.panel-header-row .table-cell-wrapper) {
    overflow: initial;
}
```
