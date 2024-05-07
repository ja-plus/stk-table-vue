import { Order, SortConfig, SortOption, SortState, StkTableColumn } from '../types';

/**
 * 对有序数组插入新数据
 * @param sortState
 * @param sortState.dataIndex 排序的列
 * @param sortState.order 排序顺序
 * @param sortState.sortType 排序方式
 * @param newItem 要插入的数据
 * @param targetArray 表格数据
 */
export declare function insertToOrderedArray<T extends object>(sortState: SortState<keyof T>, newItem: any, targetArray: T[], sortConfig?: SortConfig<T>): T[];
/**
 * 表格排序抽离
 * 可以在组件外部自己实现表格排序，组件配置remote，使表格不排序。
 * 使用者在@sort-change事件中自行更改table props 'dataSource'完成排序。
 * TODO: key 唯一值，排序字段相同时，根据唯一值排序。
 *
 * sortConfig.defaultSort 会在order为null时生效
 * @param sortOption 列配置
 * @param order 排序方式
 * @param dataSource 排序的数组
 */
export declare function tableSort<T extends Record<string, any>>(sortOption: SortOption<T>, order: Order, dataSource: T[], sortConfig?: SortConfig<T>): T[];
/** 表头column配置的层级 */
export declare function howDeepTheHeader(arr: StkTableColumn<any>[], level?: number): number;
/**
 * 获取列宽
 *
 * 关于列宽的操作往往在横向滚动中使用。既然已经有横向滚动了，则列宽会被压缩至minWidth，所以优先取minWidth
 */
export declare function getColWidth(col: StkTableColumn<any> | null): number;
/** 获取计算后的宽度 */
export declare function getCalculatedColWidth(col: StkTableColumn<any> | null): number;
/** number列宽+px */
export declare function transformWidthToStr(width?: string | number): string | undefined;
/** 创建组件唯一标识 */
export declare function createStkTableId(): string;
export declare function getBrowsersVersion(browserName: string): number;
