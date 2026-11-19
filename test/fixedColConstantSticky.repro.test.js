/**
 * @vitest-environment happy-dom
 *
 * 回归用例：固定列恒定 sticky（75706f6）。
 * position/z-index 原由 .fixed-cell--active 承载，该 class 随每帧滚动重算；
 * 首列 left 固定时判定退化为 scrollLeft > 0，边界处来回翻转导致 position 回落 static，
 * 表现为横向滚动闪动。修复后几何 class（fixed-cell / fixed-cell--left|right）与内联
 * left/right 偏移恒定，不随滚动变化；仅阴影（及右固定列左边框）仍按滚动位置计算。
 *
 * 修复落在 CSS 选择器层，happy-dom 无布局无法观测 position 计算值，
 * 因此另用 less 编译产物断言样式契约（sticky/z-index 的承载选择器）。
 */
import { mount } from '@vue/test-utils';
import { StkTable } from '@/StkTable';
import { describe, expect, test } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// less 的 package.json 入口为无扩展名路径，vite 无法解析，走 Node require；
// vitest 默认将 CSS 导入 stub 为空模块（?raw 亦被拦截），样式源码用 fs 读取
const less = createRequire(import.meta.url)('less');
const styleSource = readFileSync(resolve(process.cwd(), 'src/StkTable/style.less'), 'utf8');

const columns = [
    { dataIndex: 'id', title: 'ID', width: 100, fixed: 'left' },
    { dataIndex: 'name', title: 'Name', width: 200 },
    { dataIndex: 'age', title: 'Age', width: 100 },
    { dataIndex: 'op', title: 'Op', width: 100, fixed: 'right' },
];
const dataSource = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
];
// 列总宽 500，容器 300：scrollLeft=0 时右固定列天然位置在视口外（被遮挡），
// scrollLeft=200（最大值）时完全滚入视口，不再遮挡。
const CONTAINER_WIDTH = 300;

function nextFrame() {
    return new Promise(resolve => setTimeout(resolve, 35));
}

function createWrapper(extraProps = {}) {
    const wrapper = mount(StkTable, {
        props: { rowKey: 'id', columns, dataSource, ...extraProps },
    });
    Object.defineProperty(wrapper.element, 'clientWidth', { configurable: true, value: CONTAINER_WIDTH });
    wrapper.vm.initVirtualScrollX();
    // onMounted 的 updateFixedShadow 先于 clientWidth mock 执行，用真实容器宽度重算一次
    wrapper.vm.$.setupState.updateFixedShadow();
    return wrapper;
}

async function scrollXTo(wrapper, left) {
    const container = wrapper.element;
    container.scrollLeft = left;
    container.dispatchEvent(new Event('scroll'));
    await nextFrame();
    await wrapper.vm.$nextTick();
}

function getFixedCells(wrapper) {
    const ths = wrapper.findAll('.stk-table-main thead > tr > th');
    const tds = wrapper.findAll('.stk-table-main tbody > tr:first-child > td');
    return { leftTh: ths[0], rightTh: ths[ths.length - 1], leftTd: tds[0], rightTd: tds[tds.length - 1] };
}

