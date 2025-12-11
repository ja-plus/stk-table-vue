<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();

const columns: StkTableColumn<any>[] = [
    { type: 'seq', title: t('seq'), dataIndex: '', fixed: 'left', width: 50 },
    { title: t('name'), dataIndex: 'name', fixed: 'left', width: 100 },
    { title: t('age'), dataIndex: 'age', width: 100 },
    { title: t('address'), dataIndex: 'address', width: 200 },
    { title: t('gender'), dataIndex: 'gender', width: 70, fixed: 'left' },
    { title: t('email'), dataIndex: 'email', width: 200 },
    { title: t('phone'), dataIndex: 'phone', width: 100 },
    { title: t('operate'), dataIndex: 'operation', fixed: 'right', width: 100 },
    { title: t('company'), dataIndex: 'company', width: 200 },
    { title: t('website'), dataIndex: 'website', width: 100 },
];
const dataSource = ref([
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        gender: 'male',
        email: 'john@example.com',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        gender: 'male',
        email: 'jim@example.com',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        gender: 'male',
        email: 'joe@example.com',
    },
    {
        key: '4',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park',
        gender: 'male',
        email: 'jim@example.com',
    },
    {
        key: '5',
        name: 'Jake White',
        age: 32,
        address: 'New York No. 2 Lake Park',
        gender: 'male',
        email: 'jake@example.com',
    },
    // 再加100条数据
    ...new Array(100).fill(0).map((_, i) => ({
        key: `${i + 6}`,
        name: `John Brown${i + 6}`,
        age: 32,
        address: 'New York No. 1 Lake Park',
        gender: 'male',
        email: 'john@example.com',
    })),
]);
</script>

<template>
    <StkTable
        style="height: 200px"
        row-key="key"
        virtual
        virtual-x
        fixed-col-shadow
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
