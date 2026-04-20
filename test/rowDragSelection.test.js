/**
 * @vitest-environment happy-dom
 */
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StkTable from '../src/StkTable/StkTable.vue';
import { registerFeature } from '../src/StkTable/registerFeature';
import { useAreaSelection, useRowDragSelection } from '../src/StkTable/features';

registerFeature([useAreaSelection, useRowDragSelection]);

describe('rowDragSelection', () => {
    it('supports dragging to select contiguous rows', async () => {
        const wrapper = mount(StkTable, {
            attachTo: document.body,
            props: {
                rowKey: 'id',
                rowActive: false,
                rowDragSelection: true,
                columns: [
                    { title: 'ID', dataIndex: 'id' },
                    { title: 'Name', dataIndex: 'name' },
                ],
                dataSource: [
                    { id: 1, name: 'Alpha' },
                    { id: 2, name: 'Bravo' },
                    { id: 3, name: 'Charlie' },
                    { id: 4, name: 'Delta' },
                ],
            },
        });

        const rows = wrapper.findAll('tbody tr[data-row-key]');
        await rows[0].trigger('mousedown', { button: 0, clientX: 10, clientY: 10 });
        rows[2].element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 10, clientY: 60 }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 10, clientY: 60 }));
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('row-drag-selection-change')).toBeTruthy();
        const [range, data] = wrapper.emitted('row-drag-selection-change')[0];
        expect(range).toEqual({
            startRowIndex: 0,
            endRowIndex: 2,
        });
        expect(data.rows.map(row => row.id)).toEqual([1, 2, 3]);

        expect(wrapper.vm.getSelectedRows()).toEqual({
            rows: [
                { id: 1, name: 'Alpha' },
                { id: 2, name: 'Bravo' },
                { id: 3, name: 'Charlie' },
            ],
            range: {
                startRowIndex: 0,
                endRowIndex: 2,
            },
            ranges: [
                {
                    startRowIndex: 0,
                    endRowIndex: 2,
                },
            ],
        });

        expect(rows[0].classes()).toContain('row-range-selected');
        expect(rows[1].classes()).toContain('row-range-selected');
        expect(rows[2].classes()).toContain('row-range-selected');
    });

    it('supports setting selected rows programmatically', async () => {
        const wrapper = mount(StkTable, {
            props: {
                rowKey: 'id',
                rowActive: false,
                rowDragSelection: true,
                columns: [
                    { title: 'ID', dataIndex: 'id' },
                    { title: 'Name', dataIndex: 'name' },
                ],
                dataSource: [
                    { id: 1, name: 'Alpha' },
                    { id: 2, name: 'Bravo' },
                    { id: 3, name: 'Charlie' },
                    { id: 4, name: 'Delta' },
                ],
            },
        });

        wrapper.vm.setSelectedRows([2, 3]);
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.getSelectedRows()).toEqual({
            rows: [
                { id: 2, name: 'Bravo' },
                { id: 3, name: 'Charlie' },
            ],
            range: {
                startRowIndex: 1,
                endRowIndex: 2,
            },
            ranges: [
                {
                    startRowIndex: 1,
                    endRowIndex: 2,
                },
            ],
        });

        const emitted = wrapper.emitted('row-drag-selection-change');
        const [range, data] = emitted[0];
        expect(range).toEqual({
            startRowIndex: 1,
            endRowIndex: 2,
        });
        expect(data.rows.map(row => row.id)).toEqual([2, 3]);

        wrapper.vm.setSelectedRows([]);
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.getSelectedRows()).toEqual({
            rows: [],
            range: null,
            ranges: [],
        });
    });

    it('supports ctrl adding non-contiguous rows', async () => {
        const wrapper = mount(StkTable, {
            attachTo: document.body,
            props: {
                rowKey: 'id',
                rowActive: false,
                rowDragSelection: true,
                columns: [
                    { title: 'ID', dataIndex: 'id' },
                    { title: 'Name', dataIndex: 'name' },
                ],
                dataSource: [
                    { id: 1, name: 'Alpha' },
                    { id: 2, name: 'Bravo' },
                    { id: 3, name: 'Charlie' },
                    { id: 4, name: 'Delta' },
                ],
            },
        });

        const rows = wrapper.findAll('tbody tr[data-row-key]');

        await rows[0].trigger('mousedown', { button: 0, clientX: 10, clientY: 10 });
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 10, clientY: 10 }));
        await wrapper.vm.$nextTick();

        await rows[2].trigger('mousedown', { button: 0, ctrlKey: true, clientX: 10, clientY: 60 });
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 10, clientY: 60, ctrlKey: true }));
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.getSelectedRows()).toEqual({
            rows: [
                { id: 1, name: 'Alpha' },
                { id: 3, name: 'Charlie' },
            ],
            range: null,
            ranges: [
                {
                    startRowIndex: 0,
                    endRowIndex: 0,
                },
                {
                    startRowIndex: 2,
                    endRowIndex: 2,
                },
            ],
        });

        expect(rows[0].classes()).toContain('row-range-selected');
        expect(rows[2].classes()).toContain('row-range-selected');
        expect(rows[1].classes()).not.toContain('row-range-selected');

        const emitted = wrapper.emitted('row-drag-selection-change');
        const [range, data] = emitted[emitted.length - 1];
        expect(range).toBeNull();
        expect(data.rows.map(row => row.id)).toEqual([1, 3]);
        expect(data.ranges).toEqual([
            {
                startRowIndex: 0,
                endRowIndex: 0,
            },
            {
                startRowIndex: 2,
                endRowIndex: 2,
            },
        ]);
    });
});
