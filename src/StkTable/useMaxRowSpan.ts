import { ShallowRef } from "vue";
import { PrivateStkTableColumn, RowKeyGen, UniqKey } from "./types";

type Options = {
    props:any,
    tableHeaderLast: ShallowRef<PrivateStkTableColumn<any>[]>;
    rowKeyGen: RowKeyGen;
    dataSourceCopy: ShallowRef<any[]>;
}

export function useMaxRowSpan({ props, tableHeaderLast, rowKeyGen, dataSourceCopy }: Options) {
    /** max rowspan of each row */
    const maxRowSpan = new Map<UniqKey, number>();

    /** 
     * Use dataSourceCopy and tableHeaderLast to calculate maxRowSpan 
     * @link {maxRowSpan}
     */
    function updateMaxRowSpan() {
        if(!props.virtual) {
            if(maxRowSpan.size) maxRowSpan.clear();
            return;
        }
        maxRowSpan.clear();

        const data = dataSourceCopy.value;
        const columns = tableHeaderLast.value;

        const columnsWithMerge = columns.filter(col => col.mergeCells);
        if (!columnsWithMerge.length) return;

        const dataLength = data.length;
        const mergeColumnsLength = columnsWithMerge.length;

        for (let rowIndex = 0; rowIndex < dataLength; rowIndex++) {
            const row = data[rowIndex];
            const rowKey = rowKeyGen(row);
            let currentMax = maxRowSpan.get(rowKey) || 0;

            for (let colIndex = 0; colIndex < mergeColumnsLength; colIndex++) {
                const col = columnsWithMerge[colIndex];
                const { rowspan = 1 } = col.mergeCells!({ row, col, rowIndex, colIndex }) || {};

                if (rowspan > 1 && rowspan > currentMax) {
                    currentMax = rowspan;
                    maxRowSpan.set(rowKey, currentMax);
                }
            }
        }
    }

    return {
        maxRowSpan,
        updateMaxRowSpan
    }
}