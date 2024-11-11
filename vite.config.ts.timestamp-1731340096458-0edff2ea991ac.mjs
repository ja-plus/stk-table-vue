// vite.config.ts
import { defineConfig } from "file:///D:/mycode/stk-table-vue/node_modules/.pnpm/vite@5.4.10_@types+node@20.12.10_less@4.2.0/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/mycode/stk-table-vue/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.10_vue@3.5.12/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "node:path";
import dts from "file:///D:/mycode/stk-table-vue/node_modules/.pnpm/vite-plugin-dts@4.3.0_@types+node@20.12.10_typescript@5.4.5_vite@5.4.10/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  build: {
    minify: false,
    outDir: path.join("./lib"),
    lib: {
      entry: path.join("./src/StkTable/index.ts"),
      formats: ["es"]
    },
    rollupOptions: {
      external: ["vue", "d3-interpolate"]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve("src")
    },
    extensions: [".ts"]
  },
  plugins: [
    vue(),
    ...process.env.NODE_ENV === "production" ? [dts()] : []
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
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxteWNvZGVcXFxcc3RrLXRhYmxlLXZ1ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcbXljb2RlXFxcXHN0ay10YWJsZS12dWVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L215Y29kZS9zdGstdGFibGUtdnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcclxuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnO1xyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICBtaW5pZnk6IGZhbHNlLFxyXG4gICAgICAgIG91dERpcjogcGF0aC5qb2luKCcuL2xpYicpLFxyXG4gICAgICAgIGxpYjoge1xyXG4gICAgICAgICAgICBlbnRyeTogcGF0aC5qb2luKCcuL3NyYy9TdGtUYWJsZS9pbmRleC50cycpLFxyXG4gICAgICAgICAgICBmb3JtYXRzOiBbJ2VzJ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIGV4dGVybmFsOiBbJ3Z1ZScsICdkMy1pbnRlcnBvbGF0ZSddLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgICdAJzogcGF0aC5yZXNvbHZlKCdzcmMnKSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGV4dGVuc2lvbnM6IFsnLnRzJ10sXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIHZ1ZSgpLFxyXG4gICAgICAgIC4uLihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nID8gW2R0cygpXSA6IFtdKSxcclxuICAgICAgICAvLyAoZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgLy8gICByZXR1cm4ge1xyXG4gICAgICAgIC8vICAgICBuYW1lOiAnYXV0by1pbXBvcnQtc3R5bGUnLFxyXG4gICAgICAgIC8vICAgICBnZW5lcmF0ZUJ1bmRsZShvcHRpb25zLGJ1bmRsZSl7XHJcbiAgICAgICAgLy8gICAgICAgY29uc3QgYnVuZGxlSW5mbyA9IGJ1bmRsZVsnaW5kZXguanMnXSBhcyBhbnlcclxuICAgICAgICAvLyAgICAgICBidW5kbGVJbmZvLmNvZGUgPSBidW5kbGVJbmZvLmNvZGUucmVwbGFjZSgvKFxcLlxcLltcXFxcL10pK1xcdytbXFxcXC9daW5kZXgudHMvZywgc3RyID0+IHN0ci5yZXBsYWNlKCcudHMnLCAnLmpzJykpXHJcbiAgICAgICAgLy8gICAgICAgYnVuZGxlSW5mby5jb2RlID0gJ2ltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XFxuJyArIGJ1bmRsZUluZm8uY29kZVxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gICB9XHJcbiAgICAgICAgLy8gfSkoKVxyXG4gICAgXSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlAsU0FBUyxvQkFBb0I7QUFDMVIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFNBQVM7QUFFaEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBLElBQ1IsUUFBUSxLQUFLLEtBQUssT0FBTztBQUFBLElBQ3pCLEtBQUs7QUFBQSxNQUNELE9BQU8sS0FBSyxLQUFLLHlCQUF5QjtBQUFBLE1BQzFDLFNBQVMsQ0FBQyxJQUFJO0FBQUEsSUFDbEI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNYLFVBQVUsQ0FBQyxPQUFPLGdCQUFnQjtBQUFBLElBQ3RDO0FBQUEsRUFDSjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSyxLQUFLLFFBQVEsS0FBSztBQUFBLElBQzNCO0FBQUEsSUFDQSxZQUFZLENBQUMsS0FBSztBQUFBLEVBQ3RCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxJQUFJO0FBQUEsSUFDSixHQUFJLFFBQVEsSUFBSSxhQUFhLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVczRDtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
