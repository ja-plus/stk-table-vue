<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../src/StkTable/StkTable.vue';
import { StkTableColumn } from '../src/StkTable/types';

const columns = ref<StkTableColumn<any>[]>([
    { type: 'expand', dataIndex: '', width: 50, align: 'center', fixed: 'left' },
    { type: 'expand', dataIndex: 'name', title: 'name', width: 80 },
    { dataIndex: 'id', title: 'id(100px)', width: '100px' },
    { dataIndex: 'address', title: 'address' },
    { dataIndex: 'email', title: 'email' },
    { dataIndex: 'phone', title: 'phone' },
    { dataIndex: 'website', title: 'website' },
    { dataIndex: 'company', title: 'company' },
    { dataIndex: 'catchPhrase', title: 'catchPhrase' },
    { dataIndex: 'bs', title: 'bs' },
]);

const data = new Array(100).fill(0).map((it, index) => {
    return {
        id: index,
        name: 'name' + index,
        address: 'sss',
        email: 'email' + index + '@example.com',
        phone: '123-456-7890',
        website: 'www.example.com',
        company: 'Company' + index,
        catchPhrase: 'Catch Phrase' + index,
        bs: 'BS' + index,
    };
});
function handleToggleRowExpand(data) {
    console.log('handleToggleRowExpand', data);
}
</script>
<template>
    <div>
        <h2>Expand Row</h2>
        <StkTable row-key="id" style="height: 400px" :columns="columns" :data-source="data" @toggle-row-expand="handleToggleRowExpand">
            <template #expand="{ row, col }">
                <div>
                    <h4>trigger: {{ col.title || '--' }}</h4>
                    <p>id: {{ row.id }}, phone: {{ row.phone }}</p>
                </div>
            </template>
        </StkTable>
    </div>
</template>
