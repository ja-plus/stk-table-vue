import path from 'path';
import { defineConfig } from 'vitepress';
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';
import llmstxt from 'vitepress-plugin-llms';
import { enConfig } from './src/config/en';
import { zhConfig } from './src/config/zh';
import { jaConfig } from './src/config/ja';
import { koConfig } from './src/config/ko';

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
        ja: {
            label: '日本語',
            ...jaConfig,
        },
        ko: {
            label: '한국어',
            ...koConfig,
        },
    },
    markdown: {
        config(md) {
            md.use(vitepressDemoPlugin, {
                demoDir: path.resolve(__dirname, '../../docs-demo'),
                locale: {
                    zh: 'zh-CN',
                    'en': 'en-US',
                    'ja': 'ja-JP',
                    'ko': 'ko-KR'
                },
            });
        },
    },
});
