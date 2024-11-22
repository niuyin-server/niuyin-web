import request from '@/utils/request'

// 视频搜索
export function searchVideo(data) {
    return request({
        url: '/search/api/v1/video',
        method: 'post',
        data: data
    })
}

// 用户搜索
export function searchUser(data) {
    return request({
        url: '/search/api/v1/user',
        method: 'post',
        data: data
    })
}

// 搜索记录
export function searchHistoryLoad() {
    return request({
        url: '/search/api/v1/history/load',
        method: 'get',
    })
}

// 删除搜索记录
export function delSearchHistory(id) {
    return request({
        url: '/search/api/v1/history/del/' + id,
        method: 'delete',
    })
}

export async function searchHotLoad(data) {
    return await request({
        url: '/search/api/v1/video/search/hot',
        method: 'post',
        data: data
    })
}

/**
 * 视频搜索建议
 * @param data
 * @returns {*}
 */
export async function videoSearchSuggest(data) {
    return await request({
        url: '/search/api/v1/video/suggest',
        method: 'post',
        data: data
    })
}
