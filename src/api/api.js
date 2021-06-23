import {util} from '@/utils/utils'
/**
 * 根据注册api的key获取查询结果，接口只返回status,200表示成功
 * @param params
 */
export const getByApi = (apiKey,params) => {
  let newParams = {apiKey, params}
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/form/api/execute', newParams, res => {
      if (res.status === 200) {
        resolve(res.data)
      }else{
        reject()
      }
    })
  })
  return p
}
/**
 * 根据注册api的key获取查询结果，接口只返回status,200表示成功
 * @param params
 */
export const getDataByApi = (apiKey,params) => {
  let newParams = {apiKey, params}
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/form/api/execute', newParams, res => {
      if (res.status === 200) {
        resolve(res)
      }else{
        reject()
      }
    })
  })
  return p
}
/**
 * 根据注册api的key获取跟新数据
 * 可以在params中指定pageIndex,pageSize,接口返回的是数组,如果不指定pageIndex，默认1，pageSize默认也是1
 * 如果指定pageSize且大于1，则后台认为是分页，返回的数据包含totalCount和data
 * @param params
 */
export const updateByApi = (apiKey,params) => {
  let newParams = {apiKey, params}
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/form/api/execute', newParams, res => {
      if (res.status === 200) {
        resolve(res)
      }else{
        reject()
      }
    })
  })
  return p
}

/**
 * 退出登录
 * @param params
 */
export const logout = () => {
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/logout', {}, res => {
      if (res.status === 200) {
        resolve(res.data)
      }else{
        reject()
      }
    })
  })
  return p
}
