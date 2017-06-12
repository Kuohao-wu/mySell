<template>
  <transition name="slide">
    <div v-show="showFlag" class="food" ref="foodPannel">
      <div class="foodContent">
        <div class="img-header">
          <img :src="food.image" :alt="food.name" class="foodImg">
          <span class="back icon-arrow_lift" @click="showFlag = false"></span>
        </div>
        <div class="sellInfo">
          <h1 class="title">{{food.name}}</h1>
          <p class="sellStatus">
            <span class="sellCount">月售{{food.sellCount}}</span><span class="rating">好评率{{food.rating}}%</span>
          </p>
          <p>
            <span class="price">￥{{food.price}}</span><del v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</del>
          </p>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" @cartAdd="addFood"></cartcontrol>
          </div>
          <!-- 这里需要一个过渡动画，因为如果一点击就消失的话，就不能正确计算此元素的高度，小球运动就会有问题 -->
          <transition name="fade">
            <span class="addFirst" @click.stop.prevent="addFirst(food,$event)" v-show="!food.count || food.count === 0">加入购物车</span>
          </transition>
        </div>
        <div class="food-border" v-show="food.info"></div>
        <div class="sellIntro" v-show="food.info">
          <h2 class="title">商品介绍</h2>
          <p class="foodIntro">{{food.info}}</p>
        </div>
        <div class="food-border"></div>
        <div class="sellRatings">
          <h2 class="title">商品评价</h2>
          <ratinsSelect
          :ratings = "food.ratings"
          :selectType = "selectType"
          :onlyContent = "onlyContent"
          :desc = "desc"
          @switchToggle = "switchToggle"
          @select ="selectRatings"
          ></ratinsSelect>
        </div>
        <div class="ratingList">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-for="rating in food.ratings" class="ratingContent border-1px" v-show="needShow(rating.rateType,rating.text)">
              <div class="content-left">
                <p class="ratingTime">
                  <span>{{rating.rateTime | rateTime}}</span>
                  <!-- <span>{{rating.rateTime | YMD}}</span><span>{{rating.rateTime | HM}}</span> -->
                </p>
                <p class="ratingText">
                  <span class="ratingIcon" :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </div>
              <div class="content-right">
                <span class="username">{{rating.username}}</span>
                <span class="advatar">
                  <img :src="rating.avatar" height="12" width="12">
                </span>
              </div>
            </li>
          </ul>
          <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">
            <p>暂无评价</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol'
  import Vue from 'vue'
  import ratinsSelect from '../ratinsSelect/ratinsSelect'
  import {formatDate} from '../../common/js/formatDate.js'

  // const POSITIVE = 0
  // const NEGATIVE = 1
  const ALL = 2

  export default {
    data () {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    props: {
      food: {
        type: Object
      }
    },
    components: {
      cartcontrol: cartcontrol,
      ratinsSelect: ratinsSelect
    },
    methods: {
      show () {
        this.showFlag = true

        // 每次打开详情页，初始化这些参数
        this.selectType = ALL
        this.onlyContent = false

        // 使用$nextTick，保证在dom渲染完成之后才初始化better-scroll
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodPannel, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      addFirst (food, event) {
        if (!event._constructed) {
          return
        } else {
          if (!food.count) {
            Vue.set(food, 'count', 1)
          } else {
            food.count += 1
          }
        }
        // 第一次点击购物车的时候，需要发布一个cartAdd事件，显示小球动画
        this.$emit('cartAdd', event.target)
      },
      addFood () {
        // 监听组件中的cartAdd事件，然后再通过this.$emit传递到父组件
        // 实现了多级组件的通信
        this.$emit('cartAdd', event.target)
      },
      selectRatings (type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      switchToggle () {
        this.onlyContent = !this.onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      // 使用一个函数来确定是否显示评论列表项，因为数据是会变动的，变动则会引起方法的重新判断
      needShow (type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      }
    },
    filters: {
      rateTime (time) {
        return formatDate('yyyy-MM-dd hh:mm', new Date(time))
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

  @import '../../common/stylus/mixin.styl'

  /* mixin */
  _title($mgb,$fw=normal)
    font-size 14px
    line-height 14px
    color rgb(7,17,27)
    margin-bottom $mgb px
    font-weight $fw

  .food
    position fixed
    top 0
    right 0
    bottom 48px
    width 100%
    background #fff

    &.slide-enter-active,&.slide-leave-active
      transition all 0.5s

    &.slide-enter,&.slide-leave-active
      transform translate3d(100%,0,0)

    .foodContent
      .img-header
        position relative
        width 100%
        height 0
        padding-top 100%
      .foodImg
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position: absolute;
        left: 8px;
        top: 15px;
        color: #fff;
        font-size: 16px;
        padding: 6px;

      .sellInfo
        position relative
        padding 18px
        .title
          _title(8,700)
        .sellCount
          margin-right 12px
        .sellStatus
          padding-bottom 18px
          font-size 10px
          line-height 10px
          color rgb(147,153,159)
        .price
          font-size 14px
          color rgb(208,14,0)
          font-weight 700
          line-height 24px
          margin-right 8px
        .oldPrice
          font-size 10px
          line-height 24px
          color rgb(147,153,159)
        .addFirst
          position absolute
          right 18px
          bottom 18px
          border none
          box-sizing border-box
          padding 0 12px
          height 24px
          font-size 10px
          color #fff
          line-height 24px
          border-radius 14px
          background rgb(0,160,220)
          outline none
          &.fade-enter-active, &.fade-leave-active
            transition all 0.2s
          &.fade-enter, &.fade-leave-active
            opacity 0
        .cartcontrol-wrapper
          position absolute
          right 12px
          bottom 12px

      .food-border
        split-border()

      .sellIntro
        padding 18px
        .title
           _title(6)
        .foodIntro
           padding 8px
           font-size 12px
           font-weight 200
           line-height 24px
           color rgb(77,85,93)

      .sellRatings
        padding-top 18px
        .title
          margin-left 18px
          _title(0)

      .ratingList
        margin 0 18px
        font-size 0
        .ratingContent
          position relative
          padding 18px 0
          border-1px(rgba(7,17,27,0.1))
        .content-right
          position absolute
          top 18px
          right 0
          .username
            font-size 10px
            color rgb(147,153,159)
            line-height 12px
            margin-right 12px
          .advatar
            display inline-block
            vertical-align top
            border-radius 50%
            overflow hidden

        .ratingTime
          font-size 10px
          color rgb(147,153,159)
          line-height 12px
        .icon-thumb_up
          color rgb(0,160,220)
        .ratingText
          margin-top 6px
          font-size 12px
          line-height 16px
          color rgb(147,153,159)

        .ratingIcon
          display inline-block
          vertical-align middle
          margin-right 4px
          font-size 12px
          line-height 16px

        .ratingTime
          :first-child
            margin-right 8px

      .no-ratings
        font-size 12px
        color rgb(147,153,159)
        padding 16px 0
</style>
