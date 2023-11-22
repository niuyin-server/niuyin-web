import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'   // 需安装此模块

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(),],
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
            '@': path.resolve(__dirname, 'src')
        }
    },
    // host: '0.0.0.0',// 设置为0.0.0.0则所有的地址均能访问
    // port: 5173,
    // https: false,
    // hotOnly: false,
    // // 跨域问题解决 代理（关键部分）
    // proxy: {
    //     '/api': {
    //         target: 'https://s.search.bilibili.com', // 注意！此处为后端提供的真实接口
    //         changeOrigin: true, // 允许跨域
    //         pathRewrite: {
    //             // 如果接口中是没有api的，那就直接置空，'^/api': ''，
    //             // 如果接口中有api，那就得写成{'^/api':'/api'}
    //             '^/api': ''
    //         }
    //     }
    // }
})
