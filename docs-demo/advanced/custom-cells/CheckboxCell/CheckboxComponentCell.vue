<template>
    <StkTable
        style="max-height: 400px"
        row-key="id"
        virtual
        bordered
        :columns="columns"
        :data-source="dataSource"
    />
</template>

<script lang="ts" setup>
import { Checkbox as ArcoCheckbox } from '@arco-design/web-vue';
// 不要引入 '@arco-design/web-vue/es/checkbox/style/css'：
// 它会连带引入 es/style/index.css（内含 normalize.css，构建时会被 vitepress 合并进全站 style.css，污染全局样式）
import '@arco-design/web-vue/es/checkbox/style/index.css';
// 仅引入主题 CSS 变量（不含 normalize.css）
import '@arco-design/web-vue/es/style/theme/css-variables.less';
import { Checkbox as AntCheckbox } from 'ant-design-vue';
import 'ant-design-vue/es/checkbox/style/index.js';
import { ElCheckbox } from 'element-plus';
import 'element-plus/es/components/checkbox/style/css';
import { NCheckbox as NaiveCheckbox } from 'naive-ui';
import { ref } from 'vue';
import { createCheckboxCell } from '../../../../src/StkTable/index';
import StkTable from '../../../StkTable.vue';

// Element Plus - checkbox 列（用于行选择）
const { CheckboxCell: ElCheckboxCell, CheckboxAllCell: ElCheckboxAllCell } = createCheckboxCell({
    field: '_isChecked',
    checkboxComponent: ElCheckbox,
    onChange: (checked: boolean, row: any) => {
        console.log('element-plus 行选中变更:', checked, row.name);
    },
    onSelectAll: (checked: boolean) => {
        console.log('element-plus 全选变更:', checked);
    },
});
// Element Plus - checkbox 列（用于行选择）
const { CheckboxCell: AntCheckboxCell, CheckboxAllCell: AntCheckboxAllCell } = createCheckboxCell({
    field: '_isChecked',
    checkboxComponent: AntCheckbox,
    onChange: (checked: boolean, row: any) => {
        console.log('ant-design-vue 行选中变更:', checked, row.name);
    },
    onSelectAll: (checked: boolean) => {
        console.log('ant-design-vue 全选变更:', checked);
    },
});
// Element Plus - checkbox 列（用于行选择）
const { CheckboxCell: ArcoCheckboxCell, CheckboxAllCell: ArcoCheckboxAllCell } = createCheckboxCell(
    {
        field: '_isChecked',
        checkboxComponent: ArcoCheckbox,
        onChange: (checked: boolean, row: any) => {
            console.log('arco-design 行选中变更:', checked, row.name);
        },
        onSelectAll: (checked: boolean) => {
            console.log('arco-design 全选变更:', checked);
        },
    },
);
// Element Plus - checkbox 列（用于行选择）
const { CheckboxCell: NaiveCheckboxCell, CheckboxAllCell: NaiveCheckboxAllCell } =
    createCheckboxCell({
        field: '_isChecked',
        checkboxComponent: NaiveCheckbox,
        onChange: (checked: boolean, row: any) => {
            console.log('naive-ui 行选中变更:', checked, row.name);
        },
        onSelectAll: (checked: boolean) => {
            console.log('naive-ui 全选变更:', checked);
        },
    });

const columns: any[] = [
    {
        key: 'element-plus',
        title: 'element-plus',
        children: [
            {
                dataIndex: 'chkEl',
                customCell: ElCheckboxCell(),
                customHeaderCell: ElCheckboxAllCell(),
            },
        ],
    },
    {
        key: 'ant-design-vue',
        title: 'ant-design-vue',
        children: [
            {
                dataIndex: 'chkAnt',
                customCell: AntCheckboxCell(),
                customHeaderCell: AntCheckboxAllCell(),
            },
        ],
    },
    {
        key: '@arco-design/web-vue',
        title: '@arco-design/web-vue',
        children: [
            {
                dataIndex: 'chkArco',
                customCell: ArcoCheckboxCell(),
                customHeaderCell: ArcoCheckboxAllCell(),
            },
        ],
    },
    {
        key: 'naive-ui',
        title: 'naive-ui',
        children: [
            {
                dataIndex: 'chkNaive',
                customCell: NaiveCheckboxCell(),
                customHeaderCell: NaiveCheckboxAllCell(),
            },
        ],
    },
];

const dataSource = ref<Record<string, any>[]>([
    { id: 1, name: 'Alice', age: 25, address: 'Haidian District, Beijing', _isChecked: true },
    { id: 2, name: 'Bob', age: 28, address: 'Pudong New Area, Shanghai', _isChecked: true },
    { id: 3, name: 'Charlie', age: 32, address: 'Tianhe District, Guangzhou' },
    { id: 4, name: 'David', age: 29, address: 'Nanshan District, Shenzhen' },
    { id: 5, name: 'Eve', age: 27, address: 'Xihu District, Hangzhou' },
    ...Array.from({ length: 15 }, (_, i) => ({
        id: i + 6,
        name: `User ${i + 6}`,
        age: 25 + i,
        address: `Address ${i + 6}`,
    })),
]);
</script>
