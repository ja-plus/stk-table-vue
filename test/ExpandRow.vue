<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../src/StkTable/StkTable.vue';
import { StkTableColumn } from '../src/StkTable/types';

const columns = ref<StkTableColumn<any>[]>([
    {
        type: 'expand',
        dataIndex: 'name',
    },
    {
        dataIndex: 'id',
        title: 'id(100px)',
        width: '100px',
    },
    {
        dataIndex: 'address',
        title: 'address',
    },
]);

const data = new Array(100).fill(0).map((it, index) => {
    return { id: index, name: 'hah' + index, address: 'sss' };
});
function handleToggleRowExpand(data) {
    console.log('handleToggleRowExpand', data);
}
</script>
<template>
    <div>
        <h2>Expand Row</h2>
        <StkTable row-key="id" style="height: 200px" :columns="columns" :data-source="data" @toggle-row-expand="handleToggleRowExpand">
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
