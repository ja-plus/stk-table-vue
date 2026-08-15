/**
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import { StkTable } from '@/StkTable';
import { describe, expect, test } from 'vitest';

function nextFrame() {
    return new Promise(resolve => setTimeout(resolve, 50));
}

/** 模拟横向滚动（happy-dom 下设置 scrollLeft 后手动派发 scroll 事件） */
async function scrollXTo(wrapper, left) {
    const container = wrapper.element;
    container.scrollLeft = left;
    container.dispatchEvent(new Event('scroll'));
    await nextFrame();
    await wrapper.vm.$nextTick();
}

/** 获取指定行的可见 td 的 data-col-key 列表 */
function getRowTdColKeys(wrapper, rowKey) {
    return wrapper
        .findAll(`tbody.stk-tbody-main > tr[data-row-key="${rowKey}"] > td`)
        .map(td => td.attributes('data-col-key'))
        .filter(Boolean);
}

/** 行的总 colspan 数（含合并单元格） */
function getRowSpanSum(wrapper, selector) {
    return wrapper.findAll(selector).reduce((sum, cell) => sum + (Number(cell.attributes('colspan')) || 1), 0);
}

describe('virtual-x with mergeCells colspan', () => {
    const columns = new Array(12).fill(0).map((_, i) => ({ title: `Col ${i}`, dataIndex: `c${i}`, width: 100 }));
    // c3 列合并 3 列（覆盖 c3 c4 c5）
    columns[3].mergeCells = ({ row }) => (row.colspan ? { colspan: row.colspan } : void 0);
    const dataSource = new Array(6).fill(0).map((_, i) => ({ id: i, colspan: 3, c3: `merged-${i}` }));

    const wrapper = mount(StkTable, {
        props: {
            rowKey: 'id',
            virtualX: true,
            columns,
            dataSource,
        },
    });

    test('合并单元格锚点列滚出可视区左侧时，依然渲染完整合并单元格', async () => {
        // 容器宽度 200(DEFAULT_TABLE_WIDTH)。scrollLeft=450 时原始可视列为 [4,7)，
        // c4 c5 被 c3(colspan=3) 覆盖，需将可视范围左扩到锚点列 c3
        await scrollXTo(wrapper, 450);

        const colKeys = getRowTdColKeys(wrapper, '0');
        expect(colKeys).toContain('c3');
        expect(colKeys).not.toContain('c4');
        expect(colKeys).not.toContain('c5');

        const c3 = wrapper.find('tbody.stk-tbody-main > tr[data-row-key="0"] > td[data-col-key="c3"]');
        expect(c3.attributes('colspan')).toBe('3');

        // vt-x-left 宽度应为修正后起始列(c3)之前的宽度和 = 300
        expect(wrapper.find('thead th.vt-x-left').attributes('style')).toContain('width: 300px');
        // 修正后 endIndex=7，右侧占位宽度 = c7..c11 = 500
        expect(wrapper.find('thead th.vt-x-right').attributes('style')).toContain('width: 500px');
    });

    test('合并单元格超出可视区右边界时，扩展可视范围保证完整渲染', async () => {
        // scrollLeft=250 时原始可视列为 [2,5)，c3 的合并区域覆盖到 c5，需右扩到 6
        await scrollXTo(wrapper, 250);

        const colKeys = getRowTdColKeys(wrapper, '0');
        expect(colKeys).toEqual(['c2', 'c3']);

        // 右侧占位宽度 = c6..c11 = 600
        expect(wrapper.find('thead th.vt-x-right').attributes('style')).toContain('width: 600px');
    });

    test('滚回左侧后可视范围恢复正常', async () => {
        await scrollXTo(wrapper, 0);

        const colKeys = getRowTdColKeys(wrapper, '0');
        expect(colKeys).not.toContain('c3');
        expect(wrapper.find('thead th.vt-x-left').attributes('style')).toContain('width: 0px');
    });
});

