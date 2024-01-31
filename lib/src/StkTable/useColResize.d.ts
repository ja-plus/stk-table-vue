import { Ref } from 'vue';
import { StkTableColumn } from './types';
type Params<DT extends Record<string, any>> = {
    props: any;
    emits: any;
    tableContainer: Ref<HTMLElement | undefined>;
    tableHeaderLast: Ref<StkTableColumn<DT>[]>;
    colResizeIndicator: Ref<HTMLElement | undefined>;
    colKeyGen: (p: any) => string;
};
/** 列宽拖动 */
export declare function useColResize<DT extends Record<string, any>>({ tableContainer, tableHeaderLast, colResizeIndicator, props, emits, colKeyGen, }: Params<DT>): {
    isColResizing: Ref<boolean>;
    onThResizeMouseDown: (e: MouseEvent, col: StkTableColumn<DT>, isPrev?: boolean) => void;
    onThResizeMouseMove: (e: MouseEvent) => void;
    onThResizeMouseUp: (e: MouseEvent) => void;
};
export {};
