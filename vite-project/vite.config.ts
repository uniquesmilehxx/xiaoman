import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置 css
  css: {
    // 配置 预处理器
    preprocessorOptions: {
      // 配置 scss
      scss: {
        // 配置 附加数据
        additionalData: `@import './src/mixin.scss';`,
      },
    },
  },
});
