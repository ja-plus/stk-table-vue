# Checkbox
## Overview

The StkTable component **does not have built-in checkbox functionality**, but you can implement it through the `customCell` and `customHeaderCell` configuration options. This approach is very flexible and can meet different business requirements.
## Example

<demo vue="basic/checkbox/Checkbox.vue" />


## Code Implementation

Add a custom column to the columns configuration to display checkboxes:

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
                    item.isChecked = checked;
                });
            },
        }),
    ]);
  },
  customCell: ({ row }) => {
    return h('div', { style: 'display:flex;align-items:center;justify-content:center' }, [
        h('input', {
            type: 'checkbox',
            checked: row.isChecked,
            onChange: (e: Event) => {
                row.isChecked = (e.target as HTMLInputElement).checked;
            },
        }),
    ]);
  },
}
```
Wrap the input element in a parent element for vertical centering.

You can replace the `input` with the `Checkbox` component from the Vue component library used in your project (Element Plus, Ant Design Vue, Naive UI, etc.) to maintain a consistent style throughout the project.