// Filter组件相关类型定义

import type { Ref } from 'vue';
import type StkTable from '../../StkTable.vue';
import type { StkTableColumn } from '../../types/index';

// 筛选选项接口
export interface FilterOption {
    label: string;
    value: any;
}

// 筛选状态接口
export interface FilterStatus {
    key: string; // 列key
    type: 'number' | 'string';
    value: any[]; // 筛选值
    isOpen?: boolean; // 筛选面板是否打开
    options?: FilterOption[]; // 可选项
}

// useFilter选项接口
export interface UseFilterOptions {
    onChange: (filterStatus: Ref<FilterStatus>) => void;
    filterRemote: boolean; // 是否远程筛选
    columns?: StkTableColumn<any>[]; // 表格列配置
    dataSource?: any[]; // 数据源，用于自动提取筛选选项
}

// Filter组件属性接口
export interface FilterProps {
    filterStatus: Ref<FilterStatus>;
    onChange: (filterStatus: Ref<FilterStatus>) => void;
    column: StkTableColumn<any>; // 当前列配置
    dataSource?: any[]; // 数据源
    filterOptions?: FilterOption[]; // 自定义筛选选项
}
