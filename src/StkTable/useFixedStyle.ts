import { CSSProperties, Ref, computed } from 'vue';
import { IS_LEGACY_MODE } from './const';
import { StkTableColumn, TagType } from './types';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';
import { getColWidth } from './utils';

type Options<T extends Record<string, any>> = {
    props: any;
    tableHeaders: Ref<StkTableColumn<T>[][]>;
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
                    left += getColWidth(item);
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
                    right += getColWidth(item);
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
    function getFixedStyle(tagType: TagType, col: StkTableColumn<DT>, depth = 0): CSSProperties {
        const { fixed } = col;
        const isFixedLeft = fixed === 'left';
        const style: CSSProperties = {};
        const { colKeyStore, refStore } = fixedColumnsPositionStore.value;

        if (IS_LEGACY_MODE) {
            style.position = 'relative';
        } else {
            style.position = 'sticky';
        }
        if (tagType === TagType.TH) {
            // TH
            if (IS_LEGACY_MODE) {
                style.top = virtualScroll.value.scrollTop + depth * props.rowHeight + 'px';
            } else {
                style.top = depth * props.rowHeight + 'px';
            }
            style.zIndex = isFixedLeft ? '5' : '4'; // 保证固定列高于其他单元格
        } else {
            // TD
            style.zIndex = isFixedLeft ? '3' : '2';
        }

        if (fixed === 'left' || fixed === 'right') {
            if (IS_LEGACY_MODE) {
                if (isFixedLeft) {
                    if (virtualX_on.value) style.left = virtualScrollX.value.scrollLeft - virtualScrollX.value.offsetLeft + 'px';
                    else style.left = virtualScrollX.value.scrollLeft + 'px';
                } else {
                    // TODO:计算右侧距离
                    style.right = `${virtualX_offsetRight.value}px`;
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
