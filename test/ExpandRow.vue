<script lang="ts" setup>
import { h, ref } from 'vue';
import StkTable from '../src/StkTable/StkTable.vue';
import { StkTableColumn } from '../src/StkTable/types';

const columns = ref<StkTableColumn<any>[]>([
    { type: 'expand', dataIndex: '', width: 50, align: 'center', fixed: 'left' },
    {
        type: 'expand',
        dataIndex: 'name',
        title: 'custom expand',
        width: 80,
        customCell: props => {
            let className = 'custom-expand-icon';
            if (props.expanded && props.expanded.dataIndex === 'name') {
                className += ' custom-expand-icon-active';
            }
            return h('div', [h('span', { className }, '✈'), h('span', props.cellValue)]);
        },
    },
    { dataIndex: 'id', title: 'id(100px)', width: '100px' },
    { dataIndex: 'address', title: 'address' },
    { dataIndex: 'email', title: 'email' },
    { dataIndex: 'phone', title: 'phone' },
    { dataIndex: 'website', title: 'website' },
    { dataIndex: 'company', title: 'company' },
    { dataIndex: 'catchPhrase', title: 'catchPhrase' },
    { dataIndex: 'bs', title: 'bs' },
]);

const data = new Array(100).fill(0).map((it, index) => {
    return {
        id: index,
        name: 'name' + index,
        address: 'sss',
        email: 'email' + index + '@example.com',
        phone: '123-456-7890',
        website: 'www.example.com',
        company: 'Company' + index,
        catchPhrase: 'Catch Phrase' + index,
        bs: 'BS' + index,
    };
});
function handleToggleRowExpand(data) {
    console.log('handleToggleRowExpand', data);
}
</script>
<template>
    <div>
        <h2>Expand Row</h2>
        <StkTable row-key="id" style="height: 400px" virtual :columns="columns" :data-source="data" @toggle-row-expand="handleToggleRowExpand">
            <template #expand="{ row, col }">
                <div>
                    <h4>trigger: {{ col.title || '--' }}</h4>
                    <p>id: {{ row.id }}, phone: {{ row.phone }}</p>
                </div>
            </template>
        </StkTable>
    </div>
</template>
<style scoped lang="less">
:deep(.stk-table) {
    .custom-expand-icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border: 1px solid;
        transition: all 0.2s ease;
    }
    .custom-expand-icon-active {
        background-color: #1890ff;
        color: #fff;
        transform: rotate(90deg);
    }
}
</style>
