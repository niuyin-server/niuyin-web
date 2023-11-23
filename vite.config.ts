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
    // devServer: {
    //     overlay: { // 让浏览器 overlay 同时显示警告和错误
    //         warnings: true,
    //         errors: true
    //     },
    //     host: "localhost",
    //     port: 5173, // 端口号
    //     https: false, // https:{type:Boolean}
    //     open: false, //配置自动启动浏览器
    //     hotOnly: true, // 热更新
    //     // proxy: 'http://localhost:8080'   // 配置跨域处理,只有一个代理
    //     proxy: { //配置多个跨域
    //         "/api": {
    //             target: "http://127.0.0.1:9090",
    //             changeOrigin: true,
    //             // ws: true,//websocket支持
    //             secure: false,
    //             pathRewrite: {
    //                 "^/api": ""
    //             }
    //         },
    //         "/api2": {
    //             target: "https://s.search.bilibili.com",
    //             changeOrigin: true,
    //             //ws: true,//websocket支持
    //             secure: false,
    //             pathRewrite: {
    //                 "^/api2": "/"
    //             }
    //         },
    //     }
    // }
})
