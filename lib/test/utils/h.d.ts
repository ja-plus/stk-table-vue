/**
 * createElement function
 * h(tag[, text[,children]])
 * h(tag[, attrs[,children]])
 * h(tag[, children])
 * @param {String} tag 标签名称，支持tag#id.class emmet写法，暂支持id ,class
 * @param {Object | String | Number | Array<HTMLElement>} attrs 传Object为属性，传String为textContent，传数组为children
 * @param {Array<HTMLElement>} children
 */
export default function h(tag: string, attrs: Object | string | number | Array<HTMLElement>, children: Array<HTMLElement>): HTMLElement;
