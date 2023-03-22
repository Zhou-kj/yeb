import Vue from 'vue'
import Vuex from 'vuex'
import { postRequest } from '../utils/api'
import { Notification } from 'element-ui'
// import SockJS from 'sockjs-client'
// import Stomp from 'stompjs'

Vue.use(Vuex)

const now = new Date()

const store = new Vuex.Store({
    state: {
        routes: [],
        sessions: {}, // 聊天信息 'zhangsan#lisi':[{}]
        admins: [], // 左侧用户列表
        currentAdmin: null, // 当前用户
        currentSession: null, //  选中的用户对象
        filterKey: '',
        ws: null, // 在线聊天-定义对象
        isDot: {} // 未读消息 对象
    },

    mutations: { // 与 state 同步执行；可以改变 state 对应的值的方法
        // 编辑用户 同步用户信息
        INIT_ADMIN(state, admin) {
            state.currentAdmin = admin
        },
        // 初始化路由 菜单
        initRoutes(state, data) {
            state.routes = data
        },
        changeCurrentSession(state, currentSession) {
            state.currentSession = currentSession
            // 已读消息 小红点消失
            Vue.set(state.isDot, state.currentAdmin.username + '#' + state.currentSession.username, false)
        },
        addMessage(state, msg) {
            console.log(state.currentAdmin, '????')
            let mss = state.sessions[state.currentAdmin.username + '#' + msg.to]
            console.log(mss, '!!!')
            if (!mss) {
                Vue.set(state.sessions, state.currentAdmin.username + '#' + msg.to, [])
            }
            state.sessions[state.currentAdmin.username + '#' + msg.to].push
                ({
                    content: msg.content,
                    date: new Date(),
                    self: !msg.notSelf // 不是自己
                })
        },
        INIT_DATA(state) {
            // 浏览器本地的历史聊天记录
            let data = localStorage.getItem('vue-chat-session');
            if (data) {
                state.sessions = JSON.parse(data)
            }
        },
        // 初始化数据
        INIT_ADMINS(state, data) {
            state.admins = data
        }
    },

    // 异步执行
    actions: {
        //  在线聊天; context 上下文
        connect(context) {
            context.state.currentAdmin = JSON.parse(window.sessionStorage.getItem('user'))
            while (!context.state.currentAdmin) {
                context.state.currentAdmin = JSON.parse(window.sessionStorage.getItem('user'))
            }
            let token = window.sessionStorage.getItem('tokenStr')
            context.state.ws = new WebSocket("ws://localhost:3000")
            context.state.ws.onopen = function () {
                console.log('连接成功！')
                let obj = new Object()
                obj.token = token
                context.state.ws.send(JSON.stringify(obj))
            }
            context.state.ws.onmessage = function (e) {
                if (e.data == 401) {
                    Vue.$router.replace('/')
                }
                let receiveMsg = JSON.parse(e.data)
                if (!context.state.currentSession || receiveMsg.from != context.state.currentSession.username) {
                    Notification.info({
                        title: '【' + receiveMsg.fromname + '】 发来一条消息',
                        message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10) : receiveMsg.content,
                        position: 'bottom-right'
                    })
                    Vue.set(context.state.isDot, context.state.currentAdmin.username + '#' + receiveMsg.from, true)
                }
                receiveMsg.notSelf = true
                receiveMsg.to = receiveMsg.from
                context.commit('addMessage', receiveMsg)
            }
            // window.onbeforeunload = function () {
            //     ws.close()
            // }
            // context.state.ws.onclose = function () {

            // }
        },
        initData(context) {
            context.commit('INIT_DATA')
            // 调用接口获取数据
            const temp = {
                id: JSON.parse(window.sessionStorage.getItem('user')).id
            }
            postRequest('/chat/admin', temp).then(resp => {
                if (resp) {
                    context.commit('INIT_ADMINS', resp)
                }
            })
        }
    }
})
store.watch(function (state) {
    return state.sessions
}, function (val) {
    console.log('CHANGE: ', val)
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})
export default store