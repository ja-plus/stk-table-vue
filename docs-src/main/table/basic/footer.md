# 表尾数据 <Badge type="tip" text="^0.11.0" />

* `props.footerData` 配置表格底部合计行数据。

`footerData` 是一个数组，每个元素代表一行合计数据。数据结构与 `dataSource` 类似，通过字段名与列对应。

## 基础用法

最简单的用法是直接传入合计数据：

```tsx
<script lang="ts" setup>

const footerData = ref<Data[]>([
    { name: '总计', age: 84, salary: 26000, bonus: 7000, },
]);
</script>
<template>
    <StkTable
        style="height: 300px"
        row-key="name"
        :columns="columns"
        :data-source="dataSource"
        :footer-data="footerData" //[!code ++]
    ></StkTable>
</template>
```

<demo vue="basic/footer/Footer.vue"></demo>

