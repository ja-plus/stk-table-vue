<script setup lang="ts">
import { Order, SortConfig, SortState, StkTableColumn } from '@/StkTable/types';
import mockjs from 'mockjs';
import { nextTick, onMounted, ref, shallowRef, useTemplateRef } from 'vue';
import { insertToOrderedArray, tableSort } from '../../../src/StkTable/index';
import CheckItem from '../../components/CheckItem.vue';
import RadioGroup from '../../components/RadioGroup.vue';
import RangeInput from '../../components/RangeInput.vue';
import { useI18n } from '../../hooks/useI18n/index';
import StkTable from '../../StkTable.vue';
import { columns as columnsRaw } from './columns';
import { emitter } from './event';
import { mockData } from './mockData';
import { DataType } from './types';

const { t, isZH } = useI18n();

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
const updateFreq = ref(1000);

const columns = ref(columnsRaw());
const dataSource = shallowRef<DataType[]>([]);
const CODE_BASE = 10_000_000;
const createData = (i: number) => {
    return {
        code: CODE_BASE + i,
        bestBuyVol: Random.integer(1, 6) * 1000,
        bestSellVol: Random.integer(1, 6) * 1000,
        source: Random.integer(1, 6),
        lastPrice: (Math.random() * 15 + 5).toFixed(4),
        cbOfrBp: (Math.random() * 10).toFixed(4),
        bestBuyPrice: (Math.random() * 10).toFixed(4),
        bestSellPrice: (Math.random() * 10).toFixed(4),
    };
};

onMounted(() => {
    initDataSource();
    simulateUpdateData();
});

function initDataSource() {
    const curDate = new Date();
    const curHour = curDate.getHours();
    const curMinute = curDate.getMinutes();
    const dataSourceTemp = Array.from({ length: dataSize.value }).map((_, index) => {
        const data = Object.assign({}, mockData, createData(index)) as any;
        data.bestTime =
            String(Random.integer(0, curHour)).padStart(2, '0') +
            ':' +
            String(Random.integer(0, curMinute - 1)).padStart(2, '0') +
            ':' +
            String(Random.integer(0, 59)).padStart(2, '0') +
            '.' +
            String(Random.integer(0, 999)).padStart(3, '0');
        return data;
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
    dataSource.value = dataSource.value.slice(); // trigger table update
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

function handleScroll(e: Event, { startIndex, endIndex }: any) {
    console.log('scroll', startIndex, endIndex);
}

function handleRowSpan(v: boolean) {
    const col = columns.value.find(col => col.dataIndex === 'code');
    if (!col) return;
    if (v) {
        col.mergeCells = ({ rowIndex }) => {
            return {
                rowspan: rowIndex % 2 ? 1 : 2,
            };
        };
    } else {
        col.mergeCells = void 0;
    }
}

function handleColSpan(v: boolean) {
    const col = columns.value.find(col => col.dataIndex === 'bondAbbreviation');
    if (!col) return;
    if (v) {
        col.mergeCells = ({ rowIndex }) => {
            return {
                colspan: rowIndex % 2 ? 1 : 2,
            };
        };
    } else {
        col.mergeCells = void 0;
    }
}
</script>
<template>
    <div class="row">
        <RadioGroup
            v-model="dataSize"
            :text="t('dataAmount')"
            :options="[
                { label: '1k', value: 1000 },
                { label: '5k', value: 5000 },
                { label: isZH ? '1w' : '10k', value: 10000 },
                { label: isZH ? '5w' : '50k', value: 50000 },
                { label: isZH ? '10w' : '100k', value: 100_000 },
                { label: isZH ? '50w' : '500k', value: 500_000 },
                { label: isZH ? '100w' : '1mln', value: 1_000_000 },
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
        {{ t('simulateUpdateData') }}({{ timeout ? t('stop') : t('start') }})
    </button>
    <label style="margin-left: 16px">
        <RangeInput
            v-model="updateFreq"
            min="16"
            max="1000"
            :label="t('freq')"
            suffix="ms"
        ></RangeInput>
    </label>
    <CheckItem v-model="rowByRow" :text="t('rowByRowScroll')" />
    <CheckItem v-model="translateZ" :text="t('translateZ')" />
    <CheckItem
        :mode-value="false"
        :text="t('optimizeDragScroll')"
        @change="handleOptimizeScrollChange"
    />
    <CheckItem :mode-value="false" :text="t('rowspanTest')" @change="handleRowSpan" />
    <CheckItem :mode-value="false" :text="t('colspanTest')" @change="handleColSpan" />
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
        @scroll="handleScroll"
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
