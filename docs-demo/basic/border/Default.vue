<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';

const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Address', dataIndex: 'address' },
    { title: 'Gender', dataIndex: 'gender' },
];

const dataSource = ref(
    new Array(3).fill(0).map((_, index) => {
        return {
            name: `Jack ${index}`,
            age: 18 + index,
            address: `Beijing Forbidden City ${index}`,
            gender: index % 2 === 0 ? 'male' : 'female',
        };
    }),
);
</script>
<template>
    <article>
        <header>bordered</header>
        <StkTable bordered :columns="columns" :data-source="dataSource"></StkTable>
    </article>
    <article>
        <header>bordered=false - 没有分割线</header>
        <StkTable :bordered="false" :columns="columns" :data-source="dataSource"></StkTable>
    </article>
    <article>
        <header>bordered="h"- 仅横线</header>
        <StkTable bordered="h" :columns="columns" :data-source="dataSource"></StkTable>
    </article>
    <article>
        <header>bordered="v" - 仅竖线</header>
        <StkTable bordered="v" :columns="columns" :data-source="dataSource"></StkTable>
    </article>
    <article>
        <header>bordered="body-v" - 表头横竖线，表体仅竖线</header>
        <StkTable bordered="body-v" :columns="columns" :data-source="dataSource"></StkTable>
    </article>
</template>

<style scoped>
article {
    border: 1px solid var(--vp-c-border);
    border-radius: 5px;
    padding: 8px;
    margin-bottom: 8px;
}
.stk-table {
    /* height: 100px; */
}
</style>
