# Introduce
`stk-table-vue` (stk: sticky) is a **high-performance** virtual list based on `sticky`, `vue`, and `DOM`. It is suitable for dynamic data display scenarios.


## Why stk-table-vue was Created
The reason for creating this component dates back to around 2022 when I received a requirement to display dynamic data on the web. At that time, after briefly researching some popular table components, I found none that perfectly matched this business scenario, so I decided to implement my own.
Initially, I only implemented a basic virtual list. After nearly three years of revisions, I realized it had gradually acquired the basic functionality of a table, so I decided to open-source it.

After the initial research on popular tables, I confirmed the general direction:
1. **Performance First.** Performance is the primary goal. Some usage methods and API designs of the component may compromise to performance because dynamic data display requires as high performance as possible.

2. **Package Size Control.** Implement table functionality in as few and simple ways as possible.

3. **DOM-based.** Being DOM-based facilitates seamless integration with Vue component libraries. Moreover, I have great confidence in DOM performance. After considering various costs, I abandoned the canvas implementation.

4. **Using CSS sticky for Fixed Columns and Headers.** This solution significantly reduces the code volume compared to covering another table for fixed headers and columns.
It also happens to implement sticky for fixed columns, a brand new interaction. [Try it out](/en/main/table/basic/fixed.html#Virtual%20List%20Column%20Fixing).

5. **Declarative Custom Slots.** Borrowed from `ant-design-vue` table's custom cell approach, which is much more elegant than using custom cells via `#slot` in `<template>`.

6. **Built-in Highlighting.** Uses animation API to implement highlighting animations without third-party library dependencies.

7. **Using table Tag.** Some components use `div` to render tables for better performance. However, implementing default `<table>` functionalities like layout, copying, and printing would require a lot of additional code, which is not conducive to package size control.
In terms of performance, subjectively, there's not much difference between div and table implementations.



## Customizable stk-table-vue
Many basic table functionalities may not be comprehensive, but there's ample room for **secondary development**, and some features can be implemented by yourself.
* For example, the header click `filter` function.

    Regarding the `filter` function, considering that in actual development, different projects use different component libraries and styles, providing a built-in filter function might: 1. affect the overall style; 2. have a negative impact on package size control. Therefore, it hasn't been implemented yet.

* Sorting cannot click individual arrows.
    
    This can also be achieved by customizing header cells.

* Styles can be changed via CSS variables under the `.stk-table` selector.



## Standing on the Shoulders of Giants
Some designs and APIs of the component refer to excellent projects like `vxe-table`, `ant-design-vue`, and `navie-ui`. I would like to express my gratitude here.



