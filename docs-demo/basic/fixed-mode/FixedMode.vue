<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import RangeInput from '../../components/RangeInput.vue';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();

const width = ref(50);
const columns: StkTableColumn<any>[] = [
    { dataIndex: 'id', title: t('id') + '(100px)', width: '100px' },
    { dataIndex: 'name', title: t('name') },
    { dataIndex: 'address', title: t('address') },
];
const data = new Array(200).fill(0).map((it, index) => {
    return { id: index, name: 'Jack', address: 'Beijing' };
});
</script>

<template>
    <div>
        <RangeInput v-model="width" min="0" max="100" :label="t('width')" suffix="%"></RangeInput>
        <StkTable
            style="height: 150px"
            row-key="id"
            virtual
            fixed-mode
            :width="width + '%'"
            :columns="columns"
            :data-source="data"
        ></StkTable>
        <div>headless</div>
        <StkTable
            style="height: 140px"
            row-key="id"
            virtual
            fixed-mode
            headless
            :width="width + '%'"
            :columns="columns"
            :data-source="data"
        ></StkTable>
    </div>
</template>
