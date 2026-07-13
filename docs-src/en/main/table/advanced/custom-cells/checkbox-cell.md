# CheckboxCell <Badge type="tip" text="^1.0.0" /> <Badge type="warning" text="Beta" />

CheckboxCell is a built-in checkbox cell component that supports select-all and indeterminate states at the cell level.

### Basic Usage

Create `CheckboxCell` and `CheckboxAllCell` components via the `createCheckboxCell` factory function, and use them as `customCell` and `customHeaderCell` respectively.

<demo vue="advanced/custom-cells/CheckboxCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/index.vue"></demo>

### Using Third-party Components

You can pass a UI library's Checkbox component via `checkboxComponent` to maintain consistent styling.

<demo vue="advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue"></demo>

### createCheckboxCell Options

The `createCheckboxCell` factory function accepts a configuration object:

```ts
interface createCheckboxCellOptions<T = any> {
    /** Field name in row data for checked state, default '_isChecked' */
    field?: string;
    /** Custom checkbox component (e.g., Element Plus / Ant Design Vue Checkbox) */
    checkboxComponent?: any;
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
| onChange | `(checked, row) => void` | - | Callback when cell checkbox state changes |
| onSelectAll | `(checked) => void` | - | Callback when select all checkbox state changes |
