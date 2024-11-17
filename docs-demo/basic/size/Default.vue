<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';

const width = ref(400);
const height = ref(150);

const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Address', dataIndex: 'address' },
    { title: 'Gender', dataIndex: 'gender' },
];

const dataSource = ref(
    new Array(3).fill(0).map((_, index) => {
        return {
            name: `Jack ${index}`,
            age: 18 + index,
            address: `Beijing Forbidden City ${index}`,
            gender: index % 2 === 0 ? 'male' : 'female',
        };
    }),
);

function handleWidthInput(e) {
    width.value = e.target.value;
}
function handleHeightInput(e) {
    height.value = e.target.value;
}
</script>
<template>
    <div>width:<input :value="width" type="range" min="100" max="800" @input="handleWidthInput" />{{ width }}px</div>
    <div>height:<input :value="height" type="range" min="100" max="800" @input="handleHeightInput" />{{ height }}px</div>
    <StkTable :style="{ width: width + 'px', height: height + 'px' }" :columns="columns" :data-source="dataSource"></StkTable>
</template>
