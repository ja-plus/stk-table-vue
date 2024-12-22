<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { Order, SortConfig } from '@/StkTable/types';

type DataType = {
    key: string;
    name: string;
};

const columns: StkTableColumn<DataType>[] = [
    { title: 'No.', dataIndex: '' as any, type: 'seq', width: 50 },
    { title: 'Name', dataIndex: 'name', sorter: true },
];

const dataSource = ref<DataType[]>(
    Array.from({ length: 100 }, (_, i) => ({
        key: String(i),
        name: `Name ${i}`,
    })),
);

async function handleSortChange(col: StkTableColumn<DataType>, order: Order, data: DataType[], sortType: SortConfig<DataType>) {
    // 模拟远程排序，实际应用中，这里应该调用接口，将排序参数传递给后端，后端返回排序后的数据
    const result = await new Promise<DataType[]>(resolve => {
        if (order === 'desc') {
            resolve([
                { key: '1', name: 'Name 1' },
                { key: '2', name: 'Name 2' },
            ]);
        } else if (order === 'asc') {
            resolve([
                { key: '3', name: 'Name 3' },
                { key: '2', name: 'Name 2' },
                { key: '1', name: 'Name 1' },
            ]);
        } else {
            resolve([
                { key: '1', name: 'Name 1' },
                { key: '3', name: 'Name 3' },
                { key: '2', name: 'Name 2' },
                { key: '4', name: 'Name 4' },
            ]);
        }
    });
    dataSource.value = result;
}
</script>
<template>
    <StkTable style="height: 200px" row-key="key" sort-remote :columns="columns" :data-source="dataSource" @sort-change="handleSortChange"></StkTable>
</template>
