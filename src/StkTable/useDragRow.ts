export function useDragRow() {
    function onDragStart(e: DragEvent, rowIndex: number) {
        const target = e.target as HTMLElement;
        const tr = target.closest('tr');
        if (tr) {
            e.dataTransfer?.setDragImage(tr, 50, 10);
            tr.style.opacity = '0.5';
        }
        const dt = e.dataTransfer;
        if (dt) {
            dt.effectAllowed = 'move';
            dt.setData('text/plain', rowIndex.toString());
        }
    }

    function onDragOver(e: DragEvent) {
        e.preventDefault(); // 阻止默认行为，否则不会触发 drop 事件
        const target = e.target as HTMLElement;
        const tr = target.closest('tr');

        if (tr) {
            tr.style.boxShadow = 'inset 0 -2px 0 0 #1d63d9';
        }
        const dt = e.dataTransfer;
        if (dt) {
            dt.dropEffect = 'move';
        }
    }

    function onDragLeave(e: DragEvent) {
        e.preventDefault();
        const target = e.target as HTMLElement;
        if (target.classList.contains('drag-handle')) {
            const tr = target.closest('tr');
            if (tr) {
                tr.style.removeProperty('box-shadow');
            }
        }
    }

    function onDragEnd(e: DragEvent) {
        const target = e.target as HTMLElement;
        const tr = target.closest('tr');
        if (tr) {
            tr.style.opacity = '1';
        }
    }

    function onDrop(e: DragEvent, rowIndex: number) {
        const target = e.target as HTMLElement;
        const tr = target.closest('tr');
        if (tr) {
            tr.style.removeProperty('box-shadow');
        }
        const dt = e.dataTransfer;
        if (dt) {
            const sourceIndex = parseInt(dt.getData('text/plain'), 10);
            const endIndex = rowIndex;
        }
        // TODO: emit source and end index
    }
    return {
        onDragStart,
        onDragOver,
        onDrop,
        onDragLeave,
        onDragEnd,
    };
}
