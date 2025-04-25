<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import CheckItem from '../../components/CheckItem.vue';

const virtual = ref(false);

const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Gender', dataIndex: 'gender' },
    { title: 'Address', dataIndex: 'address', maxWidth: 200 },
];

const dataSource = ref([
    {
        name: `Jack`,
        age: 18,
        address: `Beijing Forbidden City, ${' Long text'.repeat(20)}`,
        gender: 'male',
    },
    { name: `Tom`, age: 20, address: `Shanghai`, gender: 'male' },
    { name: `Lucy`, age: 22, address: `Guangzhou`, gender: 'female' },
    { name: `Lily`, age: 24, address: `Shenzhen`, gender: 'female' },
    ...new Array(50).fill(0).map((_, i) => ({
        name: `Jack${i}`,
        age: 18,
        address: `Beijing Forbidden City `,
        gender: 'male',
    })),
]);
</script>
<template>
    <CheckItem v-model="virtual" text="开启虚拟列表virtual"></CheckItem>
    <StkTable
        style="height: 200px"
        :virtual="virtual"
        row-height="40"
        header-row-height="50"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
