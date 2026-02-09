// docs-src/.vitepress/config.ts
import path from "path";
import { defineConfig as defineConfig3 } from "file:///D:/stk-table-vue/node_modules/.pnpm/vitepress@1.6.4_@algolia+cl_61644ad52fd7736c1a463958bedcc66a/node_modules/vitepress/dist/node/index.js";
import { vitepressDemoPlugin } from "file:///D:/stk-table-vue/node_modules/.pnpm/vitepress-demo-plugin@1.5.1_1398341ecf4be785b66dd071d96a9838/node_modules/vitepress-demo-plugin/dist/index.js";
import llmstxt from "file:///D:/stk-table-vue/node_modules/.pnpm/vitepress-plugin-llms@1.10.0/node_modules/vitepress-plugin-llms/dist/index.js";

// docs-src/.vitepress/src/config/en.ts
import { defineConfig } from "file:///D:/stk-table-vue/node_modules/.pnpm/vitepress@1.6.4_@algolia+cl_61644ad52fd7736c1a463958bedcc66a/node_modules/vitepress/dist/node/index.js";
var enConfig = defineConfig({
  title: "StkTableVue",
  description: "A high-performance virtual table for Vue",
  lang: "en",
  themeConfig: {
    darkModeSwitchLabel: "Theme",
    docFooter: { prev: "Previous", next: "Next" },
    lastUpdatedText: "Last Updated",
    outline: {
      level: [2, 6],
      label: "Table of Contents"
    },
    returnToTopLabel: "Back to Top",
    sidebarMenuLabel: "Menu",
    nav: [
      { text: "Home", link: "/en/" },
      { text: "Documentation", link: "/en/main/start/start" },
      { text: "Demos", link: "/en/demos/huge-data" }
    ],
    sidebar: {
      "/en/main": {
        base: "/en/main",
        items: [
          {
            text: "Development Guide",
            items: [
              { text: "Introduction", link: "/start/introduce" },
              { text: "Getting Started", link: "/start/start" },
              { text: "Usage in Vue 2", link: "/start/vue2-usage" }
            ]
          },
          {
            text: "Features",
            items: [
              {
                text: "Basic Features",
                collapsed: false,
                items: [
                  { text: "Basic", link: "/table/basic/basic" },
                  { text: "Theme (Light/Dark)", link: "/table/basic/theme" },
                  { text: "Size", link: "/table/basic/size" },
                  { text: "Bordered", link: "/table/basic/bordered" },
                  { text: "Alignment", link: "/table/basic/align" },
                  { text: "Column Width", link: "/table/basic/column-width" },
                  { text: "Row Height", link: "/table/basic/row-height" },
                  { text: "Stripe", link: "/table/basic/stripe" },
                  { text: "Fixed Columns", link: "/table/basic/fixed" },
                  { text: "Content Overflow", link: "/table/basic/overflow" },
                  { text: "Sorting", link: "/table/basic/sort" },
                  { text: "Row & Cell Selection/Hover", link: "/table/basic/row-cell-mouse-event" },
                  { text: "Checkbox", link: "/table/basic/checkbox" },
                  { text: "Cell Merging", link: "/table/basic/merge-cells" },
                  { text: "Headless", link: "/table/basic/headless" },
                  { text: "Row Expansion", link: "/table/basic/expand-row" },
                  { text: "Tree", link: "/table/basic/tree" },
                  { text: "Multi-level Header", link: "/table/basic/multi-header" },
                  { text: "Sequence Column", link: "/table/basic/seq" },
                  { text: "Empty Data", link: "/table/basic/empty" },
                  { text: "Row & Column Unique Keys", link: "/table/basic/key" },
                  { text: "Scrollbar", link: "/table/basic/scrollbar" },
                  { text: "Table-layout: fixed", link: "/table/basic/fixed-mode" },
                  { text: "Row-by-Row Scrolling", link: "/table/basic/scroll-row-by-row" }
                ]
              },
              {
                text: "Advanced Features",
                collapsed: false,
                items: [
                  { text: "Highlight Rows & Cells", link: "/table/advanced/highlight" },
                  { text: "Virtual List (Large Data)", link: "/table/advanced/virtual" },
                  { text: "Variable Row Height Virtual List", link: "/table/advanced/auto-height-virtual" },
                  { text: "Column Resize", link: "/table/advanced/column-resize" },
                  { text: "Column Drag Reorder", link: "/table/advanced/header-drag" },
                  { text: "Row Drag Reorder", link: "/table/advanced/row-drag" },
                  { text: "Custom Cell", link: "/table/advanced/custom-cell" },
                  { text: "Custom Sorting", link: "/table/advanced/custom-sort" },
                  { text: "Vue 2 Scroll Optimization", link: "/table/advanced/vue2-scroll-optimize" }
                ]
              },
              {
                text: "API",
                collapsed: false,
                items: [
                  { text: "Table Props", link: "/api/table-props" },
                  { text: "StkTableColumn", link: "/api/stk-table-column" },
                  { text: "Emits", link: "/api/emits" },
                  { text: "Expose", link: "/api/expose" },
                  { text: "Slots", link: "/api/slots" }
                ]
              },
              {
                text: "Other",
                collapsed: false,
                items: [
                  { text: "More Performance Optimization", link: "/other/optimize" },
                  { text: "Tips", link: "/other/tips" },
                  { text: "Q&A", link: "/other/qa" },
                  { text: "Change Log", link: "/other/change" }
                ]
              }
            ]
          }
        ]
      },
      "/en/demos": {
        base: "/en/demos",
        items: [
          { text: "Huge Data", link: "/huge-data" },
          { text: "Virtual List", link: "/virtual-list" },
          { text: "Matrix", link: "/matrix" },
          { text: "Cell Edit", link: "/cell-edit" },
          { text: "Panel Tree", link: "/panel-tree" }
        ]
      }
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/ja-plus/stk-table-vue" }
    ],
    footer: {
      message: "Released under the MIT License",
      copyright: "Copyright \xA9 2024-present japlus"
    }
  }
});

