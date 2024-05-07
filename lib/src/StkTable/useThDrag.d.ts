import { StkTableColumn } from './types';

type Params = {
    props: any;
    emits: any;
};
/**
 * 列顺序拖动
 * @param param0
 * @returns
 */
export declare function useThDrag<DT extends Record<string, any>>({ props, emits }: Params): {
    onThDragStart: (e: MouseEvent) => void;
    onThDragOver: (e: MouseEvent) => void;
    onThDrop: (e: MouseEvent) => void;
    isHeaderDraggable: (col: StkTableColumn<DT>) => any;
};
export {};
