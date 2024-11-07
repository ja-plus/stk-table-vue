import { ComputedRef } from 'vue';
import { StkTableColumn, UniqKey } from './types';
type Params<T extends Record<string, any>> = {
    props: any;
    emits: any;
    colKeyGen: ComputedRef<(col: StkTableColumn<T>) => UniqKey>;
};
/**
 * 列顺序拖动
 * @returns
 */
export declare function useThDrag<DT extends Record<string, any>>({ props, emits, colKeyGen }: Params<DT>): {
    onThDragStart: (e: DragEvent) => void;
    onThDragOver: (e: DragEvent) => void;
    onThDrop: (e: DragEvent) => void;
    /** 是否可拖拽 */
    isHeaderDraggable: (col: StkTableColumn<DT>) => boolean;
};
export {};
