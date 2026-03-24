# カスタムセル

* `StkTableColumn['customCell']` を介して**ボディ**セルコンテンツをカスタマイズします。
* `StkTableColumn['customHeaderCell']` を介して**ヘッダー**セルコンテンツをカスタマイズします。

`customCell` と `customHeaderCell` は同様の方法で使用されます。ここで `customCell` を例として使用します。

::: warning 推奨事項
* `customCell` を要素（div、spanなど）でラップすることをお勧めします。そうしないと、`TextNode` が &lt;td&gt; の子要素として存在するとレイアウト問題が発生する可能性があります。
* `customCell` のルート要素をインライン要素（inline、inline-block、inline-flexなど）に設定することに**注意してください**。このレイアウトは**仮想リスト**で行の高さを引き伸ばす可能性があります。
:::

### Vue SFC での使用
Vue SFC コンポーネントの受け渡しをサポートしています。Vueコンポーネントのpropsは `CustomCellProps` 型で特に定義する必要があります。

::: tip ベストプラクティス
列を別ファイルで定義してエクスポートすることをお勧めします。
:::

::: code-group
```ts [column.ts]
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';
import type { DataType } from './types';
import YieldCell from './YieldCell.vue';
export const columns: StkTableColumn<DataType> = [{
    title: '歩留まり',
    dataIndex: 'yield',
    customCell: YieldCell
}]
```
```vue [YieldCell.vue]
<script lang="ts" setup>
import { computed } from 'vue';
import { DataType } from './types';
import { CustomCellProps } from 'stk-table-vue/src/StkTable/types/index';

const props = defineProps<CustomCellProps<DataType>>();
const className = computed(() => {
    let name = '';
    if (props.cellValue > 0) {
        name = 'color-up';
    } else if (props.cellValue < 0) {
        name = 'color-down';
    }
    return name;
});
</script>
<template>
    <span :class="className">{{ props.cellValue > 0 ? '+' : '' }}{{ (props.cellValue * 100).toFixed(4) }}%</span>
</template>
<style>
.color-up {
    color: #2fc87b;
}
.color-down {
    color: #ff2b48;
}
</style>
```
```ts [types.ts]
export type DataType = {
    name: string;
    yield: number;
};
```
:::

<demo vue="advanced/custom-cell/CustomCell/index.vue"></demo>

### Render関数 h での使用
単純な変更の場合、レンダリング関数を直接使用する方が便利です。

たとえば、値に**100を掛ける**て**単位を追加**できます。
```ts
import { h } from 'vue';
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';
const columns: StkTableColumn<any>[] = [
    {
        title: '歩留まり',
        dataIndex: 'yield',
        customCell: ({ cellValue }) => h('span', cellValue * 100 + '%'),
    },
]
```

### JSX での使用
JSXを使用するには、JSX環境をインストールする必要があります。

| ビルドツール | プラグイン |
|---|---|
| vite | @vitejs/plugin-vue-jsx |
| webpack + babel | @vue/babel-plugin-jsx |
| webpack + swc | swc-plugin-vue-jsx |
| rspack | swc-plugin-vue-jsx |

```tsx
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';

const columns:StkTableColumn<any>[] = [
    {
        title: '名前',
        dataIndex: 'name',
        customCell: ({ row, col, cellValue }) => {
            return <span style="color: red">{cellValue}</span>;
        },
    },
]
```



## API
| プロパティ | props | デフォルト | 説明 |
|---|---|---|---|
| customCell | (props: CustomCellProps) => VNode | - | カスタムセルレンダリング関数 |
| customHeaderCell | (props: CustomHeaderCellProps) => VNode | - | カスタムヘッダーセルレンダリング関数 |

### types
customCell props 型
```ts
export type CustomCellProps<T extends Record<string, any>> = {
    row: T;
    col: StkTableColumn<T>;
    /** row[col.dataIndex] の値 */
    cellValue: any;
    rowIndex: number;
    /** 
     * 列インデックス（0から開始）
     * 
     * 注意：
     * - virtual-xでは、そうでない場合は仮想リスト内のインデックスを表します
     */
    colIndex: number;
    /**
     * 現在の行が展開されているかどうか
     * - 展開されていない：null
     * - 展開されている：列設定を返します
     */
    expanded?: StkTableColumn<any>;
    /** 現在のツリーノード行が展開されているかどうか */
    treeExpanded?: boolean;
};

export type CustomHeaderCellProps<T extends Record<string, any>> = {
    col: StkTableColumn<T>;
    rowIndex: number;
    /** 
     * 列インデックス（0から開始）
     * 
     * 注意：
     * - virtual-xでは、そうでない場合は仮想リスト内のインデックスを表します
     */
    colIndex: number;
};
