import {createRouter, createWebHistory} from "vue-router";

// 创建路由
const router = createRouter({
    history: createWebHistory(),

    routes: [
        {path: "/login", component: () => import("@/Login/Login.vue")},
        {
            path: "/",
            name: "Index",
            redirect: '/index',
            component: () => import("@/Layout/Index.vue"),
            children: [
                {path: "index", component: () => import("@/Layout/Video.vue")},
                {path: "user", component: () => import("@/Layout/User.vue")},
                {
                    path: "useredit",
                    component: () => import("@/components/user/Edit.vue"),
                    children: [
                        {
                            path: "userdetail",
                            component: () => import("@/components/user/userdetail.vue"),
                        },
                        {
                            path: "useraccount",
                            component: () => import("@/components/user/useraccount.vue"),
                        },
                    ],
                },
                {path: "publish", component: () => import("@/Layout/Publish.vue")},
                {path: "videoSearch", component: () => import("@/Layout/VideoSearch.vue")},
                {path: "follow", component: () => import("@/Layout/Follow.vue")},
                {path: "channel", component: () => import("@/Layout/Channel.vue")},
                {path: "hotVideo", component: () => import("@/Layout/HotVideo.vue")},
            ],
        },
    ],
});

export default router;
