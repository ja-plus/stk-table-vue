import { PrivateStkTableColumn, StkTableColumn } from '../types';

/**
 * 获取列宽
 *
 * 关于列宽的操作往往在横向滚动中使用。既然已经有横向滚动了，则列宽会被压缩至minWidth，所以优先取minWidth
 */
export declare function getColWidth(col: StkTableColumn<any> | null): number;
/** 获取计算后的宽度 */
export declare function getCalculatedColWidth(col: PrivateStkTableColumn<any> | null): number;
/** 创建组件唯一标识 */
export declare function createStkTableId(): string;
