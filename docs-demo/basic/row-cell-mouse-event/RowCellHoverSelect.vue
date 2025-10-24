<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import CheckItem from '../../components/CheckItem.vue';
const stkTableRef = useTemplateRef('stkTableRef');

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

function setCurrentRow(rowKeyOrRow: string | undefined | any) {
    stkTableRef.value?.setCurrentRow(rowKeyOrRow);
}

function setSelectedCell(row: any, col: StkTableColumn<any>) {
    stkTableRef.value?.setSelectedCell(row, col);
}
</script>
<template>
    <CheckItem v-model="stripe" text="stripe(斑马纹)"></CheckItem>
    <br />
    <CheckItem v-model="rowActive" text="rowActive(行选中状态)"></CheckItem>
    <CheckItem v-model="cellActive" text="cellActive(单元格选中状态)"></CheckItem>
    <br />
    <CheckItem v-model="rowHover" text="rowHover(行悬浮状态)"></CheckItem>
    <CheckItem v-model="cellHover" text="cellHover(单元格悬浮状态)"></CheckItem>
    <br />
    <CheckItem
        v-model="rowCurrentRevokable"
        text="rowCurrentRevokable(行选中状态是否可取消)"
    ></CheckItem>
    <br />
    <CheckItem
        v-model="selectedCellRevokable"
        text="selectedCellRevokable(单元格选中状态是否可取消)"
    ></CheckItem>
    <hr />
    <button class="btn" @click="setCurrentRow('Jack')">setCurrentRow('Jack')</button>
    <button class="btn" @click="setSelectedCell(dataSource[0], columns[1])">
        setSelectedCell('Jack-age')
    </button>

    <StkTable
        ref="stkTableRef"
        row-key="name"
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
