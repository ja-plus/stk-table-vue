<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import CheckItem from '../components/CheckItem.vue';

const fixedColShadow = ref(false);

const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name', fixed: 'left', minWidth: 100 },
    { title: 'Age', dataIndex: 'age', minWidth: 100 },
    { title: 'Address', dataIndex: 'address', minWidth: 200 },
    { title: 'Gender', dataIndex: 'gender', minWidth: 50, fixed: 'left' },
    { title: 'Email', dataIndex: 'email', minWidth: 200 },
    { title: 'Phone', dataIndex: 'phone', minWidth: 100 },
    { title: 'Company', dataIndex: 'company', minWidth: 200 },
    { title: 'Operation', dataIndex: 'operation', fixed: 'right', minWidth: 100 },
];
const dataSource = ref([
    { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', gender: 'male', email: 'john@example.com' },
    { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', gender: 'male', email: 'jim@example.com' },
    { key: '3', name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', gender: 'male', email: 'joe@example.com' },
    { key: '4', name: 'Jim Red', age: 32, address: 'London No. 2 Lake Park', gender: 'male', email: 'jim@example.com' },
    { key: '5', name: 'Jake White', age: 32, address: 'New York No. 2 Lake Park', gender: 'male', email: 'jake@example.com' },
]);
</script>

<template>
    <CheckItem v-model="fixedColShadow" text="show fixed shadow"></CheckItem>
    <StkTable :fixed-col-shadow="fixedColShadow" :columns="columns" :data-source="dataSource"></StkTable>
</template>
