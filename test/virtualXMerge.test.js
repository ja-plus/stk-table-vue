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

        // row1: 没有跨越视口的 must-render 单元格，渲染为空 <tr>（tr 已有 height 样式撑高）
        const row1Tds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="1"] > td');
        expect(row1Tds.length).toBe(0);
        // 不应渲染任何真实数据单元格
        expect(wrapper.find('tbody.stk-tbody-main > tr[data-row-key="1"] > td[data-col-key]').exists()).toBe(false);

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

describe('virtual with mergeCells rowspan: below-viewport empty tr', () => {
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

    test('视口下方行不渲染任何 td', async () => {
        // rowHeight=28, height=100 => pageSize ~3。
        // scrollTop=84 => viewportStartIndex=3, viewportEndIndex=6。
        // row5 的 rowspan=4 使 endIndex 修正到 9，rows 7-9 为 below-viewport 行。
        await scrollYTo(wrapper, 84);

        // row5 在视口内，c5 的 rowspan=4 锚点必须渲染
        const row5Tds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="5"] > td[data-col-key]');
        expect(row5Tds.some(td => td.attributes('data-col-key') === 'c5')).toBe(true);
        const c5Cell = wrapper.find('tbody.stk-tbody-main > tr[data-row-key="5"] > td[data-col-key="c5"]');
        expect(c5Cell.attributes('rowspan')).toBe('4');

        // below-viewport rows: 7, 8, 9 — 不应有任何 td
        for (const rowKey of ['7', '8', '9']) {
            const tds = wrapper.findAll(`tbody.stk-tbody-main > tr[data-row-key="${rowKey}"] > td`);
            expect(tds.length).toBe(0);
        }
    });
});
