import { Ref, ShallowRef, computed, ref } from 'vue';
import { StkTableColumn } from './types';
import { Default_Col_Width, Default_Table_Height, Default_Table_Width } from './const';

type Option = {
  tableContainer: Ref<HTMLElement | undefined>;
  props: any;
  dataSourceCopy: ShallowRef<any[]>;
  tableHeaderLast: Ref<StkTableColumn<any>[]>;
};

export function useVirtualScroll({ tableContainer, props, dataSourceCopy, tableHeaderLast }: Option) {
  const virtualScroll = ref({
    containerHeight: 0,
    startIndex: 0, // 数组开始位置
    rowHeight: 28,
    offsetTop: 0, // 表格定位上边距
    scrollTop: 0, // 纵向滚动条位置，用于判断是横向滚动还是纵向
  });

  const virtualScrollX = ref({
    containerWidth: 0,
    startIndex: 0,
    endIndex: 0,
    offsetLeft: 0,
    scrollLeft: 0, // 横向滚动位置，用于判断是横向滚动还是纵向
  });

  const virtual_on = computed(() => {
    return props.virtual && dataSourceCopy.value.length > virtual_pageSize.value * 2;
  });

  const virtual_pageSize = computed(() => {
    // 这里最终+1，因为headless=true无头时，需要上下各预渲染一行。
    return Math.ceil(virtualScroll.value.containerHeight / virtualScroll.value.rowHeight) + 1;
  });

  const virtual_dataSourcePart = computed(() => {
    if (!virtual_on.value) return dataSourceCopy.value;
    return dataSourceCopy.value.slice(
      virtualScroll.value.startIndex,
      virtualScroll.value.startIndex + virtual_pageSize.value,
    );
  });

  const virtual_offsetBottom = computed(() => {
    if (!virtual_on.value) return 0;
    return (
      (dataSourceCopy.value.length - virtualScroll.value.startIndex - virtual_dataSourcePart.value.length) *
      virtualScroll.value.rowHeight
    );
  });

  const virtualX_on = computed(() => {
    return (
      props.virtualX &&
      tableHeaderLast.value.reduce((sum, col) => (sum += parseInt(col.minWidth || col.width || Default_Col_Width)), 0) >
        virtualScrollX.value.containerWidth * 1.5
    );
  });

  const virtualX_columnPart = computed(() => {
    if (virtualX_on.value) {
      // 虚拟横向滚动，固定列要一直保持存在
      const leftCols = [];
      const rightCols = [];
      // 左侧固定列，如果在左边不可见区。则需要拿出来放在前面
      for (let i = 0; i < virtualScrollX.value.startIndex; i++) {
        const col = tableHeaderLast.value[i];
        if (col.fixed === 'left') leftCols.push(col);
      }
      // 右侧固定列，如果在右边不可见区。则需要拿出来放在后面
      for (let i = virtualScrollX.value.endIndex; i < tableHeaderLast.value.length; i++) {
        const col = tableHeaderLast.value[i];
        if (col.fixed === 'right') rightCols.push(col);
      }

      const mainColumns = tableHeaderLast.value.slice(virtualScrollX.value.startIndex, virtualScrollX.value.endIndex);

      return leftCols.concat(mainColumns).concat(rightCols);
    }
    return tableHeaderLast.value;
  });

  const virtualX_offsetRight = computed(() => {
    if (!virtualX_on.value) return 0;
    let width = 0;
    for (let i = virtualScrollX.value.endIndex; i < tableHeaderLast.value.length; i++) {
      const col = tableHeaderLast.value[i];
      width += parseInt(col.width || col.maxWidth || col.minWidth || Default_Col_Width);
    }
    return width;
  });

  /**
   * 初始化Y虚拟滚动参数
   * @param {number} [height] 虚拟滚动的高度
   */
  function initVirtualScrollY(height?: number) {
    if (virtual_on.value) {
      virtualScroll.value.containerHeight =
        typeof height === 'number' ? height : tableContainer.value?.offsetHeight || Default_Table_Height;
      updateVirtualScrollY(tableContainer.value?.scrollTop);
      // const { offsetTop, containerHeight, rowHeight } = virtualScroll.value;
      // const tableAllHeight = dataSourceCopy.value.length * rowHeight;
      // const overflowHeight = tableAllHeight - containerHeight;
      // if (overflowHeight < offsetTop && overflowHeight > 0) {
      //   virtualScroll.value.offsetTop = overflowHeight;
      //   virtualScroll.value.startIndex = Math.ceil(overflowHeight / rowHeight);
      // } else if (overflowHeight <= 0) {
      //   virtualScroll.value.offsetTop = 0;
      //   virtualScroll.value.startIndex = 0;
      // }
    }
  }

  function initVirtualScrollX() {
    if (props.virtualX) {
      const { offsetWidth, scrollLeft } = tableContainer.value || {};
      // scrollTo(null, 0);
      virtualScrollX.value.containerWidth = offsetWidth || Default_Table_Width;
      updateVirtualScrollX(scrollLeft);
    }
  }

  /** 通过滚动条位置，计算虚拟滚动的参数 */
  function updateVirtualScrollY(sTop = 0) {
    const { rowHeight } = virtualScroll.value;
    const startIndex = Math.floor(sTop / rowHeight);
    Object.assign(virtualScroll.value, {
      startIndex,
      offsetTop: startIndex * rowHeight, // startIndex之前的高度
    });
  }

  /** 通过横向滚动条位置，计算横向虚拟滚动的参数 */
  function updateVirtualScrollX(sLeft = 0) {
    if (!tableHeaderLast.value?.length) return;
    let startIndex = 0;
    let offsetLeft = 0;

    let colWidthSum = 0;
    for (let colIndex = 0; colIndex < tableHeaderLast.value.length; colIndex++) {
      startIndex++;
      const col = tableHeaderLast.value[colIndex];
      // fixed left 不进入计算列宽
      if (col.fixed === 'left') continue;
      const colWidth = parseInt(col.width || col.maxWidth || col.minWidth || Default_Col_Width);
      colWidthSum += colWidth;
      // 列宽（非固定列）加到超过scrollLeft的时候，表示startIndex从上一个开始下标
      if (colWidthSum >= sLeft) {
        offsetLeft = colWidthSum - colWidth;
        startIndex--;
        break;
      }
    }
    // -----
    colWidthSum = 0;
    let endIndex = tableHeaderLast.value.length;
    for (let colIndex = startIndex; colIndex < tableHeaderLast.value.length - 1; colIndex++) {
      const col = tableHeaderLast.value[colIndex];
      colWidthSum += parseInt(col.width || col.maxWidth || col.minWidth || Default_Col_Width);
      // 列宽大于容器宽度则停止
      if (colWidthSum >= virtualScrollX.value.containerWidth) {
        endIndex = colIndex + 2; // TODO:预渲染的列数
        break;
      }
    }
    Object.assign(virtualScrollX.value, { startIndex, endIndex, offsetLeft });
  }

  return {
    virtualScroll,
    virtualScrollX,
    virtual_on,
    virtual_dataSourcePart,
    virtual_offsetBottom,
    virtualX_on,
    virtualX_columnPart,
    virtualX_offsetRight,
    initVirtualScrollY,
    initVirtualScrollX,
    updateVirtualScrollY,
    updateVirtualScrollX,
  };
}
