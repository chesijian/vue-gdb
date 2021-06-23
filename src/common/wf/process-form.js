export const WfUtil = function() {
  this._vue = null
  this.init = function (vue) {
    this._vue = vue;
  }
  this.initModel = (res)=>{ // 根据获取到的模型列表判断
    let vue = this._vue
    let modelList = res.data.modelList
    if (modelList != undefined && modelList.length > 0) {
      for (var i = 0; i < modelList.length; i++) {
        //默认第一个选中
        if (i == 0) {
          modelList[i].selected = true;
        } else {
          modelList[i].selected = false;
        }
        modelList[i].id = modelList[i].key;
      }
      vue.isWorkflow = true;
      vue.modelList = modelList
      if(modelList.length === 1){
        wfUtil.compute()
      }
      vue.isEndEvent = false
      if(vue.parent && vue.parent.isReadOnly){
        vue.isReadOnly = true
      }else{
        vue.isReadOnly = false
      }

    }else{
      //没有绑定流程，或者已经存在流程示例
      if (res.data.procInstId != undefined) {
        // vue.util.failueToast("已经存在流程实例！");
        vue.procInstId = res.data.procInstId;
        vue.procDefId = res.data.procDefId;
        vue.initProcessMonitor();
      } else {
        console.info(vue.parent+'------------'+vue.parent.isReadOnly)
        if(vue.parent && vue.parent.isReadOnly){
          vue.isReadOnly = true
        }else{
          vue.isReadOnly = false
        }
      }
    }
  }
  this.compute = ()=>{ // 根据启动规则计算流程
    let _this = this
    let vue = this._vue
    let modelList = vue.modelList
    let mainData = this.getMainData()
    if(mainData != null){
      modelList = modelList.filter(function(model){
        if(model.config){
          let config = JSON.parse(model.config)
          let startRules = config.startRules
          if(startRules){
            // console.info(startRules)
            let flag = _this.computeStartRule(mainData, startRules)
            if(!flag){
              return null
            }
          }
        }
        return model
      })
    }
    for (var i = 0; i < modelList.length; i++) {
      //默认第一个选中
      if (i == 0) {
        modelList[i].selected = true;
      } else {
        modelList[i].selected = false;
      }
      modelList[i].id = modelList[i].key;
    }
    if(modelList.length == 0){
      vue.util.warn('您没有配置流程！')
    }else{

      vue.processList = modelList
      if(modelList.length === 1){
        let model = modelList[0];
        vue.procDefId = model.procDefId;
        vue.key = model.key;
        vue.isWorkflow = true
        vue.procDefName = model.name;
        //加载流程处理单
        vue.loadExecution();
      }else{
        vue.dialogSelProcVisible = true;
      }

    }
    // console.info(modelList)

  }
  this.getMainData = ()=>{
    let vue = this._vue
    //判断表单是否复写获取数据的方法
    if (vue.model.parent.getData != undefined) {
      var formData = vue.model.parent.getData();
      if(formData){
        let mainData = formData.mainFormData
        if(mainData != undefined && typeof mainData === 'string'){
          mainData = JSON.parse(mainData)
        }else{
          mainData = formData.mainFormDataMap;
        }
        return mainData
      }
    }
    return null
  }
  this.computeStartRule = (mainData, startRules)=> { // 根据启动规则计算流程
    for(var i = 0; i<startRules.length;i++){
      let rule = startRules[i]
      // console.info(mainData)
      let value = mainData[rule.field]
      // console.info(rule.field+'=='+mainData[rule.field]+'=='+value+'=='+typeof mainData)
      if(rule.ruleType === 'rule-user'){
        if(value == undefined || value == null){
          return false
        }
        let valArr = rule.value
        let flag = false
        for(let m = 0;m<valArr.length;m++){
          if(valArr[m].id === value){
            flag = true
            break;
          }
        }
        if(!flag){
          return false
        }
      }else if(rule.ruleType === 'rule-depart'){
        if(value == undefined || value == null){
          return false
        }
        let valArr = rule.value
        let flag = false
        for(let m = 0;m<valArr.length;m++){
          if(valArr[m].id === value){
            flag = true
            break;
          }
        }
        if(!flag){
          return false
        }
      }else if(rule.ruleType === 'rule-contain'){
        if(value == undefined || value == null){
          return false
        }
        let valArr = rule.value
        if(typeof rule.value === 'string'){
          valArr = rule.value.split(',')
        }
        let flag = false
        for(let m = 0;m<valArr.length;m++){
          if(value.indexOf(',') > -1){
            if(value.indexOf(valArr[m]) > -1){
              flag = true
              break;
            }
          }else{
            if(valArr[m] === value){
              flag = true
              break;
            }
          }

        }
        if(!flag){
          return false
        }
      }else if(rule.ruleType === 'rule-compare'){
        if(rule.compareType === 'between'){
          let minVal = rule.minVal
          let maxVal = rule.maxVal
          var flag = true
          let compareStr = 'flag = ('+value+'>='+minVal+' && '+value+'<'+maxVal+')'
          eval(compareStr)
          //console.info(compareStr+'-----'+flag)
          if(!flag){
            return false
          }
        }else{
          if(value == undefined || value == null){
            return false
          }
          var flag = true
          let compareStr = 'flag = ('+value+rule.compareType+rule.value+')'
          eval(compareStr)

          // console.info(compareStr+'-----'+flag)
          if(!flag){
            return false
          }
        }
      }else if(rule.ruleType === 'rule-equal'){
        if(value == undefined || value == null){
          return false
        }
        if(value != rule.value){
          return false
        }
      }
    }
    return true
  }
}
export const wfUtil = new WfUtil();
