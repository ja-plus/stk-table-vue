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
            external: ['vue', 'd3-interpolate'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve('src'),
        },
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
