import { CSSProperties, ComputedRef, Ref } from 'vue';
import { StkTableColumn, TagType } from './types';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';

/**
 * 固定列style
 * @param props
 * @param isRelativeMode
 * @param getFixedColPosition
 * @param virtualScroll
 * @param virtualScrollX
 * @param virtualX_on
 * @param virtualX_offsetRight
 * @returns
 */
export function useFixedStyle<DT extends Record<string, any>>(
    props: any,
    isRelativeMode: Ref<boolean>,
    getFixedColPosition: ComputedRef<(col: StkTableColumn<DT>) => number>,
    virtualScroll: Ref<VirtualScrollStore>,
    virtualScrollX: Ref<VirtualScrollXStore>,
    virtualX_on: Ref<boolean>,
    virtualX_offsetRight: Ref<number>,
) {
    /**
     * 固定列的style
     * @param tagType 1-th 2-td
     * @param col
     * @param depth 深度。tagType = 1时使用
     */
    function getFixedStyle(tagType: TagType, col: StkTableColumn<DT>, depth = 0): CSSProperties | null {
        const { fixed } = col;
        if ((tagType === TagType.TD || tagType === TagType.TF) && !fixed) return null;

        const style: CSSProperties = {};
        const { headerRowHeight, rowHeight } = props;
        const isFixedLeft = fixed === 'left';
        const { scrollLeft, scrollWidth, offsetLeft, containerWidth } = virtualScrollX.value;
        const scrollRight = scrollWidth - containerWidth - scrollLeft;

        if (tagType === TagType.TH) {
            if (!isRelativeMode.value) {
                if (depth) {
                    style.top = depth * (headerRowHeight ?? rowHeight) + 'px';
                }
            } else {
                style.top = virtualScroll.value.scrollTop + 'px';
            }
        } else if (tagType === TagType.TF) {
            style.bottom = '0px';
        }

        if (fixed) {
            if (!isRelativeMode.value) {
                const lr = getFixedColPosition.value(col) + 'px';
                if (isFixedLeft) {
                    style.left = lr;
                } else {
                    style.right = lr;
                }
            } else {
                if (isFixedLeft) {
                    style.left = scrollLeft - (virtualX_on.value ? offsetLeft : 0) + 'px';
                } else {
                    style.right = Math.max(scrollRight - (virtualX_on.value ? virtualX_offsetRight.value : 0), 0) + 'px';
                }
            }
        }

        return style;
    }

    return getFixedStyle;
}
