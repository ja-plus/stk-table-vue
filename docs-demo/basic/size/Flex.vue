<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { useData } from 'vitepress';
import RangeInput from '../../components/RangeInput.vue';
const { isDark } = useData();

const height = ref(150);

const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Address', dataIndex: 'address' },
    { title: 'Gender', dataIndex: 'gender' },
];

const dataSource = ref(
    new Array(20).fill(0).map((_, index) => {
        return {
            name: `Jack ${index}`,
            age: 18 + index,
            address: `Beijing Forbidden City ${index}`,
            gender: index % 2 === 0 ? 'male' : 'female',
        };
    }),
);
</script>
<template>
    <RangeInput v-model="height" min="100" max="800" label="height" suffix="px"></RangeInput>
    <article :class="{ dark: isDark }" :style="{ height: height + 'px' }">
        <header>Flex Content</header>
        <StkTable :columns="columns" :data-source="dataSource"></StkTable>
    </article>
</template>

<style scoped>
article {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--coot-demo-box-border);
}

header {
    min-height: 30px;
    background: var(--coot-demo-box-border);
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-weight: bold;
}

.stk-table {
    flex: 1;
    height: 0;
}
</style>
