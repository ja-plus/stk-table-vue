import { defineConfig } from "vitepress";

export const enConfig = defineConfig({
    title: "StkTableVue",
    description: "A high-performance virtual table for Vue",
    lang: "en",
    themeConfig: {
        search: {
            provider: 'local',
            options: {
                locales: {
                    en: {
                        translations: {
                            button: {
                                buttonText: 'Search Documentation',
                                buttonAriaLabel: 'Search Documentation'
                            },
                            modal: {
                                noResultsText: 'No results found',
                                resetButtonTitle: 'Clear search',
                                footer: {
                                    selectText: 'Select',
                                    navigateText: 'Navigate'
                                }
                            }
                        }
                    }
                }
            }
        },
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
            { text: 'Home', link: '/' },
            { text: 'Documentation', link: '/en/main/start/start' },
            { text: 'Demos', link: '/en/demos/huge-data' }
        ],
        sidebar: {
            '/main': {
                base: '/main',
                items: [
                    {
                        text: 'Development Guide',
                        items: [
                            { text: 'Introduction', link: '/en/start/introduce' },
                            { text: 'Getting Started', link: '/en/start/start' },
                            { text: 'Usage in Vue 2', link: '/en/start/vue2-usage' },
                        ]
                    }, {
                        text: 'Features',
                        items: [
                            {
                                text: 'Basic Features',
                                collapsed: false,
                                items: [
                                    { text: 'Basic', link: '/en/table/basic/basic' },
                                    { text: 'Theme (Light/Dark)', link: '/en/table/basic/theme' },
                                    { text: 'Size', link: '/en/table/basic/size' },
                                    { text: 'Bordered', link: '/en/table/basic/bordered' },
                                    { text: 'Alignment', link: '/en/table/basic/align' },
                                    { text: 'Column Width', link: '/en/table/basic/column-width' },
                                    { text: 'Row Height', link: '/en/table/basic/row-height' },
                                    { text: 'Stripe', link: '/en/table/basic/stripe' },
                                    { text: 'Fixed Columns', link: '/en/table/basic/fixed' },
                                    { text: 'Content Overflow', link: '/en/table/basic/overflow' },
                                    { text: 'Sorting', link: '/en/table/basic/sort' },
                                    { text: 'Row & Cell Selection/Hover', link: '/en/table/basic/row-cell-mouse-event' },
                                    { text: 'Cell Merging (✨NEW)', link: '/en/table/basic/merge-cells' },
                                    { text: 'Headless', link: '/en/table/basic/headless' },
                                    { text: 'Row Expansion', link: '/en/table/basic/expand-row' },
                                    { text: 'Tree', link: '/en/table/basic/tree' },
                                    { text: 'Multi-level Header', link: '/en/table/basic/multi-header' },
                                    { text: 'Sequence Column', link: '/en/table/basic/seq' },
                                    { text: 'Empty Data', link: '/en/table/basic/empty' },
                                    { text: 'Row & Column Unique Keys', link: '/en/table/basic/key' },
                                    { text: 'Scrollbar', link: '/en/table/basic/scrollbar' },
                                    { text: 'Table-layout: fixed', link: '/en/table/basic/fixed-mode' },
                                    { text: 'Row-by-Row Scrolling', link: '/en/table/basic/scroll-row-by-row' },
                                ]
                            },
                            {
                                text: 'Advanced Features',
                                collapsed: false,
                                items: [
                                    { text: 'Highlight Rows & Cells', link: '/en/table/advanced/highlight' },
                                    { text: 'Virtual List (Large Data)', link: '/en/table/advanced/virtual' },
                                    { text: 'Variable Row Height Virtual List', link: '/en/table/advanced/auto-height-virtual' },
                                    { text: 'Column Resize', link: '/en/table/advanced/column-resize' },
                                    { text: 'Column Drag Reorder', link: '/en/table/advanced/header-drag' },
                                    { text: 'Row Drag Reorder', link: '/en/table/advanced/row-drag' },
                                    { text: 'Custom Cell', link: '/en/table/advanced/custom-cell' },
                                    { text: 'Custom Sorting', link: '/en/table/advanced/custom-sort' },
                                    { text: 'Vue 2 Scroll Optimization', link: '/en/table/advanced/vue2-scroll-optimize' },
                                ]
                            },
                            {
                                text: 'API',
                                collapsed: false,
                                items: [
                                    { text: 'Table Props', link: '/en/api/table-props' },
                                    { text: 'StkTableColumn', link: '/en/api/stk-table-column' },
                                    { text: 'Emits', link: '/en/api/emits' },
                                    { text: 'Expose', link: '/en/api/expose' },
                                    { text: 'Slots', link: '/en/api/slots' },
                                ]
                            },
                            {
                                text: 'Other',
                                collapsed: false,
                                items: [
                                    { text: 'More Performance Optimization', link: '/en/other/optimize' },
                                    { text: 'Tips', link: '/en/other/tips' },
                                    { text: 'Q&A', link: '/en/other/qa' },
                                ]
                            }
                        ]
                    }
                ]
            },
            '/demos': {
                base: '/demos',
                items: [
                    { text: 'Huge Data', link: '/en/huge-data' },
                    { text: 'Virtual List', link: '/en/virtual-list' },
                    { text: 'Matrix', link: '/en/matrix' },
                    { text: 'Cell Edit', link: '/en/cell-edit' },
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