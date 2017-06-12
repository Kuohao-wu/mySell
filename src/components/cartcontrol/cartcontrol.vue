<template>
  <div class="cartcontrol">
    <transition name="fade">
        <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decrease">
          <span class="inner icon-remove_circle_outline"></span>
        </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="add"></div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    data () {
      return {

      }
    },
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      add (event) {
        if (!event._constructed) {
          return
        } else {
          if (!this.food.count) {
            // 因为Object.definedProperty方法无法检测新增属性，所以无法更新数据，所以需要使用Vue.set方法去设置
            // 使得新增属性可检测
            Vue.set(this.food, 'count', 1)
          } else {
            this.food.count += 1
          }
        }
        this.$emit('cartAdd', event.target)
      },
      decrease () {
        if (!event._constructed) {
          return
        } else {
          this.food.count -= 1
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-add
      display inline-block
      vertical-align top
      padding 6px
      font-size 24px
      color rgb(0,160,220)
    .cart-decrease
      display inline-block
      vertical-align top
      padding 6px
      line-height 1
      // 分开两个层来做，是因为transform需要同步进行
      // enter和leave-active设置开始和结束状态
      &.fade-enter,&.fade-leave-active
        opacity 0
        transform translate3D(24px,0,0)
        .inner
          transform rotate(180deg)
      // 过渡的设置都应该在active中进行
      &.fade-enter-active, &.fade-leave-active
        transition all 0.3s linear
        .inner
          transition all 0.3s linear
    .inner
      display inline-block
      font-size 24px
      color rgb(0,160,220)
    .cart-count
      display inline-block
      vertical-align top
      padding-top 6px
      // 给固定宽度，不然count变化，会影响两边的icon，造成一种抖动的效果
      width 12px
      line-height 24px
      font-size 10px
      color rgb(147,153,159)
</style>
