import { ComputedRef, Ref, computed, ref, ShallowRef, watch } from 'vue';
import { MergeCellsCache } from './mergeCellsCache';
import { ColKeyGen, MergeCellsParam, PrivateRowDT, PrivateStkTableColumn, RowActiveOption, RowKeyGen, UniqKey } from './types';
import { pureCellKeyGen } from './utils';
import type { VirtualScrollStore } from './useVirtualScroll';

/** Above-viewport cell descriptor: real column or placeholder colspan */
type AboveViewportCell = PrivateStkTableColumn<PrivateRowDT> | { __VT_PH__: number };

/** 视口上方占位单元格（共享常量；模板仅读取 __VT_PH__ 属性、key 使用列下标，可安全复用同一对象） */
const ABOVE_VIEWPORT_PH: AboveViewportCell = { __VT_PH__: 1 };

export function useMergeCells(
    rowActiveProp: Ref<RowActiveOption<any>>,
    tableHeaderLast: ShallowRef<PrivateStkTableColumn<PrivateRowDT>[]>,
    rowKeyGen: RowKeyGen,
    colKeyGen: ColKeyGen,
    virtual_dataSourcePart: ShallowRef<any[]>,
    virtualScroll: Ref<VirtualScrollStore>,
    /** 视口行渲染使用的列列表（virtual-x 时为可视列子集，否则即 tableHeaderLast） */
    virtualX_columnPart: ComputedRef<PrivateStkTableColumn<PrivateRowDT>[]>,
    /** 全量数据（仅用于缓存失效判定） */
    dataSourceCopy: ShallowRef<any[]>,
    /** mergeCells 结果共享缓存（与 useVirtualScroll 共用，可跨滚动帧复用） */
    mergeCellsCache: MergeCellsCache,
    /** 是否允许把连续空行合并为占位 tr（virtual && !autoRowHeight） */
    canMergeEmptyRows: Ref<boolean>,
    /** 视口下方合并为占位 tr 的行数（渲染 rowspan 属性修正用） */
    belowViewportRowCount: Ref<number>,
) {
    /**
     * which cell need be hidden
     * - key: rowKey
     * - value: colKey Set
     */
    const hiddenCellMap = ref<Record<UniqKey, Set<UniqKey>> | null>(null);
    /**
     * hover other row and rowspan cell should be highlighted
     * - key: rowKey
     * - value: cellKey Set
     */
    const hoverRowMap = ref<Record<UniqKey, Set<string>>>({});

    /** hover current row , which rowspan cells should be highlight */
    const hoverMergedCells = ref(new Set<string>());
    /** click current row , which rowspan cells should be highlight */
    const activeMergedCells = ref(new Set<string>());

    /** column index cache */
    let colIndexCache: Map<UniqKey, number> | null = null;

    /**
     * 数据/列真正变化时才清空 mergeCells 结果缓存。
     * 缓存键为绝对索引且命中时校验行引用同一性，滚动换窗（virtual_dataSourcePart 变化）
     * 无需清缓存——相邻帧高度重叠，复用缓存可避免对同一单元格重复调用用户回调。
     * 行字段被原地修改（引用不变）时不会触发本 watch，需由外部调用暴露的
     * clearMergeCellsCache 实例方法显式失效缓存并重算。
     */
    watch([dataSourceCopy, tableHeaderLast], () => {
        mergeCellsCache.clear();
        colIndexCache = null;
    });

    watch([virtual_dataSourcePart, tableHeaderLast], () => {
        buildHiddenCellMap();
    });

    /** 是否存在合并列（仅依赖列配置，跨滚动帧缓存，不随数据/滚动重算） */
    const hasMergeColumn = computed(() => tableHeaderLast.value.some(col => !!col.mergeCells));

    /**
     * Pre-build hiddenCellMap and hoverRowMap before rendering to avoid
     * a two-render cycle (null → populated) that causes visual flicker.
     *
     * Previously, the watch set hiddenCellMap.value = null, and the map was
     * rebuilt during rendering by mergeCellsWrapper → hideCells. This meant
     * the first render after scroll had no hidden cells (all visible), and
     * a second render was needed to apply merges — causing flicker/jumping.
     */
    function buildHiddenCellMap() {
        /**
         * 无合并列快速通道：mergeCells 是可选特性，多数表格没有合并单元格，
         * 不应为此空转「窗口行数 × 列数」的扫描和每帧的 ref 重赋值。
         * 仅在「有 → 无」切换时重置一次（清掉残留的隐藏/高亮状态），之后滚动帧直接返回。
         */
        if (!hasMergeColumn.value) {
            if (hiddenCellMap.value) {
                hiddenCellMap.value = null;
                hoverRowMap.value = {};
            }
            return;
        }

        hiddenCellMap.value = {};
        hoverRowMap.value = {};

        const data = virtual_dataSourcePart.value;
        /**
         * 只遍历实际渲染的列：virtual-x 模式下即视列子集 + 固定列，
         * 非 virtual-x 时即 tableHeaderLast。
         * hiddenCellMap/hoverRowMap 只会被渲染出来的 td 消费（shouldHideCell、hover 高亮），
         * 未渲染列的合并无需计算；colspan 锚点列已被可视列范围修正保证包含在列表内。
         */
        const columns = virtualX_columnPart.value;
        /**
         * mergeCells 入参与缓存键统一使用绝对行索引（不随虚拟窗口滑动变化）。
         * 此前这里使用切片内相对索引，而 aboveViewportColumnMap 使用绝对索引，
         * 二者共用 mergeCellsCache 时会发生键冲突，导致取到错误行的合并结果
         * （表现为滚动时视口上方合并单元格锚点丢失/闪烁）。
         */
        const baseRowIndex = virtualScroll.value.startIndex;

        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
            const row = data[rowIndex];
            if (!row) continue;

            const absRowIndex = baseRowIndex + rowIndex;
            for (let colIdx = 0; colIdx < columns.length; colIdx++) {
                const col = columns[colIdx];
                if (!col.mergeCells) continue;

                // 叶子列索引：与 mergeCellsWrapper / aboveViewportColumnMap / buildColMergeRange 的缓存键一致
                const leafIndex = col.__LF_S__ ?? colIdx;
                const { colspan, rowspan } = mergeCellsCache.getMergeCellsResult(row, col, absRowIndex, leafIndex);
                if (colspan === 1 && rowspan === 1) continue;

                const rowKey = rowKeyGen(row);
                const colKey = colKeyGen.value(col);
                const mergedCellKey = pureCellKeyGen(rowKey, colKey);

                for (let i = rowIndex; i < rowIndex + rowspan; i++) {
                    const targetRow = data[i];
                    if (!targetRow) break;
                    hideCells(rowKeyGen(targetRow), colKey, colspan, i === rowIndex, mergedCellKey);
                }
            }
        }
    }

    /**
     * abstract the logic of hiding cells
     */
    function hideCells(rowKey: UniqKey, colKey: UniqKey, colspan: number, isSelfRow = false, mergeCellKey: string) {
        const headers = tableHeaderLast.value;
        const colKeyGenValue = colKeyGen.value;

        // use columns cache to avoid repeat findIndex
        let startIndex = colIndexCache?.get(colKey);
        if (startIndex === void 0) {
            startIndex = headers.findIndex(item => colKeyGenValue(item) === colKey);
            if (startIndex < 0) return;

            if (!colIndexCache) colIndexCache = new Map();
            colIndexCache.set(colKey, startIndex);
        }

        // Initialize maps if needed
        if (!hoverRowMap.value[rowKey]) {
            hoverRowMap.value[rowKey] = new Set();
        }
        if (!hiddenCellMap.value) {
            hiddenCellMap.value = {};
        }
        if (!hiddenCellMap.value[rowKey]) {
            hiddenCellMap.value[rowKey] = new Set();
        }

        const hoverSet = hoverRowMap.value[rowKey];
        const hiddenSet = hiddenCellMap.value[rowKey];
        const endIndex = Math.min(startIndex + colspan, headers.length);

        for (let i = startIndex; i < endIndex; i++) {
            hoverSet.add(mergeCellKey);

            if (isSelfRow && i === startIndex) {
                // self row start cell does not need to be hidden
                continue;
            }

            const nextCol = headers[i];
            if (!nextCol) break;

            const nextColKey = colKeyGenValue(nextCol);
            hiddenSet.add(nextColKey);
        }
    }

    /**
     * calculate colspan and rowspan
     * @param row
     * @param col
     * @param rowIndex
     * @param colIndex
     * @returns
     */
    function mergeCellsWrapper(
        row: MergeCellsParam<any>['row'],
        col: MergeCellsParam<any>['col'],
        rowIndex: MergeCellsParam<any>['rowIndex'],
        colIndex: MergeCellsParam<any>['colIndex'],
    ): { colspan?: number; rowspan?: number } | undefined {
        if (!col.mergeCells) return;

        // 渲染传入的是切片内相对索引，统一换算为绝对行索引后再调用 mergeCells，
        // 保证与 buildHiddenCellMap / aboveViewportColumnMap 的入参及缓存键一致
        const absRowIndex = virtualScroll.value.startIndex + rowIndex;
        const { colspan, rowspan } = mergeCellsCache.getMergeCellsResult(row, col, absRowIndex, colIndex);

        if (colspan === 1 && rowspan === 1) return;

        const rowKey = rowKeyGen(row);
        const colKey = colKeyGen.value(col);
        const mergedCellKey = pureCellKeyGen(rowKey, colKey);

        for (let i = rowIndex; i < rowIndex + rowspan; i++) {
            const targetRow = virtual_dataSourcePart.value[i];
            if (!targetRow) break;
            hideCells(rowKeyGen(targetRow), colKey, colspan, i === rowIndex, mergedCellKey);
        }

        return { colspan, rowspan: adjustRowspanForMergedRows(absRowIndex, rowspan) };
    }

    /**
     * 渲染用 rowspan 修正：合并占位 tr 代表 N 个逻辑行，但在 DOM 中只算 1 行，
     * 跨越它们的 rowspan 必须相应减少计数，否则浏览器会让单元格多跨 tr，
     * 挤入后续未合并的行（上方区域表现为视口内错位，下方区域表现为吞掉 offsetBottom 占位）。
     *
     * - 上方合并段：位于锚点行之后、视口顶部之前。must-render 的 rowspan 必然延伸到视口，
     *   因此锚点之后的每个段都完整位于该 span 的行范围内，每段扣减 (count - 1)。
     * - 下方合并段：span 越过 viewportEndIndex 时，下方区域按跨界 rowspan 的结束行切分为
     *   多个占位段（belowPhSegments），coveredRows 个逻辑行折叠为 segIdx 个占位 tr，
     *   扣减 (coveredRows - segIdx)，使单元格恰好止于包含其逻辑结束行的段边界。
     *
     * hiddenCellMap 等逻辑仍使用未修正的逻辑 rowspan，仅渲染属性需要修正。
     */
    function adjustRowspanForMergedRows(absRowIndex: number, rowspan: number): number {
        if (rowspan <= 1) return rowspan;
        let adjusted = rowspan;
        const spanEnd = absRowIndex + rowspan - 1;

        const blocks = aboveEmptyBlocks.value;
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (block.start > absRowIndex && block.start <= spanEnd) {
                adjusted -= block.count - 1;
            }
        }

        const belowCount = belowViewportRowCount.value;
        const { viewportEndIndex } = virtualScroll.value;
        if (belowCount > 0 && spanEnd > viewportEndIndex) {
            // 下方区域末端与 belowPhSegments 保持一致（钳制到窗口最后一行）
            const regionEnd = viewportEndIndex + belowCount;
            const coveredRows = Math.min(spanEnd, regionEnd) - viewportEndIndex;
            adjusted -= coveredRows - getBelowSegmentIndex(spanEnd);
        }

        return adjusted > 0 ? adjusted : 1;
    }

    /**
     * spanEnd 落在下方区域第几个占位段（1 基）。
     * 各段按跨界 rowspan 的去重结束行切分，单元格止于包含其逻辑结束行的段，
     * 不同结束行的单元格因此止于不同的 tr，底边位置跨滚动帧保持稳定。
     */
    function getBelowSegmentIndex(spanEnd: number): number {
        const { viewportEndIndex } = virtualScroll.value;
        const segments = belowPhSegments.value;
        let acc = viewportEndIndex;
        for (let i = 0; i < segments.length; i++) {
            acc += segments[i].count;
            if (spanEnd <= acc) return i + 1;
        }
        return segments.length || 1;
    }

    const emptySet = new Set<string>();
    function updateHoverMergedCells(rowKey: UniqKey | undefined) {
        hoverMergedCells.value = rowKey === void 0 ? emptySet : hoverRowMap.value[rowKey] || emptySet;
    }

    /**
     * For rows above the viewport (startIndex .. viewportStartIndex-1), compute a modified
     * column list where non-must-render cells are replaced with placeholder entries.
     *
     * A cell is "must-render" if its rowspan crosses into the viewport:
     *   absRowIndex + rowspan > viewportStartIndex
     *
     * This computed reuses the shared mergeCellsCache so mergeCells callbacks are not called
     * twice for the same cell.
     */
    const aboveViewportColumnMap = computed(() => {
        const map = new Map<UniqKey, AboveViewportCell[]>();
        // autoRowHeight 时不允许剔除 td（行高靠内容撑开，见 StkTable getBodyColumns），直接返回空表
        if (!canMergeEmptyRows.value) return map;
        const data = virtual_dataSourcePart.value;
        const { startIndex, viewportStartIndex } = virtualScroll.value;
        const aboveCount = viewportStartIndex - startIndex;
        if (aboveCount <= 0 || !data.length) return map;

        /**
         * 与视口行使用完全相同的列列表（virtual-x 模式下为可视列子集 + 固定列 + spacer，
         * 非 virtual-x 时即 tableHeaderLast），保证视口上方行与视口行的列位置对齐。
         */
        const columns = virtualX_columnPart.value;
        /** Coverage grid: rowOffset -> Set of leafColIdx covered by rowspan from earlier rows */
        const coverage = new Map<number, Set<number>>();

        for (let rowOffset = 0; rowOffset < aboveCount; rowOffset++) {
            const absRowIndex = startIndex + rowOffset;
            const row = data[rowOffset];
            if (!row) continue;

            const rowCols: AboveViewportCell[] = [];
            let hasMustRender = false;

            for (let i = 0; i < columns.length; i++) {
                const col = columns[i];

                // virtual-x spacer 标记原样保留，保持与视口行一致的对齐结构
                if (col.__VT_C_SP__) {
                    rowCols.push(col);
                    continue;
                }

                // 叶子列索引：缓存键与 coverage 均使用叶子索引，与其他 mergeCells 调用处一致
                const leafIndex = col.__LF_S__ ?? i;

                // Skip positions covered by rowspan from earlier rows
                if (coverage.get(rowOffset)?.has(leafIndex)) {
                    continue;
                }

                const { rowspan, colspan } = mergeCellsCache.getMergeCellsResult(row, col, absRowIndex, leafIndex);

                // Check if this cell must be rendered (rowspan crosses into viewport)
                const mustRender = absRowIndex + rowspan > viewportStartIndex;

                /**
                 * 仅当合并单元格自身真实渲染（跨入视口）时，才标记其对下方行的覆盖。
                 * 未跨入视口的 rowspan 不会渲染（锚点行被占位/空行替代），被其覆盖的位置
                 * 实际上没有单元格占用，下方行必须保留自己的占位，否则后续单元格会整体错位。
                 */
                if (mustRender && rowspan > 1) {
                    for (let r = 1; r < rowspan; r++) {
                        const futureOffset = rowOffset + r;
                        if (futureOffset >= aboveCount) break;
                        if (!coverage.has(futureOffset)) coverage.set(futureOffset, new Set());
                        for (let c = 0; c < colspan; c++) {
                            coverage.get(futureOffset)!.add(leafIndex + c);
                        }
                    }
                }

                if (mustRender) {
                    rowCols.push(col);
                    hasMustRender = true;
                } else {
                    /**
                     * 占位逐列单独生成（colspan=1），不把多列合并成一个占位 td：
                     * 被占位的列状态并不相同——有的列是普通单元格，有的列是从上方 rowspan
                     * 继承的覆盖位。合并占位会破坏与视口行一致的“每列一个单元格”结构，
                     * 导致表格 auto layout 下列宽随滚动不断变化（抖动/闪烁）。
                     */
                    for (let c = 0; c < colspan; c++) {
                        rowCols.push(ABOVE_VIEWPORT_PH);
                    }
                }

                // Skip columns covered by this cell's colspan
                // （列合并修正已保证被覆盖列在可视列列表中紧邻锚点列）
                i += colspan - 1;
            }

            if (!hasMustRender) {
                // For rows without any must-render cells, no placeholder needed —
                // tbody tr already has height: var(--row-height), so an empty <tr> maintains height.
                rowCols.length = 0;
            }
            map.set(rowKeyGen(row), rowCols);
        }
        return map;
    });

    /** 空合并段列表（start 为绝对行索引）。禁止合并时返回共享空数组 */
    const EMPTY_BLOCKS: { start: number; count: number }[] = [];

    /** 空下方占位段列表。无下方合并行时返回共享空数组 */
    const EMPTY_SEGMENTS: { count: number }[] = [];

    /**
     * 视口上方连续「无 td」空行段（行数 >= 2 才成段；单行保留独立 tr）。
     * 空行判定与渲染保持一致：aboveViewportColumnMap 中列结果为空且非展开行。
     * 供模板合并渲染（StkTable aboveRenderParts）与 rowspan 属性修正共用。
     */
    const aboveEmptyBlocks = computed<{ start: number; count: number }[]>(() => {
        if (!canMergeEmptyRows.value) return EMPTY_BLOCKS;
        const data = virtual_dataSourcePart.value;
        const { startIndex, viewportStartIndex } = virtualScroll.value;
        const aboveCount = Math.min(data.length, Math.max(0, viewportStartIndex - startIndex));
        if (aboveCount <= 0) return EMPTY_BLOCKS;
        const colMap = aboveViewportColumnMap.value;

        const isEmptyRow = (row: PrivateRowDT): boolean => {
            // 展开行有独立行高且渲染内容，不能参与合并
            if (!row || row.__EXP_R__) return false;
            const cols = colMap.get(rowKeyGen(row));
            // 仅当映射中明确为空列结果时才算空行；缺失（异常）时保留原渲染
            return cols !== void 0 && cols.length === 0;
        };

        const blocks: { start: number; count: number }[] = [];
        let runStart = -1;
        const flushRun = (endExclusive: number) => {
            if (endExclusive - runStart >= 2) {
                blocks.push({ start: startIndex + runStart, count: endExclusive - runStart });
            }
            runStart = -1;
        };
        for (let i = 0; i < aboveCount; i++) {
            if (isEmptyRow(data[i])) {
                if (runStart < 0) runStart = i;
                continue;
            }
            if (runStart >= 0) flushRun(i);
        }
        if (runStart >= 0) flushRun(aboveCount);
        return blocks.length ? blocks : EMPTY_BLOCKS;
    });

    /**
     * 视口下方占位段：把 [viewportEndIndex+1, endIndex] 按跨界 rowspan 的
     * 去重结束行切分为多段，每段渲染一个占位 tr。
     *
     * 单个占位 tr 无法表达多个 rowspan 的不同逻辑结束位置（不规律合并下
     * 多个单元格会塌缩到同一 tr 底边，滚动时高度跳动）；按结束行切段后，
     * 每个单元格的修正 rowspan 恰好止于包含其逻辑结束行的段。
     * 超长 rowspan 场景只有一个结束行（= 区域末端），仍只产生 1 段，不增加 DOM。
     */
    const belowPhSegments = computed<{ count: number }[]>(() => {
        const belowCount = belowViewportRowCount.value;
        if (belowCount <= 0) return EMPTY_SEGMENTS;
        const data = virtual_dataSourcePart.value;
        const { startIndex, viewportEndIndex, endIndex } = virtualScroll.value;
        // 下方区域末端钳制到窗口最后一行（endIndex 可能超出数据长度）
        const regionEnd = Math.min(endIndex, startIndex + data.length - 1);
        const columns = virtualX_columnPart.value;

        // 跨界 rowspan 的锚点只可能在视口上方保留行与视口行内，收集其去重结束行
        const endsSet = new Set<number>();
        const anchorRowEnd = Math.min(data.length - 1, viewportEndIndex - startIndex);
        for (let rowOffset = 0; rowOffset <= anchorRowEnd; rowOffset++) {
            const row = data[rowOffset];
            if (!row) continue;
            const absRowIndex = startIndex + rowOffset;
            for (let colIdx = 0; colIdx < columns.length; colIdx++) {
                const col = columns[colIdx];
                if (!col.mergeCells) continue;
                const leafIndex = col.__LF_S__ ?? colIdx;
                const { rowspan } = mergeCellsCache.getMergeCellsResult(row, col, absRowIndex, leafIndex);
                if (rowspan <= 1) continue;
                const spanEnd = absRowIndex + rowspan - 1;
                if (spanEnd > viewportEndIndex) endsSet.add(Math.min(spanEnd, regionEnd));
            }
        }

        // 兜底：未收集到跨界结束行时保持单段（与合并前行为一致）
        if (!endsSet.size) return [{ count: belowCount }];

        const ends = Array.from(endsSet).sort((a, b) => a - b);
        const segments: { count: number }[] = [];
        let prev = viewportEndIndex;
        for (let i = 0; i < ends.length; i++) {
            const count = ends[i] - prev;
            if (count > 0) segments.push({ count });
            prev = ends[i];
        }
        if (regionEnd > prev) segments.push({ count: regionEnd - prev });
        return segments;
    });

    function updateActiveMergedCells(clear?: boolean, rowKey?: UniqKey) {
        if (!rowActiveProp.value.enabled) return;
        if (clear) {
            activeMergedCells.value = new Set();
            return;
        }
        activeMergedCells.value = (rowKey !== void 0 && hoverRowMap.value[rowKey]) || new Set(hoverMergedCells.value);
    }

    return [
        hiddenCellMap,
        mergeCellsWrapper,
        hoverMergedCells,
        updateHoverMergedCells,
        activeMergedCells,
        updateActiveMergedCells,
        aboveViewportColumnMap,
        aboveEmptyBlocks,
        belowPhSegments,
    ] as const;
}
