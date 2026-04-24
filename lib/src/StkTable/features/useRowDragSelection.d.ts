import { Ref, ShallowRef } from 'vue';
import { RowDragSelectionConfig, RowDragSelectionRange, RowKeyGen, UniqKey } from '../types';
import { VirtualScrollStore } from '../useVirtualScroll';

/**
 * 行拖拽选择功能
 * 支持鼠标拖拽选择多行、边缘自动滚动。
 * en: Row drag selection feature with mouse drag and edge auto-scroll.
 */
export declare function useRowDragSelection<DT extends Record<string, any>>(props: any, emits: any, tableContainerRef: Ref<HTMLDivElement | undefined>, dataSourceCopy: ShallowRef<DT[]>, rowKeyGen: RowKeyGen, scrollTo: (top: number | null, left: number | null) => void, virtualScroll: Ref<VirtualScrollStore>): {
    config: import('vue').ComputedRef<RowDragSelectionConfig>;
    isSelecting: Ref<boolean, boolean>;
    onMD: (e: MouseEvent) => boolean;
    getClass: (absoluteRowIndex: number) => string[];
    get: () => {
        rows: DT[];
        range: RowDragSelectionRange | null;
        ranges: RowDragSelectionRange[];
    };
    set: (rowKeyOrRows?: (UniqKey | DT)[], option?: {
        silent?: boolean;
    }) => void;
    clear: () => void;
    consumeClick: () => boolean;
};
export declare const useRowDragSelectionName = "useRowDragSelection";