// docs-src/.vitepress/src/config/zh.ts
import { defineConfig as defineConfig2 } from "file:///D:/stk-table-vue/node_modules/.pnpm/vitepress@1.6.4_@algolia+cl_61644ad52fd7736c1a463958bedcc66a/node_modules/vitepress/dist/node/index.js";
var zhConfig = defineConfig2({
  title: "StkTableVue",
  description: "\u4E00\u4E2A\u57FA\u4E8EVue\u7684\u9AD8\u6027\u80FD\u865A\u62DF\u5217\u8868",
  lang: "zh",
  themeConfig: {
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "\u641C\u7D22\u6587\u6863",
                buttonAriaLabel: "\u641C\u7D22\u6587\u6863"
              },
              modal: {
                noResultsText: "\u65E0\u6CD5\u627E\u5230\u76F8\u5173\u7ED3\u679C",
                resetButtonTitle: "\u6E05\u9664\u67E5\u8BE2\u6761\u4EF6",
                footer: {
                  selectText: "\u9009\u62E9",
                  navigateText: "\u5207\u6362"
                }
              }
            }
          }
        }
      }
    },
    darkModeSwitchLabel: "\u4E3B\u9898",
    docFooter: { prev: "\u4E0A\u4E00\u7BC7", next: "\u4E0B\u4E00\u7BC7" },
    lastUpdatedText: "\u6700\u540E\u66F4\u65B0",
    // nav: getZhCNNav(),
    outline: {
      level: [2, 6],
      label: "\u76EE\u5F55"
    },
    returnToTopLabel: "\u8FD4\u56DE\u9876\u90E8",
    sidebarMenuLabel: "\u83DC\u5355",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "\u4E3B\u9875", link: "/" },
      { text: "\u6587\u6863", link: "/main/start/start" },
      { text: "\u793A\u4F8B", link: "/demos/huge-data" }
    ],
    sidebar: {
      "/main": {
        base: "/main",
        items: [
          {
            text: "\u5F00\u53D1\u6307\u5357",
            items: [
              { text: "\u4ECB\u7ECD", link: "/start/introduce" },
              { text: "\u5F00\u59CB", link: "/start/start" },
              { text: "\u5728vue2\u4E2D\u4F7F\u7528", link: "/start/vue2-usage" }
              // { text: 'Runtime API Examples', link: '/api-examples' },
            ]
          },
          {
            text: "\u529F\u80FD",
            items: [
              {
                text: "\u57FA\u7840\u529F\u80FD",
                collapsed: false,
                items: [
                  { text: "\u57FA\u7840", link: "/table/basic/basic" },
                  { text: "\u4E3B\u9898(\u4EAE/\u6697)", link: "/table/basic/theme" },
                  { text: "\u5BBD\u9AD8", link: "/table/basic/size" },
                  { text: "\u8FB9\u6846", link: "/table/basic/bordered" },
                  { text: "\u5BF9\u9F50\u65B9\u5F0F", link: "/table/basic/align" },
                  { text: "\u5217\u5BBD", link: "/table/basic/column-width" },
                  { text: "\u884C\u9AD8", link: "/table/basic/row-height" },
                  { text: "\u6591\u9A6C\u7EB9", link: "/table/basic/stripe" },
                  { text: "\u56FA\u5B9A\u5217", link: "/table/basic/fixed" },
                  { text: "\u5185\u5BB9\u6EA2\u51FA\u7701\u7565", link: "/table/basic/overflow" },
                  { text: "\u6392\u5E8F", link: "/table/basic/sort" },
                  { text: "\u884C\u3001\u5355\u5143\u683C\u9009\u4E2D/\u60AC\u6D6E", link: "/table/basic/row-cell-mouse-event" },
                  { text: "\u590D\u9009\u6846", link: "/table/basic/checkbox" },
                  { text: "\u5355\u5143\u683C\u5408\u5E76", link: "/table/basic/merge-cells" },
                  { text: "\u65E0\u5934", link: "/table/basic/headless" },
                  { text: "\u884C\u5C55\u5F00", link: "/table/basic/expand-row" },
                  { text: "\u6811\u5F62", link: "/table/basic/tree" },
                  { text: "\u591A\u7EA7\u8868\u5934", link: "/table/basic/multi-header" },
                  { text: "\u5E8F\u53F7\u5217", link: "/table/basic/seq" },
                  { text: "\u7A7A\u6570\u636E", link: "/table/basic/empty" },
                  { text: "\u884C\u3001\u5217\u552F\u4E00\u952E", link: "/table/basic/key" },
                  { text: "\u6EDA\u52A8\u6761", link: "/table/basic/scrollbar" },
                  { text: "table-layout:fix", link: "/table/basic/fixed-mode" },
                  { text: "\u6309\u884C\u6EDA\u52A8", link: "/table/basic/scroll-row-by-row" }
                ]
              },
              {
                text: "\u8FDB\u9636\u529F\u80FD",
                collapsed: false,
                items: [
                  { text: "\u9AD8\u4EAE\u884C\u3001\u5355\u5143\u683C", link: "/table/advanced/highlight" },
                  { text: "\u865A\u62DF\u5217\u8868(\u5927\u91CF\u6570\u636E)", link: "/table/advanced/virtual" },
                  { text: "\u4E0D\u5B9A\u884C\u9AD8\u865A\u62DF\u5217\u8868", link: "/table/advanced/auto-height-virtual" },
                  { text: "\u5217\u5BBD\u8C03\u6574", link: "/table/advanced/column-resize" },
                  { text: "\u5217\u62D6\u52A8\u66F4\u6362\u987A\u5E8F", link: "/table/advanced/header-drag" },
                  { text: "\u884C\u62D6\u52A8\u66F4\u6362\u987A\u5E8F", link: "/table/advanced/row-drag" },
                  { text: "\u81EA\u5B9A\u4E49\u5355\u5143\u683C", link: "/table/advanced/custom-cell" },
                  { text: "\u81EA\u5B9A\u4E49\u6392\u5E8F", link: "/table/advanced/custom-sort" },
                  { text: "Vue2 \u6EDA\u52A8\u4F18\u5316", link: "/table/advanced/vue2-scroll-optimize" }
                ]
              },
              {
                text: "API",
                collapsed: false,
                items: [
                  { text: "Table Props \u8868\u683C\u914D\u7F6E", link: "/api/table-props" },
                  { text: "StkTableColumn \u5217\u914D\u7F6E", link: "/api/stk-table-column" },
                  { text: "Emits \u4E8B\u4EF6", link: "/api/emits" },
                  { text: "Expose \u5B9E\u4F8B\u65B9\u6CD5", link: "/api/expose" },
                  { text: "Slots \u63D2\u69FD", link: "/api/slots" }
                ]
              },
              {
                text: "\u5176\u4ED6",
                collapsed: false,
                items: [
                  { text: "\u66F4\u591A\u4F18\u5316", link: "/other/optimize" },
                  { text: "Tips", link: "/other/tips" },
                  { text: "Q&A", link: "/other/qa" },
                  { text: "\u53D8\u66F4\u65E5\u5FD7", link: "/other/change" }
                ]
              }
            ]
          }
        ]
      },
      "/demos": {
        base: "/demos",
        items: [
          { text: "\u5927\u91CF\u6570\u636E", link: "/huge-data" },
          { text: "\u865A\u62DF\u5355\u5217\u8868", link: "/virtual-list" },
          { text: "\u77E9\u9635", link: "/matrix" },
          { text: "\u5355\u5143\u683C\u7F16\u8F91", link: "/cell-edit" },
          { text: "\u9762\u677F\u6811", link: "/panel-tree" }
        ]
      }
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/ja-plus/stk-table-vue" }
    ],
    footer: {
      message: "\u6839\u636E MIT \u8BB8\u53EF\u8BC1\u53D1\u5E03",
      copyright: "Copyright \xA9 2024-present japlus"
    }
  }
});

