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
     * 树形数据（children）下开启勾选级联：勾选父行会递归勾选/取消全部子孙行；
     * 父行勾选态由子孙推导（全部子孙勾选才视为勾选，部分勾选时父行显示半选态）；
     * 表头全选/半选按叶子行（无 children 的行）统计，父行不重复计数。
     * 关闭时各行勾选状态相互独立（默认，向后兼容）。
     * en: Enable checkbox cascade for tree data (children): checking a parent cascades to all
     * descendants, parent state is derived from children (indeterminate when partially checked),
     * and the header counts leaf rows only. Default false keeps row states independent.
     * @default false
     */
    cascade?: boolean;
    /**
     * 单元格 checkbox 状态变更回调
     * @param checked 是否选中
     * @param row 当前行数据（cascade 模式下为用户实际点击的行，级联写入的行不单独回调）
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
    const cascade = Boolean(options?.cascade);

    // ------- cascade 级联工具（树形父子联动，单元格与表头组件共用） -------

    /** 级联写：递归写入行及其全部子孙行的勾选状态 */
    function setCascadeChecked(row: any, checked: boolean) {
        row[field] = checked;
        if (row.children?.length) {
            row.children.forEach((child: any) => setCascadeChecked(child, checked));
        }
    }

    /** 级联读：子孙中是否存在勾选行（短路 DFS，父行半选判定用） */
    function hasCheckedDescendant(row: any): boolean {
        if (!row.children?.length) return false;
        for (const child of row.children) {
            if (child[field] || hasCheckedDescendant(child)) return true;
        }
        return false;
    }

    /** 级联定位：在原始树中查找 row 的祖先链（根 → 父，不含 row 自身），不在树中返回 null */
    function findAncestorChain(roots: any[], row: any): any[] | null {
        for (const item of roots) {
            if (item === row) return [];
            if (item.children?.length) {
                const chain = findAncestorChain(item.children, row);
                if (chain) {
                    chain.unshift(item);
                    return chain;
                }
            }
        }
        return null;
    }

    /**
     * 级联推导：自底向上重算祖先链勾选态。
     * 不变量：父行 field=true ⇔ 全部子孙 field=true。
     * 链为「根 → 父」顺序，倒序遍历即从最近祖先向根传播。
     */
    function recalcAncestors(chain: any[]) {
        for (let i = chain.length - 1; i >= 0; i--) {
            const node = chain[i];
            if (node.children?.length) {
                node[field] = node.children.every((child: any) => !!child[field]);
            }
        }
    }

    /** 级联统计：遍历叶子行（无 children 的行；懒加载未加载的行天然按叶子计） */
    function walkLeaves(data: any[], fn: (leaf: any) => void) {
        for (const item of data) {
            if (item.children?.length) {
                walkLeaves(item.children, fn);
            } else {
                fn(item);
            }
        }
    }

    /** 单元格 Checkbox 组件 - 用于 customCell */
    function CheckboxCellComponent() {
        return markRaw(
            defineComponent({
                // eslint-disable-next-line vue/require-prop-types
                props: ['row', 'col', 'cellValue', 'rowIndex', 'colIndex', 'expanded', 'treeExpanded'],
                setup(props: CustomCellProps<any>) {
                    // cascade 下勾选后需从原始树重算祖先推导态，须拿到 StkTable 实例的 dataSource
                    const stkTableInstance = cascade ? findStkTableInstance(getCurrentInstance()) : null;

                    const isChecked = computed(() => !!props.row[field]);

                    /** cascade 下父行半选：未全勾但子孙中存在勾选（短路 DFS） */
                    const isIndeterminate = computed(() => {
                        if (!cascade || !props.row.children?.length) return false;
                        return !isChecked.value && hasCheckedDescendant(props.row);
                    });

                    function handleChange(checked: boolean) {
                        if (cascade) {
                            // 级联写：本行与全部子孙写入同一状态，再自底向上重算祖先推导态
                            setCascadeChecked(props.row, checked);
                            const roots = stkTableInstance?.props?.dataSource || [];
                            const chain = findAncestorChain(roots, props.row);
                            if (chain) recalcAncestors(chain);
                        } else {
                            // eslint-disable-next-line vue/no-mutating-props
                            props.row[field] = checked;
                        }
                        options?.onChange?.(checked, props.row);
                    }

                    return () =>
                        h(CheckboxVue, {
                            checked: isChecked.value,
                            indeterminate: isIndeterminate.value,
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

                    /**
                     * 勾选统计。cascade 下按叶子行统计（父行勾选态由子孙推导，不重复计数；
                     * 懒加载未加载的行无 children，天然按叶子计）；关闭时沿用顶层行口径（向后兼容）。
                     */
                    const stats = computed(() => {
                        const data = dataSource.value;
                        if (!cascade) {
                            return { total: data.length, checked: data.filter((item: any) => !!item[field]).length };
                        }
                        let total = 0;
                        let checked = 0;
                        walkLeaves(data, leaf => {
                            total++;
                            if (leaf[field]) checked++;
                        });
                        return { total, checked };
                    });

                    const isCheckAll = computed(() => stats.value.total > 0 && stats.value.checked === stats.value.total);

                    const isIndeterminate = computed(() => stats.value.checked > 0 && stats.value.checked < stats.value.total);

                    function handleChange(checked: boolean) {
                        const data = dataSource.value;
                        if (cascade) {
                            // 全选/取消全选递归写全树（含父行，维持推导不变量）
                            data.forEach((item: any) => setCascadeChecked(item, checked));
                        } else {
                            data.forEach((item: any) => {
                                item[field] = checked;
                            });
                        }
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