describe('virtual + virtual-x with mergeCells colspan', () => {
    const columns = new Array(12).fill(0).map((_, i) => ({ title: `Col ${i}`, dataIndex: `c${i}`, width: 100 }));
    columns[3].mergeCells = ({ row }) => (row.colspan ? { colspan: row.colspan } : void 0);
    const dataSource = new Array(200).fill(0).map((_, i) => ({ id: i, colspan: 3, c3: `merged-${i}` }));

    const wrapper = mount(StkTable, {
        props: {
            rowKey: 'id',
            virtual: true,
            virtualX: true,
            columns,
            dataSource,
        },
    });

    test('纵向虚拟滚动下横向合并单元格依然正确', async () => {
        await scrollXTo(wrapper, 450);

        const colKeys = getRowTdColKeys(wrapper, '0');
        expect(colKeys).toContain('c3');
        expect(colKeys).not.toContain('c4');
        expect(colKeys).not.toContain('c5');

        const c3 = wrapper.find('tbody.stk-tbody-main > tr[data-row-key="0"] > td[data-col-key="c3"]');
        expect(c3.attributes('colspan')).toBe('3');
    });
});

describe('virtual-x with huge colspan', () => {
    const COL_COUNT = 160;
    const HUGE_COLSPAN = 120;
    const columns = new Array(COL_COUNT).fill(0).map((_, i) => ({ title: `Col ${i}`, dataIndex: `c${i}`, width: 100 }));
    // c5 列合并 120 列（覆盖 c5..c124）
    columns[5].mergeCells = ({ row }) => (row.colspan ? { colspan: row.colspan } : void 0);
    const dataSource = new Array(6).fill(0).map((_, i) => ({ id: i, colspan: i < 4 ? HUGE_COLSPAN : void 0, c5: `merged-${i}` }));

    const wrapper = mount(StkTable, {
        props: {
            rowKey: 'id',
            virtualX: true,
            columns,
            dataSource,
        },
    });

    test('视口位于超长合并区间中部时，左扩到锚点列并完整渲染合并单元格', async () => {
        // 容器宽度 200(DEFAULT_TABLE_WIDTH)，列宽 100。scrollLeft=6000 时原始可视列 [60,62)，
        // 全部被 c5(colspan=120) 覆盖，可视范围需左扩到锚点列 c5（范围变为 [5,62)）
        await scrollXTo(wrapper, 6000);

        const colKeys = getRowTdColKeys(wrapper, '0');
        expect(colKeys).toEqual(['c5']);

        const anchor = wrapper.find('tbody.stk-tbody-main > tr[data-row-key="0"] > td[data-col-key="c5"]');
        expect(anchor.attributes('colspan')).toBe('120');

        // 左侧占位宽度 = c5 之前所有列宽度和 = 5 * 100 = 500
        expect(wrapper.find('thead th.vt-x-left').attributes('style')).toContain('width: 500px');
    });

    test('超长合并区域跨越视口右边界时，右扩到合并末端', async () => {
        // scrollLeft=11800 时原始可视列 [118,120)，c5 合并区域覆盖到 c124，需右扩到 125
        await scrollXTo(wrapper, 11800);

        const colKeys = getRowTdColKeys(wrapper, '0');
        expect(colKeys).toEqual(['c5']);

        // 右侧占位宽度 = c125..c159 = 35 * 100 = 3500
        expect(wrapper.find('thead th.vt-x-right').attributes('style')).toContain('width: 3500px');
    });

    test('滚出合并区域后可视范围恢复正常（不再持有全部合并列）', async () => {
        // scrollLeft=14000 时可视列 [140,142)，位于合并区域 c5..c124 之外
        await scrollXTo(wrapper, 14000);

        expect(wrapper.find('tbody.stk-tbody-main td[data-col-key="c5"]').exists()).toBe(false);
        // 该行 td 数回到正常可视列数（2 列），而不是 120+ 列
        const tds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="0"] > td[data-col-key]');
        expect(tds.length).toBe(2);
    });

    test('非合并行：左扩展区合并为单个占位 td，右扩展区不渲染', async () => {
        // scrollLeft=11800：原始可视列 [118,120)，修正后 [5,125)。
        // row5 无合并：左扩展区 c5..c117（113 列）合并为 1 个占位 td，
        // 可视列 c118/c119 正常渲染，右扩展区 c120..c124 不渲染
        await scrollXTo(wrapper, 11800);

        expect(getRowTdColKeys(wrapper, '5')).toEqual(['c118', 'c119']);

        const tds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="5"] > td');
        // vt-x-left + 占位(colspan=113) + c118 + c119 + vt-x-right
        expect(tds.length).toBe(5);
        expect(tds[1].classes()).toContain('vt-above-viewport-ph');
        expect(tds[1].attributes('colspan')).toBe('113');

        // 右扩展区单元格不渲染
        expect(wrapper.find('tbody.stk-tbody-main > tr[data-row-key="5"] > td[data-col-key="c120"]').exists()).toBe(false);

        // 合并行不受影响：仍只有锚点 td（覆盖列照旧隐藏），不产生占位
        const mergedTds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="0"] > td');
        expect(mergedTds.length).toBe(3);
        expect(mergedTds[1].attributes('data-col-key')).toBe('c5');
        expect(mergedTds[1].attributes('colspan')).toBe('120');
    });

    test('非合并行：视口位于合并区中部时占位 colspan 随左扩展宽度变化', async () => {
        // scrollLeft=6000：原始可视列 [60,62)，修正后 [5,125)，左扩展 55 列，右扩展 c62..c124
        await scrollXTo(wrapper, 6000);

        expect(getRowTdColKeys(wrapper, '5')).toEqual(['c60', 'c61']);

        const tds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="5"] > td');
        // vt-x-left + 占位(colspan=55) + c60 + c61 + vt-x-right
        expect(tds.length).toBe(5);
        expect(tds[1].attributes('colspan')).toBe('55');
    });

    test('无修正扩展时非合并行恢复正常逐列渲染', async () => {
        // scrollLeft=0：可视列 [0,2)，与合并区域 c5..c124 无交集，无修正
        await scrollXTo(wrapper, 0);

        expect(getRowTdColKeys(wrapper, '5')).toEqual(['c0', 'c1']);
        const phTds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="5"] > td.vt-above-viewport-ph');
        expect(phTds.length).toBe(0);
    });
});

