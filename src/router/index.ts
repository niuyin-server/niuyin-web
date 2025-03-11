import {createRouter, createWebHistory} from "vue-router";
// import beforeEach from "@/router/beforeEach.ts";
import NotFound from "@/Layout/error/404.vue"

// 创建路由
const router = createRouter({
    history: createWebHistory(),

    routes: [
        {path: "/login", component: () => import("@/Login/LoginNew.vue")},
        {path: "/register", component: () => import("@/Register/Register.vue")},
        {
            path: "/",
            name: "Index",
            redirect: '/index',
            component: () => import("@/Layout/Index.vue"),
            children: [
                {
                    path: "index", name: "index", component: () => import("@/Layout/Video.vue"), meta: {
                        keepAlive: true
                    }
                },
                {
                    path: "discover", name: "discover", component: () => import("@/Layout/Discover.vue"), meta: {
                        keepAlive: true
                    }
                },
                {
                    path: "user", component: () => import("@/Layout/User.vue"),
                    redirect: '/user/videoPost',
                    children: [
                        {path: "videoPost", component: () => import("@/Layout/user/VideoPost.vue")},
                        {path: "videoLike", component: () => import("@/Layout/user/VideoLike.vue")},
                        {path: "videoFavorite", component: () => import("@/Layout/user/VideoFavorite.vue")},
                        {path: "videoViewHistory", component: () => import("@/Layout/user/VideoViewHistory.vue")},
                    ]
                },
                {path: "publish", component: () => import("@/Layout/Publish.vue")},
                {
                    path: "search", component: () => import("@/Layout/Search.vue"),
                    redirect: '/search/video',
                    children: [
                        {path: "/search/video", component: () => import("@/Layout/search/VideoSearch.vue")},
                        {path: "/search/user", component: () => import("@/Layout/search/UserSearch.vue")},
                    ]
                },
                {path: "follow", component: () => import("@/Layout/Follow.vue")},
                {path: "channel", component: () => import("@/Layout/Channel.vue")},
                {path: "hotVideo", component: () => import("@/Layout/HotVideo.vue")},
                {
                    path: 'person/:userId', component: () => import('@/Layout/Person.vue'),
                    // redirect: '/person/:userId(\\d+)/videoPost',
                    children: [
                        {path: "/person/:userId/videoPost", component: () => import("@/Layout/person/VideoPost.vue")},
                        {path: "/person/:userId/videoLike", component: () => import("@/Layout/person/VideoLike.vue")},
                        {
                            path: "/person/:userId/videoFavorite",
                            component: () => import("@/Layout/person/VideoFavorite.vue")
                        },
                    ]
                },
                {
                    path: 'category/:categoryId', component: () => import('@/Layout/CategoryVideo2.vue'),
                    // redirect: '/person/:userId(\\d+)/videoPost',
                    // children: [
                    //     {path: "/person/:userId/videoPost", component: () => import("@/Layout/person/VideoPost.vue")},
                    // ]
                },
                {path: "cooperation", component: () => import("@/Layout/Cooperation.vue")},
                {path: "niuyinGithub", component: () => import("@/Layout/NiuyinGithub.vue")},
                {
                    path: "ai", component: () => import("@/Layout/ai/Chat.vue"),
                    children: [
                        {path: "/ai/chat", component: () => import("@/Layout/ai/Chat.vue")},
                        {path: "/ai/image", component: () => import("@/Layout/ai/Image.vue")},
                    ]
                },
            ],
        },
        {
            path: '/:pathMatch(.*)*',
            name: "NotFound",
            component: () => NotFound,
            // hidden: true,
        },
        // {
        //     path: '/401',
        //     component: () => import('@/Layout/error/401.vue'),
        //     // hidden: true,
        // },

    ],
});


/**
 * 路由守卫
 */
// router.beforeEach((guard) => {
//     beforeEach.checkAuth(guard, router)
// })

// router.beforeEach((to, from, next) => {
//     const matchedLength = to.matched.length;
//
//     const redirect = () => {
//         if (from.path) {
//             next({path: from.path});
//         } else {
//             next({name: 'NotFound'});
//         }
//     };
//
//     matchedLength === 0 ? redirect() : next();
// });

router.beforeEach((to, from, next) => {
    // 在这里编写你的路由守卫逻辑
    console.log(from.path + " - " + to.path)
    // 如果路由未匹配到任何已定义的路由，则重定向到404页面
    if (to.matched.length === 0) {
        next({name: 'NotFound'});
    } else {
        next();
    }
});


export default router;
