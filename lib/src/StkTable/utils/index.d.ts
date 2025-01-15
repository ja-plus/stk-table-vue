import { Order, SortConfig, SortOption, SortState, StkTableColumn } from '../types';
/** 是否空值 */
export declare function isEmptyValue(val: any, isNumber?: boolean): boolean;
/**
 * 对有序数组插入新数据
 *
 * 注意：不会改变原数组，返回新数组
 * @param sortState
 * @param sortState.dataIndex 排序的字段
 * @param sortState.order 排序顺序
 * @param sortState.sortType 排序方式
 * @param newItem 要插入的数据
 * @param targetArray 表格数据
 * @return targetArray 的浅拷贝
 */
export declare function insertToOrderedArray<T extends object>(sortState: SortState<T>, newItem: T, targetArray: T[], sortConfig?: SortConfig<T>): T[];
/**
 * 二分查找
 *  @param searchArray 查找数组
 *  @param compareCallback 比较函数，返回 -1|0|1
 */
export declare function binarySearch(searchArray: any[], compareCallback: (midIndex: number) => number): number;
/**
 * 字符串比较
 * @param a
 * @param b
 * @param type 类型
 * @param isNumber 是否是数字类型
 * @param localeCompare 是否 使用Array.prototyshpe.localeCompare
 * @return {number} <0: a < b, 0: a = b, >0: a > b
 */
export declare function strCompare(a: string, b: string, isNumber: boolean, localeCompare?: boolean): number;
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
/** 多级表头深度 从0开始为一级*/
export declare function howDeepTheHeader(arr: StkTableColumn<any>[], level?: number): number;
/** number width +px */
export declare function transformWidthToStr(width?: string | number): string | undefined;
export declare function getBrowsersVersion(browserName: string): number;
