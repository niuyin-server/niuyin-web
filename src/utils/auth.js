import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token, {expires: 3})  // 3天过期
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}
