<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../src/StkTable/StkTable.vue';
import { StkTableColumn } from '../src/StkTable/types';

const columns = ref<StkTableColumn<any>[]>([
    {
        type: 'expand',
        dataIndex: '',
    },
    {
        dataIndex: 'id',
        title: 'id(100px)',
        width: '100px',
    },
    {
        dataIndex: 'name',
        title: 'name',
    },
    {
        dataIndex: 'address',
        title: 'address',
    },
]);

const data = new Array(200).fill(0).map((it, index) => {
    return { id: index, name: 'hah', address: 'sss' };
});
</script>
<template>
    <div>
        <h2>Expand Row</h2>
        <StkTable row-key="id" style="height: 200px" :columns="columns" :data-source="data">
            <template #expand="{ row }">
                <div>
                    <p>id: {{ row.id }}</p>
                    <p>name: {{ row.name }}</p>
                    <p>address: {{ row.address }}</p>
                </div>
            </template>
        </StkTable>
    </div>
</template>
