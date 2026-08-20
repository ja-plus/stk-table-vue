/**
 * 变高模式（autoRowHeight）纵向虚拟滚动 Fenwick 树优化测试
 * - 差分单测：新树定位与旧逐行累加参考实现的 startIndex/endIndex/offsetTop 逐位一致
 * - 行为单测：scrollHeight 精确化、数据替换后行高回收、setAutoHeight 立即生效
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import StkTable from '../src/StkTable/StkTable.vue';
import { RowHeightFenwickTree } from '../src/StkTable/utils/rowHeightFenwickTree';
import { describe, expect, test } from 'vitest';

const ROW_HEIGHT = 28;
const HEADER_HEIGHT = 28; // headerRowHeight 默认等于 ROW_HEIGHT，单级表头

// ─── Helpers ────────────────────────────────────────────────────────────────

/** 确定性伪随机（线性同余），保证测试可复现 */
function makeRnd(seedInit) {
    let seed = seedInit;
    return () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
    };
}

/**
 * 生成变高数据集：模拟「实测值 / expectedHeight 函数 / 默认行高」三种来源。
 * 所有高度均为 0.25 的整数倍（二进制精确表示，避免浮点求和顺序差异干扰逐位比对）。
 */
function genHeights(n) {
    const rnd = makeRnd(42);
    const heights = [];
    for (let i = 0; i < n; i++) {
        const kind = i % 3;
        if (kind === 0) heights.push(27.5 + Math.floor(rnd() * 8) * 1.25);
        else if (kind === 1) heights.push(30.25 + Math.floor(rnd() * 4) * 0.75);
        else heights.push(ROW_HEIGHT);
    }
    return heights;
}

/** 旧实现参考：逐行累加定位（优化前 updateVirtualScrollY 变高分支的语义） */
function legacyLocate(heights, sTop, containerHeight) {
    const dataLength = heights.length;
    let startIndex = 0;
    let endIndex = dataLength;
    let autoRowHeightTop = 0;
    for (let i = 0; i < dataLength; i++) {
        autoRowHeightTop += heights[i];
        if (autoRowHeightTop >= sTop) {
            startIndex = i;
            autoRowHeightTop -= heights[i];
            break;
        }
    }
    let containerHeightSum = 0;
    for (let i = startIndex + 1; i < dataLength; i++) {
        containerHeightSum += heights[i];
        if (containerHeightSum >= containerHeight) {
            endIndex = i;
            break;
        }
    }
    return { startIndex, endIndex, offsetTop: autoRowHeightTop };
}

/** 新实现：与 useVirtualScroll 中树上二分定位完全一致的公式 */
function treeLocate(tree, dataLength, sTop, containerHeight) {
    let startIndex = tree.findFirstPrefixGE(sTop);
    let offsetTop;
    if (startIndex >= dataLength) {
        startIndex = 0;
        offsetTop = tree.total;
    } else {
        offsetTop = tree.query(startIndex);
    }
    const found = tree.findFirstPrefixGE(tree.query(startIndex + 1) + containerHeight);
    const endIndex = Math.max(found, Math.min(startIndex + 1, dataLength));
    return { startIndex, endIndex, offsetTop };
}

// ─── 1. Fenwick 树单元测试 ──────────────────────────────────────────────────

