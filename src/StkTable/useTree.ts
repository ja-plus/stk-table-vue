import { ShallowRef } from 'vue';
import { PrivateRowDT, StkTableColumn, UniqKey } from './types';

type DT = PrivateRowDT;
type Option<DT extends Record<string, any>> = {
    rowKeyGen: (row: any) => UniqKey;
    dataSourceCopy: ShallowRef<DT[]>;
    emits: any;
};

export function useTree({ dataSourceCopy, rowKeyGen, emits }: Option<DT>) {
    /** click expended icon to toggle expand row */
    function toggleTreeNode(row: DT, col: StkTableColumn<DT>) {
        const isExpand = row?.__TREE_EXPANDED__ === col ? !row?.__TREE_EXPANDED__ : true;
        setTreeExpand(row, isExpand, { col });
    }

    /**
     *
     * @param rowKeyOrRow rowKey or row
     * @param expand expand or collapse
     * @param data { col?: StkTableColumn<DT> }
     * @param data.silent if set true, not emit `toggle-row-expand`, default:false
     */
    function setTreeExpand(rowKeyOrRow: string | undefined | DT, expand?: boolean, data?: { col?: StkTableColumn<DT>; silent?: boolean }) {
        let rowKey: UniqKey;
        if (typeof rowKeyOrRow === 'string') {
            rowKey = rowKeyOrRow;
        } else {
            rowKey = rowKeyGen(rowKeyOrRow);
        }
        const tempData = dataSourceCopy.value.slice();
        const index = tempData.findIndex(it => rowKeyGen(it) === rowKey);
        if (index === -1) {
            console.warn('treeExpandRow failed.rowKey:', rowKey);
            return;
        }

        const row = tempData[index];
        const col = data?.col || null;

        if (expand) {
            // insert new children row
            const children: PrivateRowDT[] = (row as any).children;
            const level = (row as any).__TREE_LEVEL__ || 0;
            if (children) {
                children.forEach(child => {
                    child.__TREE_LEVEL__ = level + 1;
                    child.__TREE_PARENT_KEY__ = rowKey;
                });
            }
            tempData.splice(index + 1, 0, ...children);
        } else {
            // delete all child nodes from i
            for (let i = index + 1; i < tempData.length; i++) {
                const child = tempData[i];
                if (child.__TREE_PARENT_KEY__ === rowKey) {
                    tempData.splice(i, 1);
                    i--;
                } else {
                    break;
                }
            }
        }

        if (row) {
            row.__TREE_EXPANDED__ = expand ? col : null;
        }

        dataSourceCopy.value = tempData;
        if (!data?.silent) {
            emits('toggle-tree-row-expand', { expanded: Boolean(expand), row, col });
        }
    }

    return {
        toggleTreeNode,
        setTreeExpand,
    };
}
