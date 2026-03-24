# 基本

* `props.columns` で列を設定します。
* `props.dataSource` でデータソースを設定します。
* `props.rowKey` で一意の行識別子を設定します。
* css スタイルでテーブル高さを設定します。

```vue
<script lang="ts" setup>
import { ref } from 'vue';
import { StkTable } from 'stk-table-vue';
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';

type Data = {
    name: string;
    age: number;
    address: string;
    gender: 'male' | 'female';
};

const columns: StkTableColumn<Data>[] = [
    { type: 'seq', title: 'No.', dataIndex: '' as any, width: 50 },
    { title: '名前', dataIndex: 'name' },
    { title: '年齢', dataIndex: 'age', headerAlign: 'right', align: 'right' },
    { title: '性別', dataIndex: 'gender', align: 'center' },
    { title: '住所', dataIndex: 'address' },
];

const dataSource = ref<Data[]>([
    { name: `田中`, age: 18, address: `東京都渋谷区`, gender: 'male' },
    { name: `佐藤`, age: 20, address: `大阪府大阪市`, gender: 'male' },
    { name: `高橋`, age: 22, address: `愛知県名古屋市`, gender: 'female' },
    { name: `伊藤`, age: 24, address: `福岡県福岡市`, gender: 'female' },
]);
</script>
<template>
    <StkTable style="height: 200px" row-key="name" :columns="columns" :data-source="dataSource"></StkTable>
</template>
```

<demo vue="basic/Basic.vue"></demo>
