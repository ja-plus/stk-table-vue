<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '@/StkTable/index';

const columns = ref<StkTableColumn<any>[]>([
    { title: 'Name', dataIndex: 'name', width: 100, fixed: 'left' },
    { title: 'Age', dataIndex: 'age', width: 60 },
    { title: 'Gender', dataIndex: 'gender', width: 80 },
    { title: 'Address', dataIndex: 'address', width: 200 },
    { title: 'Operate', dataIndex: '', width: 100, fixed: 'right' },
]);

const dataSource = [
    {
        name: `Jack`,
        age: 18,
        address: `Beijing Forbidden City, ${' Long text'.repeat(20)}`,
        gender: 'male',
    },
    { name: `Tom`, age: 20, address: `Shanghai`, gender: 'male' },
    { name: `Lucy`, age: 22, address: `Guangzhou`, gender: 'female' },
    { name: `Lily`, age: 24, address: `Shenzhen`, gender: 'female' },
];
</script>
<template>
    <StkTable
        v-model:columns="columns"
        row-key="name"
        virtual
        header-drag
        fixed-col-shadow
        :data-source="dataSource"
    ></StkTable>
</template>
