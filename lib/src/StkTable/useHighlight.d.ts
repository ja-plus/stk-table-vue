import { Ref } from 'vue';
type Params = {
    props: {
        theme: 'light' | 'dark';
        virtual: boolean;
        dataSource: any[];
    };
    tableContainer: Ref<HTMLElement | undefined>;
    rowKeyGen: (p: any) => string;
};
/**
 * 高亮单元格，行
 * row中新增_bgc_progress_ms 属性控制高亮状态,_bgc控制颜色
 */
export declare function useHighlight({ props, tableContainer, rowKeyGen }: Params): {
    setHighlightDimRow: (rowKeyValues: Array<string | number>) => void;
    setHighlightDimCell: (rowKeyValue: string, dataIndex: string) => void;
};
export {};
