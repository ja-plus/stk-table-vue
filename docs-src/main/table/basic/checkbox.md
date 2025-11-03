# 多选框
## 概述

StkTable 组件本身**没有内置的多选框功能**，但可以通过 `customCell` 和 `customHeaderCell` 配置项来自定义实现多选框功能。这种方式非常灵活，可以满足不同的业务需求。
## 示例

<demo vue="basic/checkbox/Checkbox.vue" />

## 代码实现

在 columns 配置中添加一个自定义列，用于显示复选框：

```javascript
{
    customHeaderCell: () => {
        return h('span', [
            h('input', {
                type: 'checkbox',
                style: 'vertical-align:middle',
                checked: isCheckAll.value,
                indeterminate: isCheckPartial.value,
                onChange: (e: Event) => {
                    const checked = (e.target as HTMLInputElement).checked;
                    dataSource.value.forEach(item => {
                        item._isChecked = checked;
                    });
                },
            }),
        ]);
    },
    customCell: ({ row }) => {
        return h('div', { style: 'display:flex;align-items:center;justify-content:center' }, [
            h('input', {
                type: 'checkbox',
                checked: row._isChecked,
                onChange: (e: Event) => {
                    row._isChecked = (e.target as HTMLInputElement).checked;
                },
            }),
        ]);
    },
}
```
input元素外面加一层父元素，为了垂直居中。

您可以根据项目中使用的vue组件库(Element Plus, Ant Design Vue, Naive UI,等)中的`Checkbox`组件来替代`input`实现多选框, 以保持项目整体样式统一。
