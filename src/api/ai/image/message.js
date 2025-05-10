import request from '@/utils/request.js'

// 图片生成
export function imageGenerate(param) {
    return request({
        url: '/ai/api/v1/image/generate',
        method: 'get',
        params: param
    })
}

// 图片集合
export function imageList(data) {
    return request({
        url: '/ai/api/v1/image/list',
        method: 'post',
        data: data
    })
}
