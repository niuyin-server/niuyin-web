import request from '@/utils/request'

// 评论分页树
export function videoCommentPageList(data) {
    return request({
        url: '/behave/api/v1/comment/tree',
        method: 'post',
        data: data
    })
}

// 添加评论
export function addVideoComment(data) {
    return request({
        url: '/behave/api/v1/comment',
        method: 'post',
        data: data
    })
}

// 视频点赞
export function likeVideo(videoId) {
    return request({
        url: '/behave/api/v1/like/' + videoId,
        method: 'get'
    })
}

// 分页查询我喜欢的视频
export function videoLikePage(data) {
    return request({
        url: '/behave/api/v1/like/mylikepage',
        method: 'post',
        data: data
    })
}

// 分页查询我收藏的视频
export function videoFavoritePage(data) {
    return request({
        url: '/behave/api/v1/favorite/mypage',
        method: 'post',
        data: data
    })
}

// 回复评论
export function replayVideoComment(data) {
    return request({
        url: '/behave/api/v1/comment/replay',
        method: 'post',
        data: data
    })
}

// 删除评论
export function deleteVideoComment(commentId) {
    return request({
        url: '/behave/api/v1/comment/' + commentId,
        method: 'delete',
    })
}

// 我的喜欢数
export function myLikeCount() {
    return request({
        url: '/behave/api/v1/like/likeCount',
        method: 'get',
    })
}

// 我的收藏数
export function myFavoriteCount() {
    return request({
        url: '/behave/api/v1/favorite/favoriteCount',
        method: 'get',
    })
}

//查询用户收藏夹列表
export function myFavoriteList() {
    return request({
        url: '/behave/api/v1/userFavorite/list',
        method: 'get',
    })
}

//查询用户点赞列表
export function personVideoLikePage(data) {
    return request({
        url: '/behave/api/v1/like/personLikePage',
        method: 'post',
        data: data
    })
}

//查询用户点赞列表
export function createFavorite(data) {
    return request({
        url: '/behave/api/v1/userFavorite',
        method: 'post',
        data: data
    })
}

// 用户仅仅收藏视频
export function onlyFavoriteVideo(videoId) {
    return request({
        url: '/behave/api/v1/favorite/' + videoId,
        method: 'GET',
    })
}

// 收藏视频到收藏夹
export function favoriteVideoToCollection(data) {
    return request({
        url: '/behave/api/v1/userFavoriteVideo',
        method: 'POST',
        data: data
    })
}

// 查询视频在用户哪些收藏夹
export function videoInWhoseCollection(videoId) {
    return request({
        url: '/behave/api/v1/userFavoriteVideo/' + videoId,
        method: 'GET',
    })
}

// 查询收藏夹详情集合
export function collectionInfoList() {
    return request({
        url: '/behave/api/v1/userFavorite/infoList',
        method: 'GET',
    })
}

// 分页收藏夹详情
export function collectionInfoPage(data) {
    return request({
        url: '/behave/api/v1/userFavorite/infoPage',
        method: 'POST',
        data: data
    })
}

// 更新收藏夹信息
export function updateFavorite(data) {
    return request({
        url: '/behave/api/v1/userFavorite',
        method: 'PUT',
        data: data
    })
}

// 删除收藏夹
export function deleteFavorite(favoriteId) {
    return request({
        url: '/behave/api/v1/userFavorite/' + favoriteId,
        method: 'DELETE',
    })
}
