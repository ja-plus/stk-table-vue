# CheckboxCell 多选框 <Badge type="tip" text="^1.0.0" />

CheckboxCell 是一个内置的多选框单元格组件，支持单元格级别的全选/半选功能。

### 基础使用

通过 `createCheckboxCell` 工厂函数创建 `CheckboxCell` 和 `CheckboxAllCell` 组件，分别用于 `customCell` 和 `customHeaderCell`。

<demo vue="advanced/custom-cells/CheckboxCell/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/index.vue"></demo>

### 使用第三方组件

可以通过 `checkboxComponent` 传入 UI 库的 Checkbox 组件，以保持项目整体样式统一。

<demo vue="advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/CheckboxComponentCell.vue"></demo>

### 树形勾选级联 <Badge type="tip" text="^1.2.8" />

树形数据（`children`）下配置 `cascade: true` 开启勾选级联（父子联动 + 半选）：

- 勾选父行会递归勾选/取消其全部子孙行；
- 父行勾选态由子孙推导：全部子孙勾选才视为勾选，部分勾选时父行显示半选态；
- 表头全选/半选按叶子行（无 `children` 的行）统计，父行不重复计数；懒加载（`treeConfig.lazy`）下未加载的行天然按叶子计。

<demo vue="advanced/custom-cells/CheckboxCell/CheckboxCascadeCell.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/advanced/custom-cells/CheckboxCell/CheckboxCascadeCell.vue"></demo>

::: tip 说明
- `cascade` 默认关闭，各行勾选状态相互独立（向后兼容）。
- `onChange` 收到的是用户实际点击的行，级联写入的行不单独回调。
- 级联状态由组件写入行数据（`field` 字段）；直接改 `row[field]` 会绕过祖先推导，请通过勾选交互维护状态。
:::

### createCheckboxCell 选项

`createCheckboxCell` 工厂函数接受一个配置对象：

```ts
interface createCheckboxCellOptions<T = any> {
    /** 行数据中表示选中状态的字段名，默认 '_isChecked' */
    field?: string;
    /** 自定义 checkbox 组件（如 Element Plus / Ant Design Vue 的 Checkbox） */
    checkboxComponent?: any;
    /** 树形数据（children）下开启勾选级联（父子联动 + 半选），默认 false */
    cascade?: boolean;
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
| cascade | `boolean` | `false` | 树形数据下开启勾选级联（父子联动 + 半选），详见[树形勾选级联](#树形勾选级联) |
| onChange | `(checked, row) => void` | - | 单元格 checkbox 状态变更回调 |
| onSelectAll | `(checked) => void` | - | 全选 checkbox 状态变更回调 |
