<template>
  <div id="app" class="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <!-- 设置路由路径 -->
      <div class="tab-item"><router-link to="/goods">商品</router-link></div>
      <div class="tab-item"><router-link to="/rating">评论</router-link></div>
      <div class="tab-item"><router-link to='/seller'>商家</router-link></div>
    </div>
    <!-- 使用keep-alive保持组件状态 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>
<script>
import header from './components/header/header.vue'
import {urlParse} from './common/js/util'

const ERR_OK = 0

export default {
  name: 'app',
  data () {
    return {
      seller: {
        id: (() => {
          // 获取url中的用户id
          let queryParams = urlParse()
          return queryParams.id
        })()
      }
    }
  },
  created () {
    this.$http.get('/api/seller').then(res => {
      const data = res.data
      if (data.errno === ERR_OK) {
        // 使用Object合并对象
        this.seller = Object.assign({}, data.data, this.seller)
      }
    }, err => {
      console.log(err)
    })
  },
  components: {
    'v-header': header
  }
}
</script>
<style lang="stylus" type="stylesheet/stylus">

  @import './common/stylus/mixin.styl'
  .app
    .tab
      display flex
      width 100%
      height 40px
      line-height 40px
      .tab-item
        text-align center
        flex 1
        font-size 14px
        & > a.active
          color rgb(240,20,20)
  .border-1px
    border-1px(rgba(7,17,27,.1))
</style>
