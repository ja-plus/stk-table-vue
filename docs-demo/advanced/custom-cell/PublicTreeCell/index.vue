<script setup lang="ts">
import StkTable from '../../../StkTable.vue';
import { StkTreeCell, StkTableColumn } from '../../../../src/StkTable/index';
import ComposedTreeCell from './ComposedTreeCell.vue';

type Row = Record<string, any>;

const columns: StkTableColumn<Row>[] = [
    {
        type: 'tree-node',
        title: 'Name',
        dataIndex: 'name',
        customCell: StkTreeCell,
    },
];

const dataSource = [
    {
        id: 'root',
        name: 'Root',
        children: [
            { id: 'child-1', name: 'Child 1' },
            { id: 'child-2', name: 'Child 2' },
        ],
    },
];

const composedColumns: StkTableColumn<Row>[] = [{
    type: 'tree-node',
    title: 'Composed',
    dataIndex: 'name',
    customCell: ComposedTreeCell,
}];
</script>

<template>
    <StkTable
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :tree-config="{ showGuide: true }"
        :show-no-data="false"
        style="height: 180px"
    />
    <StkTable
        row-key="id"
        :columns="composedColumns"
        :data-source="dataSource"
        :tree-config="{ showGuide: true }"
        :show-no-data="false"
        style="height: 180px; margin-top: 12px"
    />
</template>
