import { CSSProperties, Ref, computed } from 'vue';
import { Default_Col_Width, Is_Legacy_Mode } from './const';
import { StkTableColumn } from './types';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';

type Options = {
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
export function useFixedStyle({ tableHeaderLast, virtualScroll, virtualScrollX, virtualX_on, virtualX_offsetRight }: Options) {
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
     * @param {1|2} tagType 1-th 2-td
     * @param {StkTableColumn} col
     */
    function getFixedStyle(tagType: 1 | 2, col: StkTableColumn<any>): CSSProperties {
        const style: CSSProperties = {};
        if (Is_Legacy_Mode) {
            if (tagType === 1) {
                style.position = 'relative';
                style.top = virtualScroll.value.scrollTop + 'px';
            }
        }
        const { fixed, dataIndex } = col;
        if (fixed === 'left' || fixed === 'right') {
            const isFixedLeft = fixed === 'left';
            if (Is_Legacy_Mode) {
                /**
                 * ----------浏览器兼容--------------
                 */
                style.position = 'relative'; // 固定列方案替换为relative。原因:transform 在chrome84浏览器，列变动会导致横向滚动条计算出问题。
                if (isFixedLeft) {
                    if (virtualX_on.value) style.left = virtualScrollX.value.scrollLeft - virtualScrollX.value.offsetLeft + 'px';
                    else style.left = virtualScrollX.value.scrollLeft + 'px';
                } else {
                    // TODO:计算右侧距离
                    style.right = `${virtualX_offsetRight.value}px`;
                }
                if (tagType === 1) {
                    style.top = virtualScroll.value.scrollTop + 'px';
                    style.zIndex = isFixedLeft ? '4' : '3'; // 保证固定列高于其他单元格
                } else {
                    style.zIndex = isFixedLeft ? '3' : '2';
                }
            } else {
                /**
                 * -------------高版本浏览器----------------
                 */
                style.position = 'sticky';
                if (isFixedLeft) {
                    style.left = fixedColumnsPositionStore.value[dataIndex] + 'px';
                } else {
                    style.right = fixedColumnsPositionStore.value[dataIndex] + 'px';
                }
                if (tagType === 1) {
                    style.top = '0';
                    style.zIndex = isFixedLeft ? '4' : '3'; // 保证固定列高于其他单元格
                } else {
                    style.zIndex = isFixedLeft ? '3' : '2';
                }
            }
        }

        return style;
    }

    return {
        getFixedStyle,
    };
}
