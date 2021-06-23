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
      console.info(vue.model.parent+'------------'+vue.readOnly)
      if(vue.readOnly || res.data.ifStartUser === false){
        vue.isReadOnly = true
        vue.isWorkflow = false
      }else{
        vue.isReadOnly = false
      }
    }else{
      //没有绑定流程，或者已经存在流程示例
      if (res.data.procInstId != undefined) {
        // vue.util.failueToast("已经存在流程实例！");
        vue.procInstId = res.data.procInstId;
        vue.procDefId = res.data.procDefId;
        vue.updateReadOnly(true);
        vue.initProcessMonitor();
      } else {
        // console.info(vue.model.parent+'------------'+vue.model.parent.readOnly)
        if(vue.readOnly){
          vue.isReadOnly = true
        }else{
          vue.isReadOnly = false
        }
      }
    }
  }
  this.compute = ()=>{ // 根据启动规则计算流程
    // console.info('-----------------------------')
    let _this = this
    let vue = this._vue
    let modelList = vue.modelList
    // console.info(modelList)
    let mainData = this.getMainData()
    // console.info(mainData)
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
    // console.info(vue.model.parent)
    // console.info(vue.model.parent.getData)
    //判断表单是否复写获取数据的方法
    if (vue.model.parent.getData != undefined) {
      var formData = vue.model.parent.getData();
      // console.info(formData)
      if(formData){
        let mainData = formData.mainFormDataMap
        if(typeof mainData === 'string'){
          mainData = JSON.parse(mainData)
        }
        return mainData
      }
    }
    return null
  }
  this.computeStartRule = (mainData, startRules)=> { // 根据启动规则计算流程
    // console.info(mainData)
    // console.info(startRules)
    for(var i = 0; i<startRules.length;i++){
      let rule = startRules[i]
      // console.info(mainData)
      let value = mainData[rule.field]
      //console.info(rule.field+'=='+mainData['TAX_MONEY_']+'=='+value+'=='+typeof mainData)
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
        // console.info(rule.field+'--'+value+'--'+rule.value)
        let flag = false
        for(let m = 0;m<valArr.length;m++){
          if(typeof value === 'string' && value.indexOf(',') > -1){
            if(value.indexOf(valArr[m]) > -1){
              flag = true
              break;
            }
          }else{
            if(typeof value === 'number' ){
              if(Number(valArr[m]) === Number(value)){
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
        }
        if(!flag){
          return false
        }
      }else if(rule.ruleType === 'rule-compare'){
        if(rule.compareType === 'between'){
          let minVal = rule.minVal
          let maxVal = rule.maxVal
          var flag = true
          var compareStr = 'flag = ('+value+'>='+minVal+' && '+value+'<'+maxVal+')'
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
          var compareStr = 'flag = ('+value+rule.compareType+rule.value+')'
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
