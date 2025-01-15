<script lang="ts" setup>
import { h, ref, shallowRef } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '@/StkTable/types';
import CheckItem from '../../components/CheckItem.vue';

const p = ref({
    virtual: false,
});

const columns = ref<StkTableColumn<any>[]>([
    {
        type: 'dragRow',
        key: 'dragRow',
        width: 100,
        title: '内置拖拽',
        // dataIndex: 'id',
        align: 'center',
    },
    { dataIndex: 'email', title: 'email' },
    { dataIndex: 'phone', title: 'phone', width: 150 },
]);

const data = shallowRef(
    new Array(100).fill(0).map((it, index) => {
        return {
            id: index,
            name: 'name' + index,
            email: 'email' + index + '@example.com',
            phone: '123-456-7890',
        };
    }),
);
</script>
<template>
    <div>
        <CheckItem v-model="p.virtual" text="virtual"></CheckItem>
        <StkTable
            v-model:columns="columns"
            row-key="id"
            style="height: 300px"
            header-drag
            :col-key="col => col.key || col.dataIndex"
            :virtual="p.virtual"
            :data-source="data"
        >
        </StkTable>
    </div>
</template>
