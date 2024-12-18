import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';
import { enConfig } from './src/config/en';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/stk-table-vue/',
  title: "StkTableVue",
  description: "A virtual table for vue",
  lastUpdated: true,
  lang: 'zh',
  appearance: 'dark',
  themeConfig: {
    logo: '/assets/logo.svg',
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
        text: '开发指南',
        items: [
          { text: '开始', link: '/start/start' },
          { text: '在vue2中使用', link: '/start/vue2-usage' },
          // { text: 'Runtime API Examples', link: '/api-examples' },
        ]
      }, {
        text: '表格',
        collapsed: true,
        items: [
          {
            text: '基础功能',
            collapsed: true,
            items: [
              { text: '基础', link: '/table/basic/basic' },
              { text: '宽高', link: '/table/basic/size' },
              { text: '空数据', link: '/table/basic/empty' },
              { text: '边框', link: '/table/basic/bordered' },
            ]
          },
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
