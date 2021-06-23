import {util} from '@/utils/utils'

/**
 * 标记已读
 * @param apiKey
 * @param params
 * @returns {Promise<any>}
 */
export const updateRead = (ids) => {
  let newParams = {ids}
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/modules/message/read', newParams, res => {
      if (res.status === 200) {
        resolve(res)
      }else{
        reject()
      }
    })
  })
  return p
}
