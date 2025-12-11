<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import CheckItem from '../../components/CheckItem.vue';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();
const stkTableRef = useTemplateRef('stkTableRef');

const stripe = ref(true);
const rowActive = ref({
    enabled: true,
    disabled: (row: any) => row.name === 'Disabled',
    revokable: true,
});
const cellActive = ref(true);
const rowHover = ref(true);
const cellHover = ref(true);
const selectedCellRevokable = ref(true);

const columns: StkTableColumn<any>[] = [
    { title: t('name'), dataIndex: 'name' },
    { title: t('age'), dataIndex: 'age' },
    { title: t('address'), dataIndex: 'address' },
    { title: t('gender'), dataIndex: 'gender' },
];

const dataSource = ref([
    { name: `Jack`, age: 18, address: `Beijing Forbidden City `, gender: 'male' },
    { name: `Tom`, age: 20, address: `Shanghai`, gender: 'male' },
    { name: `Lucy`, age: 22, address: `Guangzhou`, gender: 'female' },
    { name: `Lily`, age: 24, address: `Shenzhen`, gender: 'female' },
    { name: `Disabled`, age: 0, address: `Unknown`, gender: 'male' },
]);

function setCurrentRow(rowKeyOrRow: string | undefined | any) {
    stkTableRef.value?.setCurrentRow(rowKeyOrRow);
}

function setSelectedCell(row: any, col: StkTableColumn<any>) {
    stkTableRef.value?.setSelectedCell(row, col);
}
</script>
<template>
    <CheckItem v-model="stripe" :text="'stripe' + '(' + t('zebraStripes') + ')'"></CheckItem>
    <br />
    <CheckItem v-model="rowActive.enabled" :text="'rowActive' + '(' + t('rowSelectedState') + ')'"></CheckItem>
    <CheckItem v-model="cellActive" :text="'cellActive' + '(' + t('cellSelectedState') + ')'"></CheckItem>
    <br />
    <CheckItem v-model="rowHover" :text="'rowHover' + '(' + t('rowHoverState') + ')'"></CheckItem>
    <CheckItem v-model="cellHover" :text="'cellHover' + '(' + t('cellHoverState') + ')'"></CheckItem>
    <br />
    <CheckItem
        v-model="rowActive.revokable"
        :text="'rowActive.revokable(' + t('rowSelectedStateCancellable') + ')'"
    ></CheckItem>
    <br />
    <CheckItem
        v-model="selectedCellRevokable"
        :text="'selectedCellRevokable' + '(' + t('cellSelectedStateCancellable') + ')'"
    ></CheckItem>
    <hr />
    <button class="btn" @click="setCurrentRow('Jack')">setCurrentRow('Jack')</button>
    <button class="btn" @click="setSelectedCell(dataSource[0], columns[1])">
        setSelectedCell('Jack-age')
    </button>
    <button class="btn" @click="setCurrentRow('Disabled')">setCurrentRow('Disabled')</button>

    <StkTable
        ref="stkTableRef"
        row-key="name"
        :stripe="stripe"
        :row-active="rowActive"
        :cell-active="cellActive"
        :row-hover="rowHover"
        :cell-hover="cellHover"
        :selected-cell-revokable="selectedCellRevokable"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
