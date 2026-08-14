import { ShallowRef } from 'vue';
import { PrivateStkTableColumn, RowKeyGen, UniqKey } from './types';

export function useMaxRowSpan(
    props: any,
    tableHeaderLast: ShallowRef<PrivateStkTableColumn<any>[]>,
    rowKeyGen: RowKeyGen,
    dataSourceCopy: ShallowRef<any[]>,
) {
    /** max rowspan of each row */
    const maxRowSpan = new Map<UniqKey, number>();

    /** 全局最大 rowspan：用于限定滚动时跨界修正的扫描范围（O(maxSpan) 而非 O(startIndex)） */
    let maxRowSpanValue = 0;

    /**
     * Use dataSourceCopy and tableHeaderLast to calculate maxRowSpan
     * @link {maxRowSpan}
     */
    function updateMaxRowSpan() {
        if (!props.virtual) {
            if (maxRowSpan.size) maxRowSpan.clear();
            maxRowSpanValue = 0;
            return;
        }
        maxRowSpan.clear();
        maxRowSpanValue = 0;

        const data = dataSourceCopy.value;
        const columns = tableHeaderLast.value;

        // 收集带 mergeCells 的列及其真实列索引（保证 colIndex 入参与其他调用处一致）
        const columnsWithMerge: { col: PrivateStkTableColumn<any>; index: number }[] = [];
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].mergeCells) columnsWithMerge.push({ col: columns[i], index: i });
        }
        if (!columnsWithMerge.length) return;

        const dataLength = data.length;
        const mergeColumnsLength = columnsWithMerge.length;

        for (let rowIndex = 0; rowIndex < dataLength; rowIndex++) {
            const row = data[rowIndex];
            const rowKey = rowKeyGen(row);
            let currentMax = maxRowSpan.get(rowKey) || 0;

            for (let colIndex = 0; colIndex < mergeColumnsLength; colIndex++) {
                const { col, index } = columnsWithMerge[colIndex];
                const { rowspan = 1 } = col.mergeCells!({ row, col, rowIndex, colIndex: index }) || {};

                if (rowspan > 1 && rowspan > currentMax) {
                    currentMax = rowspan;
                    maxRowSpan.set(rowKey, currentMax);
                    if (rowspan > maxRowSpanValue) maxRowSpanValue = rowspan;
                }
            }
        }
    }
    return [maxRowSpan, updateMaxRowSpan, () => maxRowSpanValue] as const;
}
