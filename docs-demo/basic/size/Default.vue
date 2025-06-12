<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import RangeInput from '../../components/RangeInput.vue';

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
</script>
<template>
    <div>
        <div>
            <RangeInput v-model="width" min="100" max="800" label="width" suffix="px"></RangeInput>
        </div>
        <div>
            <RangeInput
                v-model="height"
                min="100"
                max="800"
                label="height"
                suffix="px"
            ></RangeInput>
        </div>
        <div style="overflow: auto">
            <StkTable
                :style="{ width: width + 'px', height: height + 'px' }"
                :columns="columns"
                :data-source="dataSource"
            ></StkTable>
        </div>
    </div>
</template>
