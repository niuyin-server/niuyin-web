import {createRouter, createWebHistory} from "vue-router";

// 创建路由
const router = createRouter({
    history: createWebHistory(),

    routes: [
        {path: "/login", component: () => import("@/Login/LoginNew.vue")},
        {path: "/register", component: () => import("@/Login/Register.vue")},
        {
            path: "/",
            name: "Index",
            redirect: '/index',
            component: () => import("@/Layout/Index.vue"),
            children: [
                {path: "index", component: () => import("@/Layout/Video.vue")},
                {
                    path: "user", component: () => import("@/Layout/User.vue"),
                    children: [
                        {path: "videoPost", component: () => import("@/Layout/user/VideoPost.vue")},
                        {path: "videoLike", component: () => import("@/Layout/user/VideoLike.vue")},
                        {path: "videoFavorite", component: () => import("@/Layout/user/VideoFavorite.vue")},
                    ]
                },
                // {
                //     path: "useredit",
                //     component: () => import("@/components/user/Edit.vue"),
                //     children: [
                //         {
                //             path: "userdetail",
                //             component: () => import("@/components/user/userdetail.vue"),
                //         },
                //         {
                //             path: "useraccount",
                //             component: () => import("@/components/user/useraccount.vue"),
                //         },
                //     ],
                // },
                {path: "publish", component: () => import("@/Layout/Publish.vue")},
                {path: "videoSearch", component: () => import("@/Layout/VideoSearch.vue")},
                {path: "follow", component: () => import("@/Layout/Follow.vue")},
                {path: "channel", component: () => import("@/Layout/Channel.vue")},
                {path: "hotVideo", component: () => import("@/Layout/HotVideo.vue")},
            ],
        },
        {
            path: '/404',
            component: () => import('@/Layout/error/404.vue'),
            hidden: true
        },
        {
            path: '/401',
            component: () => import('@/Layout/error/401.vue'),
            hidden: true
        },
    ],
});

export default router;
