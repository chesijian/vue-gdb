
import CommonGridTable from "../../../common/table/grid-table/grid-table";

import {widgetType,dateType,timeType,javaType,matchType,sourceType,sortRule,titleAlign,openType,dataAlign,onlyRule, categoryType} from "../const";

export const mixin = {
  data: function () {
    return {
      apiSelectDialogVisible: false,
      apiOptions: [],
      rules: {},
      formOptions: [],
      formData: {},
      type:1,  // 1查询列，2表单列，3明细表，4明细表列
      columnsMap:{
        'widgetType':{
          options:[]
        },
        'titleAlign':{
          options:[]
        },
        'dataAlign':{
          options:[]
        },
        'matchType':{
          options:[]
        },
        'sortRule':{
          options:[]
        },
        'sourceType':{
          options:[]
        },
        'javaType':{
          options:[]
        },
        'openType':{
          options:[]
        }
      },
      columns: [
        {
          columnName: 'title',
          javaType: 'String',
          width: 100,
          require:true,
          title: '标题',
          widgetType:'input'
        },{
          columnName: 'columnName',
          javaType: 'String',
          width: 100,
          require:true,
          title: '字段名称',
          widgetType:'input'
        }, {
          columnName: 'javaType',
          javaType: 'String',
          title: 'javaType',
          width: 100,
          widgetType:'select',
          attr:javaType
        }, {
          columnName: 'width',
          javaType: 'Integer',
          title: '宽度',
          width: 80,
          require:true,
          type:[1,4],
          widgetType:'number'
        }, {
          columnName: 'widgetType',
          javaType: 'String',
          title: '控件类型',
          width: 120,
          widgetType:'select',
          // require:true,
          attr:widgetType
        }, {
          columnName: 'dateType',
          javaType: 'String',
          title: '日期显示类型',
          width: 120,
          widgetType:'select',
          // require:true,
          attr:dateType
        }, {
          columnName: 'ifNotRelated',
          javaType: 'Integer',
          title: '是否不关联',
          width: 100,
          widgetType:'switch'
        },{
          columnName: 'multiple',
          javaType: 'Integer',
          title: '是否多选',
          width: 100,
          widgetType:'switch'
        }, {
          columnName: 'attr',
          javaType: 'String',
          title: '控件参数',
          width: 100,
          widgetType:'input'
        }, {
          columnName: 'matchType',
          javaType: 'String',
          title: '匹配类型',
          type:1,
          width: 100,
          widgetType:'select',
          attr:matchType
        }, {
          columnName: 'initMatchValue',
          javaType: 'String',
          title: '匹配参数',
          type:1,
          width: 100,
          widgetType:'input'
        }, {
          columnName: 'sourceType',
          javaType: 'String',
          title: '来源类型',
          type:1,
          width: 100,
          widgetType:'select',
          attr:sourceType
        }, {
          columnName: 'sourceAttr',
          javaType: 'String',
          title: '数据来源',
          width: 100,
          widgetType:'input'
        }, {
          columnName: 'entity',
          javaType: 'String',
          title: '实体',
          width: 100,
          type:3,
          widgetType:'input'
        }, {
          columnName: 'tableName',
          javaType: 'String',
          require:true,
          title: '数据库表',
          width: 100,
          type:[2,3],
          widgetType:'input'
        }, {
          columnName: 'subFormForeignKey',
          javaType: 'String',
          require:true,
          title: '外键',
          width: 100,
          type:[2,3],
          widgetType:'input'
        }, {
          columnName: 'row',
          javaType: 'Integer',
          title: '行',
          width: 80,
          require:true,
          type:'2',
          widgetType:'number'
        }, {
          columnName: 'col',
          javaType: 'Integer',
          title: '列',
          width: 80,
          type:'2',
          require:true,
          widgetType:'number'
        },{
          columnName:'category',
          title:'明细表类型',
          require:true,
          javaType:'String',
          type:3,
          widgetType:'select',
          attr:categoryType
        },{
          columnName:'rootId',
          title:'根节点id',
          require:true,
          javaType:'String',
          type:3
        },{
          columnName:'rootText',
          title:'根节点Text',
          require:true,
          javaType:'String',
          type:3
        },{
          columnName:'treeColumn',
          title:'数列',
          require:true,
          javaType:'String',
          type:3
        },{
          columnName:'parentColumn',
          title:'parent列',
          require:true,
          javaType:'String',
          type:3
        },{
          columnName:'showRoot',
          title:'显示根节点',
          javaType:'Integer',
          type:3,
          widgetType:'switch'
        },{
          columnName:'expandAll',
          title:'展开全部',
          javaType:'Integer',
          type:3,
          widgetType:'switch'
        }, {
          columnName: 'icon',
          javaType: 'String',
          title: '图标',
          width: 80,
          widgetType:'input'
        }, {
          columnName: 'hidden',
          javaType: 'Integer',
          title: '隐藏',
          width: 80,
          type:[1,2],
          widgetType:'switch'
        }, {
          columnName: 'summary',
          javaType: 'Integer',
          title: '合计',
          width: 80,
          type:'1',
          widgetType:'switch'
        },{
          columnName: 'sortRule',
          javaType: 'String',
          sortable: true,
          title: '排序规则',
          width: 80,
          widgetType:'select',
          attr:sortRule
        },{
          columnName: 'titleAlign',
          javaType: 'String',
          title: '标题位置',
          width: 80,
          widgetType:'select',
          attr:titleAlign
        }, {
          columnName: 'dataAlign',
          javaType: 'String',
          title: '数据位置',
          width: 80,
          widgetType:'select',
          attr:dataAlign
        }, {
          columnName: 'silence',
          javaType: 'Integer',
          title: '静默字段',
          width: 80,
          type:[1,2],
          widgetType:'switch'
        }, {
          columnName: 'require',
          javaType: 'Integer',
          title: '必填',
          width: 80,
          type:'2',
          widgetType:'switch'
        }, {
          columnName: 'filterAuth',
          javaType: 'Integer',
          title: '是否过滤权限',
          width: 80,
          widgetType:'switch'
        }, {
          columnName: 'readOnly',
          javaType: 'Integer',
          title: '只读',
          width: 80,
          type:'2',
          widgetType:'switch'
        }, {
          columnName: 'onlyRule',
          javaType: 'Integer',
          title: '唯一规则',
          width: 80,
          type:'2',
          widgetType:'select',
          attr:onlyRule
        }, {
          columnName: 'validType',
          javaType: 'String',
          title: '验证类型',
          width: 80,
          type:'22',
          widgetType:'input'
        }, {
          columnName: 'validRule',
          javaType: 'String',
          title: '验证规则',
          width: 80,
          type:'22',
          widgetType:'input'
        }, {
          columnName: 'validMessage',
          javaType: 'String',
          title: '验证信息',
          width: 80,
          type:'22',
          widgetType:'input'
        }, {
          columnName: 'openType',
          javaType: 'Integer',
          title: '打开方式',
          width: 80,
          type:[1,2],
          widgetType:'select',
          attr:openType
        }, {
          columnName: 'openUrl',
          javaType: 'String',
          title: '打开地址',
          width: 120,
          type:[1,2],
          widgetType:'input'
        }, {
          columnName: 'openParams',
          javaType: 'String',
          title: '路由参数',
          width: 120,
          type:[1,2],
          widgetType:'input'
        }, {
          columnName: 'openWidth',
          javaType: 'Integer',
          title: '弹框宽度',
          width: 120,
          type:[1,2],
          widgetType:'number'
        }, {
          columnName: 'openHeight',
          javaType: 'Integer',
          title: '弹框高度',
          width: 120,
          type:[1,2],
          widgetType:'number'
        }, {
          columnName: 'expression',
          javaType: 'String',
          title: '表达式',
          width: 120,
          widgetType:'input'
        }, {
          columnName: 'sort',
          javaType: 'Double',
          title: '排序',
          width: 80,
          widgetType:'number'
        }
      ]
    }
  },
  props: {
    config: {
      type: Object,
      default: function () {
        return {}
      }
    },
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    apiData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  computed: {
    getTitle(){
      return function (columnName) {
        // console.info(columnName+'--'+this.columnsMap[columnName])
        if(this.columnsMap[columnName]){
          // console.info(this.columnsMap[columnName].title)
          return this.columnsMap[columnName].title;
        }
        return '';
      }
    },
    dataTypeOptions(){
      return function () {
        let options = []
        if(this.formData['widgetType'] === 'select-date'){
          options = dateType
        }else{

          options = timeType
        }
        // console.log('--------dataTypeOptions-------',dateType,timeType)
        let data = [];
        options = options.split(';')
        options.forEach(item => {
          let option = item.split(',')
          let value =option[0]
          // 存入键值对
          data.push({name: option[1], value: value});
        })
        return data
      }
    }
  },
  components: {
    CommonGridTable
  },
  created() {
    // console.log('------created------')
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let _this = this;
      if(this.config.type != undefined){
        this.type = this.config.type;
      }
      let columnsMap = {};
      // 初始化上级表单
      this.columns.forEach(column=> {

        // 判断是否数据字典
        if (column.widgetType === 'select') {
          let attr = column.attr;
          column['options'] = [];
          if (attr.indexOf(',') > -1) {
            // 说明是直接写死类型
            let data = [];
            let options = attr.split(';');
            options.forEach(item => {
              let option = item.split(',');
              let value =option[0]
              if(column['javaType'] === 'Integer' && value !== undefined){
                value = Number(value)
              }
              // 存入键值对
              data.push({name: option[1], value: value});
            });
            column.options = data;
            // this.$forceUpdate()
          }
        } else if(column.widgetType === 'select-dic'){
          // 加载数据字典
          if (_this.validUtil.isNotNull(attr)) {
            getDicData(attr).then(data => {
              column.options = data;
              this.$forceUpdate()
            })
          }
        }
        columnsMap[column.columnName] = column;
      });// this.loadData();
      // console.info(columnsMap)
      this.columnsMap = columnsMap;
      this.loadData();
      this.initRules();
    },
    loadData() {
      let data = this.config.data
      // 初始化判断明细表类型
      if(this.validUtil.isNotNull(data['rootId'])){
        data['category'] = 'tree-table'
      }else{
        data['category'] = 'grid-table'
      }
      data['sourceAttrArr'] = []
      // console.info(this.config.data)
      this.formData = {...data};
      for(let key in data){
        let column = this.columnsMap[key];
        // console.log('----1---'+key, data[key])
        if(column){
          // console.log(column.widgetType+'----2---'+key, data[key])
          let value = this.config.data[key];
          if(column.widgetType === 'switch'){
            // this.formData[key+'_SWITCH'] = value !== undefined && value === 1?true:false;
            this.$set(this.formData, key+'_SWITCH', value !== undefined && value === 1?true:false);
          }
        }
      }

      /*if(this.formData['sourceAttrCn'] == undefined && this.formData.apiConfig){
          let apiConfig = this.formData.apiConfig
          this.formData['sourceAttrCn'] = apiConfig.name
      }*/
      // 判断是否是触发api接口, 并且接口有可能配置多个
      if (this.formData.apiConfig) {
        // console.log('------apiConfig-----', this.formData['sourceAttr'])
        this.formData['sourceAttrArr'] = this.formData['sourceAttr'].split(',')
      }


    },
    checkValid() { // 验证表单
      let _this = this;
      var p = new Promise(function (resolve, reject) {
        // 保存已经托管到process-form
        _this.$refs['form'].validate((valid) => { // 先判断主表是否填写正确
          if (valid) {
            resolve()
          }
        });
      });
      return p;
    },
    getData() {
      for (let key in this.formData) {
        let value = this.formData[key];
        if (key.indexOf('_SWITCH') > -1) {
          this.formData[key.substring(0, key.indexOf('_SWITCH'))] = value === true ? 1 : 0;
        }
      }
      // 判断字段是否是按钮，并且配置了触发接口
      if((this.formData['javaType'] === 'TopButton' || this.formData['javaType'] === 'CellButton' ||  this.formData['widgetType'] === 'tag' )&& this.validUtil.isNotNull(this.formData['sourceAttr'])){
        this.formData['sourceType'] = 'api'
      }
      // console.info()
      return this.formData;
    },
    handlerApiValueChange (value) { // 初始api接口切换时执行
      // console.log('------value------', value)
      this.formData['sourceAttr'] = value.join(',')
    },
    handlerValueChange(field, newVal) {
      if (field === 'type') {
        this.initRules();
      }
      // console.log('------handlerValueChange--------', this.formData)
      if(field === 'category'){
        // 初始化判断明细表类型
        if(newVal === 'grid-table'){
          this.formData['rootId'] = ''
          this.formData['rootText'] = ''
        }
      }
      // if(field.indexOf('_SWITCH')>-1){
      //   this.formData[field.substring(0,field.indexOf('_SWITCH'))] = newVal?1:0;
      // }

    },
    validateField(rule, value, callback) { // 自定义验证字段

      if (rule.validType) {
        if (value === this.formData['id']) {
          return callback(new Error(rule.message))
        }
      }
      callback()
    },
    initRules() { // 初始化表单验证规则
      let type = this.type;
      let rules = {};
      this.columns.forEach(column => {
        if (column.require) {
          // console.info(type+'-----'+(column.type === type)+'---'+typeof column.type+'---'+column.type)
          if (column.type === undefined || (column.type != undefined && (column.type === Number(type) || ( typeof column.type === 'object' && column.type.indexOf(type)>-1)))) {
            let rule = {field: column.columnName, required: true, message: '请输入' + column.title, trigger: 'blur'};
            if (column.javaType === 'Double' || column.javaType === 'Integer' || column.javaType === 'Float') {
              rule.type = 'number';
            }
            rules[column.columnName] = [rule];

          }
        }

      });

      this.rules = rules;

    },handlerGridOperateClick( buttonId,index,row){ // 明细表维护

    },handlerApiSelectOkClick(){ // 选择api接口之后回调
      this.apiSelectDialogVisible = false;
    },
    handlerApiSelectOkClick(){ // 选择api之后回调
      let selectedData = this.$refs['api-select'].getSelectedData();

      // console.info(selectedData);
      if(selectedData.length === 0){
        this.util.warn('请选择字段!')
        return;
      }
      let data = selectedData[0];
      this.formData['sourceAttr'] = data['ID_']
      this.formData['sourceAttrCn'] = data['NAME_']
      this.apiSelectDialogVisible = false;
    }
  }
}
