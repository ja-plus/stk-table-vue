import { CustomHeaderCellProps, UniqKey } from '@/StkTable/types';
import { computed, defineComponent, getCurrentInstance, h, markRaw, ref, VNode } from 'vue';
import Filter from './Filter.vue';
import type { FilterOption, FilterStatus } from './types';

/**
 * 从数据源提取筛选选项
 * @param dataSource 数据源
 * @param columnKey 列名
 * @returns 筛选选项数组
//  */
// function extractFilterOptions(dataSource: any[], columnKey: string): FilterOption[] {
//     const uniqueValues = new Set<any>();

//     // 提取唯一值
//     dataSource.forEach(row => {
//         if (row[columnKey] !== undefined && row[columnKey] !== null) {
//             uniqueValues.add(row[columnKey]);
//         }
//     });

//     return Array.from(uniqueValues).map(value => ({
//         label: String(value),
//         value,
//     }));
// }

/**
 * 查找最近的StkTable组件实例
 * @param instance 当前组件实例
 * @returns StkTable组件实例
 */
function findStkTableInstance(instance: any) {
    let current = instance;
    while ((current = current.parent)) {
        if (current.type?.name === 'StkTable') {
            return current;
        }
    }
    return null;
}

/**
 * 表格筛选功能Hook (BETA)
 * @beta
 * @returns
 */
export function useFilter() {
    const filterStatus = ref<Record<UniqKey, FilterStatus>>({});

    function FilterComponent(config?: { options?: FilterOption[] }, component?: VNode) {
        return markRaw(
            defineComponent({
                // eslint-disable-next-line vue/require-prop-types
                props: ['col', 'colIndex'],
                setup(props: CustomHeaderCellProps<any>) {
                    const colKey = props.col.dataIndex;
                    const currentInstance = getCurrentInstance();
                    const stkTableInstance = findStkTableInstance(currentInstance);
                    // 从 StkTable 实例获取 theme
                    const theme = computed(() => stkTableInstance?.props?.theme || 'light');
                    const filterNumber = computed(() => {
                        return filterStatus.value[colKey]?.value.length || 0;
                    });

                    function handleUpdateFilterStatus(value: FilterOption['value'][]) {
                        filterStatus.value[colKey] = { value };
                        // 向上查找到最近的StkTable组件实例并调用其setFilter方法
                        stkTableInstance?.exposed?.setFilter(filterStatus.value);
                    }
                    return () =>
                        h(
                            Filter,
                            {
                                ...props,
                                theme: theme.value,
                                active: filterNumber.value > 0,
                                options: config?.options || [],
                                'onUpdate:filterStatus': handleUpdateFilterStatus,
                            },
                            [component ? h(component, props) : null],
                        );
                },
            }),
        );
    }

    return {
        Filter: FilterComponent,
        filterStatus,
    };
}
