
import {getConfig,getDicData,getSqlDicData} from '@/api/form-render'
export const WfUtil = function() {
  this._vue = null
  this.dicMap = {}
  this.fieldMap = {}
  this.init = function (vue) {
    this._vue = vue;
    this.dicMap = {}
    this.fieldMap = {}
  }
  this.addRule=()=>{
    this._vue.form.items.push({field:'',ruleType:'',value:''})
  }
  this.deleteRule=(rule)=>{
    this._vue.form.items = this._vue.form.items.filter(function(item){
      return item != rule
    })
    this.refreshFieldList()
  }
  this.addUser=(rule)=>{
    this._vue.selectRule = rule
    this._vue.selectMemberModel.isShow = true
    this._vue.selectMemberModel.selectList=rule.value?rule.value:[];

  }
  this.addDepart=(rule)=>{
    this._vue.selectRule = rule
    this._vue.selectDepartModel.isShow = true
    this._vue.selectDepartModel.selectList=rule.value?rule.value:[];
  }
  this.refreshFieldList=()=>{
    this.refreshItems()
    let _this = this
    this._vue.fieldList = this._vue.fieldList.filter(function(item){
      let disabled = false
      for(let i = 0;i<_this._vue.form.items.length;i++){
        let field = _this._vue.form.items[i]
        if(field.field == item.field){
          disabled = true
          break;
        }
      }
      item.disabled = disabled
      return item
    })
  }
  this.refreshItems=()=>{
    let _this = this
    // console.info('-----refreshItems------')
    // console.info(_this.dicMap)
    let newItems = this._vue.form.items.filter(function(item){
      // console.info( _this.fieldMap)
      item.ruleTypeDisabled = false
      if(item.field && item.field != ''){
        let field = _this.fieldMap[item.field]
        if(field){
          item.label = field.label
          if(field.ruleType){
            item.ruleType = field.ruleType
          }
          if(field.type && field.type === 'sys'){
            item.ruleTypeDisabled = true
          }
        }
      }

      if(_this.dicMap[item.field] && _this.dicMap[item.field].items && _this.dicMap[item.field].items.length >0 ){
        if(item.ruleType === 'rule-contain' && item.items){
          return item
        }
        let items = _this.dicMap[item.field].items
        // console.info(items)
        let itemArr = []
        items.forEach(function(temp){
          let t = {
            label : temp.name,
            value: temp.value
          }
          itemArr.push(t)
        })
        item.value = []
        // console.info(itemArr)
        item.items = itemArr
        item.ruleType = 'rule-contain'
        item.ruleTypeDisabled = true
      }
      return item
    })
    this._vue.form.items = newItems
    // console.info(this._vue.form.items)
  }
  this.validate=()=>{
    for(let i = 0;i<this._vue.form.items.length;i++){
      let field = this._vue.form.items[i]
      if(field.ruleType === 'rule-user' || field.ruleType === 'rule-depart'){
        if(!field.value || field.value.length === 0){
          console.info(field)
          this._vue.util.warn((field.label?field.label:field.field)+'?????????'+(field.ruleType === 'rule-depart'?'??????':'??????'))
          return false;
        }
      }
      if(field.ruleType === 'rule-contain'){
        if(field.value){
          let newValue = []
          if(field.items){
            field.value.forEach(v=>{
              let find = field.items.find(item=>{
                return item.value === v
              })
              if(find){
                newValue.push(v)
              }
            })
            field.value = newValue

          }
        }
        if(!field.value || field.value.length === 0){
          this._vue.util.warn((field.label?field.label:field.field)+'??????????????????')
          return false;
        }
      }
    }
    return true
  }
  this.loadData = (formKey, key)=>{
    let _this = this;
    //???????????????
    _this._vue.util.restGet('/api_v1/wf/model/config',{formKey:formKey, key: key},function(res){
      // console.info(res)
      if(res.status == 200){
          //console.info(res.data)
          if(res.data.config && _this._vue.validUtil.isNotEmpty(res.data.config)){
            let config = JSON.parse(res.data.config)
            if(config.startRules && config.startRules.length>0){
              _this._vue.form.items = config.startRules

            }
          }
      }
      //???????????????????????????
      _this.loadColumns(formKey, key)
    })




  }
  this.loadColumns=(formKey, key)=>{
    let _this = this;
    let fieldList = []
    let sys_apply_user = {
      field: 'sys-apply-user',
      label: '?????????',
      ruleType: 'rule-user',
      ruleTypeDisabled:false,
      type:'sys' //???????????????
    }
    let exist = false
    for(let i = 0;i<_this._vue.form.items.length;i++){
      let field = _this._vue.form.items[i]
      if(field.field === sys_apply_user.field){
        exist = true
        break;
      }
    }
    fieldList.push(sys_apply_user)
    this.fieldMap[sys_apply_user.field] = {...sys_apply_user}
    getConfig(formKey,this._vue).then(data=>{
      // console.info(data)
      if(data && data.forms && data.forms[data.forms.length-1] && data.forms[data.forms.length-1].formColumns.length>0){
        data.forms[data.forms.length-1].formColumns.forEach(function(item){
          _this.fieldMap[item.columnName] = {
            field: item.columnName,
            label: item.title
          }
          if(item.widgetType === 'select'){
            let attr = item.attr;
            if (attr.indexOf(',') > -1) {
              // ???????????????????????????
              let data = [];
              let options = attr.split(';');
              options.forEach(item => {
                let option = item.split(',');
                // ???????????????
                data.push({name: option[1], value: option[0]});
              });
              _this.dicMap[item.columnName] = {
                dicId: item.columnName,
                items: data
              }
              //????????????
              _this.refreshItems();
              // this.$forceUpdate()
            }
          }else if(item.widgetType === 'select-dic'){
            let attr = item.attr;
            // ??????????????????
            if (_this._vue.validUtil.isNotNull(attr)) {
              getDicData(attr).then(data => {
                _this.dicMap[item.columnName] = {
                  dicId: attr,
                  items: data
                }
                //????????????
                _this.refreshItems()
              })
            }
          }else if (item.widgetType === 'select-sql') {
            // ??????????????????
              getSqlDicData({formId:formKey,columnId:item.id}).then(data => {
                // console.info(data);
                _this.dicMap[item.columnName] = {
                  dicId: item.columnName,
                  items: data
                }
                _this._vue.$forceUpdate()
                //????????????
                _this.refreshItems()
              })
          }
          fieldList.push({
            field: item.columnName,
            ruleTypeDisabled:false,
            label: item.title
          })
        })
        if(_this._vue.form.items.length == 0){
          _this.addRule()
        }


        // console.info(fieldList)
        //_this._vue.form.items = items
        _this._vue.fieldList = fieldList
      }
      _this.refreshFieldList()
    })
  }
  // ????????????????????????
  this.save=(formKey, key, rules)=>{
    let _this = this;
    let config = JSON.stringify({
      startRules: rules
    })
    let params = {formKey:formKey, key: key, config: config}
    // console.info(params)
    _this._vue.util.restPost('/api_v1/wf/model/config',params,function(res){
      // console.info(res)
      if(res.status === 200){
        _this._vue.util.success('???????????????')
        _this._vue.handleBack()
      }else{

        _this._vue.util.error('???????????????')
      }
    })
  }
  this.loadDic=(field, dicId)=>{
    let _this =this
    var p = new Promise(function(resolve, reject){
      //?????????????????????
      _this._vue.util.loadDic(dicId,{companyUid:_this._vue.sessionUtil.getCompanyUid(),enable:1},function(res) {
        // console.info('------getDicItems----'+res.length)
        if (res && res.length > 0) {
          // console.info('----------')
          resolve(res);
        }
      })
    });
    return p;

  }
  this.config = {
    items: [{
      label: '?????????',
      field: 'applyUser',
      ruleType:'rule-user'
    }, {
      label: '????????????',
      field: 'applyDepart',
      ruleType:'rule-depart'
    }, {
      label: '????????????',
      field: 'money',
      ruleType:'rule-number'
    }, {
      label: '????????????',
      field: 'type',
      ruleType:'rule-contain',
      value: [],
      items:[{
        label: '????????????',
        value: '??????'
      }, {
        label: '????????????',
        value: '??????'
      }]
    }, {
      label: '?????????',
      field: 'supplierName',
      ruleType:'rule-equal'
    }],
    fieldList: [{
      label: '?????????',
      field: 'applyUser'
    }, {
      label: '????????????',
      field: 'applyDepart'
    }, {
      label: '????????????',
      field: 'money'
    }, {
      label: '????????????',
      field: 'type'
    }, {
      label: '?????????',
      field: 'supplierName'
    }]
  }
}
export const wfUtil = new WfUtil();
