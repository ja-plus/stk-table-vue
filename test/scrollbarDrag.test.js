/**
 * 自定义滚动条拖拽跟手回归测试
 * 背景：autoRowHeight 模式下拖拽期间实测行高会改变总高。
 * 约定：thumb 以像素锚点 1:1 跟随指针；内容位置按「拇指在轨道上的比例 × 实时总高」推导，
 * 因此总高变化时 thumb 不漂移，且拖到轨道底部时比例恰为 1，一次拖拽即可到达内容底部。
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
    test('纵向：拖拽期间总高变化仍保持 thumb 与指针 1:1、内容按拇指比例映射', async () => {
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
        // thumb 位置由指针驱动，不被实时总高重算覆盖
        expect(sb.t).toBe(sb0.t - 100);
        // thumb 长度跟随实时总高更新（轨道范围是比例映射的分母）
        expect(sb.h).toBe(Math.max(20, (CONTAINER_HEIGHT / getSetupState(wrapper, 'virtualScroll').scrollHeight) * CONTAINER_HEIGHT));

        mouse('mousemove', document, 390, 300);
        sb = getSetupState(wrapper, 'scrollbar');
        expect(sb.t).toBe(sb0.t - 200);
        // 内容按拇指比例映射到实时总高：thumb 在轨道上的占比 = 内容在可滚范围上的占比
        const vsNow = getSetupState(wrapper, 'virtualScroll');
        const rangeNow = vsNow.scrollHeight - CONTAINER_HEIGHT;
        const trackNow = CONTAINER_HEIGHT - sb.h;
        const thumbT = (6000 / range0) * track0 - 200; // 起始浮点锚点 + 指针位移
        expect(el.scrollTop).toBeCloseTo((thumbT / trackNow) * rangeNow, 6);

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

    test('纵向：拖拽期间总高增长，一次拖到轨道底部仍能到达内容底部', async () => {
        const wrapper = createWrapper(genData(50), { autoRowHeight: true });
        const el = wrapper.element;
        // 首屏行实测为 150，远大于估算的 rowHeight
        for (let i = 0; i < 8; i++) wrapper.vm.setAutoHeight(`k${i}`, 150);
        wrapper.vm.initVirtualScrollY();
        getSetupState(wrapper, 'updateCustomScrollbar')();
        await nextTick();
        const thumb = el.querySelector('.stk-sb-thumb.vertical');

        mouse('mousedown', thumb, 390, 0);
        // 拖到一半，途中新进入视口的行被实测，总高增长
        mouse('mousemove', document, 390, 150);
        for (let i = 8; i < 20; i++) wrapper.vm.setAutoHeight(`k${i}`, 150);
        wrapper.vm.initVirtualScrollY();
        getSetupState(wrapper, 'updateCustomScrollbar')();
        await nextTick();

        // 继续拖到物理轨道底部（多拖一段确保命中 clamp）
        mouse('mousemove', document, 390, 5000);
        // 关键场景：最后一次 mousemove 之后、松手之前的实测改变了总高，且用户不再移动指针
        for (let i = 20; i < 32; i++) wrapper.vm.setAutoHeight(`k${i}`, 150);
        wrapper.vm.initVirtualScrollY();
        getSetupState(wrapper, 'updateCustomScrollbar')();
        await nextTick();
        // 松手时按「最终指针 + 最新几何」再映射 → 内容应贴住实时底部

        // 松手（指针仍停在 5000，物理轨道外）
        mouse('mouseup', document, 390, 5000);
        const vs = getSetupState(wrapper, 'virtualScroll');
        const range = vs.scrollHeight - CONTAINER_HEIGHT;
        const sbAfter = getSetupState(wrapper, 'scrollbar');
        const trackNow = CONTAINER_HEIGHT - sbAfter.h;
        // 松手后内容在实时底部，thumb 不回跳
        expect(el.scrollTop).toBeCloseTo(range, 6);
        expect(Math.abs(sbAfter.t - trackNow)).toBeLessThanOrEqual(0.5);
        wrapper.unmount();
    });

    test('横向：thumb 与指针 1:1，内容按拇指比例映射', async () => {
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