
export const tableMixin = {
  data: function () {
    return {
      dicMap:{}, // 数据字典
      summaryData: {}, // 表格合计数据
      expression:{},
      queryDataParams: {},// 高级查询参数
      columns:[],
      keyword: '',
      search: '',
      openDialogWidth:1000,
      openDialogHeight:600,
      showOpenDialogTitle: false,
      openDialogConfirmVisible: false, // 弹框打开表单是否显示确认取消按钮
      openDialogTitle: '', // 弹框打开表单的标题
      openDialogConfig: {}, // 弹框打开表单的配置
      openDialogVueName: '', // 弹框打开表单的配置
      openDialogVisible: false, // 弹框打开页面openType=1,
      selection: [], // 复选框数据
      selectedData: [], // 选中行
      tableData:[]
    }
  },
  props: {
    config: {
      type: Object,
      default: function () {
        return {}
      }
    },
    edit: {
      type: Boolean,
      default: false
    },
    queryParams: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed:{
    showCheckbox(){ // 显示复选框
      if(this.config != undefined && this.config.showCheckbox != undefined){
        return this.config.showCheckbox
      }
      return true;
    },
    showIndex(){ // 显示序号
      if(this.config != undefined && this.config.showIndex != undefined){
        return this.config.showIndex
      }
      return true;
    },sortable(){ // 显示排序
      return function (column) {
        if(column != undefined && column.sortable != undefined){
          return column.sortable
        }
        return false;
      }
    },
    showOperateTool(){ // 显示操作列
      // console.info('0----'+this.config.showOperateTool)
      if(this.config != undefined && this.config.showOperateTool != undefined){
        return this.config.showOperateTool
      }
      return true;
    },
    dicValue(){ // 数据字典label
      return function (column ,value ){
        // console.info(column)
        // console.info(this.dicMap[column.columnName])
        if(column){
          if(this.dicMap[column.columnName]){
            return this.dicMap[column.columnName][value];
          }
        }
        return value?value:"";
      }
    },
    formatDate () {
      return function (column, row) {
        // console.log('-----formatDate-----',column,row[column.columnName])
        let format = 'yyyy-MM-dd'
        if (column.widgetType === 'select-time') {
          format = 'HH:mm:ss'
        } else if (column.widgetType === 'select-date-time') {
          format = 'yyyy-MM-dd hh:mm:ss'
        }
        if (row[column.columnName + 'LABEL_']) {
          return row[column.columnName + 'LABEL_']
        } else {
          // console.info(format+'---'+row[column.columnName]+'---'+typeof row[column.columnName]+'----'+column.columnName)
          if (typeof row[column.columnName] === 'number') {
            let date = new Date(row[column.columnName])
            // console.info('-----------'+date.format('yyyy-MM-dd'))
            return date.format(format)
          } else if (typeof row[column.columnName] === 'string') {
            if (row[column.columnName].indexOf('T') > -1) {
              return row[column.columnName].substring(0, 10)
            } else {
              try {
                let date = new Date(row[column.columnName])
                return date.format(format)
              } catch (e) {
                return row[column.columnName]
              }
            }
          }
        }
      }
    }
  },
  created () {

  },
  mounted () {
    this.expression = {};
  },
  methods: {
    getSelectedData () { // 获取选中行
      let selectedData = this.selection;
      return selectedData
    },
    getData(){
      // console.info(this.tableData)
      return this.tableData;
    },
    handleOperateClick(buttonId,index,row){ // 操作按钮单击事件
      // console.info(buttonId)
      // console.info(row)
      this.$emit('handleOperateClick', buttonId,index,row);
    },
    handlerSelectionChange (val) {
      // console.info('------handlerSelectionChange--------');
      // console.info(val)
      this.selection = val
    },
    queryData (params) { // 查询表单查询调用
      if (params) {
        this.keyword = params.keyword
        this.formData = params.formData
        this.queryDataParams = params
        this.loadData()
      }else{
        this.queryDataParams = {}
        this.loadData()
      }
      console.log('-----queryDataParams---------',this.queryDataParams)
    },
    rowClick (item) {
      this.$emit('handlerRowClick', item);
      this.selection = [item];
    },
    handleRowButtonClick (column, index, row) { // 列表中按钮
      console.log('-------handleRowButtonClick-------')
      // 只读点击无效
      /*if (this.readOnly) {
        return
      }*/
      if (column.events) {
        eval(column.events)
      }
      // console.log(column.openType+'--------1-------'+column.openUrl)
      if (column.openType && column.openUrl) {
        let openParams = column.openParams
        // console.info('openParams--1--'+openParams)
        if (openParams) {
          for (let key in row) {
            if (openParams.indexOf('{' + key + '}') > -1) {
              let value = row[key] ? row[key] : ''
              openParams = openParams.replace(new RegExp('{' + key + '}', 'gm'), value)
            }
          }
          // 判断是否还有参数不存在无法体会
          if (openParams.indexOf('{') > -1 && openParams.indexOf('}') > -1) {
            let keys = openParams.match(/\"\{(.*?)\}\"/gi) // 匹配所有类似{}的变量
            if (keys) {
              keys.forEach(key => {
                let columnName = key.trim().substring(key.indexOf('{') + 1, key.indexOf('}'))
                // console.info(key + '--------'+ columnName)
                // 试着替换查询参数 queryParams
                if (this.queryParams && this.queryParams[columnName]) {
                  openParams = openParams.replace(new RegExp(key, 'gm'), '"' + this.queryParams[columnName] + '"')
                } else{
                  openParams = openParams.replace(new RegExp(key, 'gm'), '""')
                }
              })
            }
          }
        }

        // console.info('openParams--2--'+openParams)

        if (openParams && openParams.title) {
          this.openDialogTitle = openParams.title
        } else {
          this.openDialogTitle = column.title
        }
        // console.log('---------------')
        if (column.openType === 3) { // 打开新标签
          let openUrl = column.openUrl
          if (openUrl) {
            let baseUrl = this.util.getBaseUrl()
            let access_token = this.sessionUtil.getAccessToken()
            let params = { ...row, baseUrl, access_token }
            // console.log(params)
            for (let key in params) {
              // console.log('{'+key+'}','---',openUrl.indexOf('{'+key+'}'))
              if (openUrl.indexOf('{' + key + '}') > -1) {
                openUrl = openUrl.replace('{' + key + '}', params[key])
              }
              // console.log(openUrl)
            }
            window.open(openUrl)
          }
        } else if (column.openType === 2) { // tab打开
          this.openByName(column.openUrl, openParams)
          // this.$router.push({
          //   name: 'form-view',
          //   params: {
          //     formKey:'project-info',
          //     title:'项目信息'
          //   }
          // })
        } else if (column.openType === 1) {
          // console.info(this.$route)
          // console.info(this.$router)
          this.openDialogVueName = column.openUrl
          let params = null
          if (this.openDialogVueName === 'form-query' || this.openDialogVueName === 'form-view') {
            // 说明是查询列表
            this.showOpenDialogTitle = false
            params = {}
            openParams = typeof openParams === 'string' ? JSON.parse(openParams):openParams
            params = Object.assign(params, openParams)
            params.selectFormKey = openParams.formKey
            // 给列表传递查询参数
            params.queryParams = openParams.queryParams
            params.openConfig = {}
            /*// console.log('----------',openParams)
            if(openParams.assignMultipleSelect){
              params.assignMultipleSelect = openParams.assignMultipleSelect
            }*/

          } else {
            this.showOpenDialogTitle = true
            params = {
              openConfig: typeof openParams === 'string' ? JSON.parse(openParams) : openParams
            }
          }
          let route = this.getRouteConfigByName(column.openUrl)
          // console.info(route)
          // 因为是表单所以通过这种方式传参
          params.openConfig.parent = this
          this.openDialogConfig = {
            route, params
          }
          // 判断是否执行的是拷贝
          if (column.attr && column.attr === 'copy' && openParams.desFormKey) {
            this.openDialogConfirmVisible = true
            // params.desFormKey = openParams.desFormKey//
            this.openDialogConfig.desFormKey = openParams.desFormKey
            this.openDialogConfig.srcFormKey = openParams.formKey
            this.openDialogConfig.desQueryParams = openParams.desQueryParams
            this.openDialogConfig.column = column
            // this.openDialogConfig.selectedData = this.getSelectedData()
          }
          this.openDialogVisible = true
        }
      } else {
        // 判断是否按钮触发调用
        if (column.sourceType === 'api' && column.sourceAttr) {
          // console.info('--------')
          let _this = this
          let apiConfig = column.apiConfig
          if (apiConfig) {
            let params = {}
            if (apiConfig.children) {
              apiConfig.children.forEach(child => {
                let key = null
                for (let field in row) {
                  if (child.value === '{' + field + '}') {
                    key = field
                    break
                  }
                }

                if (key) {
                  params[child.code] = row[key]
                } else {
                  params[child.code] = child.value
                }
              })
            }
            // 判断是否接口
            if (apiConfig.runtype === 'Interface') {
              params['_url'] = apiConfig.runsql
              for (let key in row) {
                if (params['_url'].indexOf('{' + key + '}') > -1) {
                  params['_url'].replace('{' + key + '}', row[key])
                }
              }
            }
            _this.util.mask('正在执行...')
            // 调用获取数据
            getDataByApi(apiConfig.id, params).then(res => {
              _this.loadData()
              _this.util.unmask()
              _this.util.success('执行成功!')
            }).catch((error) => {
              _this.util.error(error.errorMsg)
              _this.util.unmask()
            })
          }
        }
      }
      // console.info('22---------')
    },
    getRouteConfigByName (name) {
      // console.info(name)
      if (this.$router.options.routes) {
        let data = []
        for (let i = 0; i < this.$router.options.routes.length; i++) {
          let item = this.$router.options.routes[i]
          if (item.name === name) {
            data.push(item)
            break
          } else {
            if (item.children && item.children.length > 0) {
              for (let j = 0; j < item.children.length; j++) {
                let child = item.children[j]
                if (child.name === name) {
                  data.push(child)
                  break
                }
              }
            }
          }
        }
        if (data) {
          if (data.length > 0) {
            return data[0]
          }
          return data
        }
      }
      return null
    }
  }
}
