<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview border-1px">
        <div class="content-left">
          <h1 class="title">{{seller.name}}</h1>
          <div class="desc">
            <div class="star-wrapper">
              <star :size="36" :score="seller.score"></star>
            </div>
            <span class="rank">({{seller.ratingCount}})</span>
            <span class="sellCount">月售{{seller.sellCount}}单</span>
          </div>
        </div>
        <div class="content-right" @click="favorite($event)">
          <span class="icon-favorite" :class="{active:isfavorite}"></span>
          <span class="text">{{favoriteInfo}}</span>
        </div>
      </div>
      <ul class="remark">
        <li class="block">
          <h2 class="title">起送价</h2>
          <div class="content">
            <strong class="stress">{{seller.minPrice}}</strong>元
          </div>
        </li>
        <li class="block">
          <h2 class="title">商家配送</h2>
          <div class="content">
            <strong class="stress">{{seller.deliveryPrice}}</strong>元
          </div>
        </li>
        <li class="block">
          <h2 class="title">平均配送时间</h2>
          <div class="content">
            <strong class="stress">{{seller.deliveryTime}}</strong>分钟
          </div>
        </li>
      </ul>
      <div class="split-border"></div>
      <div class="notice">
        <h2 class="title">公告与活动</h2>
        <p class="bulletin">{{seller.bulletin}}</p>
        <ul class="info-list">
          <li v-for="item in seller.supports" class="list-item border-1px">
            <span class="icon" :class="classArr[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <div class="split-border"></div>
      <div class="live-action">
        <h2 class="title">商家实景</h2>
        <div class="picsContainer" ref="picsContainer">
          <ul class="picsList">
            <li class="listItem" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <div class="split-border"></div>
      <div class="seller-info">
        <h2 class="title">商家信息</h2>
        <ul class="info-list">
          <li class="list-item border-1px" v-for="item in seller.infos">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import star from '../star/star'
import BScroll from 'better-scroll'
import {saveToLocal, loadFromLocal} from '../../common/js/store'

export default {
  data () {
    return {
      isfavorite: (() => {
        return loadFromLocal(this.seller.id, 'isfavorite', false)
      })()
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    star: star
  },
  watch: {
    seller () {
      // 使用nextTick确保dom已经正常渲染
      this.$nextTick(() => {
        this._initContainerScroll()
        this._initPicContainerScroll()
      })
    }
  },
  methods: {
    _initContainerScroll () {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    },
    _initPicContainerScroll () {
      if (this.seller.pics) {
        const picWidth = 120
        const picMagin = 6
        let resultWidth = (picWidth + picMagin) * this.seller.pics.length - picMagin
        this.$refs.picsContainer.getElementsByClassName('picsList')[0].style.width = resultWidth + 'px'
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picsContainer, {
              scrollX: 'true',
              eventPassthrough: 'vertical'
            })
          } else {
            this.picScroll.refresh()
          }
        })
      }
    },
    favorite (evt) {
      if (!evt._constructed) {
        return
      }
      this.isfavorite = !this.isfavorite
      saveToLocal(this.seller.id, 'isfavorite', this.isfavorite)
    }
  },
  computed: {
    favoriteInfo () {
      return this.isfavorite ? '已收藏' : '收藏'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._initContainerScroll()
      this._initPicContainerScroll()
    })
  },
  created () {
    this.classArr = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  _title($pd)
    font-size 14px
    color rgb(7,17,27)
    line-height 14px
    padding-bottom $pd

  .seller
    position absolute
    top 174px
    bottom 0
    width 100%
    overflow hidden
    .overview
      display flex
      justify-content space-between
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7,17,27,0.1))
      .title
        _title(8px)
      .desc
        font-size 0
      .star-wrapper
        display inline-block
        vertical-align top
      .rank,.sellCount
        font-size 10px
        line-height 14px
        color rgb(77,85,93)
      .rank
        margin 0 8px 0 12px
      .content-right
        width 45px
        text-align center
        .icon-favorite
         display block
         font-size 24px
         line-height 20px
         padding-bottom 4px
         color rgb(77,85,93)
         &.active
           color rgb(240,20,20)
       .text
         font-size 10px
         line-height 10px
         color rgb(77,85,93)
    .remark
      display flex
      margin 18px 0
      padding 0 18px
      .block
        flex 1
        text-align center
        border-right 1px solid rgba(7,17,27,0.1)
        &:last-child
          border-right none
      .title
        font-size 10px
        line-height 10px
        color rgb(147,153,159)
        padding-bottom 4px
      .stress
        font-size 24px
        line-height 24px
        font-weight 200
        color rgb(7,17,27)
    .split-border
      split-border()

    .notice
      margin 0 18px
      padding-top 18px
      .title
        _title(8px)
      .bulletin
        padding 0 12px
        line-height 24px
        font-size 12px
        font-weight 200
        color rgb(240,20,20)
      .info-list
        margin-top 16px
        .list-item
          font-size 0
          padding 16px 12px
          border-1px(rgba(7,17,27,0.1))
          &::after
            bottom 100%
          .text
            line-height 16px
            font-size 12px
            font-weight 200
            color rgb(7,17,27)
          .icon
            icon(2)
            width 16px
            height 16px
            margin-right 6px

    .live-action
      padding 18px
      .title
        _title(12px)
      .picsContainer
        height 90px
        font-size 0
        overflow hidden
        .picsList
          white-space: nowrap
        .listItem
          display inline-block
          margin-right 6px
          &:last-child
            margin-right 0

    .seller-info
      padding 18px 18px 0
      .title
        _title(12px)
      .info-list
        margin-top 16px
        .list-item
          font-size 0
          padding 16px 12px
          line-height 16px
          font-size 12px
          font-weight 200
          color rgb(7,17,27)
          border-1px(rgba(7,17,27,0.1))
          &::after
            bottom 100%





</style>
