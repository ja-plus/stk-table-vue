/**
 * 行高 Fenwick 树（树状数组）：Float64Array 存储，维护各行高度的累计和。
 * 用于变高（autoRowHeight / 展开列）模式下以 O(log n) 定位视口行范围与推导总高度，
 * 替代原先每滚动帧 O(n) 的逐行累加。
 * 支持：O(n) 建树、O(log n) 单点增量更新、O(log n) 前缀和查询、O(log n) 累计和下界查找（树上二分）。
 */
export declare class RowHeightFenwickTree {
    /** 内部 1-based 索引，bit[0] 不使用 */
    private bit;
    readonly size: number;
    /** 全部行高之和，更新时增量维护 */
    total: number;
    constructor(size: number);
    /** O(n) 顺序建树：heights[i] 为第 i 行（0-based）高度 */
    build(heights: ArrayLike<number>): void;
    /** 单点增量更新：第 index 行（0-based）高度变化 delta，O(log n) */
    add(index: number, delta: number): void;
    /** 前 count 行的累计高度（前缀和），O(log n)；count 越界时钳制到 [0, size] */
    query(count: number): number;
    /**
     * 累计和下界查找（树上二分，O(log n)）：
     * 返回首个「累计高度（含本行）≥ target」的行索引（0-based）；
     * 总高不足 target 时返回 size（不存在满足条件的行）。
     */
    findFirstPrefixGE(target: number): number;
}
