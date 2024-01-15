export default class DragResize {
    /**
     *
     * @param {HTMLElement} el
     */
    constructor(el: HTMLElement);
    buttonSize: {
        width: number;
        height: number;
    };
    /** @type {ResizeObserver} */
    resizeObserver: ResizeObserver;
    /** @type {DOMRect} */
    targetDOMRect: DOMRect;
    /** @type {{left:number,top:number}} */
    resizeButtonStyle: {
        left: number;
        top: number;
    };
    el: HTMLElement;
    initData(): void;
    createResizeButton(): void;
    resizeButton: HTMLElement | undefined;
    /** 监听元素大小改变 */
    onResize(): void;
    addButtonHoverStyle(): void;
    addEvent(): void;
}
