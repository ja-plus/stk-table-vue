# Start

## Try Online Editor

[<span style="font-size: 16px;font-weight: bold;">Online Editing Example</span>](https://stackblitz.com/edit/vitejs-vite-ad91hh?file=src%2FDemo%2Findex.vue)

## npm Installation

```sh
$ npm install stk-table-vue
```

## Import

main
```ts
import 'stk-table-vue/lib/style.css';
```

Import when using vue SFC, beneficial for ts recognition.
```vue
<script lang="ts" setup>
import { StkTable } from 'stk-table-vue';
</script>
<template>
    <StkTable></StkTable>
</template>
```

## Simple Demo
```vue
<script lang="ts" setup>
import { ref, useTemplateRef, onMounted, onBeforeUnmount } from 'vue';
import StkTable from '../StkTable.vue';
import { StkTableColumn } from '../../src/StkTable/index';

const stkTableRef = useTemplateRef('stkTableRef'); // vue3.5+
// const stkTableRef = ref<InstanceType<typeof StkTable>>(); //vue3.2

type DataType = {
    id: string;
    name: string;
    age: number;
};
const columns: StkTableColumn<DataType>[] = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
];
const dataSource: DataType[] = [
    { id: 'k1', name: 'Zhang San', age: 18 },
    { id: 'k2', name: 'Li Si', age: 19 },
    { id: 'k3', name: 'Wang Wu', age: 20 },
];
let interval = 0;
onMounted(() => {
    // Highlight specified id row
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

Running Result
<demo vue="start/Start.vue"></demo>


