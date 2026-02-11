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
type Params = {
    props: any;
    containerRef: Ref<HTMLDivElement | undefined>;
    virtualScroll: Ref<VirtualScrollStore>;
    virtualScrollX: Ref<VirtualScrollXStore>;
};
/**
 * 自定义滚动条hooks
 * @param containerRef 滚动容器的ref
 * @param options 滚动条配置选项
 * @returns 滚动条相关状态和方法
 */
export declare function useScrollbar({ props, containerRef, virtualScroll, virtualScrollX }: Params): {
    scrollbarOptions: import('vue').ComputedRef<any>;
    scrollbar: Ref<{
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
    }>;
    showScrollbar: Ref<{
        x: boolean;
        y: boolean;
    }, {
        x: boolean;
        y: boolean;
    } | {
        x: boolean;
        y: boolean;
    }>;
    onVerticalScrollbarMouseDown: (e: MouseEvent | TouchEvent) => void;
    onHorizontalScrollbarMouseDown: (e: MouseEvent | TouchEvent) => void;
    updateCustomScrollbar: () => void;
};
export {};
