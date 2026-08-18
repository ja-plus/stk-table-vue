/**
 * @vitest-environment happy-dom
 *
 * 复现文档 merge-cells.md 中「行合并虚拟列表」的滚动问题：
 * 1. 简单合并：United States 块滚动进入可视区时未合并（锚点行在视口上方时合并失效）
 * 2. 不规律合并：滚动时单元格合并状态不稳定（闪烁）
 *
 * 根因：useMergeCells 内部 mergeCellsCache 以 `${rowIndex}:${colIndex}` 为键，
 * 但 buildHiddenCellMap/mergeCellsWrapper 传入切片内相对索引、aboveViewportColumnMap
 * 传入绝对索引，键冲突导致取到错误行的合并结果。
 * 修复：所有 mergeCells 调用与缓存键统一使用绝对行索引。
 */
import { mount } from '@vue/test-utils';
import { StkTable } from '@/StkTable';
import { describe, expect, test } from 'vitest';
import { dataSource, specialDataSource } from '../docs-demo/basic/merge-cells/MergeCellsRowVirtual/dataSource';

const ROW_HEIGHT = 28;

function nextFrame() {
    return new Promise(resolve => setTimeout(resolve, 35));
}

async function scrollYTo(wrapper, top) {
    const container = wrapper.element;
    container.scrollTop = top;
    container.dispatchEvent(new Event('scroll'));
    await nextFrame();
    await wrapper.vm.$nextTick();
}

function mergeCells({ row, col }) {
    if (!row.rowspan) return;
    return { rowspan: row.rowspan[col.dataIndex] || 1 };
}

/** row + col 同时合并的回调（MergeCellsRowColVirtual demo 同款） */
function mergeCellsRowCol({ row, col }) {
    const rowspan = row.rowspan?.[col.dataIndex];
    const colspan = row.colspan?.[col.dataIndex];
    if (!rowspan && !colspan) return;
    return { rowspan: rowspan || 1, colspan: colspan || 1 };
}

const simpleColumns = [
    { title: 'id', dataIndex: 'id', width: 100 },
    { title: 'continent', dataIndex: 'continent', width: 100, mergeCells },
    { title: 'country', dataIndex: 'country', width: 120, mergeCells },
    { title: 'province', dataIndex: 'province' },
];

const specialColumns = [
    { title: 'ID', dataIndex: 'id', width: 50, align: 'center' },
    { title: 'A', dataIndex: 'a', width: 100, mergeCells },
    { title: 'B', dataIndex: 'b', width: 120, mergeCells },
    { title: 'C', dataIndex: 'c', mergeCells },
];

/** 列键 -> 叶子列索引（checkColumnAlignment 用） */
const simpleColKeyToIndex = new Map([
    ['id', 0],
    ['continent', 1],
    ['country', 2],
    ['province', 3],
]);
const specialColKeyToIndex = new Map([
    ['id', 0],
    ['a', 1],
    ['b', 2],
    ['c', 3],
]);

/**
 * 计算数据的合并覆盖信息（与组件实现无关的"真值"）
 * anchors: `${rowIndex}:${dataIndex}` -> rowspan
 */
function buildGroundTruth(data, mergeDataIndexes) {
    const anchors = new Map();
    for (let i = 0; i < data.length; i++) {
        for (const c of mergeDataIndexes) {
            const rs = data[i].rowspan?.[c] || 1;
            if (rs > 1) anchors.set(`${i}:${c}`, rs);
        }
    }
    function isCovered(rowIndex, colKey) {
        for (let a = 0; a < rowIndex; a++) {
            const rs = anchors.get(`${a}:${colKey}`);
            if (rs && a + rs > rowIndex) return true;
        }
        return false;
    }
    return { anchors, isCovered };
}

/**
 * 校验某个滚动位置下 DOM 中合并单元格的正确性。
 * 返回错误信息数组（空数组表示正确）。
 *
 * 视口行范围 [rawStart, rawEnd)，rawEnd = rawStart + pageSize。
 * 组件实际渲染窗口会向上下扩展以容纳跨界合并：
 * - 被覆盖的行不能渲染该列单元格
 * - 锚点行：合并区域与视口有交集时必须渲染，且 rowspan 属性正确
 * - 普通单元格：仅视口内（含缓冲行）渲染
 *
 * rowspan 属性校验：合并占位 tr 代表 N 行但 DOM 中只算 1 行，
 * 跨越占位段的 rowspan 会按合并行数扣减（见组件 adjustRowspanForMergedRows），
 * 下方占位按跨界 rowspan 结束行切分为多段，单元格止于包含其结束行的段，
 * 这里依据 DOM 中的占位段信息推导期望值。
 */
