import { ShallowRef } from 'vue';
import { PrivateStkTableColumn, RowKeyGen, UniqKey } from './types';

type Options = {
    props: any;
    tableHeaderLast: ShallowRef<PrivateStkTableColumn<any>[]>;
    rowKeyGen: RowKeyGen;
    dataSourceCopy: ShallowRef<any[]>;
};
export declare function useMaxRowSpan({ props, tableHeaderLast, rowKeyGen, dataSourceCopy }: Options): {
    maxRowSpan: Map<UniqKey, number>;
    updateMaxRowSpan: () => void;
};
export {};
