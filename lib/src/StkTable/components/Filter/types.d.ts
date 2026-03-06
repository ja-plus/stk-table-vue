export interface FilterOption {
    label: string;
    value: any;
    selected?: boolean;
    /**
     * TODO: 自定义筛选函数
     * @param row 行数据
     * @returns 是否匹配
     */
    matchFn?: (row: any) => boolean;
}
export interface FilterStatus {
    value: any[];
}
export interface UseFilterOptions {
    filterRemote: boolean;
}
