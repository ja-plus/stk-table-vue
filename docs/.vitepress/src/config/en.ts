import { defineConfig } from "vitepress";

export const enConfig = defineConfig({
    title: "stk-table-vue",
    description: "A virtual table for vue",
    lang: "zh",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Examples', link: '/markdown-examples' }
        ],

        sidebar: [
            {
                text: 'Examples',
                items: [
                    { text: 'Markdown Examples', link: '/markdown-examples' },
                    { text: 'Runtime API Examples', link: '/api-examples' },
                    { text: 'Base Examples', link: '/basic-usage' }
                ]
            }
        ],

    },
})