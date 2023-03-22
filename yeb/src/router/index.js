import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import FriendChat from '../views/chat/FriendChat'

Vue.use(VueRouter)

// 解决报错
const pu = VueRouter.prototype.push
const re = VueRouter.prototype.replace

// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onReject || onResolve) {
    return pu.call(this, location, onResolve, onReject)
  }
  return pu.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onReject || onResolve) {
    return re.call(this, location, onResolve, onReject)
  }
  return re.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'Login',
    redirect: '/login',
    hidden: true,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    hidden: true,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/chat',
        name: 'Chat',
        component: FriendChat,
      }
    ]

  }
]

const router = new VueRouter({
  routes
})

export default router
