// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)
// 状态管理
Vue.use(Vuex)
// 使用axios来进行路由传输数据
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.withCredentials = true
Vue.prototype.$http = axios

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    isLogin: false,
    uid: null,
    positions: [],
    departments: [],
    extraWorks: [],
    absences: [],
  },
  mutations: {
    updateUserInfo(state, newUserInfo) {
      state.isLogin = true
      state.uid = newUserInfo.uid
    }
  }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  watch: {
    "$store": this.checkLogin
  },
  create() {
    this.checkLogin()
  },
  mtehods: {
    checkLogin() {
      if (!this.$state.isLogin){
        this.$router.push('/login')
      }
      else{
        this.$router.push('/main')
      }
    }
  },
  components: { App },
  template: '<App/>'
})
