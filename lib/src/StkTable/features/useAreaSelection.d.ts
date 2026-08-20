import { Ref, ShallowRef } from 'vue';
import { AreaSelectionConfig, AreaSelectionRange, CellKeyGen, ColKeyGen, StkTableColumn, AreaSelectionSetterRange, AreaSelectionSetterOption } from '../types';
import { VirtualScrollStore, VirtualScrollXStore } from '../useVirtualScroll';

/**
 * 单元格区域选择功能
 * 支持鼠标拖拽选择、键盘导航、复制粘贴等功能
 * en: Cell area selection feature with mouse drag, keyboard navigation, copy-paste, etc.
 */
declare function useAreaSelectionImpl<DT extends Record<string, any>>(props: any, emits: any, tableContainerRef: Ref<HTMLDivElement | undefined>, dataSourceCopy: ShallowRef<DT[]>, tableHeaderLast: ShallowRef<StkTableColumn<DT>[]>, colKeyGen: ColKeyGen, cellKeyGen: CellKeyGen, scrollTo: (top: number | null, left: number | null) => void, virtualScroll: Ref<VirtualScrollStore>, virtualScrollX: Ref<VirtualScrollXStore>, getRowIndex: (row: DT) => number, getColumnIndex: (col: StkTableColumn<DT>) => number): {
    config: import('vue').ComputedRef<AreaSelectionConfig>;
    isSelecting: Ref<boolean, boolean>;
    get: () => {
        rows: DT[];
        cols: StkTableColumn<DT>[];
        ranges: AreaSelectionRange[];
    };
    set: (ranges?: AreaSelectionSetterRange<DT>, option?: AreaSelectionSetterOption) => AreaSelectionRange[];
    clear: () => void;
    copy: () => string;
    onMD: (e: MouseEvent) => void;
};
export declare const useAreaSelectionName = "useAreaSelection";
export declare const useAreaSelection: typeof useAreaSelectionImpl;
export {};