describe('RowHeightFenwickTree', () => {
    test('build/query/total 与逐行累加一致', () => {
        const heights = genHeights(1001);
        const tree = new RowHeightFenwickTree(heights.length);
        tree.build(heights);
        let prefix = 0;
        for (let i = 0; i < heights.length; i++) {
            prefix += heights[i];
            expect(tree.query(i + 1)).toBe(prefix);
        }
        expect(tree.total).toBe(prefix);
        // 边界
        expect(tree.query(0)).toBe(0);
        expect(tree.query(-5)).toBe(0);
        expect(tree.query(heights.length + 10)).toBe(prefix);
    });

    test('add 单点增量更新后前缀和仍与逐行累加一致', () => {
        const heights = genHeights(500);
        const tree = new RowHeightFenwickTree(heights.length);
        tree.build(heights);
        const rnd = makeRnd(7);
        const data = heights.slice();
        for (let k = 0; k < 200; k++) {
            const idx = Math.floor(rnd() * data.length);
            const delta = (Math.floor(rnd() * 41) - 20) * 0.25;
            data[idx] += delta;
            tree.add(idx, delta);
        }
        let prefix = 0;
        for (let i = 0; i < data.length; i++) {
            prefix += data[i];
            expect(tree.query(i + 1)).toBe(prefix);
        }
        expect(tree.total).toBe(prefix);
    });

    test('findFirstPrefixGE 与线性扫描逐位一致', () => {
        const heights = genHeights(800);
        const tree = new RowHeightFenwickTree(heights.length);
        tree.build(heights);
        const prefixes = [0];
        let sum = 0;
        for (const h of heights) prefixes.push((sum += h));

        const targets = [0, 0.25];
        for (let i = 0; i < prefixes.length; i += 13) {
            targets.push(prefixes[i] - 0.5, prefixes[i], prefixes[i] + 0.5);
        }
        targets.push(sum - 0.25, sum, sum + 100);

        for (const target of targets) {
            // 参考：首个「累计高度（含本行）>= target」的行；不存在则 heights.length
            let expected = heights.length;
            let acc = 0;
            for (let i = 0; i < heights.length; i++) {
                acc += heights[i];
                if (acc >= target) {
                    expected = i;
                    break;
                }
            }
            if (target <= 0) expected = 0;
            expect(tree.findFirstPrefixGE(target), `target=${target}`).toBe(expected);
        }
    });

    test('size=0 退化情况', () => {
        const tree = new RowHeightFenwickTree(0);
        expect(tree.total).toBe(0);
        expect(tree.query(5)).toBe(0);
        expect(tree.findFirstPrefixGE(10)).toBe(0);
    });
});

// ─── 2. 差分测试：新定位 vs 旧逐行累加 ──────────────────────────────────────

describe('差分：树上二分定位与逐行累加语义逐位一致', () => {
    test('随机变高数据集上 startIndex/endIndex/offsetTop 一致', () => {
        const n = 2000;
        const heights = genHeights(n);
        const tree = new RowHeightFenwickTree(n);
        tree.build(heights);

        // sTop 采样：0、边界（前缀和及其两侧）、随机位置、总高处及越界
        const rnd = makeRnd(2026);
        const sTops = [0, 1];
        for (let i = 0; i < n; i += 37) {
            let p = 0;
            for (let j = 0; j <= i; j++) p += heights[j];
            sTops.push(p - 0.25, p, p + 0.25);
        }
        const total = heights.reduce((s, h) => s + h, 0);
        for (let k = 0; k < 300; k++) sTops.push(rnd() * total);
        sTops.push(total - 1, total, total + 100);

        const containerHeights = [0, 100, 333.25, 1000];
        for (const containerHeight of containerHeights) {
            for (const sTop of sTops) {
                const expected = legacyLocate(heights, sTop, containerHeight);
                const actual = treeLocate(tree, n, sTop, containerHeight);
                expect(actual, `sTop=${sTop}, containerHeight=${containerHeight}`).toEqual(expected);
            }
        }
    });
});

// ─── 3. 行为测试（组件级） ──────────────────────────────────────────────────

const columns = [
    { dataIndex: 'id', title: 'ID', width: 100 },
    { dataIndex: 'name', title: 'Name', width: 100 },
];

function genData(count, keyPrefix = 'k') {
    return Array.from({ length: count }, (_, i) => ({
        id: `${keyPrefix}${i}`,
        name: `row-${i}`,
        // 估算高度（0.25 的整数倍）
        h: 30 + (i % 5) * 2.5,
    }));
}

