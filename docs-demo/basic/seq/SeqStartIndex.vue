<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();

const columns: StkTableColumn<any>[] = [
    { type: 'seq', width: 50, dataIndex: '', title: t('seq') },
    { title: t('name'), dataIndex: 'name', sorter: true },
    { title: t('age'), dataIndex: 'age', sorter: true },
    { title: t('address'), dataIndex: 'address', sorter: true },
    { title: t('gender'), dataIndex: 'gender', sorter: true },
];

const dataSource = ref(
    new Array(100).fill(0).map((_, index) => {
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
    <StkTable
        style="height: 200px"
        :seq-config="{ startIndex: 10 }"
        :columns="columns"
        virtual
        :data-source="dataSource"
    ></StkTable>
</template>
