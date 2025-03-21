import {createApp} from "vue";
import {createPinia} from "pinia";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import router from "./router/index.ts";
import "@/assets/styles/element.scss"
import "@/style.scss";
import "./tailwind.css"
import App from "./App.vue";
//pinia 自动存储话插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// 自定义方法
import {
    formatAge,
    getAge,
    smartDateFormat,
    parseTime,
    resetForm,
    addDateRange,
    handleTree,
    removeHtmlTags
} from "@/utils/roydon.js";
// 图片预览组件
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
// 高德地图
import VueAMap, {initAMapApiLoader} from "@vuemap/vue-amap";
import "@vuemap/vue-amap/dist/style.css";

initAMapApiLoader({
    key: '1***',
    securityJsCode: '2***',
    plugins: [
        'AMap.Geocoder',
    ]
});
// vue瀑布流插件
import {VueMasonryPlugin} from 'vue-masonry';

// v-md-editor
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// 引入所有语言包
import hljs from 'highlight.js';

VMdEditor.use(vuepressTheme, {
    Prism,
});
VMdEditor.use(githubTheme, {
    Hljs: hljs,
});

// highlightjs
VMdPreview.use(githubTheme, {
    Hljs: hljs,
});

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 注册所有ele图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
// 全局方法挂载
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.smartDateFormat = smartDateFormat;
app.config.globalProperties.formatAge = formatAge;
app.config.globalProperties.getAge = getAge;
app.config.globalProperties.resetForm = resetForm;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.removeHtmlTags = removeHtmlTags;

app.use(router)
app.use(pinia)
app.use(ElementPlus, {
    locale: zhCn,
})
app.use(VueViewer)
VueViewer.setDefaults({
    zIndexInline: 2023
})
app.use(VueAMap)
app.use(VueMasonryPlugin);
app.use(VMdEditor);
app.use(VMdPreview);

app.mount("#app");
