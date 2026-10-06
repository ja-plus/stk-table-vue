import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import dts from 'vite-plugin-dts';
import pkg from './package.json';
import banner from 'vite-plugin-banner';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        // 产物不压缩：库为纯 ESM，压缩与 tree-shaking 由消费方脚手架（Vite/Rspack 等）在应用构建时完成，
        // 发布层压缩对最终应用体积无收益，且损失错误栈可读性（CDN 直连场景由 jsdelivr 等自动提供 min 版本）。
        minify: false,
        outDir: path.join('./lib'),
        target: ['chrome84'],
        lib: {
            entry: path.join('./src/StkTable/index.ts'),
            formats: ['es'],
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                // 产物文件名不带 hash（库产物，缓存/版本由 npm 包版本与消费方脚手架管理）
                entryFileNames: 'stk-table-vue.js',
                chunkFileNames: '[name].js',
                // 指定资产文件（包含 CSS）的命名规则
                assetFileNames: assetInfo => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        // 指定 CSS 文件的名称为 stk-table.css
                        return 'style.css';
                    }
                    // 其他资产文件保持默认命名规则
                    return '[name].[ext]';
                },
            },
        },
        cssCodeSplit: true,
    },
    resolve: {
        alias: {
            '@': path.resolve('src'),
        },
        extensions: ['.ts'],
    },
    plugins: [
        vue(),
        banner(
            [
                '/**',
                ` * name: ${pkg.name}`,
                ` * version: v${pkg.version}`,
                ` * description: ${pkg.description}`,
                ` * author: ${pkg.author}`,
                ` * homepage: ${pkg.homepage}`,
                ` * license: ${pkg.license}`,
                ' */',
            ].join('\n'),
        ),
        ...(process.env.NODE_ENV === 'production'
            ? [
                  dts({
                      // 仅生成 src 的类型声明：排除 test 目录（tsconfig include 含 test/**/*.js，
                      // 此前会向 lib/ 输出 test 相关的空 .d.ts 杂项）
                      include: ['src/**/*'],
                      // 显式锚定入口根为项目根，保持 lib/src/** 输出路径与 package.json 的 types 字段不变
                      entryRoot: path.resolve('./'),
                  }),
              ]
            : []),
        // (function (){
        //   return {
        //     name: 'auto-import-style',
        //     generateBundle(options,bundle){
        //       const bundleInfo = bundle['index.js'] as any
        //       bundleInfo.code = bundleInfo.code.replace(/(\.\.[\\/])+\w+[\\/]index.ts/g, str => str.replace('.ts', '.js'))
        //       bundleInfo.code = 'import "./style.css";\n' + bundleInfo.code
        //     }
        //   }
        // })()
    ],
});
