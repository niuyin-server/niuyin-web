import request from '@/utils/request.js'

// 文档分页
export async function getDocumentList(param) {
    return await request({
        url: '/ai/web-api/v1/knowledge/document/list',
        method: 'get',
        params: {...param}
    })
}

// 上传文档
export async function documentUpload(data) {
    return await request({
        url: '/ai/web-api/v1/knowledge/document/upload',
        method: 'post',
        data: data
    })
}

// 新建文档（单个）
export async function documentCreate(data) {
    return await request({
        url: '/ai/web-api/v1/knowledge/document/create',
        method: 'post',
        data: data
    })
}
