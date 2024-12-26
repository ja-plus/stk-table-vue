import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';
import { enConfig } from './src/config/en';
import path from 'path';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/stk-table-vue',
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
      { text: '文档', link: '/main/start/start' },
      { text: '示例', link: '/demos/huge-data' }
    ],
    sidebar: {
      '/main': {
        base: '/main',
        items: [
          {
            text: '开发指南',
            items: [
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
                  { text: '宽高', link: '/table/basic/size' },
                  { text: '列宽', link: '/table/basic/column-width', },
                  { text: '行高', link: '/table/basic/row-height', },
                  { text: '边框', link: '/table/basic/bordered' },
                  { text: '斑马纹', link: '/table/basic/stripe', },
                  { text: '固定列', link: '/table/basic/fixed', },
                  { text: '内容溢出省略', link: '/table/basic/overflow', },
                  { text: '排序', link: '/table/basic/sort', },
                  { text: '行、单元格选中/悬浮', link: '/table/basic/row-cell-mouse-event', },
                  { text: '无头', link: '/table/basic/headless', },
                  { text: '行展开', link: '/table/basic/expand-row', },
                  { text: '多级表头', link: '/table/basic/multi-header', },
                  { text: 'TODO:序号列', link: '/todo-page', },
                  { text: '空数据', link: '/table/basic/empty' },
                  { text: 'table-layout:fix', link: '/table/basic/fixed-mode', },
                ]
              },
              {
                text: '进阶功能',
                collapsed: false,
                items: [
                  { text: 'TODO:高亮行、单元格', link: '/todo-page', },
                  { text: 'TODO:虚拟列表', link: '/todo-page', },
                  { text: '不定行高虚拟列表', link: '/table/advanced/auto-height-virtual', },
                  { text: 'TODO:列宽调整', link: '/todo-page', },
                  { text: 'TODO:列更换顺序', link: '/todo-page', },
                  { text: 'TODO:自定义单元格', link: '/todo-page', },
                  { text: 'TODO:自定义表头', link: '/todo-page', },
                  { text: 'TODO:自定义排序', link: '/todo-page', },
                  { text: 'TODO:vue2 滚动优化', link: '/todo-page', },

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
              }
            ]
          }
        ]
      },
      '/demos':{
        base: '/demos',
        items: [
          { text: '大量数据', link: '/huge-data' },
        ]
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ja-plus/stk-table-vue' }
    ],
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
      md.use(vitepressDemoPlugin,{
        demoDir: path.resolve(__dirname, '../../docs-demo'), 
      });
    },
  }
})
