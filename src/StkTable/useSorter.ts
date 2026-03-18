import { computed, ref, toRaw, type Ref } from 'vue';
import { DEFAULT_SORT_CONFIG } from './const';
import type { Order, SortConfig, SortOption, SortState, StkTableColumn, UniqKey } from './types/index';
import { tableSort } from './utils/index';

/**
 * 排序切换顺序
 */
const SORT_SWITCH_ORDER: Order[] = [null, 'desc', 'asc'] as const;

/**
 * 排序 Hook
 * 管理表格排序状态和相关操作
 * @param props 表格 props
 * @param colKeyGen 列 key 生成函数
 * @param tableHeaderLast 表头最后一行（叶子节点）
 * @param dataSourceCopy 数据源副本 ref
 * @param initDataSource 初始化数据源函数
 * @param emits 事件发射函数
 * @returns 排序相关状态和方法
 */
export function useSorter<DT extends Record<string, any>>(
    props: any,
    emits: any,
    colKeyGen: Ref<(col: StkTableColumn<DT>) => string>,
    tableHeaderLast: Ref<StkTableColumn<DT>[]>,
    dataSourceCopy: Ref<DT[]>,
    initDataSource: (data?: DT[], option?: { forceSort?: boolean }) => void,
) {
    /** 多列排序状态数组 */
    const sortStates = ref<SortState<DT>[]>([]);

    /** 是否启用多列排序 */
    const isMultiSort = computed(() => props.sortConfig.multiSort ?? false);

    /** 多列排序限制 */
    const multiSortLimit = computed(() => props.sortConfig.multiSortLimit ?? 3);

    /** 对外暴露：当前排序的列 key（只读计算属性） */
    const sortCol = computed<keyof DT | undefined>(() => sortStates.value[0]?.dataIndex);

    /**
     * 获取列的排序状态
     */
    function getColumnSortState(colKey: UniqKey): SortState<DT> | undefined {
        return sortStates.value[getSortStateIndex(colKey)] as SortState<DT> | undefined;
    }

    /**
     * 获取列的排序状态索引
     */
    function getSortStateIndex(colKey: UniqKey): number {
        return sortStates.value.findIndex(s => s.key === colKey || s.dataIndex === colKey);
    }

    /**
     * 添加或更新排序状态到 sortStates
     * @param newState 新的排序状态
     * @param mode '1' - 追加模式（多列排序），0 - 替换模式（单列排序）
     */
    function addOrUpdateSortState(newState: SortState<DT>, mode?: 1 | 0) {
        const existingIndex = sortStates.value.findIndex(s => s.key === newState.key || s.dataIndex === newState.dataIndex);

        if (existingIndex >= 0) {
            // 移除已存在的相同列
            sortStates.value.splice(existingIndex, 1);
        }

        if (mode && isMultiSort.value) {
            // 多列排序模式：检查数量限制，然后添加到最前面
            if (sortStates.value.length >= multiSortLimit.value) {
                sortStates.value.pop();
            }
            sortStates.value.unshift(newState as any);
        } else {
            sortStates.value = [newState as any];
        }
    }

    /**
     * 更新排序状态（点击表头时调用）
     */
    function updateSortState(col: StkTableColumn<DT>, colKey: UniqKey): Order {
        const existingIndex = getSortStateIndex(colKey);
        let newOrder: Order;

        if (existingIndex >= 0) {
            // 已存在该列的排序，切换排序顺序
            const currentOrder = sortStates.value[existingIndex].order;
            const currentIndex = SORT_SWITCH_ORDER.indexOf(currentOrder);
            newOrder = SORT_SWITCH_ORDER[(currentIndex + 1) % 3];

            if (newOrder === null) {
                // 取消排序，从数组中移除
                sortStates.value.splice(existingIndex, 1);
            } else {
                // 更新排序顺序
                const updatedState = { ...sortStates.value[existingIndex], order: newOrder };
                addOrUpdateSortState(updatedState as any, 1);
            }
        } else {
            newOrder = SORT_SWITCH_ORDER[1];

            const newState: SortState<DT> = {
                key: colKey,
                dataIndex: col.dataIndex,
                sortField: col.sortField,
                sortType: col.sortType,
                order: newOrder,
            };

            addOrUpdateSortState(newState, 1);
        }

        return newOrder;
    }

    /**
     * 对数据源执行排序
     * tableSort 内部会根据 sortChildren 配置自动处理树形递归排序
     */
    function sortData(dataSource: DT[]): DT[] {
        if (!sortStates.value.length) return dataSource;
        
        const sortConfig = { ...DEFAULT_SORT_CONFIG, ...props.sortConfig };
        let result = dataSource.slice();

        // 从后往前排序，这样前面的排序优先级更高
        for (let i = sortStates.value.length - 1; i >= 0; i--) {
            const state = sortStates.value[i];
            const col = tableHeaderLast.value.find(c => (state.key && colKeyGen.value(c) === state.key) || c.dataIndex === state.dataIndex);
            if (col && state.order) {
                const colSortConfig = { ...sortConfig, ...col.sortConfig };
                result = tableSort(col, state.order, result, colSortConfig);
            }
        }

        return result;
    }

    /**
     * 表头点击排序
     */
    function onColumnSort(col: StkTableColumn<DT> | undefined | null) {
        if (!col) {
            console.warn('onColumnSort: not found col:', col);
            return;
        }
        if (!col.sorter) {
            // 点击表头触发的排序，如果列没有配置sorter则不处理。setSorter 触发的排序则保持通行。
            return;
        }
        const colKey = colKeyGen.value(col);

        let order = updateSortState(col, colKey);
        const sortConfig: SortConfig<DT> = { ...DEFAULT_SORT_CONFIG, ...props.sortConfig, ...col.sortConfig };

        // 处理 defaultSort（当取消排序时）
        if (!order && sortConfig.defaultSort) {
            const defaultColKey = sortConfig.defaultSort.key || sortConfig.defaultSort.dataIndex;
            if (defaultColKey) {
                const defaultCol = tableHeaderLast.value.find(item => colKeyGen.value(item) === defaultColKey);
                if (defaultCol) {
                    col = defaultCol;
                    order = sortConfig.defaultSort.order;
                    if (order) {
                        addOrUpdateSortState({
                            key: defaultColKey,
                            dataIndex: defaultCol.dataIndex,
                            sortField: defaultCol.sortField,
                            sortType: defaultCol.sortType,
                            order,
                        });
                    }
                }
            }
        }

        if (!props.sortRemote) {
            initDataSource();
        }

        emits('sort-change', col, order, toRaw(dataSourceCopy.value), sortConfig);
    }

    /**
     * 设置表头排序状态
     */
    function setSorter(
        colKey: string,
        order: Order,
        option: { sortOption?: SortOption<DT>; force?: boolean; silent?: boolean; sort?: boolean; append?: boolean } = {},
    ): DT[] {
        const newOption = { silent: true, sortOption: null, sort: true, append: false, ...option };
        const colKeyGenValue = colKeyGen.value;
        let column: StkTableColumn<DT> | undefined;

        if (order) {
            column = newOption.sortOption || tableHeaderLast.value.find(it => colKeyGenValue(it) === colKey);
            if (column) {
                const newState: SortState<DT> = {
                    key: colKey,
                    dataIndex: column.dataIndex,
                    sortField: column.sortField,
                    sortType: column.sortType,
                    order,
                };

                const mode = newOption.append && isMultiSort.value ? 1 : 0;
                addOrUpdateSortState(newState, mode);
            }
        } else {
            sortStates.value = [];
        }

        if (newOption.sort && dataSourceCopy.value?.length) {
            if (!props.sortRemote || newOption.force) {
                initDataSource(props.dataSource, { forceSort: newOption.force });
            }
        }

        if (!newOption.silent) {
            if (!column) {
                column = newOption.sortOption || tableHeaderLast.value.find(it => colKeyGenValue(it) === colKey);
            }
            if (column) {
                emits('sort-change', column, order, toRaw(dataSourceCopy.value), props.sortConfig);
            } else {
                console.warn('Can not find column by key:', colKey);
            }
        }

        return dataSourceCopy.value;
    }

    /**
     * 重置排序器
     */
    function resetSorter() {
        sortStates.value = [];
        initDataSource();
    }

    /**
     * 获取排序列信息
     */
    function getSortColumns(): { key: keyof DT | undefined; order: Order }[] {
        return sortStates.value.map(s => ({ key: s.key || s.dataIndex, order: s.order }));
    }

    /**
     * 处理默认排序
     */
    function dealDefaultSorter() {
        if (!props.sortConfig.defaultSort) return;
        const { key, dataIndex, order, silent } = { silent: false, ...props.sortConfig.defaultSort };
        setSorter((key || dataIndex) as string, order, { force: false, silent });
    }

    // 只返回需要在组件外部使用的方法和状态
    return [sortStates, sortCol, onColumnSort, setSorter, resetSorter, getSortColumns, dealDefaultSorter, getColumnSortState, sortData] as const;
}
