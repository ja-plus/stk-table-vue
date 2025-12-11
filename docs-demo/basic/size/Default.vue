<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import RangeInput from '../../components/RangeInput.vue';
import { useI18n } from '../../hooks/useI18n';
const { t } = useI18n();

const width = ref(400);
const height = ref(150);

const columns: StkTableColumn<any>[] = [
    { title: t('name'), dataIndex: 'name' },
    { title: t('age'), dataIndex: 'age' },
    { title: t('address'), dataIndex: 'address' },
    { title: t('gender'), dataIndex: 'gender' },
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
            <RangeInput
                v-model="width"
                min="100"
                max="800"
                :label="t('width')"
                suffix="px"
            ></RangeInput>
        </div>
        <div>
            <RangeInput
                v-model="height"
                min="100"
                max="800"
                :label="t('height')"
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
