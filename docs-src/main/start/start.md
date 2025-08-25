# 开始

## 在线编辑器尝试

[<span style="font-size: 16px;font-weight: bold;">在线编辑示例</span>](https://stackblitz.com/edit/vitejs-vite-ad91hh?file=src%2FDemo%2Findex.vue)

## npm 安装

```sh
$ npm install stk-table-vue
```

## 引入

main
```ts
import 'stk-table-vue/lib/style.css';
```

vue SFC 使用的时候引入，利于ts识别。
```vue
<script lang="ts" setup>
import { StkTable } from 'stk-table-vue';
</script>
<template>
    <StkTable></StkTable>
</template>
```

## 简单demo
```vue
<script lang="ts" setup>
import { useTemplateRef, onMounted, onBeforeUnmount } from 'vue';
import StkTable from '../StkTable.vue';
import { StkTableColumn } from '../../src/StkTable/index';

const stkTableRef = useTemplateRef('stkTableRef'); // vue3.5+
// const stkTableRef = ref<InstanceType<typeof StkTable>>(); //vue3.2

type DataType = {
    id: string;
    name: string;
    age: number;
    address: string;
};
const columns: StkTableColumn<DataType>[] = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age', align: 'right' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
];
const dataSource: DataType[] = [
    { id: 'k1', name: 'Tom', age: 18, address: 'Beijing' },
    { id: 'k2', name: 'Jerry', age: 19, address: 'Shanghai' },
    { id: 'k3', name: 'Jack', age: 20, address: 'London' },
    { id: 'k4', name: 'Rose', age: 22, address: 'New York' },
];
let interval = 0;
onMounted(() => {
    interval = window.setInterval(() => {
        stkTableRef.value?.setHighlightDimRow(['k1']);
    }, 2000);
});

onBeforeUnmount(() => {
    window.clearInterval(interval);
});
</script>
<template>
    <StkTable ref="stkTableRef" row-key="id" :columns="columns" :data-source="dataSource"></StkTable>
</template>
```

运行结果
<demo vue="start/Start.vue"></demo>


