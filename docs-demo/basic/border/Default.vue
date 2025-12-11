<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();

const columns: StkTableColumn<any>[] = [
    { title: t('name'), dataIndex: 'name' },
    { title: t('age'), dataIndex: 'age' },
    { title: t('address'), dataIndex: 'address' },
    { title: t('gender'), dataIndex: 'gender' },
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
        <header>bordered=true</header>
        <StkTable bordered :columns="columns" :data-source="dataSource"></StkTable>
    </article>
    <article>
        <header>bordered=false</header>
        <StkTable :bordered="false" :columns="columns" :data-source="dataSource"></StkTable>
    </article>
    <article>
        <header>bordered="h"</header>
        <StkTable bordered="h" :columns="columns" :data-source="dataSource"></StkTable>
    </article>
    <article>
        <header>bordered="v"</header>
        <StkTable bordered="v" :columns="columns" :data-source="dataSource"></StkTable>
    </article>
    <article>
        <header>bordered="body-v"</header>
        <StkTable bordered="body-v" :columns="columns" :data-source="dataSource"></StkTable>
    </article>
    <article>
        <header>bordered="body-h"</header>
        <StkTable bordered="body-h" :columns="columns" :data-source="dataSource"></StkTable>
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
