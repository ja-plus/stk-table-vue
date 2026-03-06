import { Ref, ShallowRef } from 'vue';
import { CellKeyGen, ColKeyGen, StkTableColumn, UniqKey } from '../types';
import { VirtualScrollStore, VirtualScrollXStore } from '../useVirtualScroll';

/**
 * 单元格拖拽选区
 * en: Cell drag selection
 */
export declare function useAreaSelection<DT extends Record<string, any>>(props: any, emits: any, tableContainerRef: Ref<HTMLDivElement | undefined>, dataSourceCopy: ShallowRef<DT[]>, tableHeaderLast: ShallowRef<StkTableColumn<DT>[]>, colKeyGen: ColKeyGen, cellKeyGen: CellKeyGen, scrollTo: (top: number | null, left: number | null) => void, virtualScroll: Ref<VirtualScrollStore>, virtualScrollX: Ref<VirtualScrollXStore>): {
    isSelecting: Ref<boolean, boolean>;
    getClass: (cellKey: string, absoluteRowIndex: number, colKey: UniqKey) => string[];
    get: () => {
        rows: DT[];
        cols: StkTableColumn<DT>[];
        range: null;
    } | {
        rows: DT[];
        cols: StkTableColumn<DT>[];
        range: {
            startRowIndex: number;
            startColIndex: number;
            endRowIndex: number;
            endColIndex: number;
        };
    };
    clear: () => void;
    copy: () => string;
    onMD: (e: MouseEvent) => void;
};
