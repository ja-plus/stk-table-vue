<script setup lang="ts">
import mockjs from 'mockjs';
import { shallowRef, ref, onBeforeUnmount } from 'vue';
import StkTable from '../../StkTable.vue';
import { columns as columnsRaw } from './columns';
import { emitter } from './event';
import { mockData } from './mockData';
import { DataType } from './types';

const { Random } = mockjs;
emitter.on('toggle-expand', handleToggleExpand);

const columns = ref(columnsRaw);
const dataSource = shallowRef<DataType[]>(
    new Array(50000).fill(null).map((_, index) => {
        return {
            ...mockData,
            code: 'id' + String(index).padStart(6, '0'),
            // 1-6 interger random,
            bestBuyVol: Random.integer(1, 6) * 1000,
            bestSellVol: Random.integer(1, 6) * 1000,
            source: Random.integer(1, 6),
            lastPrice: Random.float(1, 20, 4, 4),
            cbOfrBp: Random.float(0, 10, 4, 4),
            bestBuyPrice: Random.float(0, 10, 4, 4),
            bestSellPrice: Random.float(0, 10, 4, 4),
        } as any;
    }),
);

function handleToggleExpand(row: DataType) {
    const expand = !row._isExpand;
    const rowIndex = dataSource.value.findIndex(item => item.code === row.code);
    if (!rowIndex) {
        console.error('can not expand:', row);
        return;
    }
    if (expand) {
        // 插入六条记录
        const insertRows: DataType[] = [...new Array(6).fill(null)].map((_, index) => {
            return {
                _isChildren: true, // 标记为子节点
                code: Random.guid(),
                source: index + 1,
                bestBuyVol: Random.integer(1, 6) * 1000,
                bestSellVol: Random.integer(1, 6) * 1000,
                lastPrice: Random.float(1, 20, 4, 4),
                cbOfrBp: Random.float(0, 10, 4, 4),
                bestBuyPrice: Random.float(0, 10, 4, 4),
                bestSellPrice: Random.float(0, 10, 4, 4),
            } as any;
        });
        dataSource.value.splice(rowIndex + 1, 0, ...insertRows);
    } else {
        dataSource.value.splice(rowIndex + 1, 6);
    }
    dataSource.value[rowIndex]._isExpand = expand;

    dataSource.value[rowIndex] = { ...dataSource.value[rowIndex] }; // trigger  row update
    dataSource.value = [...dataSource.value]; // trigger table update
}
onBeforeUnmount(() => {
    console.log('sdfsdfsdf');
});
</script>
<template>
    <StkTable
        v-model:columns="columns"
        style="height: 700px"
        row-key="code"
        no-data-full
        fixed-col-shadow
        virtual
        virtual-x
        show-overflow
        show-header-overflow
        stripe
        col-resizable
        :empty-cell-text="({ row }: any) => (row._isChildren ? '' : '--')"
        :row-class-name="(row: DataType) => (row._isChildren ? 'child-row' : '')"
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

.stk-table {
    --child-bgc: #f6f6f6;
}

.stk-table.dark {
    --child-bgc: #303039;
}
.stk-table.stripe.vt-on {
    :deep(.stk-tbody-main .child-row) {
        background-color: var(--child-bgc);
    }
}
</style>
