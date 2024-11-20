import { ComputedRef, ShallowRef, computed } from 'vue';
import { StkTableColumn, UniqKey } from './types';
import { getCalculatedColWidth } from './utils/constRefUtils';

type Params<T extends Record<string, any>> = {
    colKeyGen: ComputedRef<(col: StkTableColumn<T>) => UniqKey>;
    tableHeaders: ShallowRef<StkTableColumn<T>[][]>;
};

/**
 * 固定列fixed左侧或者右侧的距离
 * - col.fixed = left 则得到距离左侧的距离
 * - col.fixed = right 则得到距离右侧的距离
 */
export function useGetFixedColPosition<DT extends Record<string, any>>({ tableHeaders, colKeyGen }: Params<DT>) {
    /** 固定列fixed左侧或者右侧的距离 */
    const getFixedColPosition = computed(() => {
        /** dataIndex 作为唯一标识 */
        const colKeyStore: Record<string, number> = {};
        /** 没有dataIndex 的多级表头列，使用对象引用做标识 */
        const refStore = new WeakMap<StkTableColumn<DT>, number>();
        tableHeaders.value.forEach(cols => {
            let left = 0;
            /**遍历右侧fixed时，因为left已经遍历过一次了。所以，可以拿到right遍历边界 */
            let rightStartIndex = 0;
            for (let i = 0; i < cols.length; i++) {
                const item = cols[i];
                if (item.fixed === 'left') {
                    const colKey = colKeyGen.value(item);
                    if (colKey) {
                        colKeyStore[colKey] = left;
                    } else {
                        refStore.set(item, left);
                    }
                    left += getCalculatedColWidth(item);
                }
                if (!rightStartIndex && item.fixed === 'right') {
                    rightStartIndex = i;
                }
            }

            let right = 0;
            for (let i = cols.length - 1; i >= rightStartIndex; i--) {
                const item = cols[i];
                const colKey = colKeyGen.value(item);
                if (item.fixed === 'right') {
                    if (colKey) {
                        colKeyStore[colKey] = right;
                    } else {
                        refStore.set(item, right);
                    }
                    right += getCalculatedColWidth(item);
                }
            }
        });

        return (col: StkTableColumn<any>) => {
            const colKey = colKeyGen.value(col);
            return colKey ? colKeyStore[colKey] : refStore.get(col) || 0;
        };
    });

    return getFixedColPosition;
}