function checkMergeDom(wrapper, data, mergeDataIndexes, scrollTop, pageSize) {
    const rawStart = Math.floor(scrollTop / ROW_HEIGHT);
    const rawEnd = rawStart + pageSize;
    const { anchors, isCovered } = buildGroundTruth(data, mergeDataIndexes);
    const errors = [];

    const trs = wrapper.findAll('tbody.stk-tbody-main > tr');
    // 收集占位段信息：上方合并段（DOM 位置 + 行数）、下方占位段（DOM 顺序的行数序列）
    const abovePhs = [];
    const belowPhs = [];
    trs.forEach((tr, domIndex) => {
        const aboveCount = tr.attributes('data-above-count');
        if (aboveCount !== void 0) abovePhs.push({ domIndex, count: Number(aboveCount) });
        const belowCount = tr.attributes('data-below-count');
        if (belowCount !== void 0) belowPhs.push(Number(belowCount));
    });

    for (let domIndex = 0; domIndex < trs.length; domIndex++) {
        const tr = trs[domIndex];
        const rowIAttr = tr.attributes('data-row-i');
        if (rowIAttr === void 0) continue; // padding / offsetBottom / 合并占位 tr
        const i = Number(rowIAttr);
        for (const c of mergeDataIndexes) {
            const td = tr.find(`td[data-col-key="${c}"]`);
            const covered = isCovered(i, c);
            const anchorRs = anchors.get(`${i}:${c}`);

            if (covered) {
                if (td.exists()) {
                    errors.push(`row#${i}(${data[i].id}) col=${c}: 被覆盖的单元格不应渲染（重复显示）`);
                }
            } else if (anchorRs) {
                const crossesViewport = i + anchorRs > rawStart;
                const anchorInOrAboveViewport = i <= rawEnd;
                const shouldRender = crossesViewport && anchorInOrAboveViewport;
                if (shouldRender && !td.exists()) {
                    errors.push(`row#${i}(${data[i].id}) col=${c}: 锚点单元格缺失（rowspan=${anchorRs}）`);
                } else if (!shouldRender && td.exists()) {
                    errors.push(`row#${i}(${data[i].id}) col=${c}: 锚点单元格不应渲染`);
                } else if (td.exists()) {
                    // 期望 rowspan = 逻辑 rowspan - 锚点之后各上方合并段的 (count-1) - 下方合并扣减
                    let expectedRs = anchorRs;
                    for (const ph of abovePhs) {
                        if (ph.domIndex > domIndex) expectedRs -= ph.count - 1;
                    }
                    if (belowPhs.length && i + anchorRs - 1 > rawEnd) {
                        // 下方占位按跨界 rowspan 结束行切段：覆盖的逻辑行折叠为
                        // 包含其结束行的第 segIdx 个占位 tr，扣减 (coveredRows - segIdx)
                        const endIndex = rawEnd + belowPhs.reduce((a, b) => a + b, 0);
                        const spanEnd = Math.min(i + anchorRs - 1, endIndex);
                        let acc = rawEnd;
                        let segIdx = belowPhs.length;
                        for (let s = 0; s < belowPhs.length; s++) {
                            acc += belowPhs[s];
                            if (spanEnd <= acc) {
                                segIdx = s + 1;
                                break;
                            }
                        }
                        expectedRs -= spanEnd - rawEnd - segIdx;
                    }
                    if (expectedRs < 1) expectedRs = 1;
                    if (td.attributes('rowspan') !== String(expectedRs)) {
                        errors.push(
                            `row#${i}(${data[i].id}) col=${c}: rowspan 应为 ${expectedRs}（逻辑值 ${anchorRs}），实际 ${td.attributes('rowspan')}`,
                        );
                    }
                }
            } else {
                const shouldRender = i >= rawStart && i <= rawEnd;
                if (shouldRender && !td.exists()) {
                    errors.push(`row#${i}(${data[i].id}) col=${c}: 视口内普通单元格缺失`);
                } else if (!shouldRender && td.exists()) {
                    errors.push(`row#${i}(${data[i].id}) col=${c}: 视口外普通单元格不应渲染`);
                }
            }
        }
    }
    return errors;
}

/** 模拟浏览器容器高度（happy-dom clientHeight 恒为 0），返回实际 pageSize */
function mockContainerHeight(wrapper, height) {
    Object.defineProperty(wrapper.element, 'clientHeight', { configurable: true, value: height });
    wrapper.vm.initVirtualScrollY();
    // pageSize = ceil(height/rowHeight) - 表头行数(1)
    return Math.ceil(height / ROW_HEIGHT) - 1;
}

