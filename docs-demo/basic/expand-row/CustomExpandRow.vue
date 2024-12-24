<script lang="ts" setup>
import { h, ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '@/StkTable/index';
import CheckItem from '../components/CheckItem.vue';

const virtual = ref(false);

const columns = ref<StkTableColumn<any>[]>([
    { type: 'expand', dataIndex: '', width: 50, align: 'center', fixed: 'left' },
    {
        type: 'expand',
        dataIndex: 'name',
        title: '自定义展开行',
        width: 80,
        customCell: props => {
            let className = 'custom-expand-icon';
            if (props.expanded && props.expanded.dataIndex === 'name') {
                className += ' custom-expand-icon-active';
            }
            return h('div', { style: 'display: flex; align-items: center; ' }, [h('span', { class: className }), h('span', props.cellValue)]);
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
function handleToggleRowExpand(data: any) {
    console.log('handleToggleRowExpand', data);
}
</script>
<template>
    <div>
        <CheckItem v-model="virtual" text="virtual"></CheckItem>
        <StkTable
            row-key="id"
            style="height: 400px"
            :virtual="virtual"
            :expand-config="{
                height: 80,
            }"
            :columns="columns"
            :data-source="data"
            @toggle-row-expand="handleToggleRowExpand"
        >
            <template #expand="{ row, col }">
                <div>trigger: {{ col.title || '--' }}</div>
                <p>id: {{ row.id }}, phone: {{ row.phone }}</p>
                <p>name: {{ row.name }}</p>
                <p>website: {{ row.website }}</p>
            </template>
        </StkTable>
    </div>
</template>
<style scoped>
:deep(.stk-table .custom-expand-icon) {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-right: 6px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 1px solid;
    transition: all 0.2s ease;
}
:deep(.stk-table .custom-expand-icon-active) {
    background-color: #1890ff;
    color: #fff;
    transform: rotate(90deg);
}
</style>
