import {baseUrl,util} from '@/utils/utils.js'

const defaults = {
  // baseURL: baseUrl(),
  // transformResponse: [(data) => {
  //   return JSON.parse(replaceImageUrl(data))
  // }]
}


export const xzkm = () => {
  // return axios.get("/expenseApply/selectCost?pageSize=10")
  var data;
  util.sycnPost("/expenseApply/selectCost",{pageSize:10},function(result){
      data = result;
  });
  return data;
}
function replaceImageUrl (str) {
  let reg = /https?:(\\?\/){2}(pic\d*\.zhimg\.com\\?\/)/g
  return str.replace(reg, 'https://images.weserv.nl/?url=$2')
}