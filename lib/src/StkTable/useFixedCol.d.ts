import { ComputedRef, Ref, ShallowRef } from 'vue';
import { StkTableColumn, UniqKey } from './types';
import { VirtualScrollXStore } from './useVirtualScroll';
type Params<T extends Record<string, any>> = {
    props: any;
    colKeyGen: ComputedRef<(col: StkTableColumn<T>) => UniqKey>;
    getFixedColPosition: ComputedRef<(col: StkTableColumn<T>) => number>;
    tableHeaders: ShallowRef<StkTableColumn<T>[][]>;
    tableHeaderLast: ShallowRef<StkTableColumn<T>[]>;
    tableContainerRef: Ref<HTMLDivElement | undefined>;
};
/**
 * 固定列处理
 * @returns
 */
export declare function useFixedCol<DT extends Record<string, any>>({ props, colKeyGen, getFixedColPosition, tableHeaders, tableHeaderLast, tableContainerRef, }: Params<DT>): {
    /** 正在被固定的列 */
    fixedCols: ShallowRef<StkTableColumn<DT>[], StkTableColumn<DT>[]>;
    /** 固定列class */
    fixedColClassMap: ComputedRef<Map<any, any>>;
    /** 滚动条变化时，更新需要展示阴影的列 */
    updateFixedShadow: (virtualScrollX?: Ref<VirtualScrollXStore>) => void;
};
export {};
