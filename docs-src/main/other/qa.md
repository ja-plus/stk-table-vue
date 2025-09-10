# Q&A

## Q：columns 变更不生效。
A: 表格组件内部 watch 了 columns，没有加deep(深度监听)，重新给columns赋值新的引用即可。参考[列配置](/main/api/stk-table-column)

## Q：dataSource 变更不生效。
A: 同上。使用 dataSource.value = dataSource.value.slice() 更新引用即可。
