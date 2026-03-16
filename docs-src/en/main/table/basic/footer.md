# Footer Summary Row <Badge type="tip" text="^0.11.0" />

* `props.footerData` Configure footer summary row data.
* `props.footerConfig` Configure footer position and behavior.

`footerData` is an array where each element represents a footer row. The data structure is similar to `dataSource`, with field names corresponding to column's dataIndex.

## Basic Usage

Pass `props.footerData` directly:
```tsx
<script lang="ts" setup>
const footerData = ref<Data[]>([
    { name: 'Total', age: 84, salary: 26000, bonus: 7000, },
]);
</script>
<template>
    <StkTable
        row-key="name"
        :columns="columns"
        :data-source="dataSource"
        :footer-data="footerData" //[!code ++]
    ></StkTable>
</template>
```

<demo vue="basic/footer/Footer.vue"></demo>

## Anchor to Top

Anchor the footer to the top of the table:

```tsx
<StkTable
    :footer-data="footerData"
    :footer-config="{ position: 'top' }" //[!code ++]
></StkTable>
```

<demo vue="basic/footer/FooterTop.vue"></demo>

## Multi-row Header Support

The footer correctly positions itself below multi-row headers:

<demo vue="basic/footer/FooterMultiHeader.vue"></demo>

## API

### FooterConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| position | `'bottom'` \| `'top'` | `'bottom'` | Footer  anchor position |

### FooterData

An array where each element represents a footer row. The data structure should match the column definitions.
