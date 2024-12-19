import { Ref } from 'vue';
import { UniqKey } from './types';
import { HighlightDimCellOption, HighlightDimRowOption } from './types/highlightDimOptions';
type Params = {
    props: any;
    stkTableId: string;
    tableContainerRef: Ref<HTMLDivElement | undefined>;
};
/**
 * 高亮单元格，行
 */
export declare function useHighlight({ props, stkTableId, tableContainerRef }: Params): {
    highlightSteps: number | null;
    setHighlightDimRow: (rowKeyValues: UniqKey[], option?: HighlightDimRowOption) => void;
    setHighlightDimCell: (rowKeyValue: UniqKey, colKeyValue: string, option?: HighlightDimCellOption) => void;
};
export {};
