import { ColKeyGen, StkTableColumn } from './types';

type Params = {
    props: any;
    emits: any;
    colKeyGen: ColKeyGen;
};
/**
 * 列顺序拖动
 * @returns
 */
export declare function useThDrag({ props, emits, colKeyGen }: Params): {
    onThDragStart: (e: DragEvent) => void;
    onThDragOver: (e: DragEvent) => void;
    onThDrop: (e: DragEvent) => void;
    /** 是否可拖拽 */
    isHeaderDraggable: (col: StkTableColumn<any>) => any;
};
export {};
