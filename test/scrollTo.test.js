/**
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import StkTable from '../src/StkTable/StkTable.vue';
import { afterEach, describe, expect, test, vi } from 'vitest';

const ROW_HEIGHT = 28;
const columns = [
    { dataIndex: 'id', title: 'ID', width: 100 },
    { dataIndex: 'name', title: 'Name', width: 100 },
    { dataIndex: 'age', title: 'Age', width: 100 },
    { dataIndex: 'score', title: 'Score', width: 100 },
    { dataIndex: 'remark', title: 'Remark', width: 100 },
];
const dataSource = Array.from({ length: 100 }, (_, id) => ({ id: `k${id}`, name: `row-${id}`, age: id, score: id, remark: id }));

function createWrapper(extraProps = {}) {
    const wrapper = mount(StkTable, {
        props: {
            rowKey: 'id',
            columns,
            dataSource,
            virtual: true,
            rowHeight: ROW_HEIGHT,
            ...extraProps,
        },
    });
    Object.defineProperty(wrapper.element, 'clientHeight', { configurable: true, value: 300 });
    Object.defineProperty(wrapper.element, 'clientWidth', { configurable: true, value: 200 });
    wrapper.vm.initVirtualScroll();
    return wrapper;
}

/** 用 setupState 读取组件内部状态 */
function getSetupState(wrapper, key) {
    const state = wrapper.vm.$.setupState[key];
    return state?.value ?? state;
}

/** 捕获 rAF 回调并手动推进动画；timeFn 提供当前时间 */
function setupRafMock() {
    const rafQueue = [];
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
        rafQueue.push(cb);
        return rafQueue.length;
    });
    const cafSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    const flushRaf = () => {
        const cbs = rafQueue.splice(0);
        cbs.forEach(cb => cb());
    };
    return { rafSpy, cafSpy, flushRaf };
}

describe('scrollTo 数字重载（向后兼容）', () => {
    test('双轴坐标', () => {
        const wrapper = createWrapper();
        wrapper.vm.scrollTo(120, 240);
        expect(wrapper.element.scrollTop).toBe(120);
        expect(wrapper.element.scrollLeft).toBe(240);
        wrapper.unmount();
    });

    test('null 不改变对应轴', () => {
        const wrapper = createWrapper();
        wrapper.vm.scrollTo(120, 90);
        wrapper.vm.scrollTo(null, 60);
        expect(wrapper.element.scrollTop).toBe(120);
        expect(wrapper.element.scrollLeft).toBe(60);
        wrapper.unmount();
    });

    test('省略参数默认为 0', () => {
        const wrapper = createWrapper();
        wrapper.vm.scrollTo(120, 90);
        wrapper.vm.scrollTo();
        expect(wrapper.element.scrollTop).toBe(0);
        expect(wrapper.element.scrollLeft).toBe(0);
        wrapper.unmount();
    });
});

describe('scrollTo options 数字坐标', () => {
    test('双轴坐标', () => {
        const wrapper = createWrapper();
        wrapper.vm.scrollTo({ top: 120, left: 240 });
        expect(wrapper.element.scrollTop).toBe(120);
        expect(wrapper.element.scrollLeft).toBe(240);
        wrapper.unmount();
    });

    test('省略的轴不改变', () => {
        const wrapper = createWrapper();
        wrapper.vm.scrollTo(120, 90);
        wrapper.vm.scrollTo({ left: 60 });
        expect(wrapper.element.scrollTop).toBe(120);
        expect(wrapper.element.scrollLeft).toBe(60);
        wrapper.unmount();
    });

    test('空对象不产生任何滚动', () => {
        const wrapper = createWrapper();
        wrapper.vm.scrollTo(120, 90);
        wrapper.vm.scrollTo({});
        expect(wrapper.element.scrollTop).toBe(120);
        expect(wrapper.element.scrollLeft).toBe(90);
        wrapper.unmount();
    });
});

