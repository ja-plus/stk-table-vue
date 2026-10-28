# Agent conversation virtual list

Each Agent message is a `StkTable` row. With `virtual` and `autoRowHeight` enabled, only visible rows are rendered while bubbles, thinking, search, terminal, and answer entries keep their natural heights. The composer uses the OpenAI Chat Completions format and lets you switch between anonymous Qwen, a DeepSeek route, or a custom endpoint.

The default Qwen endpoint is provided by OVHcloud AI Endpoints. Anonymous requests need no signup or API key but are rate limited by IP. Public routes and model availability can change. In production, proxy requests through your own server instead of exposing an API key in the browser.

The list follows the bottom by default, pauses when you scroll up, and resumes when you return to the bottom. The viewport height is responsive; when its width changes, measured row heights are cleared and the virtual layout is recalculated.

The composer can add attachments or images, switch models from an SVG dropdown, configure a new model from the final “Manage models” item, and toggle thinking steps from the thinking menu. While a request is pending, the conversation shows a live wait status, and interface errors are written back as messages.

<demo vue="demos/AgentChat/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/AgentChat"></demo>
