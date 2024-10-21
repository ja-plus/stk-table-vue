import { DEFAULT_COL_WIDTH, STK_ID_PREFIX } from '../const';
import { Order, PrivateStkTableColumn, SortConfig, SortOption, SortState, StkTableColumn } from '../types';

/** 是否空值 */
function isEmptyValue(val: any, isNumber?: boolean) {
    let isEmpty = val === null || val === '' || val === void 0;
    if (isNumber) {
        isEmpty = isEmpty || typeof val === 'boolean' || Number.isNaN(+val);
    }
    return isEmpty;
}

/**
 * 对有序数组插入新数据
 *
 * 注意：不会改变原数组，返回新数组
 * @param sortState
 * @param sortState.dataIndex 排序的列
 * @param sortState.order 排序顺序
 * @param sortState.sortType 排序方式
 * @param newItem 要插入的数据
 * @param targetArray 表格数据
 * @return targetArray 的浅拷贝
 */
export function insertToOrderedArray<T extends object>(sortState: SortState<T>, newItem: T, targetArray: T[], sortConfig: SortConfig<T> = {}) {
    const { dataIndex, order } = sortState;
    sortConfig = { emptyToBottom: false, ...sortConfig };
    let { sortType } = sortState;
    if (!sortType) sortType = typeof newItem[dataIndex] as 'number' | 'string';
    const isNumber = sortType === 'number';
    const data = [...targetArray];

    if (!order || !data.length) {
        // 没有排序的情况，插入在最上方
        data.unshift(newItem);
        return data;
    }

    if (sortConfig.emptyToBottom && isEmptyValue(newItem)) {
        // 空值排在最下方
        data.push(newItem);
    }

    // 二分插入
    let sIndex = 0;
    let eIndex = data.length - 1;
    const targetVal: any = newItem[dataIndex];
    while (sIndex <= eIndex) {
        // console.log(sIndex, eIndex);
        const midIndex = Math.floor((sIndex + eIndex) / 2);
        const midVal: any = data[midIndex][dataIndex];
        const compareRes = strCompare(midVal, targetVal, isNumber, sortConfig.stringLocaleCompare);
        if (compareRes === 0) {
            //midVal == targetVal
            sIndex = midIndex;
            break;
        } else if (compareRes === -1) {
            // midVal < targetVal
            if (order === 'asc') sIndex = midIndex + 1;
            else eIndex = midIndex - 1;
        } else {
            //midVal > targetVal
            if (order === 'asc') eIndex = midIndex - 1;
            else sIndex = midIndex + 1;
        }
    }
    data.splice(sIndex, 0, newItem);
    return data;
}
/**
 * 字符串比较
 * @param a
 * @param b
 * @param type 类型
 * @param isNumber 是否是数字类型
 * @param localeCompare 是否 使用Array.prototyshpe.localeCompare
 * @return {-1|0|1}
 */
export function strCompare(a: string, b: string, isNumber: boolean, localeCompare = false): number {
    let _a: number | string = a;
    let _b: number | string = b;
    if (isNumber) {
        // 是数字就转数字
        _a = +a;
        _b = +b;
    } else if (localeCompare) {
        // 字符串才可以localeCompare
        return String(a).localeCompare(b);
    }
    if (_a > _b) return 1;
    else if (_a === _b) return 0;
    else return -1;
}

/**
 * 分离出空数据和非空数据成两个数组。NaN视为空数据。
 * @param sortOption
 * @param targetDataSource
 * @param isNumber 是否数字
 * @return [值数组,空数组]
 */
function separatedData<T extends Record<string, any>>(sortOption: SortOption<T>, targetDataSource: T[], isNumber?: boolean) {
    const emptyArr: T[] = [];
    const valueArr: T[] = [];

    for (let i = 0; i < targetDataSource.length; i++) {
        const row = targetDataSource[i];
        const sortField = sortOption.sortField || sortOption.dataIndex;
        const isEmpty = isEmptyValue(row?.[sortField], isNumber); // deal row is null
        if (isEmpty) {
            emptyArr.push(row);
        } else {
            valueArr.push(row);
        }
    }
    return [valueArr, emptyArr] as const;
}

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
export function tableSort<T extends Record<string, any>>(
    sortOption: SortOption<T>,
    order: Order,
    dataSource: T[],
    sortConfig: SortConfig<T> = {},
): T[] {
    if (!dataSource?.length || !sortOption) return dataSource || [];

    sortConfig = { emptyToBottom: false, ...sortConfig };
    let targetDataSource = [...dataSource];
    let sortField = sortOption.sortField || sortOption.dataIndex;

    if (!order && sortConfig.defaultSort) {
        // 默认排序
        order = sortConfig.defaultSort.order;
        sortField = sortConfig.defaultSort.dataIndex;
    }

    if (typeof sortOption.sorter === 'function') {
        const customSorterData = sortOption.sorter(targetDataSource, { order, column: sortOption });
        if (customSorterData) targetDataSource = customSorterData;
    } else if (order) {
        let { sortType } = sortOption;
        if (!sortType) sortType = typeof dataSource[0][sortField] as 'number' | 'string';

        const isNumber = sortType === 'number';
        const [valueArr, emptyArr] = separatedData(sortOption, targetDataSource, isNumber);

        if (order === 'asc') {
            valueArr.sort((a, b) => strCompare(a[sortField], b[sortField], isNumber, sortConfig.stringLocaleCompare));
        } else {
            valueArr.sort((a, b) => strCompare(b[sortField], a[sortField], isNumber, sortConfig.stringLocaleCompare));
        }

        if (order === 'desc' || sortConfig.emptyToBottom) {
            targetDataSource = [...valueArr, ...emptyArr];
        } else {
            targetDataSource = [...emptyArr, ...valueArr];
        }
    }
    return targetDataSource;
}

/** 表头column配置的层级 */
export function howDeepTheHeader(arr: StkTableColumn<any>[], level = 1) {
    const levels = [level];
    arr.forEach(item => {
        if (item.children?.length) {
            levels.push(howDeepTheHeader(item.children, level + 1));
        }
    });
    return Math.max(...levels);
}

/**
 * 获取列宽
 *
 * 关于列宽的操作往往在横向滚动中使用。既然已经有横向滚动了，则列宽会被压缩至minWidth，所以优先取minWidth
 */
export function getColWidth(col: StkTableColumn<any> | null): number {
    const val = col?.minWidth ?? col?.width ?? DEFAULT_COL_WIDTH;
    if (typeof val === 'number') {
        return Math.floor(val);
    }
    return parseInt(val);
}

/** 获取计算后的宽度 */
export function getCalculatedColWidth(col: PrivateStkTableColumn<any> | null) {
    return col?.__WIDTH__ ?? +DEFAULT_COL_WIDTH;
}

/** number列宽+px */
export function transformWidthToStr(width?: string | number) {
    if (typeof width === 'number') {
        return width + 'px';
    }
    return width;
}

/** 创建组件唯一标识 */
export function createStkTableId() {
    let id = window.__STK_TB_ID_COUNT__;
    if (!id) id = 0;
    id += 1;
    window.__STK_TB_ID_COUNT__ = id;
    return STK_ID_PREFIX + id.toString(36);
}

export function getBrowsersVersion(browserName: string) {
    try {
        const reg = new RegExp(`${browserName}/\\d+`, 'i');
        const userAgent = navigator.userAgent.match(reg);
        if (userAgent) {
            return +userAgent[0].split('/')[1];
        }
    } catch (e) {
        console.error('Cannot get version', e);
    }
    return 100;
}
