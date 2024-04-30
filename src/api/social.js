import request from '@/utils/request'

// 我的关注
export function followPageList(data) {
    return request({
        url: '/social/api/v1/follow/page',
        method: 'post',
        data: data
    })
}

// 关注用户
export function followUser(userId) {
    return request({
        url: '/social/api/v1/follow/' + userId,
        method: 'get'
    })
}

// 关注数、粉丝数
export function followAndFans(userId) {
    return request({
        url: '/social/api/v1/follow/followFans/' + userId,
        method: 'get'
    })
}

// 关注用户视频流
export function followVideoFeed(lastTime) {
    return request({
        url: '/social/api/v1/follow/videoFeed',
        method: 'get',
        params: lastTime
    })
}

// 初始化用户收件箱
export function initUserInBox() {
    return request({
        url: '/social/api/v1/follow/initUserInBox',
        method: 'get'
    })
}
