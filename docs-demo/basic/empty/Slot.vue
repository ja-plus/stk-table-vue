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
                <p>No Data <a href="#" style="color: #1890ff">Click here</a></p>
            </div>
        </template>
    </StkTable>
</template>
