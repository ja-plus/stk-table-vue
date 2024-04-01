import { CSSProperties, Ref, ShallowRef, computed } from 'vue';
import { IS_LEGACY_MODE } from './const';
import { StkTableColumn, TagType } from './types';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';
import { getCalculatedColWidth } from './utils';

type Options<T extends Record<string, any>> = {
    props: any;
    tableHeaders: ShallowRef<StkTableColumn<T>[][]>;
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
    tableHeaders,
    virtualScroll,
    virtualScrollX,
    virtualX_on,
    virtualX_offsetRight,
}: Options<DT>) {
    const fixedColumnsPositionStore = computed(() => {
        /** dataIndex 作为唯一标识 */
        const colKeyStore: Record<string, number> = {};
        /** 没有dataIndex 的多级表头列，使用对象引用做标识 */
        const refStore = new WeakMap<StkTableColumn<DT>, number>();
        tableHeaders.value.forEach(cols => {
            let left = 0;
            /**遍历右侧fixed时，因为left已经遍历过一次了。所以，可以拿到right遍历边界 */
            let rightStartIndex = 0;
            for (let i = 0; i < cols.length; i++) {
                const item = cols[i];
                if (item.fixed === 'left') {
                    if (item.dataIndex) {
                        colKeyStore[item.dataIndex] = left;
                    } else {
                        refStore.set(item, left);
                    }
                    left += getCalculatedColWidth(item);
                }
                if (!rightStartIndex && item.fixed === 'right') {
                    rightStartIndex = i;
                }
            }
            let right = 0;
            for (let i = cols.length - 1; i >= rightStartIndex; i--) {
                const item = cols[i];
                if (item.fixed === 'right') {
                    if (item.dataIndex) {
                        colKeyStore[item.dataIndex] = right;
                    } else {
                        refStore.set(item, right);
                    }
                    right += getCalculatedColWidth(item);
                }
            }
        });

        return { refStore, colKeyStore };
    });

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
        const { colKeyStore, refStore } = fixedColumnsPositionStore.value;

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
            style.zIndex = isFixedLeft ? '3' : '2'; // 保证固定列高于其他单元格
        } else {
            // TD
            if (isFixedLeft) {
                style.zIndex = '2';
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
                const lr = (col.dataIndex ? colKeyStore[col.dataIndex] : refStore.get(col)) + 'px';
                if (isFixedLeft) {
                    style.left = lr;
                } else {
                    style.right = lr;
                }
            }
        }

        return style;
    }

    return {
        getFixedStyle,
    };
}
