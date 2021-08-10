/* eslint-disable eqeqeq */
import {util} from '@/utils/api'

/**
 * 加载列表数据
 * @param params
 */
export const getCommonGridData = (url, type, params, _this) => {
  var p = new Promise(function (resolve, reject) {
    if (type.toLowerCase() === 'get') {
      util.restGet(url, params, res => {
        if (res.status === 200) {
          resolve(res)
        } else {
          reject()
        }
      })
    } else {
      util.restPost(url, params, res => {
        if (res.status === 200) {
          resolve(res)
        } else {
          reject()
        }
      })
    }
  })
  return p
}

/**
 * 加载列表数据
 * @param params
 */
export const getGridData = (params, _this) => {
  let url = params['_url']
  if (_this) {
    let sessionProj = null
    if (window.localStorage.getItem('_session_proj' + _this.sessionUtil.getUser().id)) {
      sessionProj = JSON.parse(window.localStorage.getItem('_session_proj' + _this.sessionUtil.getUser().id))
    } else if (_this.getFormConfig && _this.getFormConfig['_session_proj' + _this.sessionUtil.getUser().id]) {
      sessionProj = _this.getFormConfig['_session_proj' + _this.sessionUtil.getUser().id].data
      // console.log('-------sessionProj--------',sessionProj)
    }
    if (sessionProj) {
      params.sessionProj = {
        projCode: sessionProj.PROJ_CODE_,
        projId: sessionProj.PROJ_ID_,
        projIdLable: sessionProj.PROJ_ID_LABEL_,
        projName: sessionProj.PROJ_NAME_,
        projUid: sessionProj.PROJ_UID_,
        projUidLable: sessionProj.PROJ_UID_LABEL_
      }
    }
  }
  var p = new Promise(function (resolve, reject) {
    util.restPost(url || '/api_v1/form/data_list', params, res => {
      if (res.status === 200) {
        resolve(res)
      } else {
        reject()
      }
    })
  })
  return p
}

export const getAddressOptions = (params, _this) => { // 获取树列表数据
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/form/address_tree', params, res => {
      if (res.status === 200) {
        resolve(res.data)
      } else {
        reject()
      }
    })
  })
  return p
}

export const getTreeData = (params, _this) => { // 获取树列表数据
  let url = params['_url']
  let sessionProj = null
  if (_this) {
    if (window.localStorage.getItem('_session_proj' + _this.sessionUtil.getUser().id)) {
      sessionProj = JSON.parse(window.localStorage.getItem('_session_proj' + _this.sessionUtil.getUser().id))
    } else if (_this.getFormConfig && _this.getFormConfig['_session_proj' + _this.sessionUtil.getUser().id]) {
      sessionProj = _this.getFormConfig['_session_proj' + _this.sessionUtil.getUser().id].data
      // console.log('-------sessionProj--------',sessionProj)
    }
  }
  if (sessionProj) {
    params.sessionProj = {
      projCode: sessionProj.PROJ_CODE_,
      projId: sessionProj.PROJ_ID_,
      projIdLable: sessionProj.PROJ_ID_LABEL_,
      projName: sessionProj.PROJ_NAME_,
      projUid: sessionProj.PROJ_UID_,
      projUidLable: sessionProj.PROJ_UID_LABEL_
    }
  }
  var p = new Promise(function (resolve, reject) {
    util.restPost(url || '/api_v1/form/tree_data', params, res => {
      if (res.status === 200) {
        resolve(res.data)
      } else {
        reject()
      }
    })
  })
  return p
}

export const copy = (formKey) => { // 获取表单配置
  var p = new Promise(function (resolve, reject) {
    util.get('/api_v1/form/' + formKey + '/copy', null, res => {
      if (res.status == 200) {
        resolve(res)
      } else {
        util.warn('复制失败' + res.errorMsg)
      }
      util.unmask()
    })
    // }
  })
  return p
}

export const getReport = (params) => { // 获取表单配置
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/form/report', params, res => {
      if (res.status == 200) {
        resolve(res.data)
      } else {
        util.warn('查询失败' + res.errorMsg)
      }
      util.unmask()
    })
    // }
  })
  return p
}

export const getExcel = (formInfoId) => { // 获取Excel配置
  var p = new Promise(function (resolve, reject) {
    util.get('/api_v1/form/' + formInfoId + '/excel', null, res => {
      if (res.status == 200) {
        resolve(res.data)
      } else {
        util.warn('查询失败' + res.errorMsg)
      }
      util.unmask()
    })
    // }
  })
  return p
}