describe('scrollTo top 轴对象定位', () => {
    test('按行索引定位（固定行高）', () => {
        const wrapper = createWrapper();
        wrapper.vm.scrollTo({ top: { index: 5 } });
        expect(wrapper.element.scrollTop).toBe(5 * ROW_HEIGHT);
        wrapper.unmount();
    });

    test('按行 key 定位', () => {
        const wrapper = createWrapper();
        wrapper.vm.scrollTo({ top: { key: 'k9' } });
        expect(wrapper.element.scrollTop).toBe(9 * ROW_HEIGHT);
        wrapper.unmount();
    });

    test('px 叠加在基准偏移之上', () => {
        const wrapper = createWrapper();
        wrapper.vm.scrollTo({ top: { index: 5, px: 10 } });
        expect(wrapper.element.scrollTop).toBe(5 * ROW_HEIGHT + 10);
        wrapper.unmount();
    });

    test('仅 px 等价于数字坐标', () => {
        const wrapper = createWrapper();
        wrapper.vm.scrollTo(120, 90);
        wrapper.vm.scrollTo({ top: { px: 100 } });
        expect(wrapper.element.scrollTop).toBe(100);
        expect(wrapper.element.scrollLeft).toBe(90);
        wrapper.unmount();
    });

    test('autoRowHeight 变高解析（setAutoHeight 提供值）', () => {
        const wrapper = createWrapper({ autoRowHeight: true });
        wrapper.vm.setAutoHeight('k0', 40);
        wrapper.vm.setAutoHeight('k1', 50);
        wrapper.vm.scrollTo({ top: { index: 2 } });
        expect(wrapper.element.scrollTop).toBe(40 + 50);
        wrapper.unmount();
    });

    test('越界 index 与缺失 key 静默跳过', () => {
        const wrapper = createWrapper();
        wrapper.vm.scrollTo(120, 90);
        wrapper.vm.scrollTo({ top: { index: 9999 } });
        expect(wrapper.element.scrollTop).toBe(120);
        wrapper.vm.scrollTo({ top: { key: 'missing' }, left: 60 });
        expect(wrapper.element.scrollTop).toBe(120);
        expect(wrapper.element.scrollLeft).toBe(60);
        wrapper.unmount();
    });

    test('index 与 key 同时给出时 index 优先', () => {
        const wrapper = createWrapper();
        wrapper.vm.scrollTo({ top: { index: 5, key: 'k9' } });
        expect(wrapper.element.scrollTop).toBe(5 * ROW_HEIGHT);
        wrapper.unmount();
    });
});

describe('scrollTo left 轴对象定位', () => {
    test('按列索引定位', () => {
        const wrapper = createWrapper({ virtualX: true });
        wrapper.vm.scrollTo({ left: { index: 3 } });
        expect(wrapper.element.scrollLeft).toBe(300);
        wrapper.unmount();
    });

    test('按列 dataIndex 定位', () => {
        const wrapper = createWrapper({ virtualX: true });
        wrapper.vm.scrollTo({ left: { key: 'score' } });
        expect(wrapper.element.scrollLeft).toBe(300);
        wrapper.unmount();
    });

    test('两轴同时定位', () => {
        const wrapper = createWrapper({ virtualX: true });
        wrapper.vm.scrollTo({ top: { index: 5 }, left: { index: 3 } });
        expect(wrapper.element.scrollTop).toBe(5 * ROW_HEIGHT);
        expect(wrapper.element.scrollLeft).toBe(300);
        wrapper.unmount();
    });

    test('越界 index 与缺失 dataIndex 静默跳过', () => {
        const wrapper = createWrapper({ virtualX: true });
        wrapper.vm.scrollTo({ left: { index: 9999 } });
        expect(wrapper.element.scrollLeft).toBe(0);
        wrapper.vm.scrollTo({ left: { key: 'missing' } });
        expect(wrapper.element.scrollLeft).toBe(0);
        wrapper.unmount();
    });
});

