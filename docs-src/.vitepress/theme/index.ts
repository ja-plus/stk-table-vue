import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import './custom.css';

export default {
    ...DefaultTheme,
    async enhanceApp({ app }) {
        // stk-table-vue 的 SFC 在 Vapor 模式下编译，宿主为 vdom(VitePress) 应用时必须注册 vapor-in-vdom 互操作插件
        // 注意：vaporInteropPlugin 只在浏览器构建中由 'vue' 导出，SSR 构建（vue 的 node 入口）不包含该导出，
        // 因此仅在非 SSR 环境下动态加载。SSR 阶段渲染到静态字符串，不需要 vapor-in-vdom 互操作。
        if (!import.meta.env.SSR) {
            const vue = await import('vue');
            if (vue.vaporInteropPlugin) {
                app.use(vue.vaporInteropPlugin);
            }
        }
    },
} as Theme;