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
        url: '/behave/api/v1/favorite/myfavoritepage',
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
export function myFavoriteList(userId) {
    return request({
        url: '/behave//api/v1/userFavorite/list/'+ userId,
        method: 'get',
    })
}