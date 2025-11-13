import { ref, h } from 'vue';
import Filter from './Filter.vue';
import type StkTable from '../../StkTable.vue';
import type { Ref } from 'vue';
import type { FilterStatus, UseFilterOptions, FilterOption } from './types';
import { CustomCellProps, CustomHeaderCellProps, UniqKey } from '@/StkTable/types';

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
        value,
    }));
}

/**
 * 表格筛选功能Hook
 * @param stkTableRef StkTable组件实例引用
 * @param options 筛选选项
 * @returns 筛选组件和筛选状态
 */
export function useFilter(stkTableRef: Ref<InstanceType<typeof StkTable>>, options: UseFilterOptions) {
    const { filterRemote } = options;

    // 筛选状态
    const filterStatus = ref<Record<UniqKey, FilterStatus>>({});

    // 处理筛选变化
    const handleFilterChange = () => {
        if (!filterRemote && stkTableRef.value) {
            try {
                // 本地筛选逻辑
                const dataSourceTemp = stkTableRef.value.getTableData().filter(row => {
                    const status = filterStatus.value[key];
                    // 如果没有筛选值，返回所有数据
                    if (status.value.length === 0) {
                        return true;
                    }
                    // 检查当前行的字段值是否在筛选值中
                    return status.value.includes(row[status.value.key]);
                });
                // 设置筛选后的数据源
                stkTableRef.value.setDataSourceTemp(dataSourceTemp);
            } catch (error) {
                console.error('Filter error:', error);
            }
        }
    };

    // 创建筛选组件
    const FilterComponent = (config: { options?: FilterOption[] }) => {
        // 如果有数据源和列信息，自动提取筛选选项

        return (props: CustomHeaderCellProps<any>) =>
            h(Filter, {
                ...props,
                filterStatus: filterStatus.value[props.col.dataIndex], // TODO ColKeyGen
                filterOptions: config.options || [],
            });
    };

    return {
        Filter: FilterComponent,
        filterStatus,
    };
}
