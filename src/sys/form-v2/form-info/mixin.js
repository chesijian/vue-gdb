
export const mixin = {
  data: function () {
    return {
      rules:{},
      formData:{},
      columnsMap:{},
      formOptions:[],
      apiSelectDialogVisible:false,
      columns:[{
        columnName:'title',
        title:'表单名称',
        require:true,
        javaType:'String',
      },{
      columnName:'entity',
        title:'实体',
        require:true,
        javaType:'String'
      },{
          columnName:'tableName',
          title:'数据库表',
          require:true,
          javaType:'String'
        },{
          columnName:'type',
          title:'列表类型',
          require:true,
          javaType:'String'
        },{
          columnName:'width',
          title:'宽度',
          javaType:'String'
        },{
          columnName:'height',
          title:'高度',
          javaType:'String'
        },{
          columnName:'colNum',
          title:'列数',
          require:true,
          javaType:'Double'
        },{
          columnName:'rootId',
          title:'根节点id',
          require:true,
          javaType:'String',
          type:2
        },{
          columnName:'rootText',
          title:'根节点Text',
          require:true,
          javaType:'String',
          type:2
        },{
          columnName:'rootText',
          title:'根节点Text',
          require:true,
          javaType:'String',
          type:2
        },{
          columnName:'treeColumn',
          title:'数列',
          require:true,
          javaType:'String',
          type:2
        },{
          columnName:'parentColumn',
          title:'parent列',
          require:true,
          javaType:'String',
          type:2
        },{
          columnName:'lazy',
          title:'是否懒加载',
          javaType:'Integer',
          type:2
        },{
          columnName:'showRoot',
          title:'显示根节点',
          javaType:'Integer',
          type:2
        },{
          columnName:'expandAll',
          title:'展开全部',
          javaType:'Integer',
          type:2
        },{
          columnName:'showTitle',
          title:'显示标题',
          javaType:'Integer',
          type:2
        },{
          columnName:'subFormForeignKey',
          title:'外键',
          require:true,
          javaType:'String',
          type:3
        },{
        columnName:'mobilePath',
        title:'移动端路由',
        javaType:'String'
      },{
        columnName:'sort',
        title:'排序',
        javaType:'Integer'
      }]
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
    }
  },
  computed:{

  },
  created () {
    let columnsMap = {};
    this.columns.forEach(column=>{
      columnsMap[column.columnName] = column;
    });
    this.columnsMap = columnsMap;
  },
  mounted () {
    this.init();
  },
  methods: {
    init(){
       // 初始化上级表单
      let treeData = this.config.parent.getTreeData();
      let formOptions = [];
      treeData.forEach(item=>{
        if(item.id !== this.formData['id']){
          formOptions.push(item)
        }
      });
      this.formOptions = formOptions;
      this.loadData();
      this.initRules();
    },
    loadData(){
      this.formData = {...this.data};
      if(this.formData['type'] != undefined){
        this.formData['type'] = this.formData['type']+'';
      }
      if(this.formData['pageSize'] != undefined){
        this.formData['pageSize'] = this.formData['pageSize']+'';
      }
      if(this.validUtil.isNull(this.formData['apiTitle'])){
        // 第一次时apiTitle是空的
        if(this.formData.apiConfig){
          this.formData['apiTitle'] = this.formData.apiConfig['name']
        }
      }

      // console.info('-------'+this.formData)
      // console.info(this.formData)
    },
    checkValid(){ // 验证表单
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
    getData(){
      for(let key in this.formData){
        let value = this.formData[key];
        if(key.indexOf('_SWITCH')>-1){
          this.formData[key.substring(0,key.indexOf('_SWITCH'))] = value === true?1:0;
        }
      }
      return this.formData;
    },
    handlerValueChange(field,newVal){
      console.info(field+'----handlerValueChange---'+newVal+'---'+typeof newVal);
      if(field === 'type'){
        this.initRules();
      }
      // if(field.indexOf('_SWITCH')>-1){
      //   this.formData[field.substring(0,field.indexOf('_SWITCH'))] = newVal?1:0;
      // }

    },
    handlerApiSelectOkClick(){ // 选择api之后回调
      let selectedData = this.$refs['api-select'].getSelectedData();

      // console.info(selectedData);
      if(selectedData.length === 0){
        this.util.warn('请选择字段!')
        return;
      }
      let data = selectedData[0];
      this.formData['api'] = data['ID_']
      this.formData['apiTitle'] = data['NAME_']
      this.apiSelectDialogVisible = false;
    },
    validateField  (rule, value, callback) { // 自定义验证字段

      if (rule.validType) {
        if(value === this.formData['id']){
          return callback(new Error(rule.message))
        }
      }
      callback()
    },
    initRules(){ // 初始化表单验证规则
      let type = this.formData['type'];
      let rules = {};
      this.columns.forEach(column=>{
        if(column.require){
          // console.info(type+'-----'+(column.type === type)+'------'+column.type)
          if(column.type === undefined || (column.type!= undefined && column.type === Number(type))){
            let rule = {field: column.columnName, required: true, message: '请输入'+column.title, trigger: 'blur'};
            if (column.javaType === 'Double' || column.javaType === 'Integer' || column.javaType === 'Float') {
              rule.type = 'number';
            }
            rules[column.columnName] = [rule];

          }
        }

      });
      // 初始化上级表单
      let treeData = this.config.parent.getTreeData();
      if(treeData.length>0){
        rules['parentId'] = [];
        let rule = {field: 'parentId', required: true, message: '上级表单必须填', trigger: 'blur'};
        rules['parentId'].push({field: 'parentId', validType: 'self', validator: this.validateField, message: '上级表单不能是自己', trigger: 'change'})

        // rules['parentId'] = [rule];
      }
      this.rules = rules;

    }
  }
}
