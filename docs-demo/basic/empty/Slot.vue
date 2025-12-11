<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import NoData from '../../assets/svg-components/NoData.vue';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();

const columns: StkTableColumn<any>[] = [
    { title: t('name'), dataIndex: 'name' },
    { title: t('age'), dataIndex: 'age' },
    { title: t('address'), dataIndex: 'address' },
    { title: t('gender'), dataIndex: 'gender' },
];

const dataSource = ref([]);
</script>
<template>
    <StkTable :columns="columns" :data-source="dataSource">
        <template #empty>
            <div style="padding: 20px; display: flex; flex-direction: column; align-items: center">
                <NoData />
                <p>{{ t('noData') }} <a href="#" style="color: #1890ff">{{ t('clickHere') }}</a></p>
            </div>
        </template>
    </StkTable>
</template>
