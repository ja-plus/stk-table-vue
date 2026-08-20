/**
 * StkTable Scroll Performance Benchmark
 * @vitest-environment happy-dom
 *
 * Measures: mount time, DOM node count, virtual scroll recalculation time
 * across different table configurations:
 *   - Vertical virtual scroll (10K / 50K rows)
 *   - Horizontal virtual scroll (virtualX)
 *   - Cell merging (rowspan)
 *   - Multi-level headers
 *   - Combined features
 *   - Non-virtual baseline
 */
import { mount } from '@vue/test-utils';
import { StkTable } from '@/StkTable';
import { afterAll, describe, test } from 'vitest';
import { nextTick } from 'vue';

// ─── Helpers ────────────────────────────────────────────────────────────────

const ITERATIONS = 5;
const WARMUP = 1;

function genData(count, colPrefix = 'col', colCount = 5) {
    const data = [];
    for (let i = 0; i < count; i++) {
        const row = { id: i };
        for (let j = 0; j < colCount; j++) row[`${colPrefix}${j}`] = `r${i}c${j}`;
        data.push(row);
    }
    return data;
}

function genColumns(count, colPrefix = 'col', width = 120) {
    return Array.from({ length: count }, (_, i) => ({
        dataIndex: `${colPrefix}${i}`,
        title: `Col${i}`,
        width,
    }));
}

function measure(fn, iterations = ITERATIONS, warmup = WARMUP) {
    // warmup
    for (let i = 0; i < warmup; i++) fn();
    const times = [];
    for (let i = 0; i < iterations; i++) {
        const s = performance.now();
        fn();
        times.push(performance.now() - s);
    }
    times.sort((a, b) => a - b);
    const mid = Math.floor(iterations / 2);
    return {
        median: times[mid],
        min: times[0],
        max: times[iterations - 1],
        avg: +(times.reduce((a, b) => a + b, 0) / iterations).toFixed(4),
    };
}

async function measureAsync(fn, iterations = ITERATIONS, warmup = WARMUP) {
    for (let i = 0; i < warmup; i++) await fn();
    const times = [];
    for (let i = 0; i < iterations; i++) {
        const s = performance.now();
        await fn();
        times.push(performance.now() - s);
    }
    times.sort((a, b) => a - b);
    const mid = Math.floor(iterations / 2);
    return {
        median: times[mid],
        min: times[0],
        max: times[iterations - 1],
        avg: +(times.reduce((a, b) => a + b, 0) / iterations).toFixed(4),
    };
}

function fmt(t) {
    return `${t.median.toFixed(2)}ms (avg=${t.avg}ms, min=${t.min.toFixed(2)}, max=${t.max.toFixed(2)})`;
}

function countNodes(wrapper) {
    return wrapper.findAll('*').length;
}

/** Detect which features the current version supports */
async function detectFeatures() {
    const features = {
        mergeCells: true,
        virtualX: true,
        multiHeader: true,
        registerFeature: false,
    };
    try {
        const mod = await import('@/StkTable');
        if (typeof mod.registerFeature === 'function') features.registerFeature = true;
    } catch {
        /* ignore */
    }
    return features;
}

// ─── Shared state ───────────────────────────────────────────────────────────

let features;

// Use afterAll to print a summary so it appears in test output
afterAll(() => {
    console.log('\n[Bench] Performance benchmark complete.');
});

// ─── 1. Vertical Virtual Scroll ─────────────────────────────────────────────

