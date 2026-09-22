import { ShallowRef } from 'vue';
import { PrivateRowDT, RowKeyGen, TreeConfig, UniqKey } from './types';

type DT = PrivateRowDT & { children?: DT[] };

/** 懒加载进行中的 Promise 缓存（以 WeakMap 按行对象维护，对外不可见） */
const loadingPromiseMap = new WeakMap<DT, Promise<boolean>>();

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

    /** 懒加载开关：每次调用时读 props，避免非响应式变更失效 */
    function isLazy(): boolean {
        return Boolean((props.treeConfig || {}).lazy);
    }

    /**
     * 行是否可展开（唯一口径）：children 已存在，或懒加载下数据标记有子节点（hasChildField，默认 hasChildren）
     * en: Whether a row is expandable: children exist, or in lazy mode the data marks hasChildren
     */
    function isExpandable(row: DT): boolean {
        if (row.children !== undefined) return true;
        if (!isLazy()) return false;
        const { hasChildField }: TreeConfig = props.treeConfig;
        return Boolean((row as any)[hasChildField || 'hasChildren']);
    }

    /**
     * 懒加载：确保行 children 已加载。
     * 命中“未加载分支”时置 __T_LOADING__ → await loadMethod → 成功写 row.children、__T_LOADED__；
     * 失败清 __T_LOADING__、不置 __T_LOADED__（可重试）、调用 onLoadError。
     * @returns 本次调用结束时子节点是否可用（已加载或本次加载成功）
     */
    function ensureChildrenLoaded(row: DT, col: any): Promise<boolean> {
        if (!row) return Promise.resolve(false);
        // 竞态防护：加载中复用进行中的 Promise，不重复触发 loadMethod
        const pending = loadingPromiseMap.get(row);
        if (pending) return pending;
        const needLoad = isLazy() && !row.children?.length && isExpandable(row) && !row.__T_LOADED__;
        if (!needLoad) return Promise.resolve(true);
        const { loadMethod, onLoadError }: TreeConfig = props.treeConfig;
        if (!loadMethod) return Promise.resolve(false);
        row.__T_LOADING__ = true;
        const p = Promise.resolve()
            .then(() => loadMethod(row, col))
            .then(
                (children) => {
                    row.children = children || [];
                    row.__T_LOADED__ = true;
                    return true;
                },
                (error: unknown) => {
                    // 失败：不置 __T_LOADED__，下次展开可重试
                    onLoadError?.(error, row, col);
                    return false;
                }
            )
            .finally(() => {
                row.__T_LOADING__ = false;
                loadingPromiseMap.delete(row);
            });
        loadingPromiseMap.set(row, p);
        return p;
    }

    /** 懒加载下同一行的展开意图串行队列，避免快速连点时异步展平与折叠互踩 */
    const toggleQueueMap = new WeakMap<DT, Promise<void>>();

    /** click expended icon to toggle expand row */
    function toggleTreeNode(row: DT, col: any): Promise<void> {
        if (!row) return Promise.resolve();
        const wantExpand = !row.__T_EXP__;
        if (!isLazy() || !wantExpand || isChildrenReady(row)) {
            // 非懒加载/收起/子节点已就绪：保持既有同步行为（同步返回，不改变 lazy=false 行为）
            privateSetTreeExpand(row, { expand: wantExpand, col, isClick: true });
            return Promise.resolve();
        }
        // 懒加载展开未加载分支：同行意图排队串行执行，连点时最后一个意图生效；
        // 加载中重复点击复用进行中的请求，不二次触发 loadMethod
        const queue = (toggleQueueMap.get(row) || Promise.resolve()).then(() => runToggleIntent(row, col, wantExpand));
        toggleQueueMap.set(
            row,
            queue.finally(() => {
                toggleQueueMap.delete(row);
            })
        );
        return queue;
    }

    /** 队列 worker：执行单次展开意图（必要时先加载，重复点击时跳过已生效的意图） */
    async function runToggleIntent(row: DT, col: any, wantExpand: boolean) {
        if (!wantExpand) {
            // 收起意图：加载完成后行可能尚未展开（旧意图），仅在确实展开时才折叠
            if (row.__T_EXP__) {
                privateSetTreeExpand(row, { expand: false, col, isClick: true });
            }
            return;
        }
        if (row.__T_EXP__) return; // 更早的同向意图已展开，不重复执行
        const loaded = await ensureChildrenLoaded(row, col);
        if (loaded && !row.__T_EXP__) {
            privateSetTreeExpand(row, { expand: true, col, isClick: true });
        }
    }

    /** 懒加载下子节点是否已就绪（无需再发请求即可展平） */
    function isChildrenReady(row: DT): boolean {
        return !isLazy() || !isExpandable(row) || Boolean(row.children?.length) || Boolean(row.__T_LOADED__);
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

    function setTreeExpand(row: (UniqKey | DT) | (UniqKey | DT)[], option?: SetTreeExpandOption): void | Promise<void> {
        if (option?.parents) {
            // 懒加载下原始 dataSource 的 children 可能未加载，findPath 无法定位，改走逐层链式加载分支
            if (isLazy()) {
                return setTreeExpandParentsLazy(row, option);
            }
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
     * 懒加载下的 parents 模式：从根逐层 await ensureChildrenLoaded 补齐未加载祖先的 children 后定位下一层，
     * 任一祖先加载失败则在该处中断并告警。已加载部分保持展开（尽力展开）。
     * en: parents mode under lazy load: chain-load unloaded ancestors from root, abort and warn on failure.
     */
    async function setTreeExpandParentsLazy(row: (UniqKey | DT) | (UniqKey | DT)[], option: SetTreeExpandOption) {
        const rowKeyOrRow = Array.isArray(row) ? row[0] : row;
        const targetKey = typeof rowKeyOrRow === 'string' || typeof rowKeyOrRow === 'number' ? rowKeyOrRow : rowKeyGen(rowKeyOrRow);
        const expanded = option?.expand !== false;
        // path[0] 为展平数据中的根行；其余为对应父行下已加载的直接子行
        const path = await resolveLazyPath(targetKey);
        if (!path) return;
        if (expanded) {
            // 从根到目标逐级展开（祖先在展平数据中，privateSetTreeExpand 可定位）
            for (let i = 0; i < path.length - 1; i++) {
                privateSetTreeExpand(path[i], { expand: true, isClick: false });
            }
            const target = path[path.length - 1];
            // 展开时若目标行自身有未加载子节点先链式补齐；收起时仅处理父节点，目标行自身状态不变
            if (await ensureChildrenLoaded(target, null)) {
                privateSetTreeExpand(target, { expand: true, isClick: false });
            }
        } else {
            // 收起逆序处理，避免先折叠根节点导致其余节点从可见数据中移除而查找失败
            const keys = path.slice(0, -1).map(it => rowKeyGen(it)).reverse();
            if (!keys.length) return;
            privateSetTreeExpand(keys, { expand: false, isClick: false });
        }
    }

    /**
     * 懒加载下从根逐层定位目标行，返回根 → 目标路径；某层加载失败或未找到时返回 null 并告警
     */
    async function resolveLazyPath(targetKey: UniqKey): Promise<DT[] | null> {
        const roots: DT[] = dataSourceCopy.value.filter(it => !it.__T_LV__);
        const rootRow = roots.find(it => rowKeyGen(it) === targetKey);
        if (rootRow) return [rootRow];
        for (const root of roots) {
            const path = await walkLazyPath(root, [root], targetKey);
            if (path) return path;
        }
        console.warn('treeExpandRow failed.rowKey:', targetKey);
        return null;
    }

    /**
     * 在已加载/可加载的子树中逐层向下定位目标行，命中返回根 → 目标完整路径
     */
    async function walkLazyPath(parent: DT, path: DT[], targetKey: UniqKey): Promise<DT[] | null> {
        if (!(await ensureChildrenLoaded(parent, null))) {
            // 某祖先加载失败，在该处中断
            console.warn('tree lazy load failed on ancestor.rowKey:', rowKeyGen(parent));
            return null;
        }
        for (const child of parent.children || []) {
            const childKey = rowKeyGen(child);
            if (childKey === targetKey) return [...path, child];
        }
        for (const child of parent.children || []) {
            const res = await walkLazyPath(child, [...path, child], targetKey);
            if (res) return res;
        }
        return null;
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

    /**
     * 懒加载：强制重新加载指定节点的子节点并替换其现有子树。
     * 展开中则折叠旧子树后重新插入新结果；折叠中仅更新数据不强制展开。
     * en: Force reload children of a node and replace its subtree.
     */
    async function reloadTreeNode(rowKeyOrRow: UniqKey | DT): Promise<void> {
        if (!rowKeyOrRow) return;
        const rowKey = typeof rowKeyOrRow === 'string' || typeof rowKeyOrRow === 'number' ? rowKeyOrRow : rowKeyGen(rowKeyOrRow);
        const row = dataSourceCopy.value.find(it => rowKeyGen(it) === rowKey);
        if (!row) {
            console.warn('reloadTreeNode failed.rowKey:', rowKey);
            return;
        }
        // 清除缓存与加载态，使 ensureChildrenLoaded 必定重新请求
        row.__T_LOADED__ = false;
        row.__T_LOADING__ = false;
        loadingPromiseMap.delete(row);
        row.children = void 0;

        const index = dataSourceCopy.value.indexOf(row);
        const level = row.__T_LV__ || 0;
        const wasExpanded = Boolean(row.__T_EXP__);
        if (wasExpanded) {
            // 先移除旧子树展平行，避免新数据重复插入
            const tempData = dataSourceCopy.value.slice();
            const deleteCount = foldNode(index, tempData, level);
            tempData.splice(index + 1, deleteCount);
            dataSourceCopy.value = tempData;
            onDataSourceChange();
        }
        if (!(await ensureChildrenLoaded(row, null))) return;
        if (wasExpanded) {
            // 展开中：走既有展平链路把新子树插回
            privateSetTreeExpand(row, { expand: true, isClick: false });
        } else {
            // 折叠中：仅重渲染更新子树数据，不强制展开
            onDataSourceChange();
        }
    }

    return [toggleTreeNode, setTreeExpand, flatTreeData, isExpandable, reloadTreeNode] as const;
}
