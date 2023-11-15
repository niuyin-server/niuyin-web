//将登陆的接口分离
import request from '@/utils/request'

// 登录方法
export function login(username, password) {
    const data = {
        username,
        password
    }
    return request({
        url: '/member/api/v1/login',
        method: 'post',
        data: data
    })
}

export const userLogin = (username, password) => {
    return request.post('member/api/v1/login', {
        username,
        password
    })
}

// 注册方法
export function register(data) {
    return request({
        url: '/member/api/v1/register',
        method: 'post',
        data: data
    })
}

// 获取用户详细信息
export function getInfo() {
    return request({
        url: '/member/api/v1/userinfo',
        method: 'get'
    })
}

// 获取用户详细信息
export function getPersonInfo(userId) {
    return request({
        url: '/member/api/v1/'+userId,
        method: 'get'
    })
}


// 退出方法
export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}


//更新用户信息
export function updateUserProfile(data) {
    return request({
        url: '/member/api/v1/update',
        method: 'put',
        data: data
    })
}

//修改用户头像
export function avatar(file) {
    return request.post('/user/api/v1/avatar', {
        data: {
            file
        }
    })
}

//更新用户详情
export function updateMemberInfo(data) {
    return request({
        url: '/member/api/v1/info/update',
        method: 'put',
        data: data
    })
}
