import request from '@/utils/request.js'

// 对话消息列表
export function listMessageByCid(param) {
    return request({
        url: '/ai/api/v1/chat/message/list-by-cid',
        method: 'get',
        params: param
    })
}
