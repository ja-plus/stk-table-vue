/**
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import { StkTable } from '@/StkTable';
import { describe, expect, test, vi } from 'vitest';

const ROW_HEIGHT = 28;
const columns = [
    { dataIndex: 'id', title: 'ID', width: 100 },
    { dataIndex: 'name', title: 'Name', width: 160 },
];
const dataSource = Array.from({ length: 100 }, (_, id) => ({ id, name: `row-${id}` }));

function createWrapper(extraProps = {}) {
    const wrapper = mount(StkTable, {
        props: {
            rowKey: 'id',
            columns,
            dataSource,
            virtual: true,
            ...extraProps,
        },
    });
    Object.defineProperty(wrapper.element, 'clientHeight', { configurable: true, value: 300 });
    Object.defineProperty(wrapper.element, 'clientWidth', { configurable: true, value: 200 });
    wrapper.vm.initVirtualScroll();
    return wrapper;
}

function getSetupState(wrapper, key) {
    const state = wrapper.vm.$.setupState[key];
    return state?.value ?? state;
}

describe('scrollTo', () => {
    test('supports native x/y coordinate order and partial coordinate options', () => {
        const wrapper = createWrapper();
        const container = wrapper.element;

        wrapper.vm.scrollTo(120, 240);
        expect(container.scrollLeft).toBe(120);
        expect(container.scrollTop).toBe(240);

        wrapper.vm.scrollTo({ top: 360 });
        expect(container.scrollLeft).toBe(120);
        expect(container.scrollTop).toBe(360);

        wrapper.vm.scrollTo({ left: 80 });
        expect(container.scrollLeft).toBe(80);
        expect(container.scrollTop).toBe(360);
        wrapper.unmount();
    });

    test('ignores empty or conflicting target objects at runtime', () => {
        const wrapper = createWrapper();
        const container = wrapper.element;
        container.scrollTop = 40;
        container.scrollLeft = 20;

        wrapper.vm.scrollTo({});
        wrapper.vm.scrollTo({ top: 500, index: 1 });

        expect(container.scrollTop).toBe(40);
        expect(container.scrollLeft).toBe(20);
        wrapper.unmount();
    });

    test('forwards smooth behavior to native scrollTo', () => {
        const wrapper = createWrapper();
        const container = wrapper.element;
        const nativeScrollTo = vi.fn(options => {
            if (options.top !== undefined) container.scrollTop = options.top;
            if (options.left !== undefined) container.scrollLeft = options.left;
        });
        Object.defineProperty(container, 'scrollTo', { configurable: true, value: nativeScrollTo });

        wrapper.vm.scrollTo({ left: 30, top: 60, behavior: 'smooth' });
        expect(nativeScrollTo).toHaveBeenCalledWith({ left: 30, top: 60, behavior: 'smooth' });
        wrapper.unmount();
    });

    test('scrolls an index minimally by default and aligns it to top when debounce is false', () => {
        const wrapper = createWrapper();
        const container = wrapper.element;

        container.scrollLeft = 25;
        wrapper.vm.scrollTo({ index: 2 });
        expect(container.scrollTop).toBe(0);
        expect(container.scrollLeft).toBe(25);

        wrapper.vm.scrollTo({ index: 20 });
        expect(container.scrollTop).toBe(20 * ROW_HEIGHT + ROW_HEIGHT - (300 - ROW_HEIGHT));
        expect(container.scrollLeft).toBe(0);

        wrapper.vm.scrollTo({ index: 10, debounce: false });
        expect(container.scrollTop).toBe(10 * ROW_HEIGHT);
        expect(container.scrollLeft).toBe(0);
        wrapper.unmount();
    });

    test('supports row keys and ignores missing rows', () => {
        const wrapper = createWrapper();
        const container = wrapper.element;

        wrapper.vm.scrollTo({ key: 40, debounce: false });
        expect(container.scrollTop).toBe(40 * ROW_HEIGHT);

        wrapper.vm.scrollTo({ key: 'missing', debounce: false });
        wrapper.vm.scrollTo({ index: -1, debounce: false });
        wrapper.vm.scrollTo({ index: dataSource.length, debounce: false });
        expect(container.scrollTop).toBe(40 * ROW_HEIGHT);

        wrapper.vm.scrollTo({ key: 0, debounce: false });
        expect(container.scrollTop).toBe(0);
        wrapper.unmount();
    });

    test('resolves keys against the current display order', () => {
        const wrapper = createWrapper({ dataSource: [...dataSource].reverse() });
        const container = wrapper.element;

        wrapper.vm.scrollTo({ key: 40, debounce: false });
        expect(container.scrollTop).toBe(59 * ROW_HEIGHT);
        wrapper.unmount();
    });

    test('supports top and bottom positions', () => {
        const wrapper = createWrapper();
        const container = wrapper.element;

        container.scrollLeft = 90;
        wrapper.vm.scrollTo({ position: 'bottom' });
        expect(container.scrollTop).toBe(dataSource.length * ROW_HEIGHT - (300 - ROW_HEIGHT));
        expect(container.scrollLeft).toBe(0);

        wrapper.vm.scrollTo({ position: 'top' });
        expect(container.scrollTop).toBe(0);
        expect(container.scrollLeft).toBe(0);
        wrapper.unmount();
    });

    test('uses measured auto row heights for index offsets', () => {
        const wrapper = createWrapper({ autoRowHeight: true });
        const container = wrapper.element;
        wrapper.vm.setAutoHeight(0, 40);
        wrapper.vm.setAutoHeight(1, 50);

        wrapper.vm.scrollTo({ index: 2, debounce: false });
        expect(container.scrollTop).toBe(90);
        wrapper.unmount();
    });

    test('does not reserve header height in headless mode', () => {
        const wrapper = createWrapper({ headless: true });
        const container = wrapper.element;

        wrapper.vm.scrollTo({ index: 20 });
        expect(container.scrollTop).toBe(20 * ROW_HEIGHT + ROW_HEIGHT - 300);
        wrapper.unmount();
    });

    test('keeps a target row clear of a sticky footer', () => {
        const wrapper = createWrapper({ footerData: [{ id: 'total', name: 'Total' }] });
        const container = wrapper.element;
        Object.defineProperty(wrapper.find('.stk-footer').element, 'offsetHeight', { configurable: true, value: ROW_HEIGHT });

        wrapper.vm.scrollTo({ index: 20 });
        expect(container.scrollTop).toBe(20 * ROW_HEIGHT + ROW_HEIGHT - (300 - ROW_HEIGHT * 2));
        wrapper.unmount();
    });

    test('updates simulated vertical scrolling mode', async () => {
        const wrapper = createWrapper({ scrollbar: true, scrollRowByRow: true });
        const container = wrapper.element;

        wrapper.vm.scrollTo({ top: 10 * ROW_HEIGHT });
        await wrapper.vm.$nextTick();

        expect(container.scrollTop).toBe(0);
        expect(wrapper.find('tbody tr[data-row-key]').attributes('data-row-key')).toBe('10');
        wrapper.unmount();
    });

    test('uses measured heights and sticky footer geometry for experimental boundaries and scrollbar metrics', () => {
        const wrapper = createWrapper({
            autoRowHeight: true,
            footerData: [{ id: 'total', name: 'Total' }],
            scrollbar: true,
            scrollRowByRow: true,
        });
        Object.defineProperty(wrapper.find('.stk-footer').element, 'offsetHeight', { configurable: true, value: ROW_HEIGHT });
        wrapper.vm.setAutoHeight(0, 40);
        wrapper.vm.setAutoHeight(1, 50);
        wrapper.vm.initVirtualScroll();

        wrapper.vm.scrollTo({ position: 'bottom' });

        const rowsHeight = 40 + 50 + (dataSource.length - 2) * ROW_HEIGHT;
        const expectedScrollHeight = rowsHeight + ROW_HEIGHT * 2;
        const expectedMaxScrollTop = expectedScrollHeight - 300;
        const virtualScroll = getSetupState(wrapper, 'virtualScroll');
        const scrollbar = getSetupState(wrapper, 'scrollbar');
        expect(virtualScroll.scrollHeight).toBe(expectedScrollHeight);
        expect(virtualScroll.maxScrollTop).toBe(expectedMaxScrollTop);
        expect(virtualScroll.scrollTop).toBe(expectedMaxScrollTop);
        expect(scrollbar.t).toBeCloseTo(300 - scrollbar.h, 0);
        wrapper.unmount();
    });

    test('smooth experimental scrolling reaches the shared measured-height boundary', () => {
        let frameTime = 0;
        const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
            frameTime += 350;
            callback(frameTime);
            return frameTime;
        });
        const wrapper = createWrapper({
            autoRowHeight: true,
            footerData: [{ id: 'total', name: 'Total' }],
            scrollbar: true,
            scrollRowByRow: true,
        });
        wrapper.vm.setAutoHeight(0, 40);
        wrapper.vm.setAutoHeight(1, 50);
        wrapper.vm.initVirtualScroll();

        wrapper.vm.scrollTo({ position: 'bottom', behavior: 'smooth' });

        const rowsHeight = 40 + 50 + (dataSource.length - 2) * ROW_HEIGHT;
        const expectedMaxScrollTop = rowsHeight + ROW_HEIGHT * 2 - 300;
        expect(getSetupState(wrapper, 'virtualScroll').scrollTop).toBe(expectedMaxScrollTop);
        requestAnimationFrameSpy.mockRestore();
        wrapper.unmount();
    });
});
