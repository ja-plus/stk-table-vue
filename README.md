<p align="center">
    <a href="https://ja-plus.github.io/stk-table-vue/">
        <img src="./docs-src/public/assets/logo.svg" width="152">
    </a>
    <h3 align='center'>Stk Table Vue</h3>
    <p align="center">
        <a href="https://www.npmjs.com/package/stk-table-vue"><img src="https://img.shields.io/npm/v/stk-table-vue"></a>
        <a href="https://www.npmjs.com/package/stk-table-vue"><img src="https://img.shields.io/npm/dw/stk-table-vue"></a>
        <a href="https://github.com/ja-plus/stk-table-vue/stargazers"><img src="https://img.shields.io/github/stars/ja-plus/stk-table-vue.svg"></a>
        <a href="https://raw.githubusercontent.com/ja-plus/stk-table-vue/master/LICENSE"><img src="https://img.shields.io/npm/l/stk-table-vue"></a>
        <a href="https://github.com/ja-plus/stk-table-vue"><img src="https://img.shields.io/npm/types/stk-table-vue"></a>
    </p>
</p>

> Stk Table Vue(Sticky Table) is a high-performance virtual list component based on Vue.
>
> Used for real-time data display, with data highlighting and dynamic effects
>
> Support Vue3 and Vue2.7


## Documentation
### [Stk Table Vue Official CN](https://ja-plus.github.io/stk-table-vue/)


## Repo: 
- [Github](https://github.com/ja-plus/stk-table-vue)
- [Gitee](https://gitee.com/japlus/stk-table-vue) 🇨🇳

## Demo
[<span style="font-size: 16px;font-weight: bold;">Online Demo in stackblitz</span>](https://stackblitz.com/edit/vitejs-vite-ad91hh?file=src%2FDemo%2Findex.vue)

## Compare
Compare performance with other vue table [vue-table-compare](https://github.com/ja-plus/vue-table-compare)



## Usage
> npm install stk-table-vue

```html
<script setup>
import { StkTable } from 'stk-table-vue'
import { ref, useTemplateRef } from 'vue'
const stkTableRef = ref<InstanceType<typeof StkTable>>();
// or Vue 3.5 useTemplateRef
const stkTableRef = useTemplateRef('stkTableRef');

// highlight row
stkTableRef.value.setHighlightDimRow([rowKey]，{
  method: 'css'|'animation',// default animation。
  className: 'custom-class-name', // method css。
  keyframe: [{backgroundColor:'#aaa'}, {backgroundColor: '#222'}],//same as https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats
  duration: 2000,。
});
 // highlight cell
stkTableRef.value.setHighlightDimCell(rowKey, colDataIndex, {
  method: 'css'|'animation',
  className:'custom-class-name', // method css。
  keyframe: [{backgroundColor:'#aaa'}, {backgroundColor: '#222'}], // method animation。
  duration: 2000,。
});

const columns = [
  {title: 'name', dataIndex: 'name'},
  {title: 'age', dataIndex: 'age'},
  {title: 'address', dataIndex: 'address'},
];

const dataSource = [
  {id: 1, name: 'John', age: 32, address: 'New York'},
  {id: 2, name: 'Jim', age: 42, address: 'London'},
  {id: 3, name: 'Joe', age: 52, address: 'Tokyo'},
  {id: 4, name: 'Jack', age: 62, address: 'Sydney'},
  {id: 5, name: 'Jill', age: 72, address: 'Paris'},
]

</script>

<template>
    <StkTable ref='stkTableRef' row-key="id" :data-source="dataSource" :columns="columns"></StkTable>
</template>

```

### Vue2.7 Usage
[Vue2.7 Usage](https://ja-plus.github.io/stk-table-vue/main/start/vue2-usage.html)

## API
### Props
[Props 表格配置](https://ja-plus.github.io/stk-table-vue/main/api/table-props.html)

### Emits
[Emits 事件](https://ja-plus.github.io/stk-table-vue/main/api/emits.html)

### Slots
[Slots 插槽](https://ja-plus.github.io/stk-table-vue/main/api/slots.html)

### Expose
[Expose 实例方法](https://ja-plus.github.io/stk-table-vue/main/api/expose.html)

### StkTableColumn 列配置
[StkTableColumn 列配置](https://ja-plus.github.io/stk-table-vue/main/api/stk-table-column.html)

### setHighlightDimCell & setHighlightDimRow
[Highlight 高亮](https://ja-plus.github.io/stk-table-vue/main/api/expose.html#sethighlightdimcell)


### Example
```vue
<template>
 <StkTable
    ref="stkTable"
    row-key="name"
    v-model:columns="columns"
    :style="{height:props.height}"
    theme='dark'
    height='200px'
    bordered="h"
    :row-height="28"
    :show-overflow="false"
    :show-header-overflow="false"
    :sort-remote="false"
    col-resizable
    header-drag
    virtual
    virtual-x
    no-data-full
    col-resizable
    auto-resize
    fixed-col-shadow
    :col-min-width="10"
    :headless="false"
    :data-source="dataSource"
    @current-change="onCurrentChange"
    @row-menu="onRowMenu"
    @header-row-menu="onHeaderRowMenu"
    @row-click="onRowClick"
    @row-dblclick="onRowDblclick"
    @sort-change="handleSortChange"
    @cell-click="onCellClick"
    @header-cell-click="onHeaderCellClick"
    @scroll="onTableScroll"
    @scroll-x="onTableScrollX"
    @col-order-change="onColOrderChange"
  />
</template>
<script setup>
  import { h, defineComponent } from 'vue';
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      fixed: 'left',
      width: '200px',
      headerClassName: 'my-th',
      className: 'my-td',
      sorter: true,
      customHeaderCell: function FunctionalComponent(props){
          return h(
              'span',
              { style: 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap' },
              props.col.title + '(render) text-overflow,',
          );
      },
      customCell: defineComponent({
        setup(){
          //...
          return () => <div></div> // vue jsx
        }
      })
    },
  ]
</script>
```


## Other
* `$*$`