describe('scrollTo 边界钳制', () => {
    test('负 px 钳制为 0', () => {
        const wrapper = createWrapper({ virtualX: true });
        wrapper.vm.scrollTo(120, 90);
        wrapper.vm.scrollTo({ top: { px: -100 }, left: { px: -50 } });
        expect(wrapper.element.scrollTop).toBe(0);
        expect(wrapper.element.scrollLeft).toBe(0);
        wrapper.unmount();
    });

    test('超上界钳制为最大值', () => {
        const wrapper = createWrapper();
        // 理论最大滚动距离 = 全部行高 - 容器高
        const maxTop = 100 * ROW_HEIGHT - 300;
        wrapper.vm.scrollTo({ top: { index: 99, px: 10000 } });
        expect(wrapper.element.scrollTop).toBe(maxTop);
        wrapper.unmount();
    });
});

describe('scrollTo behavior', () => {
    test('默认立即跳转，无动画', () => {
        const wrapper = createWrapper();
        const { rafSpy, flushRaf } = setupRafMock();
        wrapper.vm.scrollTo({ top: { index: 5 } });
        expect(wrapper.element.scrollTop).toBe(5 * ROW_HEIGHT);
        expect(rafSpy).not.toHaveBeenCalled();
        flushRaf();
        rafSpy.mockRestore();
        wrapper.unmount();
    });

    test('smooth 平滑滚动末帧落点（非 experimental 模式）', () => {
        const wrapper = createWrapper();
        const { rafSpy, flushRaf } = setupRafMock();
        const dateSpy = vi.spyOn(Date, 'now');
        const t0 = Date.now();
        dateSpy.mockReturnValue(t0);

        wrapper.vm.scrollTo({ top: { index: 5 }, left: { index: 3 }, behavior: 'smooth' });
        // 动画已调度但未推进，位置未变
        expect(wrapper.element.scrollTop).toBe(0);

        // 推进到动画结束
        dateSpy.mockReturnValue(t0 + 400);
        flushRaf();

        expect(wrapper.element.scrollTop).toBe(5 * ROW_HEIGHT);
        expect(wrapper.element.scrollLeft).toBe(300);
        dateSpy.mockRestore();
        rafSpy.mockRestore();
        wrapper.unmount();
    });

    test('smooth 末帧落点（experimental scrollY 模式）', () => {
        const wrapper = createWrapper({ experimental: { scrollY: true } });
        const { rafSpy, flushRaf } = setupRafMock();
        const dateSpy = vi.spyOn(Date, 'now');
        const t0 = Date.now();
        dateSpy.mockReturnValue(t0);

        wrapper.vm.scrollTo({ top: { index: 5 }, behavior: 'smooth' });
        dateSpy.mockReturnValue(t0 + 400);
        flushRaf();

        const vs = getSetupState(wrapper, 'virtualScroll');
        expect(vs.scrollTop).toBe(5 * ROW_HEIGHT);
        // 容器 scrollTop 在 experimental 模式下始终为 0
        expect(wrapper.element.scrollTop).toBe(0);
        dateSpy.mockRestore();
        rafSpy.mockRestore();
        wrapper.unmount();
    });

    test('新的 scrollTo 调用取消未完成的动画', () => {
        const wrapper = createWrapper();
        const { rafSpy, cafSpy, flushRaf } = setupRafMock();
        const dateSpy = vi.spyOn(Date, 'now');
        const t0 = Date.now();
        dateSpy.mockReturnValue(t0);

        wrapper.vm.scrollTo({ top: 500, behavior: 'smooth' });
        expect(rafSpy).toHaveBeenCalledTimes(1);

        // 动画未完成时发起新调用：旧动画被取消
        wrapper.vm.scrollTo({ top: 100 });
        expect(cafSpy).toHaveBeenCalled();
        expect(wrapper.element.scrollTop).toBe(100);

        // 旧动画的 rAF 回调即使被 flush 也不应再改变位置
        dateSpy.mockReturnValue(t0 + 400);
        flushRaf();
        expect(wrapper.element.scrollTop).toBe(100);
        dateSpy.mockRestore();
        rafSpy.mockRestore();
        cafSpy.mockRestore();
        wrapper.unmount();
    });
});
