# Bordered

::: tip
Configure `bordered` to implement table borders, with values `true` | `false` | `h` | `v` | `body-v`.

| Value | Description |
| --- | --- |
| `true` | All table borders |
| `false` | No border |
| `h` | Only horizontal lines |
| `v` | Only vertical lines |
| `body-v` | Header and body with horizontal lines, body with vertical lines |
| `body-h` | Header and body with vertical lines, body with horizontal lines |

Due to scrollbar influence, the right and bottom borders of the table are implemented by cell's `border-right` and `border-bottom`, which may disappear. You can add custom CSS as needed.
:::
<demo vue="basic/border/Default.vue"></demo>