import { CustomHeaderCellProps, UniqKey } from '@/StkTable/types';
import { defineComponent, getCurrentInstance, h, markRaw, ref } from 'vue';
import Filter from './Filter.vue';
import type { FilterOption, FilterStatus } from './types';

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
export function useFilter() {
    const filterStatus = ref<Record<UniqKey, FilterStatus>>({});

    function FilterComponent(config?: { options?: FilterOption[] }) {
        return markRaw(
            defineComponent({
                // eslint-disable-next-line vue/require-prop-types
                props: ['col', 'colIndex', 'options', 'filterStatus'],
                setup(props: CustomHeaderCellProps<any>) {
                    const parent = getCurrentInstance()?.parent;
                    console.log('🚀 ~ FilterComponent ~ parent:', parent);
                    return () =>
                        h(Filter, {
                            ...props,
                            filterStatus: filterStatus.value[props.col.dataIndex], // TODO ColKeyGen
                            filterOptions: config?.options || [],
                            'onUpdate:filterStatus': (value: FilterOption['value'][]) => {
                                filterStatus.value[props.col.dataIndex] = { value };
                                parent?.exposed?.setFilter(filterStatus.value);
                            },
                        });
                },
            }),
        );
    }

    return {
        Filter: FilterComponent,
        filterStatus,
    };
}
