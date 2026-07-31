import { Ref } from 'vue';

/**
 * 窗口变化自动重置虚拟滚动
 * @param tableContainerRef
 * @param onResize 容器尺寸变化后的重算逻辑（虚拟滚动、固定列等）
 * @param props
 * @param debounceMs
 */
export declare function useAutoResize(tableContainerRef: Ref<HTMLElement | undefined>, onResize: () => void, props: any, debounceMs: number): void;
