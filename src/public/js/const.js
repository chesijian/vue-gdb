/**
 * 表单事件类型
 * @type {{NEW_REDNER: number, AFTER_NEW: number, AFTER_UPDATE: number, BEFORE_NEW: number}}
 */
export const EVENT_TYPE = {
  NEW_REDNER: 1,
  AFTER_NEW: 2,
  AFTER_UPDATE: 3,
  BEFORE_NEW: 4,
  SUB_FORM_CHANGE_BY_MAIN_FORM: 6,
  EDIT_REDNER: 7
}

export const API_CATEGORY = {
  LIST:1,
  FORM_FIELD_SOURCE:2,
  BUTTON_EVENT:3,
  FORM_AFTER_NEW:4
}

export const apiRunType = function(){
  this.INTERFACE = 'Interface'
  this.SQL = 'SQL'
  this.DelegateClass = 'DelegateClass'
  this.isInterface = (type)=>{
    // console.info(this.INTERFACE.toLowerCase()+'----type----'+type)
    if(type.toLowerCase() === this.INTERFACE.toLowerCase())
      return true
    return false
  }
}
export const API_RUN_TYPE = new apiRunType()
