/** 文件树数据：children 存在即为目录（可展开），否则为文件 */
export type FileTreeNode = {
    name: string;
    children?: FileTreeNode[];
};

/**
 * 初始数据即按「文件夹优先 + 名称 localeCompare」排好序——
 * 资源管理器里位置只由排序决定，新建 / 改名 / 移动后都会重新排一次。
 *
 * ⚠️ 本数组由脚本按仓库真实目录结构自动生成，请勿手改：
 *   node docs-demo/demos/FileTree/gen-file-tree-data.mjs
 */
export const fileTreeData: FileTreeNode[] = [
    {
        name: 'docs-demo',
        children: [
            {
                name: 'advanced',
                children: [
                    {
                        name: 'area-selection',
                        children: [{ name: 'AreaSelection.vue' }],
                    },
                    {
                        name: 'auto-height-virtual',
                        children: [
                            {
                                name: 'AutoHeightVirtual',
                                children: [{ name: 'index.vue' }, { name: 'types.ts' }],
                            },
                            {
                                name: 'PretextAutoHeight',
                                children: [{ name: 'index.vue' }, { name: 'types.ts' }],
                            },
                        ],
                    },
                    {
                        name: 'column-resize',
                        children: [
                            { name: 'ColResizable.vue' },
                            { name: 'ColResizableFullHack.vue' },
                        ],
                    },
                    {
                        name: 'custom-cell',
                        children: [
                            {
                                name: 'CustomCell',
                                children: [
                                    { name: 'index.vue' },
                                    { name: 'types.ts' },
                                    { name: 'YieldCell.vue' },
                                ],
                            },
                            {
                                name: 'PublicTreeCell',
                                children: [{ name: 'ComposedTreeCell.vue' }, { name: 'index.vue' }],
                            },
                        ],
                    },
                    {
                        name: 'custom-cells',
                        children: [
                            {
                                name: 'ChangeCell',
                                children: [{ name: 'index.vue' }],
                            },
                            {
                                name: 'CheckboxCell',
                                children: [
                                    { name: 'CheckboxComponentCell.vue' },
                                    { name: 'index.vue' },
                                ],
                            },
                            {
                                name: 'EditableCell',
                                children: [{ name: 'index.vue' }],
                            },
                            {
                                name: 'FilterCell',
                                children: [{ name: 'CustomFilter.vue' }, { name: 'index.vue' }],
                            },
                            {
                                name: 'NumberCell',
                                children: [{ name: 'index.vue' }],
                            },
                        ],
                    },
                    {
                        name: 'custom-sort',
                        children: [
                            {
                                name: 'CustomSort',
                                children: [{ name: 'index.vue' }],
                            },
                            { name: 'InsertSort.vue' },
                        ],
                    },
                    {
                        name: 'header-drag',
                        children: [{ name: 'HeaderDrag.vue' }],
                    },
                    {
                        name: 'highlight',
                        children: [
                            { name: 'const.ts' },
                            { name: 'Highlight.vue' },
                            { name: 'HighlightAnimation.vue' },
                            { name: 'HighlightBase.vue' },
                            { name: 'HighlightCss.vue' },
                        ],
                    },
                    {
                        name: 'row-drag',
                        children: [{ name: 'RowDrag.vue' }, { name: 'RowDragCustom.vue' }],
                    },
                    {
                        name: 'virtual',
                        children: [{ name: 'VirtualX.vue' }, { name: 'VirtualY.vue' }],
                    },
                ],
            },
            {
                name: 'api',
                children: [
                    {
                        name: 'slots',
                        children: [{ name: 'CustomBottom.vue' }],
                    },
                ],
            },
            {
                name: 'assets',
                children: [
                    {
                        name: 'svg-components',
                        children: [{ name: 'NoData.vue' }],
                    },
                ],
            },
            {
                name: 'basic',
                children: [
                    {
                        name: 'align',
                        children: [{ name: 'Align.vue' }],
                    },
                    {
                        name: 'border',
                        children: [{ name: 'Default.vue' }],
                    },
                    {
                        name: 'checkbox',
                        children: [{ name: 'Checkbox.vue' }],
                    },
                    {
                        name: 'column-width',
                        children: [{ name: 'ColumnWidth.vue' }, { name: 'TableWidthFit.vue' }],
                    },
                    {
                        name: 'empty',
                        children: [
                            { name: 'Default.vue' },
                            { name: 'NoDataFull.vue' },
                            { name: 'Slot.vue' },
                        ],
                    },
                    {
                        name: 'expand-row',
                        children: [{ name: 'CustomExpandRow.vue' }, { name: 'ExpandRow.vue' }],
                    },
                    {
                        name: 'fixed',
                        children: [{ name: 'Fixed.vue' }, { name: 'FixedVirtual.vue' }],
                    },
                    {
                        name: 'fixed-mode',
                        children: [{ name: 'FixedMode.vue' }, { name: 'FixedModeMultiHeader.vue' }],
                    },
                    {
                        name: 'footer',
                        children: [
                            { name: 'Footer.vue' },
                            { name: 'FooterMultiHeader.vue' },
                            { name: 'FooterTop.vue' },
                        ],
                    },
                    {
                        name: 'headless',
                        children: [{ name: 'Headless.vue' }],
                    },
                    {
                        name: 'merge-cells',
                        children: [
                            {
                                name: 'MergeCellsColVirtual',
                                children: [
                                    { name: 'HugeColspan.vue' },
                                    { name: 'index.vue' },
                                    { name: 'Special.vue' },
                                ],
                            },
                            {
                                name: 'MergeCellsRowColVirtual',
                                children: [{ name: 'index.vue' }],
                            },
                            {
                                name: 'MergeCellsRowVirtual',
                                children: [
                                    { name: 'dataSource.ts' },
                                    { name: 'HugeRowspan.vue' },
                                    { name: 'index.vue' },
                                    { name: 'Special.vue' },
                                ],
                            },
                            { name: 'MergeCellsCol.vue' },
                            { name: 'MergeCellsRow.vue' },
                        ],
                    },
                    {
                        name: 'multi-header',
                        children: [
                            { name: 'MultiHeader.vue' },
                            { name: 'MultiHeaderAnyFixed.vue' },
                            { name: 'MultiHeaderFixed.vue' },
                            { name: 'MultiHeaderLeavesFixed.vue' },
                            { name: 'MultiHeaderVirtualX.vue' },
                        ],
                    },
                    {
                        name: 'overflow',
                        children: [{ name: 'Overflow.vue' }],
                    },
                    {
                        name: 'row-cell-mouse-event',
                        children: [{ name: 'RowCellHoverSelect.vue' }],
                    },
                    {
                        name: 'row-height',
                        children: [{ name: 'RowHeight.vue' }, { name: 'RowHeightFull.vue' }],
                    },
                    {
                        name: 'scroll-row-by-row',
                        children: [{ name: 'ScrollRowByRow.vue' }],
                    },
                    {
                        name: 'scrollbar-style',
                        children: [{ name: 'CustomScrollbar.vue' }, { name: 'ScrollbarStyle.vue' }],
                    },
                    {
                        name: 'seq',
                        children: [{ name: 'Seq.vue' }, { name: 'SeqStartIndex.vue' }],
                    },
                    {
                        name: 'size',
                        children: [{ name: 'Default.vue' }, { name: 'Flex.vue' }],
                    },
                    {
                        name: 'sort',
                        children: [
                            { name: 'CustomSort.vue' },
                            { name: 'DefaultSort.vue' },
                            { name: 'MultiSort.vue' },
                            { name: 'Sort.vue' },
                            { name: 'SortChildren.vue' },
                            { name: 'SortEmptyValue.vue' },
                            { name: 'SortField.vue' },
                            { name: 'SortRemote.vue' },
                        ],
                    },
                    {
                        name: 'stripe',
                        children: [{ name: 'Stripe.vue' }, { name: 'StripeVt.vue' }],
                    },
                    {
                        name: 'theme',
                        children: [{ name: 'CssVarsDemo.vue' }],
                    },
                    {
                        name: 'tree',
                        children: [
                            { name: 'config.ts' },
                            { name: 'Tree.vue' },
                            { name: 'TreeDefaultExpandAll.vue' },
                            { name: 'TreeDefaultExpandKeys.vue' },
                            { name: 'TreeDefaultExpandLevel.vue' },
                            { name: 'TreeGuide.vue' },
                            { name: 'TreeLazyLoad.vue' },
                            { name: 'TreeSetExpand.vue' },
                            { name: 'TreeVirtualList.vue' },
                        ],
                    },
                    { name: 'Basic.vue' },
                ],
            },
            {
                name: 'components',
                children: [
                    { name: 'CheckItem.vue' },
                    { name: 'RadioGroup.vue' },
                    { name: 'RangeInput.vue' },
                ],
            },
            {
                name: 'demos',
                children: [
                    {
                        name: 'CellEdit',
                        children: [
                            { name: 'EditCell.vue' },
                            { name: 'EditRowSwitch.vue' },
                            { name: 'index.vue' },
                            { name: 'type.ts' },
                        ],
                    },
                    {
                        name: 'FileTree',
                        children: [
                            { name: 'FileIcon.vue' },
                            { name: 'fileIcons.ts' },
                            { name: 'fileTreeData.ts' },
                            { name: 'fileTreeStore.ts' },
                            { name: 'gen-file-tree-data.mjs' },
                            { name: 'index.vue' },
                            { name: 'NameCell.vue' },
                            { name: 'useCellDrag.ts' },
                            { name: 'useInlineRename.ts' },
                        ],
                    },
                    {
                        name: 'HugeData',
                        children: [
                            {
                                name: 'custom-cells',
                                children: [{ name: 'ExpandCell.vue' }, { name: 'SourceCell.vue' }],
                            },
                            { name: 'columns.ts' },
                            { name: 'event.ts' },
                            { name: 'index.vue' },
                            { name: 'mockData.ts' },
                            { name: 'types.ts' },
                        ],
                    },
                    {
                        name: 'LazyLoad',
                        children: [{ name: 'index.vue' }],
                    },
                    {
                        name: 'Matrix',
                        children: [
                            { name: 'index.vue' },
                            { name: 'MatrixCell.vue' },
                            { name: 'type.ts' },
                        ],
                    },
                    {
                        name: 'PanelTree',
                        children: [{ name: 'index.vue' }, { name: 'type.ts' }],
                    },
                    {
                        name: 'RealtimeMergeCells',
                        children: [{ name: 'index.vue' }],
                    },
                    {
                        name: 'VirtualList',
                        children: [
                            {
                                name: 'AutoHeightVirtualList',
                                children: [
                                    { name: 'index.vue' },
                                    { name: 'Panel.vue' },
                                    { name: 'types.ts' },
                                ],
                            },
                            { name: 'index.vue' },
                            { name: 'Panel.vue' },
                            { name: 'types.ts' },
                        ],
                    },
                ],
            },
            {
                name: 'hooks',
                children: [
                    {
                        name: 'useI18n',
                        children: [
                            { name: 'en.ts' },
                            { name: 'index.ts' },
                            { name: 'ja.ts' },
                            { name: 'ko.ts' },
                            { name: 'zh.ts' },
                        ],
                    },
                    { name: 'getIsZH.ts' },
                ],
            },
            {
                name: 'other',
                children: [
                    {
                        name: 'contextmenu',
                        children: [{ name: 'ContextMenu.vue' }],
                    },
                ],
            },
            {
                name: 'start',
                children: [{ name: 'Start.vue' }],
            },
            { name: '.prettierrc.cjs' },
            { name: 'StkTable.vue' },
            { name: 'tsconfig.json' },
        ],
    },
    {
        name: 'docs-src',
        children: [
            {
                name: '.vitepress',
                children: [
                    {
                        name: 'src',
                        children: [
                            {
                                name: 'config',
                                children: [
                                    { name: 'en.ts' },
                                    { name: 'ja.ts' },
                                    { name: 'ko.ts' },
                                    { name: 'zh.ts' },
                                ],
                            },
                        ],
                    },
                    {
                        name: 'theme',
                        children: [{ name: 'custom.css' }, { name: 'index.ts' }],
                    },
                    { name: 'config.ts' },
                ],
            },
            {
                name: 'demos',
                children: [
                    { name: 'cell-edit.md' },
                    { name: 'file-tree.md' },
                    { name: 'huge-data.md' },
                    { name: 'lazy-load.md' },
                    { name: 'matrix.md' },
                    { name: 'panel-tree.md' },
                    { name: 'realtime-merge-cells.md' },
                    { name: 'virtual-list.md' },
                ],
            },
            {
                name: 'en',
                children: [
                    {
                        name: 'demos',
                        children: [
                            { name: 'cell-edit.md' },
                            { name: 'file-tree.md' },
                            { name: 'huge-data.md' },
                            { name: 'lazy-load.md' },
                            { name: 'matrix.md' },
                            { name: 'panel-tree.md' },
                            { name: 'realtime-merge-cells.md' },
                            { name: 'virtual-list.md' },
                        ],
                    },
                    {
                        name: 'main',
                        children: [
                            {
                                name: 'api',
                                children: [
                                    { name: 'emits.md' },
                                    { name: 'expose.md' },
                                    { name: 'slots.md' },
                                    { name: 'stk-table-column.md' },
                                    { name: 'table-props.md' },
                                ],
                            },
                            {
                                name: 'other',
                                children: [
                                    { name: 'change.md' },
                                    { name: 'contextmenu.md' },
                                    { name: 'experimental.md' },
                                    { name: 'optimize.md' },
                                    { name: 'qa.md' },
                                    { name: 'sponsor.md' },
                                    { name: 'tips.md' },
                                    { name: 'vue-table-benchmark.md' },
                                ],
                            },
                            {
                                name: 'start',
                                children: [
                                    { name: 'introduce.md' },
                                    { name: 'start.md' },
                                    { name: 'vue2-usage.md' },
                                ],
                            },
                            {
                                name: 'table',
                                children: [
                                    {
                                        name: 'advanced',
                                        children: [
                                            {
                                                name: 'custom-cells',
                                                children: [
                                                    { name: 'change-cell.md' },
                                                    { name: 'checkbox-cell.md' },
                                                    { name: 'editable-cell.md' },
                                                    { name: 'filter-cell.md' },
                                                    { name: 'number-cell.md' },
                                                ],
                                            },
                                            { name: 'area-selection.md' },
                                            { name: 'auto-height-virtual.md' },
                                            { name: 'column-resize.md' },
                                            { name: 'custom-cell.md' },
                                            { name: 'custom-sort.md' },
                                            { name: 'header-drag.md' },
                                            { name: 'highlight.md' },
                                            { name: 'row-drag.md' },
                                            { name: 'virtual.md' },
                                            { name: 'vue2-scroll-optimize.md' },
                                        ],
                                    },
                                    {
                                        name: 'basic',
                                        children: [
                                            { name: 'align.md' },
                                            { name: 'basic.md' },
                                            { name: 'bordered.md' },
                                            { name: 'checkbox.md' },
                                            { name: 'column-width.md' },
                                            { name: 'empty.md' },
                                            { name: 'expand-row.md' },
                                            { name: 'fixed-mode.md' },
                                            { name: 'fixed.md' },
                                            { name: 'footer.md' },
                                            { name: 'headless.md' },
                                            { name: 'key.md' },
                                            { name: 'merge-cells.md' },
                                            { name: 'multi-header.md' },
                                            { name: 'overflow.md' },
                                            { name: 'row-cell-mouse-event.md' },
                                            { name: 'row-height.md' },
                                            { name: 'scroll-row-by-row.md' },
                                            { name: 'scrollbar.md' },
                                            { name: 'seq.md' },
                                            { name: 'size.md' },
                                            { name: 'sort.md' },
                                            { name: 'stripe.md' },
                                            { name: 'theme.md' },
                                            { name: 'tree.md' },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    { name: 'index.md' },
                ],
            },
            {
                name: 'ja',
                children: [
                    {
                        name: 'demos',
                        children: [
                            { name: 'cell-edit.md' },
                            { name: 'file-tree.md' },
                            { name: 'huge-data.md' },
                            { name: 'lazy-load.md' },
                            { name: 'matrix.md' },
                            { name: 'panel-tree.md' },
                            { name: 'realtime-merge-cells.md' },
                            { name: 'virtual-list.md' },
                        ],
                    },
                    {
                        name: 'main',
                        children: [
                            {
                                name: 'api',
                                children: [
                                    { name: 'emits.md' },
                                    { name: 'expose.md' },
                                    { name: 'slots.md' },
                                    { name: 'stk-table-column.md' },
                                    { name: 'table-props.md' },
                                ],
                            },
                            {
                                name: 'other',
                                children: [
                                    { name: 'change.md' },
                                    { name: 'contextmenu.md' },
                                    { name: 'experimental.md' },
                                    { name: 'optimize.md' },
                                    { name: 'qa.md' },
                                    { name: 'sponsor.md' },
                                    { name: 'tips.md' },
                                    { name: 'vue-table-benchmark.md' },
                                ],
                            },
                            {
                                name: 'start',
                                children: [
                                    { name: 'introduce.md' },
                                    { name: 'start.md' },
                                    { name: 'vue2-usage.md' },
                                ],
                            },
                            {
                                name: 'table',
                                children: [
                                    {
                                        name: 'advanced',
                                        children: [
                                            {
                                                name: 'custom-cells',
                                                children: [
                                                    { name: 'change-cell.md' },
                                                    { name: 'checkbox-cell.md' },
                                                    { name: 'editable-cell.md' },
                                                    { name: 'filter-cell.md' },
                                                    { name: 'number-cell.md' },
                                                ],
                                            },
                                            { name: 'area-selection.md' },
                                            { name: 'auto-height-virtual.md' },
                                            { name: 'column-resize.md' },
                                            { name: 'custom-cell.md' },
                                            { name: 'custom-sort.md' },
                                            { name: 'header-drag.md' },
                                            { name: 'highlight.md' },
                                            { name: 'row-drag.md' },
                                            { name: 'virtual.md' },
                                            { name: 'vue2-scroll-optimize.md' },
                                        ],
                                    },
                                    {
                                        name: 'basic',
                                        children: [
                                            { name: 'align.md' },
                                            { name: 'basic.md' },
                                            { name: 'bordered.md' },
                                            { name: 'checkbox.md' },
                                            { name: 'column-width.md' },
                                            { name: 'empty.md' },
                                            { name: 'expand-row.md' },
                                            { name: 'fixed-mode.md' },
                                            { name: 'fixed.md' },
                                            { name: 'footer.md' },
                                            { name: 'headless.md' },
                                            { name: 'key.md' },
                                            { name: 'merge-cells.md' },
                                            { name: 'multi-header.md' },
                                            { name: 'overflow.md' },
                                            { name: 'row-cell-mouse-event.md' },
                                            { name: 'row-height.md' },
                                            { name: 'scroll-row-by-row.md' },
                                            { name: 'scrollbar.md' },
                                            { name: 'seq.md' },
                                            { name: 'size.md' },
                                            { name: 'sort.md' },
                                            { name: 'stripe.md' },
                                            { name: 'theme.md' },
                                            { name: 'tree.md' },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    { name: 'index.md' },
                ],
            },
            {
                name: 'ko',
                children: [
                    {
                        name: 'demos',
                        children: [
                            { name: 'cell-edit.md' },
                            { name: 'file-tree.md' },
                            { name: 'huge-data.md' },
                            { name: 'lazy-load.md' },
                            { name: 'matrix.md' },
                            { name: 'panel-tree.md' },
                            { name: 'realtime-merge-cells.md' },
                            { name: 'virtual-list.md' },
                        ],
                    },
                    {
                        name: 'main',
                        children: [
                            {
                                name: 'api',
                                children: [
                                    { name: 'emits.md' },
                                    { name: 'expose.md' },
                                    { name: 'slots.md' },
                                    { name: 'stk-table-column.md' },
                                    { name: 'table-props.md' },
                                ],
                            },
                            {
                                name: 'other',
                                children: [
                                    { name: 'change.md' },
                                    { name: 'contextmenu.md' },
                                    { name: 'experimental.md' },
                                    { name: 'optimize.md' },
                                    { name: 'qa.md' },
                                    { name: 'sponsor.md' },
                                    { name: 'tips.md' },
                                    { name: 'vue-table-benchmark.md' },
                                ],
                            },
                            {
                                name: 'start',
                                children: [
                                    { name: 'introduce.md' },
                                    { name: 'start.md' },
                                    { name: 'vue2-usage.md' },
                                ],
                            },
                            {
                                name: 'table',
                                children: [
                                    {
                                        name: 'advanced',
                                        children: [
                                            {
                                                name: 'custom-cells',
                                                children: [
                                                    { name: 'change-cell.md' },
                                                    { name: 'checkbox-cell.md' },
                                                    { name: 'editable-cell.md' },
                                                    { name: 'filter-cell.md' },
                                                    { name: 'number-cell.md' },
                                                ],
                                            },
                                            { name: 'area-selection.md' },
                                            { name: 'auto-height-virtual.md' },
                                            { name: 'column-resize.md' },
                                            { name: 'custom-cell.md' },
                                            { name: 'custom-sort.md' },
                                            { name: 'header-drag.md' },
                                            { name: 'highlight.md' },
                                            { name: 'row-drag.md' },
                                            { name: 'virtual.md' },
                                            { name: 'vue2-scroll-optimize.md' },
                                        ],
                                    },
                                    {
                                        name: 'basic',
                                        children: [
                                            { name: 'align.md' },
                                            { name: 'basic.md' },
                                            { name: 'bordered.md' },
                                            { name: 'checkbox.md' },
                                            { name: 'column-width.md' },
                                            { name: 'empty.md' },
                                            { name: 'expand-row.md' },
                                            { name: 'fixed-mode.md' },
                                            { name: 'fixed.md' },
                                            { name: 'footer.md' },
                                            { name: 'headless.md' },
                                            { name: 'key.md' },
                                            { name: 'merge-cells.md' },
                                            { name: 'multi-header.md' },
                                            { name: 'overflow.md' },
                                            { name: 'row-cell-mouse-event.md' },
                                            { name: 'row-height.md' },
                                            { name: 'scroll-row-by-row.md' },
                                            { name: 'scrollbar.md' },
                                            { name: 'seq.md' },
                                            { name: 'size.md' },
                                            { name: 'sort.md' },
                                            { name: 'stripe.md' },
                                            { name: 'theme.md' },
                                            { name: 'tree.md' },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    { name: 'index.md' },
                ],
            },
            {
                name: 'main',
                children: [
                    {
                        name: 'api',
                        children: [
                            { name: 'emits.md' },
                            { name: 'expose.md' },
                            { name: 'slots.md' },
                            { name: 'stk-table-column.md' },
                            { name: 'table-props.md' },
                        ],
                    },
                    {
                        name: 'other',
                        children: [
                            { name: 'change.md' },
                            { name: 'contextmenu.md' },
                            { name: 'experimental.md' },
                            { name: 'optimize.md' },
                            { name: 'qa.md' },
                            { name: 'sponsor.md' },
                            { name: 'tips.md' },
                            { name: 'vue-table-benchmark.md' },
                        ],
                    },
                    {
                        name: 'start',
                        children: [
                            { name: 'introduce.md' },
                            { name: 'start.md' },
                            { name: 'vue2-usage.md' },
                        ],
                    },
                    {
                        name: 'table',
                        children: [
                            {
                                name: 'advanced',
                                children: [
                                    {
                                        name: 'custom-cells',
                                        children: [
                                            { name: 'change-cell.md' },
                                            { name: 'checkbox-cell.md' },
                                            { name: 'editable-cell.md' },
                                            { name: 'filter-cell.md' },
                                            { name: 'number-cell.md' },
                                        ],
                                    },
                                    { name: 'area-selection.md' },
                                    { name: 'auto-height-virtual.md' },
                                    { name: 'column-resize.md' },
                                    { name: 'custom-cell.md' },
                                    { name: 'custom-sort.md' },
                                    { name: 'header-drag.md' },
                                    { name: 'highlight.md' },
                                    { name: 'row-drag.md' },
                                    { name: 'virtual.md' },
                                    { name: 'vue2-scroll-optimize.md' },
                                ],
                            },
                            {
                                name: 'basic',
                                children: [
                                    { name: 'align.md' },
                                    { name: 'basic.md' },
                                    { name: 'bordered.md' },
                                    { name: 'checkbox.md' },
                                    { name: 'column-width.md' },
                                    { name: 'empty.md' },
                                    { name: 'expand-row.md' },
                                    { name: 'fixed-mode.md' },
                                    { name: 'fixed.md' },
                                    { name: 'footer.md' },
                                    { name: 'headless.md' },
                                    { name: 'key.md' },
                                    { name: 'merge-cells.md' },
                                    { name: 'multi-header.md' },
                                    { name: 'overflow.md' },
                                    { name: 'row-cell-mouse-event.md' },
                                    { name: 'row-height.md' },
                                    { name: 'scroll-row-by-row.md' },
                                    { name: 'scrollbar.md' },
                                    { name: 'seq.md' },
                                    { name: 'size.md' },
                                    { name: 'sort.md' },
                                    { name: 'stripe.md' },
                                    { name: 'theme.md' },
                                    { name: 'tree.md' },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                name: 'public',
                children: [
                    {
                        name: 'assets',
                        children: [
                            { name: 'alipay-sponsor.jpg' },
                            { name: 'logo.svg' },
                            { name: 'vue-logo.svg' },
                        ],
                    },
                ],
            },
            { name: 'index.md' },
            { name: 'postcss.config.mjs' },
            { name: 'todo-page.md' },
        ],
    },
    {
        name: 'history',
        children: [
            {
                name: 'images',
                children: [{ name: 'sort-btn.svg' }],
            },
            {
                name: 'StkTableC',
                children: [{ name: 'index.vue' }, { name: 'store.js' }],
            },
            { name: 'StkTable_compatible.vue' },
            { name: 'StkTable.d.ts' },
            { name: 'StkTable.vue' },
        ],
    },
    {
        name: 'lib',
        children: [
            {
                name: 'src',
                children: [
                    {
                        name: 'StkTable',
                        children: [
                            {
                                name: 'components',
                                children: [
                                    { name: 'DragHandle.vue.d.ts' },
                                    { name: 'SortIcon.vue.d.ts' },
                                    { name: 'TreeFoldIcon.vue.d.ts' },
                                    { name: 'TreeIndent.vue.d.ts' },
                                    { name: 'TreeNodeCell.vue.d.ts' },
                                ],
                            },
                            {
                                name: 'custom-cells',
                                children: [
                                    {
                                        name: 'ChangeCell',
                                        children: [
                                            { name: 'createChangeCell.d.ts' },
                                            { name: 'index.d.ts' },
                                        ],
                                    },
                                    {
                                        name: 'CheckboxCell',
                                        children: [
                                            { name: 'CheckboxCell.vue.d.ts' },
                                            { name: 'createCheckboxCell.d.ts' },
                                            { name: 'index.d.ts' },
                                        ],
                                    },
                                    {
                                        name: 'EditableCell',
                                        children: [
                                            { name: 'createEditableCell.d.ts' },
                                            { name: 'EditableCell.vue.d.ts' },
                                            { name: 'index.d.ts' },
                                        ],
                                    },
                                    {
                                        name: 'FilterCell',
                                        children: [
                                            {
                                                name: 'Dropdown',
                                                children: [
                                                    { name: 'index.d.ts' },
                                                    { name: 'index.vue.d.ts' },
                                                ],
                                            },
                                            { name: 'createFilterCell.d.ts' },
                                            { name: 'Filter.vue.d.ts' },
                                            { name: 'index.d.ts' },
                                            { name: 'types.d.ts' },
                                        ],
                                    },
                                    {
                                        name: 'NumberCell',
                                        children: [
                                            { name: 'createNumberCell.d.ts' },
                                            { name: 'index.d.ts' },
                                        ],
                                    },
                                    {
                                        name: 'utils',
                                        children: [{ name: 'formatNumber.d.ts' }],
                                    },
                                ],
                            },
                            {
                                name: 'features',
                                children: [
                                    { name: 'const.d.ts' },
                                    { name: 'index.d.ts' },
                                    { name: 'useAreaSelection.d.ts' },
                                ],
                            },
                            {
                                name: 'types',
                                children: [
                                    { name: 'highlightDimOptions.d.ts' },
                                    { name: 'index.d.ts' },
                                ],
                            },
                            {
                                name: 'utils',
                                children: [
                                    { name: 'constRefUtils.d.ts' },
                                    { name: 'index.d.ts' },
                                    { name: 'rowHeightFenwickTree.d.ts' },
                                    { name: 'useTriggerRef.d.ts' },
                                ],
                            },
                            { name: 'const.d.ts' },
                            { name: 'index.d.ts' },
                            { name: 'mergeCellsCache.d.ts' },
                            { name: 'registerFeature.d.ts' },
                            { name: 'StkTable.vue.d.ts' },
                            { name: 'useAutoResize.d.ts' },
                            { name: 'useColResize.d.ts' },
                            { name: 'useFixedCol.d.ts' },
                            { name: 'useFixedStyle.d.ts' },
                            { name: 'useGetFixedColPosition.d.ts' },
                            { name: 'useHighlight.d.ts' },
                            { name: 'useIndexResolver.d.ts' },
                            { name: 'useKeyboardArrowScroll.d.ts' },
                            { name: 'useMaxRowSpan.d.ts' },
                            { name: 'useMergeCells.d.ts' },
                            { name: 'useRowExpand.d.ts' },
                            { name: 'useScrollbar.d.ts' },
                            { name: 'useScrollRowByRow.d.ts' },
                            { name: 'useSorter.d.ts' },
                            { name: 'useTableColumns.d.ts' },
                            { name: 'useThDrag.d.ts' },
                            { name: 'useTrDrag.d.ts' },
                            { name: 'useTree.d.ts' },
                            { name: 'useVirtualScroll.d.ts' },
                            { name: 'useWheeling.d.ts' },
                        ],
                    },
                ],
            },
            { name: 'Dropdown.js' },
            { name: 'stk-table-vue.js' },
            { name: 'StkTable.js' },
            { name: 'style.css' },
        ],
    },
    {
        name: 'openspec',
        children: [
            {
                name: 'changes',
                children: [
                    {
                        name: 'archive',
                        children: [
                            {
                                name: '2026-08-19-add-project-specs',
                                children: [
                                    {
                                        name: 'specs',
                                        children: [
                                            {
                                                name: 'area-selection',
                                                children: [{ name: 'spec.md' }],
                                            },
                                            {
                                                name: 'cell-highlight',
                                                children: [{ name: 'spec.md' }],
                                            },
                                            {
                                                name: 'column-management',
                                                children: [{ name: 'spec.md' }],
                                            },
                                            {
                                                name: 'custom-cells',
                                                children: [{ name: 'spec.md' }],
                                            },
                                            {
                                                name: 'fixed-columns',
                                                children: [{ name: 'spec.md' }],
                                            },
                                            {
                                                name: 'merge-cells',
                                                children: [{ name: 'spec.md' }],
                                            },
                                            {
                                                name: 'multi-level-header',
                                                children: [{ name: 'spec.md' }],
                                            },
                                            {
                                                name: 'row-drag',
                                                children: [{ name: 'spec.md' }],
                                            },
                                            {
                                                name: 'sorting',
                                                children: [{ name: 'spec.md' }],
                                            },
                                            {
                                                name: 'tree-table',
                                                children: [{ name: 'spec.md' }],
                                            },
                                            {
                                                name: 'virtual-scroll',
                                                children: [{ name: 'spec.md' }],
                                            },
                                        ],
                                    },
                                    { name: '.openspec.yaml' },
                                    { name: 'design.md' },
                                    { name: 'proposal.md' },
                                    { name: 'tasks.md' },
                                ],
                            },
                            {
                                name: '2026-08-20-optimize-virtual-scroll-perf',
                                children: [
                                    {
                                        name: 'specs',
                                        children: [
                                            {
                                                name: 'auto-row-height-virtual-scroll',
                                                children: [{ name: 'spec.md' }],
                                            },
                                        ],
                                    },
                                    { name: '.openspec.yaml' },
                                    { name: 'design.md' },
                                    { name: 'proposal.md' },
                                    { name: 'tasks.md' },
                                ],
                            },
                            {
                                name: '2026-08-20-scrollto-api-redesign',
                                children: [
                                    {
                                        name: 'specs',
                                        children: [
                                            {
                                                name: 'scroll-navigation',
                                                children: [{ name: 'spec.md' }],
                                            },
                                        ],
                                    },
                                    { name: '.openspec.yaml' },
                                    { name: 'design.md' },
                                    { name: 'proposal.md' },
                                    { name: 'tasks.md' },
                                ],
                            },
                            {
                                name: '2026-08-22-fix-sideeffects-css-import',
                                children: [
                                    { name: '.openspec.yaml' },
                                    { name: 'design.md' },
                                    { name: 'proposal.md' },
                                    { name: 'tasks.md' },
                                ],
                            },
                            {
                                name: '2026-08-24-performance-optimization',
                                children: [
                                    {
                                        name: 'specs',
                                        children: [
                                            {
                                                name: 'performance',
                                                children: [{ name: 'spec.md' }],
                                            },
                                        ],
                                    },
                                    { name: '.openspec.yaml' },
                                    { name: 'baseline.md' },
                                    { name: 'design.md' },
                                    { name: 'perf-results.md' },
                                    { name: 'proposal.md' },
                                    { name: 'tasks.md' },
                                ],
                            },
                            {
                                name: '2026-09-12-fix-fixed-col-class-join',
                                children: [
                                    {
                                        name: 'specs',
                                        children: [
                                            {
                                                name: 'fixed-columns',
                                                children: [{ name: 'spec.md' }],
                                            },
                                        ],
                                    },
                                    { name: '.openspec.yaml' },
                                    { name: 'design.md' },
                                    { name: 'proposal.md' },
                                    { name: 'tasks.md' },
                                ],
                            },
                            {
                                name: '2026-09-12-fix-row-height-css-var-sync',
                                children: [
                                    {
                                        name: 'specs',
                                        children: [
                                            {
                                                name: 'virtual-scroll',
                                                children: [{ name: 'spec.md' }],
                                            },
                                        ],
                                    },
                                    { name: '.openspec.yaml' },
                                    { name: 'design.md' },
                                    { name: 'proposal.md' },
                                    { name: 'tasks.md' },
                                ],
                            },
                            {
                                name: '2026-09-22-add-append-datasource',
                                children: [
                                    {
                                        name: 'specs',
                                        children: [
                                            {
                                                name: 'data-append',
                                                children: [{ name: 'spec.md' }],
                                            },
                                        ],
                                    },
                                    { name: '.openspec.yaml' },
                                    { name: 'design.md' },
                                    { name: 'proposal.md' },
                                    { name: 'tasks.md' },
                                ],
                            },
                            {
                                name: '2026-09-22-add-lazy-tree-children',
                                children: [
                                    {
                                        name: 'specs',
                                        children: [
                                            {
                                                name: 'tree-table',
                                                children: [{ name: 'spec.md' }],
                                            },
                                        ],
                                    },
                                    { name: '.openspec.yaml' },
                                    { name: 'design.md' },
                                    { name: 'proposal.md' },
                                    { name: 'tasks.md' },
                                ],
                            },
                            {
                                name: '2026-09-22-add-tree-guide-lines',
                                children: [
                                    {
                                        name: 'specs',
                                        children: [
                                            {
                                                name: 'tree-table',
                                                children: [{ name: 'spec.md' }],
                                            },
                                        ],
                                    },
                                    { name: '.openspec.yaml' },
                                    { name: 'design.md' },
                                    { name: 'proposal.md' },
                                    { name: 'tasks.md' },
                                ],
                            },
                        ],
                    },
                    {
                        name: 'customizable-tree-cell',
                        children: [
                            {
                                name: 'specs',
                                children: [
                                    {
                                        name: 'custom-cells',
                                        children: [{ name: 'spec.md' }],
                                    },
                                    {
                                        name: 'tree-table',
                                        children: [{ name: 'spec.md' }],
                                    },
                                ],
                            },
                            { name: '.openspec.yaml' },
                            { name: 'design.md' },
                            { name: 'proposal.md' },
                            { name: 'tasks.md' },
                        ],
                    },
                    {
                        name: 'export-tree-components',
                        children: [
                            {
                                name: 'specs',
                                children: [
                                    {
                                        name: 'tree-components',
                                        children: [{ name: 'spec.md' }],
                                    },
                                ],
                            },
                            { name: '.openspec.yaml' },
                            { name: 'design.md' },
                            { name: 'proposal.md' },
                            { name: 'tasks.md' },
                        ],
                    },
                    {
                        name: 'web-component-migration',
                        children: [
                            {
                                name: 'specs',
                                children: [
                                    {
                                        name: 'web-component',
                                        children: [{ name: 'spec.md' }],
                                    },
                                ],
                            },
                            { name: '.openspec.yaml' },
                            { name: 'design.md' },
                            { name: 'proposal.md' },
                            { name: 'tasks.md' },
                        ],
                    },
                ],
            },
            {
                name: 'specs',
                children: [
                    {
                        name: 'area-selection',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'auto-row-height-virtual-scroll',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'cell-highlight',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'column-management',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'custom-cells',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'fixed-columns',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'merge-cells',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'multi-level-header',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'performance',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'row-drag',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'scroll-navigation',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'sorting',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'tree-table',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'virtual-scroll',
                        children: [{ name: 'spec.md' }],
                    },
                    {
                        name: 'web-component',
                        children: [{ name: 'spec.md' }],
                    },
                ],
            },
            { name: 'config.yaml' },
        ],
    },
    {
        name: 'src',
        children: [
            {
                name: 'StkTable',
                children: [
                    {
                        name: 'components',
                        children: [
                            { name: 'DragHandle.vue' },
                            { name: 'SortIcon.vue' },
                            { name: 'TreeFoldIcon.vue' },
                            { name: 'TreeIndent.vue' },
                            { name: 'TreeNodeCell.vue' },
                        ],
                    },
                    {
                        name: 'custom-cells',
                        children: [
                            {
                                name: 'ChangeCell',
                                children: [
                                    { name: 'ChangeCell.less' },
                                    { name: 'createChangeCell.ts' },
                                    { name: 'index.ts' },
                                ],
                            },
                            {
                                name: 'CheckboxCell',
                                children: [
                                    { name: 'CheckboxCell.less' },
                                    { name: 'CheckboxCell.vue' },
                                    { name: 'createCheckboxCell.ts' },
                                    { name: 'index.ts' },
                                ],
                            },
                            {
                                name: 'EditableCell',
                                children: [
                                    { name: 'createEditableCell.ts' },
                                    { name: 'EditableCell.less' },
                                    { name: 'EditableCell.vue' },
                                    { name: 'index.ts' },
                                ],
                            },
                            {
                                name: 'FilterCell',
                                children: [
                                    {
                                        name: 'Dropdown',
                                        children: [{ name: 'index.ts' }, { name: 'index.vue' }],
                                    },
                                    { name: 'createFilterCell.ts' },
                                    { name: 'Filter.less' },
                                    { name: 'Filter.vue' },
                                    { name: 'index.ts' },
                                    { name: 'types.ts' },
                                ],
                            },
                            {
                                name: 'NumberCell',
                                children: [{ name: 'createNumberCell.ts' }, { name: 'index.ts' }],
                            },
                            {
                                name: 'utils',
                                children: [{ name: 'formatNumber.ts' }],
                            },
                        ],
                    },
                    {
                        name: 'features',
                        children: [
                            { name: 'const.ts' },
                            { name: 'index.ts' },
                            { name: 'useAreaSelection.ts' },
                        ],
                    },
                    {
                        name: 'types',
                        children: [{ name: 'highlightDimOptions.ts' }, { name: 'index.ts' }],
                    },
                    {
                        name: 'utils',
                        children: [
                            { name: 'constRefUtils.ts' },
                            { name: 'index.ts' },
                            { name: 'rowHeightFenwickTree.ts' },
                            { name: 'useTriggerRef.ts' },
                        ],
                    },
                    { name: 'const.ts' },
                    { name: 'index.ts' },
                    { name: 'mergeCellsCache.ts' },
                    { name: 'registerFeature.ts' },
                    { name: 'StkTable.vue' },
                    { name: 'style.less' },
                    { name: 'useAutoResize.ts' },
                    { name: 'useColResize.ts' },
                    { name: 'useFixedCol.ts' },
                    { name: 'useFixedStyle.ts' },
                    { name: 'useGetFixedColPosition.ts' },
                    { name: 'useHighlight.ts' },
                    { name: 'useIndexResolver.ts' },
                    { name: 'useKeyboardArrowScroll.ts' },
                    { name: 'useMaxRowSpan.ts' },
                    { name: 'useMergeCells.ts' },
                    { name: 'useRowExpand.ts' },
                    { name: 'useScrollbar.ts' },
                    { name: 'useScrollRowByRow.ts' },
                    { name: 'useSorter.ts' },
                    { name: 'useTableColumns.ts' },
                    { name: 'useThDrag.ts' },
                    { name: 'useTrDrag.ts' },
                    { name: 'useTree.ts' },
                    { name: 'useVirtualScroll.ts' },
                    { name: 'useWheeling.ts' },
                ],
            },
            { name: 'VirtualTree.vue' },
            { name: 'VirtualTreeSelect.vue' },
            { name: 'vite-env.d.ts' },
        ],
    },
    {
        name: 'test',
        children: [
            {
                name: 'AutoHeightStripe',
                children: [{ name: 'index.vue' }],
            },
            {
                name: 'perf',
                children: [
                    { name: 'README.md' },
                    { name: 'run-perf-benchmark.mjs' },
                    { name: 'scrollPerf.test.js' },
                ],
            },
            {
                name: 'StkTableExpandCell',
                children: [{ name: 'ExpandCell.jsx' }, { name: 'index.vue' }],
            },
            {
                name: 'utils',
                children: [{ name: 'DragResize.js' }, { name: 'h.js' }],
            },
            { name: 'autoHeightStripe.repro.test.js' },
            { name: 'AutoRowHeight.vue' },
            { name: 'autoRowHeightVirtualScroll.test.js' },
            { name: 'defaultSort.test.js' },
            { name: 'DocTable.vue' },
            { name: 'DragRow.vue' },
            { name: 'EditableCellDemo.vue' },
            { name: 'ExpandRow.vue' },
            { name: 'fileTreeDemo.test.ts' },
            { name: 'fileTreeStore.test.ts' },
            { name: 'filterSortVirtualScroll.repro.test.js' },
            { name: 'fixedColClass.test.js' },
            { name: 'FixedMode.vue' },
            { name: 'FlyInAnimation.vue' },
            { name: 'FocusOutIssue.vue' },
            { name: 'formatNumber.test.ts' },
            { name: 'insertToOrderedArray.test.js' },
            { name: 'NumberChangeCellDemo.vue' },
            { name: 'rowHeightSync.test.js' },
            { name: 'rowMergeVirtualScroll.repro.test.js' },
            { name: 'scrollTo.test.js' },
            { name: 'setSorter.test.js' },
            { name: 'setTreeExpandParents.test.js' },
            { name: 'silentScroll.test.js' },
            { name: 'StkTable.browser.test.js' },
            { name: 'StkTableHugeData.vue' },
            { name: 'StkTableInsertSort.vue' },
            { name: 'StkTableMultiHeader.vue' },
            { name: 'StkTableSimple.vue' },
            { name: 'StkTableTest.vue' },
            { name: 'treeCellParts.test.ts' },
            { name: 'treeComponents.test.ts' },
            { name: 'treeFoldContract.test.ts' },
            { name: 'treeGuideLine.test.ts' },
            { name: 'treeLazyLoad.test.ts' },
            { name: 'trReuse.repro.test.js' },
            { name: 'VirtualTree.vue' },
            { name: 'VirtualTreeSelect.vue' },
            { name: 'virtualXMerge.test.js' },
        ],
    },
    {
        name: 'type-tests',
        children: [
            { name: 'scrollTo.type-test.ts' },
            { name: 'treeComponents.type-test.ts' },
            { name: 'tsconfig.json' },
        ],
    },
    { name: '虚拟滚动表格开发.md' },
    { name: 'AGENTS.md' },
    { name: 'AI-API-REFERENCE.md' },
    { name: 'App.vue' },
    { name: 'CHANGELOG.md' },
    { name: 'index.html' },
    { name: 'index.js' },
    { name: 'jsconfig.json' },
    { name: 'LICENSE' },
    { name: 'llms.txt' },
    { name: 'package.json' },
    { name: 'pnpm-lock.yaml' },
    { name: 'pnpm-workspace.yaml' },
    { name: 'postcss.config.js' },
    { name: 'README.md' },
    { name: 'tsconfig.json' },
    { name: 'vite.config.ts' },
    { name: 'vitest.workspace.ts' },
    { name: 'watchPropsColumns.drawio' },
    { name: 'zIndex.drawio' },
];
