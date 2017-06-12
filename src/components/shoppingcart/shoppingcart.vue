<template>
  <div class="shoppingcart">
    <transition name="fade">
      <div class="list-mask"  v-show="!fold" @click="fold = true"></div>
    </transition>
    <transition name="fold">
      <div class="shoppingcart-list" v-show="listShow">
        <div class="list-header">
          <div class="title">购物车</div>
          <div class="empty" @click="emptyList">清空</div>
        </div>
        <div class="list-container" ref="listContainer">
          <ul>
            <li v-for="food in selectFoods" class="foodItem border-1px">
              <div class="container-left text-hide">
                <span>{{food.name}}</span>
              </div>
              <div class="container-right">
                <div class="price">￥{{food.price *  food.count}}</div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <div class="cart-wrapper">
      <div class="content-left" @click="togglistShow">
        <div class="cart">
          <span class="icon icon-shopping_cart" :class="{'isSelected':totalCount > 0}"></span>
          <span class="selectedCount" v-show="totalCount > 0">{{totalCount}}</span>
        </div>
        <div class="sumPrice" :class="{'isSelected':totalCount > 0}">￥{{totalPrice}}</div>
        <div class="tips">另需配送费￥{{deliveryPrice}}</div>
      </div>
      <div class="content-right" @click="pay">
        <div class="payDes" :class="payClass">{{payDes}}</div>
      </div>
    </div>
    <div class="ball-container">
      <transition-group
        name="drop"
        tag="div"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
      >
        <div class = "ball" v-for="ball in balls" v-show="ball.show" v-bind:key="ball">
          <div class="inner j-inner"></div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
  import cartcontrol from '../cartcontrol/cartcontrol'
  import BScroll from 'better-scroll'
  export default {
    data () {
      return {
        // 设置五个小球，用于小球下落动画
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],

        /* 使用fold做中间变量,点击购物车，进行toggle操作 */
        /* 如果在点击的时候对totalCount进行判断是不行的，有可能会在外面进行点击对购物车进行增删 */
        /* 所以最靠谱的办法就是监控totalCount，如果totalCount小于0，购物车处于隐藏状态 */
        /* 如果大于0，则可以任意对fold进行取反，来显示隐藏购物车列表 */
        /* 点击 */
        fold: true
      }
    },
    components: {
      cartcontrol: cartcontrol
    },
    props: {
      minPrice: {
        type: Number,
        default: 0
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      /* 主要功能都是在维护这个数据的状态 */
      selectFoods: {
        type: Array,
        //  在vue中，如果父组件传递的是一个数组，default则必须是一个数组
        default () {
          return [
            {
              price: 0,
              count: 0
            }
          ]
        }
      }
    },
    computed: {
      // 计算食物总价
      totalPrice () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount () {
        // 计算食物份数
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDes () {
        // 计算订单状态
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`
        } else if (this.totalPrice >= this.minPrice) {
          return '去结算'
        } else if (this.totalPrice < this.minPrice) {
          this.isGotoPay = false
          let rest = this.minPrice - this.totalPrice
          return `还差￥${rest}起送`
        }
      },
      payClass () {
        if (this.totalPrice >= this.minPrice) {
          return 'enough'
        } else {
          return 'no-enough'
        }
      },
      listShow () {
        if (!this.totalCount) {
          // 如果totalCount小于0 ，将购物车列表隐藏
          this.fold = true
          return false
        }

        // 如大于0 ，就可以进行任意的取反，控制显示隐藏
        let show = !this.fold

        // 如果是显示状态，则异步刷新scroll容器，获得新的高度
        if (show) {
          this.$nextTick(() => {
            // 如果是this.scroll不存在则初始化，否则使用refresh强制刷新
            if (!this.scroll) {
              // 因为 cartcontrol组件依赖这个betterscroll插件，所以需要将其引引来
              this.scroll = new BScroll(this.$refs.listContainer, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    },
    methods: {
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          // 遍历小球数组
          let ball = this.balls[i]
          // 如果小球的show为false，则设置为true，并将对应的el储存起来
          if (!ball.show) {
            ball.show = true
            // ball.el 是加的按钮元素
            ball.el = el
            // 将ball放到已经下落的小球集合中
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeEnter (el) {
        // 此处传入的ball是shoppingcart的小球
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          // 如果这个小球已经显示，就说明这个小球处于下落状态
          if (ball.show) {
            // 获取加号按钮相对于视口的位置
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            // el.style.display = ''
            // 先把小球移动到加号按钮的附近，准备进行下落
            el.style.webkitTransform = `translate3d(0,${y}px,0)`
            el.style.transform = `translate3d(0,${y}px,0)`
            let inner = el.getElementsByClassName('j-inner')[0]
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      enter (el, done) {
        /* eslint-disable no-unused-vars */
        // 手动触发浏览器重绘
        let rf = el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.getElementsByClassName('j-inner')[0]
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
          el.addEventListener('transitionend', done)
        })
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          // 将小球的show属性设置为false，在balls中循环使用
          ball.show = false
          // transition enter结束，将小球隐藏
          el.style.display = 'none'
        }
      },
      togglistShow () {
        // 如果订单总数小于0的话，则不操作
        if (!this.totalCount) return
        // 否则取反，这里并不是真正用来显示隐藏，只是间接地使数据变动
        // 触发计算属性，可以看出，计算属性适用于基于某些基本效果的复杂逻辑
        this.fold = !this.fold
      },
      emptyList () {
        this.selectFoods.forEach(food => {
          food.count = 0
        })
      },
      pay () {
        if (this.totalPrice < this.minPrice) {
          return
        }
        alert(`请支付￥${this.totalPrice}`)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './shoppingcart.stylus'
</style>
