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
