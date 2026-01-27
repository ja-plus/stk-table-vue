<script lang="ts" setup>
import { StkTableColumn } from '@/StkTable/index';
import { computed, ref } from 'vue';
import StkTable from '../../StkTable.vue';
import RadioGroup from '../../components/RadioGroup.vue';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();

type Data = {
    name: string;
};
const align = ref('left');
const headerAlign = ref('center');

const columns = computed(() => {
    return [
        { type: 'seq', title: t('seq'), dataIndex: '' as any, width: 50 },
        { title: t('name'), dataIndex: 'name', align: align.value, headerAlign: headerAlign.value },
    ] as StkTableColumn<Data>[];
});

const dataSource = ref<Data[]>([
    { name: 'John Brown' },
    { name: 'Jim Green' },
    { name: 'Joe Black' },
    { name: 'Jim Red' },
]);
</script>
<template>
    <RadioGroup
        v-model="headerAlign"
        :text="t('headerAlign')"
        :options="[
            { label: 'left', value: 'left' },
            { label: 'center', value: 'center' },
            { label: 'right', value: 'right' },
        ]"
    ></RadioGroup>
    <RadioGroup
        v-model="align"
        :text="t('align')"
        :options="[
            { label: 'left', value: 'left' },
            { label: 'center', value: 'center' },
            { label: 'right', value: 'right' },
        ]"
    ></RadioGroup>
    <StkTable row-key="name" :columns="columns" :data-source="dataSource"></StkTable>
</template>
