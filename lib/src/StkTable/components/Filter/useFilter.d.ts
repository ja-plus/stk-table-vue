import { UniqKey } from '../../types';
import { VNode } from 'vue';
import { FilterOption, FilterStatus } from './types';

/**
 * 表格筛选功能Hook (BETA)
 * @beta
 * @returns
 */
export declare function useFilter(): {
    Filter: (config?: {
        options?: FilterOption[];
    }, component?: VNode) => import('vue').Raw<import('vue').DefineComponent<{
        col: import('../../types').StkTableColumn<any>;
        rowIndex: number;
        colIndex: number;
    }, () => VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{
        col: import('../../types').StkTableColumn<any>;
        rowIndex: number;
        colIndex: number;
    }> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>>;
    filterStatus: import('vue').Ref<Record<UniqKey, FilterStatus>, Record<UniqKey, FilterStatus>>;
};
