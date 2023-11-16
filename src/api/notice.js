import request from '@/utils/request'

// 分页查询通知
export function noticePage(data) {
    return request({
        url: '/notice/api/v1/page',
        method: 'post',
        data: data
    })
}
