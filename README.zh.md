<p align="center">
    <a href="https://ja-plus.github.io/stk-table-vue/">
        <img src="https://raw.githubusercontent.com/ja-plus/stk-table-vue/master/docs-src/public/assets/logo.svg" width="152">
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

[English](./README.md) | **简体中文**

Stk Table Vue(Sticky Table) 是一个基于 Vue 3 / Vue 2.7 的高性能虚拟滚动表格组件。

数万行数据也能流畅滚动。面向实时数据展示场景，内置高亮与动画效果。

- 支持 Vue 3 & Vue 2.7
- 虚拟滚动（X / Y 轴）
- 基于 CSS `sticky` 的固定列与固定表头
- 多级表头（支持横向虚拟滚动）
- 树形表格与展开行
- 区域选取与键盘操作
- 基于 Web Animations API 的单元格高亮
- 内置自定义单元格：筛选、可编辑、多选、数字、涨跌
- 列宽调整、表头拖拽、行拖拽
- 单元格合并（虚拟模式，支持超大 rowspan / colspan）
- 自定义滚动条
- 排序与筛选
- 主题支持（暗色 / 亮色）
- CSS 变量，便于定制样式
- 基于原生 `<table>` 元素
- 零第三方运行时依赖


## 文档
### [Stk Table Vue 官方文档](https://ja-plus.github.io/stk-table-vue/)
### [Stk Table React 官方文档](https://ja-plus.github.io/stk-table-react/)
### [Stk Table Svelte 官方文档](https://ja-plus.github.io/stk-table-svelte/)
### [Stk Table Solid 官方文档](https://ja-plus.github.io/stk-table-solid/)

## 🤖 面向 AI 助手

如果你是通过 AI 编码助手（Claude Code / Cursor / Copilot / Qoder 等）接入本库：

1. **先读 [`llms.txt`](./llms.txt)**（已随 npm 包发布，位于 `node_modules/stk-table-vue/llms.txt`）—— props / 列配置 / emits / slots / 实例方法速查，外加「约束与坑」与自检清单，其版本号与本包严格一致。
2. 不要靠阅读 `src/StkTable/StkTable.vue` 或 `lib/*.js` 反推 API。
3. 需要更细的说明时，抓取[文档站](https://ja-plus.github.io/stk-table-vue/)对应**单页**的 `.md` 镜像（`llms.txt` 末尾有主题 → URL 索引）。请勿抓取 `llms-full.txt`（全站合并，约 590KB）。
4. 类型权威定义：`lib/src/StkTable/types/index.d.ts`（含中文 JSDoc，hover 即可看到）。

想让 AI 助手无需提醒就能用上这份速查表，在你项目的 `AGENTS.md`（或 `.cursor/rules/`、`.claude/skills/`）加一行指针即可：

```markdown
本项目使用 stk-table-vue。写表格代码前先读 node_modules/stk-table-vue/llms.txt，不要从源码反推 API。
```


## 仓库
- [Github](https://github.com/ja-plus/stk-table-vue)
- [Gitee](https://gitee.com/japlus/stk-table-vue)

## 在线示例
[<span style="font-size: 16px;font-weight: bold;">StackBlitz 在线示例</span>](https://stackblitz.com/edit/vitejs-vite-ad91hh?file=src%2FDemo%2Findex.vue)

## 使用
> npm install stk-table-vue

```html
<script setup>
import { StkTable } from 'stk-table-vue'
import { ref, useTemplateRef } from 'vue'
const stkTableRef = ref<InstanceType<typeof StkTable>>();
// 或者 Vue 3.5 的 useTemplateRef
const stkTableRef = useTemplateRef('stkTableRef');

// 高亮行
stkTableRef.value.setHighlightDimRow([rowKey], {
  method: 'css' | 'animation', // 默认 animation
  className: 'custom-class-name', // 用于 method 为 'css'
  keyframe: [{ backgroundColor: '#aaa' }, { backgroundColor: '#222' }], // 同 https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API/Keyframe_Formats
  duration: 2000,
});
// 高亮单元格
stkTableRef.value.setHighlightDimCell(rowKey, colDataIndex, {
  method: 'css' | 'animation',
  className: 'custom-class-name', // 用于 method 为 'css'
  keyframe: [{ backgroundColor: '#aaa' }, { backgroundColor: '#222' }], // 用于 method 为 'animation'
  duration: 2000,
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

### Vue2.7 用法
[Vue2.7 用法](https://ja-plus.github.io/stk-table-vue/main/start/vue2-usage.html)

## API
* [Props](https://ja-plus.github.io/stk-table-vue/main/api/table-props.html)

* [Emits](https://ja-plus.github.io/stk-table-vue/main/api/emits.html)

* [Slots](https://ja-plus.github.io/stk-table-vue/main/api/slots.html)

* [Expose](https://ja-plus.github.io/stk-table-vue/main/api/expose.html)

* [StkTableColumn：定义列类型](https://ja-plus.github.io/stk-table-vue/main/api/stk-table-column.html)

* [高亮：setHighlightDimCell & setHighlightDimRow](https://ja-plus.github.io/stk-table-vue/main/api/expose.html#sethighlightdimcell)


### 示例
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

## 性能对比
与其他 Vue 表格组件的性能对比见 [vue-virtual-table-benchmark](https://github.com/ja-plus/vue-virtual-table-benchmark)

[基准测试结果页](https://ja-plus.github.io/vue-virtual-table-benchmark/perf-report.html)

## 更新日志
[CHANGELOG](CHANGELOG.md)


## 许可证
[MIT](LICENSE)
