import request from '@/utils/request.js'

// 知识库列表
export async function getKnowledgeList(param) {
    return await request({
        url: '/ai/web-api/v1/knowledge/list',
        method: 'get',
        params: {...param}
    })
}

// 创建知识库
export async function createKnowledge(data) {
    return await request({
        url: '/ai/web-api/v1/knowledge',
        method: 'post',
        data: data
    })
}

// 编辑知识库
export async function editKnowledge(data) {
    return await request({
        url: '/ai/web-api/v1/knowledge',
        method: 'put',
        data: data
    })
}
