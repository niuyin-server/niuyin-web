import request from '@/utils/request'

// 视频流-feed
export async function videoFeed(createTime) {
    const data = {
        createTime
    }
    return await request({
        url: '/video/api/v1/feed',
        method: 'post',
        data: data
    })
}

// 分页查询我的视频
export async function videoMypage(data) {
    return await request({
        url: '/video/api/v1/mypage',
        method: 'post',
        data: data
    })
}

// 分页查询用户视频
export async function videoUserpage(data) {
    return await request({
        url: '/video/api/v1/userpage',
        method: 'post',
        data: data
    })
}

// 发布视频
export async function publishVideo(data) {
    return await request({
        url: '/video/api/v1/publish',
        method: 'post',
        data: data
    })
}

// 视频分类列表
export async function videoCategory() {
    return await request({
        url: '/video/api/v1/category',
        method: 'get'
    })
}

// 视频分类分页video
export async function videoCategoryPage(data) {
    return await request({
        url: '/video/api/v1/category/page',
        method: 'post',
        data: data
    })
}

// 热门视频
export async function hotVideoPage(data) {
    return await request({
        url: '/video/api/v1/hot',
        method: 'post',
        data: data
    })
}

// 用户视频点赞总数
export async function userLikeNums(userId) {
    return await request({
        url: '/video/api/v1/likeNums/' + userId,
        method: 'get',
    })
}

// 保存标签
export async function saveVideoTag(data) {
    return await request({
        url: '/video/api/v1/tag/save',
        method: 'post',
        data: data
    })
}

// 我的作品数量
export async function myVideoCount() {
    return await request({
        url: '/video/api/v1/videoCount',
        method: 'get'
    })
}

// 查询用户作品
export async function memberInfoPage(data) {
    return await request({
        url: '/video/api/v1/personVideoPage',
        method: 'post',
        data: data
    })
}

// 视频推荐
export async function pushVideo() {
    return await request({
        url: '/video/api/v1/pushVideo',
        method: 'get'
    })
}

// 分页查询我的视频合集
export async function myVideoCompilationPage(data) {
    return await request({
        url: '/video/api/v1/userVideoCompilation/mp',
        method: 'POST',
        data: data
    })
}

// 根据分类推送视频
export async function pushVideoByCategory(categoryId) {
    return await request({
        url: '/video/api/v1/category/pushVideo/' + categoryId,
        method: 'GET'
    })
}

// 视频分类树
export async function videoCategoryTree() {
    return await request({
        url: '/video/api/v1/category/tree',
        method: 'GET'
    })
}

// 视频分类树
export async function videoCategoryParentList() {
    return await request({
        url: '/video/api/v1/category/parentList',
        method: 'GET'
    })
}

// 视频父分类子分类
export async function videoCategoryChildrenList(id) {
    return await request({
        url: '/video/api/v1/category/children/' + id,
        method: 'GET'
    })
}
