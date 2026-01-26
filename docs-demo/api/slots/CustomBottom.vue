<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();

const columns: StkTableColumn<any>[] = [
    { title: t('name'), dataIndex: 'name' },
    { title: t('age'), dataIndex: 'age' },
    { title: t('address'), dataIndex: 'address' },
    { title: t('gender'), dataIndex: 'gender' },
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
    <button class="btn" @click="addData">{{ t('addFiveData') }}</button>
    <button class="btn" @click="clearData">{{ t('clearData') }}</button>
    <StkTable style="height: 200px" scrollbar :columns="columns" :data-source="dataSource">
        <template #customBottom>
            <div class="custom-bottom">
                <span>{{ t('customBottom') }}</span>
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