function createWrapper(dataSource, extraProps = {}) {
    const wrapper = mount(StkTable, {
        props: {
            rowKey: 'id',
            columns,
            dataSource,
            virtual: true,
            rowHeight: ROW_HEIGHT,
            autoRowHeight: { expectedHeight: row => row.h },
            ...extraProps,
        },
    });
    Object.defineProperty(wrapper.element, 'clientHeight', { configurable: true, value: 300 });
    Object.defineProperty(wrapper.element, 'clientWidth', { configurable: true, value: 400 });
    wrapper.vm.initVirtualScroll();
    return wrapper;
}

/** 用 setupState 读取组件内部状态 */
function getSetupState(wrapper, key) {
    const state = wrapper.vm.$.setupState[key];
    return state?.value ?? state;
}

/**
 * 行高总高（树推导）+ 表头高。
 * 注：virtualScroll.scrollHeight 仅在自定义滚动条开启时写入，
 * 此处直接读行高缓存诊断信息，与 updateVirtualScrollY 的 scrollHeight 公式同源。
 */
function getContentHeight(wrapper) {
    return getSetupState(wrapper, 'getRowHeightCacheInfo')().total + HEADER_HEIGHT;
}

describe('行为：scrollHeight 精确化', () => {
    test('scrollHeight 等于各行估算高度之和加表头高度', () => {
        const data = genData(200);
        const wrapper = createWrapper(data);
        const estimatedTotal = data.reduce((s, r) => s + r.h, 0);
        expect(getContentHeight(wrapper)).toBe(estimatedTotal + HEADER_HEIGHT);
        wrapper.unmount();
    });

    test('实测/设置行高大于估算高度时总高度随之增大', () => {
        const data = genData(200);
        const wrapper = createWrapper(data);
        const estimatedTotal = data.reduce((s, r) => s + r.h, 0);
        wrapper.vm.setAutoHeight('k0', 100);
        wrapper.vm.initVirtualScrollY();
        expect(getContentHeight(wrapper)).toBe(estimatedTotal - data[0].h + 100 + HEADER_HEIGHT);
        wrapper.unmount();
    });

    test('开启自定义滚动条时 virtualScroll.scrollHeight 取真实总高', () => {
        const data = genData(200);
        const wrapper = createWrapper(data, { scrollbar: true });
        const estimatedTotal = data.reduce((s, r) => s + r.h, 0);
        const vs = getSetupState(wrapper, 'virtualScroll');
        expect(vs.scrollHeight).toBe(estimatedTotal + HEADER_HEIGHT);
        wrapper.unmount();
    });

    test('视口下方占位高度等于剩余行高度之和（由累计和推导）', () => {
        const data = genData(200);
        const wrapper = createWrapper(data);
        const el = wrapper.element;
        el.scrollTop = 2000;
        wrapper.vm.initVirtualScrollY();
        const vs = getSetupState(wrapper, 'virtualScroll');
        const offsetBottom = getSetupState(wrapper, 'virtual_offsetBottom');
        let expected = 0;
        for (let i = vs.endIndex + 1; i < data.length; i++) expected += data[i].h;
        expect(offsetBottom).toBeCloseTo(expected, 10);
        wrapper.unmount();
    });
});

