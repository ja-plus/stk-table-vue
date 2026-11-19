/**
 * 自定义滚动条拖拽跟手回归测试
 * 背景：autoRowHeight 模式下拖拽期间实测行高会改变总高，若每帧用实时总高换算，
 * thumb 与内容会相对指针漂移。拖拽必须冻结起始映射，thumb 与指针 1:1。
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import StkTable from '../src/StkTable/StkTable.vue';
import { describe, expect, test } from 'vitest';

const ROW_HEIGHT = 28;
const HEADER_HEIGHT = 28;
const CONTAINER_HEIGHT = 300;
const CONTAINER_WIDTH = 400;

const columns = [
    { dataIndex: 'id', title: 'ID', width: 100 },
    { dataIndex: 'name', title: 'Name', width: 100 },
];

function genData(count) {
    return Array.from({ length: count }, (_, i) => ({
        id: `k${i}`,
        name: `row-${i}`,
        h: 30 + (i % 5) * 2.5,
    }));
}

function createWrapper(dataSource, extraProps = {}, cols = columns) {
    const wrapper = mount(StkTable, {
        props: {
            rowKey: 'id',
            columns: cols,
            dataSource,
            virtual: true,
            rowHeight: ROW_HEIGHT,
            autoRowHeight: { expectedHeight: row => row.h },
            scrollbar: true,
            ...extraProps,
        },
    });
    Object.defineProperty(wrapper.element, 'clientHeight', { configurable: true, value: CONTAINER_HEIGHT });
    Object.defineProperty(wrapper.element, 'clientWidth', { configurable: true, value: CONTAINER_WIDTH });
    wrapper.vm.initVirtualScroll();
    return wrapper;
}

function getSetupState(wrapper, key) {
    const state = wrapper.vm.$.setupState[key];
    return state?.value ?? state;
}

function mouse(type, target, x, y) {
    target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }));
}

describe('自定义滚动条拖拽跟手', () => {
    test('纵向：拖拽期间总高变化仍保持 thumb 与指针 1:1、内容按冻结映射滚动', async () => {
        const data = genData(200);
        const wrapper = createWrapper(data);
        const el = wrapper.element;
        el.scrollTop = 6000;
        wrapper.vm.initVirtualScrollY();
        getSetupState(wrapper, 'updateCustomScrollbar')();
        await nextTick();

        const thumb = el.querySelector('.stk-sb-thumb.vertical');
        expect(thumb).toBeTruthy();
        const sb0 = { ...getSetupState(wrapper, 'scrollbar') };
        const vs0 = getSetupState(wrapper, 'virtualScroll');
        const range0 = vs0.scrollHeight - CONTAINER_HEIGHT;
        const track0 = CONTAINER_HEIGHT - sb0.h;
        const ratio0 = range0 / track0;
        expect(sb0.t).toBe(Math.round((6000 / range0) * track0));

        mouse('mousedown', thumb, 390, 500);
        mouse('mousemove', document, 390, 400);
        let sb = getSetupState(wrapper, 'scrollbar');
        expect(sb.t).toBe(sb0.t - 100);
        expect(el.scrollTop).toBeCloseTo(6000 - 100 * ratio0, 6);

        // 拖拽期间实测行高改变总高（模拟 autoRowHeight 测量写回）
        wrapper.vm.setAutoHeight('k5', 200);
        wrapper.vm.initVirtualScrollY();
        getSetupState(wrapper, 'updateCustomScrollbar')();
        sb = getSetupState(wrapper, 'scrollbar');
        // 冻结期间 thumb 几何不被实时总高重算覆盖
        expect(sb.t).toBe(sb0.t - 100);
        expect(sb.h).toBe(sb0.h);

        mouse('mousemove', document, 390, 300);
        sb = getSetupState(wrapper, 'scrollbar');
        expect(sb.t).toBe(sb0.t - 200);
        // 内容映射仍用起始总高，而非变化后的实时总高
        expect(el.scrollTop).toBeCloseTo(6000 - 200 * ratio0, 6);

        mouse('mouseup', document, 390, 300);
        // 松手后 thumb 与实时几何对齐
        const vs1 = getSetupState(wrapper, 'virtualScroll');
        sb = getSetupState(wrapper, 'scrollbar');
        const h1 = Math.max(20, (CONTAINER_HEIGHT / vs1.scrollHeight) * CONTAINER_HEIGHT);
        expect(sb.h).toBe(h1);
        expect(sb.t).toBe(Math.round((el.scrollTop / (vs1.scrollHeight - CONTAINER_HEIGHT)) * (CONTAINER_HEIGHT - h1)));
        wrapper.unmount();
    });

    test('纵向：指针超出轨道时 thumb 与 scrollTop 钳制在边界', async () => {
        const data = genData(200);
        const wrapper = createWrapper(data);
        const el = wrapper.element;
        el.scrollTop = 6000;
        wrapper.vm.initVirtualScrollY();
        getSetupState(wrapper, 'updateCustomScrollbar')();
        await nextTick();
        const thumb = el.querySelector('.stk-sb-thumb.vertical');
        const sb0 = { ...getSetupState(wrapper, 'scrollbar') };

        mouse('mousedown', thumb, 390, 500);
        mouse('mousemove', document, 390, 500 - sb0.t - 500);
        const sb = getSetupState(wrapper, 'scrollbar');
        expect(sb.t).toBe(0);
        expect(el.scrollTop).toBe(0);
        mouse('mouseup', document, 390, 0);
        wrapper.unmount();
    });

    test('横向：thumb 与指针 1:1，内容按冻结映射滚动', async () => {
        const wideColumns = [
            { dataIndex: 'id', title: 'ID', width: 300 },
            { dataIndex: 'name', title: 'Name', width: 300 },
        ];
        const data = genData(200);
        const wrapper = createWrapper(data, { virtualX: true }, wideColumns);
        const el = wrapper.element;
        Object.defineProperty(el, 'scrollWidth', { configurable: true, value: 600 });
        wrapper.vm.initVirtualScrollX();
        el.scrollLeft = 100;
        wrapper.vm.initVirtualScrollX();
        getSetupState(wrapper, 'updateCustomScrollbar')();
        await nextTick();

        const thumb = el.querySelector('.stk-sb-thumb.horizontal');
        expect(thumb).toBeTruthy();
        const sb0 = { ...getSetupState(wrapper, 'scrollbar') };
        const vsx0 = getSetupState(wrapper, 'virtualScrollX');
        const range0 = vsx0.scrollWidth - CONTAINER_WIDTH;
        const track0 = CONTAINER_WIDTH - sb0.w;
        expect(sb0.l).toBe(Math.round((100 / range0) * track0));

        mouse('mousedown', thumb, 300, 290);
        mouse('mousemove', document, 250, 290);
        const sb = getSetupState(wrapper, 'scrollbar');
        expect(sb.l).toBe(sb0.l - 50);
        expect(el.scrollLeft).toBeCloseTo(100 - 50 * (range0 / track0), 6);
        mouse('mouseup', document, 250, 290);
        wrapper.unmount();
    });
});