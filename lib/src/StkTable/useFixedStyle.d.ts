import { ComputedRef, Ref } from 'vue';
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
export declare function useFixedStyle<DT extends Record<string, any>>(props: any, isRelativeMode: Ref<boolean>, getFixedColPosition: ComputedRef<(col: StkTableColumn<DT>) => number>, virtualScroll: Ref<VirtualScrollStore>, virtualScrollX: Ref<VirtualScrollXStore>, virtualX_on: Ref<boolean>, virtualX_offsetRight: Ref<number>): (tagType: TagType, col: StkTableColumn<DT>, depth?: number) => string;
