type Params = {
    emits: any;
};
/**
 * 列顺序拖动
 * @param param0
 * @returns
 */
export declare function useThDrag({ emits }: Params): {
    onThDragStart: (e: MouseEvent) => void;
    onThDragOver: (e: MouseEvent) => void;
    onThDrop: (e: MouseEvent) => void;
};
export {};
