import { ShallowRef } from 'vue';
import { PrivateRowDT, StkTableColumn, UniqKey } from './types';

type DT = PrivateRowDT & { children?: DT[] };
type Option<DT extends Record<string, any>> = {
    rowKeyGen: (row: any) => UniqKey;
    dataSourceCopy: ShallowRef<DT[]>;
    emits: any;
};

export function useTree({ dataSourceCopy, rowKeyGen, emits }: Option<DT>) {
    /** click expended icon to toggle expand row */
    function toggleTreeNode(row: DT, col: StkTableColumn<DT>) {
        const expand = row ? !row.__T_EXPANDED__ : false;
        setTreeExpand(row, { expand, col });
    }

    /**
     *
     * @param rowKeyOrRow rowKey or row
     * @param option { col?: StkTableColumn<DT> }
     * @param option.expand expand or collapse
     * @param option.silent if set true, not emit `toggle-row-expand`, default:false
     */
    function setTreeExpand(rowKeyOrRow: string | undefined | DT, option?: { expand?: boolean; col?: StkTableColumn<DT>; silent?: boolean }) {
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
        const col = option?.col || null;

        const level = row.__T_LV__ || 0;
        const expanded = Boolean(option?.expand);
        if (expanded) {
            // insert new children row
            // const children = row.children;
            // if (children) {
            //     children.forEach(child => {
            //         child.__T_LV__ = level + 1;
            //         child.__T_PARENT_K__ = rowKey;
            //     });
            //     tempData.splice(index + 1, 0, ...children);
            // }
            const children = expandNode(row, level, rowKey);
            tempData.splice(index + 1, 0, ...children);
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
            row.__T_EXPANDED__ = Boolean(expanded);
        }

        dataSourceCopy.value = tempData;

        if (!option?.silent) {
            emits('toggle-tree-row-expand', { expanded: Boolean(expanded), row, col });
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

    function expandNode(row: DT, level: number, rowKey: UniqKey) {
        let result: DT[] = [];
        row.children &&
            row.children.forEach(child => {
                result.push(child);
                const childLv = level + 1;
                if (child.__T_EXPANDED__ && child.children) {
                    const res = expandNode(child, childLv, rowKeyGen(child));
                    result = result.concat(res);
                } else {
                    child.__T_LV__ = childLv;
                    child.__T_PARENT_K__ = rowKey;
                }
            });
        return result;
    }

    return {
        toggleTreeNode,
        setTreeExpand,
        flatTreeData,
    };
}
