<script lang="ts" setup>
import { StkTableColumn } from '@/StkTable/index';
import { computed, ref } from 'vue';
import StkTable from '../../StkTable.vue';
import RadioGroup from '../components/RadioGroup.vue';

type Data = {
    name: string;
};
const align = ref('left');
const headerAlign = ref('center');

const columns = computed(() => {
    return [
        { type: 'seq', title: 'No.', dataIndex: '' as any, width: 50 },
        { title: 'Name', dataIndex: 'name', align: align.value, headerAlign: headerAlign.value },
    ] as StkTableColumn<Data>[];
});

const dataSource = ref<Data[]>([{ name: 'John Brown' }, { name: 'Jim Green' }, { name: 'Joe Black' }, { name: 'Jim Red' }]);
</script>
<template>
    <RadioGroup
        v-model="align"
        text="align"
        :options="[
            { label: 'left', value: 'left' },
            { label: 'center', value: 'center' },
            { label: 'right', value: 'right' },
        ]"
    ></RadioGroup>
    <RadioGroup
        v-model="headerAlign"
        text="headerAlign"
        :options="[
            { label: 'left', value: 'left' },
            { label: 'center', value: 'center' },
            { label: 'right', value: 'right' },
        ]"
    ></RadioGroup>
    <StkTable row-key="name" :columns="columns" :data-source="dataSource"></StkTable>
</template>
