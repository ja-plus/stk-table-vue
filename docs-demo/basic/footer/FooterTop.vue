<script lang="ts" setup>
import { ref, watch } from 'vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import StkTable from '../../StkTable.vue';
import { useI18n } from '../../hooks/useI18n';

type Data = {
    seq?: string;
    name: string;
    age: number;
    salary: number;
    bonus: number;
};
const { t } = useI18n();

const columns: StkTableColumn<Data>[] = [
    { type: 'seq', title: 'No.', dataIndex: 'seq' as any, width: 70 },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age', align: 'right' },
    { title: 'Salary', dataIndex: 'salary', align: 'right' },
    { title: 'Bonus', dataIndex: 'bonus', align: 'right' },
];

const dataSource = ref<Data[]>([
    { name: 'Jack', age: 18, salary: 5000, bonus: 1000 },
    { name: 'Tom', age: 20, salary: 6000, bonus: 1500 },
    { name: 'Lucy', age: 22, salary: 7000, bonus: 2000 },
    { name: 'Lily', age: 24, salary: 8000, bonus: 2500 },
    // 100 rows
    ...Array.from({ length: 100 }, (_, i) => ({
        name: `User${i}`,
        age: 20 + i,
        salary: 5000 + i * 100,
        bonus: 1000 + i * 50,
    })),
]);
const footerData = ref<Data[]>([]);

// 监听数据变化，动态计算合计
function calculateFootData() {
    if (dataSource.value.length === 0) {
        footerData.value = [];
        return;
    }

    const totals: Data = {
        seq: t('Total'),
        name: '',
        age: 0,
        salary: 0,
        bonus: 0,
    };

    // 计算数值字段的总和
    dataSource.value.forEach(row => {
        totals.age += row.age;
        totals.salary += row.salary;
        totals.bonus += row.bonus;
    });

    footerData.value = [
        totals,
        {
            seq: t('Average'),
            name: '',
            age: parseFloat((totals.age / dataSource.value.length).toFixed(2)),
            salary: parseFloat((totals.salary / dataSource.value.length).toFixed(2)),
            bonus: parseFloat((totals.bonus / dataSource.value.length).toFixed(2)),
        },
    ];
}

// 初始化计算
calculateFootData();

// 监听数据源变化
watch(dataSource, calculateFootData, { deep: true });
</script>
<template>
    <StkTable
        style="height: 300px"
        row-key="name"
        :columns="columns"
        :data-source="dataSource"
        :footer-data="footerData"
        :footer-config="{ position: 'top' }"
    ></StkTable>
</template>