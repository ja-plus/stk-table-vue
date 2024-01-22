import { Order, SortOption, SortState, StkTableColumn } from './types';
/**
 * 对有序数组插入新数据
 * @param sortState
 * @param sortState.dataIndex 排序的列
 * @param sortState.order 排序顺序
 * @param sortState.sortType 排序方式
 * @param newItem 要插入的数据
 * @param targetArray 表格数据
 */
export declare function insertToOrderedArray<T extends object>(sortState: SortState<keyof T>, newItem: any, targetArray: T[]): T[];
/**
 * 表格排序抽离
 * 可以在组件外部自己实现表格排序，组件配置remote，使表格不排序。
 * 使用者在@sort-change事件中自行更改table props 'dataSource'完成排序。
 * TODO: key 唯一值，排序字段相同时，根据唯一值排序。
 * @param sortOption 列配置
 * @param order 排序方式
 * @param dataSource 排序的数组
 */
export declare function tableSort(sortOption: SortOption, order: Order, dataSource: any[]): any[];
/** column 的层级 */
export declare function howDeepTheColumn(arr: StkTableColumn<any>[], level?: number): number;