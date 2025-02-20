import { ShallowRef } from 'vue';
import { DragRowConfig } from './types';

type Params = {
    props: any;
    emits: any;
    dataSourceCopy: ShallowRef<any[]>;
};
/**
 * 拖拽行
 * TODO: 不在虚拟滚动的情况下，从上面拖拽到下面，跨页的时候，滚动条会自适应位置。没有顶上去
 */
export declare function useTrDrag({ props, emits, dataSourceCopy }: Params): {
    dragRowConfig: import('vue').ComputedRef<DragRowConfig>;
    onTrDragStart: (e: DragEvent, rowIndex: number) => void;
    onTrDragEnter: (e: DragEvent) => void;
    onTrDragOver: (e: DragEvent) => void;
    onTrDrop: (e: DragEvent, rowIndex: number) => void;
    onTrDragEnd: (e: DragEvent) => void;
};
export {};