describe('行合并虚拟列表-简单合并（文档 merge-cells.md 场景）', () => {
    const wrapper = mount(StkTable, {
        props: { rowKey: 'id', virtual: true, cellHover: true, columns: simpleColumns, dataSource: dataSource.value },
    });
    const PAGE_SIZE = 3; // DEFAULT_TABLE_HEIGHT=100 / 28 => pageSize 3

    test('US 块锚点行滚出视口上方时，视口内单元格应保持合并状态', async () => {
        // US 块：row 25(3-1-1, country rowspan=7, continent rowspan=11) .. row 35
        // scrollTop=756 => rawStart=27，锚点行 25/26 在视口上方
        await scrollYTo(wrapper, 27 * ROW_HEIGHT);

        // 锚点行（视口上方）必须渲染合并单元格
        const anchorCountry = wrapper.find('tbody.stk-tbody-main > tr[data-row-key="3-1-1"] > td[data-col-key="country"]');
        expect(anchorCountry.exists(), '视口上方锚点行应渲染 country 合并单元格').toBe(true);
        expect(anchorCountry.attributes('rowspan')).toBe('7');

        // 视口内被覆盖的行不应再渲染 country 单元格
        for (const key of ['3-1-2', '3-1-3', '3-1-4', '3-1-5', '3-1-6', '3-1-7']) {
            const coveredTd = wrapper.find(`tbody.stk-tbody-main > tr[data-row-key="${key}"] > td[data-col-key="country"]`);
            expect(coveredTd.exists(), `row ${key} 的 country 单元格应被合并隐藏`).toBe(false);
        }

        const errors = checkMergeDom(wrapper, dataSource.value, ['continent', 'country'], 27 * ROW_HEIGHT, PAGE_SIZE);
        expect(errors).toEqual([]);
    });

    test('Europe 块锚点行滚出视口上方时（scrollTop=364/392），合并保持正确', async () => {
        // 修复前该位置 continent 锚点单元格丢失、视口列空白
        for (const top of [13 * ROW_HEIGHT, 14 * ROW_HEIGHT]) {
            await scrollYTo(wrapper, top);
            const anchor = wrapper.find('tbody.stk-tbody-main > tr[data-row-key="2-1-1"] > td[data-col-key="continent"]');
            expect(anchor.exists(), `scrollTop=${top} 时 Europe 锚点应渲染`).toBe(true);

            // 渲染 rowspan 已按下方合并占位修正：锚点单元格按该 rowspan 跨到的最后一个 tr
            // 应恰好是视口下方占位 tr（Europe span 越过视口底部、延伸进占位段）
            const rs = Number(anchor.attributes('rowspan'));
            expect(rs).toBeLessThan(13); // 逻辑 rowspan 13，合并后必然扣减
            const allTrs = wrapper.findAll('tbody.stk-tbody-main > tr');
            const anchorIdx = allTrs.findIndex(t => t.attributes('data-row-key') === '2-1-1');
            const lastSpannedTr = allTrs[anchorIdx + rs - 1];
            expect(lastSpannedTr.attributes('data-below-count'), `scrollTop=${top}`).not.toBeUndefined();

            const errors = checkMergeDom(wrapper, dataSource.value, ['continent', 'country'], top, PAGE_SIZE);
            expect(errors).toEqual([]);
        }
    });

    test('全量滚动扫描：每个滚动位置合并状态都正确', async () => {
        const maxScrollTop = dataSource.value.length * ROW_HEIGHT - 100;
        const allErrors = [];
        for (let top = 0; top <= maxScrollTop; top += ROW_HEIGHT) {
            await scrollYTo(wrapper, top);
            const errors = checkMergeDom(wrapper, dataSource.value, ['continent', 'country'], top, PAGE_SIZE);
            if (errors.length) {
                allErrors.push(`scrollTop=${top}:\n  ` + errors.join('\n  '));
            }
        }
        expect(allErrors).toEqual([]);
    });
});

describe('行合并虚拟列表-简单合并（浏览器同规格 pageSize=10）', () => {
    const wrapper = mount(StkTable, {
        props: { rowKey: 'id', virtual: true, cellHover: true, columns: simpleColumns, dataSource: dataSource.value },
    });

    test('容器高度 300px（同文档 demo）全量滚动扫描', async () => {
        const pageSize = mockContainerHeight(wrapper, 300); // pageSize = 10
        expect(pageSize).toBe(10);
        const maxScrollTop = dataSource.value.length * ROW_HEIGHT - 300;
        const allErrors = [];
        for (let top = 0; top <= maxScrollTop; top += ROW_HEIGHT) {
            await scrollYTo(wrapper, top);
            const errors = checkMergeDom(wrapper, dataSource.value, ['continent', 'country'], top, pageSize);
            errors.push(...checkColumnAlignment(wrapper, simpleColKeyToIndex));
            if (errors.length) {
                allErrors.push(`scrollTop=${top}:\n  ` + errors.join('\n  '));
            }
        }
        expect(allErrors).toEqual([]);
    });
});

