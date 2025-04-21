import request from '@/utils/request'

// 对话列表
export function listConversion(data) {
    return request({
        url: '/ai/api/v1/conversion/list',
        method: 'post',
        data: data
    })
}
