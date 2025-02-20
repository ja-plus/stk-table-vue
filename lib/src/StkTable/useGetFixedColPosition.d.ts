import { ComputedRef, ShallowRef } from 'vue';
import { StkTableColumn, UniqKey } from './types';

type Params<T extends Record<string, any>> = {
    colKeyGen: ComputedRef<(col: StkTableColumn<T>) => UniqKey>;
    tableHeadersForCalc: ShallowRef<StkTableColumn<T>[][]>;
};
/**
 * 固定列fixed左侧或者右侧的距离
 * - col.fixed = left 则得到距离左侧的距离
 * - col.fixed = right 则得到距离右侧的距离
 */
export declare function useGetFixedColPosition<DT extends Record<string, any>>({ tableHeadersForCalc, colKeyGen }: Params<DT>): ComputedRef<(col: StkTableColumn<any>) => number>;
export {};
