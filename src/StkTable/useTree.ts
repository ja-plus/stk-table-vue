import { ShallowRef } from 'vue';
import { PrivateRowDT, RowKeyGen, TreeConfig, UniqKey } from './types';

type DT = PrivateRowDT & { children?: DT[] };
type Option<DT extends Record<string, any>> = {
    props: any;
    rowKeyGen: RowKeyGen;
    dataSourceCopy: ShallowRef<DT[]>;
    emits: any;
};

export function useTree({ props, dataSourceCopy, rowKeyGen, emits }: Option<DT>) {
    const { defaultExpandAll, defaultExpandKeys, defaultExpandLevel }: TreeConfig = props.treeConfig;

    /** click expended icon to toggle expand row */
    function toggleTreeNode(row: DT, col: any) {
        const expand = row ? !row.__T_EXP__ : false;
        privateSetTreeExpand(row, { expand, col, isClick: true });
    }

    /**
     *
     * @param row rowKey or row
     * @param option
     * @param option.expand expand or collapse
     * @param option.silent if set true, not emit `toggle-tree-expand`, default:false
     */
    function privateSetTreeExpand(row: (UniqKey | DT) | (UniqKey | DT)[], option: { expand?: boolean; col?: any; isClick: boolean }) {
        const rowKeyOrRowArr: (UniqKey | DT)[] = Array.isArray(row) ? row : [row];

        const tempData = dataSourceCopy.value.slice();
        for (let i = 0; i < rowKeyOrRowArr.length; i++) {
            const rowKeyOrRow = rowKeyOrRowArr[i];
            let rowKey: UniqKey;
            if (typeof rowKeyOrRow === 'string') {
                rowKey = rowKeyOrRow;
            } else {
                rowKey = rowKeyGen(rowKeyOrRow);
            }
            const index = tempData.findIndex(it => rowKeyGen(it) === rowKey);
            if (index === -1) {
                console.warn('treeExpandRow failed.rowKey:', rowKey);
                return;
            }

            const row = tempData[index];
            const level = row.__T_LV__ || 0;
            let expanded = option?.expand;
            if (expanded === void 0) {
                expanded = !row.__T_EXP__;
            }
            if (expanded) {
                const children = expandNode(row, level);
                tempData.splice(index + 1, 0, ...children);
            } else {
                // delete all child nodes from i
                const deleteCount = foldNode(index, tempData, level);
                tempData.splice(index + 1, deleteCount);
            }

            setNodeExpanded(row, expanded, level);

            if (option.isClick) {
                emits('toggle-tree-expand', { expanded: Boolean(expanded), row, col: option.col });
            }
        }

        dataSourceCopy.value = tempData;
    }

    function setTreeExpand(row: (UniqKey | DT) | (UniqKey | DT)[], option?: { expand?: boolean }) {
        privateSetTreeExpand(row, { ...option, isClick: false });
    }

    function setNodeExpanded(row: DT, expanded: boolean, level?: number, parent?: DT) {
        row.__T_EXP__ = expanded;
        if (level !== void 0) {
            row.__T_LV__ = level;
        }
        // if (parent) {
        //     row.__T_P_K__ = rowKeyGen(parent);
        // }
    }

    /**
     * 根据保存的展开状态，深度遍历，展平树形数据。
     * @param data
     * @returns
     */
    function flatTreeData(data: DT[]) {
        const result: DT[] = [];
        (function recursion(data: DT[] | undefined, level: number, parent?: DT) {
            if (!data) return;
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                result.push(item);
                const isExpanded = Boolean(item.__T_EXP__);
                setNodeExpanded(item, isExpanded, level, parent);
                if (!isExpanded) {
                    if (defaultExpandAll) {
                        setNodeExpanded(item, true);
                    } else {
                        if (defaultExpandLevel) {
                            if (level < defaultExpandLevel) {
                                setNodeExpanded(item, true);
                            }
                        }
                        if (defaultExpandKeys) {
                            if (defaultExpandKeys.includes(rowKeyGen(item))) {
                                setNodeExpanded(item, true);
                            }
                        }
                        if (!item.__T_EXP__) {
                            continue;
                        }
                    }
                }
                recursion(item.children, level + 1, item);
            }
        })(data, 0);
        return result;
    }

    function expandNode(row: DT, level: number) {
        let result: DT[] = [];
        row.children &&
            row.children.forEach((child: DT) => {
                result.push(child);
                const childLv = level + 1;
                if (child.__T_EXP__ && child.children) {
                    const res = expandNode(child, childLv);
                    result = result.concat(res);
                } else {
                    setNodeExpanded(child, false, childLv, row);
                }
            });
        return result;
    }

    function foldNode(index: number, tempData: DT[], level: number) {
        let deleteCount = 0;
        for (let i = index + 1; i < tempData.length; i++) {
            const child = tempData[i];
            if (child.__T_LV__ && child.__T_LV__ > level) {
                deleteCount++;
            } else {
                break;
            }
        }
        return deleteCount;
    }

    return {
        toggleTreeNode,
        setTreeExpand,
        flatTreeData,
    };
}
