<script setup lang="ts">
import StkTable from '../../StkTable.vue';
import { columns } from './columns';
import { DataType } from './types';
import { shallowRef } from 'vue';
import { mockData } from './mockData';
import mockjs from 'mockjs';
const { Random } = mockjs;

const dataSource = shallowRef<DataType[]>(
    [mockData as any].concat(
        new Array(50000).fill(null).map(() => {
            return {
                ...mockData,
                code: Random.guid(),
                lastPrice: Random.float(1, 20, 2, 2),
                cbOfrBp: Random.float(0, 10, 2, 2),
                bestBuyPrice: Random.float(0, 10, 2, 2),
                bestSellPrice: Random.float(0, 10, 2, 2),
            };
        }),
    ),
);
</script>
<template>
    <StkTable
        style="height: 700px"
        row-key="code"
        no-data-full
        fixed-col-shadow
        virtual
        virtual-x
        show-overflow
        show-header-overflow
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
<style scoped>
:deep(.blue-cell) {
    color: #4f8df4;
}
:deep(.red-cell) {
    color: #ff2b48;
}
:deep(.green-cell) {
    color: #2fc87b;
}
</style>
