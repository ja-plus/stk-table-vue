import { Ref } from 'vue';
import { VirtualScrollStore, VirtualScrollXStore } from './useVirtualScroll';

export type ScrollbarOptions = {
    enabled?: boolean;
    /** scroll-y width */
    width?: number;
    /** scroll-x height */
    height?: number;
    /** min scroll-y width */
    minWidth?: number;
    /** min scroll-x height */
    minHeight?: number;
};
/**
 * 自定义滚动条hooks
 * @param containerRef 滚动容器的ref
 * @param options 滚动条配置选项
 * @returns 滚动条相关状态和方法
 */
export declare function useScrollbar(props: any, containerRef: Ref<HTMLDivElement | undefined>, virtualScroll: Ref<VirtualScrollStore>, virtualScrollX: Ref<VirtualScrollXStore>, updateVirtualScrollY: (sTop?: number) => void, scrollbarOptions: Ref<Required<ScrollbarOptions>>, isExperimentalScrollY: Ref<boolean | undefined>): readonly [Ref<{
    h: number;
    w: number;
    t: number;
    l: number;
}, {
    h: number;
    w: number;
    t: number;
    l: number;
} | {
    h: number;
    w: number;
    t: number;
    l: number;
}>, Ref<{
    x: boolean;
    y: boolean;
}, {
    x: boolean;
    y: boolean;
} | {
    x: boolean;
    y: boolean;
}>, (e: MouseEvent | TouchEvent) => void, (e: MouseEvent | TouchEvent) => void, () => void];
