/**
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import { StkTable, registerFeature, useAreaSelection } from '@/StkTable';
import { describe, expect, test } from 'vitest';

registerFeature(useAreaSelection);

describe('StkTable.vue', () => {
    const columns = [
        { dataIndex: 'id', title: 'ID', width: '100px', sorter: true },
        { dataIndex: 'name', title: 'Name', width: '200px' },
    ];
    const wrapper = mount(StkTable, {
        props: {
            rowKey: 'id',
            columns,
            virtual: true,
            dataSource: new Array(100).fill(0).map((it, i) => {
                return {
                    id: i,
                    name: 'Jack' + i,
                };
            }),
        },
    });

    test('renders', async () => {
        expect(wrapper.classes()).toEqual(expect.arrayContaining(['stk-table']));
        const trs = wrapper.findAll(`.stk-table-main tbody>tr[data-row-key]`);
        trs.forEach((tr, i) => {
            console.log(tr.attributes());
            const rowKey = tr.attributes()['data-row-key'];
            expect(rowKey).toEqual(String(i));
        });

        const ths = wrapper.findAll('.stk-table-main thead > tr > th');
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            const th = ths[i];
            expect(th.attributes()['data-col-key']).toEqual(col.dataIndex);
            const style = th.attributes().style;
            expect(style).toContain(`--cw: ${col.width};`);
        }

        // expect(ths[0].attributes()['data-col-key']).toEqual('id')
    });
    test('overflow', async () => {
        await wrapper.setProps({
            showHeaderOverflow: true,
        });
        const ths = wrapper.findAll('stk-table > thead > tr > th');
        ths.forEach(th => {
            expect(th.classes()).toEqual(expect.arrayContaining(['text-overflow']));
        });
    });
    test('no-data', async () => {
        // 测试暂无数据兜底
        await wrapper.setProps({
            dataSource: [],
        });

        expect(wrapper.find('.stk-table-no-data').exists()).toBeTruthy();
        expect(wrapper.find('.stk-table-no-data.no-data-full').exists()).toBeFalsy();
        await wrapper.setProps({
            noDataFull: true,
        });
        expect(wrapper.find('.stk-table-no-data.no-data-full').exists()).toBeTruthy();
    });
});

describe('StkTable.vue area selection expose', () => {
    const columns = [
        { dataIndex: 'c0', title: 'C0', width: '120px' },
        { dataIndex: 'c1', title: 'C1', width: '120px' },
        { dataIndex: 'c2', title: 'C2', width: '120px' },
        { dataIndex: 'c3', title: 'C3', width: '120px' },
        { dataIndex: 'c4', title: 'C4', width: '120px' },
        { dataIndex: 'c5', title: 'C5', width: '120px' },
    ];
    const dataSource = new Array(80).fill(0).map((_, i) => ({
        id: i,
        c0: `r${i}-c0`,
        c1: `r${i}-c1`,
        c2: `r${i}-c2`,
        c3: `r${i}-c3`,
        c4: `r${i}-c4`,
        c5: `r${i}-c5`,
    }));

    function createWrapper() {
        return mount(StkTable, {
            props: {
                rowKey: 'id',
                areaSelection: true,
                virtual: true,
                width: '220px',
                columns,
                dataSource,
            },
        });
    }

    test('setAreaSelection supports default full selection and row-only', () => {
        const wrapper = createWrapper();
        const vm = wrapper.vm;

        let ranges = vm.setAreaSelection();
        expect(ranges).toHaveLength(1);
        expect(ranges[0].index.begin).toEqual({ row: 0, col: 0 });
        expect(ranges[0].index.end).toEqual({ row: dataSource.length - 1, col: columns.length - 1 });
        expect(ranges).toEqual(vm.getSelectedArea().ranges);

        ranges = vm.setAreaSelection({ begin: { row: 1 } });
        expect(ranges[0].index.begin).toEqual({ row: 1, col: 0 });
        expect(ranges[0].index.end).toEqual({ row: 1, col: columns.length - 1 });

        wrapper.unmount();
    });

    test('setAreaSelection supports col fill rules and silent option', () => {
        const wrapper = createWrapper();
        const vm = wrapper.vm;

        vm.setAreaSelection({ begin: { row: 1, col: 2 }, end: { row: 3 } });
        let ranges = vm.getSelectedArea().ranges;
        expect(ranges[0].index.begin).toEqual({ row: 1, col: 2 });
        expect(ranges[0].index.end).toEqual({ row: 3, col: 2 });

        vm.setAreaSelection({ begin: { row: 1 }, end: { row: 3, col: 4 } });
        ranges = vm.getSelectedArea().ranges;
        expect(ranges[0].index.begin).toEqual({ row: 1, col: 0 });
        expect(ranges[0].index.end).toEqual({ row: 3, col: 4 });

        const emittedCountBefore = wrapper.emitted('area-selection-change')?.length || 0;
        vm.setAreaSelection({ begin: { row: 2, col: 1 } });
        // silent 默认 false，会触发 area-selection-change
        expect((wrapper.emitted('area-selection-change')?.length || 0) - emittedCountBefore).toBe(1);

        vm.setAreaSelection({ begin: { row: 3, col: 2 } }, { silent: true });
        // silent: true 不触发事件
        expect((wrapper.emitted('area-selection-change')?.length || 0) - emittedCountBefore).toBe(1);

        wrapper.unmount();
    });

    test('setAreaSelection supports scrollToView', () => {
        const wrapper = createWrapper();
        const vm = wrapper.vm;
        const container = wrapper.find('.stk-table').element;

        expect(container.scrollTop).toBe(0);
        expect(container.scrollLeft).toBe(0);

        vm.setAreaSelection({ begin: { row: 70, col: 5 } }, { scrollToView: true });
        expect(container.scrollTop > 0 || container.scrollLeft > 0).toBe(true);

        wrapper.unmount();
    });

    test('index resolver methods: getRowIndex/getColumnIndex', () => {
        const wrapper = createWrapper();
        const vm = wrapper.vm;

        expect(vm.getRowIndex(dataSource[3])).toBe(3);
        expect(vm.getRowIndex({ id: 9999, c0: 'x' })).toBe(-1);

        expect(vm.getColumnIndex(columns[2])).toBe(2);
        expect(vm.getColumnIndex({ dataIndex: '__not_exists__' })).toBe(-1);

        wrapper.unmount();
    });
});
