<script lang="ts" setup>
import { ref } from 'vue';
import { StkTable, StkTableColumn, createNumberCell, createChangeCell } from '../src/StkTable/index';

/** 明暗主题切换（演示 ChangeCell 暗色配色） */
const theme = ref<'light' | 'dark'>('light');
/** 涨跌颜色方向：false=A股(涨红跌绿)，true=国际(涨绿跌红) */
const colorReverse = ref(false);

// ── 单元格工厂：每种格式建一个实例（与库内置工厂用法一致） ──
const { NumberCell: PriceCtor } = createNumberCell({ decimals: 2 });
const priceCell = PriceCtor();

const { NumberCell: VolCtor } = createNumberCell({ abbr: 'cn' });
const volumeCell = VolCtor();

const { NumberCell: AmountCtor } = createNumberCell({ abbr: 'cn', prefix: '¥' });
const amountCell = AmountCtor();

// ChangeCell 依赖 colorReverse.value，用 getter 让切换即时生效
function buildChangeCells() {
    const { ChangeCell: ChangeCtor } = createChangeCell({
        decimals: 2,
        showSign: true,
        arrow: true,
        colorReverse: colorReverse.value,
    });
    const { ChangeCell: PctCtor } = createChangeCell({
        percent: true,
        decimals: 2,
        showSign: true,
        arrow: true,
        colorReverse: colorReverse.value,
    });
    return {
        changeCell: ChangeCtor(),
        pctCell: PctCtor(),
    };
}

const changeCells = ref(buildChangeCells());

const columns = ref<StkTableColumn<any>[]>([]);

function rebuildColumns() {
    const { changeCell, pctCell } = changeCells.value;
    columns.value = [
        { title: '代码', dataIndex: 'code', width: 90, fixed: 'left' },
        { title: '名称', dataIndex: 'name', width: 110, fixed: 'left' },
        { title: '现价', dataIndex: 'price', width: 100, align: 'right', customCell: priceCell },
        { title: '涨跌额', dataIndex: 'change', width: 110, align: 'right', customCell: changeCell },
        { title: '涨跌幅', dataIndex: 'changePct', width: 110, align: 'right', customCell: pctCell },
        { title: '成交量', dataIndex: 'volume', width: 110, align: 'right', customCell: volumeCell },
        { title: '成交额', dataIndex: 'amount', width: 130, align: 'right', customCell: amountCell },
    ];
}
rebuildColumns();

function toggleColorReverse() {
    colorReverse.value = !colorReverse.value;
    changeCells.value = buildChangeCells();
    rebuildColumns();
}

// ── 样例行情数据（含涨 / 跌 / 平 / 空值） ──
const rawStocks = [
    { code: '600519', name: '贵州茅台', price: 1685.32, change: 23.45, changePct: 0.0141, volume: 3456789, amount: 5823456789 },
    { code: '000858', name: '五粮液', price: 152.18, change: -3.72, changePct: -0.0239, volume: 12345678, amount: 1878123456 },
    { code: '300750', name: '宁德时代', price: 198.65, change: 8.9, changePct: 0.0469, volume: 23456789, amount: 4623456789 },
    { code: '002594', name: '比亚迪', price: 245.0, change: 0, changePct: 0, volume: 8765432, amount: 2147000000 },
    { code: '601318', name: '中国平安', price: 48.76, change: -1.23, changePct: -0.0246, volume: 45678901, amount: 2223456789 },
    { code: '600036', name: '招商银行', price: 36.42, change: 0.58, changePct: 0.0162, volume: 34567890, amount: 1258765432 },
    { code: '000001', name: '平安银行', price: 11.85, change: -0.09, changePct: -0.0075, volume: 56789012, amount: 673456789 },
    { code: '688981', name: '中芯国际', price: 52.3, change: 2.15, changePct: 0.0429, volume: 18765432, amount: 981234567 },
    { code: '600900', name: '长江电力', price: 27.66, change: null, changePct: null, volume: 9876543, amount: 273123456 },
    { code: '601899', name: '紫金矿业', price: 15.42, change: 0.33, changePct: 0.0219, volume: 67890123, amount: 1046789012 },
];

const dataSource = ref(rawStocks.map((s, i) => ({ id: i, ...s })));
</script>

<template>
    <div style="width: 100%; padding: 12px">
        <h3>NumberCell / ChangeCell 演示（金融行情）</h3>
        <div style="margin-bottom: 8px; display: flex; gap: 8px">
            <button @click="theme = theme === 'light' ? 'dark' : 'light'">切换主题：{{ theme }}</button>
            <button @click="toggleColorReverse">涨跌配色：{{ colorReverse ? '国际(涨绿跌红)' : 'A股(涨红跌绿)' }}</button>
        </div>
        <StkTable
            row-key="id"
            :theme="theme"
            :columns="columns"
            :data-source="dataSource"
            virtual
            style="height: 360px"
            fixed-col-shadow
        ></StkTable>
    </div>
</template>
