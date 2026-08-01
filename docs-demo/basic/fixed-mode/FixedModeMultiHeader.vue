<script setup lang="ts">
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { useI18n } from '../../hooks/useI18n/index';
import RangeInput from '../../components/RangeInput.vue';
import { ref } from 'vue';

const { t } = useI18n();
const width = ref(50);

const columns: StkTableColumn<any>[] = [
    { title: t('id') + '(70px)', dataIndex: 'id', width: 70 },
    {
        title: t('basic'),
        dataIndex: 'basic',
        // width: 300, // Not allowed
        children: [
            { title: t('name') + '(120px)', dataIndex: 'name', width: 120 },
            { title: t('age'), dataIndex: 'age' },
            { title: t('gender'), dataIndex: 'gender' },
        ],
    },
];
const data = new Array(200).fill(0).map((it, index) => {
    return { id: index, name: 'Jack', age: index, gender: index % 2 ? 'male' : 'female' };
});
</script>

<template>
    <RangeInput v-model="width" min="0" max="100" :label="t('width')" suffix="%"></RangeInput>
    <StkTable
        style="height: 200px"
        :width="width + '%'"
        row-key="id"
        virtual
        fixed-mode
        :columns="columns"
        :data-source="data"
    ></StkTable>
</template>
