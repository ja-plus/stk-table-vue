import { Ref } from 'vue';
import { StkTableColumn } from './types';
type Params<T extends Record<string, any>> = {
    props: any;
    tableHeaderLast: Ref<StkTableColumn<T>[]>;
    tableContainer: Ref<HTMLDivElement | undefined>;
};
/**
 * 固定列处理
 * @returns
 */
export declare function useFixedCol<DT extends Record<string, any>>({ props, tableHeaderLast, tableContainer }: Params<DT>): {
    /** 固定列class */
    getFixedColClass: (col: StkTableColumn<DT>) => Record<string, boolean>;
    /** 处理固定列阴影 */
    dealFixedColShadow: () => void;
    /** 滚动条变化时，更新需要展示阴影的列 */
    updateFixedShadow: () => void;
};
export {};