describe('1_vertical_scroll', () => {
    test('10K_rows_mount_and_scroll', async () => {
        const data = genData(10000);
        const cols = genColumns(5);

        const mountTime = await measureAsync(async () => {
            const w = mount(StkTable, {
                props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, rowHeight: 28 },
            });
            return w;
        });

        const wrapper = mount(StkTable, {
            props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, rowHeight: 28 },
        });
        await nextTick();

        const nodes = countNodes(wrapper);
        const rows = wrapper.findAll('tbody > tr[data-row-key]').length;

        // Simulate scroll to middle
        const container = wrapper.find('.stk-table');
        const el = container.element;
        el.scrollTop = 5000 * 28;

        const scrollMid = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') {
                wrapper.vm.initVirtualScrollY();
                await nextTick();
            }
        });

        // Simulate deep scroll
        el.scrollTop = 9500 * 28;
        const scrollDeep = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') {
                wrapper.vm.initVirtualScrollY();
                await nextTick();
            }
        });

        console.log(`[PERF] vertical_10k | mount=${fmt(mountTime)} | domNodes=${nodes} | renderedRows=${rows} | scrollMid=${fmt(scrollMid)} | scrollDeep=${fmt(scrollDeep)}`);
        wrapper.unmount();
    });

    test('50K_rows_mount_and_deep_scroll', async () => {
        const data = genData(50000);
        const cols = genColumns(5);

        const mountTime = await measureAsync(async () => {
            const w = mount(StkTable, {
                props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, rowHeight: 28 },
            });
            return w;
        });

        const wrapper = mount(StkTable, {
            props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, rowHeight: 28 },
        });
        await nextTick();

        const nodes = countNodes(wrapper);

        // Deep scroll to 90%
        const el = wrapper.find('.stk-table').element;
        el.scrollTop = 45000 * 28;
        const scrollDeep = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') {
                wrapper.vm.initVirtualScrollY();
                await nextTick();
            }
        });

        console.log(`[PERF] vertical_50k | mount=${fmt(mountTime)} | domNodes=${nodes} | scrollDeep=${fmt(scrollDeep)}`);
        wrapper.unmount();
    });

    test(
        '10K_rows_non_virtual_baseline',
        async () => {
            // Only render 500 rows in non-virtual mode to avoid happy-dom overload
            const data = genData(500);
            const cols = genColumns(5);

            const mountTime = await measureAsync(async () => {
                const w = mount(StkTable, {
                    props: { rowKey: 'id', columns: cols, dataSource: data, virtual: false, rowHeight: 28 },
                });
                return w;
            });

            const wrapper = mount(StkTable, {
                props: { rowKey: 'id', columns: cols, dataSource: data, virtual: false, rowHeight: 28 },
            });
            await nextTick();
            const nodes = countNodes(wrapper);
            const rows = wrapper.findAll('tbody > tr[data-row-key]').length;

            console.log(`[PERF] non_virtual_500 | mount=${fmt(mountTime)} | domNodes=${nodes} | renderedRows=${rows}`);
            wrapper.unmount();
        },
        // Non-virtual rendering of 500 rows is slow in happy-dom, raise timeout to avoid flaky failure under load
        30000,
    );
});

// ─── 2. Horizontal Virtual Scroll (virtualX) ────────────────────────────────

describe('2_horizontal_scroll', () => {
    test('virtualX_30cols_5K_rows', async () => {
        const cols = genColumns(30, 'c', 100);
        const data = genData(5000, 'c', 30);

        const mountTime = await measureAsync(async () => {
            const w = mount(StkTable, {
                props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, virtualX: true, rowHeight: 28 },
            });
            return w;
        });

        const wrapper = mount(StkTable, {
            props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, virtualX: true, rowHeight: 28 },
        });
        await nextTick();
        const nodes = countNodes(wrapper);

        // Horizontal scroll
        const el = wrapper.find('.stk-table').element;
        el.scrollLeft = 1500;
        const scrollX = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollX === 'function') {
                wrapper.vm.initVirtualScrollX();
                await nextTick();
            }
        });

        // Combined X+Y scroll
        el.scrollTop = 2500 * 28;
        el.scrollLeft = 1500;
        const scrollXY = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') wrapper.vm.initVirtualScrollY();
            if (typeof wrapper.vm.initVirtualScrollX === 'function') wrapper.vm.initVirtualScrollX();
            await nextTick();
        });

        console.log(`[PERF] virtualX_30cols | mount=${fmt(mountTime)} | domNodes=${nodes} | scrollX=${fmt(scrollX)} | scrollXY=${fmt(scrollXY)}`);
        wrapper.unmount();
    });

    test('virtualX_50cols_2K_rows', async () => {
        const cols = genColumns(50, 'c', 100);
        const data = genData(2000, 'c', 50);

        const mountTime = await measureAsync(async () => {
            const w = mount(StkTable, {
                props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, virtualX: true, rowHeight: 28 },
            });
            return w;
        });

        const wrapper = mount(StkTable, {
            props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, virtualX: true, rowHeight: 28 },
        });
        await nextTick();
        const nodes = countNodes(wrapper);

        const el = wrapper.find('.stk-table').element;
        el.scrollLeft = 2500;
        const scrollX = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollX === 'function') {
                wrapper.vm.initVirtualScrollX();
                await nextTick();
            }
        });

        console.log(`[PERF] virtualX_50cols | mount=${fmt(mountTime)} | domNodes=${nodes} | scrollX=${fmt(scrollX)}`);
        wrapper.unmount();
    });
});

