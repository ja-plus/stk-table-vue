# Using in vue2.7

Due to vue2.7's compatibility with many vue3 composition APIs, it can be used in vue2.7 projects by importing the source code (`.vue` files).

## Installation
``` sh
$ npm install stk-table-vue;
```
## Environment Preparation
Since the source code is written in `vueSFC` + `ts`, your development environment needs to support `TypeScript`.
### TypeScript Environment
Here's a webpack configuration reference.
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
### Parsing vue SFC Files
All vue projects support this, so no further elaboration.

## Import
The usage is the same as in vue3, but the imported files are different.

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