describe('virtual-x multi-level header with mergeCells colspan', () => {
    const leafCols = new Array(12).fill(0).map((_, i) => ({ title: `Col ${i}`, dataIndex: `c${i}`, width: 100 }));
    leafCols[3].mergeCells = ({ row }) => (row.colspan ? { colspan: row.colspan } : void 0);
    const columns = [
        { title: 'G1', children: leafCols.slice(0, 3) },
        { title: 'G2', children: leafCols.slice(3, 6) },
        { title: 'G3', children: leafCols.slice(6, 9) },
        { title: 'G4', children: leafCols.slice(9, 12) },
    ];
    const dataSource = new Array(6).fill(0).map((_, i) => ({ id: i, colspan: 3, c3: `merged-${i}` }));

    const wrapper = mount(StkTable, {
        props: {
            rowKey: 'id',
            virtualX: true,
            columns,
            dataSource,
        },
    });

    test('多级表头下合并单元格与 spacer 对齐', async () => {
        await scrollXTo(wrapper, 450);

        const colKeys = getRowTdColKeys(wrapper, '0');
        expect(colKeys).toContain('c3');
        expect(colKeys).not.toContain('c4');
        expect(colKeys).not.toContain('c5');

        // thead 各行与 tbody 行的总列数（colspan 之和）必须一致
        const tbodySpanSum = getRowSpanSum(wrapper, 'tbody.stk-tbody-main > tr[data-row-key="0"] > td');
        const theadRow0SpanSum = getRowSpanSum(wrapper, 'thead > tr:nth-child(1) > th');
        const theadRow1SpanSum = getRowSpanSum(wrapper, 'thead > tr:nth-child(2) > th');
        expect(tbodySpanSum).toBe(theadRow0SpanSum);
        expect(tbodySpanSum).toBe(theadRow1SpanSum);
    });
});

