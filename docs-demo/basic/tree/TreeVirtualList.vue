<script lang="ts" setup>
import { StkTableColumn } from '@/StkTable';
import StkTable from '../../StkTable.vue';
import { getDataSource2 } from './config';
import { shallowRef, useTemplateRef } from 'vue';
import { useI18n } from '../../hooks/useI18n';
const stkTableRef = useTemplateRef('stkTableRef');
const { t } = useI18n();

const columns: StkTableColumn<any>[] = [
    { type: 'tree-node', title: t('area'), dataIndex: 'area', width: 200 },
    { title: t('gdp'), dataIndex: 'gdp', align: 'right', width: 100, sorter: true, sortType: 'number' },
    { title: t('population'), dataIndex: 'population', align: 'right', width: 100, sorter: true, sortType: 'number' },
    { title: t('gdpPerCapita'), dataIndex: 'gdpPerCapita', align: 'right', width: 200, sorter: true, sortType: 'number' },
];
const dataSource = shallowRef(getDataSource2());

function updateArea0() {
    const dataSourceTemp = dataSource.value.slice();
    Object.assign(dataSourceTemp[0], {
        gdp: Math.round(Math.random() * 100000),
        population: Math.round(Math.random() * 10000000),
        gdpPerCapita: Math.round(Math.random() * 200000),
    });
    dataSource.value = dataSourceTemp;

    stkTableRef.value?.setHighlightDimRow(dataSourceTemp[0].area);
}

function updateArea0_0() {
    const dataSourceTemp = dataSource.value.slice();
    const area1_0 = dataSourceTemp[0].children[0];
    Object.assign(area1_0, {
        gdp: Math.round(Math.random() * 100000),
        population: Math.round(Math.random() * 10000000),
        gdpPerCapita: Math.round(Math.random() * 200000),
    });
    dataSource.value = dataSourceTemp;

    stkTableRef.value?.setHighlightDimRow([area1_0.area]);
}

function updateArea0_1Cell() {
    const dataSourceTemp = dataSource.value.slice();
    const area0_1 = dataSourceTemp[0].children[1];
    area0_1.gdp = Math.round(Math.random() * 100000);
    dataSource.value = dataSourceTemp;

    stkTableRef.value?.setHighlightDimCell(area0_1.area, 'gdp');
}
</script>
<template>
    <button class="btn" @click="updateArea0">update Area0</button>
    <button class="btn" @click="updateArea0_0">update Area0-0</button>
    <button class="btn" @click="updateArea0_1Cell">update Area0-1 gdp</button>
    <StkTable
        ref="stkTableRef"
        style="height: 200px"
        row-key="area"
        virtual
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
