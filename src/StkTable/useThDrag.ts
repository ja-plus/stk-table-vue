type Params = {
  emit: any;
};
/**
 * 列顺序拖动
 * @param param0
 * @returns
 */
export function useThDrag({ emit }: Params) {
  let dragStartKey: string | undefined = void 0;

  /** 开始拖动记录th位置 */
  function onThDragStart(e: MouseEvent) {
    // const i = Array.prototype.indexOf.call(e.target.parentNode.children, e.target); // 得到是第几个子元素
    dragStartKey = (e.target as HTMLElement).dataset.colKey;
    emit('th-drag-start', dragStartKey);
  }

  function onThDragOver(e: MouseEvent) {
    e.preventDefault();
  }

  /** th拖动释放时 */
  function onThDrop(e: MouseEvent) {
    let th = e.target as HTMLElement;
    // 找到th元素
    while (th) {
      if (th.tagName === 'TH') break;
      th = th.parentNode as HTMLElement;
    }
    // const i = Array.prototype.indexOf.call(th.parentNode.children, th); // 得到是第几个子元素
    if (dragStartKey !== th.dataset.colKey) {
      emit('col-order-change', dragStartKey, th.dataset.colKey);
    }
    emit('th-drop', th.dataset.colKey);
  }

  return {
    onThDragStart,
    onThDragOver,
    onThDrop,
  };
}