describe('行为：setAutoHeight / clearAllAutoHeight 语义', () => {
    test('setAutoHeight 后定位与总高立即生效', () => {
        const data = genData(200);
        const wrapper = createWrapper(data);
        wrapper.vm.setAutoHeight('k0', 100); // k0 高度 30 → 100
        const el = wrapper.element;
        // scrollTop 恰在 k0 内部：startIndex 仍为 0
        el.scrollTop = 99;
        wrapper.vm.initVirtualScrollY();
        let vs = getSetupState(wrapper, 'virtualScroll');
        expect(vs.startIndex).toBe(0);
        expect(vs.offsetTop).toBe(0);
        // scrollTop 越过 k0 新高度：startIndex = 1，offsetTop = 100
        el.scrollTop = 100.5;
        wrapper.vm.initVirtualScrollY();
        vs = getSetupState(wrapper, 'virtualScroll');
        expect(vs.startIndex).toBe(1);
        expect(vs.offsetTop).toBe(100);
        wrapper.unmount();
    });

    test('setAutoHeight 行键不在当前数据中时仅更新（不报错，不影响总高）', () => {
        const data = genData(200);
        const wrapper = createWrapper(data);
        const estimatedTotal = data.reduce((s, r) => s + r.h, 0);
        wrapper.vm.setAutoHeight('not-exist', 999);
        wrapper.vm.initVirtualScrollY();
        expect(getContentHeight(wrapper)).toBe(estimatedTotal + HEADER_HEIGHT);
        wrapper.unmount();
    });

    test('clearAllAutoHeight 后回退为估算高度', () => {
        const data = genData(200);
        const wrapper = createWrapper(data);
        const estimatedTotal = data.reduce((s, r) => s + r.h, 0);
        wrapper.vm.setAutoHeight('k0', 120);
        wrapper.vm.initVirtualScrollY();
        wrapper.vm.clearAllAutoHeight();
        wrapper.vm.initVirtualScrollY();
        expect(getContentHeight(wrapper)).toBe(estimatedTotal + HEADER_HEIGHT);
        wrapper.unmount();
    });
});

describe('行为：行高缓存随数据变更回收', () => {
    test('rowHeight prop 变更后树按新行高重建（缓存键含行高函数）', async () => {
        const data = genData(200);
        const wrapper = mount(StkTable, {
            props: {
                rowKey: 'id',
                columns,
                dataSource: data,
                virtual: true,
                rowHeight: ROW_HEIGHT,
                autoRowHeight: true, // 无 expectedHeight 时回退到 rowHeight
            },
        });
        Object.defineProperty(wrapper.element, 'clientHeight', { configurable: true, value: 300 });
        Object.defineProperty(wrapper.element, 'clientWidth', { configurable: true, value: 400 });
        wrapper.vm.initVirtualScroll();
        expect(getContentHeight(wrapper)).toBe(200 * ROW_HEIGHT + HEADER_HEIGHT);
        // 数据不变，仅改 rowHeight：总高应随之变化（树懒重建）
        await wrapper.setProps({ rowHeight: 40 });
        wrapper.vm.initVirtualScrollY();
        expect(getContentHeight(wrapper)).toBe(200 * 40 + HEADER_HEIGHT);
        wrapper.unmount();
    });
    test('数据整体替换后旧行键行高被回收，缓存规模与新数据一致', async () => {
        const oldData = genData(100, 'old-');
        const wrapper = createWrapper(oldData);
        wrapper.vm.setAutoHeight('old-0', 80);
        wrapper.vm.setAutoHeight('old-1', 90);
        wrapper.vm.initVirtualScrollY();
        let info = getSetupState(wrapper, 'getRowHeightCacheInfo')();
        expect(info.mapKeys).toContain('old-0');
        expect(info.mapKeys).toContain('old-1');

        // 整体替换为全新行键的数据
        const newData = genData(50, 'new-');
        await wrapper.setProps({ dataSource: newData });
        wrapper.vm.initVirtualScrollY();

        info = getSetupState(wrapper, 'getRowHeightCacheInfo')();
        // 旧行键全部被回收（渲染中写入的行也只会是新行键）
        expect(info.mapKeys.every(k => k.startsWith('new-'))).toBe(true);
        expect(info.mapKeys).not.toContain('old-0');
        expect(info.mapKeys).not.toContain('old-1');
        // 树缓存与新数据同规模，总高为新数据估算高度和
        expect(info.cacheSize).toBe(newData.length);
        const newTotal = newData.reduce((s, r) => s + r.h, 0);
        expect(getContentHeight(wrapper)).toBe(newTotal + HEADER_HEIGHT);
        wrapper.unmount();
    });
});
