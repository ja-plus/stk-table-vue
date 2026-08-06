import { ShallowRef } from 'vue';
import { PrivateRowDT, RowKeyGen, TreeConfig, UniqKey } from './types';

type DT = PrivateRowDT & { children?: DT[] };

type SetTreeExpandOption = {
    /**
     * 是否展开
     * en: Whether to expand
     * @default false
     */
    expand?: boolean;
    /**
     * 是否展开所有子节点
     * en: Whether to expand all child nodes
     * @default false
     * @version 1.0.4
     */
    all?: boolean;
    /**
     * 展开到第几层
     * en: Expand to the nth level
     * @version 1.0.4
     */
    level?: number;
    /**
     * 将传入 row 视为目标子节点，展开/收起其所有父节点；展开时若目标行自身有子节点则一并展开
     * en: Treat the given row as a target child, expand/collapse all its ancestors. The target row itself is also expanded when expanding if it has children
     * @version 1.1.0
     */
    parents?: boolean;
};

export function useTree(props: any, dataSourceCopy: ShallowRef<DT[]>, rowKeyGen: RowKeyGen, emits: any, onDataSourceChange: () => void) {
    const { defaultExpandAll, defaultExpandKeys, defaultExpandLevel }: TreeConfig = props.treeConfig;
    /** It used to check if it is first load. To execute defaultExpandXXX */
    let isFirstLoad = true;
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
     * @param option.all expand all descendants
     * @param option.level expand to the nth level
     * @param option.parents expand/collapse all ancestors of the given row, the target row itself is also expanded if it has children
     * @param option.silent if set true, not emit `toggle-tree-expand`, default:false
     */
    function privateSetTreeExpand(row: (UniqKey | DT) | (UniqKey | DT)[], option: SetTreeExpandOption & { col?: any; isClick: boolean }) {
        const rowKeyOrRowArr: (UniqKey | DT)[] = Array.isArray(row) ? row : [row];

        const tempData = dataSourceCopy.value.slice();
        for (let i = 0; i < rowKeyOrRowArr.length; i++) {
            const rowKeyOrRow = rowKeyOrRowArr[i];
            let rowKey: UniqKey;
            if (typeof rowKeyOrRow === 'string' || typeof rowKeyOrRow === 'number') {
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
            const wasExpanded = Boolean(row.__T_EXP__);
            let expanded = option?.expand;
            if (expanded === void 0) {
                expanded = !row.__T_EXP__;
            }
            if (option.all || option.level !== void 0) {
                const targetLevel = option.all ? Infinity : option.level || 0;
                setDescendantsToLevel(row, level + 1, targetLevel, expanded);
            }
            if (expanded) {
                if (wasExpanded) {
                    // already expanded, rebuild the flattened subtree so newly expanded
                    // descendants are inserted into the visible data source
                    const deleteCount = foldNode(index, tempData, level);
                    const children = expandNode(row, level);
                    tempData.splice(index + 1, deleteCount, ...children);
                } else {
                    const children = expandNode(row, level);
                    tempData.splice(index + 1, 0, ...children);
                }
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
        onDataSourceChange();
    }

    function setTreeExpand(row: (UniqKey | DT) | (UniqKey | DT)[], option?: SetTreeExpandOption) {
        if (option?.parents) {
            const rowKeyOrRow = Array.isArray(row) ? row[0] : row;
            const rowKey = typeof rowKeyOrRow === 'string' || typeof rowKeyOrRow === 'number' ? rowKeyOrRow : rowKeyGen(rowKeyOrRow);
            const path = findPath(props.dataSource || [], rowKey);
            if (!path) {
                console.warn('treeExpandRow failed.rowKey:', rowKey);
                return;
            }
            const expanded = option?.expand !== false;
            const target = path[path.length - 1];
            const keys = path.slice(0, -1).map(it => rowKeyGen(it));
            // 展开时若目标行自身有子节点则一并展开；收起时仅处理父节点，目标行自身状态不变
            // en: when expanding, also expand the target row itself if it has children; when collapsing, only ancestors are handled
            if (expanded && target.children?.length) keys.push(rowKeyGen(target));
            if (!keys.length) return;
            // 展开时从根到目标逐级展开；收起时逆序处理，避免先折叠根节点导致其余节点从可见数据中移除而查找失败
            // en: expand from root to target; collapse in reverse order, otherwise collapsing the root first removes the rest nodes from visible data
            if (!expanded) keys.reverse();
            privateSetTreeExpand(keys, { expand: expanded, isClick: false });
            return;
        }
        privateSetTreeExpand(row, { ...option, isClick: false });
    }

    /**
     * 在原始树形数据中查找目标节点，返回从根节点到目标节点的完整路径（含目标节点自身）
     * en: Find target node in raw tree data, return the full path from root to target node (target included)
     * @returns full path including target, or null if target not found
     */
    function findPath(data: DT[], targetKey: UniqKey): DT[] | null {
        const path: DT[] = [];
        function dfs(list: DT[]): boolean {
            for (const item of list) {
                if (rowKeyGen(item) === targetKey) {
                    path.push(item);
                    return true;
                }
                if (item.children) {
                    path.push(item);
                    if (dfs(item.children)) return true;
                    path.pop();
                }
            }
            return false;
        }
        return dfs(data) ? path : null;
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

    function recursionFlat(data: DT[] | undefined, level: number, parent?: DT): DT[] {
        if (!data) return [];
        let result: DT[] = [];
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            result.push(item);
            const isExpanded = Boolean(item.__T_EXP__);
            setNodeExpanded(item, isExpanded, level, parent);
            if (isFirstLoad && !isExpanded) {
                // first load will expand all node if defaultExpandAll is true
                if (defaultExpandAll) {
                    setNodeExpanded(item, true);
                } else {
                    if (defaultExpandLevel && level < defaultExpandLevel) {
                        setNodeExpanded(item, true);
                    }
                    if (defaultExpandKeys?.includes(rowKeyGen(item))) {
                        setNodeExpanded(item, true);
                    }
                }
            }
            if (item.__T_EXP__) {
                const res = recursionFlat(item.children, level + 1, item);
                result = result.concat(res);
            }
        }
        return result;
    }

    /**
     * 根据保存的展开状态，深度遍历，展平树形数据。
     * en: flatten tree data by saved expand state.
     * @param data
     * @returns
     */
    function flatTreeData(data: DT[]) {
        const result = recursionFlat(data, 0);
        isFirstLoad = false;
        return result;
    }

    /**
     * 递归设置目标节点后代到指定层级的展开/折叠状态
     * en: Recursively set expand/collapse state for descendants up to the target level
     */
    function setDescendantsToLevel(row: DT, currentLevel: number, targetLevel: number, expanded: boolean) {
        if (!row.children || currentLevel > targetLevel) return;
        for (const child of row.children) {
            setNodeExpanded(child, expanded, currentLevel, row);
            setDescendantsToLevel(child, currentLevel + 1, targetLevel, expanded);
        }
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

    return [toggleTreeNode, setTreeExpand, flatTreeData] as const;
}
