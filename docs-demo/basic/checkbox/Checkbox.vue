<template>
    <StkTable row-key="id" bordered :columns="columns" :data-source="dataSource" />
    <div class="info-box">
        <h3>Selected:</h3>
        <div class="selected-items">
            <template v-if="selectedItems.length > 0">
                <span v-for="item in selectedItems" :key="item.id" class="selected-item">
                    {{ item.name }}
                </span>
            </template>
            <span v-else>No select</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';

// 模拟数据
const dataSource = ref<Record<string, any>[]>([
    { id: 1, name: 'Alice', age: 25, address: 'Haidian District, Beijing', isChecked: true },
    { id: 2, name: 'Bob', age: 28, address: 'Pudong New Area, Shanghai', isChecked: true },
    { id: 3, name: 'Charlie', age: 32, address: 'Tianhe District, Guangzhou' },
    { id: 4, name: 'David', age: 29, address: 'Nanshan District, Shenzhen' },
    { id: 5, name: 'Eve', age: 27, address: 'Xihu District, Hangzhou' },
]);

// 是否全选
const isCheckAll = computed(() => {
    return dataSource.value.length > 0 && dataSource.value.every(item => item.isChecked);
});

const isCheckPartial = computed(() => {
    const checkedCount = dataSource.value.filter(item => item.isChecked).length;
    return checkedCount > 0 && checkedCount < dataSource.value.length;
});

const selectedItems = computed(() => {
    return dataSource.value.filter(item => item.isChecked);
});

const columns = ref<StkTableColumn<any>[]>([
    {
        dataIndex: 'checkbox',
        align: 'center',
        width: 50,
        fixed: 'left',
        customHeaderCell: () => {
            return h('input', {
                type: 'checkbox',
                checked: isCheckAll.value,
                indeterminate: isCheckPartial.value,
                onChange: (e: Event) => {
                    const checked = (e.target as HTMLInputElement).checked;
                    dataSource.value.forEach(item => {
                        item.isChecked = checked;
                    });
                },
            });
        },
        customCell: ({ row }) => {
            return h('input', {
                type: 'checkbox',
                checked: row.isChecked,
                onChange: (e: Event) => {
                    row.isChecked = (e.target as HTMLInputElement).checked;
                },
            });
        },
    },
    { title: 'Name', dataIndex: 'name', width: 120 },
    { title: 'Age', dataIndex: 'age', width: 80, align: 'right' },
    { title: 'Address', dataIndex: 'address', width: 200 },
]);
</script>

<style scoped>
.info-box h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
}

.selected-items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.selected-item {
    padding: 4px 12px;
    background-color: #1890ff;
    color: white;
    border-radius: 16px;
}

:deep(input[type='checkbox']) {
    width: 16px;
    height: 16px;
    cursor: pointer;
}
</style>