// ─── 3. Cell Merging ────────────────────────────────────────────────────────

describe('3_cell_merging', () => {
    test('mergeCells_rowspan_5K_rows', async () => {
        features = features || (await detectFeatures());
        if (!features.mergeCells) {
            console.log('[PERF] mergeCells_rowspan | SKIPPED (feature not available)');
            return;
        }

        const cols = [
            { dataIndex: 'id', title: 'ID', width: 80 },
            { dataIndex: 'col0', title: 'Merge2', width: 120, mergeCells: ({ rowIndex }) => (rowIndex % 2 === 0 ? { rowspan: 2 } : undefined) },
            { dataIndex: 'col1', title: 'Normal', width: 120 },
            { dataIndex: 'col2', title: 'Merge3', width: 120, mergeCells: ({ rowIndex }) => (rowIndex % 3 === 0 ? { rowspan: 3 } : undefined) },
            { dataIndex: 'col3', title: 'Normal2', width: 120 },
        ];
        const data = genData(5000);

        const mountTime = await measureAsync(async () => {
            const w = mount(StkTable, {
                props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, rowHeight: 28 },
            });
            return w;
        });

        const wrapper = mount(StkTable, {
            props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, rowHeight: 28 },
        });
        await nextTick();
        const nodes = countNodes(wrapper);

        // Scroll in merge mode
        const el = wrapper.find('.stk-table').element;
        el.scrollTop = 2500 * 28;
        const scrollMerge = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') {
                wrapper.vm.initVirtualScrollY();
                await nextTick();
            }
        });

        console.log(`[PERF] mergeCells_rowspan | mount=${fmt(mountTime)} | domNodes=${nodes} | scrollMid=${fmt(scrollMerge)}`);
        wrapper.unmount();
    });

    test('mergeCells_colspan_5K_rows', async () => {
        features = features || (await detectFeatures());
        if (!features.mergeCells) {
            console.log('[PERF] mergeCells_colspan | SKIPPED (feature not available)');
            return;
        }

        const cols = [
            { dataIndex: 'id', title: 'ID', width: 80 },
            { dataIndex: 'col0', title: 'CSp2', width: 120, mergeCells: ({ rowIndex }) => (rowIndex % 4 === 0 ? { colspan: 2 } : undefined) },
            { dataIndex: 'col1', title: 'CSp2b', width: 120 },
            { dataIndex: 'col2', title: 'CSp3', width: 120, mergeCells: ({ rowIndex }) => (rowIndex % 5 === 0 ? { colspan: 3 } : undefined) },
            { dataIndex: 'col3', title: 'CSp3b', width: 120 },
        ];
        const data = genData(5000);

        const mountTime = await measureAsync(async () => {
            const w = mount(StkTable, {
                props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, rowHeight: 28 },
            });
            return w;
        });

        const wrapper = mount(StkTable, {
            props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, rowHeight: 28 },
        });
        await nextTick();
        const nodes = countNodes(wrapper);

        const el = wrapper.find('.stk-table').element;
        el.scrollTop = 2500 * 28;
        const scrollMerge = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') {
                wrapper.vm.initVirtualScrollY();
                await nextTick();
            }
        });

        console.log(`[PERF] mergeCells_colspan | mount=${fmt(mountTime)} | domNodes=${nodes} | scrollMid=${fmt(scrollMerge)}`);
        wrapper.unmount();
    });

    test('mergeCells_mixed_rowspan_colspan_3K_rows', async () => {
        features = features || (await detectFeatures());
        if (!features.mergeCells) {
            console.log('[PERF] mergeCells_mixed | SKIPPED (feature not available)');
            return;
        }

        const cols = [
            { dataIndex: 'id', title: 'ID', width: 80 },
            { dataIndex: 'col0', title: 'RS2', width: 120, mergeCells: ({ rowIndex }) => (rowIndex % 2 === 0 ? { rowspan: 2 } : undefined) },
            { dataIndex: 'col1', title: 'CS2', width: 120, mergeCells: ({ rowIndex }) => (rowIndex % 3 === 0 ? { colspan: 2 } : undefined) },
            { dataIndex: 'col2', title: 'RS3', width: 120, mergeCells: ({ rowIndex }) => (rowIndex % 3 === 0 ? { rowspan: 3 } : undefined) },
            { dataIndex: 'col3', title: 'Normal', width: 120 },
        ];
        const data = genData(3000);

        const mountTime = await measureAsync(async () => {
            const w = mount(StkTable, {
                props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, rowHeight: 28 },
            });
            return w;
        });

        const wrapper = mount(StkTable, {
            props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, rowHeight: 28 },
        });
        await nextTick();

        const el = wrapper.find('.stk-table').element;
        el.scrollTop = 1500 * 28;
        const scrollMerge = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') {
                wrapper.vm.initVirtualScrollY();
                await nextTick();
            }
        });

        console.log(`[PERF] mergeCells_mixed | mount=${fmt(mountTime)} | scrollMid=${fmt(scrollMerge)}`);
        wrapper.unmount();
    });
});

