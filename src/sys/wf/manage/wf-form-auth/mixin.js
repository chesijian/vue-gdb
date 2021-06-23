import {getConfig, saveConfig} from '@/api/form-render'
import CommonGridTable from '../../../../common/table/grid-table/grid-table'

const AUTH_TYPE = ',--选择--;1,可编辑;2,只读;3,隐藏'

export const mixin = {
  data: function () {
    return {
      config:null,
      formInfo:null,
      activeName: 'main-form',
      subForms: [],
      selectedFormColumns: [],
      subFormsMap: {},
      showTab:false,
      width:0,
      formAuthList: [],
      nodeId: '',
      mainFormGridConfig: {
        showPageBar: false,
        showCheckbox: true,
        showOperateTool: false,
        edit: true,
        type: 'query-design',
        columns: [
          {
            columnName: 'title',
            javaType: 'String',
            width: 100,
            readOnly:true,
            sortable: true,
            require: true,
            title: '标题',
            widgetType: 'input'
          }, {
            columnName: 'columnName',
            javaType: 'String',
            width: 120,
            hidden: true,
            sortable: true,
            title: '字段名称',
            widgetType: 'input'
          }, {
            columnName: 'status',
            javaType: 'Integer',
            title: '权限类型',
            width: 80,
            require: true,
            widgetType: 'select',
            attr: AUTH_TYPE
          }]
      },
      subFormGridConfig: {
        showPageBar: false,
        showCheckbox: true,
        showOperateTool: false,
        edit: true,
        type: 'query-design',
        columns: [
          {
            columnName: 'title',
            javaType: 'String',
            width: 100,
            readOnly:true,
            sortable: true,
            require: true,
            title: '字段名称',
            widgetType: 'input'
          }, {
            columnName: 'columnName',
            javaType: 'String',
            width: 120,
            hidden: true,
            sortable: true,
            title: '字段名称',
            widgetType: 'input'
          }, {
            columnName: 'status',
            javaType: 'Integer',
            title: '权限类型',
            width: 80,
            require: true,
            widgetType: 'select',
            attr: AUTH_TYPE
          }]
      }
    }
  },
  props: {
    procDefId: {
      type: String,
      default: function () {
        return ''
      }
    },
    node: {
      type: Object,
      default: function () {
        return null
      }
    },
    formAuthList1: {
      type: Array,
      default: function () {
        return []
      }
    },
    formKey: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  computed:{

  },
  created () {

  },
  mounted () {
    this.init()

  },
  methods: {
    init(){
      this.formAuthList = this.node.formAuthList
      this.nodeId = this.node.nodeId
      let authsMap = {}
      if(this.formAuthList){
        // console.log('-------this.formAuthList--------',this.formAuthList)
        this.formAuthList.forEach(auth => {
          // console.log('-----------',auth,auth.formInfoId,auth.columnName)
          if(!authsMap[auth.formInfoId]){
            authsMap[auth.formInfoId] = {}
          }
          authsMap[auth.formInfoId][auth.columnName] = auth.status
        })
      }
      // console.log('-------init--------',this.node,authsMap)
      getConfig(this.formKey,this).then(config=>{
        this.config = config

        this.showTab = true
        let subForms = []
        let subFormsMap = {}
        let forms = config.forms
        if(forms){
          // 如果左右结构多个表，查找最下层的表单，
          let form = null
          if(forms.length === 1){
            form = forms[0]
          }else{
            form = forms.find(item=>{
              // console.log('------------',item)
              return this.validUtil.isNotNull(item.parentId)
            })
          }
          // console.log('--------form-------',form)
          if(!form){
            return
          }
          if (form.formColumns) {
            form.formColumns = form.formColumns.map(column => {
              // column['statusisShow'] = false
              if(authsMap[form.id] && authsMap[form.id][column.columnName]){
                column.status = authsMap[form.id][column.columnName]
              }else{
                column.status = undefined
              }
              column = Object.assign({},column,{"status":column.status})
              this.$set(column, 'status', column.status)
              // column = Object.assign({},column,{"status":column.status})
              /*column['status1'] = '2'
              column = Object.assign({},column,{"status":column.status})
              this.$set(column, 'status', column.status)
              let newColumn = Object.assign({},column,{"status1":'2'})
              this.$set(column, 'status1', '2')
              // Vue.set(column, 'status', column.status)
              let column2 = JSON.parse(JSON.stringify(newColumn))
              console.log('--------newColumn--------'+JSON.stringify(newColumn),column2)*/
              // this.$set(column, 'status', column.status)
              if (column.widgetType && column.widgetType === 'sub-form') {
                column['key'] = form.id + '@' + column.columnName
                subFormsMap[column['key']] = column
                subForms.push(column)
                if(column.config && column.config.queryColumns){
                  column.config.queryColumns = column.config.queryColumns.map(subColumn => {
                    subColumn['statusisShow'] = false
                    if(authsMap[column.id] && authsMap[column.id][subColumn.columnName]){
                      subColumn.status = authsMap[column.id][subColumn.columnName]
                    }else{
                      subColumn.status = undefined
                    }
                    subColumn = Object.assign({},subColumn,{"status":subColumn.status})
                    this.$set(subColumn, 'status', subColumn.status)
                    return subColumn
                  })
                }
              }
              return column
            })
          }

          this.subFormsMap = subFormsMap
          this.subForms = subForms

          // console.log('----form---',form)
          this.$nextTick(function () {
            this.formInfo = form
            this.handleTabClick()
          })
        }
      })
    },
    getData(){
      let data = []
      let mainFormData = this.getSelectFrom().formColumns;
      if(mainFormData){
        mainFormData.forEach(column => {
          if(this.validUtil.isNotNull(column.status)){
            data.push({
              // procDefId:this.procDefId,
              nodeId:this.nodeId,
              formKey: this.formKey,
              formInfoId: this.formInfo.id,
              columnName: column.columnName,
              status: column.status
            })
          }
        })
      }
      if(this.subForms){
        this.subForms.forEach(subForm=>{
          if(subForm.config && subForm.config.queryColumns){
            subForm.config.queryColumns.forEach(column => {
              if(this.validUtil.isNotNull(column.status)){
                data.push({
                  // procDefId:this.procDefId,
                  nodeId:this.nodeId,
                  formKey: this.formKey,
                  formInfoId: subForm.id,
                  columnName: column.columnName,
                  status: column.status
                })
              }
            })
          }
        })
      }
      // console.log('-------getData--------',data)
      return data
    },
    handleTabClick (tab, event) {
      // console.log(tab, event,this.activeName);
      // this.handlerTreeRowClick();
      // 判断是否明细表
      if (this.activeName.indexOf('@') > -1) {
        let columns = this.subFormsMap[this.activeName].config.queryColumns
        // console.info(this.activeName)
        // console.info(this.$refs)
        // console.info(this.$refs[this.activeName])
        // console.info('-----handleTabClick---------',columns)
        if (columns) {
          this.$refs[this.activeName][0].loadData(columns)
        } else {
          this.$refs[this.activeName][0].loadData([])
        }
      } else {

        let selectedForm = this.getSelectFrom()
        if (selectedForm != null) {
          let tableData = []
            if (selectedForm.formColumns === undefined) {
              selectedForm.formColumns = []
            }
            tableData = selectedForm.formColumns
            this.selectedFormColumns = tableData
          // console.log('------handleTabClick------',tableData)
            this.$refs[this.activeName].loadData(tableData)
          return
        }
        this.$refs[this.activeName].loadData([])
      }
    },
    getSelectFrom(){
      return this.formInfo
    },
    handlerGridAddClick () { // 查询设计或者表单设计列表增删改查
      // console.info('activeName---'+this.activeName)
      if (!this.activeName === 'event-design') {
        let selectedTreeNode = this.getSelectFrom()
        if (selectedTreeNode === null) {
          this.util.warn('请选择一个表单！')
          return
        }
      }
      if (this.activeName === 'query-design') {
        this.getActiveGrid().addRow({readOnly: 1, readOnly_SWITCH: true})
      } else {
        this.getActiveGrid().addRow()
      }
    },
    handlerGridDeleteClick () { // 查询设计或者表单设计列表增删改查查询设计或者表单设计列表增删改查
      // console.info('activeName---'+this.activeName)
      this.handlerGridOperateDeleteClick()
    },
    handlerColumnSelectClick () { // 弹框选择字段
      let selectedForm = ''
      if (this.activeName === 'query-design') {
        selectedForm = this.getSelectFrom()
      } else if (this.activeName === 'form-design') {
        selectedForm = this.getSelectFrom()
      } else {
        let subForm = this.subFormsMap[this.activeName]
        if (subForm) {
          selectedForm = {'tableName': subForm.config.entity}
        }
      }
      if (selectedForm != null) {
        // this.queryParams = [{key:"TABLE_NAME_",value:selectedForm.tableName}]
        this.queryParams = {'TABLE_NAME_': selectedForm.tableName}
        this.columnSelectDialogVisible = true
      } else {
        this.util.warn('请先选择表单!')
      }
    },
    handlerColumnSelectOkClick () { // 弹框选择完字段确定回调
      let selectedData = this.$refs['column-select'].getSelectedData()
      if (selectedData.length === 0) {
        this.util.warn('请选择字段!')
        return
      }
      let grid = this.getActiveGrid()

      let tableData = grid.tableData
      // console.info(tableData)
      let insertData = []
      selectedData.filter(item => {
        let temp = tableData.find(field => {
          if (field.columnName === item.columnName) {
            return true
          }
          return false
        })
        if (temp === undefined) {
          // 说明没有找到
          insertData.push(item)
        }
        return true
      })
      insertData.forEach(item => {
        grid.addRow(item)
      })
      if (this.activeName === 'query-design') {
        this.getSelectFrom().queryColumns = tableData
      } else if (this.activeName === 'form-design') {
        this.getSelectFrom().formColumns = tableData
      } else {
        // 说明是明细表
        let subForm = this.subFormsMap[this.activeName]
        if (subForm) {
          // console.info(subForm)
          subForm.config.queryColumns = tableData
        }
      }
      // let selectedForm = _this.getSelectFrom();

      this.getActiveGrid().loadData(tableData)

      this.columnSelectDialogVisible = false
    },
    handlerColumnCopyClick () { // 复制选中的列
      let grid = this.getActiveGrid()
      // console.info(grid)
      let type = grid.config.type
      let data = this.getSelectedGridData()
      if (data.length === 0) {
        this.util.warn('请先选择数据!')
        return
      }
      this.cookieUtil.set('form-config-data', {
        type: type,
        data: data
      })
    },
    handlerColumnPasteClick (event) { // 复制选中的行
      let cache = this.cookieUtil.get('form-config-data')
      if (cache && cache.data.length > 0) {
        let data = cache.data
        let grid = this.getActiveGrid()
        let type = grid.config.type
        if (type === 'event-design' && cache.type !== 'event-design') {
          this.util.warn('剪切板数据类型不匹配')
          return
        }
        if (type !== 'event-design' && cache.type === 'event-design') {
          this.util.warn('剪切板数据类型不匹配')
          return
        }
        if (type === 'query-design' || type === 'form-design') {
          let selectedForm = this.getSelectFrom()
          if (selectedForm === null) {
            this.util.warn('请先选择表单!')
            return
          }
        }
        let tableData = grid.tableData
        // console.info(tableData)
        let insertData = []
        data.filter(item => {
          let temp = null
          if (type === 'event-design') {
          } else {
            temp = tableData.find(field => {
              if (field.columnName === item.columnName) {
                return true
              }
              return false
            })
          }
          if (temp === undefined || temp === null) {
            delete item.id
            delete item.formId
            delete item.parentId

            // 说明没有找到
            insertData.push(item)
          }
        })

        // console.info(insertData)

        insertData.forEach(item => {
          grid.addRow(item)
        })
      }
    }
  },
  components: {
    CommonGridTable
  }
}
