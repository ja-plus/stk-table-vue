# CheckboxCell 多选框 <Badge type="tip" text="^1.0.0" /> <Badge type="warning" text="Beta" />

CheckboxCell 是一个内置的多选框单元格组件，支持单元格级别的全选/半选功能。

### 基础使用

通过 `createCheckboxCell` 工厂函数创建 `CheckboxCell` 和 `CheckboxAllCell` 组件，分别用于 `customCell` 和 `customHeaderCell`。

<demo vue="advanced/custom-cells/CheckboxCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/index.vue"></demo>

### 使用第三方组件

可以通过 `checkboxComponent` 传入 UI 库的 Checkbox 组件，以保持项目整体样式统一。

<demo vue="advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue"></demo>

### createCheckboxCell 选项

`createCheckboxCell` 工厂函数接受一个配置对象：

```ts
interface createCheckboxCellOptions<T = any> {
    /** 行数据中表示选中状态的字段名，默认 '_isChecked' */
    field?: string;
    /** 自定义 checkbox 组件（如 Element Plus / Ant Design Vue 的 Checkbox） */
    checkboxComponent?: any;
    /** 单元格 checkbox 状态变更回调 */
    onChange?: (checked: boolean, row: T) => void;
    /** 全选 checkbox 状态变更回调 */
    onSelectAll?: (checked: boolean) => void;
}
```

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| field | `string` | `'_isChecked'` | 行数据中表示选中状态的字段名 |
| checkboxComponent | `Component` | - | 自定义 checkbox 组件，不传则使用原生 input[type=checkbox] |
| onChange | `(checked, row) => void` | - | 单元格 checkbox 状态变更回调 |
| onSelectAll | `(checked) => void` | - | 全选 checkbox 状态变更回调 |
