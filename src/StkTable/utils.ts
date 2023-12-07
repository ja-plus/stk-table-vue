import { SortOption, SortState, StkTableColumn } from './types';

/**
 * 对有序数组插入新数据
 * @param {object} sortState
 * @param {string} sortState.dataIndex 排序的列
 * @param {null|'asc'|'desc'} sortState.order 排序顺序
 * @param {'number'|'string'} [sortState.sortType] 排序方式
 * @param {object} newItem 要插入的数据
 * @param {Array} targetArray 表格数据
 */
export function insertToOrderedArray(sortState: SortState, newItem: any, targetArray: any[]) {
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
    const midVal = data[midIndex][dataIndex];
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
 * @param {string} a
 * @param {string} b
 * @param {'number'|'string'} [type] 类型
 * @return {-1|0|1}
 */
function strCompare(a: string, b: string, type: 'number' | 'string') {
  // if (typeof a === 'number' && typeof b === 'number') type = 'number';
  if (type === 'number') {
    if (+a > +b) return 1;
    if (+a === +b) return 0;
    if (+a < +b) return -1;
  } else {
    return String(a).localeCompare(b);
  }
}

/**
 * 表格排序抽离
 * 可以在组件外部自己实现表格排序，组件配置remote，使表格不排序。
 * 使用者在@sort-change事件中自行更改table props 'dataSource'完成排序。
 * TODO: key 唯一值，排序字段相同时，根据唯一值排序。
 * @param {SortOption} sortOption 列配置
 * @param {string|null} order 排序方式
 * @param {any} dataSource 排序的数组
 */
export function tableSort(sortOption: SortOption, order: string | null, dataSource: any[]) {
  let targetDataSource = [...dataSource];
  if (typeof sortOption.sorter === 'function') {
    const customSorterData = sortOption.sorter(targetDataSource, { order, column: sortOption });
    if (customSorterData) targetDataSource = customSorterData;
  } else if (order) {
    const sortField = sortOption.sortField || sortOption.dataIndex;
    let { sortType } = sortOption;
    if (!sortType) sortType = typeof dataSource[0][sortField] as 'number' | 'string';

    if (sortType === 'number') {
      // 按数字类型排序
      const nanArr: any[] = []; // 非数字
      const numArr: any[] = []; // 数字

      for (let i = 0; i < targetDataSource.length; i++) {
        const row = targetDataSource[i];
        if (
          row[sortField] === null ||
          row[sortField] === '' ||
          typeof row[sortField] === 'boolean' ||
          Number.isNaN(+row[sortField])
        ) {
          nanArr.push(row);
        } else {
          numArr.push(row);
        }
      }
      // 非数字当作最小值处理
      if (order === 'asc') {
        numArr.sort((a, b) => +a[sortField] - +b[sortField]);
        targetDataSource = [...nanArr, ...numArr];
      } else {
        numArr.sort((a, b) => +b[sortField] - +a[sortField]);
        targetDataSource = [...numArr, ...nanArr];
      }
      // targetDataSource = [...numArr, ...nanArr]; // 非数字不进入排序，一直排在最后
    } else {
      // 按string 排序
      if (order === 'asc') {
        targetDataSource.sort((a, b) => String(a[sortField]).localeCompare(b[sortField]));
      } else {
        targetDataSource.sort((a, b) => String(a[sortField]).localeCompare(b[sortField]) * -1);
      }
    }
  }
  return targetDataSource;
}

/** column 的层级 */
export function howDeepTheColumn(arr: StkTableColumn<any>[], level = 1) {
  const levels = [level];
  arr.forEach(item => {
    if (item.children?.length) {
      levels.push(howDeepTheColumn(item.children, level + 1));
    }
  });
  return Math.max(...levels);
}
