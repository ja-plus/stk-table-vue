# 边框

::: tip
配置 `bordered` 实现表格边框， 取值 `true` | `false` | `h` | `v` | `body-v` | `body-h`。

| 取值 | 说明 |
| --- | --- |
| `true` | 表格所有边框 |
| `false` | 没有边框 |
| `h` | 仅横线 |
| `v` | 仅竖线 |
| `body-v` | 表头横竖线，表体仅竖线 |
| `body-h` | 表头横竖线，表体仅横线 |


出于滚动条影响，表格右侧和底部的边框，由单元格的 `border-right` 和 `border-bottom` 实现。因此会消失。您可根据实际情况自行添加css。
:::
<demo vue="basic/border/Default.vue"></demo>