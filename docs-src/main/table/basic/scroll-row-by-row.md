# 按行滚动
对表格进行纵向滚动时，仅滚动**整数行**，而不是像素。这样可以确保表格的行始终对齐，从而提高可读性。

配置 `props.scrollRowByRow` 即可打开此功能。

| 取值 | 描述 |
| ---- | ---- |
| boolean | 是否开启 |
| "scrollbar" | 仅拖动滚动条触发，如果拖动滚动条导致白屏，则可使用此方式减少白屏影响 |

滚动下面表格，可以看到表格行的位置基本不变。

<demo vue="basic/scroll-row-by-row/ScrollRowByRow.vue"></demo>