// docs-src/.vitepress/config.ts
var __vite_injected_original_dirname = "D:\\stk-table-vue\\docs-src\\.vitepress";
var config_default = defineConfig3({
  base: "/stk-table-vue",
  title: "StkTableVue",
  lastUpdated: true,
  appearance: "dark",
  vite: {
    plugins: [llmstxt()]
  },
  head: [["link", { rel: "icon", type: "image/svg+xml", href: "/stk-table-vue/assets/logo.svg" }]],
  themeConfig: {
    logo: "/assets/logo.svg",
    search: {
      provider: "local"
    }
  },
  locales: {
    root: {
      label: "\u4E2D\u6587",
      ...zhConfig
    },
    en: {
      label: "English",
      ...enConfig
    }
  },
  markdown: {
    config(md) {
      md.use(vitepressDemoPlugin, {
        demoDir: path.resolve(__vite_injected_original_dirname, "../../docs-demo"),
        locale: {
          zh: "zh-CN",
          "en": "en-US"
        }
      });
    }
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy1zcmMvLnZpdGVwcmVzcy9jb25maWcudHMiLCAiZG9jcy1zcmMvLnZpdGVwcmVzcy9zcmMvY29uZmlnL2VuLnRzIiwgImRvY3Mtc3JjLy52aXRlcHJlc3Mvc3JjL2NvbmZpZy96aC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXHN0ay10YWJsZS12dWVcXFxcZG9jcy1zcmNcXFxcLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcc3RrLXRhYmxlLXZ1ZVxcXFxkb2NzLXNyY1xcXFwudml0ZXByZXNzXFxcXGNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovc3RrLXRhYmxlLXZ1ZS9kb2NzLXNyYy8udml0ZXByZXNzL2NvbmZpZy50c1wiO2ltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlcHJlc3MnO1xyXG5pbXBvcnQgeyB2aXRlcHJlc3NEZW1vUGx1Z2luIH0gZnJvbSAndml0ZXByZXNzLWRlbW8tcGx1Z2luJztcclxuaW1wb3J0IGxsbXN0eHQgZnJvbSAndml0ZXByZXNzLXBsdWdpbi1sbG1zJztcclxuaW1wb3J0IHsgZW5Db25maWcgfSBmcm9tICcuL3NyYy9jb25maWcvZW4nO1xyXG5pbXBvcnQgeyB6aENvbmZpZyB9IGZyb20gJy4vc3JjL2NvbmZpZy96aCc7XHJcblxyXG4vLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL3NpdGUtY29uZmlnXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICBiYXNlOiAnL3N0ay10YWJsZS12dWUnLFxyXG4gICAgdGl0bGU6ICdTdGtUYWJsZVZ1ZScsXHJcbiAgICBsYXN0VXBkYXRlZDogdHJ1ZSxcclxuICAgIGFwcGVhcmFuY2U6ICdkYXJrJyxcclxuICAgIHZpdGU6IHtcclxuICAgICAgICBwbHVnaW5zOiBbbGxtc3R4dCgpXSxcclxuICAgIH0sXHJcbiAgICBoZWFkOiBbWydsaW5rJywgeyByZWw6ICdpY29uJywgdHlwZTogJ2ltYWdlL3N2Zyt4bWwnLCBocmVmOiAnL3N0ay10YWJsZS12dWUvYXNzZXRzL2xvZ28uc3ZnJyB9XV0sXHJcbiAgICB0aGVtZUNvbmZpZzoge1xyXG4gICAgICAgIGxvZ286ICcvYXNzZXRzL2xvZ28uc3ZnJyxcclxuICAgICAgICBzZWFyY2g6IHtcclxuICAgICAgICAgICAgcHJvdmlkZXI6ICdsb2NhbCcsXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBsb2NhbGVzOiB7XHJcbiAgICAgICAgcm9vdDoge1xyXG4gICAgICAgICAgICBsYWJlbDogJ1x1NEUyRFx1NjU4NycsXHJcbiAgICAgICAgICAgIC4uLnpoQ29uZmlnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW46IHtcclxuICAgICAgICAgICAgbGFiZWw6ICdFbmdsaXNoJyxcclxuICAgICAgICAgICAgLi4uZW5Db25maWcsXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBtYXJrZG93bjoge1xyXG4gICAgICAgIGNvbmZpZyhtZCkge1xyXG4gICAgICAgICAgICBtZC51c2Uodml0ZXByZXNzRGVtb1BsdWdpbiwge1xyXG4gICAgICAgICAgICAgICAgZGVtb0RpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL2RvY3MtZGVtbycpLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgemg6ICd6aC1DTicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2VuJzogJ2VuLVVTJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbn0pO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXHN0ay10YWJsZS12dWVcXFxcZG9jcy1zcmNcXFxcLnZpdGVwcmVzc1xcXFxzcmNcXFxcY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxzdGstdGFibGUtdnVlXFxcXGRvY3Mtc3JjXFxcXC52aXRlcHJlc3NcXFxcc3JjXFxcXGNvbmZpZ1xcXFxlbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovc3RrLXRhYmxlLXZ1ZS9kb2NzLXNyYy8udml0ZXByZXNzL3NyYy9jb25maWcvZW4udHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZXByZXNzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZW5Db25maWcgPSBkZWZpbmVDb25maWcoe1xyXG4gICAgdGl0bGU6IFwiU3RrVGFibGVWdWVcIixcclxuICAgIGRlc2NyaXB0aW9uOiBcIkEgaGlnaC1wZXJmb3JtYW5jZSB2aXJ0dWFsIHRhYmxlIGZvciBWdWVcIixcclxuICAgIGxhbmc6IFwiZW5cIixcclxuICAgIHRoZW1lQ29uZmlnOiB7XHJcbiAgICAgICAgZGFya01vZGVTd2l0Y2hMYWJlbDogXCJUaGVtZVwiLFxyXG4gICAgICAgIGRvY0Zvb3RlcjogeyBwcmV2OiBcIlByZXZpb3VzXCIsIG5leHQ6IFwiTmV4dFwiIH0sXHJcbiAgICAgICAgbGFzdFVwZGF0ZWRUZXh0OiBcIkxhc3QgVXBkYXRlZFwiLFxyXG4gICAgICAgIG91dGxpbmU6IHtcclxuICAgICAgICAgICAgbGV2ZWw6IFsyLCA2XSxcclxuICAgICAgICAgICAgbGFiZWw6IFwiVGFibGUgb2YgQ29udGVudHNcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJldHVyblRvVG9wTGFiZWw6IFwiQmFjayB0byBUb3BcIixcclxuICAgICAgICBzaWRlYmFyTWVudUxhYmVsOiBcIk1lbnVcIixcclxuICAgICAgICBuYXY6IFtcclxuICAgICAgICAgICAgeyB0ZXh0OiAnSG9tZScsIGxpbms6ICcvZW4vJyB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdEb2N1bWVudGF0aW9uJywgbGluazogJy9lbi9tYWluL3N0YXJ0L3N0YXJ0JyB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdEZW1vcycsIGxpbms6ICcvZW4vZGVtb3MvaHVnZS1kYXRhJyB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBzaWRlYmFyOiB7XHJcbiAgICAgICAgICAgICcvZW4vbWFpbic6IHtcclxuICAgICAgICAgICAgICAgIGJhc2U6ICcvZW4vbWFpbicsXHJcbiAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0RldmVsb3BtZW50IEd1aWRlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0ludHJvZHVjdGlvbicsIGxpbms6ICcvc3RhcnQvaW50cm9kdWNlJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnR2V0dGluZyBTdGFydGVkJywgbGluazogJy9zdGFydC9zdGFydCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1VzYWdlIGluIFZ1ZSAyJywgbGluazogJy9zdGFydC92dWUyLXVzYWdlJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnRmVhdHVyZXMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdCYXNpYyBGZWF0dXJlcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdCYXNpYycsIGxpbms6ICcvdGFibGUvYmFzaWMvYmFzaWMnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1RoZW1lIChMaWdodC9EYXJrKScsIGxpbms6ICcvdGFibGUvYmFzaWMvdGhlbWUnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1NpemUnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL3NpemUnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0JvcmRlcmVkJywgbGluazogJy90YWJsZS9iYXNpYy9ib3JkZXJlZCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnQWxpZ25tZW50JywgbGluazogJy90YWJsZS9iYXNpYy9hbGlnbicgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnQ29sdW1uIFdpZHRoJywgbGluazogJy90YWJsZS9iYXNpYy9jb2x1bW4td2lkdGgnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1JvdyBIZWlnaHQnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL3Jvdy1oZWlnaHQnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1N0cmlwZScsIGxpbms6ICcvdGFibGUvYmFzaWMvc3RyaXBlJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdGaXhlZCBDb2x1bW5zJywgbGluazogJy90YWJsZS9iYXNpYy9maXhlZCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnQ29udGVudCBPdmVyZmxvdycsIGxpbms6ICcvdGFibGUvYmFzaWMvb3ZlcmZsb3cnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1NvcnRpbmcnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL3NvcnQnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1JvdyAmIENlbGwgU2VsZWN0aW9uL0hvdmVyJywgbGluazogJy90YWJsZS9iYXNpYy9yb3ctY2VsbC1tb3VzZS1ldmVudCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnQ2hlY2tib3gnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL2NoZWNrYm94JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdDZWxsIE1lcmdpbmcnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL21lcmdlLWNlbGxzJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdIZWFkbGVzcycsIGxpbms6ICcvdGFibGUvYmFzaWMvaGVhZGxlc3MnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1JvdyBFeHBhbnNpb24nLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL2V4cGFuZC1yb3cnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1RyZWUnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL3RyZWUnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ011bHRpLWxldmVsIEhlYWRlcicsIGxpbms6ICcvdGFibGUvYmFzaWMvbXVsdGktaGVhZGVyJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdTZXF1ZW5jZSBDb2x1bW4nLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL3NlcScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnRW1wdHkgRGF0YScsIGxpbms6ICcvdGFibGUvYmFzaWMvZW1wdHknIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1JvdyAmIENvbHVtbiBVbmlxdWUgS2V5cycsIGxpbms6ICcvdGFibGUvYmFzaWMva2V5JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdTY3JvbGxiYXInLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL3Njcm9sbGJhcicgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnVGFibGUtbGF5b3V0OiBmaXhlZCcsIGxpbms6ICcvdGFibGUvYmFzaWMvZml4ZWQtbW9kZScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnUm93LWJ5LVJvdyBTY3JvbGxpbmcnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL3Njcm9sbC1yb3ctYnktcm93JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0FkdmFuY2VkIEZlYXR1cmVzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0hpZ2hsaWdodCBSb3dzICYgQ2VsbHMnLCBsaW5rOiAnL3RhYmxlL2FkdmFuY2VkL2hpZ2hsaWdodCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnVmlydHVhbCBMaXN0IChMYXJnZSBEYXRhKScsIGxpbms6ICcvdGFibGUvYWR2YW5jZWQvdmlydHVhbCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnVmFyaWFibGUgUm93IEhlaWdodCBWaXJ0dWFsIExpc3QnLCBsaW5rOiAnL3RhYmxlL2FkdmFuY2VkL2F1dG8taGVpZ2h0LXZpcnR1YWwnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0NvbHVtbiBSZXNpemUnLCBsaW5rOiAnL3RhYmxlL2FkdmFuY2VkL2NvbHVtbi1yZXNpemUnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0NvbHVtbiBEcmFnIFJlb3JkZXInLCBsaW5rOiAnL3RhYmxlL2FkdmFuY2VkL2hlYWRlci1kcmFnJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdSb3cgRHJhZyBSZW9yZGVyJywgbGluazogJy90YWJsZS9hZHZhbmNlZC9yb3ctZHJhZycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnQ3VzdG9tIENlbGwnLCBsaW5rOiAnL3RhYmxlL2FkdmFuY2VkL2N1c3RvbS1jZWxsJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdDdXN0b20gU29ydGluZycsIGxpbms6ICcvdGFibGUvYWR2YW5jZWQvY3VzdG9tLXNvcnQnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1Z1ZSAyIFNjcm9sbCBPcHRpbWl6YXRpb24nLCBsaW5rOiAnL3RhYmxlL2FkdmFuY2VkL3Z1ZTItc2Nyb2xsLW9wdGltaXplJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0FQSScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdUYWJsZSBQcm9wcycsIGxpbms6ICcvYXBpL3RhYmxlLXByb3BzJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdTdGtUYWJsZUNvbHVtbicsIGxpbms6ICcvYXBpL3N0ay10YWJsZS1jb2x1bW4nIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0VtaXRzJywgbGluazogJy9hcGkvZW1pdHMnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0V4cG9zZScsIGxpbms6ICcvYXBpL2V4cG9zZScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnU2xvdHMnLCBsaW5rOiAnL2FwaS9zbG90cycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdPdGhlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdNb3JlIFBlcmZvcm1hbmNlIE9wdGltaXphdGlvbicsIGxpbms6ICcvb3RoZXIvb3B0aW1pemUnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1RpcHMnLCBsaW5rOiAnL290aGVyL3RpcHMnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1EmQScsIGxpbms6ICcvb3RoZXIvcWEnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0NoYW5nZSBMb2cnLCBsaW5rOiAnL290aGVyL2NoYW5nZScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICcvZW4vZGVtb3MnOiB7XHJcbiAgICAgICAgICAgICAgICBiYXNlOiAnL2VuL2RlbW9zJyxcclxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnSHVnZSBEYXRhJywgbGluazogJy9odWdlLWRhdGEnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnVmlydHVhbCBMaXN0JywgbGluazogJy92aXJ0dWFsLWxpc3QnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnTWF0cml4JywgbGluazogJy9tYXRyaXgnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnQ2VsbCBFZGl0JywgbGluazogJy9jZWxsLWVkaXQnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnUGFuZWwgVHJlZScsIGxpbms6ICcvcGFuZWwtdHJlZScgfSxcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc29jaWFsTGlua3M6IFtcclxuICAgICAgICAgICAgeyBpY29uOiAnZ2l0aHViJywgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS9qYS1wbHVzL3N0ay10YWJsZS12dWUnIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICBmb290ZXI6IHtcclxuICAgICAgICAgICAgbWVzc2FnZTogJ1JlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZScsXHJcbiAgICAgICAgICAgIGNvcHlyaWdodDogJ0NvcHlyaWdodCBcdTAwQTkgMjAyNC1wcmVzZW50IGphcGx1cydcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG59KSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcc3RrLXRhYmxlLXZ1ZVxcXFxkb2NzLXNyY1xcXFwudml0ZXByZXNzXFxcXHNyY1xcXFxjb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHN0ay10YWJsZS12dWVcXFxcZG9jcy1zcmNcXFxcLnZpdGVwcmVzc1xcXFxzcmNcXFxcY29uZmlnXFxcXHpoLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9zdGstdGFibGUtdnVlL2RvY3Mtc3JjLy52aXRlcHJlc3Mvc3JjL2NvbmZpZy96aC50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlcHJlc3NcIjtcclxuXHJcbmV4cG9ydCBjb25zdCB6aENvbmZpZyA9IGRlZmluZUNvbmZpZyh7XHJcbiAgICB0aXRsZTogXCJTdGtUYWJsZVZ1ZVwiLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXHU0RTAwXHU0RTJBXHU1N0ZBXHU0RThFVnVlXHU3Njg0XHU5QUQ4XHU2MDI3XHU4MEZEXHU4NjVBXHU2MkRGXHU1MjE3XHU4ODY4XCIsXHJcbiAgICBsYW5nOiBcInpoXCIsXHJcbiAgICB0aGVtZUNvbmZpZzoge1xyXG4gICAgICAgIHNlYXJjaDoge1xyXG4gICAgICAgICAgICBwcm92aWRlcjogJ2xvY2FsJyxcclxuICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvb3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25UZXh0OiAnXHU2NDFDXHU3RDIyXHU2NTg3XHU2ODYzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25BcmlhTGFiZWw6ICdcdTY0MUNcdTdEMjJcdTY1ODdcdTY4NjMnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kYWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub1Jlc3VsdHNUZXh0OiAnXHU2NUUwXHU2Q0Q1XHU2MjdFXHU1MjMwXHU3NkY4XHU1MTczXHU3RUQzXHU2NzlDJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNldEJ1dHRvblRpdGxlOiAnXHU2RTA1XHU5NjY0XHU2N0U1XHU4QkUyXHU2NzYxXHU0RUY2JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb290ZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0VGV4dDogJ1x1OTAwOVx1NjJFOScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRlVGV4dDogJ1x1NTIwN1x1NjM2MidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhcmtNb2RlU3dpdGNoTGFiZWw6IFwiXHU0RTNCXHU5ODk4XCIsXHJcbiAgICAgICAgZG9jRm9vdGVyOiB7IHByZXY6IFwiXHU0RTBBXHU0RTAwXHU3QkM3XCIsIG5leHQ6IFwiXHU0RTBCXHU0RTAwXHU3QkM3XCIsIH0sXHJcbiAgICAgICAgbGFzdFVwZGF0ZWRUZXh0OiBcIlx1NjcwMFx1NTQwRVx1NjZGNFx1NjVCMFwiLFxyXG4gICAgICAgIC8vIG5hdjogZ2V0WmhDTk5hdigpLFxyXG4gICAgICAgIG91dGxpbmU6IHtcclxuICAgICAgICAgICAgbGV2ZWw6IFsyLCA2XSxcclxuICAgICAgICAgICAgbGFiZWw6IFwiXHU3NkVFXHU1RjU1XCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXR1cm5Ub1RvcExhYmVsOiBcIlx1OEZENFx1NTZERVx1OTg3Nlx1OTBFOFwiLFxyXG4gICAgICAgIHNpZGViYXJNZW51TGFiZWw6IFwiXHU4M0RDXHU1MzU1XCIsXHJcbiAgICAgICAgLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9kZWZhdWx0LXRoZW1lLWNvbmZpZ1xyXG4gICAgICAgIG5hdjogW1xyXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTRFM0JcdTk4NzUnLCBsaW5rOiAnLycgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU2NTg3XHU2ODYzJywgbGluazogJy9tYWluL3N0YXJ0L3N0YXJ0JyB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTc5M0FcdTRGOEInLCBsaW5rOiAnL2RlbW9zL2h1Z2UtZGF0YScgfSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIHNpZGViYXI6IHtcclxuICAgICAgICAgICAgJy9tYWluJzoge1xyXG4gICAgICAgICAgICAgICAgYmFzZTogJy9tYWluJyxcclxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1RjAwXHU1M0QxXHU2MzA3XHU1MzU3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NEVDQlx1N0VDRCcsIGxpbms6ICcvc3RhcnQvaW50cm9kdWNlJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1RjAwXHU1OUNCJywgbGluazogJy9zdGFydC9zdGFydCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NTcyOHZ1ZTJcdTRFMkRcdTRGN0ZcdTc1MjgnLCBsaW5rOiAnL3N0YXJ0L3Z1ZTItdXNhZ2UnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB7IHRleHQ6ICdSdW50aW1lIEFQSSBFeGFtcGxlcycsIGxpbms6ICcvYXBpLWV4YW1wbGVzJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1MjlGXHU4MEZEJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1N0ZBXHU3ODQwXHU1MjlGXHU4MEZEJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NTdGQVx1Nzg0MCcsIGxpbms6ICcvdGFibGUvYmFzaWMvYmFzaWMnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NEUzQlx1OTg5OChcdTRFQUUvXHU2Njk3KScsIGxpbms6ICcvdGFibGUvYmFzaWMvdGhlbWUnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NUJCRFx1OUFEOCcsIGxpbms6ICcvdGFibGUvYmFzaWMvc2l6ZScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4RkI5XHU2ODQ2JywgbGluazogJy90YWJsZS9iYXNpYy9ib3JkZXJlZCcgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1QkY5XHU5RjUwXHU2NUI5XHU1RjBGJywgbGluazogJy90YWJsZS9iYXNpYy9hbGlnbicgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1MjE3XHU1QkJEJywgbGluazogJy90YWJsZS9iYXNpYy9jb2x1bW4td2lkdGgnLCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTg4NENcdTlBRDgnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL3Jvdy1oZWlnaHQnLCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTY1OTFcdTlBNkNcdTdFQjknLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL3N0cmlwZScsIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NTZGQVx1NUI5QVx1NTIxNycsIGxpbms6ICcvdGFibGUvYmFzaWMvZml4ZWQnLCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTUxODVcdTVCQjlcdTZFQTJcdTUxRkFcdTc3MDFcdTc1NjUnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL292ZXJmbG93JywgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU2MzkyXHU1RThGJywgbGluazogJy90YWJsZS9iYXNpYy9zb3J0JywgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4ODRDXHUzMDAxXHU1MzU1XHU1MTQzXHU2ODNDXHU5MDA5XHU0RTJEL1x1NjBBQ1x1NkQ2RScsIGxpbms6ICcvdGFibGUvYmFzaWMvcm93LWNlbGwtbW91c2UtZXZlbnQnLCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTU5MERcdTkwMDlcdTY4NDYnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL2NoZWNrYm94JywgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU1MzU1XHU1MTQzXHU2ODNDXHU1NDA4XHU1RTc2JywgbGluazogJy90YWJsZS9iYXNpYy9tZXJnZS1jZWxscycsIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NjVFMFx1NTkzNCcsIGxpbms6ICcvdGFibGUvYmFzaWMvaGVhZGxlc3MnLCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTg4NENcdTVDNTVcdTVGMDAnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL2V4cGFuZC1yb3cnLCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTY4MTFcdTVGNjInLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL3RyZWUnLCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTU5MUFcdTdFQTdcdTg4NjhcdTU5MzQnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL211bHRpLWhlYWRlcicsIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NUU4Rlx1NTNGN1x1NTIxNycsIGxpbms6ICcvdGFibGUvYmFzaWMvc2VxJywgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU3QTdBXHU2NTcwXHU2MzZFJywgbGluazogJy90YWJsZS9iYXNpYy9lbXB0eScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4ODRDXHUzMDAxXHU1MjE3XHU1NTJGXHU0RTAwXHU5NTJFJywgbGluazogJy90YWJsZS9iYXNpYy9rZXknLCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTZFREFcdTUyQThcdTY3NjEnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL3Njcm9sbGJhcicsIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ3RhYmxlLWxheW91dDpmaXgnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL2ZpeGVkLW1vZGUnLCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTYzMDlcdTg4NENcdTZFREFcdTUyQTgnLCBsaW5rOiAnL3RhYmxlL2Jhc2ljL3Njcm9sbC1yb3ctYnktcm93JywgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdcdThGREJcdTk2MzZcdTUyOUZcdTgwRkQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU5QUQ4XHU0RUFFXHU4ODRDXHUzMDAxXHU1MzU1XHU1MTQzXHU2ODNDJywgbGluazogJy90YWJsZS9hZHZhbmNlZC9oaWdobGlnaHQnLCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTg2NUFcdTYyREZcdTUyMTdcdTg4NjgoXHU1OTI3XHU5MUNGXHU2NTcwXHU2MzZFKScsIGxpbms6ICcvdGFibGUvYWR2YW5jZWQvdmlydHVhbCcsIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NEUwRFx1NUI5QVx1ODg0Q1x1OUFEOFx1ODY1QVx1NjJERlx1NTIxN1x1ODg2OCcsIGxpbms6ICcvdGFibGUvYWR2YW5jZWQvYXV0by1oZWlnaHQtdmlydHVhbCcsIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NTIxN1x1NUJCRFx1OEMwM1x1NjU3NCcsIGxpbms6ICcvdGFibGUvYWR2YW5jZWQvY29sdW1uLXJlc2l6ZScsIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NTIxN1x1NjJENlx1NTJBOFx1NjZGNFx1NjM2Mlx1OTg3QVx1NUU4RicsIGxpbms6ICcvdGFibGUvYWR2YW5jZWQvaGVhZGVyLWRyYWcnLCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTg4NENcdTYyRDZcdTUyQThcdTY2RjRcdTYzNjJcdTk4N0FcdTVFOEYnLCBsaW5rOiAnL3RhYmxlL2FkdmFuY2VkL3Jvdy1kcmFnJywgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnXHU4MUVBXHU1QjlBXHU0RTQ5XHU1MzU1XHU1MTQzXHU2ODNDJywgbGluazogJy90YWJsZS9hZHZhbmNlZC9jdXN0b20tY2VsbCcsIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1ODFFQVx1NUI5QVx1NEU0OVx1NjM5Mlx1NUU4RicsIGxpbms6ICcvdGFibGUvYWR2YW5jZWQvY3VzdG9tLXNvcnQnLCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdWdWUyIFx1NkVEQVx1NTJBOFx1NEYxOFx1NTMxNicsIGxpbms6ICcvdGFibGUvYWR2YW5jZWQvdnVlMi1zY3JvbGwtb3B0aW1pemUnLCB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnQVBJJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1RhYmxlIFByb3BzIFx1ODg2OFx1NjgzQ1x1OTE0RFx1N0Y2RScsIGxpbms6ICcvYXBpL3RhYmxlLXByb3BzJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdTdGtUYWJsZUNvbHVtbiBcdTUyMTdcdTkxNERcdTdGNkUnLCBsaW5rOiAnL2FwaS9zdGstdGFibGUtY29sdW1uJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdFbWl0cyBcdTRFOEJcdTRFRjYnLCBsaW5rOiAnL2FwaS9lbWl0cycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnRXhwb3NlIFx1NUI5RVx1NEY4Qlx1NjVCOVx1NkNENScsIGxpbms6ICcvYXBpL2V4cG9zZScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnU2xvdHMgXHU2M0QyXHU2OUZEJywgbGluazogJy9hcGkvc2xvdHMnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnXHU1MTc2XHU0RUQ2JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NjZGNFx1NTkxQVx1NEYxOFx1NTMxNicsIGxpbms6ICcvb3RoZXIvb3B0aW1pemUnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1RpcHMnLCBsaW5rOiAnL290aGVyL3RpcHMnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1EmQScsIGxpbms6ICcvb3RoZXIvcWEnIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ1x1NTNEOFx1NjZGNFx1NjVFNVx1NUZENycsIGxpbms6ICcvb3RoZXIvY2hhbmdlJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJy9kZW1vcyc6IHtcclxuICAgICAgICAgICAgICAgIGJhc2U6ICcvZGVtb3MnLFxyXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTU5MjdcdTkxQ0ZcdTY1NzBcdTYzNkUnLCBsaW5rOiAnL2h1Z2UtZGF0YScgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTg2NUFcdTYyREZcdTUzNTVcdTUyMTdcdTg4NjgnLCBsaW5rOiAnL3ZpcnR1YWwtbGlzdCcgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTc3RTlcdTk2MzUnLCBsaW5rOiAnL21hdHJpeCcgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTUzNTVcdTUxNDNcdTY4M0NcdTdGMTZcdThGOTEnLCBsaW5rOiAnL2NlbGwtZWRpdCcgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdcdTk3NjJcdTY3N0ZcdTY4MTEnLCBsaW5rOiAnL3BhbmVsLXRyZWUnIH0sXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHNvY2lhbExpbmtzOiBbXHJcbiAgICAgICAgICAgIHsgaWNvbjogJ2dpdGh1YicsIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vamEtcGx1cy9zdGstdGFibGUtdnVlJyB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgZm9vdGVyOiB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdcdTY4MzlcdTYzNkUgTUlUIFx1OEJCOFx1NTNFRlx1OEJDMVx1NTNEMVx1NUUwMycsXHJcbiAgICAgICAgICAgIGNvcHlyaWdodDogJ0NvcHlyaWdodCBcdTAwQTkgMjAyNC1wcmVzZW50IGphcGx1cydcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFIsT0FBTyxVQUFVO0FBQzdTLFNBQVMsZ0JBQUFBLHFCQUFvQjtBQUM3QixTQUFTLDJCQUEyQjtBQUNwQyxPQUFPLGFBQWE7OztBQ0hxUyxTQUFTLG9CQUFvQjtBQUUvVSxJQUFNLFdBQVcsYUFBYTtBQUFBLEVBQ2pDLE9BQU87QUFBQSxFQUNQLGFBQWE7QUFBQSxFQUNiLE1BQU07QUFBQSxFQUNOLGFBQWE7QUFBQSxJQUNULHFCQUFxQjtBQUFBLElBQ3JCLFdBQVcsRUFBRSxNQUFNLFlBQVksTUFBTSxPQUFPO0FBQUEsSUFDNUMsaUJBQWlCO0FBQUEsSUFDakIsU0FBUztBQUFBLE1BQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUFBLE1BQ1osT0FBTztBQUFBLElBQ1g7QUFBQSxJQUNBLGtCQUFrQjtBQUFBLElBQ2xCLGtCQUFrQjtBQUFBLElBQ2xCLEtBQUs7QUFBQSxNQUNELEVBQUUsTUFBTSxRQUFRLE1BQU0sT0FBTztBQUFBLE1BQzdCLEVBQUUsTUFBTSxpQkFBaUIsTUFBTSx1QkFBdUI7QUFBQSxNQUN0RCxFQUFFLE1BQU0sU0FBUyxNQUFNLHNCQUFzQjtBQUFBLElBQ2pEO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDTCxZQUFZO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixPQUFPO0FBQUEsVUFDSDtBQUFBLFlBQ0ksTUFBTTtBQUFBLFlBQ04sT0FBTztBQUFBLGNB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QUMsQ0FBQztBQUFBLEVBQy9GLGFBQWE7QUFBQSxJQUNULE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNKLFVBQVU7QUFBQSxJQUNkO0FBQUEsRUFDSjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsTUFBTTtBQUFBLE1BQ0YsT0FBTztBQUFBLE1BQ1AsR0FBRztBQUFBLElBQ1A7QUFBQSxJQUNBLElBQUk7QUFBQSxNQUNBLE9BQU87QUFBQSxNQUNQLEdBQUc7QUFBQSxJQUNQO0FBQUEsRUFDSjtBQUFBLEVBQ0EsVUFBVTtBQUFBLElBQ04sT0FBTyxJQUFJO0FBQ1AsU0FBRyxJQUFJLHFCQUFxQjtBQUFBLFFBQ3hCLFNBQVMsS0FBSyxRQUFRLGtDQUFXLGlCQUFpQjtBQUFBLFFBQ2xELFFBQVE7QUFBQSxVQUNKLElBQUk7QUFBQSxVQUNKLE1BQU07QUFBQSxRQUNWO0FBQUEsTUFDSixDQUFDO0FBQUEsSUFDTDtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogWyJkZWZpbmVDb25maWciLCAiZGVmaW5lQ29uZmlnIiwgImRlZmluZUNvbmZpZyIsICJkZWZpbmVDb25maWciXQp9Cg==
