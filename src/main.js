// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// main.js也即是入口文件
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'

// 引入子路由模块
import goods from '@/components/goods/goods'
import ratings from '@/components/ratings/ratings'
import sells from '@/components/seller/seller'
// 引入全局样式
import '@/common/stylus/index.styl'

// 使用 VueRouter中间件，路由和Resource
Vue.use(VueRouter)
Vue.use(VueResource)

// 关闭生产环境提示
Vue.config.productionTip = false

// 设置router数组
const routes = [
  {
    path: '/goods',
    component: goods
  }, {
    path: '/rating',
    component: ratings
  }, {
    path: '/seller',
    component: sells
  }
]

// 实例化router
const router = new VueRouter({routes, linkActiveClass: 'active'})

/* eslint-disable no-new */
// 最简洁的写法
new Vue({
  el: '#app',
  router,
  // render函数，渲染整个App组件
  render: h => h(App)
})

// 也可以这样写，es6对象写法，会将变量名变为key，变量值变为value
// new Vue({el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'})

// vue-router 编程式导航，默认打开goods
router.push({path: '/goods'})
