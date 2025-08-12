# Cell Edit
Since each project has different requirements, the table does not have built-in cell editing functionality. You need to implement it yourself using `customCell`.

Here's a simple implementation:

* Double-click cell to edit: Press `Enter` to save, press `Esc` or blur to cancel.
* Row edit mode: Check the edit row to enter row edit mode. No need to press `Enter` to save in this mode.

<demo vue="demos/CellEdit/index.vue"  github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/CellEdit/index.vue"></demo>

## Implementation Instructions
Implemented using `customCell` to customize input.

::: tip change Event
You can notify the `EditCell` change event to the outside through an event bus ([CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) / [mitt](https://www.npmjs.com/package/mitt)) or other methods.
:::
