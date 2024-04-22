import { ComputedRef, Ref, ShallowRef } from 'vue';
import { StkTableColumn, UniqKey } from './types';
type Params<DT extends Record<string, any>> = {
    props: any;
    emits: any;
    tableContainerRef: Ref<HTMLElement | undefined>;
    tableHeaderLast: ShallowRef<StkTableColumn<DT>[]>;
    colResizeIndicatorRef: Ref<HTMLElement | undefined>;
    colKeyGen: ComputedRef<(p: any) => UniqKey>;
};
/** 列宽拖动 */
export declare function useColResize<DT extends Record<string, any>>({ tableContainerRef, tableHeaderLast, colResizeIndicatorRef, props, emits, colKeyGen, }: Params<DT>): {
    isColResizing: Ref<boolean>;
    onThResizeMouseDown: (e: MouseEvent, col: StkTableColumn<DT>, isPrev?: boolean) => void;
};
export {};
