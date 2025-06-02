import request from '@/utils/request.js'

// 角色列表
export async function getModelRolePage(param) {
    return await request({
        url: '/ai/web-api/v1/role/page',
        method: 'get',
        params: {...param}
    })
}
