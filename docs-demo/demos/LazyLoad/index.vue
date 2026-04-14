<template>
    <div>
        <header>
            <button class="btn" @click="gcData">GC</button>
        </header>
        <StkTable
            row-key="id"
            style="height: 400px"
            virtual
            scrollbar
            :columns="columns"
            :data-source="tableData"
            @scroll="onScroll"
        />
        <footer style="margin-top: 16px">
            <span>Total: {{ totalCount }}</span>
            <span style="margin-left: 16px">Page Size: {{ pageSize }}</span>
            <span style="margin-left: 16px">Loaded Count: {{ loadedCount }}</span>
            <span style="margin-left: 16px"
                >startIndex: {{ startIndex }} endIndex: {{ endIndex }}</span
            >
        </footer>
    </div>
</template>

<script setup lang="ts">
import type { StkTableColumn } from '@/StkTable/index';
import { computed, ref } from 'vue';
import { debounce } from '../../../src/StkTable/utils/index';
import StkTable from '../../StkTable.vue';

const totalCount = 100_000;
const pageSize = 100;

const tableData = ref<Array<Record<string, any>>>([]);
const loadedPages = ref<Set<number>>(new Set());

function initPlaceholderData() {
    const placeholders = [];
    for (let i = 0; i < totalCount; i++) {
        placeholders.push({
            id: i + 1,
            __placeholder: true,
        });
    }
    tableData.value = placeholders;
}

initPlaceholderData();

const loadedCount = computed(() => {
    return tableData.value.filter(item => !item.__placeholder).length;
});

const startIndex = ref(0);
const endIndex = ref(0);

const columns: StkTableColumn<Record<string, any>>[] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Name', dataIndex: 'name', width: 120 },
    { title: 'Age', dataIndex: 'age', width: 80 },
    { title: 'Address', dataIndex: 'address', width: 300 },
];

function mockFetchData(page: number, pageSize: number): Promise<Array<Record<string, any>>> {
    return new Promise(resolve => {
        setTimeout(() => {
            const data = [];
            const start = page * pageSize;
            for (let i = 0; i < pageSize; i++) {
                const index = start + i;
                if (index < totalCount) {
                    data.push({
                        id: index + 1,
                        name: `User${index + 1}`,
                        age: 20 + (index % 50),
                        address: `Beijing Chaoyang District${index + 1} Street`,
                        __placeholder: false,
                    });
                }
            }
            resolve(data);
        }, 200); // delay
    });
}

async function loadDataPage(page: number) {
    if (loadedPages.value.has(page)) return;

    loadedPages.value.add(page);

    try {
        const response = await mockFetchData(page, pageSize);

        const startIndex = page * pageSize;
        response.forEach((item, index) => {
            if (startIndex + index < tableData.value.length) {
                tableData.value[startIndex + index] = item;
            }
        });

        tableData.value = tableData.value.slice();
    } catch (error) {
        loadedPages.value.delete(page);
    }
}

const onScroll = debounce((e: Event, data: { startIndex: number; endIndex: number }) => {
    startIndex.value = data.startIndex;
    endIndex.value = data.endIndex;

    const startPage = Math.floor(data.startIndex / pageSize);
    const endPage = Math.floor(data.endIndex / pageSize);

    for (let page = startPage; page <= endPage; page++) {
        if (page >= 0 && page < Math.ceil(totalCount / pageSize)) {
            loadDataPage(page);
        }
    }
}, 300);

function gcData() {
    const startPage = Math.floor(startIndex.value / pageSize);
    const endPage = Math.floor(endIndex.value / pageSize);

    const keepStartPage = Math.max(0, startPage - 1);
    const keepEndPage = Math.min(Math.ceil(totalCount / pageSize) - 1, endPage + 1);

    loadedPages.value.forEach(page => {
        if (page < keepStartPage || page > keepEndPage) {
            const pageStartIndex = page * pageSize;
            const pageEndIndex = Math.min(pageStartIndex + pageSize, totalCount);

            for (let i = pageStartIndex; i < pageEndIndex; i++) {
                tableData.value[i] = {
                    id: i + 1,
                    __placeholder: true,
                };
            }
            // remove page from loadedPages
            loadedPages.value.delete(page);
        }
    });

    tableData.value = tableData.value.slice();
}

loadDataPage(0);
</script>
