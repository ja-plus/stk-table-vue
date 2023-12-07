type Params = {
    emit: any;
};
/**
 * 列顺序拖动
 * @param param0
 * @returns
 */
export declare function useThDrag({ emit }: Params): {
    onThDragStart: (e: MouseEvent) => void;
    onThDragOver: (e: MouseEvent) => void;
    onThDrop: (e: MouseEvent) => void;
};
export {};