describe('virtual-x with mergeCells rowspan', () => {
    const columns = new Array(12).fill(0).map((_, i) => ({ title: `Col ${i}`, dataIndex: `c${i}`, width: 100 }));
    // c3 列行合并 3 行
    columns[3].mergeCells = ({ row }) => (row.rowspan ? { rowspan: row.rowspan } : void 0);
    const dataSource = new Array(6).fill(0).map((_, i) => ({ id: i, rowspan: i === 0 ? 3 : void 0, c3: `merged-${i}` }));

    const wrapper = mount(StkTable, {
        props: {
            rowKey: 'id',
            virtualX: true,
            columns,
            dataSource,
        },
    });

    test('锚点列可见时，行合并单元格正常渲染', async () => {
        // scrollLeft=250 可视列 [2,5) 包含锚点列 c3
        await scrollXTo(wrapper, 250);

        const anchor = wrapper.find('tbody.stk-tbody-main > tr[data-row-key="0"] > td[data-col-key="c3"]');
        expect(anchor.attributes('rowspan')).toBe('3');
        // 被覆盖行不渲染 c3 单元格
        expect(wrapper.find('tbody.stk-tbody-main > tr[data-row-key="1"] > td[data-col-key="c3"]').exists()).toBe(false);
        expect(wrapper.find('tbody.stk-tbody-main > tr[data-row-key="2"] > td[data-col-key="c3"]').exists()).toBe(false);
    });

    test('锚点列滚出可视区时，行合并不产生残留单元格', async () => {
        // scrollLeft=450 可视列不包含 c3
        await scrollXTo(wrapper, 450);

        expect(wrapper.find('tbody.stk-tbody-main td[data-col-key="c3"]').exists()).toBe(false);
    });
});

/** 模拟纵向滚动（happy-dom 下设置 scrollTop 后手动派发 scroll 事件） */
async function scrollYTo(wrapper, top) {
    const container = wrapper.element;
    container.scrollTop = top;
    container.dispatchEvent(new Event('scroll'));
    await nextFrame();
    await wrapper.vm.$nextTick();
}

describe('virtual with mergeCells rowspan: above-viewport placeholder', () => {
    const columns = new Array(8).fill(0).map((_, i) => ({ title: `Col ${i}`, dataIndex: `c${i}`, width: 100 }));
    // c0 列在 row0 行合并 4 行；c3 列在 row2 行合并 2 行
    columns[0].mergeCells = ({ row, rowIndex }) => (rowIndex === 0 && row.rowspan ? { rowspan: row.rowspan } : void 0);
    columns[3].mergeCells = ({ row, rowIndex }) => (rowIndex === 2 && row.rowspan ? { rowspan: row.rowspan } : void 0);

    const dataSource = new Array(20).fill(0).map((_, i) => ({
        id: i,
        rowspan: i === 0 ? 4 : i === 2 ? 2 : void 0,
        c0: i === 0 ? 'merged-c0' : void 0,
        c3: i === 2 ? 'merged-c3' : void 0,
    }));

    const wrapper = mount(StkTable, {
        props: {
            rowKey: 'id',
            virtual: true,
            height: 100,
            rowHeight: 28,
            columns,
            dataSource,
        },
    });

    test('视口上方行只渲染跨越视口的合并单元格，其余逐列单独占位', async () => {
        // rowHeight=28, height=100 => pageSize ~3。
        // scrollTop=84 时原始 startIndex=3，row0 的 rowspan=4 跨越到视口，
        // correctedStartIndex=0，viewportStartIndex=3。
        await scrollYTo(wrapper, 84);

        // row0: 只有 c0 必须渲染（rowspan=4 跨入视口），其余列逐列单独占位（colspan=1）
        const row0Tds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="0"] > td');
        expect(row0Tds.length).toBe(8);
        expect(row0Tds[0].attributes('data-col-key')).toBe('c0');
        expect(row0Tds[0].attributes('rowspan')).toBe('4');
        for (let i = 1; i < 8; i++) {
            expect(row0Tds[i].classes()).toContain('vt-above-viewport-ph');
            expect(Number(row0Tds[i].attributes('colspan')) || 1).toBe(1);
        }

        // row1: 没有跨越视口的 must-render 单元格，渲染为空 <tr>（tr 已有 height 样式撑高）。
        // 单个孤立空行不参与合并（仅连续 >=2 行合并），因此仍保留独立 tr
        expect(wrapper.find('tbody.stk-tbody-main > tr[data-row-key="1"]').exists()).toBe(true);
        const row1Tds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="1"] > td');
        expect(row1Tds.length).toBe(0);
        // 不应渲染任何真实数据单元格
        expect(wrapper.find('tbody.stk-tbody-main > tr[data-row-key="1"] > td[data-col-key]').exists()).toBe(false);
        // 此场景空行均为孤立单行，不应出现上方合并占位 tr
        expect(wrapper.findAll('tbody.stk-tbody-main > tr[data-above-count]').length).toBe(0);

        // row2: c3 必须渲染（rowspan=2 跨入视口）；c1-c2 逐列单独占位（c0 被 row0 覆盖不占位），
        // c4-c7 逐列单独占位
        const row2Tds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="2"] > td');
        expect(row2Tds.length).toBe(7);
        expect(row2Tds[0].classes()).toContain('vt-above-viewport-ph');
        expect(row2Tds[1].classes()).toContain('vt-above-viewport-ph');
        expect(row2Tds[2].attributes('data-col-key')).toBe('c3');
        expect(row2Tds[2].attributes('rowspan')).toBe('2');
        for (let i = 3; i < 7; i++) {
            expect(row2Tds[i].classes()).toContain('vt-above-viewport-ph');
            expect(Number(row2Tds[i].attributes('colspan')) || 1).toBe(1);
        }

        // 视口内 row3: c0/c3 被上层 rowspan 覆盖而隐藏；c1 正常显示
        expect(wrapper.find('tbody.stk-tbody-main > tr[data-row-key="3"] > td[data-col-key="c0"]').exists()).toBe(false);
        expect(wrapper.find('tbody.stk-tbody-main > tr[data-row-key="3"] > td[data-col-key="c3"]').exists()).toBe(false);
        expect(wrapper.find('tbody.stk-tbody-main > tr[data-row-key="3"] > td[data-col-key="c1"]').exists()).toBe(true);
    });
});

