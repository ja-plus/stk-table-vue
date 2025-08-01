<script setup lang="ts">
import { Order, SortConfig, SortState, StkTableColumn } from '@/StkTable/types';
import mockjs from 'mockjs';
import { nextTick, onMounted, ref, shallowRef, useTemplateRef } from 'vue';
import { insertToOrderedArray, tableSort } from '../../../src/StkTable/index';
import CheckItem from '../../components/CheckItem.vue';
import RadioGroup from '../../components/RadioGroup.vue';
import StkTable from '../../StkTable.vue';
import { columns as columnsRaw } from './columns';
import { emitter } from './event';
import { mockData } from './mockData';
import { DataType } from './types';
import RangeInput from '../../components/RangeInput.vue';

const { Random } = mockjs;
emitter.on('toggle-expand', handleToggleExpand);
const sortConfig = {
    defaultSort: {
        dataIndex: 'bestTime' as keyof DataType,
        order: 'desc' as Order,
        sortType: 'string' as 'string' | 'number' | undefined,
    },
} satisfies SortConfig<DataType>;

const currentSort: SortState<DataType> = {
    dataIndex: 'bestTime',
    order: 'desc',
    sortType: 'string',
};
const stkTableRef = useTemplateRef('stkTableRef');

const dataSize = ref(50000);
const rowByRow = ref(false);
const optimizeDragScroll = ref<'scrollbar'>();
const translateZ = ref(false);
const updateFreq = ref(100);

const columns = ref(columnsRaw);
const dataSource = shallowRef<DataType[]>([]);

const createCode = (i: number) => 'c' + String(i).padStart(6, '0');
const createData = (i: number) => {
    return {
        code: createCode(i),
        bestBuyVol: Random.integer(1, 6) * 1000,
        bestSellVol: Random.integer(1, 6) * 1000,
        source: Random.integer(1, 6),
        lastPrice: Random.float(1, 20, 4, 4),
        cbOfrBp: Random.float(0, 10, 4, 4),
        bestBuyPrice: Random.float(0, 10, 4, 4),
        bestSellPrice: Random.float(0, 10, 4, 4),
    };
};

onMounted(() => {
    initDataSource();
});

function initDataSource() {
    const curDate = new Date();
    const curHour = curDate.getHours();
    const curMinute = curDate.getMinutes();
    const dataSourceTemp = new Array(dataSize.value).fill(null).map((_, index) => {
        return {
            ...mockData,
            ...createData(index),
            bestTime:
                String(Random.integer(7, Math.max(7, curHour))).padStart(2, '0') +
                ':' +
                String(Random.integer(0, curMinute - 1)).padStart(2, '0') +
                ':' +
                String(Random.integer(0, 59)).padStart(2, '0') +
                '.' +
                String(Random.integer(0, 999)).padStart(3, '0'),
        } as any;
    });

    dataSource.value = tableSort(
        { dataIndex: 'bestTime', sorter: true },
        'desc',
        dataSourceTemp,
        sortConfig,
    );
}

function handleToggleExpand(row: DataType) {
    const expand = !row._isExpand;
    const rowIndex = dataSource.value.findIndex(item => item.code === row.code);
    if (rowIndex === -1) {
        console.error('can not expand:', row);
        return;
    }
    if (expand) {
        // 插入六条记录
        const insertRows: DataType[] = [...new Array(6).fill(null)].map((_, index) => {
            return {
                _isChildren: true, // 标记为子节点
                code: Random.guid(),
                source: index + 1,
                bestBuyVol: Random.integer(1, 6) * 1000,
                bestSellVol: Random.integer(1, 6) * 1000,
                lastPrice: Random.float(1, 20, 4, 4),
                cbOfrBp: Random.float(0, 10, 4, 4),
                bestBuyPrice: Random.float(0, 10, 4, 4),
                bestSellPrice: Random.float(0, 10, 4, 4),
            } as any;
        });
        dataSource.value.splice(rowIndex + 1, 0, ...insertRows);
    } else {
        dataSource.value.splice(rowIndex + 1, 6);
    }
    dataSource.value[rowIndex]._isExpand = expand;
    dataSource.value[rowIndex] = { ...dataSource.value[rowIndex] }; // trigger  row update
    dataSource.value = [...dataSource.value]; // trigger table update
}

const timeout = ref(0);
function simulateUpdateData() {
    timeout.value = window.setTimeout(() => {
        simulateUpdateData();
        const curDate = new Date();
        const curHour = curDate.getHours();
        const curMinute = curDate.getMinutes();
        const curSeconds = curDate.getSeconds();
        const curMilliseconds = curDate.getMilliseconds();
        const newData: any = {
            ...mockData,
            ...createData(Random.integer(0, dataSource.value.length - 1)),
            bestTime:
                String(curHour).padStart(2, '0') +
                ':' +
                String(curMinute).padStart(2, '0') +
                ':' +
                String(curSeconds).padStart(2, '0') +
                '.' +
                String(curMilliseconds).padStart(3, '0'),
        };
        const rowIndex = dataSource.value.findIndex(item => item.code === newData.code);
        if (rowIndex === -1) return;
        dataSource.value.splice(rowIndex, 1); // delete old data
        // 二分插入
        dataSource.value = insertToOrderedArray(currentSort, newData, dataSource.value);
        highlightRow(newData);
    }, updateFreq.value);
}