// ─── 4. Multi-level Headers ─────────────────────────────────────────────────

describe('4_multi_header', () => {
    test('3_level_headers_5K_rows', async () => {
        const columns = [
            {
                title: 'Group A',
                children: [
                    { dataIndex: 'col0', title: 'A-1', width: 100 },
                    { dataIndex: 'col1', title: 'A-2', width: 100 },
                ],
            },
            {
                title: 'Group B',
                children: [
                    { dataIndex: 'col2', title: 'B-1', width: 100 },
                    {
                        title: 'B-Sub',
                        children: [
                            { dataIndex: 'col3', title: 'B-Sub-1', width: 100 },
                            { dataIndex: 'col4', title: 'B-Sub-2', width: 100 },
                        ],
                    },
                ],
            },
            {
                title: 'Group C',
                children: [
                    { dataIndex: 'col0', title: 'C-1', width: 100 },
                    { dataIndex: 'col1', title: 'C-2', width: 100 },
                    { dataIndex: 'col2', title: 'C-3', width: 100 },
                ],
            },
        ];
        const data = genData(5000);

        const mountTime = await measureAsync(async () => {
            const w = mount(StkTable, {
                props: { rowKey: 'id', columns, dataSource: data, virtual: true, rowHeight: 28 },
            });
            return w;
        });

        const wrapper = mount(StkTable, {
            props: { rowKey: 'id', columns, dataSource: data, virtual: true, rowHeight: 28 },
        });
        await nextTick();
        const nodes = countNodes(wrapper);

        const el = wrapper.find('.stk-table').element;
        el.scrollTop = 2500 * 28;
        const scroll = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') {
                wrapper.vm.initVirtualScrollY();
                await nextTick();
            }
        });

        console.log(`[PERF] multi_header_3lvl | mount=${fmt(mountTime)} | domNodes=${nodes} | scrollMid=${fmt(scroll)}`);
        wrapper.unmount();
    });
});

// ─── 5. Combined Scenarios ──────────────────────────────────────────────────

