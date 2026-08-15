import { ShallowRef } from 'vue';
import { PrivateStkTableColumn, RowKeyGen, UniqKey } from './types';

export declare function useMaxRowSpan(props: any, tableHeaderLast: ShallowRef<PrivateStkTableColumn<any>[]>, rowKeyGen: RowKeyGen, dataSourceCopy: ShallowRef<any[]>): readonly [Map<UniqKey, number>, () => void, () => number];
