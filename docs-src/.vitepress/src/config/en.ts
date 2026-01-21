import { defineConfig } from "vitepress";

export const enConfig = defineConfig({
    title: "StkTableVue",
    description: "A high-performance virtual table for Vue",
    lang: "en",
    themeConfig: {
        darkModeSwitchLabel: "Theme",
        docFooter: { prev: "Previous", next: "Next" },
        lastUpdatedText: "Last Updated",
        outline: {
            level: [2, 6],
            label: "Table of Contents",
        },
        returnToTopLabel: "Back to Top",
        sidebarMenuLabel: "Menu",
        nav: [
            { text: 'Home', link: '/en/' },
            { text: 'Documentation', link: '/en/main/start/start' },
            { text: 'Demos', link: '/en/demos/huge-data' }
        ],
        sidebar: {
            '/en/main': {
                base: '/en/main',
                items: [
                    {
                        text: 'Development Guide',
                        items: [
                            { text: 'Introduction', link: '/start/introduce' },
                            { text: 'Getting Started', link: '/start/start' },
                            { text: 'Usage in Vue 2', link: '/start/vue2-usage' },
                        ]
                    }, {
                        text: 'Features',
                        items: [
                            {
                                text: 'Basic Features',
                                collapsed: false,
                                items: [
                                    { text: 'Basic', link: '/table/basic/basic' },
                                    { text: 'Theme (Light/Dark)', link: '/table/basic/theme' },
                                    { text: 'Size', link: '/table/basic/size' },
                                    { text: 'Bordered', link: '/table/basic/bordered' },
                                    { text: 'Alignment', link: '/table/basic/align' },
                                    { text: 'Column Width', link: '/table/basic/column-width' },
                                    { text: 'Row Height', link: '/table/basic/row-height' },
                                    { text: 'Stripe', link: '/table/basic/stripe' },
                                    { text: 'Fixed Columns', link: '/table/basic/fixed' },
                                    { text: 'Content Overflow', link: '/table/basic/overflow' },
                                    { text: 'Sorting', link: '/table/basic/sort' },
                                    { text: 'Row & Cell Selection/Hover', link: '/table/basic/row-cell-mouse-event' },
                                    { text: 'Checkbox', link: '/table/basic/checkbox' },
                                    { text: 'Cell Merging', link: '/table/basic/merge-cells' },
                                    { text: 'Headless', link: '/table/basic/headless' },
                                    { text: 'Row Expansion', link: '/table/basic/expand-row' },
                                    { text: 'Tree', link: '/table/basic/tree' },
                                    { text: 'Multi-level Header', link: '/table/basic/multi-header' },
                                    { text: 'Sequence Column', link: '/table/basic/seq' },
                                    { text: 'Empty Data', link: '/table/basic/empty' },
                                    { text: 'Row & Column Unique Keys', link: '/table/basic/key' },
                                    { text: 'Scrollbar', link: '/table/basic/scrollbar' },
                                    { text: 'Table-layout: fixed', link: '/table/basic/fixed-mode' },
                                    { text: 'Row-by-Row Scrolling', link: '/table/basic/scroll-row-by-row' },
                                ]
                            },
                            {
                                text: 'Advanced Features',
                                collapsed: false,
                                items: [
                                    { text: 'Highlight Rows & Cells', link: '/table/advanced/highlight' },
                                    { text: 'Virtual List (Large Data)', link: '/table/advanced/virtual' },
                                    { text: 'Variable Row Height Virtual List', link: '/table/advanced/auto-height-virtual' },
                                    { text: 'Column Resize', link: '/table/advanced/column-resize' },
                                    { text: 'Column Drag Reorder', link: '/table/advanced/header-drag' },
                                    { text: 'Row Drag Reorder', link: '/table/advanced/row-drag' },
                                    { text: 'Custom Cell', link: '/table/advanced/custom-cell' },
                                    { text: 'Custom Sorting', link: '/table/advanced/custom-sort' },
                                    { text: 'Vue 2 Scroll Optimization', link: '/table/advanced/vue2-scroll-optimize' },
                                ]
                            },
                            {
                                text: 'API',
                                collapsed: false,
                                items: [
                                    { text: 'Table Props', link: '/api/table-props' },
                                    { text: 'StkTableColumn', link: '/api/stk-table-column' },
                                    { text: 'Emits', link: '/api/emits' },
                                    { text: 'Expose', link: '/api/expose' },
                                    { text: 'Slots', link: '/api/slots' },
                                ]
                            },
                            {
                                text: 'Other',
                                collapsed: false,
                                items: [
                                    { text: 'More Performance Optimization', link: '/other/optimize' },
                                    { text: 'Tips', link: '/other/tips' },
                                    { text: 'Q&A', link: '/other/qa' },
                                ]
                            }
                        ]
                    }
                ]
            },
            '/en/demos': {
                base: '/en/demos',
                items: [
                    { text: 'Huge Data', link: '/huge-data' },
                    { text: 'Virtual List', link: '/virtual-list' },
                    { text: 'Matrix', link: '/matrix' },
                    { text: 'Cell Edit', link: '/cell-edit' },
                    { text: 'Panel Tree', link: '/panel-tree' },
                ]
            }
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/ja-plus/stk-table-vue' },
        ],
        footer: {
            message: 'Released under the MIT License',
            copyright: 'Copyright © 2024-present japlus'
        }
    },
})