import path from 'path';
import { defineConfig } from 'vitepress';
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';
import llmstxt from 'vitepress-plugin-llms';
import { enConfig } from './src/config/en';
import { zhConfig } from './src/config/zh';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    base: '/stk-table-vue',
    title: 'StkTableVue',
    lastUpdated: true,
    appearance: 'dark',
    vite: {
        plugins: [llmstxt()],
    },
    head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/stk-table-vue/assets/logo.svg' }]],
    themeConfig: {
        logo: '/assets/logo.svg',
        search: {
            provider: 'local',
        },
    },
    locales: {
        root: {
            label: '中文',
            ...zhConfig,
        },
        en: {
            label: 'English',
            ...enConfig,
        },
    },
    markdown: {
        config(md) {
            md.use(vitepressDemoPlugin, {
                demoDir: path.resolve(__dirname, '../../docs-demo'),
                locale: {
                    zh: 'zh-CN',
                    'en': 'en-US'
                },
            });
        },
    },
});
