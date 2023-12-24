import { test, expect } from 'vitest';
import { insertToOrderedArray } from '@/StkTable/utils';

test('insertToOrderedArray', () => {
    const sourceArr = [1, 2, 4, 5].map(id => ({
        id,
    }));
    const expectResult = [1, 2, 3, 4, 5].map(id => ({
        id,
    }));
    const result = insertToOrderedArray({ dataIndex: 'id', order: 'asc', sortType: 'number' }, { id: 3 }, sourceArr);

    expect(result).toStrictEqual(expectResult);
});
