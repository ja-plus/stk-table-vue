/**
 * @vitest-environment happy-dom
 *
 * 行高类配置动态变化守卫测试（change: fix-row-height-css-var-sync）
 *
 * 背景：容器内联的 CSS 变量 --row-height 曾绑定到 virtualScroll.rowHeight，
 * 而该字段只在 shallowRef 初始化时求值一次，initVirtualScrollY / updateVirtualScrollY
 * 都不再写入，导致动态修改 row-height 后「虚拟滚动计算用新行高、DOM 渲染仍是旧行高」。
 * 另外 watch(() => props.rowHeight, initVirtualScrollY) 把行高当作首参（虚拟滚动高度）传入，
 * 使 pageSize 被算成 ceil(行高/行高)=1，表格几乎只剩一行。
 *
 * 覆盖：CSS 变量层 / pageSize 层 / 表头与表尾行高 / 展开行行高树 / SRBR 派生高度 / 几何一致。
 */
import { mount } from '@vue/test-utils';
import { StkTable } from '@/StkTable';
import { describe, expect, test } from 'vitest';

const ROW_HEIGHT = 28;
const CONTAINER_HEIGHT = 300;

const columns = [
    { title: 'id', dataIndex: 'id', width: 100 },
    { title: 'name', dataIndex: 'name', width: 120 },
];

const data = new Array(100).fill(0).map((_, i) => ({ id: i, name: `name-${i}` }));

function getSetupState(wrapper, key) {
    return wrapper.vm.$.setupState[key];
}

/** 读取元素内联样式中的 CSS 变量值，未定义返回 null */
function getStyleVar(el, name) {
    const style = el.getAttribute('style') || '';
    const matched = style.match(new RegExp(`(?:^|;)\\s*${name}:\\s*([^;]+)`));
    return matched ? matched[1].trim() : null;
}

/**
 * prop 变化 -> watcher(pre) -> nextTick(initVirtualScrollY) -> triggerRef -> 重渲染
 * 需要两个 tick 才能让新的 --row-height 落到 DOM。
 */
async function settle(wrapper) {
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
}

async function changeProps(wrapper, props) {
    await wrapper.setProps(props);
    await settle(wrapper);
}

/** happy-dom 无布局，clientHeight 需 mock（虚拟滚动高度由此推导 pageSize） */
function mockContainerHeight(wrapper, height = CONTAINER_HEIGHT) {
    Object.defineProperty(wrapper.element, 'clientHeight', { configurable: true, value: height });
}

function mountTable(props = {}) {
    const wrapper = mount(StkTable, {
        props: { rowKey: 'id', virtual: true, rowHeight: ROW_HEIGHT, columns, dataSource: data, ...props },
    });
    mockContainerHeight(wrapper);
    getSetupState(wrapper, 'initVirtualScrollY')();
    return wrapper;
}

/** 期望的可视行数：ceil(容器高 / 行高) - 表头占用的表体行数 */
function expectPageSize(containerHeight, rowHeight, headerRowHeight = ROW_HEIGHT, headerRowCount = 1) {
    return Math.ceil(containerHeight / rowHeight) - Math.floor((headerRowHeight * headerRowCount) / rowHeight);
}

