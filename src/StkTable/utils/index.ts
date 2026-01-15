import { CELL_KEY_SEPARATE, DEFAULT_SORT_CONFIG } from '../const';
import { Order, SortConfig, SortOption, SortState, StkTableColumn, UniqKey } from '../types';

/** 是否空值 */
export function isEmptyValue(val: any, isNumber?: boolean) {
    let isEmpty = val === null || val === void 0;
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
 * @param sortState.dataIndex 排序的字段
 * @param sortState.order 排序顺序
 * @param sortState.sortType 排序方式
 * @param newItem 要插入的数据
 * @param targetArray 表格数据
 * @return targetArray 的浅拷贝
 */
export function insertToOrderedArray<T extends object>(
    sortState: SortState<T>,
    newItem: T,
    targetArray: T[],
    sortConfig: SortConfig<T> & { customCompare?: (a: T, b: T) => number } = {},
) {
    const { dataIndex, sortField, order } = sortState;
    let { sortType } = sortState;
    const field = sortField || dataIndex;
    if (!sortType) sortType = typeof newItem[field] as 'number' | 'string';
    const data = targetArray.slice();

    if (!order || !data.length) {
        // 没有排序的情况，插入在最上方
        data.unshift(newItem);
        return data;
    }

    const { emptyToBottom, customCompare, stringLocaleCompare } = { emptyToBottom: false, ...sortConfig };

    const targetVal: any = newItem[field];
    if (emptyToBottom && isEmptyValue(targetVal)) {
        // 空值排在最下方
        data.push(newItem);
    } else {
        const customCompareFn =
            customCompare ||
            ((a, b) => {
                const midVal: any = a[field];
                const compareRes = strCompare(midVal, targetVal, isNumber, stringLocaleCompare);
                return order === 'asc' ? compareRes : -compareRes;
            });
        const isNumber = sortType === 'number';
        // 二分插入
        const sIndex = binarySearch(data, midIndex => {
            return customCompareFn(data[midIndex], newItem);
        });
        data.splice(sIndex, 0, newItem);
    }

    return data;
}

/**
 * 二分查找
 *  @param searchArray 查找数组
 *  @param compareCallback 比较函数，返回 -1|0|1
 */
export function binarySearch(searchArray: any[], compareCallback: (midIndex: number) => number) {
    let sIndex = 0;
    let eIndex = searchArray.length - 1;
    while (sIndex <= eIndex) {
        const midIndex = Math.floor((sIndex + eIndex) / 2);
        const compareRes = compareCallback(midIndex);
        if (compareRes === 0) {
            //midVal == targetVal
            sIndex = midIndex;
            break;
        } else if (compareRes < 0) {
            // midVal < targetVal
            sIndex = midIndex + 1;
        } else {
            //midVal > targetVal
            eIndex = midIndex - 1;
        }
    }
    return sIndex;
}
/**
 * 字符串比较
 * @param a
 * @param b
 * @param type 类型
 * @param isNumber 是否是数字类型
 * @param localeCompare 是否 使用Array.prototyshpe.localeCompare
 * @return {number} <0: a < b, 0: a = b, >0: a > b
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

    sortConfig = { ...DEFAULT_SORT_CONFIG, ...sortConfig };
    let targetDataSource = dataSource.slice();
    let sortField = sortOption.sortField || sortOption.dataIndex;
    const { defaultSort, stringLocaleCompare, emptyToBottom, sortChildren } = sortConfig;

    if (!order && defaultSort) {
        // 默认排序
        order = defaultSort.order;
        sortField = defaultSort.dataIndex;
    }

    if (typeof sortOption.sorter === 'function') {
        const customSorterData = sortOption.sorter(targetDataSource, { order, column: sortOption });
        if (customSorterData) targetDataSource = customSorterData;

        // 如果开启了子节点排序且使用了自定义排序器，递归排序children
        if (sortChildren) {
            targetDataSource.forEach(item => {
                if (!item.children?.length) return;
                (item as any).children = tableSort(sortOption, order, item.children, sortConfig);
            });
        }
    } else if (order) {
        let { sortType } = sortOption;
        if (!sortType) sortType = typeof dataSource[0][sortField] as 'number' | 'string';

        const isNumber = sortType === 'number';
        const [valueArr, emptyArr] = separatedData(sortOption, targetDataSource, isNumber);

        if (order === 'asc') {
            valueArr.sort((a, b) => strCompare(a[sortField], b[sortField], isNumber, stringLocaleCompare));
        } else {
            valueArr.sort((a, b) => strCompare(b[sortField], a[sortField], isNumber, stringLocaleCompare));
        }

        targetDataSource = order === 'desc' || emptyToBottom ? valueArr.concat(emptyArr) : emptyArr.concat(valueArr);

        // 递归排序子节点
        if (sortChildren) {
            targetDataSource.forEach(item => {
                if (!item.children?.length) return;
                (item as any).children = tableSort(sortOption, order, item.children, sortConfig);
            });
        }
    }
    return targetDataSource;
}

/** 多级表头深度 从0开始为一级*/
export function howDeepTheHeader(arr: StkTableColumn<any>[], level = 0) {
    const levels = [level];
    arr.forEach(item => {
        if (item.children?.length) {
            levels.push(howDeepTheHeader(item.children, level + 1));
        }
    });
    return Math.max(...levels);
}

/** number width +px */
export function transformWidthToStr(width?: string | number) {
    if (width === void 0) return;
    const numberWidth = Number(width);
    return width + (!Number.isNaN(numberWidth) ? 'px' : '');
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

export function pureCellKeyGen(rowKey: UniqKey, colKey: UniqKey) {
    return rowKey + CELL_KEY_SEPARATE + colKey;
}

export function getClosestTr(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const tr = target?.closest('tr');
    return tr;
}

export function getClosestTrIndex(e: MouseEvent) {
    const tr = getClosestTr(e);
    if (!tr) return;
    return Number(tr.dataset.rowIndex);
}

function getClosestTd(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const td = target?.closest('td');
    return td;
}
export function getClosestColIndex(e: MouseEvent) {
    const td = getClosestTd(e);
    if (!td) return;
    return Number(td.dataset.colIndex);
}