function stopSimulateUpdateData() {
    if (timeout.value) {
        window.clearTimeout(timeout.value);
        timeout.value = 0;
    }
}

function highlightRow(row: DataType) {
    nextTick(() => {
        const key = row.code;
        stkTableRef.value?.setHighlightDimRow([key]);
    });
}

function handleSortChange(
    col: StkTableColumn<DataType>,
    order: Order,
    data: DataType[],
    sortConfig: SortConfig<DataType>,
) {
    currentSort.dataIndex = col.dataIndex;
    currentSort.order = order;
    currentSort.sortType = col.sortType;
    dataSource.value = tableSort(col, order, data, sortConfig);
}
function handleDataSizeChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const value = Number(input.value);
    if (isNaN(value)) return;
    dataSize.value = value;
    initDataSource();
}

function handleOptimizeScrollChange(v: boolean) {
    if (v) {
        optimizeDragScroll.value = 'scrollbar';
        rowByRow.value = false;
    } else {
        optimizeDragScroll.value = void 0;
    }
}
</script>
<template>
    <div class="row">
        <RadioGroup
            v-model="dataSize"
            text="数据量"
            :options="[
                { label: '1k', value: 1000 },
                { label: '5k', value: 5000 },
                { label: '1w', value: 10000 },
                { label: '5w', value: 50000 },
                { label: '10w', value: 100_000 },
                { label: '50w', value: 500_000 },
                { label: '100w', value: 1_000_000 },
            ]"
            @change="initDataSource"
        ></RadioGroup>
        <input
            class="input"
            :value="dataSize"
            type="number"
            style="width: 70px; margin-left: 6px"
            @change="handleDataSizeChange"
        />
    </div>
    <button class="btn" @click="() => (timeout ? stopSimulateUpdateData() : simulateUpdateData())">
        模拟更新数据({{ timeout ? '停止' : '开始' }})
    </button>
    <label style="margin-left: 16px">
        <RangeInput
            v-model="updateFreq"
            min="16"
            max="500"
            label="更新频率"
            suffix="ms"
        ></RangeInput>
    </label>
    <CheckItem v-model="rowByRow" text="整数行滚动" />
    <CheckItem v-model="translateZ" text="tr分层" />
    <CheckItem :mode-value="false" text="拖动白屏优化" @change="handleOptimizeScrollChange" />
    <StkTable
        ref="stkTableRef"
        v-model:columns="columns"
        :class="{ stack: translateZ }"
        style="height: 700px"
        row-key="code"
        no-data-full
        fixed-col-shadow
        virtual
        virtual-x
        show-overflow
        show-header-overflow
        stripe
        col-resizable
        sort-remote
        :scroll-row-by-row="rowByRow || optimizeDragScroll"
        :sort-config="sortConfig"
        :empty-cell-text="({ row }: any) => (row._isChildren ? '' : '--')"
        :row-class-name="(row: DataType) => (row._isChildren ? 'child-row' : '')"
        :data-source="dataSource"
        @sort-change="handleSortChange"
    ></StkTable>
</template>
<style scoped lang="less">
.row {
    display: flex;
}

.stack {
    :deep(.stk-tbody-main tr) {
        transform: translateZ(0);
    }
}

:deep(.blue-cell) {
    color: #4f8df4;
}

:deep(.red-cell) {
    color: #ff2b48;
}

:deep(.green-cell) {
    color: #2fc87b;
}

:deep(.source-cell) {
    border-radius: 4px;
    background-color: #777;
    display: inline-block;
    padding: 0 8px;
    font-size: 14px;
    line-height: 20px;

    &.source-1 {
        background-color: rgba(39, 69, 159, 0.4);
    }

    &.source-2 {
        background-color: rgba(171, 99, 0, 0.4);
    }

    &.source-3 {
        background-color: rgba(0, 119, 143, 0.4);
    }

    &.source-4 {
        background-color: rgba(171, 28, 0, 0.4);
    }

    &.source-5 {
        background-color: rgba(199, 166, 0, 0.4);
    }

    &.source-6 {
        background-color: rgba(113, 23, 204, 0.4);
    }
}

.stk-table {
    --child-bgc: #f6f6f6;
}

.stk-table.dark {
    --child-bgc: #303039;
}

.stk-table.stripe.vt-on {
    :deep(.stk-tbody-main .child-row) {
        background-color: var(--child-bgc);

        &.active {
            background-color: var(--tr-active-bgc);
        }

        &:hover {
            background-color: var(--tr-hover-bgc);
        }
    }
}
</style>
