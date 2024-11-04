import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin'; 

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "stk-table-vue",
  description: "A virtual table for vue",
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

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ja-plus/stk-table-vue' }
    ]
  },
  markdown:{
    config(md) { 
      md.use(vitepressDemoPlugin); 
    },
  }
})
