<template>
  <div class="star" :class="starType">
    <!-- 给不同的span指定不同的class来达到展示不同星星的效果 -->
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script>
const LEN = 5
const CLS_ON = 'on'
const CLS_OFF = 'off'
const CLS_HALF = 'half'

export default {
  // props,接收父组件传递的参数
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starType () {
      // 显示不同的星星类型
      return 'star-' + this.size
    },
    itemClasses () {
      let result = []
      // 往下取0.5倍数,因为最小单位是0.5，如果是3.8，就需要取3.5
      let star = Math.floor(this.score * 2) / 2
      // push全星
      let integer = Math.floor(star)
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON)
      }
      // 判断是否有小数,是的话，push半星
      star % 1 !== 0 && result.push(CLS_HALF)
      // 补位
      while (result.length < LEN) {
        result.push(CLS_OFF)
      }
      return result
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'
  .star
    font-size 0
    .star-item
      display inline-block
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        &.on
          bg-img('./img/star48_on')
        &.half
          bg-img('./img/star48_half')
        &.off
          bg-img('./img/star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        &:last-child
          margin-right 0
        &.on
          bg-img('./img/star36_on')
        &.half
          bg-img('./img/star36_half')
        &.off
          bg-img('./img/star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        &:last-child
          margin-right 0
        &.on
          bg-img('./img/star24_on')
        &.half
          bg-img('./img/star24_half')
        &.off
          bg-img('./img/star24_off')

</style>
