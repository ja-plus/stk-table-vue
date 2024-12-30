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
                // 1-6 interger random,
                source: Random.integer(1, 6),
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
<style scoped lang="less">
:deep(.blue-cell) {
    color: #4f8df4;
}
:deep(.red-cell) {
    color: #ff2b48;
}
:deep(.green-cell) {
    color: #2fc87b;
}
:deep(.source-cell) {
    border-radius: 4px;
    background-color: #777;
    display: inline-block;
    padding: 0 8px;
    font-size: 14px;
    line-height: 20px;
    &.source-1 {
        background-color: rgba(39, 69, 159, 0.4);
    }
    &.source-2 {
        background-color: rgba(171, 99, 0, 0.4);
    }
    &.source-3 {
        background-color: rgba(0, 119, 143, 0.4);
    }
    &.source-4 {
        background-color: rgba(171, 28, 0, 0.4);
    }
    &.source-5 {
        background-color: rgba(199, 166, 0, 0.4);
    }
    &.source-6 {
        background-color: rgba(113, 23, 204, 0.4);
    }
}
</style>
