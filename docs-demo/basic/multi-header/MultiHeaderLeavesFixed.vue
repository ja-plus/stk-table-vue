<script setup lang="ts">
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { onMounted, useTemplateRef } from 'vue';
import { useI18n } from '../../hooks/useI18n';
const { t } = useI18n();

const stkTableRef = useTemplateRef('stkTableRef');

const columns: StkTableColumn<any>[] = [
    {
        dataIndex: 'Basic',
        title: t('basic'),
        children: [
            { dataIndex: 'id', title: t('id'), width: 100, fixed: 'left' },
            {
                dataIndex: 'lv2',
                title: t('lv2'),
                width: 100,
                children: [
                    { dataIndex: 'lv2_1', title: t('lv2_1'), width: 100, fixed: 'left' },
                    { dataIndex: 'lv2_2', title: t('lv2_2'), width: 100, fixed: 'left' },
                ],
            },
        ],
    },
    {
        dataIndex: 'age',
        title: t('age'),
        width: '50px',
        children: [
            { dataIndex: 'id3', title: t('id'), width: 50 },
            {
                dataIndex: 'lv5',
                title: t('lv2'),
                width: 100,
            },
        ],
    },
    { dataIndex: 'email', title: t('email'), width: '130px' },
    {
        dataIndex: 'other',
        title: t('other'),
        // children: new Array(2).fill(0).map((it, i) => {
        //     return {
        //         dataIndex: 'other' + i,
        //         title: 'Other ' + i,
        //         width: 100,
        //     };
        // }),
    },
    {
        dataIndex: 'right',
        title: t('right'),
        children: [
            { dataIndex: 'right-1', title: t('right1'), width: 50, fixed: 'right' },
            { dataIndex: 'right-2', title: t('right2'), width: 100, fixed: 'right' },
        ],
    },
];
const dataSource = new Array(50).fill(0).map((it, i) => {
    return {
        id: i,
        lv2_1: 'lv2.1',
        lv2_2: 'lv2.2',
        age: i,
        email: i + '@qq.com',
    };
});

onMounted(() => {
    window.setTimeout(() => {
        (stkTableRef.value as any)?.scrollTo(0, 100);
    });
});
</script>
<template>
    <StkTable
        ref="stkTableRef"
        style="height: 200px"
        row-key="id"
        fixed-col-shadow
        virtual
        :columns="columns"
        :data-source="dataSource"
    >
    </StkTable>
</template>
