import { Ref } from 'vue';
import { UniqKey } from './types';

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
    setHighlightDimRow: (rowKeyValues: UniqKey[], option?: {
        method?: 'animation' | 'css' | 'js';
        /** @deprecated 请使用method */
        useCss?: boolean;
        className?: string;
        keyframe?: Parameters<Animatable['animate']>['0'];
        duration?: number;
    }) => void;
    setHighlightDimCell: (rowKeyValue: UniqKey, dataIndex: string, option?: {
        className?: string;
        method?: 'animation' | 'css';
        keyframe?: Parameters<Animatable['animate']>['0'];
        duration?: number;
    }) => void;
};
export {};
