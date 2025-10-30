<template>
    <div>
        <button class="btn" @click="updateRow">Update Row</button>
        <StkTable
            ref="stkTableRef"
            style="max-height: 350px"
            row-key="key"
            bordered="h"
            show-overflow
            :row-active="{
                disabled: (row: any) => Boolean(row.children),
            }"
            :row-class-name="(row: any) => (row.children ? 'panel-header-row' : '')"
            :empty-cell-text="({ row }: any) => (row.children ? '' : '--')"
            :tree-config="{ defaultExpandKeys: ['1'] }"
            :selected-cell-revokable="false"
            :columns="columns"
            :data-source="tableData"
        />
    </div>
</template>

<script setup lang="ts">
import type { StkTableColumn } from '@/StkTable/index';
import { nextTick, shallowRef, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';
import { RowDataType } from './type';

const stkTableRef = useTemplateRef('stkTableRef');

// 定义表格列
const columns: StkTableColumn<RowDataType>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 50,
        type: 'tree-node',
        className: 'panel-title',
        fixed: 'left',
        mergeCells({ row }) {
            if (row.children) {
                return { colspan: 2 };
            }
        },
    },
    { title: 'Name', dataIndex: 'name', width: 100, fixed: 'left' },
    { title: 'Age', dataIndex: 'age', width: 80, sorter: true, sortConfig: { sortChildren: true } },
    { title: 'Address', dataIndex: 'address', width: 200 },
    { title: 'Email', dataIndex: 'email', width: 200 },
    { title: 'Phone', dataIndex: 'phone', width: 150 },
    { title: 'Website', dataIndex: 'website', width: 200 },
    { title: 'Company', dataIndex: 'company', width: 200 },
];

