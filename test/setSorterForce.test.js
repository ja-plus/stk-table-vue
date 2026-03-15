import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import StkTable from '../src/StkTable/StkTable.vue';

describe('setSorter force parameter', () => {
    it('should respect force parameter when sortRemote is true', async () => {
        const wrapper = mount(StkTable, {
            props: {
                columns: [
                    { title: 'Name', dataIndex: 'name', sorter: true },
                    { title: 'Age', dataIndex: 'age', sorter: true },
                ],
                dataSource: [
                    { key: '1', name: 'John', age: 30 },
                    { key: '2', name: 'Jane', age: 25 },
                    { key: '3', name: 'Bob', age: 35 },
                ],
                sortRemote: true,
            },
        });

        const tableInstance = wrapper.vm;

        // 测试不使用 force 参数时，不应该执行本地排序
        const result1 = tableInstance.setSorter('age', 'desc');
        expect(result1).toEqual([
            { key: '1', name: 'John', age: 30 },
            { key: '2', name: 'Jane', age: 25 },
            { key: '3', name: 'Bob', age: 35 },
        ]);

        // 测试使用 force: true 时，应该执行本地排序
        const result2 = tableInstance.setSorter('age', 'desc', { force: true });
        expect(result2).toEqual([
            { key: '3', name: 'Bob', age: 35 },
            { key: '1', name: 'John', age: 30 },
            { key: '2', name: 'Jane', age: 25 },
        ]);
    });

    it('should work normally when sortRemote is false', async () => {
        const wrapper = mount(StkTable, {
            props: {
                columns: [
                    { title: 'Name', dataIndex: 'name', sorter: true },
                    { title: 'Age', dataIndex: 'age', sorter: true },
                ],
                dataSource: [
                    { key: '1', name: 'John', age: 30 },
                    { key: '2', name: 'Jane', age: 25 },
                    { key: '3', name: 'Bob', age: 35 },
                ],
                sortRemote: false,
            },
        });

        const tableInstance = wrapper.vm;

        // 当 sortRemote 为 false 时，无论 force 参数如何都应该执行本地排序
        const result1 = tableInstance.setSorter('age', 'desc');
        expect(result1).toEqual([
            { key: '3', name: 'Bob', age: 35 },
            { key: '1', name: 'John', age: 30 },
            { key: '2', name: 'Jane', age: 25 },
        ]);

        const result2 = tableInstance.setSorter('age', 'desc', { force: true });
        expect(result2).toEqual([
            { key: '3', name: 'Bob', age: 35 },
            { key: '1', name: 'John', age: 30 },
            { key: '2', name: 'Jane', age: 25 },
        ]);
    });
});
