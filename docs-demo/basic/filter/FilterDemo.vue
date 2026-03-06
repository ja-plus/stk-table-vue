<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { useFilter } from '../../../src/StkTable/components/Filter';

// 表格数据
const dataSource = ref(
    Array.from({ length: 20 }, (_, i) => ({
        key: i,
        name: `User ${i}`,
        age: 20 + (i % 10),
        gender: i % 2 === 0 ? 'male' : 'female',
        status: ['active', 'inactive', 'pending'][i % 3],
    })),
);

// 表格引用
const stkTableRef = ref<StkTable>();

// 使用筛选功能
const { Filter } = useFilter(stkTableRef, {
    onChange: filterStatus => {
        console.log('筛选状态变化:', filterStatus.value);
        // 这里可以处理远程筛选逻辑
    },
    filterRemote: false, // 使用本地筛选
});
</script>

<template>
    <div style="padding: 20px">
        <h3>筛选功能演示</h3>
        <p>点击表头右侧的「筛选」按钮，可以打开筛选下拉列表进行多选筛选。</p>

        <StkTable
            ref="stkTableRef"
            style="max-height: 400px"
            :columns="columns"
            :data-source="dataSource"
        ></StkTable>
    </div>
</template>
