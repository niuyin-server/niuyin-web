import axios from 'axios'
import ElementPlus, {ElMessage, ElMessageBox} from 'element-plus'
import errorCode from '@/utils/errorCode'
import { useUserStore } from "@/store/useUserStore";

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const instance = axios.create({
    baseURL: 'http://localhost:9090',
    // baseURL: 'http://39.101.67.45:9090',
    timeout: 20000,
});
const userstore = useUserStore()
const token = userstore.token
// 添加请求拦截器
instance.interceptors.request.use(config => {
    // config.headers['Content-Type'] = 'application/json;charset=utf-8';
    // // 在发送请求之前做些什么
    // // 是否需要设置 token
    // const isToken = (config.headers || {}).isToken === false
    // // if (!isToken) {
    // config.headers['Authorization'] = 'Bearer ' + 'eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAC2LUQrDIBBE77LfEap165rbaLOCgSSSNdBQevduIPM1b4b3hblXGAEDlXd4kiFnvfGFHyYHZFMwFp8tky4wQE0dRvuKpHERB5Ajqy2ndF6uX0Rx385pWxXTMSmm1rTzp6kaCN2tVv3c7w8QZaD7gQAAAA.yZsuNb-qHfy8jBDmpVsTtz2_OYiPmHtwS_2HHpXsxfln1HxEHxpMO0qSN11KbPVVukZO0MuomaeFzrgJAMDMhA' // getToken()如何存
    // // }
    if (token) {
        config.headers.Authorization = 'Bearer ' + token//如果登陆后  token会存储在pinia中  携带token


    }

    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
        return res.data
    }
    if (res.data.msg === "用户未认证") {
        console.log(res.data.msg)
        // location.href = '/login';
        // 展示重新登陆逻辑
        ElMessageBox.confirm('登录状态已过期，是否选择重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            location.href = '/login';
        });
        return Promise.reject('请重新登录。')
    }
    // 未认证
    if (code === 401) {
        // 展示重新登陆逻辑
        ElMessageBox.confirm('登录状态已过期，是否选择重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            location.href = '/login';
        });
        return Promise.reject('请重新登录。')
    } else if (code === 500) {
        ElMessage.error(msg)
        return Promise.reject(new Error(msg))
    } else if (code !== 200) {
        ElMessage.error(msg)
        return Promise.reject('error')
    } else {
        return res.data
    }
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default instance
