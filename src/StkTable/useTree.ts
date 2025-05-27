import { ShallowRef } from 'vue';
import { PrivateRowDT, StkTableColumn, UniqKey } from './types';

type DT = PrivateRowDT & { children?: PrivateRowDT[] };
type Option<DT extends Record<string, any>> = {
    rowKeyGen: (row: any) => UniqKey;
    dataSourceCopy: ShallowRef<DT[]>;
    emits: any;
};

export function useTree({ dataSourceCopy, rowKeyGen, emits }: Option<DT>) {
    /** click expended icon to toggle expand row */
    function toggleTreeNode(row: DT, col: StkTableColumn<DT>) {
        const isExpand = row?.__T_EXPANDED__ === col ? !row?.__T_EXPANDED__ : true;
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

        const level = row.__T_LV__ || 0;
        if (expand) {
            // insert new children row
            const children = row.children;
            if (children) {
                children.forEach(child => {
                    child.__T_LV__ = level + 1;
                    child.__T_PARENT_K__ = rowKey;
                });
                tempData.splice(index + 1, 0, ...children);
            }
        } else {
            // delete all child nodes from i
            let deleteCount = 0;
            for (let i = index + 1; i < tempData.length; i++) {
                const child = tempData[i];
                if (child.__T_LV__ && child.__T_LV__ > level) {
                    deleteCount++;
                } else {
                    break;
                }
            }
            tempData.splice(index + 1, deleteCount);
        }

        if (row) {
            row.__T_EXPANDED__ = expand ? col : null;
        }

        dataSourceCopy.value = tempData;
        if (!data?.silent) {
            emits('toggle-tree-row-expand', { expanded: Boolean(expand), row, col });
        }
    }

    function flatTreeData(data: DT[]) {
        const result: DT[] = [];
        // 根据保存的展开状态，深度遍历，展平树形数据。
        data.forEach(function recursion(item) {
            result.push(item);
            if (!item.__T_EXPANDED__) return;
            const children = item.children;
            if (!children) return;
            children.forEach(recursion);
        });
        return result;
    }

    return {
        toggleTreeNode,
        setTreeExpand,
        flatTreeData,
    };
}
