import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/index.js'
import { initMenu } from './utils/menus'
import 'font-awesome/css/font-awesome.css'
import { getRequest } from './utils/api'
import { putRequest } from './utils/api'
import { postRequest } from './utils/api'
import { deleteRequest } from './utils/api'
import { downloadRequest } from './utils/download'

Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.downloadRequest = downloadRequest

router.beforeEach((to, from, next) => {
  console.log(from.path)
  console.log(to.path)
  if (window.sessionStorage.getItem('tokenStr')) {
    if (to.path != '/login') {
      initMenu(router, store)
    }
    if (!window.sessionStorage.getItem('user')) {
      return getRequest('/admin/info').then(resp => {
        if (resp) {
          window.sessionStorage.setItem('user', JSON.stringify(resp))
          next()
        }
      })
    }
    next()
  } else {
    if (to.path == '/login' || to.path == '/') {
      next()
    } else {
      next('/?redirect=' + to.path)
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
