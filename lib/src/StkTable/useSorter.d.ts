import { Ref } from 'vue';
import { Order, SortOption, SortState, StkTableColumn, UniqKey } from './types/index';

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
export declare function useSorter<DT extends Record<string, any>>(props: any, emits: any, colKeyGen: Ref<(col: StkTableColumn<DT>) => string>, tableHeaderLast: Ref<StkTableColumn<DT>[]>, dataSourceCopy: Ref<DT[]>, initDataSource: (data?: DT[], option?: {
    forceSort?: boolean;
}) => void): readonly [Ref<{
    key?: any;
    dataIndex: import('vue').UnwrapRef<keyof DT & string>;
    sortField?: import('vue').UnwrapRef<keyof DT> | undefined;
    sortType?: "number" | "string" | undefined;
    order: Order;
}[], SortState<DT>[] | {
    key?: any;
    dataIndex: import('vue').UnwrapRef<keyof DT & string>;
    sortField?: import('vue').UnwrapRef<keyof DT> | undefined;
    sortType?: "number" | "string" | undefined;
    order: Order;
}[]>, import('vue').ComputedRef<keyof DT | undefined>, (col: StkTableColumn<DT> | undefined | null) => void, (colKey: string, order: Order, option?: {
    sortOption?: SortOption<DT>;
    force?: boolean;
    silent?: boolean;
    sort?: boolean;
    append?: boolean;
}) => DT[], () => void, () => {
    key: keyof DT | undefined;
    order: Order;
}[], () => void, (colKey: UniqKey) => SortState<DT> | undefined, (dataSource: DT[]) => DT[]];
