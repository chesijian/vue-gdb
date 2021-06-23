import {getReport} from '@/api/form-render'
import webapp from '../../../sys/report/grwebapp.js'
import utils from '../../../sys/report//utils.js'
export const mixin = {
  data: function () {
    return {
      formData: {},
      keyword: '',
      optionsBtnType: {},
      advanceSearchBtnVisible: false,
      selectMemberModels: {// 人员控件
        form: {},
        isShow: false,
        selectList: [],
        callBack: this.memberCallBack,
        radioSelectFlags: false
      },
      selectQuertersModels: {// 部门控件
        isShow: false,
        form: {},
        selectList: [],
        callBack: this.quertersCallBack,
        radioSelectFlags: false
      },
      html5Params: {},
      selectModalVisible: false,
      modalList: [],
      modal: {},
      selectFormVisible: false,
      selectFormQueryParams: null, // 选择弹框表单时查询传参
      selectFormConfig: {} // 选择弹出框的配置
    }
  },
  props: {
    searchFormColumns: {
      type: Array,
      default: function () {
        return []
      }
    },
    topButtons: {
      type: Array,
      default: function () {
        return []
      }
    },
    searchFormRows: { // 查询表单的行数据
      type: Array,
      default: function () {
        return []
      }
    },
    title: { // 查询表单的行数据
      type: String,
      default: function () {
        return ''
      }
    },
    isTree: {
      type: Boolean,
      default: false
    },
    hasTitle: {
      type: Boolean,
      default: true
    },
    hasQuery: {
      type: Boolean,
      default: true
    },
    singleSelect: {
      type: Boolean,
      default: false
    },
    multipleSelect: { // 多选
      type: Boolean,
      default: false
    },
    searchVisible: { // 是否显示搜索框
      type: Boolean,
      default: false
    },
    searchPlaceholder: {
      type: String,
      default: '请输入关键字'
    },
    resetVisible: { // 是否显示重置按钮
      type: Boolean,
      default: false
    }
  },
  watch: {
    searchFormRows: {
      handler (newValue, oldValue) {
        // console.log('----searchFormRows--------',newValue, oldValue)
        newValue.forEach(row => {
          row.forEach(column => {
            if (column.widgetType === 'select' || column.widgetType === 'select-dic' || column.widgetType === 'select-api' || column.widgetType === 'select-sql') {
              let defaultValue = column.value
              // console.log('------init-------'+defaultValue,column)
              if (this.validUtil.isNotNull(defaultValue) && column.options) {
                for (let key in column.options) {
                  // console.log('------key-------'+key,defaultValue,(key === defaultValue),column.options[key])
                  if (key === defaultValue) {
                    this.formData[column.columnName] = defaultValue
                    setTimeout(() => {
                      this.handlerSearchBtnClick(column, key)
                    }, 100)
                  }
                }
              }
            }
          })
        })
      },
      immediate: true,
      deep: true
    }
  },
  created () {

  },
  mounted () {
    let _this = this
    _this.formData = {}
    _this.selectFormConfig = {}
    _this.keyword = ''
    _this.advanceSearchBtnVisible = false
    // this.searchFormRows = [];
    _this.init()
    // webapp.webapp_urlprotocol_startup()
  },
  methods: {
    init () {
      if (this.searchFormRows.length > 0) {
        // this.searchVisible = true;
        this.advanceSearchBtnVisible = true
        // 判断设置默认值
        /* this.searchFormRows.forEach(row => {
          row.forEach(column => {
            if(column.widgetType === 'select' || column.widgetType === 'select-dic'|| column.widgetType === 'select-api'|| column.widgetType === 'select-sql'){
              let defaultValue = column.value
              console.log('------init-------'+defaultValue,column)
              if(this.validUtil.isNotNull(defaultValue) && column.options){
                for(let key in column.options){
                  console.log('------key-------'+key,defaultValue,(key === defaultValue),column.options[key])
                  if(key === defaultValue){
                    this.handlerSearchBtnClick(column,key)
                  }
                }
              }
            }
          })
        }) */
      }
    },
    openForm (column) { // 点击新增
      this.$emit('openForm', column)
    },
    handlerAdvanceBtnClick () {
      this.advanceSearchVisible = !this.advanceSearchVisible
      this.queryData(0)
      // this.$forceUpdate()
    },
    handlerTopButtonClick (column) {
      // 判断是否自定义按钮
      if (column.openType && column.openUrl) {
        if (column.openType === 2) { // 打开标签页
          this.openByName(column.openUrl, column.openParams)
        } else if (column.openType === 1) { // 弹框打开
          this.$emit('handlerTopButtonClick', column)
        }
      } else {
        // 标准按钮新增
        if (column.columnName === 'new') {
          this.openForm()
        } else if (column.columnName === 'new-child') {
          this.openForm(column)
        } else if (column.columnName === 'edit') {
          this.$emit('handlerTopButtonClick', column)
        } else if (column.columnName === 'delete') {
          this.$emit('handlerTopButtonClick', column)
        }
        // 导入
        else if (column.columnName === 'import') {

        }
        // 导出
        else if (column.columnName === 'export') {
          let formConfig = this.$parent.formConfig
          let param = {
            'type': '1',
            'formInfoId': formConfig.id
          }
          let gridData = JSON.parse(JSON.stringify(this.$parent.gridData))
          // Object.assign(gridData, this.$parent.gridData)
          // console.log('-------1-------',this.$parent.gridData, formConfig)
          // return
          let data = {'Table': this.filterData(gridData, formConfig)}

          // console.log('-------2-------',this.$parent.gridData,gridData)
          this.html5Params = {
            formConfig: formConfig,
            data: data,
            type: '1',
            formId: formConfig.formId,
            formInfoId: formConfig.id
          }
          getReport(param).then(data => {
            if (data) {
            // 如果有多个模板
              if (data.length > 1) {
                this.modalList = data
                this.selectModalVisible = true
              } else {
                this.html5Params.grf = data[0].grf
                this.openReport()
              }
            } else {
              this.html5Params.grf = JSON.stringify(utils.getReport(formConfig, 1, null))
              this.openReport()
            }
          })
        } else {
          this.$emit('handlerTopButtonClick', column)
        }
      }
    },
    openSelectForm (column) { // 打开树表选择框
      // console.info('------openSelectForm------1--')
      this.selectFormKey = column.attr
      this.formSelectBindColumn = column
      this.selectFormVisible = true
    },
    confirmSelect () { // 弹框选择确定数据
      let selectedData = []
      let selectForm = this.$refs['select-form']
      if (selectForm && selectForm.getSelectedData) {
        // console.info('---------------------'+selectForm.getSelectedData)
        selectedData = selectForm.getSelectedData()
      }
      if (selectedData.length === 0) {
        this.util.warn('请选择数据')
        return
      }
      // 表示单选
      let selectedRow = selectedData[0]
      if (this.formSelectBindColumn != null) {
        this.formData[this.formSelectBindColumn.columnName] = selectedRow[this.formSelectBindColumn.columnName]
        this.formData[this.formSelectBindColumn.columnName + 'LABEL_'] = selectedRow[this.formSelectBindColumn.columnName + 'LABEL_']
      }
      this.selectFormVisible = false
      this.formSelectBindColumn = null
    },
    setFormWidth (formConfig) {
      this.selectFormConfig = formConfig
    },
    openReport () {
      if (this.html5Params.grf && this.html5Params.data) {
        webapp.webapp_urlprotocol_startup()
        setTimeout(() => {
          webapp.webapp_ws_run({}, this.html5Params.grf, JSON.stringify(this.html5Params.data))
        }, 100)
      }
    },
    selectModal () {
      this.modalList.forEach(edit => {
        if (edit.selected === true) {
          this.$set(this.html5Params, 'grf', edit.grf)
        }
      })
      this.openReport()
    },
    // 过滤数据
    filterData (data, formConfig) {
      if (!data || !formConfig) return
      data.forEach(item => {
        formConfig.queryColumns.forEach(e => {
          if (e && (e.widgetType === 'select-form' ||
                      e.widgetType === 'select-user' ||
                      e.widgetType === 'select-depart' ||
                      e.widgetType === 'select-role' ||
                      e.columnName === 'SUB_COMPANY_' ||
                      e.columnName === 'UPDATE_USER_' ||
                      e.columnName === 'CREATE_USER_')
          ) {
            if (item[e.columnName + 'LABEL_']) {
              item[e.columnName] = item[e.columnName + 'LABEL_']
            }
          }
          if (e.widgetType === 'select-date' ||
              e.widgetType === 'select-time' ||
              e.widgetType === 'select-date-time') {
            let format = 'yyyy-MM-dd'
            if (e.widgetType === 'select-time') {
              format = 'HH:mm:ss'
            } else if (e.dateType === 'datetimerange') {
              format = 'yyyy-MM-dd hh:mm:ss'
            } else if (e.dateType === 'monthrange') {
              format = 'yyyy-MM'
            }
            item[e.columnName] = this.formatDate(format, item[e.columnName])
          }
          if (e.widgetType === 'select-dic' || e.widgetType === 'select-sql' || e.widgetType === 'select') {
            if (e.options) {
              if (e.options[item[e.columnName]]) {
                item[e.columnName] = e.options[item[e.columnName]]
              } else {
                for (const key in e.options) {
                  // 如果key值有空值 那么默认赋值给item[e.columnName]
                  if (!key) {
                    item[e.columnName] = e.options[key]
                  }
                }
              }
            }
          }
          // 如果是switch控件 判断是否选中 默认1为是 0 为否
          if (e.widgetType === 'switch') {
            item[e.columnName] = (item[e.columnName + '_SWITCH'] == 'true') ? '是' : '否'
          }
        })
      })
      return data
    },
    formatDate (format, value) {
      if (typeof value === 'number') {
        let date = new Date(value)
        return date.format(format)
      } else if (typeof value === 'string') {
        if (value.indexOf('T') > -1) {
          return value.substring(0, 10)
        } else {
          try {
            if (value.indexOf(':') > -1 || value.indexOf('-')) {
              return value
            } else {
              let num = Number(value)
              let date = new Date(num)
              return date.format(format)
            }
          } catch (e) {
            return value
          }
        }
      } else if (typeof value === 'object') {
        return value.format(format)
      }
    },
    selected (item, list) {
      // 由于单选
      for (var i = 0; i < list.length; i++) {
        // 默认第一个选中
        var temp = list[i]
        // console.info(temp.id +'=='+ item.id)
        if (temp.id == item.id) {
          temp.selected = true
        } else {
          temp.selected = false
        }
      }
      this.$forceUpdate()
    },
    handlerClickAll (column) {
      let columnName = column.columnName
      let eidt = columnName + 'all'
      this.optionsBtnType[eidt] = 'primary'
      this.formData[column.columnName] = null
      for (const key in column.options) {
        let ele = columnName + key
        this.optionsBtnType[ele] = ''
      }
      this.$forceUpdate()
      this.queryData()
    },
    handlerSearchBtnClick (column, index) {
      // console.log('----handlerSearchBtnClick-----',index)
      let columnName = column.columnName
      this.optionsBtnType[columnName + 'all'] = 'default'
      let eidt = columnName + index
      this.optionsBtnType[eidt] = this.optionsBtnType[eidt] === 'primary' ? '' : 'primary'
      for (const key in column.options) {
        let ele = columnName + key
        if (ele !== eidt) {
          this.optionsBtnType[ele] = ''
        }
      }
      // 获取选择值
      this.formData[columnName] = ''
      for (const key in column.options) {
        let ele = columnName + key
        if (this.optionsBtnType[ele] === 'primary') {
          // this.formData[columnName] += "'" + key + "',"
          this.formData[columnName] += key
        }
      }
      // this.formData[columnName] = this.formData[columnName].substring(0, this.formData[columnName].length - 1)
      this.$forceUpdate()
      this.queryData()
    },
    handlerValueChange (column, value) { // 主表数据change时触发
      // console.info(column.columnName + '------handlerValueChange------' + value)
      // 先判断数据来源绑定主表字段的情况
      if (this.sourceData) {
        for (let key in this.sourceData) {
          let sourceColumnName = this.sourceData[key]
          // 判断是否当前列的数据触发影响其他列
          if (sourceColumnName === column.columnName) {
            let column = this.formColumnsMap[key]
            // 判断是否中文字段
            if (column.widgetType === 'number-cn' && value != undefined) {
              let newValue = this.util.numToCn(value)
              this.formData[key] = newValue
            }
          }
        }
      }
      // 判断如果是switch组件需要特殊处理
      if (column.widgetType === 'switch') {
        this.formData[column.columnName] = value ? 1 : 0
        this.formData[column.columnName] += ''
        this.formData[column.columnName + '_SWITCH'] = value
        this.$forceUpdate()
      }
      // 判断如果是时间区间查询组件需要特殊处理
      if (column.widgetType === 'select-date') {
        let format = 'yyyy-MM-dd'
        if (column.widgetType === 'select-time') {
          format = 'HH:mm:ss'
        } else if (column.dateType === 'datetimerange') {
          format = 'yyyy-MM-dd hh:mm:ss'
        } else if (column.dateType === 'monthrange') {
          format = 'yyyy-MM'
        }
        if (column.dateType === 'datetimerange' || column.dateType === 'daterange' || column.dateType === 'monthrange') {
          let str = ''
          if (value && value.length > 0) {
            for (let index = 0; index < value.length; index++) {
              if (index != 0) {
                str += ','
              }
              str += this.formatDate(format, value[index])
            }
          }
          this.formData[column.columnName] = str
        } else {
          this.formData[column.columnName] = this.formatDate(format, value)
        }
        this.$forceUpdate()
      }
    },
    // 选人点击事件
    selectMember (column) {
      this.selectMemberModels.isShow = true
      this.selectMemberModels.form = column
      this.selectMemberModels.radioSelectFlags = (column.widgetType === 'select-user')
    },
    // 选人回调函数
    memberCallBack () {
      this.selectMemberModels.isShow = false
      var vm = this
      this.searchFormRows.forEach(element => {
        element.forEach(e => {
          if (e.columnName === this.selectMemberModels.form.columnName) {
            if (this.selectMemberModels.form.widgetType === 'select-user') {
              if (this.selectMemberModels.selectList.length > 0) {
                vm.$set(vm.formData, e.columnName + 'LABEL_', this.selectMemberModels.selectList[0].userName)
                vm.$set(vm.formData, e.columnName, this.selectMemberModels.selectList[0].id)
                if (e.columnName.lastIndexOf('UID_') > -1) {
                  let name = e.columnName.split('UID_')
                  vm.$set(vm.formData, name[0] + 'NAME_', this.selectMemberModels.selectList[0].userName)
                }
                if (e.columnName.lastIndexOf('ID_') > -1) {
                  let name = e.columnName.split('ID_')
                  vm.$set(vm.formData, name[0] + 'NAME_', this.selectMemberModels.selectList[0].userName)
                }
              } else {
                vm.$set(vm.formData, e.columnName + 'LABEL_', '')
                vm.$set(vm.formData, e.columnName, '')
              }
            } else if (this.selectMemberModels.form.widgetType === 'select-user-multi') {
              // eslint-disable-next-line no-unused-vars
              var labels = ''; var ids = ''
              this.selectMemberModels.selectList.forEach(element => {
                labels += element.userName + ','
                ids += element.id + ','
              })
              vm.$set(vm.formData, e.columnName + 'LABEL_', labels.substring(0, labels.length - 1))
              vm.$set(vm.formData, e.columnName, ids.substring(0, ids.length - 1))
              // 判断字段是否为ID_或UID_结尾 是则给NAME_也赋值
              if (e.columnName.lastIndexOf('UID_') > -1) {
                let name = e.columnName.split('UID_')
                vm.$set(vm.formData, name[0] + 'NAME_', labels.substring(0, labels.length - 1))
              }
              if (e.columnName.lastIndexOf('ID_') > -1) {
                let name = e.columnName.split('ID_')
                vm.$set(vm.formData, name[0] + 'NAME_', labels.substring(0, labels.length - 1))
              }
            }
          }
        })
      })
    },
    // 选部门点击事件
    selectQuerters (column) {
      this.selectQuertersModels.isShow = true
      this.selectQuertersModels.form = form
      this.selectQuertersModels.radioSelectFlags = (form.widgetType === 'select-depart')
    },
    // 选部门回调函数
    quertersCallBack () {
      this.selectQuerters.isShow = false
      var vm = this
      this.searchFormRows.forEach(element => {
        element.forEach(e => {
          if (e.columnName === this.selectQuertersModels.form.columnName) {
            if (this.selectQuertersModels.form.widgetType === 'select-depart') {
              vm.$set(vm.formData, e.columnName + 'LABEL_', this.selectQuertersModels.selectList[0].label)
              vm.$set(vm.formData, e.columnName, this.selectQuertersModels.selectList[0].id)
              if (e.columnName.lastIndexOf('UID_') > -1) {
                let name = e.columnName.split('UID_')
                vm.$set(vm.formData, name[0] + 'NAME_', this.selectQuertersModels.selectList[0].label)
              }
              if (e.columnName.lastIndexOf('ID_') > -1) {
                let name = e.columnName.split('ID_')
                vm.$set(vm.formData, name[0] + 'NAME_', this.selectQuertersModels.selectList[0].label)
              }
            } else if (this.selectQuertersModels.form.widgetType === 'select-depart-multi') {
              // eslint-disable-next-line no-unused-vars
              var labels = ''; var ids = ''
              this.selectQuertersModels.selectList.forEach(element => {
                labels += element.label + ','
                ids += element.id + ','
              })
              vm.$set(vm.formData, e.columnName + 'LABEL_', labels.substring(0, labels.length - 1))
              vm.$set(vm.formData, e.columnName, ids.substring(0, ids.length - 1))

              if (e.columnName.lastIndexOf('UID_') > -1) {
                let name = e.columnName.split('UID_')
                vm.$set(vm.formData, name[0] + 'NAME_', labels.substring(0, labels.length - 1))
              }
              if (e.columnName.lastIndexOf('ID_') > -1) {
                let name = e.columnName.split('ID_')
                vm.$set(vm.formData, name[0] + 'NAME_', labels.substring(0, labels.length - 1))
              }
            }
          }
        })
      })
    },
    getParams () {
      return this.formData
    },
    queryData (flag) {
      let params = {
        keyword: this.keyword,
        formData: this.formData
      }
      // eslint-disable-next-line eqeqeq
      if (flag != undefined && flag === 0) {
        this.$refs['queryForm'].resetFields()
        params = {
          keyword: '',
          formData: {}
        }
        this.keyword = ''
        this.formData = {}
        this.optionsBtnType = {}
      }
      this.$emit('queryData', params)
    }
  }
}
