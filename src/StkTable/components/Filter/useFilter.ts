import { ref, h } from 'vue';
import Filter from './Filter.vue';
import type StkTable from '../../StkTable.vue';
import type { Ref } from 'vue';
import type { FilterStatus, UseFilterOptions, FilterOption } from './types';

/**
 * 从数据源提取筛选选项
 * @param dataSource 数据源
 * @param columnKey 列名
 * @returns 筛选选项数组
 */
function extractFilterOptions(dataSource: any[], columnKey: string): FilterOption[] {
    const uniqueValues = new Set<any>();
    
    // 提取唯一值
    dataSource.forEach(row => {
        if (row[columnKey] !== undefined && row[columnKey] !== null) {
            uniqueValues.add(row[columnKey]);
        }
    });
    
    // 转换为选项格式
    return Array.from(uniqueValues).map(value => ({
        label: String(value),
        value: value
    }));
}

/**
 * 表格筛选功能Hook
 * @param stkTableRef StkTable组件实例引用
 * @param options 筛选选项
 * @returns 筛选组件和筛选状态
 */
export function useFilter(stkTableRef: Ref<StkTable>, options: UseFilterOptions) {
    const { onChange: userOnChange, filterRemote, columns, dataSource } = options;

    // 筛选状态
    const filterStatus = ref<FilterStatus>({
        key: '', // 列key
        type: 'string',
        value: [], // 筛选值
        isOpen: false,
        options: []
    });

    // 处理筛选变化
    const handleFilterChange = (status: Ref<FilterStatus>) => {
        if (!filterRemote && stkTableRef.value) {
            try {
                // 本地筛选逻辑
                const dataSourceTemp = stkTableRef.value.getDataSource().filter(row => {
                    // 如果没有筛选值，返回所有数据
                    if (status.value.value.length === 0) {
                        return true;
                    }
                    // 检查当前行的字段值是否在筛选值中
                    return status.value.value.includes(row[status.value.key]);
                });
                // 设置筛选后的数据源
                stkTableRef.value.setDataSourceTemp(dataSourceTemp);
            } catch (error) {
                console.error('Filter error:', error);
            }
        }

        // 调用用户自定义的筛选回调
        if (userOnChange) {
            userOnChange(status);
        }
    };

    // 创建筛选组件
    const FilterComponent = (props: any) => {
        // 如果有数据源和列信息，自动提取筛选选项
        if (props.column && props.dataSource) {
            const columnKey = props.column.dataIndex;
            const options = extractFilterOptions(props.dataSource, columnKey);
            
            // 更新筛选状态
            filterStatus.value.key = columnKey;
            filterStatus.value.options = options;
            
            // 如果有自定义筛选选项，使用自定义选项
            if (props.filterOptions) {
                filterStatus.value.options = props.filterOptions;
            }
        }

        return h(Filter, {
            ...props,
            filterStatus,
            onChange: handleFilterChange,
        });
    };

    return {
        Filter: FilterComponent,
        filterStatus,
    };
}
