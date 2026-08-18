import { MergeCellsParam } from './types';

/** mergeCells 计算结果 */
export type MergeCellsResult = {
    colspan: number;
    rowspan: number;
};
/**
 * mergeCells 结果缓存工厂。
 *
 * - 缓存键为「绝对行索引 + 叶子列索引」，所有 mergeCells 调用处
 *   （hiddenCellMap 构建、virtual-x 可视列范围修正、视口上方占位计算、单元格渲染）共享，
 *   同一单元格只调用一次用户回调；
 * - 缓存可跨虚拟滚动帧复用（键为绝对索引，不随窗口滑动变化），
 *   稳态滚动时仅新进入窗口的行会触发回调，只需在数据/列真正变化时 clear；
 * - 条目额外保存行引用并在命中时校验同一性：即使数据被重排/替换（如排序后同一批行对象
 *   顺序变化），也不会取到错行的旧结果，缓存清理时机不再影响正确性。
 * - 注意：引用同一性校验无法感知行字段被原地修改（行引用不变）。
 *   业务原地改行且 mergeCells 结果依赖该字段时，需调用 clear() 显式失效
 *   （组件已暴露 clearMergeCellsCache 实例方法）。
 */
export declare function createMergeCellsCache(): {
    getMergeCellsResult: (row: MergeCellsParam<any>["row"], col: MergeCellsParam<any>["col"], rowIndex: number, colIndex: number) => MergeCellsResult;
    clear: () => void;
};
export type MergeCellsCache = ReturnType<typeof createMergeCellsCache>;