describe('行合并虚拟列表-简单合并（追加大量数据后）', () => {
    // 模拟 demo 中「添加1000行」：60 组 x 10 行，每组首行 continent rowspan=10
    const moreData = (() => {
        const data = [];
        for (let i = 10; i < 70; i++) {
            for (let j = 0; j < 10; j++) {
                const row = { id: `${i}-${j}`, continent: 'Asia' + i, country: 'China', province: 'Beijing' };
                if (j === 0) row.rowspan = { continent: 10 };
                data.push(row);
            }
        }
        return dataSource.value.concat(data);
    })();

    const wrapper = mount(StkTable, {
        props: { rowKey: 'id', virtual: true, cellHover: true, columns: simpleColumns, dataSource: moreData },
    });

    test(
        '深滚动位置抽样扫描（含新追加数据区域）',
        async () => {
            const pageSize = mockContainerHeight(wrapper, 300);
            const maxScrollTop = moreData.length * ROW_HEIGHT - 300;
            const allErrors = [];
            // 步长 4 行抽样，覆盖深位置的缓存键冲突场景
            for (let top = 0; top <= maxScrollTop; top += ROW_HEIGHT * 4) {
                await scrollYTo(wrapper, top);
                const errors = checkMergeDom(wrapper, moreData, ['continent', 'country'], top, pageSize);
                errors.push(...checkColumnAlignment(wrapper, simpleColKeyToIndex));
                if (errors.length) {
                    allErrors.push(`scrollTop=${top}:\n  ` + errors.join('\n  '));
                }
            }
            expect(allErrors).toEqual([]);
        },
        60_000,
    );
});

/**
 * 校验视口上方行的占位单元格结构：
 * 占位必须逐列单独占位（colspan=1），不能把多列合并成一个占位 td，
 * 否则与视口行的"每列一个单元格"结构不一致，会导致表格 auto layout 列宽在滚动中抖动。
 */
function checkAboveViewportPlaceholders(wrapper, scrollTop) {
    const rawStart = Math.floor(scrollTop / ROW_HEIGHT);
    const errors = [];
    const trs = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key]');
    for (const tr of trs) {
        const i = Number(tr.attributes('data-row-i'));
        if (i >= rawStart) continue; // 只检查视口上方行
        const phs = tr.findAll('td.vt-above-viewport-ph');
        for (const ph of phs) {
            const colspan = Number(ph.attributes('colspan')) || 1;
            if (colspan > 1) {
                errors.push(`row#${i}: 占位单元格应单独占位，实际 colspan=${colspan}`);
            }
        }
    }
    return errors;
}

/**
 * 模拟 HTML 表格布局校验列对齐：按 DOM 顺序遍历行，跟踪上方 rowspan 的占用，
 * 逐个单元格落位，断言每个真实单元格（data-col-key）落在其预期的叶子列上。
 * 视口上方行若占位缺失/错并，合并单元格会落到错误的列（此检查可发现）。
 */
function checkColumnAlignment(wrapper, colKeyToIndex) {
    const colCount = colKeyToIndex.size;
    const errors = [];
    const trs = wrapper.findAll('tbody.stk-tbody-main > tr');
    /** 每列被上方 rowspan 占用的剩余行数 */
    const occupied = new Array(colCount).fill(0);
    for (const tr of trs) {
        // 视口上方合并占位 tr：DOM 中只算 1 行，且 rowspan 属性已按合并行数修正，
        // 因此与普通行一样只消耗 1 行占用
        const aboveCount = tr.attributes('data-above-count');
        if (aboveCount !== void 0) {
            for (let col = 0; col < colCount; col++) {
                if (occupied[col] > 0) occupied[col]--;
            }
            continue;
        }
        // 其他非数据行（padding-top / offsetBottom / 视口下方占位）：无单元格，跳过
        const rowKey = tr.attributes('data-row-key');
        if (rowKey === void 0) continue;
        const cells = tr.findAll('td').map(td => ({
            key: td.attributes('data-col-key'),
            colspan: Number(td.attributes('colspan')) || 1,
            rowspan: Number(td.attributes('rowspan')) || 1,
        }));
        let ci = 0;
        for (let col = 0; col < colCount; col++) {
            if (occupied[col] > 0) {
                occupied[col]--;
                continue;
            }
            // 行内已无单元格（空 tr 或提前结束）：仍需继续遍历剩余列以消耗上方 rowspan 的占用
            if (ci >= cells.length) continue;
            const cell = cells[ci++];
            if (cell.key !== undefined) {
                const expected = colKeyToIndex.get(cell.key);
                if (expected !== col) {
                    errors.push(`row(${rowKey}): 单元格 ${cell.key} 落在第 ${col + 1} 列，预期第 ${expected + 1} 列`);
                }
            }
            if (cell.rowspan > 1) {
                for (let c = 0; c < cell.colspan; c++) {
                    if (col + c < colCount) occupied[col + c] = cell.rowspan - 1;
                }
            }
        }
        if (ci < cells.length) {
            errors.push(`row(${rowKey}): 有 ${cells.length - ci} 个单元格超出列数（结构错位）`);
        }
    }
    return errors;
}

