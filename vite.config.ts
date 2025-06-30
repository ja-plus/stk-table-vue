import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import dts from 'vite-plugin-dts';
// https://vitejs.dev/config/
export default defineConfig({
    build: {
        minify: false,
        outDir: path.join('./lib'),
        lib: {
            entry: path.join('./src/StkTable/index.ts'),
            formats: ['es'],
        },
        rollupOptions: {
            external: ['vue'],
            output: {
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
        ...(process.env.NODE_ENV === 'production' ? [dts()] : []),
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
