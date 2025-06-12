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

> StK Table (Sticky Table) 是一个基于Vue 的高性能虚拟列表组件。
> 用于实时数据展示，数据高亮动效。

> Vue2.7支持引入源码(**ts**)使用。

## Doc
文档： [Stk Table Vue 高性能虚拟表格](https://ja-plus.github.io/stk-table-vue/)

## Repo: 
- [Github](https://github.com/ja-plus/stk-table-vue)
- [Gitee](https://gitee.com/japlus/stk-table-vue) 🇨🇳

## Demo

[<span style="font-size: 16px;font-weight: bold;">Online Demo</span>](https://stackblitz.com/edit/vitejs-vite-ad91hh?file=src%2FDemo%2Findex.vue)

## Feature TODO:
* [x] 高亮行，单元格。
  - [x] 使用 `Web Animations API` 实现高亮。(`v0.3.4` 变更为默认值)
  - [x] 支持配置高亮参数（持续时间，颜色，频率）。(`v0.2.9`)
  - [x] `setHighlightDimRow`/`setHighlightCellRow`支持自定义高亮css类名。(`v0.2.9`)
* [x] 虚拟列表。
  - [x] 纵向。
  - [x] 横向（必须设置列宽）。
  - [x] 支持不定行高。（`v0.6.0`）
* [x] 列固定。
  - [x] 固定列阴影。
    - [x] 多级表头固定列阴影。
    - [x] sticky column 动态计算阴影位置。(`v0.4.0`)
* [x] 行展开。(`v0.5.0`)
* [x] 行拖动。(`v0.5.0`)
* [x] 树形。(`v0.7.0`)
* [] 列筛选。
* [x] 斑马纹。
* [x] 拖动更改列顺序。
* [x] 拖动调整列宽。
* [x] 排序
  - [x] 支持配置 `null` | `undefined` 永远排最后。
  - [x] 支持配置 string 使用 `String.prototype.localCompare` 排序。
* [x] 多级表头。
  - [] 横向虚拟滚动。
* [x] 支持table-layout: fixed 配置。
* [x] 鼠标悬浮在表格上，键盘滚动虚拟表格。
  - [x] 键盘 `ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight`/`PageUp`/ `PageDown` 按键支持。
* [] 非虚拟滚动时，大数据分批加载。
* [x] vue2.7支持（引入源码使用）。
  - [x] `props.optimizeVue2Scroll` 优化vue2虚拟滚动流畅度。(`v0.2.0`)
* [x] 支持配置序号列。`StkTableColumn['type']`。(`v0.3.0`)
* [x] `props.cellHover`单元格悬浮样式。(`v0.3.2`)
* [] 惯性滚动优化。


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
  method: 'css'|'js'|'animation',// 默认 animation。
  className: 'custom-class-name', // method css 时生效。
  keyframe: [{backgroundColor:'#aaa'}, {backgroundColor: '#222'}],//same as https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats
  duration: 2000,// 动画时长。
});
 // highlight cell
stkTableRef.value.setHighlightDimCell(rowKey, colDataIndex, {
  method: 'css'|'animation',
  className:'custom-class-name', // method css 时生效。
  keyframe: [{backgroundColor:'#aaa'}, {backgroundColor: '#222'}], // method animation 时生效。
  duration: 2000,// 动画时长。
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
[在vue2中使用](https://ja-plus.github.io/stk-table-vue/main/start/vue2-usage.html)

## Notice
注意，组件会改动 `props.columns` 中的对象。如果多个组件 `columns` 数组元素存在引用同一个 `StkTableColumn` 对象。则考虑赋值 `columns` 前进行深拷贝。

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
[高亮使用文档](https://ja-plus.github.io/stk-table-vue/main/api/expose.html#sethighlightdimcell)


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
* `$*$` 兼容注释
