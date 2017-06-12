<template>
  <div class="ratingsSelect">
    <div class="ratingsType border-1px">
      <div class="typeItem normal" :class="{active: selectType === 2}" @click="select(2,$event)">
        {{desc.all}}<span class="count">{{ratings.length}}</span>
      </div>
      <div class="typeItem normal" :class="{active: selectType === 0}" @click="select(0,$event)">
        {{desc.positive}}<span class="count">{{positives.length}}</span>
      </div>
      <div class="typeItem bad" :class="{active: selectType === 1}" @click="select(1,$event)">
        {{desc.negative}}<span class="count">{{negatives.length}}</span>
      </div>
    </div>
    <div class="switch">
      <span class="icon-check_circle" @click="switchToggle($event)" :class="{active: onlyContent}"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2

  export default {
    data () {
      return {

      }
    },
    // 作为一个可通用的组件，通过props接口来接收外部传参
    // 根据不同参数作出显示不同的内容
    props: {
      // 评论内容
      ratings: {
        type: Array,
        // 如果是一个数组，需要使用函数返回
        default () {
          return []
        }
      },
      // 选择的类型
      selectType: {
        type: Number,
        default: ALL
      },
      // 是否只看有内容的评论
      onlyContent: {
        type: Boolean,
        default: false
      },
      // 评价的文字描述
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    methods: {
      switchToggle (event) {
        if (!event._constructed) {
          return
        }
        this.$emit('switchToggle')
      },
      select (type, event) {
        if (!event._constructed) {
          return
        }
        // 因为在父组件传递过来的数据，是不能直接在子组件的修改的，所以需要使用事件发布的方式
        // 传递一个事件，在父组件订阅此事件，对数据进行修改，才能同步更新到子组件
        this.$emit('select', type)
      }
    },
    computed: {
      positives () {
        return this.ratings.filter(item => {
          return item.rateType === POSITIVE
        })
      },
      negatives () {
        return this.ratings.filter(item => {
          return item.rateType === NEGATIVE
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

  @import '../../common/stylus/mixin.styl'

  .ratingsType
    margin 0 18px
    padding 18px 0
    border-1px(rgba(7,17,27,0.1))
    .typeItem
      display inline-block
      padding 8px 12px
      margin-right 8px
      font-size 12px
      line-height 16px
      border-radius 2px
      color rgb(77,85,93)
      .count
        margin-left 4px
        font-size 10px
      &.active
        color #fff
      &.normal
        background rgba(0,160,220,0.2)
        &.active
          background rgb(0,160,220)
      &.bad
        background rgba(77,85,93,0.2)
        &.active
          background rgb(77,85,93)


  .switch
    font-size 0
    padding 12px 18px
    line-height 24px
    color rgb(147,153,159)
    border-bottom 1px solid rgba(7,17,27,0.1)
    .icon-check_circle
      display inline-block
      vertical-align top
      margin-right 4px
      font-size 24px
      color rgb(147,153,159)
      &.active
        color #00c850
    .text
      display inline-block
      vertical-align top
      font-size 12px



</style>
