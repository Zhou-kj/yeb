import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'


// 请求拦截器
axios.interceptors.request.use(config => {
    if (window.sessionStorage.getItem('tokenStr')) {
        config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr')
    }
    return config
}, error => {
    console.log(error)
})


// 响应拦截器
axios.interceptors.response.use(success => {
    if (success.data.status == 1) {
        Message.error({ message: success.data.message })
        return
    }
    if (success.data.status == 401) {
        Message.error({ message: success.data.message })
        return router.replace('/login')
    }
    if (success.data.message) {
        Message.success({ message: success.data.message })
    }
    return success.data
}, error => {
    if (error.response.status == 504 || error.response.status == 404) {
        Message.error({ message: '服务器被吃了!!!' })
    } else if (error.response.status == 403) {
        Message.error({ message: '权限不足，请联系管理员！' })
    } else if (error.response.status == 401) {
        Message.error({ message: '尚未登录，请先登录！' })
        router.replace('/login')
    } else {
        if (error.response.data) {
            Message.error({ message: error.response.data.message })
        } else {
            Message.error({ message: '未知错误！' })
        }
    }
    return
})



let base = 'http://localhost:8081'

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}

export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
    })
}

export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params,
    })
}

export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params,
    })
}