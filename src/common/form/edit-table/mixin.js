// import {formUtil} from '../form'
import {getDicData, getConfig, getGridData, getDataByApi, getSqlDicData, getTreeData} from '@/api/form-render'
import {mapGetters, mapMutations} from 'vuex'
import {EVENT_TYPE, API_RUN_TYPE} from '../../../public/js/const'
import excel from '@/utils/excel'
import {getUUID} from '../../../utils/uuid'

export const mixin = {
  name: 'edit-table',
  data: function () {
    return {
      loading: false,
      rowKey: 'id', // 树表时指定
      currentRow: null, // 当前选中行
      // dicMap: {},
      columnsMap: {},
      summaryData: {}, // 表格合计数据
      expression: {}, // 计算公式
      summaryColumns: {}, // 合计列
      showSummary: false, // 是否显示合计
      selectTableIndex: -1, // 表格选中的行数
      selectTableRow: null, // 表格选中的行
      selectFormKey: '', // 弹框选择，关联表单的formKey
      selectFormTitle: '', // 弹框选择，表单title
      selectFormConfig: {}, // 选择弹出框的配置
      selectFormVisible: false,
      selection: [], // checkbox行
      columns: [], // 列
      topBar: [],
      isTree: false, // 是否树表
      queryParams: {},
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
      showTopNewButton: true,
      showTopDeleteButton: true,
      showCellNewButton: true,
      showCellDeleteButton: true,
      openDialogTitle: '', // 弹框打开表单的标题
      openDialogConfig: {}, // 弹框打开表单的配置
      openDialogVueName: '', // 弹框打开表单的配置
      openDialogWidth: 900,
      openDialogHeight: 700,
      openDialogVisible: false, // 弹框打开页面openType=1
      selectExcelVisible: false,
      selectFormSingleSelect: false, // 选择弹框选择数据
      selectFormColumn: null, // 行内弹框绑定的列
      excelList: [],
      moreColumns: [],
      uploadLoading: false,
      ifFormEditRender: false, // 是否表单编辑时第一次渲染
      file: null,
      uploadConfig: {
        limit: 10,
        limitSize: 50048576,
        // listType: 'picture-card',
        readOnly: false,
        xtype: 'test',
        accept: '.xlsx,.xls',
        acceptMsg: '只能传xls/xlsx格式文件'
      },
      uploadDialogVisible: false, // 明细表上传框
      uploadDialogConfig: { // 明细表上传时对应的列和行
        column: null,
        row: null // 当前操作列
      },

      excelData: [],
      excelModal: null
    }
  },
  props: {
    config: {
      type: Object,
      default: function () {
        return {}
      }
    },
    mainData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    readOnly: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  computed: {
    ...mapGetters([
      'getFormConfig'
    ]),
    dicValue () { // 数据字典label
      return function (column, value) {
        // console.info(column)
        // console.info(JSON.stringify(column))
        if (column) {
          // console.info('---column.columnName---'+column.columnName+'-------'+this.dicMap[column.columnName]+'-------'+value)

          if (this.config.dicMap[column.columnName]) {
            // console.info('---dicMap[column.columnName]---'+JSON.stringify(this.dicMap[column.columnName]))
            // console.info(value+'-------'+this.dicMap[column.columnName][value+''])
            if (column.multiple === 1 && value) {
              if (typeof value === 'string') {
                value = value.split(',')
              }
              let str = ''
              value.forEach(item => {
                str += this.config.dicMap[column.columnName][item] + ','
              })
              if (str) {
                return str.slice(0, str.length - 1)
              }
            } else {
              return this.config.dicMap[column.columnName][value]
            }
          }
        }
        return value || ''
      }
    },
    formatDate () {
      return function (column, value) {
        let format = 'yyyy-MM-dd'
        if (column.widgetType === 'select-time') {
          format = 'HH:mm:ss'
        } else if (column.widgetType === 'select-date-time') {
          format = 'yyyy-MM-dd hh:mm:ss'
        }
        // console.log('-----formatDate-------',value,typeof value, format)
        if (typeof value === 'number') {
          let date = new Date(value)
          return date.format(format)
        } else if (typeof value === 'string') {
          if (value.indexOf('T') > -1) {
            return value.substring(0, 10)
          } else {
            try {
              if (value.indexOf(':') > -1) {
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
        }
      }
    },
    formColumnReadOnly () {
      return function (column) {
        // 优先判断流程
        if (column.status) {
          if (column.btnEdit == 0) {
            return true
          } else {
            return false
          }
        }
        // 过滤权限
        if (this.readOnly || column.btnEdit == 0) {
          return true
        }
        // if (this.readOnly) {
        //   return true
        // }
        return column.readOnly == undefined ? false : column.readOnly === 1
      }
    },
    computeSelectFormValue () {
      return function (column, row) {
        return row[column.columnName + 'LABEL_'] ? row[column.columnName + 'LABEL_'] : row[column.columnName]
      }
    },
    computeOperateButtonOnly () {
      return function (button) {
        if (this.readOnly) {
          return true
        }
        if (button === 'topNew') {
          return this.showTopNewButton
        } else if (button === 'topDelete') {
          return this.showTopDeleteButton
        } else if (button === 'cellNew') {
          return this.showCellNewButton
        } else if (button === 'cellDelete') {
          return this.showCellDeleteButton
        }
        return false
      }
    }
  },
  watch: {
    // dicMap: {
    //   handler: function (val, oldval) {
    //     // console.log('------dicMap--------')
    //     // console.info(JSON.stringify(val))
    //   },
    //   deep: true// 对象内部的属性监听，也叫深度监听
    // }
    /* 'config.tableData' :{
        handler: function (val, oldval) {
          console.log('------tableData--------',val, oldval)
          // console.info(JSON.stringify(val))
        },
        deep: true// 对象内部的属性监听，也叫深度监听
    },
    showSummary:{
      handler: function (val, oldval) {
        console.log('------showSummary--------',val, oldval)
      },
      deep: true
    } */
  },
  created () {

  },
  mounted () {
    this.selectTableIndex = -1
    this.selectTableRow = null
    this.selectFormKey = ''
    this.selectFormVisible = false
    this.selectFormConfig = {}
    this.showSummary = false
    this.summaryColumns = {}
    this.expression = {}
    this.summaryData = {}
    this.config.dicMap = {}
    this.columnsMap = {}
    this.init()
    // 判断是否是选择弹框，而且是单页面
  },
  methods: {
    ...mapMutations([
      'setFormConfig'
    ]),
    init () {
      /* if (this.readOnly) {
        this.showTopNewButton = false
        this.showTopDeleteButton = false
        this.showCellNewButton = false
        this.showCellDeleteButton = false
      } */
      // console.log('---------init------'+this.showSummary)
      this.showTopNewButton = true
      this.showTopDeleteButton = true
      this.showCellNewButton = true
      this.showCellDeleteButton = true
      let _this = this
      let columns = []
      let topBar = []
      let summaryColumns = null
      let expression = {}
      let ifNewBtn = false
      let ifDeleteBtn = false
      let wfFormAuth = this.config.wfFormAuth // 流程权限
      let ifCopy = this.config.ifCopy
      // 判断是否树表
      if (this.validUtil.isNotNull(this.config.rootId)) {
        this.isTree = true
        this.config.isTree = true
      } else {
        this.isTree = false
        this.config.isTree = false
      }
      if (this.config.queryColumns) {
        let queryColumns = JSON.parse(JSON.stringify(this.config.queryColumns))
        queryColumns.forEach(column => {
          this.columnsMap[column.columnName] = column

          // 根据流程过程权限重新计算表单字段
          if (wfFormAuth && wfFormAuth[column.columnName]) {
            let status = wfFormAuth[column.columnName]
            // 1,可编辑;2,只读;3,隐藏;4,显示'
            if (status === 1 && !ifCopy) {
              column.status = status
              column.btnEdit = 1
              column.btnLook = 1
              column.hidden = 0
              column.readOnly = 0
            } else if (status === 2 && !ifCopy) {
              column.status = status
              column.btnEdit = 0
              column.btnLook = 1
              column.hidden = 0
              column.readOnly = 1
            } else if (status === 3) {
              column.status = status
              column.btnEdit = 0
              column.btnLook = 0
              column.hidden = 1
              column.readOnly = 1
            }
          }
          // console.log(column.columnName+'----------', column.btnEdit,column)
          if (column.javaType === 'TopButton') {
            if (column.columnName && column.columnName === 'new') {
              if (column.hidden && column.hidden === 1) {
                this.showTopNewButton = false
              }
            } else if (column.columnName && column.columnName === 'delete') {
              if (column.hidden && column.hidden === 1) {
                this.showTopDeleteButton = false
              }
            } else {
              topBar.push(column)
            }
          } else if (column.javaType === 'CellButton') {
            if (column.columnName && column.columnName === 'new') {
              if (column.hidden && column.hidden === 1) {
                this.showCellNewButton = false
              }
            } else if (column.columnName && column.columnName === 'delete') {
              if (column.hidden && column.hidden === 1) {
                this.showCellDeleteButton = false
              }
            } else {
              columns.push(column)
            }
          } else {
            if (column.widgetType === 'select') {
              let attr = column.attr
              column['options'] = []
              if (attr && attr.indexOf(',') > -1) {
                _this.config.dicMap[column.columnName] = {}
                // 说明是直接写死类型
                let data = []
                let options = attr.split(';')
                options.forEach(item => {
                  let option = item.split(',')
                  _this.config.dicMap[column.columnName][option[0]] = option[1]
                  // 存入键值对
                  data.push({name: option[1], value: option[0]})
                })
                column.options = data
              }
            } else if (column.widgetType === 'select-dic') {
              let attr = column.attr
              column['options'] = []
              _this.$set(_this.config.dicMap, column.columnName, {})
              // 加载数据字典
              if (_this.validUtil.isNotNull(attr)) {
                getDicData(attr).then(data => {
                  // _this.dicMap[column.columnName] = {};
                  data.forEach(item => {
                    _this.config.dicMap[column.columnName][item.value] = item['name']
                  })
                  column.options = data
                  // console.info(column.columnName + '-----加载完成----' + JSON.stringify(column.options))
                  // _this.$set(_this.dicMap, column.columnName, _this.dicMap[column.columnName]);
                  // console.info('-----加载完成----'+JSON.stringify(_this.dicMap))
                  // this.$forceUpdate()
                  // _this.$refs['jr-table'].doLayout();
                })
              }
            } else if (column.widgetType === 'select-sql') {
              let attr = column.attr
              // 添加全局项目属性
              let params = null
              _this.$set(_this.config.dicMap, column.columnName, {})
              if (window.localStorage.getItem('_session_proj' + this.sessionUtil.getUser().id)) {
                params = JSON.parse(window.localStorage.getItem('_session_proj' + this.sessionUtil.getUser().id))
              } else if (this.getFormConfig['_session_proj' + this.sessionUtil.getUser().id]) {
                params = this.getFormConfig['_session_proj' + this.sessionUtil.getUser().id].data
                // console.log('------mainData-------', mainData, sessionProj)
              }
              if (params) {
                params = {
                  'session-proj-code': params.PROJ_CODE_,
                  'session-proj-id': params.PROJ_ID_,
                  'session-proj-name': params.PROJ_NAME_,
                  'session-proj-uid': params.PROJ_UID_
                }
              }
              console.log(params)
              // 加载数据字典
              if (_this.validUtil.isNotNull(attr)) {
                getSqlDicData({formKey: this.formKey, columnId: column.id, params: params}).then(data => {
                  if (column.javaType === 'Integer') {
                    let newData = []
                    data.forEach(item => {
                      newData.push({
                        value: parseInt(item.value),
                        name: item.name
                      })
                    })
                    column.options = newData
                  } else {
                    column.options = data
                  }
                  data.forEach(item => {
                    _this.config.dicMap[column.columnName][item.value] = item['name']
                  })
                  // console.info(column.options)
                  this.$forceUpdate()
                })
              }
            }
            if (column.summary) {
              if (summaryColumns === null) {
                summaryColumns = {}
              }
              summaryColumns[column.columnName] = column
            }
            if (column.expression) {
              // 判断哪些字段会影响这个计算
              // _this.config.queryColumns.forEach(item => {
              //
              // })
              // 解析变量
              // for(var m = 0;m<column.expression;m++){
              //
              // }
              let keys = column.expression.match(/[A-Za-z][A-Za-z0-9_]*_/gi)
              // 去重
              let arr = []
              for (var i = 0; i < keys.length; i++) {    // 循环遍历当前数组
              // 判断当前数组下标为i的元素是否已经保存到临时数组
              // 如果已保存，则跳过，否则将此元素保存到临时数组中
                if (arr.indexOf(keys[i]) == -1) {
                  arr.push(keys[i])
                }
              }
              keys = arr
              if (keys) {
                keys.forEach(key => {
                  if (expression[key] === undefined) {
                    expression[key] = {}
                  }
                  expression[key][column.columnName] = {
                    expression: column.expression,
                    keys: keys
                  }
                })
              }
              // expression[column.columnName] = column.expression
            }
            // console.log(column.openUrl,column)
            columns.push(column)
          }
        })
        // console.info('----------------')
        if (this.config.formExcelList && this.config.formExcelList.length > 0) {
          topBar.push({
            icon: 'el-icon-download',
            title: '导入',
            widgetType: 'import',
            data: this.config.formExcelList
          })
        }
        if (summaryColumns !== null) {
          _this.summaryColumns = summaryColumns
          this.showSummary = true
          this.$forceUpdate()
        }
        // 过滤权限
        columns = columns.filter((item, index) => {
          return item.btnLook == 1
        })
        /* this.columns = JSON.parse(JSON.stringify(columns))
        columns = this.handMoreColumns(JSON.parse(JSON.stringify(columns))) */
        this.columns = columns
        columns = this.handMoreColumns(columns)

        this.expression = expression
        this.moreColumns = columns
        this.topBar = topBar
        this.$forceUpdate()
      }
    },
    // 选人点击事件
    selectMember (column, row, index) {
      this.selectTableRow = row
      this.selectTableIndex = index
      this.selectMemberModels.isShow = true
      this.selectMemberModels.form = column
      this.selectMemberModels.radioSelectFlags = (column.widgetType === 'select-user')
    },
    // 选人回调函数
    memberCallBack () {
      this.selectMemberModels.isShow = false
      var vm = this
      let tableData = this.config.tableData
      if (this.selectTableIndex > -1) {
        // 把第一行数据赋值给数组
        let row = tableData[this.selectTableIndex]
        this.columns.forEach(e => {
          if (e.columnName === this.selectMemberModels.form.columnName) {
            if (this.selectMemberModels.form.widgetType === 'select-user') {
              if (this.selectMemberModels.selectList.length > 0) {
                vm.$set(this.config.tableData[this.selectTableIndex], e.columnName + 'LABEL_', this.selectMemberModels.selectList[0].userName)
                vm.$set(this.config.tableData[this.selectTableIndex], e.columnName, this.selectMemberModels.selectList[0].id)
                // 如果不关联
                if (this.selectMemberModels.form.ifNotRelated == 1) {
                  vm.$set(this.config.tableData[this.selectTableIndex], e.columnName, this.selectMemberModels.selectList[0].userName)
                  vm.$set(this.config.tableData[this.selectTableIndex], e.columnName + 'LABEL_', this.selectMemberModels.selectList[0].userName)
                }
                // 如果是ID_或者UID_结束 给NAME_后缀插入中文
                if (e.columnName.lastIndexOf('UID_') > -1) {
                  let name = e.columnName.split('UID_')
                  vm.$set(this.config.tableData[this.selectTableIndex], name[0] + 'NAME_', this.selectMemberModels.selectList[0].userName)
                }
                if (e.columnName.lastIndexOf('ID_') > -1) {
                  let name = e.columnName.split('ID_')
                  vm.$set(this.config.tableData[this.selectTableIndex], name[0] + 'NAME_', this.selectMemberModels.selectList[0].userName)
                }
                // 如果是NAME_结束 给ID_后缀插入中文
                if (e.columnName.lastIndexOf('NAME_') > -1) {
                  let name = e.columnName.split('NAME_')
                  vm.$set(this.config.tableData[this.selectTableIndex], e.columnName, this.selectMemberModels.selectList[0].userName)
                  vm.$set(this.config.tableData[this.selectTableIndex], name[0] + 'ID_', this.selectMemberModels.selectList[0].id)
                  vm.$set(this.config.tableData[this.selectTableIndex], name[0] + 'UID_', this.selectMemberModels.selectList[0].id)
                }
              } else {
                vm.$set(this.config.tableData[this.selectTableIndex], e.columnName + 'LABEL_', '')
                vm.$set(this.config.tableData[this.selectTableIndex], e.columnName, '')
              }
            } else if (this.selectMemberModels.form.widgetType === 'select-user-multi') {
              // eslint-disable-next-line no-unused-vars
              var labels = ''; var ids = ''
              this.selectMemberModels.selectList.forEach(element => {
                labels += element.userName + ','
                ids += element.id + ','
              })
              labels = labels.substring(0, labels.length - 1)
              ids = ids.substring(0, ids.length - 1)
              vm.$set(this.config.tableData[this.selectTableIndex], e.columnName + 'LABEL_', labels)
              vm.$set(this.config.tableData[this.selectTableIndex], e.columnName, ids)
              // 如果不关联
              if (this.selectMemberModels.form.ifNotRelated == 1) {
                vm.$set(this.config.tableData[this.selectTableIndex], e.columnName, labels)
                vm.$set(this.config.tableData[this.selectTableIndex], e.columnName + 'LABEL_', labels)
              }
              // 判断字段是否为ID_或UID_结尾 是则给NAME_也赋值
              if (e.columnName.lastIndexOf('UID_') > -1) {
                let name = e.columnName.split('UID_')
                vm.$set(this.config.tableData[this.selectTableIndex], name[0] + 'NAME_', labels)
              }
              if (e.columnName.lastIndexOf('ID_') > -1) {
                let name = e.columnName.split('ID_')
                vm.$set(this.config.tableData[this.selectTableIndex], name[0] + 'NAME_', labels)
              }
              // 如果是NAME_结束 给ID_后缀插入中文
              if (e.columnName.lastIndexOf('NAME_') > -1) {
                let name = e.columnName.split('NAME_')
                vm.$set(this.config.tableData[this.selectTableIndex], e.columnName, labels)
                vm.$set(this.config.tableData[this.selectTableIndex], name[0] + 'ID_', ids)
                vm.$set(this.config.tableData[this.selectTableIndex], name[0] + 'UID_', ids)
              }
            } else if (this.selectMemberModels.form.widgetType === 'select-user-list') {
              var value = []
              let attr = this.selectMemberModels.form.attr
              let str = ''
              this.selectMemberModels.selectList.forEach(item => {
                if (attr && attr.indexOf(',') > -1) {
                  // 说明是直接写死类型
                  let options = attr.split(';')
                  options.forEach(item => {
                    let option = item.split(',')
                    // 存入键值对
                    if (item[option[1]]) {
                      item[option[0]] = item[option[1]]
                    }
                  })
                } else {
                  item.USER_NAME_ = item.userName
                  item.USER_UID_ = item.id
                  item.PICTURE_ = item.picture
                }
                if (str) {
                  str += ','
                }
                str += item.USER_NAME_
                value.push(item)
              })
              vm.$set(this.config.tableData[this.selectTableIndex], e.columnName + 'LABEL_', str)
              vm.$set(this.config.tableData[this.selectTableIndex], e.columnName, value)
            }
          }
        })
      }
    },
    // 选部门点击事件
    selectQuerters (column, row, index) {
      this.selectTableRow = row
      this.selectTableIndex = index
      this.selectQuertersModels.isShow = true
      this.selectQuertersModels.form = column
      this.selectQuertersModels.radioSelectFlags = (column.widgetType === 'select-depart')
    },
    // 选部门回调函数
    quertersCallBack () {
      if (this.selectQuertersModels.selectList.length === 0) {
        this.util.warn('请至少选择一个部门！')
        return false
      }
      this.selectQuerters.isShow = false
      var vm = this
      if (this.selectTableIndex > -1) {
        this.columns.forEach(e => {
          if (e.columnName === this.selectQuertersModels.form.columnName) {
            if (this.selectQuertersModels.form.widgetType === 'select-depart') {
              vm.$set(this.config.tableData[this.selectTableIndex], e.columnName + 'LABEL_', this.selectQuertersModels.selectList[0].label)
              vm.$set(this.config.tableData[this.selectTableIndex], e.columnName, this.selectQuertersModels.selectList[0].id)
              if (e.columnName.lastIndexOf('UID_') > -1) {
                let name = e.columnName.split('UID_')
                vm.$set(this.config.tableData[this.selectTableIndex], name[0] + 'NAME_', this.selectQuertersModels.selectList[0].label)
              }
              if (e.columnName.lastIndexOf('ID_') > -1) {
                let name = e.columnName.split('ID_')
                vm.$set(this.config.tableData[this.selectTableIndex], name[0] + 'NAME_', this.selectQuertersModels.selectList[0].label)
              }
            } else if (this.selectQuertersModels.form.widgetType === 'select-depart-multi') {
              // eslint-disable-next-line no-unused-vars
              var labels = ''; var ids = ''
              this.selectQuertersModels.selectList.forEach(element => {
                labels += element.label + ','
                ids += element.id + ','
              })
              vm.$set(this.config.tableData[this.selectTableIndex], e.columnName + 'LABEL_', labels.substring(0, labels.length - 1))
              vm.$set(this.config.tableData[this.selectTableIndex], e.columnName, ids.substring(0, ids.length - 1))

              if (e.columnName.lastIndexOf('UID_') > -1) {
                let name = e.columnName.split('UID_')
                vm.$set(this.config.tableData[this.selectTableIndex], name[0] + 'NAME_', labels.substring(0, labels.length - 1))
              }
              if (e.columnName.lastIndexOf('ID_') > -1) {
                let name = e.columnName.split('ID_')
                vm.$set(this.config.tableData[this.selectTableIndex], name[0] + 'NAME_', labels.substring(0, labels.length - 1))
              }
            }
          }
        })
      }
    },
    // 处理生成多表头格式
    handMoreColumns (fields) {
      // 处理多表头
      let fieldsmap = []
      // 遍历所有字段组织多表头的数据位
      for (let i = 0; i < fields.length; i++) {
        let title = fields[i].title
        // System.out.println("1===" + title + "==");
        if (title.indexOf('-') > -1) {
          let titles = title.split('-')
          let length = titles.length
          let j = length
          if (fieldsmap.find(event => { return event.title === titles[0] })) {
            let temp = fieldsmap.find(event => { return event.title === titles[0] })
            let k = 1
            for (k = 1; k < length - 1; k++) {
              if (temp.children.find(event => { return event.title === titles[k] })) {
                temp = temp.children.find(event => { return event.title === titles[k] })
              } else {
                for (let m = k; m < length - 1; m++) {
                  if (!temp.children) {
                    temp.children = []
                  }
                  temp.children.push({title: titles[m], children: [] })
                  temp = temp.find(event => { return event.title === titles[m] })
                }
                break
              }
            }
            if (!temp.children) {
              temp.children = []
            }
            fields[i].title = titles[length - 1]
            temp.children.push(fields[i])
          } else {
            fieldsmap.push({title: titles[0], children: [] })
            let temp = fieldsmap.find(event => { return event.title === titles[0] })
            for (let k = 1; k < length - 1; k++) {
              if (!temp.children) {
                temp.children = []
              }
              temp.children.push({title: titles[k], children: [] })
              temp = temp.children.find(event => { return event.title === titles[k] })
            }
            if (!temp.children) {
              temp.children = []
            }
            fields[i].title = titles[length - 1]
            temp.children.push(fields[i])
          }
        } else {
          fieldsmap.push(fields[i])
        }
      }
      return fieldsmap
    },
    getTableData (params) { // 加载明细表数据
      if (this.config.isTree) {
        return getTreeData(params, this)
      } else {
        return getGridData(params, this)
      }
    },
    loadData (businessKey) { // 初始化数据
      // console.info(this.config)
      // console.info(this.config.title+'----loadData---businessKey------'+businessKey)
      // console.log(businessKey)
      if (this.validUtil.isNotNull(businessKey)) {
        let _this = this
        let config = this.config
        // console.info(config)
        // 判断是否搜索,然后拼接搜索
        let params = {
          'formKey': config.formKey,
          'formId': config.formId,
          'subForm': true,
          'id': config.id,
          'businessKey': businessKey,
          'tableName': config.tableName
        }
        let vm = this
        // 先判断是否有修改初始化
        let event = this.getEditRenderApi()
        if (event && event != null) {
          this.loadDataByEvent(event, businessKey)
        } else {
          this.ifFormEditRender = true
          // console.log('--------isTree-------'+this.config.isTree)
          this.loading = true
          this.getTableData(params).then(res => {
            if (this.config.isTree) {
              res = {
                data: res
              }
            }
            // console.info('--------getTableData-------',res,res.data)
            if (res.data && res.data.length > 0) {
              // console.log('--------start-------'+new Date())
              // 递归组装初始化数据
              _this.deepRenderData(res.data)
              // console.log('--------end-------'+new Date())

              _this.config.tableData = res.data
              _this.$forceUpdate()
            } else {
              // 如果原本没有数据，则判断是否有初始化事件
              let event = _this.getRenderApi()
              // console.log(event)
              if (event && event != null) {
                _this.loadDataByEvent(event, businessKey)
              } else {
                if (!this.config.tableData || this.config.tableData.length === 0) {
                  this.addRow()
                }
              }
            }
            this.loading = false
          })
        }
      } else {
        // 判断是否绑定事件有初始化
        let event = this.getRenderApi()
        if (event && event != null) {
          this.loadDataByEvent(event, businessKey)
        } else {
          if (!this.config.tableData || this.config.tableData.length === 0) {
            /* let data = [{
              id: "1",
              parentId: "root",
              children: [{
                id: "1-1",
                CODE_: '1-1',
                parentId: "1",
                children: []
              }],
              CODE_: '1'
            }]
            this.config.tableData = data
            console.log('-----------loadData----------', data, this.config.tableData)
            this.$forceUpdate(); */
            // this.addRow()
          }
        }
      }
    },
    loadDataByEvent (event, businessKey) { // 通过注册事件执行加载数据
      this.loading = true
      let _this = this
      let mainData = this.config.parent.getData().mainFormDataMap
      // console.info(mainData)

      let queryParams = []
      // 组装参数
      for (let key in mainData) {
        queryParams.push({key: key, value: mainData[key]})
      }

      let config = this.config
      // console.info(config)
      // 判断是否搜索,然后拼接搜索
      let params = {
        apiId: event.apiId,
        'formKey': config.formKey,
        'formId': config.formId,
        'subForm': true,
        'id': config.id,
        'businessKey': businessKey,
        'tableName': config.tableName,
        queryParams: queryParams
      }
      // console.info(event)
      // console.info('0000'+event['runtype'])
      if (API_RUN_TYPE.isInterface(event.apiConfig['runtype'])) {
        params._url = event['runsql']
      }
      this.getTableData(params).then(res => {
        if (!res) {
          this.loading = false
          _this.config.tableData = []
          _this.$forceUpdate()
          return
        }
        // console.log('---------getTableData-----------',res)
        if (!res.status) {
          res = {
            data: res
          }
        }

        if (res.data && res.data.length > 0) {
          // 判断是否需要重置id
          if (event.resetId) {
            _this.deepPackTreeData(res.data, _this.config.rootId)
          } else {
            // 递归组装初始化数据
            _this.deepRenderData(res.data)
          }
          // console.log('---------loadDataByEvent-----------',res.data)
          _this.config.tableData = res.data
          _this.$forceUpdate()
        }
        this.loading = false
      })
    },
    deepRenderData (data) { // loadData之后递归初始化树表数据, resetId表示是否重新替换id,和parentId
      // console.log('-------deepRenderData--------',data)
      let vm = this
      data.forEach(item => {
        // console.log('---deepRenderData--forEach----1---',item)
        vm.columns.forEach(column => {
          // console.log('---deepRenderData--forEach---2----',column.columnName)
          item[column.columnName + 'isShow'] = false
          if (item[column.columnName] === undefined) {
            item[column.columnName] = undefined
          }
          if (column.widgetType && column.widgetType === 'select-form') {
            if (item[column.columnName + 'LABEL_'] === undefined) {
              item[column.columnName + 'LABEL_'] = item[column.columnName]
            }
          }
          if (column.multiple == 1 && (column.widgetType == 'select' || column.widgetType == 'select-dic' || column.widgetType == 'select-sql')) {
            if (item[column.columnName]) {
              item[column.columnName] = item[column.columnName].split(',')
            } else {
              item[column.columnName] = null
            }
          }
          if (this.config.isTree) {
            if (!item['children']) {
              item['children'] = []
            }
            // 递归初始化下级
            this.deepRenderData(item['children'])
          }

          this._handlerChangeValue('', column, item, 0, true)
        })
      })
    },
    getRenderApi () {
      // console.info(this.config)
      if (this.config.events) {
        let events = this.config.events.find(event => {
          // console.info(event)
          return parseInt(event.type) === EVENT_TYPE.NEW_REDNER
        })
        return events
      }
      return null
    },
    getEditRenderApi () { // 编辑初始化
      // console.info(this.config)
      // console.log('------getEditRenderApi-------', this.config.events)
      if (this.config.events) {
        let events = this.config.events.find(event => {
          // console.info(event)
          return parseInt(event.type) === EVENT_TYPE.EDIT_REDNER
        })
        return events
      }
      return null
    },
    handlerSelectionChange (selection) { // 获取复选框选中事件
      this.selection = selection
    },
    handlerCurrentChange (currentRow, oldCurrentRow) { // 当表格的当前行切换时触发
      this.currentRow = currentRow
      // console.log('------handlerCurrentChange-------', this.currentRow)
    },
    removeRow () { // 根据复选框删除
      if (this.selection.length === 0) {
        this.util.warn('请选择一行数据')
        return
      }
      if (this.config.isTree) {
        // 树表删除做法
        this.selection.forEach(node => {
          let parentNode = node ? this.getParentNode(this.config.tableData, node['parentId']) : undefined
          if (parentNode) {
            parentNode.children = parentNode.children.filter(item => {
              let flag = true
              if (item.id === node.id) {
                for (let summaryColumnName in this.summaryColumns) {
                  let column = this.summaryColumns[summaryColumnName]
                  console.log(summaryColumnName + '----------', column, node)
                  if (column) {
                    // 递归向上计算,而且因为是删除，所以值为0
                    node[column.columnName] = 0
                    this.deepUpSummary(column, node)
                  }
                }
                flag = false
              }
              return flag
            })
          } else {
            // 说明父亲是根节点
            this.config.tableData = this.config.tableData.filter(item => {
              let flag = true
              if (item.id === node.id) {
                flag = false
              }
              return flag
            })
          }
          // console.log('-------removeRow-------', node, parentNode,this.config.tableData)
        })
      } else {
        this.config.tableData = this.config.tableData.filter(item => {
          let flag = true
          if (this.selection.indexOf(item) > -1) {
            flag = false
          }
          return flag
        })
      }
      // console.info(this.config.tableData)
      this.$forceUpdate()
    },
    deleteRow (index, row, rows) {
      if (row && this.validUtil.isNotNull(row['PROC_STATUS_'])) {
        this.util.warn('该数据已提交，无法删除!')
        return
      }
      // 移除一行
      if (this.config.tableData.length > 0) {
        //   console.log("before", JSON.stringify(this.tableData));
        this.config.tableData.splice(index, 1) // 删掉该行
        //   console.log("afters", JSON.stringify(this.tableData));
      }
      // 解决删除主表不触发改变bug
      this.handlerChangeValue('', null, row, index, true)
    },
    getConstValue (key) { // 根据key获取常量值
      // console.info(column)
      if (key === 'current-user-uid' || key === '当前用户主键') {
        return this.sessionUtil.getUserUid()
      } else if (key === 'current-user-id' || key === '当前用户编码') {
        return this.sessionUtil.getUserId()
      } else if (key === 'current-user-name' || key === '当前用户名称') {
        return this.sessionUtil.getUserName()
      } else if (key === 'current-depart-uid' || key === '当前部门主键') {
        return this.sessionUtil.getDepartUid()
      } else if (key === 'current-depart-id' || key === '当前部门编码') {
        return this.sessionUtil.getDepartId()
      } else if (key === 'current-depart-name' || key === '当前部门名称') {
        return this.sessionUtil.getDepartName()
      } else if (key === 'current-company-uid' || key === '当前组织主键') {
        return this.sessionUtil.getDepartUid()
      } else if (key === 'current-company-id' || key === '当前组织编码') {
        return this.sessionUtil.getDepartId()
      } else if (key === 'current-company-name' || key === '当前组织名称') {
        return this.sessionUtil.getDepartName()
      } else if (key === 'current-date' || key === '当前日期') {
        return (new Date()).format('yyyy-MM-dd')
        // mainData[column.columnName] = new Date()
      } else if (key === 'current-datetime' || key === '当前日期时间') {
        return new Date()
        // mainData[column.columnName] = (new Date()).format("yyyy-MM-dd hh:mm:ss")
      } else if (key === 'current-year' || key === '当前年' || key === '本月') {
        return new Date().getFullYear()
      } else if (key === 'current-month' || key === '当前月' || key === '本月') {
        return new Date().getMonth() + 1
      } else if (key === 'current-week' || key === '当前周' || key === '本周') {
        return this.util.getYearWeek()
      } else if (key === 'current-next-monday' || key === '下周一') { // 下周一
        return this.util.getNextMonday()
      } else if (key === 'current-month-first' || key === '本月第一天') { // 本月第一天
        return this.util.getCurrentMonthFirst()
      } else if (key === 'current-month-last' || key === '本月最后一天') { // 本月最后一天
        return this.util.getCurrentMonthLast()
      } else if (key === 'next-month-first' || key === '下月第一天') { // 下月第一天
        return this.util.getNextMonthFirst()
      } else if (key === 'next-month-last' || key === '下月最后一天') { // 下月最后一天
        return this.util.getNextMonthLast()
      } else {
        let sessionProj = null
        if (window.localStorage.getItem('_session_proj' + this.sessionUtil.getUser().id)) {
          sessionProj = JSON.parse(window.localStorage.getItem('_session_proj' + this.sessionUtil.getUser().id))
        } else if (this.getFormConfig['_session_proj' + this.sessionUtil.getUser().id]) {
          sessionProj = this.getFormConfig['_session_proj' + this.sessionUtil.getUser().id].data
          // console.log('------mainData-------', mainData, sessionProj)
        }
        if (sessionProj) {
          sessionProj = {
            'session-proj-code': sessionProj.PROJ_CODE_,
            'session-proj-id': sessionProj.PROJ_ID_,
            'session-proj-name': sessionProj.PROJ_NAME_,
            'session-proj-uid': sessionProj.PROJ_UID_
          }
          for (const edit in sessionProj) {
            if (key.indexOf(edit) > -1) {
              key = key.replace(new RegExp('{' + edit + '}', 'gm'), sessionProj[edit])
            }
          }
        }
        return key
      }
    },
    addRow (index, data, event) {
      if (this.isTree) {
        this.addNode()
        return
      }
      // console.info('--------')
      // 新增一行
      var vm = this
      var cellObj = {CODE_: ''}
      vm.columns.forEach(column => {
        cellObj[column.columnName + 'isShow'] = false
        cellObj[column.columnName] = undefined
        // 判断是否是固定常量
        if (column.sourceType === 'const') {
          cellObj[column.columnName] = column.sourceAttr
        } else if (column.sourceType === 'sys-conf') { // 判断如果是系统常量
          cellObj[column.columnName] = this.getConstValue(column.sourceAttr)
        }
        if (column.widgetType && column.widgetType === 'select-form') {
          if (cellObj[column.columnName + 'LABEL_'] === undefined) {
            cellObj[column.columnName + 'LABEL_'] = cellObj[column.columnName]
          }
        }
      })
      // this.tableKey.forEach(function(obj) {
      //   vm.$set(cellObj, obj.value, "");
      // });
      if (vm.config.tableData === undefined) {
        vm.config.tableData = []
      }
      if (index != undefined) {
        vm.config.tableData.splice(index, 0, cellObj)
      } else {
        vm.config.tableData.push(cellObj)
      }
    },
    getParentNode (data, parentId) { // 递归父节点
      if (data) {
        for (let i = 0; i < data.length; i++) {
          let item = data[i]
          if (item['id'] === parentId) {
            return item
          }
          if (item['children']) {
            let node = this.getParentNode(item['children'], parentId)
            if (node) {
              return node
            }
          }
        }
      }
      return undefined
    },
    addNode (index) { // 如果是树，同级新增
      // 查找上级
      let currentRow = this.getCurrentRow()
      let parentNode = currentRow ? this.getParentNode(this.config.tableData, currentRow['parentId']) : undefined
      console.log('---------addNode-------', currentRow, parentNode)
      if (!parentNode) {
        parentNode = {
          id: this.config.rootId,
          ID_: this.config.rootId,
          children: this.config.tableData
        }
      }
      var vm = this
      var cellObj = {id: getUUID(), CODE_: '', parentId: parentNode['id'], children: []}
      vm.columns.forEach(column => {
        cellObj[column.columnName + 'isShow'] = false
        cellObj[column.columnName] = undefined
        if (column.widgetType && column.widgetType === 'select-form') {
          if (cellObj[column.columnName + 'LABEL_'] === undefined) {
            cellObj[column.columnName + 'LABEL_'] = cellObj[column.columnName]
          }
        }
      })
      if (!parentNode.children) {
        parentNode.children = []
      }
      // parentNode['hasChildren'] = true
      parentNode.children.push(cellObj)
      this.$forceUpdate()
      console.log('---addNode----', parentNode, this.config.tableData, JSON.stringify(this.config.tableData))
    },
    addChildNode () { // 如果是树，下级新增
      let parentNode = this.getCurrentRow()
      if (!parentNode) {
        parentNode = {
          id: this.config.rootId,
          ID_: this.config.rootId,
          children: this.config.tableData
        }
      }

      var vm = this
      var cellObj = {id: getUUID(), CODE_: '', parentId: parentNode['id'], children: []}
      vm.columns.forEach(column => {
        cellObj[column.columnName + 'isShow'] = false
        cellObj[column.columnName] = undefined
        if (column.widgetType && column.widgetType === 'select-form') {
          if (cellObj[column.columnName + 'LABEL_'] === undefined) {
            cellObj[column.columnName + 'LABEL_'] = cellObj[column.columnName]
          }
        }
      })

      if (!parentNode.children) {
        parentNode.children = []
      }
      // parentNode['hasChildren'] = true
      parentNode.children.push(cellObj)
      console.log('---addChildNode----', parentNode, this.config.tableData, JSON.stringify(this.config.tableData))
      this.$forceUpdate()
    },
    getCurrentRow () { // 获取当前选中行
      return this.currentRow
    },
    dblClick (row, column, index) {
      // 如果是附件选择框则不做任何操作
      if (column.widgetType && column.widgetType === 'file') {
        return
      }
      if (column.openUrl && column.openParams) {
        this.handleRowButtonClick(column, index, row)
      }

      // 优先判断流程权限
      if (column.status && column.btnEdit) {

      } else {
        if (this.readOnly || column.readOnly || this.validUtil.isNotNull(row['PROC_STATUS_'])) {
          return
        }
      }

      // console.info('-----dblClick------')
      this.$set(row, column.columnName + 'isShow', true)
      // row[column.columnName + 'isShow'] = true
      if (!column.widgetType || (column.widgetType && column.widgetType != 'date')) {
        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs[column.columnName + index][0].focus()
          })
        }, 100)
      }
      // this.addRow();
      // this.deleteRow(this.tableData.length - 1, this.tableData);
    },
    handlerTopBarClick (button) { // topBar单击触发
      if (button.widgetType === 'select-form') {
        this.queryParams = this.config.parent.getData().mainFormDataMap
        this.selectFormKey = button.attr
        this.selectTableRow = null
        this.selectTableIndex = -1
        this.selectFormColumn = null
        // let formConfig = {}
        // getConfig(this.selectFormKey, this).then(data => {
        //   for (var key in data) {
        //     formConfig[key] = data[key]
        //   }
        //   if (formConfig) {
        //     this.selectFormTitle = formConfig.title
        //     // console.info('------this.selectFormTitle-------'+this.selectFormTitle)
        //   }
        // })
        this.openDialogWidth = button.openWidth ? button.openWidth : 900
        this.openDialogHeight = button.openHeight ? button.openHeight : 600
        this.selectFormConfig = {}
        this.selectFormSingleSelect = false
        this.selectFormVisible = true
      } else if (button.widgetType === 'import') {
        this.selectExcelVisible = true
        this.excelList = button.data
      } else if (button.widgetType === 'top-button') {
        this.handleRowButtonClick(button)
      }
    },
    handleBeforeUpload (file) {
      this.readFile(file)
    },
    // 读取文件
    readFile (file) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadstart = e => {
        this.uploadLoading = true
        this.tableLoading = true
        this.showProgress = true
      }
      reader.onprogress = e => {
        this.progressPercent = Math.round(e.loaded / e.total * 100)
      }
      reader.onerror = e => {
        this.util.error('文件读取出错')
      }
      reader.onload = e => {
        this.util.success('文件读取成功')
        const data = e.target.result
        try {
          const { header, results } = excel.read(data, 'array')[0]
          this.excelData = results
        } catch (e) {
          this.excelData = []
          this.util.error('文件读取出错')
        }
        this.uploadLoading = false
      }
    },
    handleUploadFile () {
      this.file = null
    },
    downloadExecl (edit) {
      this.excelModal = edit
    },
    // 选择导入文件确认事件
    selectExcel () {
      let modal = {}
      if (this.excelModal) {
        modal = this.excelModal
      } else {
        modal = this.excelList[0]
      }
      if (modal && modal.children && this.excelData) {
        if (this.config.tableData === undefined) {
          this.config.tableData = []
        }
        let data = []
        this.excelData.forEach(row => {
          let ele = {}
          modal.children.forEach(edit => {
            ele[edit.columnName + 'isShow'] = false
            ele[edit.columnName] = row[edit.excelName]
            // 如果字段唯一 并删除重复数据
            if (edit.isOnly == 1) {
              this.config.tableData = this.config.tableData.filter(item => {
                return item[edit.columnName] !== row[edit.excelName]
              })
            }
          })
          data.push(ele)
        })
        // 删除最后一行空数据
        if (this.config.tableData.length > 0) {
          let row = this.config.tableData[this.config.tableData.length - 1]
          let flag = true
          for (const key in row) {
            if (row[key]) {
              flag = false
            }
          }
          if (flag) {
            this.config.tableData.splice(this.config.tableData.length - 1, 1)
          }
        }
        // 导入添加排序
        let sort = this.config.tableData.length
        data.forEach(item => {
          item.SORT_ = sort++
          this.columns.forEach(column => {
            item[column.columnName + 'isShow'] = false
            if (item[column.columnName] === undefined) {
              item[column.columnName] = undefined
            }
            if (column.widgetType && column.widgetType === 'select-form') {
              if (item[column.columnName + 'LABEL_'] === undefined) {
                item[column.columnName + 'LABEL_'] = item[column.columnName]
              }
            }
            // 触发子表运算
            item = this._handlerChangeValue('', column, item, sort, true)
          })
          this.config.tableData.push(item)
        })
      }
      this.selectExcelVisible = false
    },
    handlerGridOpenSelectForm (column, row, index) { // 单元格编辑打开表单
      // console.info('----handlerGridOpenSelectForm---')
      // console.log(column, row, index)
      this.queryParams = this.config.parent.getData().mainFormDataMap
      this.selectTableRow = row
      this.selectFormColumn = column
      this.selectTableIndex = index
      this.selectFormKey = column.attr
      this.openDialogWidth = 900
      this.openDialogHeight = 600
      let formConfig = {}
      getConfig(this.selectFormKey, this).then(data => {
        for (var key in data) {
          formConfig[key] = data[key]
        }
        if (formConfig) {
          this.selectFormTitle = formConfig.title
          // console.info('------this.selectFormTitle-------'+this.selectFormTitle)
        }
      })
      this.selectFormConfig = {}
      this.selectFormSingleSelect = true
      this.selectFormVisible = true
    },
    format (format, value) {
      if (typeof value === 'number') {
        let date = new Date(value)
        return date.format(format)
      } else if (typeof value === 'string') {
        if (value.indexOf('T') > -1) {
          return value.substring(0, 10)
        } else {
          try {
            if (value.indexOf(':') > -1) {
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
    formatDateFun (column, value) { // 格式化日期
      let format = 'yyyy-MM-dd'
      if (column.dateType === 'year') {
        format = 'yyyy'
      } else if (column.dateType === 'month') {
        format = 'yyyy-MM'
      } else if (column.dateType === 'datetime' || column.widgetType == 'select-date-time') {
        format = 'yyyy-MM-dd hh:mm:ss'
      } else if (column.widgetType == 'select-time') {
        format = 'hh:mm:ss'
      }
      if (typeof value === 'object') {
        return value.format(format)
      } else if (typeof value === 'number') {
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
      }
    },
    handlerSubFormUpload (column, row) { // 明细表上传附件
      // console.log(column.columnName + '--------handlerSubFormUpload--------', row)
      let id = row['ID_']
      this.uploadDialogConfig = {
        column, row, name: column.columnName
      }
      let attr = column.attr
      let config = {xtype: column.columnName, id: id, autoLoad: true}
      // 加载数据字典
      if (this.validUtil.isNotNull(attr)) {
        let attrObj = JSON.parse(attr)
        config = {...config, ...attrObj}
      }
      // console.log('--------------')
      this.uploadDialogConfig.filesList = row[column.columnName + 'filesList'] || []
      this.uploadDialogConfig.deleteFilesList = row[column.columnName + 'deleteFilesList'] || []
      this.uploadDialogConfig.config = config

      this.uploadDialogVisible = true
    },
    handlerUploadDialogCondirm () { // 明细表上传附件确认
      // console.log(this.uploadDialogConfig.column.columnName + '--------handlerUploadDialogCondirm--------', this.uploadDialogConfig.row)
      let filesList = this.$refs['upload-dialog'].getFilesList()
      let deleteFilesList = this.$refs['upload-dialog'].getDeleteFilesList()
      // console.log('--------handlerUploadDialogCondirm--------', filesList, deleteFilesList)
      this.uploadDialogConfig.row[this.uploadDialogConfig.column.columnName + 'filesList'] = filesList
      this.uploadDialogConfig.row[this.uploadDialogConfig.column.columnName + 'deleteFilesList'] = deleteFilesList
      // console.log(this.config.tableData)
      this.uploadDialogVisible = false
    },
    handlerChangeValue (newVal, column, row, index) { // 用户行为触发，监听字段值发生改变
      // console.log('------subForm--------handlerChangeValue---------',column.columnName,newVal)
      this.ifFormEditRender = false
      // 修改父组件表单中修改editFormRender的状态
      if (this.config.parent && this.config.parent.handlerUpdateFormEditRenderStatus) {
        this.config.parent.handlerUpdateFormEditRenderStatus()
      }
      this._handlerChangeValue(newVal, column, row, index, false)
    },
    _handlerChangeValue (newVal, column, row, index, isImport) { // 表单中字段变化，触发内部计算
      // console.log('------subForm--------_handlerChangeValue---------',column.columnName,newVal)
      // this.$refs[column.columnName + index][0].focus();
      // console.info(column.columnName+'--'+column.widgetType+'--'+newVal)
      // 改变时间日期值
      if (column && newVal && (column.widgetType == 'select-date' || column.widgetType == 'select-time' || column.widgetType == 'select-date-time')) {
        let value = this.formatDateFun(column, newVal)
        this.$set(row, column.columnName, value)
        this.$set(row, column.columnName + 'LABEL_', value)
      }
      // console.log(column.columnName + '----------handlerChangeValue-------------', newVal, column, row, index)

      // console.info(row);
      // 循环计算公式
      if (column && this.expression && this.expression[column.columnName]) {
        let expressionConfig = this.expression[column.columnName]
        for (let desColumnName in expressionConfig) {
          let desColumn = this.columnsMap[desColumnName]
          let keys = expressionConfig[desColumnName].keys
          // console.log(desColumnName + '----------------', expressionConfig[desColumnName])
          if (desColumn && keys) {
            var expression = ''
            keys.forEach(key => {
              let col = this.columnsMap[key]
              if (col) {
                if (col.javaType === 'Double' || col.javaType === 'Integer') {
                  if (row[col.columnName] === undefined) {
                    expression += 'var ' + col.columnName + ' = 0 ;'
                  } else {
                    expression += 'var ' + col.columnName + ' = ' + row[col.columnName] + ' ;'
                  }
                } else {
                  if (row[col.columnName] === undefined) {
                    expression += 'var ' + col.columnName + ' = "" ;'
                  } else {
                    expression += 'var ' + col.columnName + ' = "' + row[col.columnName] + '" ;'
                  }
                }
              }
            })
            if (expression.length > 0) {
              var expression_result = 0
              // console.info(key+'-------'+this.expression[key])
              var resultStr = expression + 'expression_result = ' + expressionConfig[desColumnName].expression + ';'
              // eslint-disable-next-line no-eval

              eval(resultStr)
              // console.log(desColumn, desColumnName + '---( ' + expressionConfig[desColumnName].expression + ' )-------' + expression_result + '--------resultStr-----' + resultStr)
              // eslint-disable-next-line camelcase
              // this.mainData[desColumnName] = result
              // 如果是导入时每次都会进行计算 不是编辑时第一次渲染，或者编辑时第一次渲染，但是时静默类型，则就每次都计算
              if (isImport || !this.ifFormEditRender || (this.ifFormEditRender && desColumn && desColumn.silence && desColumn === 1)) {
                if (desColumn.javaType && (desColumn.javaType === 'Float' || desColumn.javaType === 'Double')) {
                  row[desColumnName] = expression_result === undefined ? 0 : this.toFixed(expression_result)
                } else {
                  if (desColumn.javaType === 'Date') {
                    if (this.validUtil.isNotNull(expression_result)) {
                      row[desColumnName] = new Date(expression_result)
                    } else {
                      row[desColumnName] = ''
                    }
                  } else {
                    row[desColumnName] = expression_result
                  }
                }
                this.$forceUpdate()

                if (desColumn) {
                  // console.log(desColumnName,'------------desColumnName----------',row[desColumnName], desColumn, row, index)
                  // return
                  // 继续触发值的修改
                  this._handlerChangeValue(row[desColumnName], desColumn, row, index, isImport)
                }
              }
            }
          }
        }
      }
      // 如果不是多选
      if (column && !(column.multiple === 1 && (column.widgetType === 'select' || column.widgetType === 'select-sql' || column.widgetType === 'select-dic'))) {
        row[column.columnName + 'isShow'] = false
      }
      // row[column.columnName + 'isShow'] = false
      if (column && column.widgetType === 'switch') {
        row[column.columnName] = newVal === 'true' ? 1 : 0
      }
      // 如果是下拉框
      if (column && (column.widgetType === 'select' || column.widgetType === 'select-sql' || column.widgetType === 'select-dic')) {
        // 如果是UID_ 或者ID结尾
        if (column.columnName && column.columnName.lastIndexOf('UID_') > -1) {
          let name = column.columnName.split('UID_')
          row[name[0] + 'NAME_'] = this.dicValue(column, newVal)
        }
        if (column.columnName && column.columnName.lastIndexOf('ID_') > -1) {
          let name = column.columnName.split('ID_')
          row[name[0] + 'NAME_'] = this.dicValue(column, newVal)
        }
      }
      // 判断如果是树表，且有合计，则要向上统计
      if (this.config.isTree) {
        let columnConfig = this.summaryColumns[column.columnName]
        if (columnConfig) {
          // 递归向上计算
          this.deepUpSummary(column, row)
        }
      }
      // 触发汇总合计
      setTimeout(() => {
        // 触发调用
        this._handlerSummaryChange()
      }, 10)
      return row
    },
    deepUpSummary (column, row) { // 递归向上合计
      // 如果父亲是根节点，则不需要统计，控件会自动计算
      if (row['parentId'] && row['parentId'] !== this.config.rootId) {
        let parentNode = this.getParentNode(this.config.tableData, row['parentId'])
        if (parentNode) {
          let summary = 0
          const values = parentNode['children'].map(item => {
            let val = item[column.columnName]
            val = Number(val)
            return val
          })
          if (!values.every(value => isNaN(value))) {
            // console.info('---------')
            let result = values.reduce((prev, curr) => {
              // console.info(prev+'--------'+curr)
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            summary = this.toFixed(result)
          } else {
            summary = 0
          }
          parentNode[column.columnName] = summary
          // console.log(column.columnName+'-------deepUpSummary---------',row, parentNode, summary)
          // 递归向上计算
          this.deepUpSummary(column, parentNode)
          this.$forceUpdate()
        }
      }
    },
    toFixed (num) {
      var times = Math.pow(10, 10)
      var des = 0
      if (num > 0) {
        des = num * times + 0.5
      } else {
        des = num * times - 0.5
      }
      des = parseInt(des, 10) / times
      return des + ''
    },
    deepPackTreeData (data, parentId) { // 弹框选择回填confirmSelect时如果是树表回填，则需要把回填的数据中id和parentId替换掉
      let vm = this
      data.forEach(item => {
        vm.columns.forEach(column => {
          item[column.columnName + 'isShow'] = false
          if (item[column.columnName] === undefined) {
            item[column.columnName] = undefined
          }
          if (column.widgetType && column.widgetType === 'select-form') {
            if (item[column.columnName + 'LABEL_'] === undefined) {
              item[column.columnName + 'LABEL_'] = item[column.columnName]
            }
          }
          item = this._handlerChangeValue('', column, item, 0, true)
        })

        item.id = getUUID()
        item.parentId = parentId

        // 递归修改下级
        if (item.children && item.children.length > 0) {
          this.deepPackTreeData(item.children, item.id)
        }
      })
    },
    confirmSelect () { // 弹框选择确定数据
      // console.info('----------confirmSelect-----------'+this.formSelectBindColumn);
      let vm = this
      let selectedData = []
      let selectForm = this.$refs['select-form']
      if (selectForm && selectForm.getSelectedData) {
        // console.info('---------------------'+selectForm.getSelectedData)
        selectedData = selectForm.getSelectedData()
      }
      let tableData = this.config.tableData
      // console.log('----------confirmSelect-----------',this.selectFormSingleSelect,selectedData,this.formSelectBindColumn);
      if (this.selectFormSingleSelect) {
        // 说明是行内弹框，只能选择一条数据
        if (selectedData.length !== 1) {
          this.util.warn('请选择一行数据')
          return
        }
        // 判断是否在行中点击弹出
        if (this.selectTableIndex > -1) {
          let item = selectedData[0]
          // 把第一行数据赋值给数组
          let row = this.isTree ? this.getCurrentRow() : tableData[this.selectTableIndex]
          this.columns.forEach(column => {
            // 触发子表运算
            let key = column.columnName
            row = this._handlerChangeValue('', column, row, this.selectTableIndex, true)
            if (item[key] !== undefined) {
              row[key] = item[key]
              if (column.widgetType == 'select-date' || column.widgetType == 'select-time' || column.widgetType == 'select-date-time') {
                let value = this.formatDateFun(column, row[key])
                row[key + 'LABEL_'] = value
              }
            } else {
              if (row[key] === undefined) {
                row[key] = undefined
              }
            }
            if (column.multiple == 1 && (column.widgetType == 'select' || column.widgetType == 'select-dic' || column.widgetType == 'select-sql')) {
              if (item[key]) {
                row[key] = item[key].split(',')
              } else {
                row[key] = null
              }
            }
            if (column.widgetType && column.widgetType === 'select-form') {
              if (item[key + 'LABEL_']) {
                row[key + 'LABEL_'] = item[key + 'LABEL_']
              } else {
                row[key + 'LABEL_'] = item[key]
              }
            }
            row[column.columnName + 'isShow'] = false
          })
        }
      } else {
        if (selectedData.length === 0) {
          this.util.warn('请选择数据')
          return
        }
        // 判断是否树表
        if (this.config.isTree) {
          // 只获取弹框中根节点下的树数据
          // console.log('--------selectForm----------',selectForm)
          selectedData = selectForm.getSelectedTreeData()
          // console.log('------弹框获取到数据--------', selectedData)

          // 递归重新组装数据
          vm.deepPackTreeData(selectedData, this.config.rootId)
          // console.log('------弹框处理后结果--------', selectedData)
          vm.config.tableData = selectedData
          this.$forceUpdate()
          this.selectFormVisible = false

          return
        }

        let insertData = []
        // 判断第一条数据是否为空 为空删除
        let flag = true
        vm.columns.forEach(column => {
          if (vm.config.tableData.length > 0) {
            let value = vm.config.tableData[vm.config.tableData.length - 1][column.columnName]
            if (value != undefined && value != '') {
              flag = false
            }
          }
        })
        if (flag) {
          vm.deleteRow(vm.config.tableData.length - 1, vm.config.tableData[vm.config.tableData.length - 1], vm.config.tableData)
        }
        // 遍历带插入的数据
        // console.log(selectedData, this.columns)
        selectedData.forEach(item => {
          let row = {}
          this.columns.forEach(column => {
            let key = column.columnName
            // console.log(key+'-------'+item[key])
            if (item[key] !== undefined) {
              row[key] = item[key]
              if (column.widgetType == 'select-date' || column.widgetType == 'select-time' || column.widgetType == 'select-date-time') {
                let value = this.formatDateFun(column, row[key])
                row[column.columnName + 'LABEL_'] = value
              }
            } else {
              if (row[key] === undefined) {
                row[key] = undefined
              }
            }
            if (column.widgetType && (column.widgetType === 'select-form' || column.widgetType === 'select-user' || column.widgetType === 'select-user-list' || column.widgetType === 'select-user-multi')) {
              if (item[key + 'LABEL_'] !== undefined) {
                row[key + 'LABEL_'] = item[key + 'LABEL_']
              } else {
                row[key + 'LABEL_'] = item[key]
              }
            }
            if (column.multiple == 1 && (column.widgetType == 'select' || column.widgetType == 'select-dic' || column.widgetType == 'select-sql')) {
              if (item[key]) {
                row[key] = item[key].split(',')
              } else {
                row[key] = null
              }
            }
            row[column.columnName + 'isShow'] = false
            // 触发子表运算
            row = this._handlerChangeValue(row[key], column, row, 0, true)
          })
          insertData.push(row)
        })
        // console.log('-------confirmSelect------', insertData)
        if (insertData.length > 0) {
          // 再表格的下一行插入数据
          tableData = tableData.concat(insertData)
        }
      }
      this.config.tableData = tableData
      // console.log('------confirmSelect----selectedData---',selectedData)
      // console.info(this.config.tableData)
      this.$forceUpdate()

      // console.log(this.tableData)
      // console.info(this.tableData)
      // console.info(selectedData);
      // console.info(selectedData);
      this.selectFormVisible = false
    },
    iptBlur (row, column, index, visable) {
      // this.clickRow = row;
      if (!visable) {
        setTimeout(() => {
          this.$set(row, column.columnName + 'isShow', false)
        }, 100)
      }
    },
    getSummaries (param) {
      // console.info('--------getSummaries-------', param)
      const { columns, data } = param
      const sums = []
      let _this = this
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计'
          return
        }
        // console.info(column.columnName+'-----------'+column.property)
        // console.info(_this.summaryColumns)
        // console.info(column)
        let property = column.property ? column.property : column.columnName
        let columnConfig = _this.summaryColumns[property]
        if (columnConfig) {
          let title = columnConfig.title
          // console.info(columnConfig)
          const values = data.map(item => {
            // console.info(property+'-----'+JSON.stringify(item))
            let val = item[property]
            // console.info('1--------'+val);
            val = Number(val)
            // console.info('2--------'+val);
            return val
          })
          // console.info(values)
          if (!values.every(value => isNaN(value))) {
            // console.info('---------')
            let result = values.reduce((prev, curr) => {
              // console.info(prev+'--------'+curr)
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            // 解决合计精度丢失问题
            result = result === undefined ? 0 : this.toFixed(result)
            sums[index] = result
            _this.summaryData[title] = result
            // sums[index] += ' 元';
          } else {
            sums[index] = ''
            _this.summaryData[title] = 0
          }
        } else {
          sums[index] = ''
        }
      })
      // console.info(_this.summaryData)
      // console.info(sums)
      // console.log('-----sums----',sums,this.summaryData)
      // ON.stringify(sums))
      // this.$forceUpdate()
      /* setTimeout(()=>{

        // 触发调用
        this._handlerSummaryChange()
      },100) */
      // this.$refs['jr-table'].doLayout()
      return sums
    },
    getSummaryData () { // 获取汇总数据
      return this.summaryData
    },
    handleRowButtonClick (column, index, row) { // 列表中按钮
      if (column.events) {
        eval(column.events)
      }
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
                // let columnName = key.trim().substring(key.indexOf('[')+1,key.indexOf(']'))
                openParams = openParams.replace(new RegExp(key, 'gm'), '""')
              })
            }
          }
        }
        // console.info(openParams)
        // console.info('openParams--2--'+openParams)
        if (openParams.title) {
          this.openDialogTitle = openParams.title
        } else {
          this.openDialogTitle = column.title
        }
        this.openDialogWidth = column.openWidth ? column.openWidth : 900
        this.openDialogHeight = column.openHeight ? column.openHeight : 600
        // console.info( this.openDialogWidth+'---------'+openParams.title+'---------'+this.openDialogHeight)
        if (column.openType === 2) {
          // console.info(column.openType+'---------'+column.openUrl+'---------'+openParams)
          this.openByName(column.openUrl, openParams)
          // this.$router.push({
          //   name: 'form-view',
          //   params: {
          //     formKey:'project-info',
          //     title:'项目信息'
          //   }
          // })
        } else if (column.openType === 1) {
          // console.info(column)
          // console.info(this.$route)
          // console.info(openParams)
          this.openDialogVueName = column.openUrl
          let params = null
          if (this.openDialogVueName === 'form-query' || this.openDialogVueName === 'form-view') {
            this.showOpenDialogTitle = false
            params = typeof openParams === 'string' ? JSON.parse(openParams) : openParams
            params.selectFormKey = params.formKey
            params.openConfig = {}
            if (params.title) {
              this.openDialogTitle = params.title
            }
          } else {
            this.showOpenDialogTitle = true
            params = {
              openConfig: typeof openParams === 'string' ? JSON.parse(openParams) : openParams
            }
            if (params.openConfig.title) {
              this.openDialogTitle = params.openConfig.title
            }
          }

          // console.info(params)
          let route = this.getRouteConfigByName(column.openUrl)

          // console.info(route)
          this.openDialogVisible = true
          // 因为是表单所以通过这种方式传参

          params.openConfig.parent = this
          this.openDialogConfig = {
            route, params
          }
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
            // 获取sql中需要传入后台的参数
            if (apiConfig.runsql) {
              let runsql = apiConfig.runsql
              for (let field in row) {
                let key = null
                if (runsql.indexOf('{' + field + '}') > -1) {
                  key = field
                }
                if (key && row[key]) {
                  params[key] = row[key]
                }
              }
            }
            _this.util.mask('正在执行...')
            // 调用获取数据
            getDataByApi(apiConfig.id, params).then(res => {
              _this.loadData()
              _this.util.unmask()
              _this.util.success('执行成功!')
            }).catch(() => {
              _this.util.unmask()
            })
          }
        }
      }
      // console.info('22---------')
    },
    closeForm () {
      // 弹框的关闭和保存之后调用关闭
      this.openDialogVisible = false
    },
    getRouteConfigByName (name) {
      // console.info(name)
      if (this.$router.options.routes) {
        // console.info(this.$router)
        let data = this.$router.options.routes.find(item => {
          return item.name === name
        })
        // console.info(data)
        if (data) {
          if (data.length > 0) {
            return data[0]
          }
          return data
        }
      }
      return null
    },
    setFormWidth (formConfig) {
      this.selectFormConfig = formConfig
    },
    openByName (name, params, query) {
      let route = {name: name}
      if (params) {
        route.params = JSON.parse(params)
      }
      if (query) {
        route.query = JSON.parse(query)
      }
      // console.info('--------111-------'+typeof params)
      // console.info(route)
      // console.info(params);
      // this.$router.push(route);
      this.$router.push({
        name: name,
        params: route.params
      })
    },
    _handlerSummaryChange () { // 获取汇总数据
      // console.info('-----handlerSummaryChange-----1---'+this.config.parent)
      if (this.config.parent && this.config.parent.handlerSummaryChange) {
        this.config.parent.handlerSummaryChange(this.config, this.getSummaryData())
      }
    }
  }
}
