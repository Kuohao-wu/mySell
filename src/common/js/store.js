/**
* @数据存储格式
*  __seller__:{
*    id: {
*      key: value
*   }
*  }
*
*/

export function saveToLocal (id, key, val) {
  let seller = window.localStorage.__seller__
  // 不存在这个存储空间，则赋值一个变量初始化
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    // 存在存储空间，则转换成对象进行判断
    seller = JSON.parse(seller)
    // 不存在对应id，则需要初始化
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  // 最后赋值
  seller[id][key] = val
  // 写入本地存储
  window.localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal (id, key, def) {
  // 转换为js对象，进行判断
  let seller = window.localStorage.__seller__

  if (!seller) {
    return def
  }

  seller = JSON.parse(seller)
  // 此处不能使用.运算符，因为id是字符串是数字都不能使用点运算符，只能使用[]
  if (!seller[id]) {
    return def
  }
  return seller[id][key]
}