describe('5_combined', () => {
    test('mergeCells_plus_multiHeader_3K_rows', async () => {
        features = features || (await detectFeatures());

        const columns = [
            {
                title: 'Group A',
                children: [
                    { dataIndex: 'col0', title: 'A-1', width: 100, mergeCells: features.mergeCells ? ({ rowIndex }) => (rowIndex % 2 === 0 ? { rowspan: 2 } : undefined) : undefined },
                    { dataIndex: 'col1', title: 'A-2', width: 100 },
                ],
            },
            {
                title: 'Group B',
                children: [
                    { dataIndex: 'col2', title: 'B-1', width: 100, mergeCells: features.mergeCells ? ({ rowIndex }) => (rowIndex % 3 === 0 ? { rowspan: 3 } : undefined) : undefined },
                    { dataIndex: 'col3', title: 'B-2', width: 100 },
                ],
            },
        ];
        const data = genData(3000);

        const mountTime = await measureAsync(async () => {
            const w = mount(StkTable, {
                props: { rowKey: 'id', columns, dataSource: data, virtual: true, rowHeight: 28 },
            });
            return w;
        });

        const wrapper = mount(StkTable, {
            props: { rowKey: 'id', columns, dataSource: data, virtual: true, rowHeight: 28 },
        });
        await nextTick();

        const el = wrapper.find('.stk-table').element;
        el.scrollTop = 1500 * 28;
        const scroll = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') {
                wrapper.vm.initVirtualScrollY();
                await nextTick();
            }
        });

        console.log(`[PERF] merge+multiHeader | mount=${fmt(mountTime)} | scrollMid=${fmt(scroll)}`);
        wrapper.unmount();
    });

    test('mergeCells_plus_virtualX_3K_rows', async () => {
        features = features || (await detectFeatures());
        if (!features.mergeCells || !features.virtualX) {
            console.log('[PERF] merge+virtualX | SKIPPED');
            return;
        }

        const cols = genColumns(20, 'c', 100);
        // Add mergeCells to some columns
        cols[0].mergeCells = ({ rowIndex }) => (rowIndex % 2 === 0 ? { rowspan: 2 } : undefined);
        cols[5].mergeCells = ({ rowIndex }) => (rowIndex % 3 === 0 ? { rowspan: 3 } : undefined);
        const data = genData(3000, 'c', 20);

        const mountTime = await measureAsync(async () => {
            const w = mount(StkTable, {
                props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, virtualX: true, rowHeight: 28 },
            });
            return w;
        });

        const wrapper = mount(StkTable, {
            props: { rowKey: 'id', columns: cols, dataSource: data, virtual: true, virtualX: true, rowHeight: 28 },
        });
        await nextTick();

        const el = wrapper.find('.stk-table').element;
        el.scrollTop = 1500 * 28;
        el.scrollLeft = 500;
        const scroll = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') wrapper.vm.initVirtualScrollY();
            if (typeof wrapper.vm.initVirtualScrollX === 'function') wrapper.vm.initVirtualScrollX();
            await nextTick();
        });

        console.log(`[PERF] merge+virtualX | mount=${fmt(mountTime)} | scrollXY=${fmt(scroll)}`);
        wrapper.unmount();
    });

    test('all_features_combined_2K_rows', async () => {
        features = features || (await detectFeatures());
        if (!features.mergeCells || !features.virtualX) {
            console.log('[PERF] all_features | SKIPPED');
            return;
        }

        const columns = [
            {
                title: 'Group A',
                children: [
                    { dataIndex: 'col0', title: 'A-1', width: 100, mergeCells: ({ rowIndex }) => (rowIndex % 2 === 0 ? { rowspan: 2 } : undefined) },
                    { dataIndex: 'col1', title: 'A-2', width: 100 },
                    { dataIndex: 'col2', title: 'A-3', width: 100, mergeCells: ({ rowIndex }) => (rowIndex % 4 === 0 ? { colspan: 2 } : undefined) },
                ],
            },
            {
                title: 'Group B',
                children: [
                    { dataIndex: 'col3', title: 'B-1', width: 100, mergeCells: ({ rowIndex }) => (rowIndex % 3 === 0 ? { rowspan: 3 } : undefined) },
                    { dataIndex: 'col4', title: 'B-2', width: 100 },
                ],
            },
        ];
        // Need enough columns for virtualX
        for (let i = 5; i < 20; i++) {
            columns.push({ dataIndex: `col${i}`, title: `Col${i}`, width: 100 });
        }
        const data = genData(2000, 'col', 20);

        const mountTime = await measureAsync(async () => {
            const w = mount(StkTable, {
                props: { rowKey: 'id', columns, dataSource: data, virtual: true, virtualX: true, rowHeight: 28 },
            });
            return w;
        });

        const wrapper = mount(StkTable, {
            props: { rowKey: 'id', columns, dataSource: data, virtual: true, virtualX: true, rowHeight: 28 },
        });
        await nextTick();

        const el = wrapper.find('.stk-table').element;
        el.scrollTop = 1000 * 28;
        el.scrollLeft = 500;
        const scroll = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') wrapper.vm.initVirtualScrollY();
            if (typeof wrapper.vm.initVirtualScrollX === 'function') wrapper.vm.initVirtualScrollX();
            await nextTick();
        });

        console.log(`[PERF] all_features | mount=${fmt(mountTime)} | scrollXY=${fmt(scroll)}`);
        wrapper.unmount();
    });
});

