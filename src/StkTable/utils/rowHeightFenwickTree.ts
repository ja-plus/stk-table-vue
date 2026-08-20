/**
 * 行高 Fenwick 树（树状数组）：Float64Array 存储，维护各行高度的累计和。
 * 用于变高（autoRowHeight / 展开列）模式下以 O(log n) 定位视口行范围与推导总高度，
 * 替代原先每滚动帧 O(n) 的逐行累加。
 * 支持：O(n) 建树、O(log n) 单点增量更新、O(log n) 前缀和查询、O(log n) 累计和下界查找（树上二分）。
 */
export class RowHeightFenwickTree {
    /** 内部 1-based 索引，bit[0] 不使用 */
    private bit: Float64Array;
    readonly size: number;
    /** 全部行高之和，更新时增量维护 */
    total = 0;

    constructor(size: number) {
        this.size = size;
        this.bit = new Float64Array(size + 1);
    }

    /** O(n) 顺序建树：heights[i] 为第 i 行（0-based）高度 */
    build(heights: ArrayLike<number>) {
        const n = this.size;
        const bit = this.bit;
        let total = 0;
        for (let i = 0; i < n; i++) {
            const h = heights[i];
            bit[i + 1] = h;
            total += h;
        }
        // Fenwick 线性建树：节点 i 累加到其父节点
        for (let i = 1; i <= n; i++) {
            const j = i + (i & -i);
            if (j <= n) bit[j] += bit[i];
        }
        this.total = total;
    }

    /** 单点增量更新：第 index 行（0-based）高度变化 delta，O(log n) */
    add(index: number, delta: number) {
        if (!delta) return;
        this.total += delta;
        const n = this.size;
        for (let i = index + 1; i <= n; i += i & -i) this.bit[i] += delta;
    }

    /** 前 count 行的累计高度（前缀和），O(log n)；count 越界时钳制到 [0, size] */
    query(count: number): number {
        const c = count > this.size ? this.size : count < 0 ? 0 : count;
        let sum = 0;
        for (let i = c; i > 0; i -= i & -i) sum += this.bit[i];
        return sum;
    }

    /**
     * 累计和下界查找（树上二分，O(log n)）：
     * 返回首个「累计高度（含本行）≥ target」的行索引（0-based）；
     * 总高不足 target 时返回 size（不存在满足条件的行）。
     */
    findFirstPrefixGE(target: number): number {
        const n = this.size;
        if (n === 0 || target <= 0) return 0;
        let idx = 0; // 已确定的「前缀和 < target」的行数
        let acc = 0;
        let step = 1;
        while (step << 1 <= n) step <<= 1; // 不超过 n 的最大 2 的幂
        for (; step > 0; step >>= 1) {
            const next = idx + step;
            if (next <= n && acc + this.bit[next] < target) {
                idx = next;
                acc += this.bit[next];
            }
        }
        return idx;
    }
}