describe('virtual with mergeCells rowspan: below-viewport merged tr', () => {
    const columns = new Array(8).fill(0).map((_, i) => ({ title: `Col ${i}`, dataIndex: `c${i}`, width: 100 }));
    // c0: row0 rowspan=4 (above-viewport); c5: row5 rowspan=4 (extends below viewport)
    columns[0].mergeCells = ({ row, rowIndex }) => (rowIndex === 0 && row.rowspan ? { rowspan: row.rowspan } : void 0);
    columns[5].mergeCells = ({ row, rowIndex }) => (rowIndex === 5 && row.rowspan ? { rowspan: row.rowspan } : void 0);

    const dataSource = new Array(20).fill(0).map((_, i) => ({
        id: i,
        rowspan: i === 0 ? 4 : i === 5 ? 4 : void 0,
        c0: i === 0 ? 'merged-c0' : void 0,
        c5: i === 5 ? 'merged-c5' : void 0,
    }));

    const wrapper = mount(StkTable, {
        props: {
            rowKey: 'id',
            virtual: true,
            height: 100,
            rowHeight: 28,
            columns,
            dataSource,
        },
    });

    test('视口下方行合并为单个占位 tr，不再逐行渲染', async () => {
        // rowHeight=28, height=100 => pageSize ~3。
        // scrollTop=84 => viewportStartIndex=3, viewportEndIndex=6。
        // row0 的 rowspan=4 使 startIndex 修正到 0，row5 的 rowspan=4 使 endIndex 修正到 8（闭区间）。
        // 上方 rows 1-2 为连续空行，下方 rows 7-8 为视口下方行。
        await scrollYTo(wrapper, 84);

        // row5 在视口内，c5 的 rowspan=4 锚点必须渲染。
        // 渲染 rowspan 已按下方合并占位修正：span 覆盖下方占位段中的 rows 7-8（2 行计 1 个 tr），
        // 扣减 (2-1) 后为 3，保证浏览器不会让单元格多跨 tr
        const row5Tds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="5"] > td[data-col-key]');
        expect(row5Tds.some(td => td.attributes('data-col-key') === 'c5')).toBe(true);
        const c5Cell = wrapper.find('tbody.stk-tbody-main > tr[data-row-key="5"] > td[data-col-key="c5"]');
        expect(c5Cell.attributes('rowspan')).toBe('3');

        // row0 的 c0 rowspan=4 同理按上方合并段（rows 1-2）修正为 3
        const c0Cell = wrapper.find('tbody.stk-tbody-main > tr[data-row-key="0"] > td[data-col-key="c0"]');
        expect(c0Cell.attributes('rowspan')).toBe('3');

        // below-viewport rows: 7, 8（及之后的 9）— 不再逐行渲染为独立 tr
        for (const rowKey of ['7', '8', '9']) {
            expect(wrapper.find(`tbody.stk-tbody-main > tr[data-row-key="${rowKey}"]`).exists()).toBe(false);
        }

        // 合并为单个占位 tr：height = calc(var(--row-height) * 2)，且不带数据行标记
        // （happy-dom 会丢弃 calc(var()) 样式的解析结果，无法断言 style 字符串，改断言 data-below-count）
        const phTrs = wrapper.findAll('tbody.stk-tbody-main > tr.vt-below-viewport-ph');
        expect(phTrs.length).toBe(1);
        expect(phTrs[0].attributes('data-below-count')).toBe('2');
        expect(phTrs[0].attributes('data-row-key')).toBeUndefined();
        // 占位 tr 内不应有数据单元格
        expect(phTrs[0].findAll('td[data-col-key]').length).toBe(0);

        // 上方 rows 1-2（连续空行，被 row0 的 rowspan 覆盖）合并为单个占位段
        const abovePhTrs = wrapper.findAll('tbody.stk-tbody-main > tr[data-above-count]');
        expect(abovePhTrs.length).toBe(1);
        expect(abovePhTrs[0].attributes('data-above-count')).toBe('2');

        // 带 data-row-key 的行：上方锚点 row0 + 视口 rows 3-6
        const dataTrs = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key]');
        expect(dataTrs.map(tr => tr.attributes('data-row-key'))).toEqual(['0', '3', '4', '5', '6']);
    });

    test('滚动到无跨视口下方合并的位置时，无下方占位 tr', async () => {
        // scrollTop=0 => viewport 0..3，row0 的 rowspan=4 使 endIndex 修正到 3（闭区间），
        // span 覆盖的行全部在数据窗口内，没有视口下方行，不渲染下方占位 tr。
        // （height=100 时 offsetBottom 为 0：endIndex 即数据窗口末端，无补偿差）
        await scrollYTo(wrapper, 0);

        const phTrs = wrapper.findAll('tbody.stk-tbody-main > tr.vt-below-viewport-ph');
        expect(phTrs.length).toBe(0);
    });
});

