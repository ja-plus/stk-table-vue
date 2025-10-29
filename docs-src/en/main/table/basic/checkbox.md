# Checkbox
## Overview

The StkTable component **does not have built-in checkbox functionality**, but you can implement it through the `customCell` and `customHeaderCell` configuration options. This approach is very flexible and can meet different business requirements.
## Example

<demo vue="basic/checkbox/Checkbox.vue" />


## Implementation Principle

Implementing checkbox functionality mainly involves two parts:

1. **Header Checkbox**: Render a checkbox in the header cell through `customHeaderCell` to implement select all/deselect all functionality
2. **Row Checkbox**: Render a checkbox in each row's data cell through `customCell` to implement single row selection functionality

## Code Implementation

Add a custom column to the columns configuration to display checkboxes:

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
  // Custom cell
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

You can implement the checkbox functionality using the `Select` component from the Vue component library used in your project (Element Plus, Ant Design Vue, Naive UI, etc.) to maintain a consistent style throughout the project.