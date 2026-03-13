# Footer Summary Row <Badge type="tip" text="^0.11.0" />

* `props.footerData` Configure footer summary row data.

`footerData` is an array where each element represents a footer row. The data structure is similar to `dataSource`, with field names corresponding to columns.

## Basic Usage

The simplest usage is to directly pass footer data:

```tsx
<script lang="ts" setup>

const footerData = ref<Data[]>([
    { name: 'Total', age: 84, salary: 26000, bonus: 7000, },
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
