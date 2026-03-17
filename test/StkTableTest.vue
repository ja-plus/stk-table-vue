<template>
    <div>
        <button @click="refreshData(1)">refresh</button>
    </div>
    <!-- <StkTableHugeData></StkTableHugeData> -->
    <div ref="stkTableParent" class="stk-table-parent">
        <StkTable
            v-bind="props"
            v-model:columns="columns"
            row-key="name"
            scrollbar
            :row-height="48"
            :header-row-height="48"
            :empty-cell-text="({ col }) => (col.dataIndex === 'R' ? '/' : '--')"
            :data-source="dataSource"
        ></StkTable>
    </div>
</template>

<script lang="ts" setup>
import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { StkTable, StkTableColumn } from '../src/StkTable/index';
import { DragRowConfig, HeaderDragConfig } from '@/StkTable/types';

const props = ref({
    // showTrHoverClass: true,
    rowKey: 'name',
    theme: 'light' as 'dark' | 'light',
    stripe: true,
    showOverflow: false,
    showHeaderOverflow: false,
    rowHover: true,
    rowActive: true,
    rowCurrentRevokable: true,
    cellHover: true,
    cellActive: false,
    selectedCellRevokable: true,
    sortRemote: false,
    // minWidth: 'auto',
    colResizable: true,
    headerDrag: { mode: 'insert', disabled: col => col.dataIndex === 'name' } as HeaderDragConfig,
    virtual: true,
    virtualX: true,
    noDataFull: true,
    headless: false,
    bordered: true,
    highlightConfig: {
        // fps: 10,
        duration: 1,
    },
    dragRowConfig: {
        mode: 'insert', // 'none' | 'swap'
    } as DragRowConfig,
    fixedColShadow: true,
    smoothScroll: false,
});

const dataSource = shallowRef<any>(
    // [{}, null],
    new Array(3000).fill(0).map((it, i) => {
        const key1 = 'n' + i;
        return {
            name: key1,
        };
    }),
);

const columns = shallowRef<StkTableColumn<any>[]>([
    {
        type: 'seq',
        dataIndex: 'seq',
        title: '序号',
        align: 'right',
        fixed: 'left',
        width: 50,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        width: 200,
    },
]);

const refreshData = (total: number) => {
    dataSource.value = new Array(total).fill(0).map((it, i) => {
        const key1 = 'n' + i;
        return {
            name: key1,
        };
    });
};
</script>

<style scoped>
.stk-table-parent {
    width: 800px;
    height: 500px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}
.stk-table {
    flex: 1;
}
</style>
