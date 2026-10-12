# CheckboxCell <Badge type="tip" text="^1.0.0" />

CheckboxCell is a built-in checkbox cell component that supports select-all and indeterminate states at the cell level.

### Basic Usage

Create `CheckboxCell` and `CheckboxAllCell` components via the `createCheckboxCell` factory function, and use them as `customCell` and `customHeaderCell` respectively.

<demo vue="advanced/custom-cells/CheckboxCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/index.vue"></demo>

### Using Third-party Components

You can pass a UI library's Checkbox component via `checkboxComponent` to maintain consistent styling.

<demo vue="advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue"></demo>

### Tree Checkbox Cascade <Badge type="tip" text="^1.2.8" />

Set `cascade: true` to enable checkbox cascade (parent-child linkage + indeterminate) on tree data (`children`):

- Checking a parent recursively checks/unchecks all its descendants;
- The parent checked state is derived from descendants: checked only when all descendants are checked, otherwise the parent shows an indeterminate state;
- The header select-all/indeterminate counts leaf rows (rows without `children`) only, so parents are not double-counted; rows not yet lazy-loaded (`treeConfig.lazy`) count as leaves.

<demo vue="advanced/custom-cells/CheckboxCell/CheckboxCascadeCell.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/CheckboxCascadeCell.vue"></demo>

::: tip
- `cascade` is off by default; row checked states stay independent (backward compatible).
- `onChange` receives the row the user actually clicked; cascaded writes do not fire separate callbacks.
- Cascade state is written to row data (the `field`) by the component; mutating `row[field]` directly bypasses ancestor derivation — maintain state through checkbox interactions.
:::

### createCheckboxCell Options

The `createCheckboxCell` factory function accepts a configuration object:

```ts
interface createCheckboxCellOptions<T = any> {
    /** Field name in row data for checked state, default '_isChecked' */
    field?: string;
    /** Custom checkbox component (e.g., Element Plus / Ant Design Vue Checkbox) */
    checkboxComponent?: any;
    /** Enable checkbox cascade for tree data (parent-child linkage + indeterminate), default false */
    cascade?: boolean;
    /** Cell checkbox state change callback */
    onChange?: (checked: boolean, row: T) => void;
    /** Select all checkbox state change callback */
    onSelectAll?: (checked: boolean) => void;
}
```

| Property | Type | Default | Description |
|---|---|---|---|
| field | `string` | `'_isChecked'` | Field name in row data for checked state |
| checkboxComponent | `Component` | - | Custom checkbox component, uses native input[type=checkbox] if not provided |
| cascade | `boolean` | `false` | Enable checkbox cascade for tree data (parent-child linkage + indeterminate), see [Tree Checkbox Cascade](#tree-checkbox-cascade) |
| onChange | `(checked, row) => void` | - | Callback when cell checkbox state changes |
| onSelectAll | `(checked) => void` | - | Callback when select all checkbox state changes |
