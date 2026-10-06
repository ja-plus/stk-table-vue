# File Management Tree

A `tree-node` column with `customCell` makes a file management tree: a single-column, `headless` (no table header) explorer list where the name cell renders the whole cell (folder / file icons and an inline rename input) and the cell itself is the drag hotspot. The built-in "per-level indent + guide lines" and "arrow / lazy loading" come back through the `stkTreeIndent` and `stkFoldIcon` slots (note these are slots of **your cell component**, not top-level StkTable slots), so you decide whether and where to render them.

<demo vue="demos/FileTree/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/FileTree/index.vue"></demo>

## File management capabilities

The first table (self-drawn folder / file icons) assembles a full explorer-style interaction set, all wired by the demo itself:

- **Only the first level expanded by default**: `treeConfig.defaultExpandLevel = 1` instead of `defaultExpandAll`.
- **Click a row to expand / collapse**: listen to `cell-click` and flip the state with `setTreeExpand(row, { expand })` when a folder row is hit. Clicks that land on the expand control never emit `cell-click`, so nothing toggles twice; clicks on the inline rename input must be excluded yourself.
- **Context menu**: show [ja-contextmenu](https://github.com/ja-plus/ja-contextmenu) from the `row-menu` event. "New File / New Folder" only appear on folder rows; "Paste" is always listed and, once the clipboard holds something, enabled on **every** row — pasting on a folder row goes into that folder, pasting on a file row goes into the directory that file lives in. It stays greyed out only while the clipboard is empty, or when a cut source already sits in the target directory.
- **Inline rename**: picking "Rename" renders an `<input>` right inside the name cell — no popup (like VSCode). The basename (without extension) is selected on focus; Enter or blur commits, Esc cancels; an empty name counts as cancel, a duplicate sibling name blocks commit, and a not-yet-committed new row is removed on cancel.
- **New file / folder**: inserted at its sorted position and immediately put into inline rename — a placeholder row until committed.
- **Order comes from sorting only** (like VSCode): each level's `children` is sorted with folders first, then by name with `localeCompare`, so rows inside one folder cannot be reordered by dragging. Creating, renaming, moving and pasting all re-sort, and a renamed row jumps to its new sorted position.
- **Dragging works across folders only**: no built-in `dragRow` handle column — the whole name cell carries `draggable` and dispatches the native drag events (`dragstart` / `dragover` / `drop`) itself. Drop onto a folder row to move into that folder; drop onto a file row to insert before or after it depending on whether the pointer is in the upper or lower half of the cell. Dragging within the same folder shows no drop hint and changes nothing, and dropping a folder into its own descendant is blocked too.
- **Auto-expand after 1s of hovering**: dragging over a collapsed folder expands it once the pointer has stayed for more than 1s; moving to another row or leaving cancels the timer.
- **Drop highlight**: while hovering a folder, the shared `dropTargetFolder` highlights that folder and every row under it (the folder itself one shade deeper), while file-row drops draw an insertion line; the highlight disappears on drop or leave. A row being renamed temporarily drops `draggable` so the input stays selectable.
- **Cut / copy / paste**: the clipboard only stores a row reference. Cut rows are dimmed; on paste a cut row is moved and a copied row is deep-cloned (name gets ` copy`), both re-sorted afterwards. Right-clicking a file row means "paste into that file's directory" (a root-level file pastes into the root). Once the paste lands, the pasted row flashes once via `setHighlightDimRow` and is scrolled into view.

The second table reuses the same data for another placement: keep the built-in arrow and guide lines (render the `stkFoldIcon` slot) and only add a label to folder names. Both tables share one menu and one data set, so the interactions are identical; the inline edit state is scoped per table (`editing.table`), so the input only ever appears in the table you right-clicked.

## Contract

- The cell root element needs `height: 100%; display: flex; align-items: center;`: guide lines are drawn inside the indent cell and span the full row height, so a root that is not a full-height flex row cuts them short.
- A self-drawn expand control must carry `data-stk-fold`, one per cell: marking the label or other areas would turn them into click hotspots too. A click that hits the expand control no longer emits `cell-click` / `cell-selected`.
- If you only want a different arrow, render `<slot name="stkFoldIcon" />` to get the built-in one back (including the lazy loading placeholder and the expanded rotation) without tracking expand state yourself.
- When the icon is wider than the default 16px, override `--tree-indent-width` so the indent cell, the control placeholder and the guide line pitch scale together (the example uses `20px`).

## Cell skeleton

```vue
<script lang="ts" setup>
import type { CustomCellProps } from 'stk-table-vue/src/StkTable/types/index';

defineProps<CustomCellProps<any>>();
</script>
<template>
    <div class="folder-cell">
        <!-- built-in: per-level indent + guide lines -->
        <slot name="stkTreeIndent" />
        <!-- self-drawn expand control: data-stk-fold is required; open/closed state comes from treeExpanded -->
        <span v-if="expandable" class="folder-cell__icon" data-stk-fold>{{ treeExpanded ? '▾' : '▸' }}</span>
        <span v-else class="folder-cell__icon" />
        <span>{{ cellValue }}</span>
    </div>
</template>
<style>
.folder-cell {
    height: 100%;
    display: flex;
    align-items: center;
}
.folder-cell__icon {
    flex-shrink: 0;
    width: var(--tree-indent-width);
    text-align: center;
    cursor: pointer;
}
</style>
```

::: tip Note
The column config stays the same as a built-in tree table — the column is still `type: 'tree-node'`, only the rendering moves to `customCell`:

```ts
const columns = [{ type: 'tree-node', title: 'Name', dataIndex: 'name', customCell: NameCell }];
const treeConfig = { defaultExpandLevel: 1, showGuide: true };
```

For the basics and lazy loading see [Tree table](/en/main/table/basic/tree.html).
:::
