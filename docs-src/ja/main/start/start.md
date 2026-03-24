# クイックスタート

## オンラインエディタで試す

[<span style="font-size: 16px;font-weight: bold;">オンライン編集例</span>](https://stackblitz.com/edit/vitejs-vite-ad91hh?file=src%2FDemo%2Findex.vue)

## npm インストール

```sh
$ npm install stk-table-vue
```

## インポート

main
```ts
import 'stk-table-vue/lib/style.css';
```

vue SFCを使用する場合はインポート（ts認識に有利）
```vue
<script lang="ts" setup>
import { StkTable } from 'stk-table-vue';
</script>
<template>
    <StkTable></StkTable>
</template>
```

## シンプルなデモ
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
    { title: '名前', dataIndex: 'name', key: 'name' },
    { title: '年齢', dataIndex: 'age', key: 'age' },
];
const dataSource: DataType[] = [
    { id: 'k1', name: '田中', age: 18 },
    { id: 'k2', name: '佐藤', age: 19 },
    { id: 'k3', name: '鈴木', age: 20 },
];
let interval = 0;
onMounted(() => {
    // 指定したidの行をハイライト
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

実行結果
<demo vue="start/Start.vue"></demo>