describe('row-height 动态变化', () => {
    test('--row-height 随 props.rowHeight 同步', async () => {
        const wrapper = mountTable();
        expect(getStyleVar(wrapper.element, '--row-height')).toBe(`${ROW_HEIGHT}px`);

        await changeProps(wrapper, { rowHeight: 40 });

        expect(getStyleVar(wrapper.element, '--row-height')).toBe('40px');
    });

    test('变高模式（autoRowHeight）不输出 --row-height', async () => {
        const wrapper = mountTable({ autoRowHeight: true });
        expect(getStyleVar(wrapper.element, '--row-height')).toBe(null);

        await changeProps(wrapper, { rowHeight: 40 });

        expect(getStyleVar(wrapper.element, '--row-height')).toBe(null);
    });

    test('pageSize 按新行高重算（不把行高当容器高度传入）', async () => {
        const wrapper = mountTable();
        expect(getSetupState(wrapper, 'virtualScroll').pageSize).toBe(expectPageSize(CONTAINER_HEIGHT, ROW_HEIGHT));

        await changeProps(wrapper, { rowHeight: 40 });

        const vs = getSetupState(wrapper, 'virtualScroll');
        // 旧缺陷会把 pageSize 算成 1（只渲染约 1 行）
        expect(vs.pageSize).toBe(expectPageSize(CONTAINER_HEIGHT, 40));
        expect(vs.pageSize).toBeGreaterThan(1);
        const renderedRows = wrapper.findAll('tbody tr[data-row-key]').length;
        expect(renderedRows).toBeGreaterThan(1);
    });

    test('store.rowHeight 与实际渲染行高同源', async () => {
        const wrapper = mountTable();
        await changeProps(wrapper, { rowHeight: 40 });

        const vs = getSetupState(wrapper, 'virtualScroll');
        expect(vs.rowHeight).toBe(40);
        expect(getStyleVar(wrapper.element, '--row-height')).toBe(`${vs.rowHeight}px`);
    });
});

describe('header-row-height / footer-row-height 动态变化', () => {
    test('表头行高变化后 --header-row-height 与 pageSize 同步', async () => {
        const wrapper = mountTable();
        const before = getSetupState(wrapper, 'virtualScroll').pageSize;

        await changeProps(wrapper, { headerRowHeight: 56 });

        expect(getStyleVar(wrapper.element, '--header-row-height')).toBe('56px');
        // 56 占 2 行表体高度（56 / 28），可视行数应比之前少 1 行
        expect(getSetupState(wrapper, 'virtualScroll').pageSize).toBe(expectPageSize(CONTAINER_HEIGHT, ROW_HEIGHT, 56));
        expect(getSetupState(wrapper, 'virtualScroll').pageSize).toBe(before - 1);
    });

    test('表尾行高变化后 --footer-row-height 同步且不破坏基准行高', async () => {
        const wrapper = mountTable({ footerData: [{ id: 'sum', name: 'total' }] });
        await changeProps(wrapper, { footerRowHeight: 50 });

        expect(getStyleVar(wrapper.element, '--footer-row-height')).toBe('50px');
        const vs = getSetupState(wrapper, 'virtualScroll');
        expect(vs.rowHeight).toBe(ROW_HEIGHT);
        expect(getStyleVar(wrapper.element, '--row-height')).toBe(`${ROW_HEIGHT}px`);
    });
});

describe('expand-config.height 动态变化', () => {
    const expandColumns = [{ type: 'expand', dataIndex: '', width: 50 }, ...columns];

    test('展开行行高与行高树总高按新值重算', async () => {
        const wrapper = mountTable({ columns: expandColumns, expandConfig: { height: 100 } });
        getSetupState(wrapper, 'setRowExpand')(0, true, { silent: true });
        await settle(wrapper);

        const expandedTr = wrapper.find('tbody tr[data-row-key="expanded-0"]');
        expect(expandedTr.exists()).toBe(true);
        expect(getStyleVar(expandedTr.element, '--row-height')).toBe('100px');
        // 100 行普通行 + 1 行展开行
        expect(getSetupState(wrapper, 'getRowHeightCacheInfo')().total).toBe(100 * ROW_HEIGHT + 100);

        await changeProps(wrapper, { expandConfig: { height: 160 } });

        expect(getStyleVar(wrapper.find('tbody tr[data-row-key="expanded-0"]').element, '--row-height')).toBe('160px');
        expect(getSetupState(wrapper, 'getRowHeightCacheInfo')().total).toBe(100 * ROW_HEIGHT + 160);
    });
});

