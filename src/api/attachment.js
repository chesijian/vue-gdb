import {util, sessionUtil} from '@/utils/utils'
import {deleteData} from './form-render';


export const getFileLookUrl = (id, ifThumb) => {
  let url = util.getBaseUrl() + '/api_v1/files/' + id + '/look?access_token=' + sessionUtil.getAccessToken()
  if(ifThumb !== undefined){
    url = url + '&ifThumb=' + ifThumb
  }
  return url
}

export const getFileDownloadUrl = (id, ifThumb) => {
  let url = util.getBaseUrl() + '/api_v1/files/' + id + '/download?access_token=' + sessionUtil.getAccessToken()
  if(ifThumb !== undefined){
    url = url + '&ifThumb=' + ifThumb
  }
  return url
}

export const getTempLookUrl = (id, ifThumb) => {
  let url = util.getBaseUrl() + '/api_v1/temp/' + id + '/look?access_token=' + sessionUtil.getAccessToken()
  if(ifThumb !== undefined){
    url = url + '&ifThumb=' + ifThumb
  }
  return url
}

export const deleteFile = (id) => {
  var p = new Promise(function (resolve, reject) {
    util.confirm('确认删除吗？',()=>{
      deleteData({'tableName':'t_attachment','businessKey':id}).then(()=>{
        resolve()
      })
    })
  })
  return p
}
