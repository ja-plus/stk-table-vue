<template>
    <StkTable row-key="code" :columns="columns" :data-source="dataSource" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../../StkTable.vue';
// 开发中功能：此处从源码导入；发布后可改为 import { createChangeCell, createNumberCell } from 'stk-table-vue'
import { createChangeCell, createNumberCell, type StkTableColumn } from '../../../../src/StkTable';
import { useI18n } from '../../../hooks/useI18n/index';

const { t } = useI18n();

// 现价：普通数字格式化
const { NumberCell: PriceCtor } = createNumberCell({ decimals: 2 });
const priceCell = PriceCtor();

// 涨跌额：带符号 + 箭头，默认 A 股涨红跌绿
const { ChangeCell: ChangeCtor } = createChangeCell({ decimals: 2, showSign: true, arrow: true });
const changeCell = ChangeCtor();

// 涨跌幅：百分比 + 符号 + 箭头
const { ChangeCell: PctCtor } = createChangeCell({ percent: true, decimals: 2, showSign: true, arrow: true });
const pctCell = PctCtor();

interface RowData {
    code: string;
    price: number;
    change: number;
    changePct: number;
}

const columns: StkTableColumn<RowData>[] = [
    { title: t('code'), dataIndex: 'code', width: 100 },
    { title: t('price'), dataIndex: 'price', width: 100, align: 'right', customCell: priceCell },
    { title: t('change'), dataIndex: 'change', width: 120, align: 'right', customCell: changeCell },
    { title: t('changePercent'), dataIndex: 'changePct', width: 120, align: 'right', customCell: pctCell },
];

const dataSource = ref<RowData[]>([
    { code: '600519', price: 1685.32, change: 23.45, changePct: 0.0141 },
    { code: '000858', price: 152.18, change: -3.72, changePct: -0.0239 },
    { code: '300750', price: 198.65, change: 8.9, changePct: 0.0469 },
    { code: '002594', price: 245.0, change: 0, changePct: 0 },
    { code: '601318', price: 48.76, change: -1.23, changePct: -0.0246 },
]);
</script>
