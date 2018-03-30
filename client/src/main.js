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
    employees: [],
    depOrPos: '',
    salarys: {},
    series: [],
    meanSalary: {
      "name": "平均工资",
      "type": 'line',
    },
    meanData: [0,0,0,0,0,0,0,0,0,0,0,0]
  },
  mutations: {
    updateUserInfo(state, newUserInfo) {
      state.isLogin = true
      state.uid = newUserInfo.uid
    },
    updateSeries(state, payload) {
      let salary = {}
      salary["name"] = payload.name
      salary["type"] = 'line'
      salary["data"] = []
      let tmp = state.salarys[payload.id]
      for (let i = 1; i <= 12; i++) {
        salary["data"].push(tmp[i].salary)
        // console.log(state.meanData[i-1], tmp[i].salary)
        // state.meanSalary.data[i - 1] += tmp[i].salary
        // console.log(state.meanData, '前面')
        // let sum = state.meanData[i - 1] + tmp[i].salary
        // Vue.set(state.meanData, i - 1, sum)
        // console.log(state.meanData[i-1], tmp[i].salary)
      }
      // console.log(this.state.meanData)
      // this.state.meanData = state.meanSalary
      Vue.set(state.series, payload.index, salary)
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
      if (!this.$state.isLogin) {
        this.$router.push('/login')
      } else {
        this.$router.push('/main')
      }
    }
  },
  components: { App },
  template: '<App/>'
})
