<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import CheckItem from '../../components/CheckItem.vue';

const stripe = ref(true);
const rowActive = ref(true);
const cellActive = ref(true);
const rowHover = ref(true);
const cellHover = ref(true);
const rowCurrentRevokable = ref(true);
const selectedCellRevokable = ref(true);

const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Address', dataIndex: 'address' },
    { title: 'Gender', dataIndex: 'gender' },
];

const dataSource = ref([
    { name: `Jack`, age: 18, address: `Beijing Forbidden City `, gender: 'male' },
    { name: `Tom`, age: 20, address: `Shanghai`, gender: 'male' },
    { name: `Lucy`, age: 22, address: `Guangzhou`, gender: 'female' },
    { name: `Lily`, age: 24, address: `Shenzhen`, gender: 'female' },
]);
</script>
<template>
    <CheckItem v-model="stripe" text="斑马纹(stripe)"></CheckItem>
    <br />
    <CheckItem v-model="rowActive" text="行选中状态(rowActive)"></CheckItem>
    <CheckItem v-model="cellActive" text="单元格选中状态(cellActive)"></CheckItem>
    <br />
    <CheckItem v-model="rowHover" text="行悬浮状态(rowHover)"></CheckItem>
    <CheckItem v-model="cellHover" text="单元格悬浮状态(cellHover)"></CheckItem>
    <br />
    <CheckItem
        v-model="rowCurrentRevokable"
        text="行选中状态是否可取消(rowCurrentRevokable)"
    ></CheckItem>
    <br />
    <CheckItem
        v-model="selectedCellRevokable"
        text="单元格选中状态是否可取消(selectedCellRevokable)"
    ></CheckItem>
    <StkTable
        :stripe="stripe"
        :row-active="rowActive"
        :cell-active="cellActive"
        :row-hover="rowHover"
        :cell-hover="cellHover"
        :row-current-revokable="rowCurrentRevokable"
        :selected-cell-revokable="selectedCellRevokable"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
