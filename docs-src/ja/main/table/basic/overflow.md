# オーバーフロー省略

## 基本

* `props.showOverflow` を `true` に設定すると、コンテンツがオーバーフロー的时候我ipsisが表示されます。
* `props.showHeaderOverflow` を `true` に設定すると、ヘッダーコンテンツがオーバーフロー的时候我ipsisが表示されます。

::: tip
仮想リストが有効な場合、行の高さはセルコンテンツの影響を受けず、`props.rowHeight` と `props.headerRowHeight` で設定された値に固定されます。これにより計算に影響が出るのを防ぎます。
:::


<demo vue="basic/overflow/Overflow.vue"></demo>
