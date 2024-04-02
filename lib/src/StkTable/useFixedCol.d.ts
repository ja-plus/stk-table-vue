import { ComputedRef, Ref, ShallowRef } from 'vue';
import { StkTableColumn, UniqKey } from './types';
type Params<T extends Record<string, any>> = {
    props: any;
    colKeyGen: ComputedRef<(col: StkTableColumn<T>) => UniqKey>;
    tableHeaders: ShallowRef<StkTableColumn<T>[][]>;
    tableHeaderLast: ShallowRef<StkTableColumn<T>[]>;
    tableContainerRef: Ref<HTMLDivElement | undefined>;
};
/**
 * 固定列处理
 * @returns
 */
export declare function useFixedCol<DT extends Record<string, any>>({ props, colKeyGen, tableHeaders, tableHeaderLast, tableContainerRef }: Params<DT>): {
    /** 固定列class */
    fixedColClassMap: ComputedRef<Map<any, any>>;
    /** 处理固定列阴影 */
    dealFixedColShadow: () => void;
    /** 滚动条变化时，更新需要展示阴影的列 */
    updateFixedShadow: () => void;
};
export {};