describe('行合并虚拟列表-不规律合并（文档 merge-cells.md 场景）', () => {
    const wrapper = mount(StkTable, {
        props: { rowKey: 'id', virtual: true, cellHover: true, columns: specialColumns, dataSource: specialDataSource.value },
    });
    const PAGE_SIZE = 3;

    test('第八行移出可视区时，第七行占位应逐列单独占位', async () => {
        // 浏览器同规格 pageSize=10；scrollTop=224 => rawStart=8（第 8 行 '08' 刚移出视口顶部）
        // rowIndex 修正后 startIndex=6（'07' 的 c rowspan=3 跨入视口），视口上方行为 '07'、'08'
        const pageSize = mockContainerHeight(wrapper, 300);
        expect(pageSize).toBe(10);
        await scrollYTo(wrapper, 8 * ROW_HEIGHT);

        // 行 '07'：第 1、3 列（ID、B）需单独占位；第 2 列（A）从 '03' 的 a rowspan 继承（锚点不在渲染窗口内，仍需占位保持列位置）；
        // C 列锚点必须渲染（rowspan=3 跨入视口）
        const row07Tds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="07"] > td');
        expect(row07Tds.length).toBe(4);
        expect(row07Tds[0].classes()).toContain('vt-above-viewport-ph');
        expect(Number(row07Tds[0].attributes('colspan')) || 1).toBe(1);
        expect(row07Tds[1].classes()).toContain('vt-above-viewport-ph');
        expect(Number(row07Tds[1].attributes('colspan')) || 1).toBe(1);
        expect(row07Tds[2].classes()).toContain('vt-above-viewport-ph');
        expect(Number(row07Tds[2].attributes('colspan')) || 1).toBe(1);
        expect(row07Tds[3].attributes('data-col-key')).toBe('c');
        expect(row07Tds[3].attributes('rowspan')).toBe('3');

        // 行 '08'：B 列锚点必须渲染（rowspan=7 跨入视口）；C 列被 '07' 的 rowspan 覆盖（继承）不占位
        const row08Tds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="08"] > td');
        expect(row08Tds.length).toBe(3);
        expect(row08Tds[0].classes()).toContain('vt-above-viewport-ph');
        expect(row08Tds[1].classes()).toContain('vt-above-viewport-ph');
        expect(row08Tds[2].attributes('data-col-key')).toBe('b');
        expect(row08Tds[2].attributes('rowspan')).toBe('7');

        expect(checkAboveViewportPlaceholders(wrapper, 8 * ROW_HEIGHT)).toEqual([]);
        const errors = checkMergeDom(wrapper, specialDataSource.value, ['a', 'b', 'c'], 8 * ROW_HEIGHT, pageSize);
        expect(errors).toEqual([]);
        expect(checkColumnAlignment(wrapper, specialColKeyToIndex)).toEqual([]);
    });

    test('滚动到第十四行：未跨入视口的 rowspan 不应吞掉下方行的占位', async () => {
        // scrollTop=364 => rawStart=13。'08' 的 b:7 跨越视口起点，startIndex 修正到 7。
        // '11' 的 a rowspan=3 覆盖行 10~12，恰好结束于视口顶部之前（不跨入视口），
        // 其锚点行不需要渲染（空 tr）。此时行 '12'、'13' 的 A 列没有被任何已渲染的
        // rowspan 单元格占用，必须保留占位，否则 '12' 的 c rowspan=8 单元格会错位到 A 列。
        const pageSize = mockContainerHeight(wrapper, 300);
        await scrollYTo(wrapper, 13 * ROW_HEIGHT);

        // 行 '11'：a rowspan 未跨入视口，整行无 must-render 单元格 => 空 tr
        expect(wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="11"] > td').length).toBe(0);

        // 行 '12'：ID/A 两列占位 + C 列锚点（rowspan=8 跨入视口），共 3 个 td；
        // B 列被 '08' 的 b rowspan=7 占用（该单元格真实渲染），无需占位
        const row12Tds = wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key="12"] > td');
        expect(row12Tds.length).toBe(3);
        expect(row12Tds[0].classes()).toContain('vt-above-viewport-ph');
        expect(row12Tds[1].classes()).toContain('vt-above-viewport-ph');
        expect(row12Tds[2].attributes('data-col-key')).toBe('c');
        expect(row12Tds[2].attributes('rowspan')).toBe('8');

        // 列对齐：'12' 的 c 单元格必须落在第 4 列；视口内各行单元格落在正确的列
        expect(checkColumnAlignment(wrapper, specialColKeyToIndex)).toEqual([]);
        const errors = checkMergeDom(wrapper, specialDataSource.value, ['a', 'b', 'c'], 13 * ROW_HEIGHT, pageSize);
        expect(errors).toEqual([]);
    });

    test('滚动到第十七行：下方不同结束行的 rowspan 单元格各止于自己的占位段', async () => {
        // 容器高度 140px => pageSize=4。scrollTop=476 => rawStart=17，视口 17..21。
        // '14' a rowspan=10（止于 22）、'21' c rowspan=6（止于 25）、'20' b rowspan=9（止于 27）
        // 三者同时越视口底且结束行各不相同。修复前三者复用同一个下方占位 tr，
        // 底边塌缩到同一位置导致高度跳动；修复后下方区域 22..27 按结束行切为三段。
        const pageSize = mockContainerHeight(wrapper, 140);
        expect(pageSize).toBe(4);
        await scrollYTo(wrapper, 17 * ROW_HEIGHT);

        // 下方占位段：22（1 行）、23..25（3 行）、26..27（2 行）
        const belowPhs = wrapper.findAll('tbody.stk-tbody-main > tr[data-below-count]');
        expect(belowPhs.map(tr => tr.attributes('data-below-count'))).toEqual(['1', '3', '2']);

        // 三个单元格修正 rowspan 互不相同，各止于包含其逻辑结束行的段边界：
        // '14' a：行 13..21（扣除上方占位段后 8 个 tr）+ 第 1 段 = 9
        // '20' b：行 19..21（3 个 tr）+ 3 段 = 6
        // '21' c：行 20..21（2 个 tr）+ 前 2 段 = 4
        const cellA = wrapper.find('tbody.stk-tbody-main > tr[data-row-key="14"] > td[data-col-key="a"]');
        const cellB = wrapper.find('tbody.stk-tbody-main > tr[data-row-key="20"] > td[data-col-key="b"]');
        const cellC = wrapper.find('tbody.stk-tbody-main > tr[data-row-key="21"] > td[data-col-key="c"]');
        expect(cellA.attributes('rowspan')).toBe('9');
        expect(cellB.attributes('rowspan')).toBe('6');
        expect(cellC.attributes('rowspan')).toBe('4');

        expect(checkColumnAlignment(wrapper, specialColKeyToIndex)).toEqual([]);
        const errors = checkMergeDom(wrapper, specialDataSource.value, ['a', 'b', 'c'], 17 * ROW_HEIGHT, pageSize);
        expect(errors).toEqual([]);
    });

    test('全量滚动扫描：每个滚动位置合并状态都正确（无闪烁状态）', async () => {
        mockContainerHeight(wrapper, 100); // 恢复默认容器高度（前面的用例改成了 300px），pageSize=3
        const maxScrollTop = specialDataSource.value.length * ROW_HEIGHT - 100;
        const allErrors = [];
        for (let top = 0; top <= maxScrollTop; top += ROW_HEIGHT) {
            await scrollYTo(wrapper, top);
            const errors = checkMergeDom(wrapper, specialDataSource.value, ['a', 'b', 'c'], top, PAGE_SIZE);
            errors.push(...checkAboveViewportPlaceholders(wrapper, top));
            errors.push(...checkColumnAlignment(wrapper, specialColKeyToIndex));
            if (errors.length) {
                allErrors.push(`scrollTop=${top}:\n  ` + errors.join('\n  '));
            }
        }
        expect(allErrors).toEqual([]);
    });

    test('逐半行滚动（非整行对齐）也不应出现错误的合并状态', async () => {
        mockContainerHeight(wrapper, 100); // 恢复默认容器高度（前面的用例改成了 300px），pageSize=3
        const maxScrollTop = specialDataSource.value.length * ROW_HEIGHT - 100;
        const allErrors = [];
        for (let top = 0; top <= maxScrollTop; top += ROW_HEIGHT / 2) {
            await scrollYTo(wrapper, top);
            const errors = checkMergeDom(wrapper, specialDataSource.value, ['a', 'b', 'c'], top, PAGE_SIZE);
            errors.push(...checkAboveViewportPlaceholders(wrapper, top));
            errors.push(...checkColumnAlignment(wrapper, specialColKeyToIndex));
            if (errors.length) {
                allErrors.push(`scrollTop=${top}:\n  ` + errors.join('\n  '));
            }
        }
        expect(allErrors).toEqual([]);
    });

    test('浏览器同规格 pageSize=10 全量滚动扫描', async () => {
        const pageSize = mockContainerHeight(wrapper, 300);
        const maxScrollTop = specialDataSource.value.length * ROW_HEIGHT - 300;
        const allErrors = [];
        for (let top = 0; top <= maxScrollTop; top += ROW_HEIGHT) {
            await scrollYTo(wrapper, top);
            const errors = checkMergeDom(wrapper, specialDataSource.value, ['a', 'b', 'c'], top, pageSize);
            errors.push(...checkAboveViewportPlaceholders(wrapper, top));
            errors.push(...checkColumnAlignment(wrapper, specialColKeyToIndex));
            if (errors.length) {
                allErrors.push(`scrollTop=${top}:\n  ` + errors.join('\n  '));
            }
        }
        expect(allErrors).toEqual([]);
    });
});

