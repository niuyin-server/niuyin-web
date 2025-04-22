import request from '@/utils/request.js'

// 对话列表
export function listConversation(data) {
    return request({
        url: '/ai/api/v1/chat/conversation/list',
        method: 'post',
        data: data
    })
}
