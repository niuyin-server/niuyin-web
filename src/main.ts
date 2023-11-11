import {createApp} from "vue";
import {createPinia} from "pinia";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import router from "./router/index.ts";
import "@/assets/styles/element.scss"
import "@/style.scss";
import App from "./App.vue";

//pinia 自动存储话插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import {parseTime, resetForm, addDateRange, handleTree} from "@/utils/roydon";

// 图片预览组件
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
// 高德地图
import VueAMap, {initAMapApiLoader} from "@vuemap/vue-amap";
import "@vuemap/vue-amap/dist/style.css";

initAMapApiLoader({
    key: '267b4c199024ffc545d85b93d24a09f1',
    securityJsCode: '7e84f711a9dac457c627dccc92e01da6',
    plugins: [
        'AMap.Geocoder',
    ]
});
// 瀑布流
// import VueVideoPlayer from "vue-video-player";
// import "video.js/dist/video-js.css";
// import 'vue-video-player/src/custom-theme.css'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 注册所有ele图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
// 全局方法挂载
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.resetForm = resetForm;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.handleTree = handleTree;

app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.use(VueViewer)
VueViewer.setDefaults({
    zIndexInline: 2023
})
app.use(VueAMap)

// app.use(VueVideoPlayer);

app.mount("#app");
