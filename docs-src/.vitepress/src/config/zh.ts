import { defineConfig } from "vitepress";

export const zhConfig = defineConfig({
    title: "StkTableVue",
    description: "一个基于Vue的高性能虚拟列表",
    lang: "zh",
    themeConfig: {
        search: {
            provider: 'local',
            options: {
                locales: {
                    root: {
                        translations: {
                            button: {
                                buttonText: '搜索文档',
                                buttonAriaLabel: '搜索文档'
                            },
                            modal: {
                                noResultsText: '无法找到相关结果',
                                resetButtonTitle: '清除查询条件',
                                footer: {
                                    selectText: '选择',
                                    navigateText: '切换'
                                }
                            }
                        }
                    }
                }
            }
        },
        darkModeSwitchLabel: "主题",
        docFooter: { prev: "上一篇", next: "下一篇", },
        lastUpdatedText: "最后更新",
        // nav: getZhCNNav(),
        outline: {
            level: [2, 6],
            label: "目录",
        },
        returnToTopLabel: "返回顶部",
        sidebarMenuLabel: "菜单",
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '主页', link: '/' },
            { text: '文档', link: '/main/start/start' },
            { text: '示例', link: '/demos/huge-data' },
        ],
        sidebar: {
            '/main': {
                base: '/main',
                items: [
                    {
                        text: '开发指南',
                        items: [
                            { text: '介绍', link: '/start/introduce' },
                            { text: '开始', link: '/start/start' },
                            { text: '在vue2中使用', link: '/start/vue2-usage' },
                            // { text: 'Runtime API Examples', link: '/api-examples' },
                        ]
                    }, {
                        text: '功能',
                        items: [
                            {
                                text: '基础功能',
                                collapsed: false,
                                items: [
                                    { text: '基础', link: '/table/basic/basic' },
                                    { text: '主题(亮/暗)', link: '/table/basic/theme' },
                                    { text: '宽高', link: '/table/basic/size' },
                                    { text: '边框', link: '/table/basic/bordered' },
                                    { text: '对齐方式', link: '/table/basic/align' },
                                    { text: '列宽', link: '/table/basic/column-width', },
                                    { text: '行高', link: '/table/basic/row-height', },
                                    { text: '斑马纹', link: '/table/basic/stripe', },
                                    { text: '固定列', link: '/table/basic/fixed', },
                                    { text: '内容溢出省略', link: '/table/basic/overflow', },
                                    { text: '排序', link: '/table/basic/sort', },
                                    { text: '行、单元格选中/悬浮', link: '/table/basic/row-cell-mouse-event', },
                                    { text: '复选框', link: '/table/basic/checkbox', },
                                    { text: '单元格合并', link: '/table/basic/merge-cells', },
                                    { text: '无头', link: '/table/basic/headless', },
                                    { text: '行展开', link: '/table/basic/expand-row', },
                                    { text: '树形', link: '/table/basic/tree', },
                                    { text: '多级表头', link: '/table/basic/multi-header', },
                                    { text: '序号列', link: '/table/basic/seq', },
                                    { text: '空数据', link: '/table/basic/empty' },
                                    { text: '行、列唯一键', link: '/table/basic/key', },
                                    { text: '滚动条', link: '/table/basic/scrollbar', },
                                    { text: 'table-layout:fix', link: '/table/basic/fixed-mode', },
                                    { text: '按行滚动', link: '/table/basic/scroll-row-by-row', },
                                ]
                            },
                            {
                                text: '进阶功能',
                                collapsed: false,
                                items: [
                                    { text: '高亮行、单元格', link: '/table/advanced/highlight', },
                                    { text: '虚拟列表(大量数据)', link: '/table/advanced/virtual', },
                                    { text: '不定行高虚拟列表', link: '/table/advanced/auto-height-virtual', },
                                    { text: '拖拽选区(✨NEW)', link: '/table/advanced/drag-selection' },
                                    { text: '列宽调整', link: '/table/advanced/column-resize', },
                                    { text: '列拖动更换顺序', link: '/table/advanced/header-drag', },
                                    { text: '行拖动更换顺序', link: '/table/advanced/row-drag', },
                                    { text: '自定义单元格', link: '/table/advanced/custom-cell', },
                                    { text: '自定义排序', link: '/table/advanced/custom-sort', },
                                    { text: 'Vue2 滚动优化', link: '/table/advanced/vue2-scroll-optimize', },

                                ]

                            },
                            {
                                text: 'API',
                                collapsed: false,
                                items: [
                                    { text: 'Table Props 表格配置', link: '/api/table-props' },
                                    { text: 'StkTableColumn 列配置', link: '/api/stk-table-column' },
                                    { text: 'Emits 事件', link: '/api/emits' },
                                    { text: 'Expose 实例方法', link: '/api/expose' },
                                    { text: 'Slots 插槽', link: '/api/slots' },
                                ]
                            },
                            {
                                text: '其他',
                                collapsed: false,
                                items: [
                                    { text: '右键菜单', link: '/other/contextmenu' },
                                    { text: '更多优化', link: '/other/optimize' },
                                    { text: 'Tips', link: '/other/tips' },
                                    { text: 'Q&A', link: '/other/qa' },
                                    { text: '变更日志', link: '/other/change' },
                                ]
                            }
                        ]
                    }
                ]
            },
            '/demos': {
                base: '/demos',
                items: [
                    { text: '大量数据', link: '/huge-data' },
                    { text: '虚拟单列表', link: '/virtual-list' },
                    { text: '矩阵', link: '/matrix' },
                    { text: '单元格编辑', link: '/cell-edit' },
                    { text: '面板树', link: '/panel-tree' },
                ]
            }
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/ja-plus/stk-table-vue' },
        ],
        footer: {
            message: '根据 MIT 许可证发布',
            copyright: 'Copyright © 2024-present japlus'
        }
    },
})