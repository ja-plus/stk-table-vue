# Agent 对话虚拟列表

每条 Agent 消息作为 `StkTable` 的一行，开启 `virtual` 只渲染可视区域，`autoRowHeight` 让气泡、思考、终端、回复按内容自然撑开。输入框兼容 OpenAI Chat Completions，可切换匿名 Qwen、DeepSeek 或自定义端点；匿名线路有 IP 限流，生产环境请通过自建服务端代理请求。

列表默认跟随底部，上滑暂停、回到底部恢复；启用内置自定义滚动条，避免原生滚动条在虚拟滚动改写占位 DOM 时拖拽失灵。

<demo vue="demos/AgentChat/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/AgentChat"></demo>
