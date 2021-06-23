import {getConfig,getMainData,getGridData} from '@/api/form-render'
import CommonGridTable from '@/common/table/grid-table/grid-table';

export const mixin = {
  data: function () {
    return {
      id:'',
      formKey:'sys_api',
      // businessKey:'',
      tableName:'',
      sybFormTableName:'',
      config:null,
      mainFormId:'',
      subFormId:'',
      formId:'',
      mainData:{},
      paramsData:{},
      activeParamsName:'query-params',
      paramsGridConfig: {
        showPageBar: false,
        showCheckbox: false,
        showOperateTool:false,
        edit: true,
        columns: [
          {
            columnName: 'title',
            javaType: 'String',
            width: 150,
            readOnly:true,
            title: '参数名'
          },{
            columnName: 'key',
            javaType: 'String',
            width: 200,
            sortable: true,
            readOnly:true,
            title: '参数',
            widgetType: 'input'
          }, {
            columnName: 'value',
            javaType: 'String',
            width: 320,
            require: true,
            title: '值',
            widgetType: 'input'
          }]
      },
      resultGridConfig: {
        showPageBar: false,
        showCheckbox: false,
        showOperateTool:false,
        edit: false,
        columns: []
      }
    }
  },
  props: {
openConfig: {
  type: Object,
    default: function () {
      return {}
    }
}
  },
  components: {
    CommonGridTable
  },
  computed:{

  },
  created () {

  },
  mounted () {
    console.info(this.openConfig.id)
    this.id = this.openConfig.id
    this.init()
  },
  methods: {
    init(){
      let _this = this;
      getConfig(this.formKey).then(res=>{
        console.info(res)
        _this.config = res;
        _this.formId = res.id
        _this.mainFormId = res.forms[0].id
        _this.tableName = res.forms[0].tableName
        let formColumns = res.forms[0].formColumns
        let column = formColumns.find(item=>{
          return item.widgetType === 'sub-form'
        })

        _this.subFormId = column.id
        _this.sybFormTableName = column.tableName

        _this.loadMainData()
        _this.loadParamsData()

      })


    },loadMainData(){
      let _this = this
      let params = {
        businessKey: this.id,
        id : this.mainFormId,
        formKey: this.formKey,
        tableName : this.tableName
      }
      getMainData(params).then(res=>{
        // console.info(res)
        _this.mainData = res
      })

    },loadParamsData(){
      let _this = this
      let params = {
        'formKey': this.formKey,
        'formId': this.formId,
        'id': this.subFormId,
        'businessKey': this.id,
        'tableName': this.sybFormTableName
      }
      getGridData(params, this).then(res => {
        let data = []
        if (res.data) {
          // console.info(res.data)
          res.data.forEach(item=>{
            data.push({
              key: item['CODE_'],
              title: item['COLUMN_NAME_'],
              value: ''
            })
          })
        }
        if(this.mainData['CATEGORY_'] === '1'){
          data.push({
            key: 'keyword',
            title: '关键字',
            value: ''
          })
        }
        _this.$refs['query-params'].loadData(data)
      })
    },queryData(){
      let _this = this
      _this.resultGridConfig.columns = []
      _this.$refs['query-data'].updateColumns()
      _this.$refs['query-data'].loadData([])
      // console.info('----queryData----')
      let  params = {

      }
      let url = ''
      if(this.mainData['CATEGORY_'] === '1'){
        params.pageIndex = 1;
        params.pageSize = 10;

        let data = this.$refs['query-params'].tableData
        if(this.mainData['RUNTYPE_'] === 'Interface'){
          url = this.mainData['RUNSQL_']
          let queryParams = [];
          // console.info(data)
          data.forEach(item=>{
            queryParams.push({'key':item.key,'value': item.value})
            // queryParams[item.key] = item.value
            if(item.key === 'keyword'){
              params.keyword = item.value
            }
          })
          params.queryParams = queryParams;
        }else{
          data.forEach(item=>{
            params[item.key] = item.value
          })
          url = '/api_v1/form/api/'+this.id+'/data'
        }

      }else if(this.mainData['CATEGORY_'] === '2'){
        params.apiId = this.id
        let queryParams = {};
        let data = this.$refs['query-params'].tableData
        // console.info(data)
        data.forEach(item=>{
          params[item.key] = item.value

        })

        if(this.mainData['RUNTYPE_'] === 'Interface'){
          url = this.mainData['RUNSQL_']
        }else{
          url = '/api_v1/form/api/'+this.id+'/data'
        }
      }

      _this.util.mask()

      this.util.restPost(url, params, function (res) {
        if (res != undefined && res != null) {
          if (res.status === 200) {
            if(res.data && res.data.length>0){
              let columns = []
              let item = res.data[0];
              for(let key in item){
                columns.push({
                  columnName: key,
                  javaType: 'String',
                  width: 100,
                  sortable: true,
                  readOnly:true,
                  title: key
                })
              }
              _this.resultGridConfig.columns = columns
              _this.$refs['query-data'].updateColumns()
              // console.info(_this.resultGridConfig)
              _this.$refs['query-data'].loadData(res.data)
            }
          }
        }
        _this.util.unmask()
      })
    },openMessage() {
      this.$alert(this.mainData['RUNSQL_'], '执行代码', {
        showConfirmButton:false,
        // confirmButtonText: '确定',
        callback: action => {

        }
      });
    }

  }
}
