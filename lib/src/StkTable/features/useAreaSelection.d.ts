import { Ref, ShallowRef } from 'vue';
import { AreaSelectionConfig, AreaSelectionRange, CellKeyGen, ColKeyGen, StkTableColumn, UniqKey } from '../types';
import { VirtualScrollStore, VirtualScrollXStore } from '../useVirtualScroll';

/**
 * 单元格区域选择功能
 * 支持鼠标拖拽选择、键盘导航、复制粘贴等功能
 * en: Cell area selection feature with mouse drag, keyboard navigation, copy-paste, etc.
 */
export declare function useAreaSelection<DT extends Record<string, any>>(props: any, emits: any, tableContainerRef: Ref<HTMLDivElement | undefined>, dataSourceCopy: ShallowRef<DT[]>, tableHeaderLast: ShallowRef<StkTableColumn<DT>[]>, colKeyGen: ColKeyGen, cellKeyGen: CellKeyGen, scrollTo: (top: number | null, left: number | null) => void, virtualScroll: Ref<VirtualScrollStore>, virtualScrollX: Ref<VirtualScrollXStore>): {
    config: import('vue').ComputedRef<AreaSelectionConfig>;
    isSelecting: Ref<boolean, boolean>;
    getClass: (cellKey: string, absoluteRowIndex: number, colKey: UniqKey) => string[];
    getRowClass: (absoluteRowIndex: number) => string[];
    get: () => {
        rows: DT[];
        cols: StkTableColumn<DT>[];
        ranges: AreaSelectionRange[];
    };
    clear: () => void;
    copy: () => string;
    onMD: (e: MouseEvent) => void;
};
export declare const useAreaSelectionName = "useAreaSelection";
