# 在vue2.7 中使用

由于vue2.7 兼容很多vue3 的组合式api，因此，可在vue2.7项目中通过引入 源码(`.vue`)的方式使用。

## 安装
``` sh
$ npm install stk-table-vue;
```
## 环境准备
由于源码使用是 `vueSFC` + `ts` 写的。因此需要您的开发环境支持`TypeScript`。
### TypeScript 环境
这里提供webpack的配置参考。
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
### 解析vue SFC文件
vue的项目都支持，不过多赘述。

## 引入
和 vue3 的使用方式一样，只是引入的文件不同。

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