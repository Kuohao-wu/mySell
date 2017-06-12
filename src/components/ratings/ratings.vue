<template>
  <div class="ratings" ref="ratingsContainer">
    <div class="ratings-content">
      <div class="overview">
        <div class="content-left">
          <div class="score">{{seller.score}}</div>
          <div class="title">综合评分</div>
          <div class="tips">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="content-right">
          <div class="serviceScore">
            <span class="label">服务态度</span>
            <div class="star-wrapper">
              <star :size="36" :score="seller.serviceScore"></star>
            </div>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="foodScore">
            <span class="label">食物评分</span>
            <div class="star-wrapper">
              <star :size="36" :score="seller.foodScore"></star>
            </div>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="deliveryTime">
            <span class="label">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <div class="split-border"></div>
      <div class="ratingsSelect-wrapper">
        <ratingsSelect
        :selectType="selectType"
        :onlyContent="onlyContent"
        :desc="desc"
        :ratings="ratings"
        @switchToggle = "switchToggle"
        @select ="selectRatings"
        ></ratingsSelect>
      </div>
      <div class="ratingsList">
        <ul v-show="ratings && ratings.length">
          <li v-show="needShow(rating.rateType, rating.text)" v-for="rating in ratings" class="ratingItem border-1px">
            <img :src="rating.avatar" width="28" height="28" class="avatar">
            <div class="content">
              <p class="username">{{rating.username}}</p>
              <div class="score-content">
                <div class="star-wrapper">
                  <star :size="24" :score="rating.score"></star>
                </div>
                <span class="deliveryTime" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend-container" v-show="rating.recommend && rating.recommend.length">
                <span class="icon" :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
                <ul class="recommendList">
                  <li v-for="item in rating.recommend" v-text="item" class="listItem"></li>
                </ul>
              </div>
            </div>
            <div class="rateTime">{{rating.rateTime | rateTime}}</div>
          </li>
        </ul>
      </div>
      <div class="no-ratings" v-show="!ratings || !ratings.length">
        <p>暂无评价</p>
      </div>
    </div>

  </div>
</template>

<script>
  import star from '../star/star'
  import ratingsSelect from '../ratinsSelect/ratinsSelect'
  import BScroll from 'better-scroll'
  import {formatDate} from '../../common/js/formatDate'

  const ERR_OK = 0
  // const POSITIVE = 0
  // const NEGATIVE = 1
  const ALL = 2

  export default {
    data () {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    created () {
      this.$http.get('/api/ratings').then(response => {
        let responseData = response.data
        if (responseData.errno === ERR_OK) {
          this.ratings = responseData.data

          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratingsContainer, {
              click: true
            })
          })
        }
      })
    },
    components: {
      star: star,
      ratingsSelect: ratingsSelect
    },
    methods: {
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

  .ratings
    position absolute
    top 174px
    bottom 0
    width 100%
    overflow hidden
    .overview
      display flex
      align-items center
      .content-left
        flex 0 0 137px
        width 137px
        padding 18px 0
        text-align center
        @media only screen and (max-width:320px)
          flex-basis 110px
          width 120px
        .score
          font-size 24px
          color rgb(255,153,0)
          line-height 28px
        .title
          font-size 12px
          line-height 12px
          color rgb(7,17,27)
          margin-top 6px
        .tips
          font-size 10px
          line-height 10px
          color rgb(147,153,159)
          margin-top 8px
          margin-bottom 6px
      .content-right
        flex 1
        padding 6px 0 6px 24px
        border-left 1px solid rgba(7,17,27,0.1)
        font-size 0
        @media only screen and (max-width:320px)
          padding-left 12px
        .serviceScore,.foodScore
          padding-bottom 8px
        .label
          display inline-block
          vertical-align top
          font-size 12px
          color rgb(7,17,27)
          line-height 18px
          margin-right 12px
        .star-wrapper
          display inline-block
          vertical-align top
          margin-right 12px
        .score
          font-size 12px
          line-height 18px
          color rgb(255,153,0)
        .deliveryTime
          .time
            font-size 12px
            line-height 18px
            color rgb(147,153,159)

    .split-border
      split-border()

    .ratingsList
      .ratingItem
        display flex
        font-size 0
        padding 18px 0
        margin 0 18px
        border-1px(rgba(7,17,27,0.1))
      .avatar
        display block
        flex 0 0 28px
        width 28px
        border-radius 50%
      .content
        flex 1
        margin-left 12px
        .username
          font-size 10px
          line-height 12px
          color rgb(7,17,27)
          margin-bottom 4px
        .star-wrapper
          display inline-block
          vertical-align top
        .deliveryTime
          margin-left 6px
          display inline-block
          vertical-align top
          font-size 10px
          font-weight 200
          line-height 10px
          color rgb(147,153,159)
        .text
          font-size 12px
          line-height 18px
          color rgb(7,17,27)
          padding-top 6px
        .recommend-container
          display flex
          margin-top 8px
          .icon
            font-size 12px
            line-height 16px
          .icon-thumb_up
            color rgb(0,160,220)
          .icon-thumb_down
            color rgb(147,153,159)
          .recommendList
            flex 1
            display inline-block
            vertical-align top
            margin-left 8px
            font-size 9px
            line-height 16px
            color rgb(148,153,159)
            .listItem
              display inline-block
              border 1px solid rgba(7,17,27,0.1)
              border-radius 2px
              padding 0 6px
              margin 0 8px 2px 0
              box-sizing border-box
              width 60px
              text-align center
              text-hide()
      .rateTime
        position absolute
        top 18px
        right 0
        font-size 10px
        font-weight 200
        line-height 12px
        color rgb(147,153,159)
    .no-ratings
      font-size 12px
      color rgb(147,153,159)
      padding 16px 0
</style>
