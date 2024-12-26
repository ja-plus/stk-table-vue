<script lang="ts" setup>
import { StkTableColumn } from '@/StkTable/index';
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import CheckItem from '../components/CheckItem.vue';

const virtual = ref(false);
const stripe = ref(false);

const columns = ref<StkTableColumn<any>[]>([
    { type: 'expand', dataIndex: '', width: 50, align: 'center', fixed: 'left' },
    { dataIndex: 'id', title: 'ID', width: 100 },
    { dataIndex: 'address', title: 'Address' },
]);

const data = new Array(100).fill(0).map((it, index) => {
    return {
        id: index,
        name: 'name' + index,
        address: 'Beijing' + index,
        phone: '1234567890' + index,
    };
});
function handleToggleRowExpand(data: any) {
    console.log('handleToggleRowExpand', data);
}
</script>
<template>
    <div>
        <CheckItem v-model="virtual" text="virtual"></CheckItem>
        <CheckItem v-model="stripe" text="stripe"></CheckItem>
        <StkTable
            row-key="id"
            style="height: 200px"
            :virtual="virtual"
            :stripe="stripe"
            :expand-config="{
                height: 80,
            }"
            :columns="columns"
            :data-source="data"
            @toggle-row-expand="handleToggleRowExpand"
        >
            <template #expand="{ row }">
                <p>ID: {{ row.id }}, Phone: {{ row.phone }}</p>
                <p>Name: {{ row.name }}</p>
                <p>Address: {{ row.address }}</p>
            </template>
        </StkTable>
    </div>
</template>