describe('行合并虚拟列表-超长 rowspan（文档「超长 rowspan」场景缩小版）', () => {
    // 5 组，rowspan 200~400，覆盖"滚动到超长合并区域中间"的场景
    const hugeData = (() => {
        const groups = [
            { continent: 'Asia', country: 'China', rowspan: 300 },
            { continent: 'Europe', country: 'France', rowspan: 400 },
            { continent: 'America', country: 'United States', rowspan: 200 },
            { continent: 'Africa', country: 'Egypt', rowspan: 250 },
            { continent: 'Oceania', country: 'Australia', rowspan: 250 },
        ];
        const rows = [];
        let id = 0;
        for (const g of groups) {
            for (let i = 0; i < g.rowspan; i++) {
                const row = { id: id++, continent: g.continent, country: g.country, province: `Province ${i}` };
                if (i === 0) {
                    row.rowspan = { continent: g.rowspan, country: Math.floor(g.rowspan / 2) };
                } else if (i === Math.floor(g.rowspan / 2)) {
                    row.rowspan = { country: Math.ceil(g.rowspan / 2) };
                }
                rows.push(row);
            }
        }
        return rows;
    })();

    const wrapper = mount(StkTable, {
        props: { rowKey: 'id', virtual: true, cellHover: true, columns: simpleColumns, dataSource: hugeData },
    });

    test(
        '超长合并区域内滚动：锚点与覆盖状态正确',
        async () => {
            const pageSize = mockContainerHeight(wrapper, 300);
            const maxScrollTop = hugeData.length * ROW_HEIGHT - 300;
            const allErrors = [];
            // 步长 40 行抽样（超长 rowspan 区域内部 + 组边界）
            for (let top = 0; top <= maxScrollTop; top += ROW_HEIGHT * 40) {
                await scrollYTo(wrapper, top);
                const errors = checkMergeDom(wrapper, hugeData, ['continent', 'country'], top, pageSize);
                errors.push(...checkColumnAlignment(wrapper, simpleColKeyToIndex));
                if (errors.length) {
                    allErrors.push(`scrollTop=${top}:\n  ` + errors.join('\n  '));
                }
            }
            expect(allErrors).toEqual([]);
        },
        60_000,
    );

    test('超长合并区域中间：视口上下方空行均合并为占位 tr，总行数收敛', async () => {
        // Asia 组 rows 0..299（continent rowspan=300 @0，country rowspan=150 @0/150）。
        // scrollTop=200*28 => 原始窗口 rows 200..210（pageSize=10），
        // startIndex 修正为 0、endIndex 修正为 299（闭区间）。
        mockContainerHeight(wrapper, 300);
        await scrollYTo(wrapper, 200 * ROW_HEIGHT);

        // 上方：锚点行 0（continent）、150（country）保留；
        // 空行 1..149 合并为一段（149 行），151..199 合并为一段（49 行）
        const abovePhs = wrapper.findAll('tbody.stk-tbody-main > tr[data-above-count]');
        expect(abovePhs.map(tr => tr.attributes('data-above-count'))).toEqual(['149', '49']);

        // 下方：rows 211..299 合并为单个占位 tr（89 行）
        const belowPhs = wrapper.findAll('tbody.stk-tbody-main > tr[data-below-count]');
        expect(belowPhs.map(tr => tr.attributes('data-below-count'))).toEqual(['89']);

        // 总 tr 数 = padding-top(1) + 上方锚点(2) + 上方占位(2) + 视口行(11) + 下方占位(1) + offsetBottom(1)
        // 优化前该位置约 303 个 tr（上方 200 + 下方 89 逐行渲染）
        expect(wrapper.findAll('tbody.stk-tbody-main > tr').length).toBe(18);
        expect(wrapper.findAll('tbody.stk-tbody-main > tr[data-row-key]').length).toBe(13);
    });
});

