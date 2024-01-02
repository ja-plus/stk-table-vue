/**
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import { StkTable } from '@/StkTable';
import { describe, expect, test } from 'vitest';

describe('StkTable.vue', () => {
    test('renders', () => {
        const wrapper = mount(StkTable, {
            props: {
                columns: [
                    { dataIndex: 'id', title: 'ID', width: '100px' },
                    { dataIndex: 'name', title: 'Name', width: '200px' },
                ],
                dataSource: new Array(10).fill(0).map((it, i) => {
                    return {
                        id: i,
                        name: 'Jack' + i,
                    };
                }),
            },
        });
        expect(wrapper.classes()).toEqual(expect.arrayContaining(['stk-table']));
    });
});
