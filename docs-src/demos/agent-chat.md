# Agent 对话虚拟列表

这个示例把每条 Agent 消息作为 `StkTable` 的一行，开启 `virtual` 只渲染可视区域，并使用 `autoRowHeight` 让用户气泡、思考、查阅、终端和回复按内容自然撑开，适合长对话历史。输入框使用 OpenAI Chat Completions 兼容协议，可在页面中切换匿名 Qwen、DeepSeek 线路或自定义端点。

默认 Qwen 端点来自 OVHcloud AI Endpoints，匿名访问无需注册或 API Key，但有 IP 限流；公共线路的可用模型和额度可能变化。生产环境请通过自己的服务端代理请求，避免在浏览器暴露 API Key。

列表默认跟随底部，用户上滑后会暂停，滚动回底部时恢复。视口高度随页面响应式变化，容器宽度变化会清理旧的实测行高并重新计算虚拟布局。

底部输入区支持添加附件或图片、通过 SVG 下拉菜单切换模型，列表最后一项“管理模型”可配置新的模型；还可在“思考”菜单中开启或关闭思考步骤。请求期间，对话中会动态显示等待模型返回的状态；接口错误也会作为消息写入对话。

<demo vue="demos/AgentChat/index.vue" github="https://github.com/ja-plus/stk-table-vue/tree/master/docs-demo/demos/AgentChat"></demo>
