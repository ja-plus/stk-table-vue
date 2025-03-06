<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '@/StkTable/index';
import CheckItem from '../../components/CheckItem.vue';
const rowByRow = ref(true);

const columns: StkTableColumn<any>[] = [
    { type: 'seq', width: 50, dataIndex: '', title: '序号' },
    { title: 'Name', dataIndex: 'name', sorter: true },
    { title: 'Age', dataIndex: 'age', sorter: true },
    { title: 'Address', dataIndex: 'address', sorter: true },
    { title: 'Gender', dataIndex: 'gender', sorter: true },
];

const dataSource = new Array(100).fill(0).map((_, index) => {
    return {
        name: `Jack ${index}`,
        age: 18 + index,
        address: `Beijing Forbidden City ${index}`,
        gender: index % 2 === 0 ? 'male' : 'female',
    };
});
</script>
<template>
    <div>
        <CheckItem v-model="rowByRow" text="scroll-row-by-row" />
        <StkTable style="height: 200px" :scroll-row-by-row="rowByRow" virtual :columns="columns" :data-source="dataSource"></StkTable>
    </div>
</template>
