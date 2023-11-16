import request from '@/utils/request'

// 视频流-feed
export function videoFeed(createTime) {
    const data = {
        createTime
    }
    return request({
        url: '/video/api/v1/feed',
        method: 'post',
        data: data
    })
}

// 分页查询我的视频
export function videoMypage(data) {
    return request({
        url: '/video/api/v1/mypage',
        method: 'post',
        data: data
    })
}

// 分页查询用户视频
export function videoUserpage(data) {
    return request({
        url: '/video/api/v1/userpage',
        method: 'post',
        data: data
    })
}

// 发布视频
export function publishVideo(data) {
    return request({
        url: '/video/api/v1/publish',
        method: 'post',
        data: data
    })
}

// 视频分类列表
export function videoCategory() {
    return request({
        url: '/video/api/v1/category',
        method: 'get'
    })
}

// 视频分类分页video
export function videoCategoryPage(data) {
    return request({
        url: '/video/api/v1/category/page',
        method: 'post',
        data: data
    })
}

// 热门视频
export function hotVideoPage(data) {
    return request({
        url: '/video/api/v1/hot',
        method: 'post',
        data: data
    })
}

// 用户视频点赞总数
export function userLikeNums(userId) {
    return request({
        url: '/video/api/v1/likeNums/' + userId,
        method: 'get',
    })
}

// 保存标签
export function saveVideoTag(data) {
    return request({
        url: '/video/api/v1/tag/save',
        method: 'post',
        data: data
    })
}

// 我的作品数量
export function myVideoCount() {
    return request({
        url: '/video/api/v1/videoCount',
        method: 'get'
    })
}

// 查询用户作品
export function memberInfoPage(data) {
    return request({
        url: '/video/api/v1/personVideoPage',
        method: 'post',
        data: data
    })
}
