import { test, expect, it, describe } from 'vitest';
import { insertToOrderedArray } from '@/StkTable/utils';

/** 并发测试 */
describe.concurrent('insertToOrderedArray', () => {
    function fn(source, newItem, target = [], order = 'asc') {
        const sourceArr = source.map(id => ({
            id,
        }));
        const expectResult = target.map(id => ({
            id,
        }));
        const sortState = { dataIndex: 'id', order, sortType: 'number' };
        const result = insertToOrderedArray(sortState, { id: newItem }, sourceArr);
        return [result, expectResult];
    }
    function desc(source, newItem, target) {
        return fn(source, newItem, target, 'desc');
    }
    it.concurrent('test1', ({ expect }) => {
        const source = [1, 2, 4, 5];
        const newItem = 3;
        const target = [1, 2, 3, 4, 5];
        const [result, expectResult] = fn(source, newItem, target);
        expect(result).toStrictEqual(expectResult);
        const [result2, expectResult2] = desc(source.reverse(), newItem, target.reverse());
        expect(result2).toStrictEqual(expectResult2);
    });
    it.concurrent('test2', ({ expect }) => {
        const source = [1, 4, 5, 5];
        const newItem = 0;
        const target = [0, 1, 4, 5, 5];
        const [result, expectResult] = fn(source, newItem, target);
        expect(result).toStrictEqual(expectResult);
        const [result2, expectResult2] = desc(source.reverse(), newItem, target.reverse());
        expect(result2).toStrictEqual(expectResult2);
    });
    it.concurrent('test3', ({ expect }) => {
        const source = [0, 1, 4, 5, 5];
        const newItem = 5;
        const target = [0, 1, 4, 5, 5, 5];
        const [result, expectResult] = fn(source, newItem, target);
        expect(result).toStrictEqual(expectResult);
        const [result2, expectResult2] = desc(source.reverse(), newItem, target.reverse());
        expect(result2).toStrictEqual(expectResult2);
    });
    it.concurrent('test4', ({ expect }) => {
        const source = [1, 1, 2, 5, 5];
        const newItem = 3;
        const target = [1, 1, 2, 3, 5, 5];
        const [result, expectResult] = fn(source, newItem, target);
        expect(result).toStrictEqual(expectResult);
        const [result2, expectResult2] = desc(source.reverse(), newItem, target.reverse());
        expect(result2).toStrictEqual(expectResult2);
    });

    it.concurrent('test-empty', ({ expect }) => {
        const [result, expectResult] = desc([], 0, [0]);
        expect(result).toStrictEqual(expectResult);
        const [result2, expectResult2] = fn([], 1, [1]);
        expect(result2).toStrictEqual(expectResult2);
    });

    it.concurrent('huge-data', ({ expect }) => {
        const source = Array.from({ length: 1000000 }, (_, i) => i);
        const newItem = Math.random() * 1000000;

        const [result] = fn(source, newItem);
        let isValidResult = true;
        for (let i = 0; i < result.length - 1; i++) {
            if (result[i].id > result[i + 1].id) {
                isValidResult = false;
                break;
            }
        }
        expect(isValidResult).toBe(true);
    });

    it.concurrent('customCompare', ({ expect }) => {
        const source = [
            { id: 1, no: 0 },
            { id: 1, no: 1 },
            { id: 2, no: 0 },
        ];
        const newItem = { id: 1, no: 2 };

        const sortState = { dataIndex: 'id', order: 'asc', sortType: 'number' };
        const result = insertToOrderedArray(sortState, newItem, source, {
            customCompare(a, b) {
                if (a.id === b.id) {
                    return a.no - b.no;
                }
                return a.id - b.id;
            },
        });
        let isValidResult = true;
        for (let i = 0; i < result.length - 1; i++) {
            if (result[i].id === result[i + 1].id) {
                if (result[i].no > result[i + 1].no) {
                    isValidResult = false;
                    break;
                }
            } else if (result[i].id > result[i + 1].id) {
                isValidResult = false;
                break;
            }
        }
        expect(isValidResult).toBe(true);
    });
});
