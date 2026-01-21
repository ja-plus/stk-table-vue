import { Ref } from 'vue';

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
export declare function useScrollbar(containerRef: Ref<HTMLDivElement | undefined>, options?: boolean | ScrollbarOptions): {
    scrollbarOptions: {
        enabled: boolean;
        width: number;
        height: number;
        minWidth: number;
        minHeight: number;
    };
    scrollbar: Ref<{
        h: number;
        w: number;
        top: number;
        left: number;
    }, {
        h: number;
        w: number;
        top: number;
        left: number;
    } | {
        h: number;
        w: number;
        top: number;
        left: number;
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
