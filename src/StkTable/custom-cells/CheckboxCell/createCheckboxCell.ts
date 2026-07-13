/* eslint-disable vue/one-component-per-file */
import type { CustomCellProps } from '../../types';
import { computed, defineComponent, getCurrentInstance, h, markRaw } from 'vue';
import CheckboxVue from './CheckboxCell.vue';

/** createCheckboxCell 配置选项 */
export interface createCheckboxCellOptions<T = any> {
    /**
     * 行数据中表示选中状态的字段名
     * @default '_isChecked'
     */
    field?: string;
    /**
     * 自定义 checkbox 组件（如 Element Plus / Ant Design Vue 的 Checkbox）
     * 不传则使用原生 input[type=checkbox]
     */
    checkboxComponent?: any;
    /**
     * 单元格 checkbox 状态变更回调
     * @param checked 是否选中
     * @param row 当前行数据
     */
    onChange?: (checked: boolean, row: T) => void;
    /**
     * 全选 checkbox 状态变更回调
     * @param checked 是否全选
     */
    onSelectAll?: (checked: boolean) => void;
}

/**
 * 查找最近的 StkTable 组件实例
 */
function findStkTableInstance(curIns: any) {
    let current = curIns;
    while ((current = current.parent)) {
        if (current.type?.name === 'StkTable') {
            return current;
        }
    }
    return null;
}

/**
 * Checkbox 工厂函数
 *
 * 用于快速创建多选框单元格和表头单元格组件。
 *
 * @param options 配置选项
 * @returns 包含 CheckboxCell 和 CheckboxAllCell 组件的对象
 *
 * @example
 * ```ts
 * const { CheckboxCell, CheckboxAllCell } = createCheckboxCell({
 *   field: '_isChecked',
 *   onChange: (checked, row) => { row._isChecked = checked },
 * });
 *
 * const columns = [
 *   {
 *     dataIndex: 'checkbox',
 *     width: 50,
 *     customCell: CheckboxCell,
 *     customHeaderCell: CheckboxAllCell,
 *   },
 *   // ...other columns
 * ];
 * ```
 */
export function createCheckboxCell<T extends Record<string, any> = any>(options?: createCheckboxCellOptions<T>) {
    const field = options?.field ?? '_isChecked';
    const customComponent = options?.checkboxComponent;

    /** 单元格 Checkbox 组件 - 用于 customCell */
    function CheckboxCellComponent() {
        return markRaw(
            defineComponent({
                // eslint-disable-next-line vue/require-prop-types
                props: ['row', 'col', 'cellValue', 'rowIndex', 'colIndex', 'expanded', 'treeExpanded'],
                setup(props: CustomCellProps<any>) {
                    const isChecked = computed(() => !!props.row[field]);

                    function handleChange(checked: boolean) {
                        // eslint-disable-next-line vue/no-mutating-props
                        props.row[field] = checked;
                        options?.onChange?.(checked, props.row);
                    }

                    return () =>
                        h(CheckboxVue, {
                            checked: isChecked.value,
                            customComponent,
                            onChange: handleChange,
                        });
                },
            }),
        );
    }

    /** 表头 Checkbox 组件 - 用于 customHeaderCell（全选/半选） */
    function CheckboxAllCellComponent() {
        return markRaw(
            defineComponent({
                // eslint-disable-next-line vue/require-prop-types
                props: ['col', 'colIndex', 'rowIndex'],
                setup() {
                    const currentInstance = getCurrentInstance();
                    const stkTableInstance = findStkTableInstance(currentInstance);

                    const dataSource = computed<any[]>(() => stkTableInstance?.props?.dataSource || []);

                    const isCheckAll = computed(() => {
                        const data = dataSource.value;
                        return data.length > 0 && data.every((item: any) => !!item[field]);
                    });

                    const isIndeterminate = computed(() => {
                        const data = dataSource.value;
                        const checkedCount = data.filter((item: any) => !!item[field]).length;
                        return checkedCount > 0 && checkedCount < data.length;
                    });

                    function handleChange(checked: boolean) {
                        dataSource.value.forEach((item: any) => {
                            item[field] = checked;
                        });
                        options?.onSelectAll?.(checked);
                    }

                    return () =>
                        h(CheckboxVue, {
                            checked: isCheckAll.value,
                            indeterminate: isIndeterminate.value,
                            customComponent,
                            onChange: handleChange,
                        });
                },
            }),
        );
    }

    return {
        CheckboxCell: CheckboxCellComponent,
        CheckboxAllCell: CheckboxAllCellComponent,
    };
}
