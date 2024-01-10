import { Ref } from 'vue';
import { StkTableColumn } from './types';
type Params = {
    props: any;
    emit: any;
    tableContainer: Ref<HTMLElement | undefined>;
    tableHeaderLast: Ref<StkTableColumn<any>[]>;
    colResizeIndicator: Ref<HTMLElement | undefined>;
    colKeyGen: (p: any) => string;
};
/** 列宽拖动 */
export declare function useColResize({ tableContainer, tableHeaderLast, colResizeIndicator, props, emit, colKeyGen }: Params): {
    isColResizing: Ref<boolean>;
    onThResizeMouseDown: (e: MouseEvent, col: StkTableColumn<any>, isPrev?: boolean) => void;
    onThResizeMouseMove: (e: MouseEvent) => void;
    onThResizeMouseUp: (e: MouseEvent) => void;
};
export {};
