<script lang="ts" setup>
import { ref } from 'vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import StkTable from '../../StkTable.vue';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();

const columns: StkTableColumn<any>[] = [
    { title: t('name'), dataIndex: 'name' },
    { title: t('age'), dataIndex: 'age' },
    { title: t('address'), dataIndex: 'address' },
    { title: t('gender'), dataIndex: 'gender' },
];
const noDataFull = ref(true);
</script>
<template>
    <label>
        <input v-model="noDataFull" type="checkbox" />
        <span>{{ t('noDataFull') }}</span>
    </label>
    <StkTable
        style="height: 200px"
        :no-data-full="noDataFull"
        :columns="columns"
        :data-source="[]"
    ></StkTable>
</template>
