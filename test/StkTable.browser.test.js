/**
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import { StkTable } from '@/StkTable';
import { describe, expect, test } from 'vitest';

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
            expect(style).toContain(`width: ${col.width};`);
            expect(style).toContain(`min-width: ${col.width};`);
            expect(style).toContain(`max-width: ${col.width};`);
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
