// import axios from 'axios'
// import { escape } from 'core-js/fn/regexp'

// const service = axios.create({
//     responseType: 'arraybuffer'
// })

// service.interceptors.request.use(config => {
//     config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr')
//     return config
// }, err => {
//     console.log(err)
// })

// service.interceptors.response.use(resp => {
//     const headers = resp.headers
//     let reg = RegExp(/application\/json/)
//     if (headers['content-type'].match(reg)) { // 如果返回json字符串
//         resp.data = unitToString(resp.data)
//     } else { // 如果返回的是流
//         let fileDownload = require('js-file-download')
//         let fileName = headers['content-disposition'].split(';')[1].split('filename=')[1]
//         let contentType = headers['content-type']
//         fileName = decodeURIComponent(fileName) // 转换防止乱码
//         fileDownload(resp.data, fileName, contentType)

//     }
// }, err => {
//     console.log(err)
// })

// // 如果返回的是json字符串则重新编码返回
// function unitToString(unitArray) {
//     let encodedString = String.fromCharCode.apply(null, new Uint8Array(unitArray))
//     let decodedString = decodeURIComponent(escape(encodedString))
//     return JSON.parse(decodedString)
// }

// let base = ''

// export const downloadRequest = (url, params) => {
//     return service({
//         method: 'get',
//         url: `${base}${url}`,
//         data: params
//     })
// }

// export default service

import axios from "axios"


let base = 'http://localhost:8081'

export const downloadRequest = (url) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        responseType: 'arraybuffer'
    })
}