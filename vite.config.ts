import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'   // 需安装此模块

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()], 
  css: {
    // 预处理器配置项
    preprocessorOptions: {
      less: {
        math: "always",
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') //@表示src文件 配置成功
    }
  }
})
