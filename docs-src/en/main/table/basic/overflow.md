# Overflow Content Ellipsis

## Basic

*  `props.showOverflow` set to true will display ellipsis when content overflows.
*  `props.showHeaderOverflow` set to true will display ellipsis when header content overflows.

::: tip
When virtual list is enabled, row height will not be affected by cell content and will be fixed to the values configured in `props.rowHeight` & `props.headerRowHeight` to avoid affecting calculations.
:::


<demo vue="basic/overflow/Overflow.vue"></demo>