# 表尾汇总行 <Badge type="tip" text="^0.11.0" />

* `props.footerData` 配置表尾汇总行数据。
* `props.footerConfig` 配置表尾位置和行为。

`footerData` 是一个数组，每个元素代表一行表尾数据。数据结构与 `dataSource` 类似，字段名对应列的 dataIndex。

## 基础用法

传入 `props.footerData`即可：
```tsx
<script lang="ts" setup>
const footerData = ref<Data[]>([
    { name: '总计', age: 84, salary: 26000, bonus: 7000, },
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


## 吸附在顶部

将表尾锚定在表格顶部：

```tsx
<StkTable
    :footer-data="footerData"
    :footer-config="{ position: 'top' }" //[!code ++]
></StkTable>
```

<demo vue="basic/footer/FooterTop.vue"></demo>

## 多行表头支持

表尾能够正确地定位在多行表头下方：

<demo vue="basic/footer/FooterMultiHeader.vue"></demo>

## API

### FooterConfig

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| position | `'bottom'` \| `'top'` | `'bottom'` | 表尾锚定位置 |

### FooterData

一个数组，每个元素代表一行表尾数据。数据结构应与列定义匹配。