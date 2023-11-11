import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'   // 需安装此模块

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {VueAmapResolver} from '@vuemap/unplugin-resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // AutoImport({
        //     resolvers: [ElementPlusResolver({
        //         exclude: /^ElAmap[A-Z]*/
        //     }),VueAmapResolver()],
        // }),
        // Components({
        //     resolvers: [ElementPlusResolver({
        //         exclude: /^ElAmap[A-Z]*/
        //     }),VueAmapResolver()],
        // }),
    ],
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
