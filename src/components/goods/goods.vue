<template>
  <div class="goods">
  <!-- 使用ref属性获取dom节点 -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul class="menu-list">
        <li v-for="item,index in goods" class="menu-item" :class="{current:currentIndex === index}" @click="scrollTo(index, $event)">
            <div class="text border-1px">
              <span class="icon" v-show="item.type > 0" :class="classArr[item.type]"></span>{{item.name}}
            </div>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul class="category-list">
        <li v-for="item in goods" class="j-category-wrapper">
          <h1 class="title">{{item.name}}</h1>
          <ul class="foods-list">
            <li v-for="food in item.foods" class="foods-listItem border-1px" @click="selectFood(food,$event)">
              <div class="avatar">
                <img width="57" height="57" :src="food.icon" :alt="food.name">
              </div>
              <div class="info">
                <h3 class="name">{{food.name}}</h3>
                <p class="description" v-show="food.description">{{food.description}}</p>
                <p class="sellStatus">
                  <span class="sellCount">月售{{food.sellCount}}</span><span class="rating">好评率{{food.rating}}%</span>
                </p>
                <p>
                  <span class="price">￥{{food.price}}</span><del v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</del>
                </p>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food" @cartAdd="cartAdd"></cartcontrol>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shoppingcart ref="shoppingcart" :minPrice="seller.minPrice" :deliveryPrice="seller.deliveryPrice" :selectFoods="selectFoods"></shoppingcart>
    <food :food="selectedFood" ref="food" @cartAdd="cartAdd"></food>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import shoppingcart from '../shoppingcart/shoppingcart'
  import cartcontrol from '../cartcontrol/cartcontrol'
  import food from '../food/food'
  const ERR_OK = 0

  export default {
    components: {
      shoppingcart: shoppingcart,
      cartcontrol: cartcontrol,
      food: food
    },
    props: ['seller'],
    data () {
      return {
        goods: [],
        foodsListHeight: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    created () {
      this.classArr = ['decrease', 'discount', 'special', 'invoice', 'guarantee']

      this.$http.get('/api/goods').then((response) => {
        response = response.data
        if (response.errno === ERR_OK) {
          this.goods = response.data
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        }
      })
    },
    methods: {
      // 加下划线表示内部方法，约定只能由组件内部调用
      _initScroll () {
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          // 传递一个属性，让插件实时派发scroll事件
          click: true,
          probeType: 3
        })
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          // 因为这个插件会把demo上的事件阻止了，所以需要额外开启
          click: true
        })
        this.foodsScroll.on('scroll', pos => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight () {
        let foodsList = Array.from(this.$refs.foodsWrapper.getElementsByClassName('j-category-wrapper'))

        let initHeight = 0

        foodsList.forEach(el => {
          this.foodsListHeight.push(initHeight)
          initHeight += el.offsetHeight
        })
      },
      scrollTo (index, event) {
      // 因为better-scroll开启click：true选项就是默认派发了一个click事件
      // 而我们在pc端，点击的时候，也会产生一个click事件，那么就会有两次click
      // better-sroll的event对象有一个_constructed属性，可以根据这个来判断只执行一次回调函数
        if (!event._constructed) {
  
        } else {
          let categoryWrapper = this.$refs.foodsWrapper.getElementsByClassName('j-category-wrapper')
          this.foodsScroll.scrollToElement(categoryWrapper[index], 300)
        }
      },
      cartAdd (target) {
        // vue 2统一使用ref标签属性获取dom，调用子组件方法
        // 使用nextTick异步执行下落动画，优化体检
        this.$nextTick(() => {
          this.$refs.shoppingcart.drop(target)
        })
      },
      selectFood (food, event) {
        if (!event._constructed) {
  
        } else {
          this.selectedFood = food
        // 试用$refs调用子组件方法，但是子组件不能调用父组件方法
          this.$refs.food.show()
        }
      }
    },
    computed: {
      // this.scrollY 变化，并对scrolly进行操作，则会触发computed事件，如果只是this.scrollY变化
      // 而不对它进行操作，也是不会触发computed事件的
      currentIndex () {
        for (let i = 0; i < this.foodsListHeight.length; i++) {
          let height1 = this.foodsListHeight[i]
          let height2 = this.foodsListHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      // 因为子组件cartcontrol改变了每个它所在的food，使用count统计了已选择的个数，所以要统计到底选择了多少个food，则需要使用遍历的方法
      // 这很好地体现了demo和数据绑定的思想
      selectFoods () {
        let selectFoodsList = []
        this.goods.forEach(item => {
          item.foods.forEach(food => {
            if (food.count > 0) {
              selectFoodsList.push(food)
            }
          })
        })
        return selectFoodsList
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './goods.stylus'
</style>
