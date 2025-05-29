<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';

const columns: StkTableColumn<any>[] = [
    { type: 'tree-node', title: 'Area', dataIndex: 'area' },
    { title: 'GDP', dataIndex: 'gdp', align: 'right' },
    { title: 'Population', dataIndex: 'population', align: 'right' },
    { title: 'GDP per capita', dataIndex: 'gdpPerCapita', align: 'right' },
];

const dataSource = ref([
    {
        area: 'Asia',
        gdp: 10000,
        population: 50000000,
        gdpPerCapita: 20000,
        children: [
            {
                area: 'China',
                gdp: 5000,
                population: 1400000000,
                gdpPerCapita: 35000,
                children: [
                    { area: 'Beijing', gdp: 2000, population: 21000000, gdpPerCapita: 9000 },
                    { area: 'Shanghai', gdp: 3000, population: 24000000, gdpPerCapita: 12000 },
                    { area: 'Guangzhou', gdp: 4000, population: 23000000, gdpPerCapita: 11000 },
                ],
            },
            {
                area: 'Japan',
                gdp: 4000,
                population: 126000000,
                gdpPerCapita: 33000,
                children: [{ area: 'Tokyo', gdp: 1000, population: 13900000, gdpPerCapita: 7000 }],
            },
            {
                area: 'Korea',
                gdp: 3000,
                population: 51000000,
            },
        ],
    },
    { area: 'Europe', gdp: 8000, population: 740000000 },
    { area: 'Africa', gdp: 6000, population: 1010000000 },
    { area: 'North America', gdp: 5000, population: 301000000 },
    { area: 'South America', gdp: 4000, population: 421000000 },
    { area: 'Australia', gdp: 3000, population: 251000000 },
]);
</script>
<template>
    <StkTable
        style="max-height: 300px"
        :tree-config="{
            defaultExpandAll: true,
        }"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
