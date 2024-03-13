import { Ref } from 'vue';
import { UniqKey } from './types';
type Params = {
    props: any;
    tableContainer: Ref<HTMLElement | undefined>;
};
/** 高亮行保存的东西 */
type HighlightRowStore = {
    bgc: string;
    bgc_progress_ms: number;
    bgc_progress: number;
};
/**
 * 高亮单元格，行
 * row中新增_bgc_progress_ms 属性控制高亮状态,_bgc控制颜色
 */
export declare function useHighlight({ props, tableContainer }: Params): {
    highlightRowStore: Ref<Record<UniqKey, HighlightRowStore>>;
    highlightFrom: import("vue").ComputedRef<string>;
    setHighlightDimRow: (rowKeyValues: UniqKey[], option?: {
        useCss?: boolean;
        className?: string;
    }) => void;
    setHighlightDimCell: (rowKeyValue: string, dataIndex: string, option?: {
        className?: string;
    }) => void;
};
export {};