// ─── 6. Auto Row Height (variable height virtual scroll) ──────────────────

describe('6_auto_row_height', () => {
    /** 变高行数据：每行期望高度不等（模拟 expectedHeight 场景） */
    function genAutoHeightData(count) {
        const data = [];
        for (let i = 0; i < count; i++) {
            const row = { id: i, h: 28 + (i % 5) * 7 };
            for (let j = 0; j < 5; j++) row[`col${j}`] = `r${i}c${j}`;
            data.push(row);
        }
        return data;
    }

    function mountAutoHeightTable(data) {
        return mount(StkTable, {
            props: {
                rowKey: 'id',
                columns: genColumns(5),
                dataSource: data,
                virtual: true,
                rowHeight: 28,
                autoRowHeight: { expectedHeight: row => row.h },
            },
        });
    }

    test('autoRowHeight_10K_rows', async () => {
        const data = genAutoHeightData(10000);

        const mountTime = await measureAsync(async () => {
            const w = mountAutoHeightTable(data);
            return w;
        });

        const wrapper = mountAutoHeightTable(data);
        await nextTick();

        const nodes = countNodes(wrapper);
        const rows = wrapper.findAll('tbody > tr[data-row-key]').length;

        const el = wrapper.find('.stk-table').element;

        // 浅滚到中间（平均行高 ~42px）
        el.scrollTop = 5000 * 42;
        const scrollMid = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') {
                wrapper.vm.initVirtualScrollY();
                await nextTick();
            }
        });

        // 深滚到 90%（不同 scrollTop 强制重算）
        el.scrollTop = 9000 * 42;
        const scrollDeep = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') {
                wrapper.vm.initVirtualScrollY();
                await nextTick();
            }
        });

        console.log(
            `[PERF] autoRowHeight_10k | mount=${fmt(mountTime)} | domNodes=${nodes} | renderedRows=${rows} | scrollMid=${fmt(scrollMid)} | scrollDeep=${fmt(scrollDeep)}`,
        );
        wrapper.unmount();
    });

    test('autoRowHeight_50K_rows', async () => {
        const data = genAutoHeightData(50000);

        const mountTime = await measureAsync(async () => {
            const w = mountAutoHeightTable(data);
            return w;
        });

        const wrapper = mountAutoHeightTable(data);
        await nextTick();

        const nodes = countNodes(wrapper);
        const el = wrapper.find('.stk-table').element;

        // 深滚到 90%
        el.scrollTop = 45000 * 42;
        const scrollDeep = await measureAsync(async () => {
            if (typeof wrapper.vm.initVirtualScrollY === 'function') {
                wrapper.vm.initVirtualScrollY();
                await nextTick();
            }
        });

        console.log(`[PERF] autoRowHeight_50k | mount=${fmt(mountTime)} | domNodes=${nodes} | scrollDeep=${fmt(scrollDeep)}`);
        wrapper.unmount();
    });

    test('autoRowHeight_setHeight_10K_rows', async () => {
        const data = genAutoHeightData(10000);
        const wrapper = mountAutoHeightTable(data);
        await nextTick();

        // 先建好行高树（触发一次重算）
        const el = wrapper.find('.stk-table').element;
        el.scrollTop = 1000;
        wrapper.vm.initVirtualScrollY();
        await nextTick();

        // 批量 setAutoHeight（100 次单点更新）+ 重算生效耗时
        const set100 = await measureAsync(async () => {
            for (let i = 0; i < 100; i++) {
                wrapper.vm.setAutoHeight(String(i), 60 + (i % 3) * 10);
            }
            el.scrollTop = 1100;
            wrapper.vm.initVirtualScrollY();
        });

        console.log(`[PERF] autoRowHeight_setHeight | set100=${fmt(set100)}`);
        wrapper.unmount();
    });
});