export const getMainData = (params) => { // 获取表单数据
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/form/data', params, function (res) {
      if (res != undefined && res != null) {
        if (res.status == 200) {
          resolve(res.data)
        } else {
          util.warn('查询失败' + res.errorMsg)
        }
      }
      util.unmask()
    })
  })
  return p
}

export const judgeType = (obj) => {
  // tostring会返回对应不同的标签的构造函数
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}
// 深度克隆数据
export const deepClone = (data) => {
  // delete data._parent
  const type = judgeType(data)
  let obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    // 对原型上的方法也拷贝了....
    for (const key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}

export const getConfig = (formKey, _this) => { // 获取表单配置
  return getConfigInfo({formKey}, _this)
}

export const getConfigInfo = (params, _this) => { // 获取表单配置和权限，可能还包含procDefId, actId
  var p = new Promise(function (resolve, reject) {
    let formKey = params['formKey']
    let procDefId = params['procDefId']
    if (_this.validUtil.isNull(procDefId) && _this.getFormConfig && _this.getFormConfig[formKey] && getRedisConfig(_this) == 'true') {
      resolve(_this.getFormConfig[formKey])
    } else {
      util.restGet('/api_v1/form/' + formKey + '/config', params, res => {
        if (res != undefined && res != null) {
          if (res.status == 200) {
            console.log("res.data======config====>",res.data);
            if (_this && _this.setFormConfig && res.data) _this.setFormConfig(deepClone(res.data))
            resolve(res.data)
          } else {
            util.warn('查询失败' + res.errorMsg)
          }
        }
        util.unmask()
      })
    }
  })
  return p
}

// export const getFormColumns = (formId, _this) => { // 获取表单列
//   var p = new Promise(function (resolve, reject) {
//     if (_this.getFormConfig && _this.getFormConfig[formKey] && getRedisConfig(_this) == 'true') {
//       resolve(_this.getFormConfig[formKey])
//     } else {
//       util.get('/api_v1/form/' + formId + '/form/columns', null, res => {
//         if (res != undefined && res != null) {
//           if (res.status == 200) {
//             resolve(res.data)
//           } else {
//             util.warn('查询失败' + res.errorMsg)
//           }
//         }
//         util.unmask()
//       })
//     }
//   })
//   return p
// }

export const batchSaveData = (params, vm) => { // 批量保存表单数据
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/form/business', params, function (res) {
      if (res != undefined && res != null) {
        if (res.status == 200) {
          resolve(res.data)
        } else {
          util.warn('保存失败' + res.errorMsg)
        }
      }
      util.unmask()
    })
  })
  return p
}

export const saveData = (params, vm) => { // 保存表单数据
  util.mask('正在保存...')
  return batchSaveData(params, vm)
}

export const getSubData = (params) => { // 保存表单数据
  var p = new Promise(function (resolve, reject) {
    // console.log(params)
    util.restPost('/api_v1/form/printTemplet/sql/', params, res => {
      if (res != undefined && res != null) {
        if (res.status == 200) {
          resolve(res.data)
        } else {
          util.warn('查询失败' + res.errorMsg)
        }
      }
      util.unmask()
    })
  })
  return p
}

export const deleteData = (params) => { // 删除表单
  util.mask('正在删除')
  var p = new Promise(function (resolve, reject) {
    util.restDelete('/api_v1/form/data', params, function (res) {
      if (res != undefined && res != null) {
        if (res.status == 200) {
          resolve(res.data)
        } else {
          util.warn('保存失败' + res.errorMsg)
        }
      }
      util.unmask()
    })
  })
  return p
}

export const getDicData = (dicId) => { // 获取字典数据
  var p = new Promise(function (resolve, reject) {
    // 做一些异步操作
    // util.getDicItems(dicId, function (res) {
    //   if (res && res.length > 0) {
    //     resolve(res)
    //   }
    // })
  })
  return p
}

export const getOrgList = (params) => { // 获取字典数据
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/form/orgs', params, function (res) {
      if (res != undefined && res != null) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject()
        }
      } else {
        reject()
      }
    })
  })
  return p
}

export const getSqlDicData = (params) => { // 获取字典数据
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/form/dic/sql/data', params, function (res) {
      if (res != undefined && res != null) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject()
        }
      } else {
        reject()
      }
    })
  })
  return p
}

export const saveConfig = (formKey, params) => { // 保存表单配置数据
  util.mask('正在保存...')
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/form/' + formKey + '/config', params, function (res) {
      if (res != undefined && res != null) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          util.warn('保存表单配置失败' + res.errorMsg)
        }
      }
      util.unmask()
    })
  })
  return p
}
/**
 * 根据数据库表获取字段列表
 * @param tableName
 * @returns {Promise<any>}
 */