describe('mergeCells 结果缓存-原地修改行字段后显式失效（clearMergeCellsCache）', () => {
    // 缓存命中校验只看行引用同一性：原地改行字段（引用不变）不会自动失效，
    // 需调用暴露的 clearMergeCellsCache 强制重算
    const data = [
        { id: '1', continent: 'Asia', country: 'China', province: 'Beijing' },
        { id: '2', continent: 'Asia', country: 'China', province: 'Shanghai' },
        { id: '3', continent: 'Asia', country: 'China', province: 'Tianjin' },
        { id: '4', continent: 'Europe', country: 'France', province: 'Paris' },
    ];

    const wrapper = mount(StkTable, {
        props: { rowKey: 'id', columns: simpleColumns, dataSource: data },
    });

    test('原地修改 rowspan 字段后调用 clearMergeCellsCache，合并结果应重算', async () => {
        // 初始无合并：每行都渲染 continent 单元格
        expect(wrapper.find('tbody tr[data-row-key="1"] > td[data-col-key="continent"]').exists()).toBe(true);
        expect(wrapper.find('tbody tr[data-row-key="2"] > td[data-col-key="continent"]').exists()).toBe(true);

        // 原地修改行字段（dataSource 引用不变），缓存命中旧结果，合并不会自动生效
        data[0].rowspan = { continent: 3 };
        await wrapper.vm.$nextTick();
        expect(
            wrapper.find('tbody tr[data-row-key="1"] > td[data-col-key="continent"]').attributes('rowspan'),
            '未调用 clearMergeCellsCache 前使用旧缓存结果',
        ).toBeUndefined();

        // 显式失效缓存：重算后锚点行 rowspan=3，被覆盖行不再渲染该列单元格
        wrapper.vm.clearMergeCellsCache();
        await wrapper.vm.$nextTick();
        const anchor = wrapper.find('tbody tr[data-row-key="1"] > td[data-col-key="continent"]');
        expect(anchor.exists()).toBe(true);
        expect(anchor.attributes('rowspan')).toBe('3');
        expect(wrapper.find('tbody tr[data-row-key="2"] > td[data-col-key="continent"]').exists()).toBe(false);
        expect(wrapper.find('tbody tr[data-row-key="3"] > td[data-col-key="continent"]').exists()).toBe(false);
        expect(wrapper.find('tbody tr[data-row-key="4"] > td[data-col-key="continent"]').exists()).toBe(true);

        // 反向变更：取消合并后同样需要重算，被覆盖行恢复渲染
        delete data[0].rowspan;
        wrapper.vm.clearMergeCellsCache();
        await wrapper.vm.$nextTick();
        for (const key of ['1', '2', '3', '4']) {
            const td = wrapper.find(`tbody tr[data-row-key="${key}"] > td[data-col-key="continent"]`);
            expect(td.exists(), `row ${key} 的 continent 单元格应恢复渲染`).toBe(true);
            expect(td.attributes('rowspan')).toBeUndefined();
        }
    });
});

