import { DEFAULT_COL_WIDTH, STK_ID_PREFIX } from '../const';
import { PrivateStkTableColumn, StkTableColumn } from '../types';

/**
 * 获取列宽
 *
 * 关于列宽的操作往往在横向滚动中使用。既然已经有横向滚动了，则列宽会被压缩至minWidth，所以优先取minWidth
 */
export function getColWidth(col: StkTableColumn<any>): number {
    const val = col.minWidth ?? col.width ?? DEFAULT_COL_WIDTH;
    if (typeof val === 'number') {
        return Math.floor(val);
    }
    return parseInt(val);
}

/** 获取计算后的宽度 */
export function getCalculatedColWidth(col: PrivateStkTableColumn<any>) {
    return  col.__WIDTH__ || DEFAULT_COL_WIDTH;
}

/** 创建组件唯一标识 */
export function createStkTableId() {
    let id = window.__STK_TB_ID_COUNT__;
    if (!id) id = 0;
    id += 1;
    window.__STK_TB_ID_COUNT__ = id;
    return STK_ID_PREFIX + id.toString(36);
}