describe('virtual with large rowspan: above/below-viewport tr count stays O(1)', () => {
    // row0 的 c0 合并 120 行：视口位于合并区域中间时，
    // startIndex 修正到 0、endIndex 修正到 119（闭区间），视口上方空行与下方行
    // 曾逐行渲染 49 + 66 个空 tr，现在各合并为 1 个占位 tr
    const columns = new Array(8).fill(0).map((_, i) => ({ title: `Col ${i}`, dataIndex: `c${i}`, width: 100 }));
    columns[0].mergeCells = ({ row, rowIndex }) => (rowIndex === 0 && row.rowspan ? { rowspan: row.rowspan } : void 0);
    const dataSource = new Array(200).fill(0).map((_, i) => ({
        id: i,
        rowspan: i === 0 ? 120 : void 0,
        c0: i === 0 ? 'merged-c0' : void 0,
    }));

    const wrapper = mount(StkTable, {
        props: {
            rowKey: 'id',
            virtual: true,
            rowHeight: 28,
            columns,
            dataSource,
        },
    });

    test('视口位于长合并区域中间时，上下方各仅 1 个占位 tr', async () => {
        // scrollTop=1400 => 原始窗口 rows 50..53（pageSize=3）。
        // row0 rowspan=120 => startIndex 修正为 0、endIndex 修正为 119（闭区间）。
        // 上方：锚点 row0 + 空行 1..49（合并为 1 段）；视口行 50..53；
        // 下方：rows 54..119（66 行）合并为 1 个占位 tr。
        await scrollYTo(wrapper, 50 * 28);

        const ph = wrapper.find('tbody.stk-tbody-main > tr.vt-below-viewport-ph');
        expect(ph.exists()).toBe(true);
        expect(ph.attributes('data-below-count')).toBe('66');

        const abovePh = wrapper.find('tbody.stk-tbody-main > tr[data-above-count]');
        expect(abovePh.exists()).toBe(true);
        expect(abovePh.attributes('data-above-count')).toBe('49');

        // 总 tr 数 = padding-top(1) + 上方锚点(1) + 上方占位(1) + 视口(4) + 下方占位(1) + offsetBottom(1)
        const allTrs = wrapper.findAll('tbody.stk-tbody-main > tr');
        expect(allTrs.length).toBe(9);
        // data-row-key 行：锚点 row0 + 视口 rows 50-53（优化前该位置为 123 个 tr）
        expect(wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key]').length).toBe(5);
    });
});
