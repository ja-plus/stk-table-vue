// Filter组件相关类型定义

// 筛选选项接口
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

// 筛选状态接口
export interface FilterStatus {
    value: any[]; // 筛选值
}

// useFilter选项接口
export interface UseFilterOptions {
    filterRemote: boolean; // 是否远程筛选
}

// Filter组件属性接口
export interface FilterProps {
    filterStatus?: FilterStatus;
    filterOptions?: FilterOption[]; // 自定义筛选选项
}