describe('行列合并 + virtual + virtual-x（文档「行列合并」场景）', () => {
    const columns = [
        { title: 'id', dataIndex: 'id', width: 80 },
        { title: 'continent', dataIndex: 'continent', width: 100, mergeCells: mergeCellsRowCol },
        { title: 'country', dataIndex: 'country', width: 120, mergeCells: mergeCellsRowCol },
        { title: 'province', dataIndex: 'province', width: 120, mergeCells: mergeCellsRowCol },
        ...new Array(30).fill(0).map((_, i) => ({ title: `Column ${i}`, dataIndex: `column-${i}`, width: 100 })),
    ];

    const dataSourceRC = (() => {
        const rows = [];
        let id = 0;
        for (let g = 0; g < 20; g++) {
            const groupSize = 6;
            for (let i = 0; i < groupSize; i++) {
                const row = {
                    id: id++,
                    continent: `Continent ${g}`,
                    country: `Country ${g}-${Math.floor(i / 2)}`,
                    province: `Province ${g}-${i}`,
                };
                for (let c = 0; c < 30; c++) row[`column-${c}`] = `${g}-${i}-${c}`;
                if (i === 0) {
                    row.rowspan = { continent: groupSize };
                    row.colspan = { province: 3 };
                } else if (i % 2 === 0) {
                    row.rowspan = { country: 2 };
                }
                rows.push(row);
            }
        }
        return rows;
    })();

    const wrapper = mount(StkTable, {
        props: { rowKey: 'id', virtual: true, virtualX: true, cellHover: true, columns, dataSource: dataSourceRC },
    });

    test(
        'virtual + virtual-x 下滚动，行合并状态正确',
        async () => {
            const pageSize = mockContainerHeight(wrapper, 300);
            const maxScrollTop = dataSourceRC.length * ROW_HEIGHT - 300;
            const allErrors = [];
            for (let top = 0; top <= maxScrollTop; top += ROW_HEIGHT * 2) {
                await scrollYTo(wrapper, top);
                // 仅校验行合并列（continent/country）；province 为列合并，不在此校验模型内
                const errors = checkMergeDom(wrapper, dataSourceRC, ['continent', 'country'], top, pageSize);
                if (errors.length) {
                    allErrors.push(`scrollTop=${top}:\n  ` + errors.join('\n  '));
                }
            }
            expect(allErrors).toEqual([]);
        },
        60_000,
    );
});
