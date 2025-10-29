# 多选框
## 概述

StkTable 组件本身**没有内置的多选框功能**，但可以通过 `customCell` 和 `customHeaderCell` 配置项来自定义实现多选框功能。这种方式非常灵活，可以满足不同的业务需求。
## 示例

<demo vue="basic/checkbox/Checkbox.vue" />


## 实现原理

实现多选框功能主要涉及两个部分：

1. **表头复选框**：通过 `customHeaderCell` 在表头单元格渲染一个复选框，实现全选/取消全选功能
2. **行内复选框**：通过 `customCell` 在每行数据单元格渲染一个复选框，实现单行选择功能

## 代码实现

在 columns 配置中添加一个自定义列，用于显示复选框：

```javascript
{
  customHeaderCell: () => {
    return h('input', {
      type: 'checkbox',
      checked: isCheckAll.value,
      indeterminate: isCheckPartial.value,
      onChange: (e: Event) => {
        const checked = (e.target as HTMLInputElement).checked;
        dataSource.value.forEach(item => {
          item.isChecked = checked;
        });
      }
    });
  },
  // 自定义单元格
  customCell: ({ row }) => {
    return h('input', {
      type: 'checkbox',
      checked: row.isChecked,
      onChange: (e: Event) => {
        row.isChecked = (e.target as HTMLInputElement).checked;
      }
    });
  }
}
```

您可以根据项目中使用的vue组件库(Element Plus, Ant Design Vue, Naive UI,等)中的`Select`组件来实现多选框功能, 以保持项目整体样式统一。