describe('行高 watcher 的触发条件（性能守卫）', () => {
    /**
     * watcher 的 getter MUST 拼接为原始值而非返回数组：返回数组时每次求值都是新数组，
     * 身份比较必然变化，父组件传入内联对象字面量（`:expand-config="{ height: 40 }"`，官方示例写法）
     * 会让重算在父组件每次重渲染时空跑，展开行/变高大表下连带行高树 O(n) 重建（实测 50K 行 +~10ms/次）。
     *
     * 探针：containerHeight 仅由 initVirtualScrollY 写入 store，故「改容器高度 + 同值新对象 setProps」
     * 后 containerHeight 保持旧值 == 未重算。
     */
    test('expandConfig 同值新对象不触发重算，height 真变化才触发', async () => {
        const expandColumns = [{ type: 'expand', dataIndex: '', width: 50 }, ...columns];
        const wrapper = mountTable({ columns: expandColumns, expandConfig: { height: 100 } });
        expect(getSetupState(wrapper, 'virtualScroll').containerHeight).toBe(CONTAINER_HEIGHT);

        // 模拟父组件重渲染：新对象字面量、height 值未变
        mockContainerHeight(wrapper, 600);
        await changeProps(wrapper, { expandConfig: { height: 100 } });
        expect(getSetupState(wrapper, 'virtualScroll').containerHeight).toBe(CONTAINER_HEIGHT);

        // height 真变化：必须重算，此时才读到新的容器高度
        await changeProps(wrapper, { expandConfig: { height: 160 } });
        const vs = getSetupState(wrapper, 'virtualScroll');
        expect(vs.containerHeight).toBe(600);
        expect(vs.pageSize).toBe(expectPageSize(600, ROW_HEIGHT));
    });

    test('rowHeight 同值 setProps 不触发重算', async () => {
        const wrapper = mountTable();
        mockContainerHeight(wrapper, 600);

        await changeProps(wrapper, { rowHeight: ROW_HEIGHT });

        expect(getSetupState(wrapper, 'virtualScroll').containerHeight).toBe(CONTAINER_HEIGHT);
    });
});

describe('依赖行高的派生几何', () => {
    test('scroll-row-by-row 总高使用新行高', async () => {
        const wrapper = mountTable({ scrollRowByRow: true, scrollbar: false });
        const totalHeightBefore = Number(getStyleVar(wrapper.find('.row-by-row-table-height').element, 'height').replace('px', ''));
        expect(totalHeightBefore).toBe(100 * ROW_HEIGHT + ROW_HEIGHT);

        await changeProps(wrapper, { rowHeight: 40 });

        const el = wrapper.find('.row-by-row-table-height').element;
        expect(Number(getStyleVar(el, 'height').replace('px', ''))).toBe(100 * 40 + ROW_HEIGHT);
    });

    test('改行高并滚动后，偏移/占位/总高与新行高一致', async () => {
        // store.scrollHeight 只在自定义滚动条开启时维护（原生滚动条下由 DOM 决定）
        const wrapper = mountTable({ scrollbar: true });
        await changeProps(wrapper, { rowHeight: 40 });
        getSetupState(wrapper, 'updateVirtualScrollY')(400);
        await settle(wrapper);

        const vs = getSetupState(wrapper, 'virtualScroll');
        const renderedRows = wrapper.findAll('tbody tr[data-row-key]').length;
        // 定位偏移按新行高
        expect(vs.startIndex).toBe(Math.floor(400 / 40));
        expect(vs.offsetTop).toBe(vs.startIndex * 40);
        // 总高 = 行数 × 新行高 + 表头高
        expect(vs.scrollHeight).toBe(100 * 40 + ROW_HEIGHT);
        // 底部占位 tr 高度补足剩余行数
        const bottomPlaceholder = wrapper.find('tbody tr:last-child');
        expect(getStyleVar(bottomPlaceholder.element, 'height')).toBe(`${(100 - vs.startIndex - renderedRows) * 40}px`);
    });
});