// 初始化表格数据
const tableData = shallowRef<RowDataType[]>([
    {
        id: "People's Republic of China",
        key: '1',
        children: [
            {
                key: '1-1',
                id: '1',
                name: 'Beijing',
                age: 28,
                address: 'Beijing',
                email: 'beijing@example.com',
                phone: '13800000000',
                website: 'www.beijing.com',
                company: 'Beijing Company',
            },
            {
                key: '1-2',
                id: '2',
                name: 'Shanghai',
                age: 32,
                address: 'Shanghai',
                email: 'shanghai@example.com',
                phone: '13900000000',
                website: 'www.shanghai.com',
                company: 'Shanghai Company',
            },
            {
                key: '1-3',
                id: '3',
                name: 'Guangzhou',
                age: 36,
                address: 'Guangzhou',
                email: 'guangzhou@example.com',
                phone: '13500000000',
                website: 'www.guangzhou.com',
                company: 'Guangzhou Company',
            },
            {
                key: '1-4',
                id: '4',
                name: 'Shenzhen',
                age: 38,
                address: 'Shenzhen',
                email: 'shenzhen@example.com',
                phone: '13400000000',
                website: 'www.shenzhen.com',
                company: 'Shenzhen Company',
            },
        ],
    },
    {
        id: 'The Russian Federation',
        key: '2',
        children: [
            {
                key: '2-1',
                id: '1',
                name: 'Moscow',
                age: 35,
                address: 'Moscow',
                email: 'moscow@example.com',
                phone: '13700000000',
                website: 'www.moscow.com',
                company: 'Moscow Company',
            },
            {
                key: '2-2',
                id: '2',
                name: 'Saint Petersburg',
                age: 38,
                address: 'Saint Petersburg',
                email: 'saintpetersburg@example.com',
                phone: '13600000000',
                website: 'www.saintpetersburg.com',
                company: 'Saint Petersburg Company',
            },
            {
                key: '2-3',
                id: '3',
                name: 'Kazan',
                age: 36,
                address: 'Kazan',
                email: 'kazan@example.com',
                phone: '13500000000',
                website: 'www.kazan.com',
                company: 'Kazan Company',
            },
            {
                key: '2-4',
                id: '4',
                name: 'Novosibirsk',
                age: 34,
                address: 'Novosibirsk',
                email: 'novosibirsk@example.com',
                phone: '13400000000',
                website: 'www.novosibirsk.com',
                company: 'Novosibirsk Company',
            },
        ],
    },
    {
        id: 'United States of America',
        key: '3',
        children: [
            {
                key: '3-1',
                id: '1',
                name: 'New York',
                age: 35,
                address: 'New York',
                email: 'newyork@example.com',
                phone: '13700000000',
                website: 'www.newyork.com',
                company: 'New York Company',
            },
            {
                key: '3-2',
                id: '2',
                name: 'Los Angeles',
                age: 40,
                address: 'Los Angeles',
                email: 'losangeles@example.com',
                phone: '13600000000',
                website: 'www.losangeles.com',
                company: 'Los Angeles Company',
            },
            {
                key: '3-3',
                id: '3',
                name: 'Chicago',
                age: 38,
                address: 'Chicago',
                email: 'chicago@example.com',
                phone: '13500000000',
                website: 'www.chicago.com',
                company: 'Chicago Company',
            },
            {
                key: '3-4',
                id: '4',
                name: 'San Francisco',
                age: 42,
                address: 'San Francisco',
                email: 'sanfrancisco@example.com',
                phone: '13400000000',
                website: 'www.sanfrancisco.com',
                company: 'San Francisco Company',
            },
        ],
    },
    {
        id: 'United Kingdom of Great Britain and Northern Ireland',
        key: '4',
        children: [
            {
                key: '4-1',
                id: '1',
                name: 'London',
                age: 45,
                address: 'London',
                email: 'london@example.com',
                phone: '13900000000',
                website: 'www.london.com',
                company: 'London Company',
            },
            {
                key: '4-2',
                id: '2',
                name: 'Manchester',
                age: 42,
                address: 'Manchester',
                email: 'manchester@example.com',
                phone: '13800000000',
                website: 'www.manchester.com',
                company: 'Manchester Company',
            },
            {
                key: '4-3',
                id: '3',
                name: 'Liverpool',
                age: 40,
                address: 'Liverpool',
                email: 'liverpool@example.com',
                phone: '13700000000',
                website: 'www.liverpool.com',
                company: 'Liverpool Company',
            },
            {
                key: '4-4',
                id: '4',
                name: 'Leeds',
                age: 42,
                address: 'Leeds',
                email: 'leeds@example.com',
                phone: '13600000000',
                website: 'www.leeds.com',
                company: 'Leeds Company',
            },
        ],
    },
    {
        id: 'French Republic',
        key: '5',
        children: [
            {
                key: '5-1',
                id: '1',
                name: 'Paris',
                age: 48,
                address: 'Paris',
                email: 'paris@example.com',
                phone: '13700000000',
                website: 'www.paris.com',
                company: 'Paris Company',
            },
            {
                key: '5-2',
                id: '2',
                name: 'Lyon',
                age: 44,
                address: 'Lyon',
                email: 'lyon@example.com',
                phone: '13600000000',
                website: 'www.lyon.com',
                company: 'Lyon Company',
            },
            {
                key: '5-3',
                id: '3',
                name: 'Marseille',
                age: 46,
                address: 'Marseille',
                email: 'marseille@example.com',
                phone: '13500000000',
                website: 'www.marseille.com',
                company: 'Marseille Company',
            },
            {
                key: '5-4',
                id: '4',
                name: 'Nice',
                age: 44,
                address: 'Nice',
                email: 'nice@example.com',
                phone: '13400000000',
                website: 'www.nice.com',
                company: 'Nice Company',
            },
        ],
    },
]);

async function updateRow() {
    const row = tableData.value[0].children?.[0];
    if (!row) {
        return;
    }
    row.age = Math.round(Math.random() * 100);
    await nextTick();
    stkTableRef.value?.setHighlightDimRow([row.key]);
}
</script>
<style lang="less" scoped>
:deep(.panel-title .table-cell-wrapper) {
    font-weight: bold;
    overflow: initial;
}

:deep(.panel-header-row) {
    --tr-hover-bgc: var(--th-bgc);
    background-color: var(--th-bgc);
}
</style>
