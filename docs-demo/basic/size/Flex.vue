<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';

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

function handleHeightInput(e) {
    height.value = e.target.value;
}
</script>
<template>
    <div><input :value="height" type="range" min="100" max="800" @input="handleHeightInput" />{{ height }}px</div>
    <article :style="{ height: height + 'px' }">
        <header>Flex Content</header>
        <StkTable :columns="columns" :data-source="dataSource"></StkTable>
    </article>
</template>

<style scoped>
article {
    display: flex;
    flex-direction: column;
    border: 1px solid #f0f0f0;
}

header {
    min-height: 30px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-weight: bold;
}

.stk-table {
    flex: 1;
    margin: 8px;
    height: 0;
}
</style>
