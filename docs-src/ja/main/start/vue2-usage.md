# Vue 2.7 での使用

Vue 2.7の多くのVue 3Composition APIとの互換性により、ソースコード（`.vue` ファイル）をインポートすることでVue 2.7プロジェクトで使用できます。

## インストール
``` sh
$ npm install stk-table-vue;
```

## 環境準備
ソースコードは `vueSFC` + `ts` で書かれているため、開発環境で `TypeScript` をサポートしている必要があります。

### TypeScript 環境
webpack 設定の参照を示します。
#### webpack.config.js
```js
module.exports = {
    //...
    rules: [{
        test: /\.ts$/,
        loader: 'swc-loader', 
        options: {
            jsc: {
                parser: {
                    syntax: 'typescript',
                },
            }
        }
    },
    // ...
    ]
}
```

### vue SFC ファイルのパース
すべてのvueプロジェクトがこれをサポートしているため、詳細な説明は省略します。

## インポート
使い方はVue 3と同じですが、インポートするファイルが異なります。

main
```js
import 'stk-table-vue/lib/style.css';
```

vue SFC
```vue
<script>
import StkTable from 'stk-table-vue/src/StkTable/StkTable.vue';
</script>
```
