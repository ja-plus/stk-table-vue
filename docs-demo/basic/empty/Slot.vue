<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import NoData from '../../assets/svg-components/NoData.vue';

const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Address', dataIndex: 'address' },
    { title: 'Gender', dataIndex: 'gender' },
];

const dataSource = ref([]);
</script>
<template>
    <StkTable :columns="columns" :data-source="dataSource">
        <template #empty>
            <div style="padding: 20px; display: flex; flex-direction: column; align-items: center">
                <NoData />
                <p>暂无数据，请通过 <a href="#" style="color: #1890ff">权限管理</a> 申请。</p>
            </div>
        </template>
    </StkTable>
</template>