export const getTableColumns = (tableName) => { // 保存表单数据
  var p = new Promise(function (resolve, reject) {
    // console.log(params)
    // 先从window对象中获取
    if (window && window.sql_columns && window.sql_columns[tableName]) {
      resolve(window.sql_columns['tableName'])
    }
    util.restPost('/api_v1/form/sql_columns', {tableName: tableName}, res => {
      if (res != undefined && res != null) {
        if (res.status == 200) {
          if (window.sql_columns === undefined) {
            window.sql_columns = {}
          }
          window.sql_columns[tableName] = res.data
          resolve(res.data)
        } else {
          reject()
          util.warn('查询失败' + res.errorMsg)
        }
      } else {
        reject()
      }
      util.unmask()
    })
  })
  return p
}

/**
 * 表单数据来源为api时获取单行查询结果
 * @param params
 */
export const getDataByApi = (api, params) => {
  let url = params['_url']
  var p = new Promise(function (resolve, reject) {
    util.restPost(url || '/api_v1/form/api/' + api + '/data', params, res => {
      if (res.status === 200) {
        resolve(res.data)
      } else {
        reject(res)
      }
    })
  })
  return p
}

/**
 * 拷贝树数据
 * @param srcFormKey
 * @param desFormKey
 * @param desParentId
 * @param desQueryParams
 * @param srcData
 * @returns {Promise<any>}
 */
export const copyTreeData = (params, _this) => { // 保存表单配置数据
  util.mask('正在复制...')
  let sessionProj = null
  if (_this) {
    if (window.localStorage.getItem('_session_proj' + _this.sessionUtil.getUser().id)) {
      sessionProj = JSON.parse(window.localStorage.getItem('_session_proj' + _this.sessionUtil.getUser().id))
    } else if (_this.getFormConfig && _this.getFormConfig['_session_proj' + _this.sessionUtil.getUser().id]) {
      sessionProj = _this.getFormConfig['_session_proj' + _this.sessionUtil.getUser().id].data
      // console.log('-------sessionProj--------',sessionProj)
    }
  }
  if (sessionProj) {
    params.sessionProj = {
      projCode: sessionProj.PROJ_CODE_,
      projName: sessionProj.PROJ_NAME_,
      projUid: sessionProj.PROJ_UID_
    }
  }
  // console.log('-------copyTreeData--------',params)
  // return
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/form/copy/data', params, function (res) {
      if (res != undefined && res != null) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          util.warn('复制失败：' + res.errorMsg)
          reject('复制失败：' + res.errorMsg)
        }
      } else {
        reject('复制失败：')
      }
      util.unmask()
    })
  })
  return p
}

/**
 * 获取流程数据
 * @param params
 */
export const getFlow = (params) => {
  // console.log('--------getFlow---------'+params)
  var p = new Promise(function (resolve, reject) {
    util.restGet('/api_v1/wf/tasks/historic', params, res => {
      if (res.status === 200) {
        resolve(res.data)
      } else {
        reject()
      }
    })
  })
  return p
}

/**
 * 获取流程图片
 * @param params
 */
export const getFlowImg = (parentId) => {
  var p = new Promise(function (resolve, reject) {
    util.restGet('/api_v1/form/' + parentId + '/flow', null, res => {
      if (res.status === 200) {
        resolve(res.data)
      } else {
        reject()
      }
    })
  })
  return p
}

export const getRedisConfig = (_this) => { // 获取树列表数据
  let key = '_redis_config'
  if (_this.getFormConfig && _this.getFormConfig[key]) {
    return _this.getFormConfig[key].data
  } else {
    util.restGet('/api_v1/form//redis/config', null, res => {
      if (res.status === 200) {
        if (_this && _this.setFormConfig && res.data) {
          let obj = {
            formKey: key,
            data: res.data
          }
          _this.setFormConfig(obj)
        }
        return res.data
      }
    })
  }
}

export const getFormAuthsSync = (formKey) => {
  let result = null
  // 同步获取
  util.restGet('/api_v1/form/' + formKey + '/auths', null, res => {
    if (res.status === 200) {
      // console.log('------getFormAuthsSync-------',res.data)
      result = res.data
    }
  }, undefined, false)
  return result
}

/**
 * 上传表单
 * @returns {Promise<any>}
 */
export const uploadForm = (id) => {
  var p = new Promise(function (resolve, reject) {
    util.restPost('/api_v1/form/upload', {id: id}, function (res) {
      if (res != undefined && res != null) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res.errorMsg)
        }
      }else{
        reject()
      }
    },()=>{
      reject('调用接口失败!')
    })
  })
  return p
}
