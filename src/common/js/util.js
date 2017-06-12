/**
* 解析url参数
* @example ?id=1234&a=b
* @return Object {id:1234,a:b}
*/

export function urlParse (url) {
  let paramsStr = window.location.search.substring(1)
  let obj = {}
  let paramsArr = paramsStr.split('&')

  paramsArr.forEach(item => {
    // item = ['id=123','a=b']
    let tempArr = item.split('=')
    let key = tempArr[0]
    let value = tempArr[1]
    obj[key] = value
  })
  return obj
}
