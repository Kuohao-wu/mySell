<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}} / {{seller.deliveryTime}}分钟送达
        </div>
        <div class="supports" v-if="seller.supports">
          <span class="icon" :class="classArr[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="supports-count" @click="detailShow = true">
        <span class="count">{{seller.supports.length}}个</span>
        <span class="arrow icon-keyboard_arrow_right"></span>
      </div>
    </div>
    <!-- 公告 -->
    <div class="bulletin-wrapper" @click="detailShow = true">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <span class="arrow icon-keyboard_arrow_right"></span>
    </div>
    <!-- 头部 -->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>

    <!-- 弹层组件 -->
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="2.6"></star>
            </div>
            <!-- 优惠信息 -->
            <section>
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <ul class="info-list" v-if="seller.supports">
                <li v-for="support in seller.supports" class="list-item">
                  <!-- 根据 type遍历列表的样式数组，实现不同的样式 -->
                  <span class="icon" :class="classArr[support.type]"></span>
                  <span class="text">{{support.description}}</span>
                </li>
              </ul>
            </section>
            <!-- 商家公告 -->
            <section>
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <p class="notification">
                {{seller.bulletin}}
              </p>
            </section>
          </div>
        </div>
        <div class="detail-close icon-close" @click="detailShow = false"></div>
      </div>
    </transition>
  </div>
</template>

<script>
  import star from '../star/star'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      star: star
    },
    data () {
      return {
        detailShow: false
      }
    },
    created () {
      this.classArr = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './header.stylus'
</style>
