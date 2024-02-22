import { Default_Col_Width } from './const';
import { Order, SortConfig, SortOption, SortState, StkTableColumn } from './types';

/**
 * 对有序数组插入新数据
 * @param sortState
 * @param sortState.dataIndex 排序的列
 * @param sortState.order 排序顺序
 * @param sortState.sortType 排序方式
 * @param newItem 要插入的数据
 * @param targetArray 表格数据
 */
export function insertToOrderedArray<T extends object>(sortState: SortState<keyof T>, newItem: any, targetArray: T[]) {
    const { dataIndex, order } = sortState;
    let { sortType } = sortState;
    if (!sortType) sortType = typeof newItem[dataIndex] as 'number' | 'string';
    const data = [...targetArray];
    if (!order) {
        data.unshift(newItem);
        return data;
    }
    // 二分插入
    let sIndex = 0;
    let eIndex = data.length - 1;
    const targetVal = newItem[dataIndex];
    while (sIndex <= eIndex) {
        // console.log(sIndex, eIndex);
        const midIndex = Math.floor((sIndex + eIndex) / 2);
        const midVal: any = data[midIndex][dataIndex];
        const compareRes = strCompare(midVal, targetVal, sortType);
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
 * @param  a
 * @param  b
 * @param  type 类型
 * @return {-1|0|1}
 */
function strCompare(a: string, b: string, type: 'number' | 'string'): number {
    // if (typeof a === 'number' && typeof b === 'number') type = 'number';
    if (type === 'number') {
        if (+a > +b) return 1;
        else if (+a === +b) return 0;
        else return -1;
    } else {
        return String(a).localeCompare(b);
    }
}

/**
 * 分离出空数据和非空数据成两个数组
 * @param sortOption
 * @param targetDataSource
 * @param isNumber 1 数字
 * @return [值数组,空数组]
 */
function separatedData<T extends Record<string, any>>(sortOption: SortOption<T>, targetDataSource: T[], isNumber?: boolean) {
    const emptyArr: T[] = [];
    const valueArr: T[] = [];

    for (let i = 0; i < targetDataSource.length; i++) {
        const row = targetDataSource[i];
        const sortField = sortOption.sortField || sortOption.dataIndex;
        let isEmpty = row[sortField] === null || row[sortField] === '';
        if (isNumber) {
            isEmpty ||= typeof row[sortField] === 'boolean' || Number.isNaN(+row[sortField]);
        }

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
    if (!dataSource?.length) return dataSource || [];
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

        const [valueArr, emptyArr] = separatedData(sortOption, targetDataSource, sortType === 'number');

        if (sortType === 'number') {
            // 按数字类型排序
            // 非数字当作最小值处理
            if (order === 'asc') {
                valueArr.sort((a, b) => +a[sortField] - +b[sortField]);
                targetDataSource = [...emptyArr, ...valueArr];
            } else {
                valueArr.sort((a, b) => +b[sortField] - +a[sortField]);
                targetDataSource = [...valueArr, ...emptyArr];
            }
        } else {
            // 按string 排序
            if (order === 'asc') {
                valueArr.sort((a, b) => String(a[sortField]).localeCompare(b[sortField]));
                targetDataSource = [...emptyArr, ...valueArr];
            } else {
                valueArr.sort((a, b) => String(a[sortField]).localeCompare(b[sortField]) * -1);
                targetDataSource = [...valueArr, ...emptyArr];
            }
        }

        if (sortConfig.emptyToBottom) {
            targetDataSource = [...valueArr, ...emptyArr];
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

/** 获取列宽 */
export function getColWidth(col: StkTableColumn<any> | null): number {
    if (typeof col?.width === 'number') {
        return Math.floor(col.width ?? Default_Col_Width);
    }
    return parseInt(col?.width ?? Default_Col_Width);
}
