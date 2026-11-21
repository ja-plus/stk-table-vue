# Agent conversation virtual list

Each Agent message is a `StkTable` row. With `virtual`, only visible rows render; `autoRowHeight` lets bubbles, thinking, terminal, and answers size to their content. The composer is compatible with OpenAI Chat Completions and can switch between anonymous Qwen, DeepSeek, or a custom endpoint. Anonymous routes are IP rate limited; in production, proxy requests through your own server.

The list follows the bottom by default and pauses when you scroll up. The built-in custom scrollbar keeps the thumb tracking the pointer when virtual scrolling rewrites placeholder DOM mid-drag.

<demo vue="demos/AgentChat/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/AgentChat"></demo>
