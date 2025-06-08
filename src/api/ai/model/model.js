import request from '@/utils/request.js'

// 模型列表
export async function getModelList(param) {
    return await request({
        url: '/ai/web-api/v1/model/list',
        method: 'get',
        params: {...param}
    })
}
