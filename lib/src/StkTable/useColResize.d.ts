import { ComputedRef, Ref, ShallowRef } from 'vue';
import { StkTableColumn, UniqKey } from './types';

type Params<DT extends Record<string, any>> = {
    props: any;
    emits: any;
    tableContainerRef: Ref<HTMLElement | undefined>;
    tableHeaderLast: ShallowRef<StkTableColumn<DT>[]>;
    colResizeIndicatorRef: Ref<HTMLElement | undefined>;
    colKeyGen: ComputedRef<(p: any) => UniqKey>;
    fixedCols: Ref<StkTableColumn<DT>[]>;
};
/** 列宽拖动 */
export declare function useColResize<DT extends Record<string, any>>({ tableContainerRef, tableHeaderLast, colResizeIndicatorRef, props, emits, colKeyGen, fixedCols, }: Params<DT>): {
    isColResizing: Ref<boolean>;
    onThResizeMouseDown: (e: MouseEvent, col: StkTableColumn<DT>, leftHandle?: boolean) => void;
};
export {};
