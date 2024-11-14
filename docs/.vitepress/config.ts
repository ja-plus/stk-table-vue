import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';
import { enConfig } from './src/config/en';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "stk-table-vue",
  description: "A virtual table for vue",
  lastUpdated: true,
  lang: 'zh',
  themeConfig: {
    search: {
      provider: 'local'
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
      { text: '例子', link: '/markdown-examples' }
    ],
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ]
      }, {
        text: '表格',
        items: [
          { text: '基本表格', link: '/basic-usage' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ja-plus/stk-table-vue' }
    ]
  },
  locales: {
    root: {
      label: '中文',
      lang: 'zh',
    },
    en: {
      label: 'English',
      lang: 'en',
      ...enConfig
    }
  },
  markdown: {
    config(md) {
      md.use(vitepressDemoPlugin);
    },
  }
})
