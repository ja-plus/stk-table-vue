<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';

const columns: StkTableColumn<any>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Address', dataIndex: 'address' },
    { title: 'Gender', dataIndex: 'gender' },
];

const dataSource = ref<any[]>([]);

function addData() {
    dataSource.value.push(
        ...new Array(5).fill(0).map(
            (_, i) =>
                ({
                    name: `Edward King ${i}`,
                    age: 32,
                    address: `London, Park Lane no. ${i}`,
                    gender: 'male',
                }) as any,
        ),
    );
    dataSource.value = [...dataSource.value];
}
function clearData() {
    dataSource.value = [];
}
</script>
<template>
    <button class="btn" @click="addData">增加5条数据</button>
    <button class="btn" @click="clearData">清除数据</button>
    <StkTable style="height: 200px" :columns="columns" :data-source="dataSource">
        <template #customBottom>
            <div class="custom-bottom">
                <span>Custom Bottom</span>
            </div>
        </template>
    </StkTable>
</template>
<style scoped>
.custom-bottom {
    text-align: center;
    padding: 10px 0;
}
</style>
