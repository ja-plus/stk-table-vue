# Table Size

The width and height of the table are determined by the width and height of the root container.

Therefore, you can place the table in a `flex` container and let `flex` manage the height instead of manually setting the width and height.

## Fixed Width and Height

::: tip
Control the table width and height through `style`.
:::     

<demo vue="basic/size/Default.vue"></demo>

## Flex Layout

::: tip
Control the height of the outer `flex` container, and the table height will adapt.
:::

<demo vue="basic/size/Flex.vue"></demo>
