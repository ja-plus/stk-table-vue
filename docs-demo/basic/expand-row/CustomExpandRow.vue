<script lang="ts" setup>
import { h, ref, useTemplateRef } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '@/StkTable/index';
import CheckItem from '../../components/CheckItem.vue';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();

const virtual = ref(false);

const stkTableRef = useTemplateRef('stkTableRef');

const columns = ref<StkTableColumn<any>[]>([
    { type: 'expand', dataIndex: '', width: 50, align: 'center', fixed: 'left' },
    {
        type: 'expand',
        dataIndex: 'name',
        title: t('customExpandRow'),
        width: 80,
        customCell: props => {
            let className = 'custom-expand-icon';
            if (props.expanded && props.expanded.dataIndex === 'name') {
                className += ' custom-expand-icon-active';
            }
            return h(
                'div',
                {
                    style: 'display: flex; align-items: center; ',
                    onClick: () => handleCustomCellClick(props.row, props.col),
                },
                [h('span', { class: className }), h('span', props.cellValue)],
            );
        },
    },
    { dataIndex: 'id', title: t('id') + '(100px)', width: '100px' },
    { dataIndex: 'address', title: t('address') },
    { dataIndex: 'email', title: t('email') },
    { dataIndex: 'phone', title: t('phone') },
    { dataIndex: 'website', title: t('website') },
    { dataIndex: 'company', title: t('company') },
    { dataIndex: 'catchPhrase', title: t('catchPhrase') },
    { dataIndex: 'bs', title: t('bs') },
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
function handleCustomCellClick(row: any, col: StkTableColumn<any>) {
    stkTableRef.value?.setRowExpand(row, null, { col, silent: true });
}
function handleToggleRowExpand(data: any) {
    console.log('handleToggleRowExpand', data);
}
</script>
<template>
    <div>
        <CheckItem v-model="virtual" :text="t('virtual')"></CheckItem>
        <StkTable
            ref="stkTableRef"
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
