import { MergeCellsParam } from './types';

/** mergeCells 计算结果 */
export type MergeCellsResult = { colspan: number; rowspan: number };
/** 缓存条目：额外保存行引用，用于校验缓存是否仍对应当前行数据 */
type MergeCellsCacheEntry = MergeCellsResult & { row: MergeCellsParam<any>['row'] };

/** 无合并时的默认结果（只读共享，调用方均只解构读取） */
const DEFAULT_RESULT: MergeCellsResult = { colspan: 1, rowspan: 1 };

/**
 * 缓存键编码为数字：绝对行索引 * 0x10000 + 叶子列索引。
 * 相比字符串键更省内存、查询更快（列数不可能超过 0x10000）。
 */
const COL_INDEX_BASE = 0x10000;

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
export function createMergeCellsCache() {
    const cache = new Map<number, MergeCellsCacheEntry>();

    /**
     * 获取（必要时计算并缓存）mergeCells 结果
     * @param row 行数据
     * @param col 列配置
     * @param rowIndex 绝对行索引
     * @param colIndex 叶子列索引
     */
    function getMergeCellsResult(
        row: MergeCellsParam<any>['row'],
        col: MergeCellsParam<any>['col'],
        rowIndex: number,
        colIndex: number,
    ): MergeCellsResult {
        if (!col.mergeCells) return DEFAULT_RESULT;

        const cacheKey = rowIndex * COL_INDEX_BASE + colIndex;
        const cached = cache.get(cacheKey);
        if (cached && cached.row === row) return cached;

        let { colspan = 1, rowspan = 1 } = col.mergeCells({ row, col, rowIndex, colIndex }) || {};
        colspan = colspan || 1;
        rowspan = rowspan || 1;
        const entry: MergeCellsCacheEntry = { row, colspan, rowspan };
        cache.set(cacheKey, entry);
        return entry;
    }

    /** 清空缓存（数据/列变化时自动调用；行字段被原地修改时需显式调用以强制重算） */
    function clear() {
        cache.clear();
    }

    return { getMergeCellsResult, clear };
}

export type MergeCellsCache = ReturnType<typeof createMergeCellsCache>;
