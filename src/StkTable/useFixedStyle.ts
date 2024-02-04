import { CSSProperties, Ref, computed } from 'vue';
import { Default_Col_Width, Is_Legacy_Mode } from './const';
import { StkTableColumn } from './types';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';

type Options = {
    props: any;
    tableHeaderLast: Ref<StkTableColumn<any>[]>;
    virtualScroll: Ref<VirtualScrollStore>;
    virtualScrollX: Ref<VirtualScrollXStore>;
    virtualX_on: Ref<boolean>;
    virtualX_offsetRight: Ref<number>;
};
/**
 * 固定列style
 * @param param0
 * @returns
 */
export function useFixedStyle({ props, tableHeaderLast, virtualScroll, virtualScrollX, virtualX_on, virtualX_offsetRight }: Options) {
    const fixedColumnsPositionStore = computed(() => {
        const store: Record<string, number> = {};
        const cols = [...tableHeaderLast.value];
        let left = 0;
        /**遍历右侧fixed时，因为left已经遍历过一次了。所以，可以拿到right遍历边界 */
        let rightStartIndex = 0;
        for (let i = 0; i < cols.length; i++) {
            const item = cols[i];
            if (item.fixed === 'left') {
                store[item.dataIndex] = left;
                left += parseInt(item.width || Default_Col_Width);
            }
            if (!rightStartIndex && item.fixed === 'right') {
                rightStartIndex = i;
            }
        }
        let right = 0;
        for (let i = cols.length - 1; i >= rightStartIndex; i--) {
            const item = cols[i];
            if (item.fixed === 'right') {
                store[item.dataIndex] = right;
                right += parseInt(item.width || Default_Col_Width);
            }
        }

        return store;
    });
    /**
     * 固定列的style
     * @param tagType 1-th 2-td
     * @param col
     * @param depth 深度。tagType = 1时使用
     */
    function getFixedStyle(tagType: 1 | 2, col: StkTableColumn<any>, depth = 0): CSSProperties {
        const { fixed, dataIndex } = col;
        const isFixedLeft = fixed === 'left';
        const style: CSSProperties = {};
        // TD
        if (Is_Legacy_Mode) {
            style.position = 'relative';
        } else {
            style.position = 'sticky';
        }
        if (tagType === 1) {
            // TH
            if (Is_Legacy_Mode) {
                style.top = virtualScroll.value.scrollTop + depth * props.rowHeight + 'px';
            } else {
                style.top = depth * props.rowHeight + 'px';
            }
            style.zIndex = isFixedLeft ? '5' : '4'; // 保证固定列高于其他单元格
        } else {
            style.zIndex = isFixedLeft ? '3' : '2';
        }

        if (fixed === 'left' || fixed === 'right') {
            if (Is_Legacy_Mode) {
                if (isFixedLeft) {
                    if (virtualX_on.value) style.left = virtualScrollX.value.scrollLeft - virtualScrollX.value.offsetLeft + 'px';
                    else style.left = virtualScrollX.value.scrollLeft + 'px';
                } else {
                    // TODO:计算右侧距离
                    style.right = `${virtualX_offsetRight.value}px`;
                }
            } else {
                if (isFixedLeft) {
                    style.left = fixedColumnsPositionStore.value[dataIndex] + 'px';
                } else {
                    style.right = fixedColumnsPositionStore.value[dataIndex] + 'px';
                }
            }
        }

        return style;
    }

    return {
        getFixedStyle,
    };
}
