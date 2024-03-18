import { computed, ref, Ref, shallowRef } from 'vue';
import { StkTableColumn } from './types';

type Params<T extends Record<string, any>> = {
    props: any;
    colKeyGen: (col: StkTableColumn<T>) => string;
    tableHeaders: Ref<StkTableColumn<T>[][]>;
    tableHeaderLast: Ref<StkTableColumn<T>[]>;
    tableContainerRef: Ref<HTMLDivElement | undefined>;
};

/**
 * 固定列处理
 * @returns
 */
export function useFixedCol<DT extends Record<string, any>>({ props, colKeyGen, tableHeaders, tableHeaderLast, tableContainerRef }: Params<DT>) {
    /** 固定列阴影 */
    const fixedShadow = ref<{
        /** 是否展示左侧固定列阴影 */
        showL: boolean;
        /** 是否展示右侧固定列阴影 */
        showR: boolean;
    }>({
        showL: false,
        showR: false,
    });
    /** 保存需要出现阴影的列 */
    const fixedShadowCols = shallowRef<StkTableColumn<DT>[]>([]);

    const fixedColClassMap = computed(() => {
        const colMap = new Map();
        tableHeaders.value.forEach(cols => {
            cols.forEach(col => {
                const { showR, showL } = fixedShadow.value;
                const showShadow =
                    props.fixedColShadow &&
                    col.fixed &&
                    ((showL && col.fixed === 'left') || (showR && col.fixed === 'right')) &&
                    fixedShadowCols.value.includes(col);
                const classObj = {
                    'fixed-cell': col.fixed,
                    ['fixed-cell--' + col.fixed]: col.fixed,
                    'fixed-cell--shadow': showShadow,
                };
                colMap.set(colKeyGen(col), classObj);
            });
        });
        return colMap;
    });

    /** 处理固定列阴影 */
    function dealFixedColShadow() {
        if (!props.fixedColShadow) return;
        fixedShadowCols.value = [];
        // 找到最右边的固定列 findLast
        let lastLeftCol = null;
        for (let i = tableHeaderLast.value.length - 1; i >= 0; i--) {
            const col = tableHeaderLast.value[i];
            if (col.fixed === 'left') {
                lastLeftCol = col;
                break;
            }
        }
        // 处理多级表头列阴影
        let node: any = { __PARENT__: lastLeftCol };
        while ((node = node.__PARENT__)) {
            if (node.fixed) {
                fixedShadowCols.value.push(node);
            }
        }

        // 找到最左边的固定列
        const lastRightCol = tableHeaderLast.value.find(it => it.fixed === 'right');
        node = { __PARENT__: lastRightCol };
        while ((node = node.__PARENT__)) {
            if (node.fixed) {
                fixedShadowCols.value.push(node);
            }
        }
    }

    /** 滚动条变化时，更新需要展示阴影的列 */
    function updateFixedShadow() {
        if (!props.fixedColShadow) return;
        const { clientWidth, scrollWidth, scrollLeft } = tableContainerRef.value as HTMLDivElement;
        fixedShadow.value.showL = Boolean(scrollLeft);
        fixedShadow.value.showR = Math.abs(scrollWidth - scrollLeft - clientWidth) > 0.5;
    }

    return {
        /** 固定列class */
        fixedColClassMap,
        /** 处理固定列阴影 */
        dealFixedColShadow,
        /** 滚动条变化时，更新需要展示阴影的列 */
        updateFixedShadow,
    };
}
