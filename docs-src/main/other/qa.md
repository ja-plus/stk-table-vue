# Q&A

## Q：columns 更新后，表格没有变化。
A: 表格组件内部 watch 了 columns，没有加deep(深度监听)，重新给columns赋值新的引用即可。参考[列配置](http://localhost:5173/stk-table-vue/main/api/stk-table-column.html)

