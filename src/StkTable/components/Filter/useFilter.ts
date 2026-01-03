import { CustomHeaderCellProps, UniqKey } from '@/StkTable/types';
import { computed, defineComponent, getCurrentInstance, h, markRaw, ref } from 'vue';
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

    return Array.from(uniqueValues).map(value => ({
        label: String(value),
        value,
    }));
}

/**
 * 表格筛选功能Hook
 * @param stkTableRef StkTable组件实例引用
 * @param options 筛选选项
 * @returns
 */
export function useFilter() {
    const filterStatus = ref<Record<UniqKey, FilterStatus>>({});

    function FilterComponent(config?: { options?: FilterOption[] }) {
        return markRaw(
            defineComponent({
                // eslint-disable-next-line vue/require-prop-types
                props: ['col', 'colIndex'],
                setup(props: CustomHeaderCellProps<any>) {
                    const colKey = props.col.dataIndex;
                    console.log('🚀 ~ FilterComponent ~ colKey:', colKey);
                    const parent = getCurrentInstance()?.parent;
                    const filterNumber = computed(() => {
                        return filterStatus.value[colKey]?.value.length || 0; // TODO ColKeyGen
                    });

                    function handleUpdateFilterStatus(value: FilterOption['value'][]) {
                        console.log('🚀 ~ FilterComponent ~ value:', colKey);
                        filterStatus.value[colKey] = { value };
                        parent?.exposed?.setFilter(filterStatus.value);
                    }
                    return () =>
                        h(Filter, {
                            ...props,
                            active: filterNumber.value > 0,
                            options: config?.options || [],
                            'onUpdate:filterStatus': handleUpdateFilterStatus,
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
