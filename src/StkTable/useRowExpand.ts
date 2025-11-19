import { ShallowRef } from 'vue';
import { EXPANDED_ROW_KEY_PREFIX } from './const';
import { PrivateRowDT, RowKeyGen, StkTableColumn, UniqKey } from './types';
type DT = PrivateRowDT;
type Option<DT extends Record<string, any>> = {
    rowKeyGen: RowKeyGen;
    dataSourceCopy: ShallowRef<DT[]>;
    emits: any;
};

export function useRowExpand({ dataSourceCopy, rowKeyGen, emits }: Option<DT>) {
    const expandedKey = '__EXP__';

    function isExpanded(row: DT, col?: StkTableColumn<DT>) {
        return row?.[expandedKey] === col ? !row?.[expandedKey] : true;
    }
    /** click expended icon to toggle expand row */
    function toggleExpandRow(row: DT, col: StkTableColumn<DT>) {
        const isExpand = isExpanded(row, col);
        setRowExpand(row, isExpand, { col });
    }

    /**
     *
     * @param rowKeyOrRow rowKey or row
     * @param expand expand or collapse, if set null, toggle expand
     * @param data { col?: StkTableColumn<DT> }
     * @param data.silent if set true, not emit `toggle-row-expand`, default:false
     */
    function setRowExpand(rowKeyOrRow: string | undefined | DT, expand?: boolean | null, data?: { col?: StkTableColumn<DT>; silent?: boolean }) {
        let rowKey: UniqKey;
        if (typeof rowKeyOrRow === 'string') {
            rowKey = rowKeyOrRow;
        } else {
            rowKey = rowKeyGen(rowKeyOrRow);
        }

        const tempData = dataSourceCopy.value.slice();
        const index = tempData.findIndex(it => rowKeyGen(it) === rowKey);
        if (index === -1) {
            console.warn('expandRow failed.rowKey:', rowKey);
            return;
        }

        // delete other expanded row below the target row
        for (let i = index + 1; i < tempData.length; i++) {
            const item: PrivateRowDT = tempData[i];
            const rowKey = item.__ROW_K__;
            if (rowKey?.startsWith(EXPANDED_ROW_KEY_PREFIX)) {
                tempData.splice(i, 1);
                i--;
            } else {
                break;
            }
        }

        const row = tempData[index];
        const col = data?.col;

        if (expand == null) {
            expand = isExpanded(row, col);
        }

        if (expand) {
            // insert new expanded row
            const newExpandRow: PrivateRowDT = {
                __ROW_K__: EXPANDED_ROW_KEY_PREFIX + rowKey,
                __EXP_R__: row,
                __EXP_C__: col,
            };
            tempData.splice(index + 1, 0, newExpandRow);
        }

        if (row) {
            row[expandedKey] = expand ? col : void 0;
        }

        dataSourceCopy.value = tempData;
        if (!data?.silent) {
            emits('toggle-row-expand', { expanded: Boolean(expand), row, col });
        }
    }

    return {
        toggleExpandRow,
        setRowExpand,
    };
}
