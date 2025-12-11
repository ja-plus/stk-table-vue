<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '@/StkTable/index';
import CheckItem from '../../components/CheckItem.vue';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();
const rowByRow = ref<boolean | 'scrollbar'>(true);

const columns: StkTableColumn<any>[] = [
    { type: 'seq', width: 50, dataIndex: '', title: t('seq') },
    { title: t('name'), dataIndex: 'name', width: 100, sorter: true },
    { title: t('age'), dataIndex: 'age', width: 100, sorter: true },
    { title: t('gender'), dataIndex: 'gender', width: 100, sorter: true },
    { title: t('address'), dataIndex: 'address', sorter: true },
];

const dataSource = new Array(1000).fill(0).map((_, index) => {
    return {
        name: `Jack ${index}`,
        age: 18 + index,
        address: `Beijing Forbidden City ${index}`,
        gender: index % 2 === 0 ? 'male' : 'female',
    };
});

function onlyScrollbarChange(checked: boolean) {
    if (checked) {
        rowByRow.value = 'scrollbar';
    } else {
        rowByRow.value = false;
    }
}
</script>
<template>
    <div>
        <CheckItem :model-value="true" text="scroll-row-by-row" @change="v => (rowByRow = v)" />
        <CheckItem text="仅拖动滚动条触发|Only drag scrollbar" @change="onlyScrollbarChange" />
        <StkTable
            style="height: 200px"
            :scroll-row-by-row="rowByRow"
            virtual
            :row-height="30"
            :header-row-height="68"
            :columns="columns"
            :data-source="dataSource"
        ></StkTable>
    </div>
</template>
