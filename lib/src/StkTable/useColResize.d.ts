import { ComputedRef, Ref, ShallowRef } from 'vue';
import { StkTableColumn, UniqKey } from './types';

/** 列宽拖动 */
export declare function useColResize<DT extends Record<string, any>>(props: any, emits: any, tableContainerRef: Ref<HTMLElement | undefined>, tableHeaderLast: ShallowRef<StkTableColumn<DT>[]>, colResizeIndicatorRef: Ref<HTMLElement | undefined>, colKeyGen: ComputedRef<(p: any) => UniqKey>, fixedCols: Ref<StkTableColumn<DT>[]>, onColWidthChange?: () => void): readonly [ComputedRef<((col: StkTableColumn<DT>) => boolean) | (() => any)>, Ref<boolean, boolean>, (e: MouseEvent, col: StkTableColumn<DT>, leftHandle?: boolean) => void];
