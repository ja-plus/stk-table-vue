// Filter组件相关类型定义

// 筛选选项接口
export interface FilterOption {
    label: string;
    value: any;
    selected?: boolean;
}

// 筛选状态接口
export interface FilterStatus {
    value: FilterOption['value'][];
}

// useFilter选项接口
export interface UseFilterOptions {
    filterRemote: boolean; // 是否远程筛选
}
