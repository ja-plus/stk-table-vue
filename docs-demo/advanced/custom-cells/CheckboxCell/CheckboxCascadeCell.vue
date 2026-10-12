<template>
    <StkTable
        style="max-height: 300px"
        row-key="id"
        bordered
        :columns="columns"
        :data-source="dataSource"
        :tree-config="{ defaultExpandAll: true }"
    />
    <div class="info-box">
        <h3>{{ t('selected') }}:</h3>
        <div class="selected-items">
            <template v-if="selectedLeaves.length > 0">
                <span v-for="item in selectedLeaves" :key="item.id" class="selected-item">
                    {{ item.name }}
                </span>
            </template>
            <span v-else>{{ t('noSelect') }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import StkTable from '../../../StkTable.vue';
import { createCheckboxCell } from '../../../../src/StkTable/index';
import { useI18n } from '../../../hooks/useI18n/index';

const { t } = useI18n();

const { CheckboxCell, CheckboxAllCell } = createCheckboxCell({
    field: '_isChecked',
    // 树形数据下开启勾选级联：勾父连带全部子孙、父行半选由子孙推导、表头按叶子行统计
    cascade: true,
    onChange: (checked: any, row: any) => {
        console.log('行选中变更（用户点击的行）:', checked, row.name);
    },
    onSelectAll: (checked: any) => {
        console.log('全选变更:', checked);
    },
});

const columns = [
    {
        dataIndex: 'checkbox',
        align: 'center',
        width: 70,
        customCell: CheckboxCell(),
        customHeaderCell: CheckboxAllCell(),
    },
    { type: 'tree-node', title: t('area'), dataIndex: 'name', width: 180 },
    { title: t('population'), dataIndex: 'population', width: 120, align: 'right' },
    { title: t('gdp'), dataIndex: 'gdp', width: 120, align: 'right' },
];

const dataSource = ref<Record<string, any>[]>([
    {
        id: 'asia',
        name: 'Asia',
        children: [
            { id: 'china', name: 'China', population: 1400000000, gdp: 14100 },
            {
                id: 'japan',
                name: 'Japan',
                population: 126000000,
                gdp: 4200,
                children: [
                    { id: 'tokyo', name: 'Tokyo', population: 37000000, gdp: 1020 },
                    { id: 'osaka', name: 'Osaka', population: 19000000, gdp: 380 },
                ],
            },
        ],
    },
    {
        id: 'europe',
        name: 'Europe',
        children: [
            { id: 'germany', name: 'Germany', population: 83000000, gdp: 4500 },
            { id: 'france', name: 'France', population: 67000000, gdp: 3050 },
        ],
    },
]);

/**
 * 选中叶子行（提交口径）：cascade 下父行勾选态由子孙推导，
 * 业务取选中集时应遍历叶子行，避免父行与子孙重复计数。
 */
const selectedLeaves = computed(() => {
    const result: Record<string, any>[] = [];
    const walk = (list: Record<string, any>[]) => {
        list.forEach(item => {
            if (item.children?.length) {
                walk(item.children);
            } else if (item._isChecked) {
                result.push(item);
            }
        });
    };
    walk(dataSource.value);
    return result;
});
</script>

<style scoped>
.info-box h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
}

.selected-items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.selected-item {
    padding: 4px 12px;
    background-color: #1890ff;
    color: white;
    border-radius: 16px;
}
</style>
