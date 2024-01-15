import h from './h.js';
export default class DragResize {
    buttonSize = {
        width: 10,
        height: 10,
    };
    /** @type {ResizeObserver} */
    resizeObserver;
    /** @type {DOMRect} */
    targetDOMRect;
    /** @type {{left:number,top:number}} */
    resizeButtonStyle;
    /**
     *
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.el = el;
        this.initData();
        this.createResizeButton();
        this.onResize();

        this.addButtonHoverStyle();
        this.addEvent();
    }
    initData() {
        this.targetDOMRect = this.el.getBoundingClientRect();
        const { x, y, width, height } = this.targetDOMRect;
        console.log(width, height);
        this.resizeButtonStyle = new Proxy(
            {
                top: y + height - this.buttonSize.height / 2,
                left: x + width - this.buttonSize.width / 2,
            },
            {
                set: (target, key, val, receiver) => {
                    this.resizeButton.style[key] = val + 'px';
                    return Reflect.set(target, key, val, receiver);
                },
            },
        );
    }
    createResizeButton() {
        this.resizeButton = h('div', {
            style: {
                cssText: `
          width: ${this.buttonSize.width}px;
          height: ${this.buttonSize.height}px;
          border-radius: ${this.buttonSize.width / 2}px;
          background-color: #eee;
          position: absolute;
          box-shadow: 1px 1px 2px #555;
          border: 1px solid #aaa;
          box-sizing: border-box;
          top: ${this.resizeButtonStyle.top}px;
          left: ${this.resizeButtonStyle.left}px;
          opacity: 0.5;
          cursor: nw-resize;
          transition: transform ease 0.2s,box-shadow ease 0.2s,opacity ease 0.2s;
        `,
            },
        });
        document.body.appendChild(this.resizeButton);
    }
    /** 监听元素大小改变 */
    onResize() {
        this.resizeObserver = new ResizeObserver(() => {
            console.log('sdf');
            this.initData();
        });
        this.resizeObserver.observe(this.el);
    }
    addButtonHoverStyle() {
        this.resizeButton.addEventListener('mouseenter', () => {
            this.resizeButton.style.opacity = '0.9';
            this.resizeButton.style.transform = 'scale(1.2)';
            this.resizeButton.style.boxShadow = '1px 1px 4px #555';
        });
        this.resizeButton.addEventListener('mouseleave', () => {
            this.resizeButton.style.opacity = '0.5';
            this.resizeButton.style.transform = 'scale(1)';
            this.resizeButton.style.boxShadow = '1px 1px 2px #555';
        });
    }
    addEvent() {
        let startPosition = { x: 0, y: 0 };
        let isPress = false;
        this.resizeButton.addEventListener('mousedown', e => {
            e.preventDefault();
            isPress = true;
            startPosition = { x: e.x, y: e.y };
            this.resizeObserver.unobserve(this.el);
        });
        window.addEventListener('mousemove', e => {
            if (isPress) {
                const mouseDisplacement = {
                    x: e.x - startPosition.x,
                    y: e.y - startPosition.y,
                };
                const resultRect = {
                    width: this.targetDOMRect.width + mouseDisplacement.x,
                    height: this.targetDOMRect.height + mouseDisplacement.y,
                };
                this.el.style.width = resultRect.width + 'px';
                this.el.style.height = resultRect.height + 'px';

                this.resizeButtonStyle.left = this.targetDOMRect.left + resultRect.width - this.buttonSize.width / 2;
                this.resizeButtonStyle.top = this.targetDOMRect.top + resultRect.height - this.buttonSize.height / 2;
            }
        });

        window.addEventListener('mouseup', () => {
            if (isPress) {
                isPress = false;
                // this.targetDOMRect = this.el.getBoundingClientRect(); // observer后会自动调用
                this.resizeObserver.observe(this.el);
            }
        });
    }
}