describe('固定列几何恒定（不随滚动翻转）', () => {
    test('首列 left 固定：scrollLeft 0↔1 边界往返，几何 class 与内联偏移不变', async () => {
        const wrapper = createWrapper();
        const { leftTh, leftTd } = getFixedCells(wrapper);

        // 静止（scrollLeft=0）：未激活，但几何契约必须齐全
        expect(leftTh.attributes('class')).not.toContain('fixed-cell--active');
        for (const cell of [leftTh, leftTd]) {
            expect(cell.attributes('class')).toContain('fixed-cell');
            expect(cell.attributes('class')).toContain('fixed-cell--left');
            expect(cell.attributes('style')).toMatch(/left:\s*0px/);
        }

        // 越过边界再折返：激活态翻转（滚动管线生效的金丝雀），几何不得变化
        for (const left of [1, 0, 1, 0]) {
            await scrollXTo(wrapper, left);
            const expectedActive = left > 0;
            expect(leftTh.attributes('class').includes('fixed-cell--active')).toBe(expectedActive);
            for (const cell of [leftTh, leftTd]) {
                expect(cell.attributes('class')).toContain('fixed-cell');
                expect(cell.attributes('class')).toContain('fixed-cell--left');
                expect(cell.attributes('style')).toMatch(/left:\s*0px/);
            }
        }
    });

    test('右固定列：几何 class 与内联 right 偏移不随滚动变化', async () => {
        const wrapper = createWrapper();
        const { rightTh, rightTd } = getFixedCells(wrapper);

        const assertGeometry = () => {
            for (const cell of [rightTh, rightTd]) {
                expect(cell.attributes('class')).toContain('fixed-cell');
                expect(cell.attributes('class')).toContain('fixed-cell--right');
                expect(cell.attributes('style')).toMatch(/right:\s*0px/);
            }
        };
        assertGeometry(); // 静止
        for (const left of [1, 120, 200, 0]) {
            await scrollXTo(wrapper, left);
            assertGeometry();
        }
    });
});

describe('阴影仍按滚动位置计算', () => {
    test('fixedColShadow：左列阴影随越界出现/消失，右列阴影随遮挡出现/消失', async () => {
        const wrapper = createWrapper({ fixedColShadow: true });
        await wrapper.vm.$nextTick();
        const { leftTh, rightTh } = getFixedCells(wrapper);

        // 静止：左列未越界无阴影；右列天然位置在视口外，被遮挡，有阴影与左边框
        expect(leftTh.attributes('class')).not.toContain('fixed-cell--shadow');
        expect(rightTh.attributes('class')).toContain('fixed-cell--shadow');
        expect(rightTh.attributes('class')).toContain('fixed-cell--border-left');

        // 滚到最大：左列越界有阴影；右列完全滚入视口，阴影与左边框消失
        await scrollXTo(wrapper, 200);
        expect(leftTh.attributes('class')).toContain('fixed-cell--shadow');
        expect(rightTh.attributes('class')).not.toContain('fixed-cell--shadow');
        expect(rightTh.attributes('class')).not.toContain('fixed-cell--border-left');

        // 折返静止：恢复初始阴影状态
        await scrollXTo(wrapper, 0);
        expect(leftTh.attributes('class')).not.toContain('fixed-cell--shadow');
        expect(rightTh.attributes('class')).toContain('fixed-cell--shadow');
        expect(rightTh.attributes('class')).toContain('fixed-cell--border-left');
    });

    test('未开启 fixedColShadow：任何滚动位置都不出现阴影', async () => {
        const wrapper = createWrapper();
        const { leftTh, rightTh } = getFixedCells(wrapper);
        for (const left of [1, 120, 200, 0]) {
            await scrollXTo(wrapper, left);
            expect(leftTh.attributes('class')).not.toContain('fixed-cell--shadow');
            expect(rightTh.attributes('class')).not.toContain('fixed-cell--shadow');
        }
    });
});

describe('样式契约：sticky/z-index 由 .fixed-cell 恒定承载', () => {
    test('编译产物中几何规则挂在 .fixed-cell 上，--active 不再承载几何，relative 模式覆盖保留', async () => {
        const { css } = await less.render(styleSource);

        expect(css).toMatch(/\.fixed-cell\s*\{[^}]*position:\s*sticky/);
        expect(css).toMatch(/th\.fixed-cell\s*\{[^}]*z-index:\s*3/);
        expect(css).toMatch(/td\.fixed-cell\s*\{[^}]*z-index:\s*1/);
        expect(css).toMatch(/tfoot td\.fixed-cell[^{]*\{[^}]*z-index:\s*2/);
        // 回归守卫：sticky/z-index 不得重新挂回随滚动翻转的 --active
        expect(css).not.toMatch(/\.fixed-cell--active[^{]*\{[^}]*(?:position|z-index)/);
        // relative 模式（cellFixedMode='relative' / legacy）覆盖必须保留
        expect(css).toMatch(/\.fixed-relative-mode\s+\.fixed-cell\s*\{[^}]*position:\s*relative/);
    });
});