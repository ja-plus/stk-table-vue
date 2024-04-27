import { CSSProperties, ComputedRef, Ref } from 'vue';
import { IS_LEGACY_MODE } from './const';
import { StkTableColumn, TagType } from './types';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';

type Options<T extends Record<string, any>> = {
    props: any;
    getFixedColPosition: ComputedRef<(col: StkTableColumn<T>) => number>;
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
export function useFixedStyle<DT extends Record<string, any>>({
    props,
    getFixedColPosition,
    virtualScroll,
    virtualScrollX,
    virtualX_on,
    virtualX_offsetRight,
}: Options<DT>) {
    /**
     * 固定列的style
     * @param tagType 1-th 2-td
     * @param col
     * @param depth 深度。tagType = 1时使用
     */
    function getFixedStyle(tagType: TagType, col: StkTableColumn<DT>, depth = 0): CSSProperties | null {
        const { fixed } = col;
        if (tagType === TagType.TD && !fixed) return null;

        const style: CSSProperties = {};

        /** 是否是relative模式完成固定列 */
        let isRelativeMode = true;
        if (props.cellFixedMode === 'sticky') {
            isRelativeMode = false;
        }

        if (IS_LEGACY_MODE) {
            // 低版本浏览器只能为固定列设置position: sticky
            isRelativeMode = true;
        }

        const { scrollLeft, scrollWidth, offsetLeft, containerWidth } = virtualScrollX.value;
        const scrollRight = scrollWidth - containerWidth - scrollLeft;

        if (virtualScrollX.value.scrollLeft === 0 && fixed === 'left' && tagType === TagType.TD) {
            // 滚动条在最左侧时，左侧固定列不需要，防止分层
            style.position = void 0;
        } else if (scrollRight === 0 && fixed === 'right' && tagType === TagType.TD) {
            // 滚动条在最右侧时，右侧固定列不需要，防止分层
            style.position = void 0;
        } else if (isRelativeMode) {
            style.position = 'relative';
        } else {
            style.position = 'sticky';
        }

        const isFixedLeft = fixed === 'left';
        if (tagType === TagType.TH) {
            // TH
            if (isRelativeMode) {
                style.top = virtualScroll.value.scrollTop + 'px';
            } else {
                style.top = depth * props.rowHeight + 'px';
            }
        }

        if (fixed === 'left' || fixed === 'right') {
            if (isRelativeMode) {
                if (isFixedLeft) {
                    style.left = scrollLeft - (virtualX_on.value ? offsetLeft : 0) + 'px';
                } else {
                    // fixed right
                    style.right = Math.max(scrollRight - (virtualX_on.value ? virtualX_offsetRight.value : 0), 0) + 'px';
                }
            } else {
                const lr = getFixedColPosition.value(col) + 'px';
                if (isFixedLeft) {
                    style.left = lr;
                } else {
                    style.right = lr;
                }
            }
        }

        return style;
    }

    return getFixedStyle;
}
