/* eslint-disable eqeqeq */
/* eslint-disable no-array-constructor */

import {saveData, getFlow, getFlowImg, getMainData, getAddressOptions, getDicData, getOrgList, getConfigInfo, getSqlDicData, getDataByApi, getReport, getGridData} from '@/api/form-render'
import {mapGetters, mapMutations} from 'vuex'
import {EVENT_TYPE} from '../../../public/js/const'
import webapp from '../../../sys/report/grwebapp.js'
import utils from '../../../sys/report//utils.js'
import excel from '@/utils/excel'

// import {formUtil} from '../form'
export const mixin = {
  data () {
    return {
      formKey: '',
      formId: '',
      formInfoId: '',
      businessKey: '',
      subFormCount: 0,
      subForms: [], // 明细表
      tableName: '', // 数据库表
      entityId: '', // 实体
      activeTab: 'subForm1',
      ruleComputeData: {}, // 数据来源为字符串拼接
      apiSourceData: {}, // 主表是关联接口， key为触发字段，value为接口信息列表，有可能一个字段影响多个接口
      sourceData: {}, // 主表数据来源 ，key为字段columnName
      subFormSummary: {}, // 主表需要关联明细表合计
      selectFormKey: '', // 弹框选择，关联表单的formKey
      selectFormTitle: '', // 弹框选择，表单title
      selectFormConfig: {}, // 选择弹出框的配置
      rules: {}, // 表单校验
      mainData: {},
      formRows: [],
      selectFormQueryParams: null, // 选择弹框表单时查询传参，默认把表单数据传过去
      fileColumns: [], // 附件列
      hiddenColumns: [], // 隐藏字段
      formSelectBindColumn: '', // 表单弹框之后的赋值字段
      formColumnTitleMap: {}, // 保存主表所有字段中文对应的columnName
      formColumnsMap: {}, // 保存主表所有字段 ，key为字段columnName
      formColumns: [],
      selectFormVisible: false, // 弹框选择树表
      subFormsVisible: false, // 显示明细表
      processMonitorVisible: false, // 显示流程记录
      ifFormEditRender: false, // 是否表单编辑时第一次渲染
      selectMemberModels: {// 人员控件
        form: {},
        isShow: false,
        selectList: [],
        callBack: this.memberCallBack,
        radioSelectFlags: false
      },
      selectRoleModels: {// 角色控件
        isShow: false,
        selectList: [],
        callBack: this.selectRoleCallBack,
        radioSelectFlags: false
      },
      disabled: false, // 如果为true流程也不能提交，不能加载
      readOnly: false,
      selectQuertersModels: {// 部门控件
        isShow: false,
        form: {},
        selectList: [],
        callBack: this.quertersCallBack,
        radioSelectFlags: false
      },
      wfFormAuth: null, // 流程过程中字段权限
      ifCopy: false, // 流程过程中字段权限判断使用
      defaultPic: require('../../../assets/img/defaut.jpg'),
      ifHasProcess: false, // 是否含有流程
      processForm: undefined, // 流程处理单
      processModel: null, //  流程模型
      processFormVisible: false, // 流程提交处理单
      defaultConfig: {},
      dicData: {}, // 数据字典数据
      uploadConfig: {
        limit: 10,
        limitSize: 50048576,
        readOnly: false,
        xtype: 'test',
        accept: '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP',
        acceptMsg: '只能传图片'
      },
      loading: false,
      html5Params: {},
      selectModalVisible: false,
      modalList: [],
      modal: {},
      subList: [],
      ImageList: [],
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block']
          ]
        }
      },
      selectExcelVisible: false,
      excelList: [],
      uploadLoading: false,
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
      excelData: [],
      excelModal: null,
      flowData: {}, // 流程数据
      addressObj: {addressVisible: false}, // 地图选择
      clickCloumn: {}
    }
  },
  props: {
    openConfig: { // 列表或者按钮或者传统触发弹框打开页面时使永
      type: Object,
      default: function () {
        return undefined
      }
    },
    config: {
      type: Object,
      default: function () {
        return {columns: []}
      }
    }
  },
  mounted () {
    this.ifCopy = false
    this.rules = {}
    this.keyword = ''
    this.subForms = []
    this.mainData = {}
    this.gridData = []
    this.pageSize = 30
    this.pageCount = 0
    this.pageIndex = 1
    this.totalCount = 0
    this.formKey = ''
    this.businessKey = ''
    this.selectFormKey = ''
    this.formRows = []
    this.searchFormColumns = []
    this.subFormsVisible = false
    this.selectFormVisible = false
    this.formSelectBindColumn = ''
    this.fileColumns = [] // 附件列
    this.hiddenColumns = []
    this.selectFormConfig = {}
    this.subFormSummary = {}
    this.formColumnsMap = {}
    this.sourceData = {}
    this.tableName = ''
    this.entities = ''
    this.readOnly = false
    this.ifHasProcess = false
    this.processForm = undefined
    this.processModel = null
    this.processFormVisible = false
    this.selectFormQueryParams = null
    this.subFormCount = 0
    this.apiSourceData = {}
    this.formColumnTitleMap = {}
    this.ruleComputeData = {}
    this.wfFormAuth = null
    this.ifFormEditRender = false
    this.init()
    // webapp.webapp_urlprotocol_startup()
  },
  computed: {
    ...mapGetters([
      'getFormConfig',
      'formSelectData'
    ]),
    // 判断字段是否显示
    formColumnHidden () {
      return function (column) {
        // 过滤权限
        return column.btnLook == 0
        // return false
      }
    },
    formColumnReadOnly () {
      return function (column) {
        // console.log(column.columnName+'-----formColumnReadOnly------',this.readOnly,this.disabled, column.readOnly,column.btnEdit)
        // 优先判断流程
        if (column.status) {
          if (column.btnEdit == 0) {
            return true
          } else {
            return false
          }
        }

        // 过滤权限
        if (this.readOnly || this.disabled || column.btnEdit == 0) {
          return true
        }
        // if (this.readOnly) {
        //   return true
        // }
        // 如果流程状态为以审 则设置为只读
        if (this.mainData['PROC_STATUS_'] == -5) {
          this.readOnly = true
          return true
        }
        return column.readOnly == undefined ? false : column.readOnly === 1
      }
    },
    computeReadOnly () {
      return function () {
        if (this.disabled) {
          return true
        } else {
          if (this.readOnly) {
            return true
          }
        }
        return false
      }
    },
    computePicView (column) {
      return function (column) {
        let defaultUrl = this.defaultPic// 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
        if (this.mainData[column.columnName]) {
          defaultUrl = this.util.getBaseUrl() + '/api_v1/files/' + this.mainData[column.columnName] + '/look?ifThumb=' + column.ifThumb + '&access_token=' + this.sessionUtil.getAccessToken()
        }
        return defaultUrl
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
        if (typeof value === 'object') {
          return value.format(format)
        } if (typeof value === 'number') {
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
    }
  },
  watch: {
    /* mainData:{
      handler: function (val, oldval) {
        console.log('------mainData--------',val, oldval)
        console.log('------mainData---1-----',val.AMOUNT_SQ_, oldval.AMOUNT_SQ_)
        // console.info(JSON.stringify(val))
        // this.setCache(val)
        debugger
      },
      deep: true// 对象内部的属性监听，也叫深度监听
    } */
  },
  methods: {
    ...mapMutations([
      'setFormConfig',
      'setFormSelectData'
    ]),
    init () {
      this.loading = true
      let formKey = null
      // 判断是否props属性弹框传参
      if (this.openConfig && this.openConfig.formKey) {
        formKey = this.openConfig.formKey
        if (this.openConfig.readOnly != undefined) {
          this.readOnly = this.openConfig.readOnly
          // console.info('-----this.readOnly -------'+this.readOnly )
        }
        if (this.openConfig.disabled != undefined) {
          this.readOnly = this.openConfig.disabled
          this.disabled = this.openConfig.disabled
          // console.info('-----this.readOnly -------'+this.readOnly )
        }
      } else {
        formKey = this.$route.params.formKey
      }
      // 判断路由是否传入formKey
      // console.info('--form-edit---formKey-----'+formKey)
      this.processModel = {}
      this.processModel.parent = this
      this.processModel.ifHasProcess = false
      if (this.validUtil.isNotNull(formKey)) {
        let config = {}
        let params = {}
        params['formKey'] = formKey
        if (this.validUtil.isNotEmpty(this.util.getUrlParam('_procDefId'))) {
          params.procDefId = this.util.getUrlParam('_procDefId')
        }
        if (this.validUtil.isNotEmpty(this.util.getUrlParam('_currentActId'))) {
          params.actId = this.util.getUrlParam('_currentActId')
        }
        if (this.validUtil.isNotEmpty(this.util.getUrlParam('_taskType'))) {
          let taskType = this.util.getUrlParam('_taskType')
          if (taskType == '1') {
            this.ifCopy = true
          }
        }

        getConfigInfo(params, this).then(data => {
          for (var key in data) {
            config[key] = data[key]
          }
          if (config.forms[config.forms.length - 1]) {
            this.defaultConfig = config.forms[config.forms.length - 1]
          }
          this.defaultConfig = config.forms[config.forms.length - 1]
          this.defaultConfig.ifHasProcess = config.ifHasProcess
          this.defaultConfig.formKey = formKey
          this.wfFormAuth = config.wfFormAuth // 获取流程过程节点权限
          this.formKey = formKey
          // 先判断是否弹框打开表单
          if (this.openConfig && this.openConfig.formKey) {
            this.defaultConfig.businessKey = this.openConfig.businessKey ? this.openConfig.businessKey : ''
            this.defaultConfig.parent = this.openConfig.parent
            this.defaultConfig.initValues = this.openConfig.initValues && this.config.initValues ? Object.assign(this.openConfig.initValues, this.config.initValues) : (this.openConfig.initValues || this.config.initValues)
            // console.info(this.openConfig)
            if (this.openConfig.parentSelectedData) {
              this.defaultConfig.parentSelectedData = this.openConfig.parentSelectedData
            }
          } else {
            // 从路由中获取业务数据id
            this.defaultConfig.businessKey = this.$route.params.businessKey ? this.$route.params.businessKey : this.$route.query.id
            this.disabled = this.$route.params.disabled || false
            this.readOnly = this.$route.params.readOnly || false
          }
          this.formId = this.defaultConfig.formId
          this.formInfoId = this.defaultConfig.id
          // console.info('-----businessKey------'+this.$route.params.businessKey)
          this.setForm()
        })
      } else {
        this.defaultConfig = this.config
        this.formKey = this.defaultConfig.formKey
        this.formId = this.defaultConfig.formId
        this.formInfoId = this.defaultConfig.id
        this.setForm()
        // console.info(this.defaultConfig)
      }
    },
    onEditorChange ({ editor, html, text }) {
      console.log(editor, html, text)
    },
    onEditorBlur () {
      // 失去焦点事件
    },
    onEditorFocus () {
      // 获得焦点事件
    },
    onEditorReady () {
      // element.html = '<h1 class="ql-align-center">asdfasd</h1>'
    },
    getAddressCascader (column) {
      let area = {
        lazy: true,
        lazyLoad (node, resolve) {
          setTimeout(() => {
            let params = {
              rootId: node.root ? '1' : node.data.id,
              formColumn: column
            }
            getAddressOptions(params, this).then(data => {
              resolve(data)
            })
          }, 10)
        }
      }
      return area
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
        this.excelData = excel.read(data, 'array')
        this.uploadLoading = false
      }
    },
    // 点击导入按钮
    handlerExcelClick () {
      this.selectExcelVisible = true
      this.excelList = this.config.formExcelList
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
        for (let index = 0; index < this.subForms.length; index++) {
          let table = this.$refs['sub-form-' + this.subForms[index].key][0]
          let config = table.config
          if (config.tableData === undefined) {
            config.tableData = []
          }
          let data = []
          let esxcelList = modal.children.filter(item => {
            return item.subTableName == config.tableName
          })
          if (esxcelList && esxcelList[0]) {
            let excelData = this.excelData.find(item => {
              return item.sheetName == esxcelList[0].workSheetName
            })
            if (excelData.results) {
              excelData.results.forEach(row => {
                let falg = true
                esxcelList.forEach(edit => {
                  row[edit.columnName] = row[edit.excelName]
                  // 如果字段唯一
                  if (edit.isOnly == 1 && this.config.tableData.find(item => {
                    return item[edit.columnName] === row[edit.excelName]
                  }) != undefined) {
                    // 如果有重复数据
                    falg = false
                  }
                })
                if (falg) data.push(row)
              })
            }
          }
          // 删除最后一行空数据
          if (config.tableData.length > 0) {
            let row = config.tableData[config.tableData.length - 1]
            let flag = true
            for (const key in row) {
              if (row[key]) {
                flag = false
              }
            }
            if (flag) {
              config.tableData.splice(config.tableData.length - 1, 1)
            }
          }
          // 导入添加排序
          // 导入添加排序
          let sort = table.config.tableData.length
          data.forEach(item => {
            item.SORT_ = sort++
            table.columns.forEach(column => {
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
              item = table.handlerChangeValue('', column, item, sort)
            })
            config.tableData.push(item)
          })
        }
      }
      this.selectExcelVisible = false
    },
    setForm () {
      let _this = this

      this.tableName = this.defaultConfig['tableName']
      this.entityId = this.defaultConfig['entityId']
      let businessKey = this.defaultConfig.businessKey
      this.businessKey = businessKey
      if (this.defaultConfig['ifHasProcess'] && this.defaultConfig['ifHasProcess'] === 1) {
        this.processModel.ifHasProcess = true
        this.processMonitorVisible = true
        this.ifHasProcess = true
      }
      if (this.ifHasProcess && !this.disabled) {
        this.processModel.formKey = this.formKey
        this.processModel.businessKey = this.businessKey
        this.processFormVisible = true
      }

      let fileColumns = []
      let formColumns = []
      let formRows = []
      let hiddenColumns = []
      let subForms = []
      let columns = this.defaultConfig.formColumns
      let wfFormAuth = this.wfFormAuth // 获取流程过程节点权限
      let rules = {}
      let mainData = {}
      let ifCopy = this.ifCopy
      // console.log('-----ifCopy-----'+ifCopy)
      // 判断是否直接打开表单
      if (columns) {
        // 遍历每个表单中配置的查询列
        columns.forEach(column => {
          // 根据流程过程权限重新计算表单字段
          if (wfFormAuth && wfFormAuth[this.formInfoId] && wfFormAuth[this.formInfoId][column.columnName]) {
            let status = wfFormAuth[this.formInfoId][column.columnName]

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

          // console.info(column);
          // console.info("===="+column.col+'=='+column.title+'=='+this.defaultConfig.cloNum);
          column.newCol = column.col / this.defaultConfig.colNum
          // 判断是否明细表
          if (column.widgetType !== 'sub-form') {
            mainData[column.columnName] = ''
            if (column.widgetType === 'select-form') {
              // console.info(column)
              mainData[column.columnName] = ''
              let selectFormKey = column.attr
              if (selectFormKey && selectFormKey === 'project-info') {
                // 从state中读取
                /* let selectData = this.formSelectData[selectFormKey]
                // console.info(selectData)
                if (selectData) {
                  for (let key in selectData) {
                    mainData[key] = selectData[key]
                  }
                } */
              }
            } else if (column.widgetType === 'select-user-list' || column.widgetType === 'select-role-list' || column.widgetType === 'select-depart-list' || column.widgetType === 'select-cascade') {
              let params = {
                formColumn: column,
                businessKey: _this.businessKey
              }
              // 加载子表数据
              getOrgList(params).then(data => {
                if (column.widgetType === 'select-cascade' && data && data.length > 0) {
                  let edit = ''
                  data.forEach(v => {
                    if (edit !== '') {
                      edit += '/'
                    }
                    edit += v.label
                  })
                  mainData[column.columnName + 'cascade'] = data
                  mainData[column.columnName + 'placeholder'] = edit
                } else {
                  mainData[column.columnName] = data
                }
              })
            }
          }
          _this.formColumnTitleMap[column.title] = column.columnName
          _this.formColumnsMap[column.columnName] = column
          // console.info('------------'+column.columnName+'----------'+column.sourceType)
          // 判断是否有关联计算的
          if (column.sourceType) {
            if (column.sourceType === 'sub-form-summary') {
              _this.subFormSummary[column.columnName] = column.sourceAttr
            } else if (column.sourceType === 'main-form-data') {
              _this.sourceData[column.columnName] = column.sourceAttr
            } else if (column.sourceType === 'const') {
              mainData[column.columnName] = column.sourceAttr
            } else if (column.sourceType === 'api') {
              // 触发接口
              this.initApiConfig(column)
            } else if (column.sourceType === 'rule-compute') {
              // 规则计算
              this.initRuleComputeConfig(columns, column)
            } else if (column.sourceType === 'cascade-form') { // 级联表单时，关联获取上层表单的值
              if (column.sourceAttr) {
                if (this.defaultConfig && this.defaultConfig.parentSelectedData && this.defaultConfig.parentSelectedData[column.sourceAttr] != undefined) {
                  mainData[column.columnName] = this.defaultConfig.parentSelectedData[column.sourceAttr]
                }
              }
            } else {
              // 计算初始值
              this.computeInitValue(column, mainData)
            }
          }
          // 判断是否隐藏字段，如果隐藏字段统一放入最后一行
          if (column.hidden) {
            hiddenColumns.push(column)
          } else {
            // 判断是否数据字典
            if (column.widgetType === 'select') {
              let attr = column.attr
              column['options'] = []
              if (attr.indexOf(',') > -1) {
                // 说明是直接写死类型
                let data = []
                let options = attr.split(';')
                options.forEach(item => {
                  let option = item.split(',')
                  // 存入键值对
                  data.push({name: option[1], value: column.javaType === 'Integer' ? parseInt(option[0]) : option[0]})
                })
                column.options = data
                // this.$forceUpdate()
              }
            } else if (column.widgetType === 'select-dic') {
              let attr = column.attr
              // 加载数据字典
              if (_this.validUtil.isNotNull(attr)) {
                getDicData(attr).then(data => {
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
                  // console.info(column.options)
                  this.$forceUpdate()
                })
              }
            } else if (column.widgetType === 'select-sql') {
              let attr = column.attr
              // 加载数据字典
              if (_this.validUtil.isNotNull(attr)) {
                getSqlDicData({formKey: this.formKey, columnId: column.id}).then(data => {
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
                  // console.info(column.options)
                  this.$forceUpdate()
                })
              }
            }
            if (column.widgetType === 'pic-view') {
              let attr = column.attr
              // 加载数据字典
              if (_this.validUtil.isNotNull(attr)) {
                let attrObj = JSON.parse(attr)
                column.width = attrObj.width ? ((attrObj.width + '').indexOf('px') > -1 ? attrObj.width : (attrObj.width + 'px')) : '100px'
                column.height = attrObj.height ? ((attrObj.height + '').indexOf('px') > -1 ? attrObj.height : (attrObj.height + 'px')) : '100px'
                column.ifThumb = column.ifThumb ? column.ifThumb : true
              }
            }
            if (column.widgetType === 'file') {
              let attr = column.attr
              let config = {xtype: column.columnName, id: this.businessKey, readOnly: this.formColumnReadOnly(column)}
              // 加载数据字典
              if (_this.validUtil.isNotNull(attr)) {
                let attrObj = JSON.parse(attr)
                config = {...config, ...attrObj}
              }
              column.config = config
              fileColumns.push(column)
            }

            if (column.widgetType === 'sub-form') { // 默认有多个明细表时，所有明细表的位置参照第一个明细表位置
              // if (formRows.length < column.row) {
              if (formRows[column.row - 1] === undefined) {
                formRows[column.row - 1] = []
                let subFormsColumn = {
                  widgetType: 'sub-form',
                  row: column.row,
                  col: column.col,
                  subForms: []
                }
                column.index = subForms.length + 1
                subFormsColumn.subForms.push(column)
                formRows[column.row - 1].push(subFormsColumn)
              } else {
                // 说明是两个明细表在同一行
                let subFormsColumn = formRows[column.row - 1][0]
                // console.info(subFormsColumn)
                // console.info(subFormsColumn.subForms)
                column.index = subForms.length + 1
                subFormsColumn.subForms.push(column)
              }
              if (column.config) {
                column.config.formKey = this.formKey
                column.config.parent = _this
                column.config.title = column.title
                column.config.tableData = []
                if (this.wfFormAuth && this.wfFormAuth[column.id]) {
                  column.config.wfFormAuth = this.wfFormAuth[column.id]
                }
                column.config.ifCopy = this.ifCopy
                // 判断是否有注册api是主表字段切换修改明细表，初始化事件并且注册
                this.registerSubFormChangeEvent(column)
              }
              column.key = column.columnName
              subForms.push(column)
            } else {
              // if (formRows.length < column.row) {
              if (formRows[column.row - 1] === undefined) {
                formRows[column.row - 1] = []
              }
              formRows[column.row - 1].push(column)
              formColumns.push(column)
            }
          }
          if (column.require) {
            let rule = {field: column.columnName,
              validType: column.validType,
              column: column,
              validator: _this.validateField,
              required: true,
              message: '请输入' + column.title,
              trigger: 'blur'}
            if (column.javaType === 'Double' || column.javaType === 'Integer' || column.javaType === 'Float') {
              // if (column.widgetType !== 'select') {
              rule.type = 'number'
              // }
            }
            rules[column.columnName] = [rule]
          }
          if (column.validType) {
            if (!rules[column.columnName]) {
              rules[column.columnName] = []
            }
            rules[column.columnName].push({
              field: column.columnName,
              column: column,
              validType: column.validType,
              validator: _this.validateField,
              message: '格式错误',
              trigger: 'blur'
            })
          }
        })
        let sessionProj = null
        if (window.localStorage.getItem('_session_proj' + this.sessionUtil.getUser().id)) {
          sessionProj = JSON.parse(window.localStorage.getItem('_session_proj' + this.sessionUtil.getUser().id))
        } else if (this.getFormConfig['_session_proj' + this.sessionUtil.getUser().id]) {
          sessionProj = this.getFormConfig['_session_proj' + this.sessionUtil.getUser().id].data
          // console.log('------mainData-------', mainData, sessionProj)
        }
        if (sessionProj) {
          mainData = Object.assign(mainData, sessionProj)
          for (let key in sessionProj) {
            let column = this.formColumnsMap[key]
            // 触发change事件
            if (column && mainData[key] !== undefined) {
              this._handlerValueChange(column, mainData[key])
            }
          }
        }
        /* if(!mainData.SORT_ && this.defaultConfig.parent) {
          if (this.defaultConfig.type === 1 && this.defaultConfig.parent.gridData){
            mainData.SORT_ = this.defaultConfig.parent.gridData.length+1
          }
          if (this.defaultConfig.type === 2 && this.defaultConfig.parent.selectedData[0] && this.defaultConfig.parent.selectedData[0]._parent && this.defaultConfig.parent.selectedData[0]._parent.children){
            mainData.SORT_ = this.defaultConfig.parent.selectedData[0]._parent.children.length+1
          }
        } */

        if (this.defaultConfig && this.defaultConfig.initValues) {
          let initValues = this.defaultConfig.initValues
          for (let key in initValues) {
            // console.info(this.mainData[key])
            // console.info(initValues[key]+'-----'+key+'----'+mainData[key])
            if (this.validUtil.isNull(mainData[key])) {
              // console.info('---------')
              mainData[key] = initValues[key] + ''
            }
          }
        }
        // rules['test'] = [{field: 'test', required: true, message: '请输入1111', trigger: 'change'}]
        this.fileColumns = fileColumns
        _this.rules = rules
        // console.log(formRows)
        _this.formRows = formRows
        _this.formColumns = formColumns
        _this.hiddenColumns = hiddenColumns
        _this.mainData = mainData
        _this.subForms = subForms
        _this.$nextTick(function () {
          _this.loadData()
        })
        // console.info(subForms);
        // console.info(hiddenColumns);
      }

      // console.info(this.$refs)
    },
    subFormRef () {
      // this.subFormCount =  this.subFormCount+1;
      // let ref = 'sub-form-'+this.subFormCount;
      // console.info('------ref------'+ref)
      // return ref;
    },
    updateReadOnly (readOnly) { // 方便流程修改表单状态
      this.readOnly = readOnly
      if (readOnly === false) {
        this.disabled = false
      }
      // console.log('------updateReadOnly-------',this.readOnly)
    },
    setCache (data) {
      this.cookieUtil.set('bus-form-' + this.defaultConfig.tableName, data)
    },
    getCache () {
      let data = this.cookieUtil.get('bus-form-' + this.defaultConfig.tableName)
      return data
    },
    getRenderApi () {
      // console.info(this.config)
      // console.info(this.defaultConfig.events)
      if (this.defaultConfig.events) {
        let events = this.defaultConfig.events.find(event => {
          // console.info(event)
          return parseInt(event.type) === EVENT_TYPE.NEW_REDNER
        })
        return events
      }
      return null
    },
    openAddress (cloumn) {
      this.clickCloumn = cloumn
      this.addressObj.addressVisible = true
    },
    // 选择项目地址回调
    chooseAddress (data) {
      // console.log('-------chooseAddress--------',data,this.clickCloumn)

      this.mainData[this.clickCloumn.columnName] = data.address
      if (this.clickCloumn.attr) {
        let attr = JSON.parse(this.clickCloumn.attr)
        if (attr && attr['rule']) {
          let point = data.addressLocation.split(',')
          for (let columnName in attr['rule']) {
            let key = attr['rule'][columnName]
            if (key === 'address') {
              this.mainData[columnName] = data.address
            } else if (key === 'lng') {
              this.mainData[columnName] = point[0]
            } else if (key === 'lat') {
              this.mainData[columnName] = point[1]
            } else if (key === 'province') {
              this.mainData[columnName] = data.province
            } else if (key === 'city') {
              this.mainData[columnName] = data.city
            } else if (key === 'county') {
              this.mainData[columnName] = data.county
            } else if (key === 'addressLocation') {
              this.mainData[columnName] = data.addressLocation
            }
          }
        }
      }
      /* this.mainData[this.clickCloumn.columnName] = data.address
      this.mainData[this.clickCloumn.columnName + 'LOCATION_'] =
      this.mainData[this.clickCloumn.columnName + 'PROVINCE_'] = data.province
      this.mainData[this.clickCloumn.columnName + 'CITY_'] = data.city
      this.mainData[this.clickCloumn.columnName + 'COUNTY_'] = data.county */
    },
    loadData () {
      // console.log('------loadData-----',this.mainData)
      /* return; */
      let _this = this
      let businessKey = this.businessKey
      // console.info(this.defaultConfig)

      // 判断是否搜索,然后拼接搜索
      let params = {
        'formKey': _this.defaultConfig.formKey,
        'id': _this.defaultConfig.id, // 表单formId
        'businessKey': businessKey,
        'tableName': _this.defaultConfig.tableName
      }

      // 如果时编辑，则默认首次渲染是true
      if (this.validUtil.isNotNull(businessKey)) {
        this.ifFormEditRender = true
      }

      // let event = this.getRenderApi()
      // if (event && event != null) {
      //   params.apiId = event.apiId
      // 修改所有接口调用在后台执行
      params.params = this.mainData
      let sessionProj = null
      if (window.localStorage.getItem('_session_proj' + this.sessionUtil.getUser().id)) {
        sessionProj = JSON.parse(window.localStorage.getItem('_session_proj' + this.sessionUtil.getUser().id))
      } else if (this.getFormConfig['_session_proj' + this.sessionUtil.getUser().id]) {
        sessionProj = this.getFormConfig['_session_proj' + this.sessionUtil.getUser().id].data
        // console.log('------mainData-------', mainData, sessionProj)
      }
      // console.log('------mainData-------', mainData, sessionProj)
      if (sessionProj) {
        params.params['session-proj-uid'] = sessionProj['PROJ_ID_'] || sessionProj['PROJ_UID_']
      }
      // }
      getMainData(params).then(data => {
        let mainData = data
        if (mainData) {
          this.mainData = Object.assign(this.mainData, mainData)
          this.defaultConfig.formColumns.forEach(column => {
            let key = column.columnName
            if (column.widgetType && column.widgetType === 'switch') {
              this.mainData[key + '_SWITCH'] = this.mainData[key + '_SWITCH'] === 'true'
            } else if (column.widgetType && column.widgetType === 'select-date-time') {
              this.mainData[key] = this.mainData[key + 'LABEL_'] || this.mainData[key]
            } else if (column.widgetType === 'select' || column.widgetType === 'select-sql' || column.widgetType === 'select-dic') {
              // 解决值为number类型显示不正确bug
              this.mainData[key] = column.widgetType === 'select' ? this.mainData[key] + '' : this.mainData[key]
              this.mainData[key + 'LABEL_'] = this.mainData[key]
              if (column.multiple === 1) {
                let options = this.mainData[key].split(',')
                if (options && options.length > 0) {
                  this.mainData[key + 'LABEL_'] = options
                } else {
                  this.mainData[key] = []
                }
              }
            }
          })
          // console.log(mainData['CREATE_USER_'],'----------',this.sessionUtil.getUserUid(),mainData['CREATE_USER_'] !== this.sessionUtil.getUserUid())
          if (mainData['CREATE_USER_'] && mainData['CREATE_USER_'] !== this.sessionUtil.getUserUid() && !this.sessionUtil.isAdmin() && !this.sessionUtil.isCompanyAdmin()) {
            this.disabled = true
            this.readOnly = true
          }
          // 如果流程状态不是空，则说明是送审或者已审，则需要只读
          if (this.validUtil.isNotNull(mainData['PROC_STATUS_'])) {
            this.readOnly = true
          }
          // console.log(this.config.parentColumn+'-----------------'+this.mainData[this.config.parentColumn])
          if (this.config.parentColumn && this.validUtil.isNull(this.mainData[this.config.parentColumn])) {
            this.mainData[this.config.parentColumn] = this.config.rootId
            this.mainData[this.config.parentColumn + 'LABEL_'] = this.config.rootText
          }
        }

        // console.log('-------------loadData-------触发------',this.mainData['SUBJECT_'],this.mainData['TYPE_'])
        // 初始化计算规则计算数据来源
        _this.computeRuleComputeConfig()
        // 加载流程
        this.initProcess()
        // 加载明细表数据
        _this.$nextTick(function () {
          for (let index = 0; index < _this.subForms.length; index++) {
            _this.$refs['sub-form-' + _this.subForms[index].key][0].loadData(_this.defaultConfig.businessKey)
            // return
          }
        })
        _this.getFlowData()
        this.loading = false
      })
    },
    handlerUpdateFormEditRenderStatus () { // 用户行为明细表字段编辑change时触发革更新
      console.log('--------------handlerUpdateFormEditRenderStatus---------------')
      this.ifFormEditRender = false
    },
    openSelectForm (column) { // 打开树表选择框
      // console.info('------openSelectForm------1--')
      if (this.formColumnReadOnly(column)) {
        return
      }
      let mainData = this.getData()
      if (mainData && mainData.mainFormDataMap) {
        this.selectFormQueryParams = mainData.mainFormDataMap
      }
      this.selectFormKey = column.attr
      this.formSelectBindColumn = column
      this.selectFormVisible = true
    },
    setFormWidth (formConfig) {
      this.selectFormConfig = formConfig
    },
    checkSelfSelectValid () {
      this.$refs['mainForm'].validate((valid) => {

      })
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
      if (selectedData.length === 1) {
        let selectedRow = selectedData[0]
        // console.info(this.formSelectBindColumn)
        if (this.formSelectBindColumn != null) {
          // 如果是选择上级目录
          if (this.formSelectBindColumn.widgetType === 'select-self') {
            this.mainData['PARENT_ID_'] = selectedRow['ID_']
            this.mainData['PARENT_NAME_'] = selectedRow['NAME_']
            let column = this.formColumnsMap['PARENT_ID_']
            // 触发change事件
            if (column) {
              this._handlerValueChange(column, this.mainData['PARENT_ID_'])
            }
            column = this.formColumnsMap['PARENT_NAME_']
            // 触发change事件
            if (column) {
              this._handlerValueChange(column, this.mainData['PARENT_NAME_'])
            }
          } else if (this.formSelectBindColumn.widgetType === 'select-form' || this.formSelectBindColumn.widgetType === 'open-form') {
            // console.info(selectedRow)
            // 保存到state中用来其他表单初始化时使用
            this.setFormSelectData({formKey: this.formSelectBindColumn.attr, data: selectedRow})
            // 循环遍历根据数据回填规则
            // console.log(selectedRow, '1111111111', this.mainData)
            for (let key in selectedRow) {
              this.mainData[key] = selectedRow[key]
              this.$refs['mainForm'].validateField(key)
              this.$forceUpdate()
            }
            // 先赋值之后再触发change，
            for (let key in selectedRow) {
              let column = this.formColumnsMap[key]
              if (column) {
                // 触发change事件，解决LABEL_还未赋值就触发change，导致字段为规则计算的延迟
                this._handlerValueChange(column, this.mainData[key])
              }
              this.$forceUpdate()
            }
          }
        }
      }

      // console.info(selectedData);
      this.selectFormVisible = false
      this.formSelectBindColumn = null
    },
    handlerValueChange (column, value) { // 主表数据change时触发，用户行为事件
      // console.info(column.columnName + '------handlerValueChange------' + value+'----ifFormEditRender----'+this.ifFormEditRender)
      // 如果是用户行为事件，则修改状态
      this.ifFormEditRender = false
      this._handlerValueChange(column, value)
    },
    _handlerValueChange (column, value) { // 内部触发，比如 规则计算，明细表向上合计触发
      // console.info(column.columnName + '------_handlerValueChange------' + value+'----ifFormEditRender----'+this.ifFormEditRender)
      // debugger
      let _this = this
      // 先判断数据来源绑定主表字段的情况
      if (this.sourceData) {
        for (let key in this.sourceData) {
          let sourceColumnName = this.sourceData[key]
          // console.log('----sourceColumnName-----',sourceColumnName)
          // 判断是否当前列的数据触发影响其他列
          if (sourceColumnName === column.columnName) {
            let destColumn = this.formColumnsMap[key]
            // 判断是否中文字段
            if (destColumn.widgetType === 'number-cn' && value != undefined) {
              let newValue = this.util.numToCn(value)
              this.mainData[key] = newValue
            }
          }
        }
      }
      // 判断是否会触发api
      let apiConfigData = this.apiSourceData[column.columnName]
      // console.log('----handlerValueChange-----',apiConfigData)
      if (apiConfigData) {
        // console.info(apiConfigData)
        // 可能配置多个
        apiConfigData.forEach(apiConfig => {
          let mainData = this.getData()
          let params = {}
          if (mainData) {
            if (apiConfig.children) {
              apiConfig.children.forEach(item => {
                // 判断是否需要表单传参
                if (item.value && item.value.indexOf('{') > -1) {
                  let value = item.value.trim()
                  let columnName = value.substring(value.indexOf('{') + 1, value.indexOf('}'))
                  // 获取字段参数值
                  let val = mainData[columnName]
                  params[columnName] = val === undefined ? '' : val
                }
              })
            }
            // 获取sql中需要传入后台的参数
            if (apiConfig.runsql) {
              let runsql = apiConfig.runsql
              for (let field in mainData) {
                let key = null
                if (runsql.indexOf('{' + field + '}') > -1) {
                  key = field
                }
                if (key && mainData[key]) {
                  params[key] = mainData[key]
                }
              }
            }
          }
          params[column.columnName] = value
          // console.info(apiConfig)
          if (apiConfig.eventType && apiConfig.eventType === EVENT_TYPE.SUB_FORM_CHANGE_BY_MAIN_FORM) {
            // 调用主表字段切换修改明细表,刷新明细表
            _this.getSubForm(apiConfig.subFormKey).loadDataByEvent({
              apiConfig, apiId: apiConfig.id, resetId: true
            }, _this.defaultConfig.businessKey)
          } else {
            // 调用获取主表数据
            getDataByApi(apiConfig.id, params).then(res => {
              if (res && res.length > 0) {
                let data = res[0]
                for (let key in data) {
                  // console.info(key+'------'+data[key])
                  let desColumn = _this.formColumnsMap[key]
                  // 如果不是编辑时第一次渲染，或者编辑时第一次渲染，但是时静默类型，则就每次都计算
                  if (!this.ifFormEditRender || (this.ifFormEditRender && desColumn && desColumn.silence && desColumn === 1)) {
                    // 遍历更新数据
                    _this.mainData[key] = data[key]
                    // 触发接口调用
                    // console.info(key+'----------'+desColumn)
                    if (desColumn) {
                      // 触发change事件
                      this._handlerValueChange(desColumn, data[key])
                    }
                  }
                }
              }
            })
          }
        })
      }
      // 判断如果是switch组件需要特殊处理
      if (column.widgetType === 'switch') {
        this.mainData[column.columnName] = value ? 1 : 0
        this.mainData[column.columnName + '_SWITCH'] = value
        this.$forceUpdate()
      }
      // 如果是select 需给本身赋值
      if (column.widgetType === 'select' || column.widgetType === 'select-dic' || column.widgetType === 'select-sql') {
        this.mainData[column.columnName] = value
      }
      // console.log('-------------handlerValueChange-------触发------',this.mainData['SUBJECT_'],this.mainData['TYPE_'],this.mainData['START_DATE_'])

      // 如果是下拉框
      if (column.widgetType === 'select' || column.widgetType === 'select-sql' || column.widgetType === 'select-dic') {
        // 如果是UID_ 或者ID结尾
        if (column.columnName && column.columnName.lastIndexOf('UID_') > -1) {
          let name = column.columnName.split('UID_')
          this.mainData[name[0] + 'NAME_'] = this.dicValue(column, value)
        }
        if (column.columnName && column.columnName.lastIndexOf('ID_') > -1) {
          let name = column.columnName.split('ID_')
          this.mainData[name[0] + 'NAME_'] = this.dicValue(column, value)
        }
      }

      // 计算规则计算的
      this.computeRuleComputeConfig(column.columnName)
      // console.info(this.mainData)
    },
    handlerFileUploadSuccess (column, file) { // 文件上传成功回调
      this.mainData[column.columnName] = file.data.id
    },
    handleTabClick (tab, event) { // 多个明细表切换时触发

    },
    handlerSummaryChange (subForm, summaryData) { // 明细表合计数据发生变化时触发
      // console.info(subForm.title+'-----------'+JSON.stringify(summaryData))
      let title = subForm.title
      // 判断主表中是否有关联明细表计算的 ， 来源类型为明细表统计
      if (this.subFormSummary) {
        // console.log(title+'-----handlerSummaryChange-------',subForm, summaryData,this.subFormSummary)

        for (let desColumnName in this.subFormSummary) {
          let sourceAttr = this.subFormSummary[desColumnName]
          // console.log('------------',sourceAttr,(sourceAttr.indexOf(title) > -1 && sourceAttr.indexOf('[') > -1 && sourceAttr.indexOf(']') > -1))

          if (sourceAttr.indexOf(title) > -1 && sourceAttr.indexOf('[') > -1 && sourceAttr.indexOf(']') > -1) {
            // 计算公式，比如多个明细表相加
            let keys = sourceAttr.match(/\[(.*?)\]/gi) // 匹配所有类似[项目名称]的变量
            if (keys) {
              keys.forEach(key => {
                let newKey = key.trim().substring(key.indexOf('[') + 1, key.indexOf(']'))

                let keyArray = newKey.split('.')
                let subFormKey = keyArray[0]
                let columnName = keyArray[1]
                // console.log('-----------', subFormKey, columnName)
                let findSubFormConfig = this.subForms.find(subFormConfig => {
                  if (subFormConfig.title === subFormKey) {
                    return subForm
                  }
                })
                let findSubForm = this.$refs['sub-form-' + findSubFormConfig.key][0]
                // console.log('-------findSubForm--------',('sub-form-' + findSubFormConfig.key), findSubForm)
                let findSummaryData = findSubForm.getSummaryData()
                let value = findSummaryData[columnName] || 0
                sourceAttr = sourceAttr.replace(key, value)
              })
            }

            var result = 0
            // console.log('-------result------'+'result = ' + sourceAttr)
            eval('result = ' + sourceAttr)
            /* if(true){
              console.log('-------result------'+'result = ' + sourceAttr)

              continue
            } */

            if (typeof result !== 'string') {
              result = this.toFixed(result)
              /* if(true){
                console.log(result+'-------result------'+'result = ' + sourceAttr)

                continue
              } */
            }
            this.mainData[desColumnName] = result

            let column = this.formColumnsMap[desColumnName]
            // 触发change事件
            this._handlerValueChange(column, this.mainData[desColumnName])
          } else {
            // 单个明细表
            if (sourceAttr.startsWith(title)) {
              let sourceAttrArray = sourceAttr.split('.')
              let columnName = sourceAttrArray[1]
              // console.info(key+'------'+columnName);
              if (summaryData[columnName] != undefined) {
                this.mainData[desColumnName] = summaryData[columnName]
                let column = this.formColumnsMap[desColumnName]
                // 触发change事件
                this._handlerValueChange(column, this.mainData[desColumnName])
              }
            }
          }
        }
      }
    },
    getSubForm (key) { // 获取明细表组件
      let subForms = this.$refs['sub-form-' + key]
      if (subForms && subForms.length > 0) {
        return subForms[0]
      } else {
        return subForms
      }
    },
    getFileColumns () { // 获取附件列
      return this.fileColumns
    },
    deepSubFormData (config, data, tableData, parentNode) { // getData中组装明细表数据时 兼容明细表是树表组装数据
      // 自动给明细表增加排序
      let index = 0
      let columns = config.queryColumns
      let rule = config.rule
      data.forEach(item => {
        item['SORT_'] = ++index
        // 判断是否有回填规则或者默认值
        if (rule) {
          for (let columnName in rule) {
            let key = rule[columnName]
            // 判断key是否常量
            if (key != undefined && String(key).indexOf('{') === -1 && this.validUtil.isNull(item[key])) {
              item[columnName] = key
            } else {
              item[columnName] = item[key]
            }
          }
        }
        // 如果是树表设置上级
        if (config.isTree) {
          item[config.parentColumn] = parentNode ? parentNode['id'] : config.rootId
        }
        let filesData = []
        let deleteFilesData = []
        // 判断是否有日期时间字段，如果有，则把LABEL_格式化后的值赋
        columns.forEach(column => {
          if (column.widgetType == 'select-date' || column.widgetType == 'select-time' || column.widgetType == 'select-date-time') {
            let value = item[column.columnName + 'LABEL_']
            if (value) {
              item[column.columnName] = item[column.columnName + 'LABEL_']
            }
          } else if (column.widgetType == 'file') {
            let filesList = item[column.columnName + 'filesList'] || []
            let deleteFilesList = item[column.columnName + 'deleteFilesList'] || []
            filesData = filesData.concat(filesList)
            deleteFilesData = deleteFilesData.concat(deleteFilesList)
          } if (item[column.columnName] && typeof item[column.columnName] !== 'string' && (column.multiple == 1 && (column.widgetType == 'select' || column.widgetType == 'select-dic' || column.widgetType == 'select-sql'))) {
            let str = ''
            item[column.columnName].forEach(item => { str += item + ',' })
            if (str) {
              str = str.slice(0, str.length - 1)
            }
            item[column.columnName] = str
          } else if (column.widgetType === 'select-user-list' || column.widgetType === 'select-role-list' || column.widgetType === 'select-depart-list') {
            var subForms = {
              subFormForeignKey: column.subFormForeignKey, // 明细表中外键，对应主表主键
              subFormTable: column.tableName// 明细表数据库表名
            }
            let edit = item[column.columnName]
            if (typeof edit !== 'object') {
              edit = []
            }
            // 自动给明细表增加排序
            let index = 0
            if (edit && edit.length > 0) {
              edit.forEach(item => {
                item['SORT_'] = ++index
              })
            }
            delete item[column.columnName]
            if (edit && edit.length > 0) {
              subForms['data'] = JSON.stringify(edit)
              subFormData.push(subForms)
            }
          }
        })
        // 保存明细表附件
        if (filesData.length > 0) {
          item['filesData'] = JSON.stringify(filesData)
          item['deleteFilesData'] = JSON.stringify(deleteFilesData)
        }
        tableData.push(item)

        // 遍历下级数据
        if (item['children'] && item['children'].length > 0) {
          // 递归组装明细表数据
          this.deepSubFormData(config, item['children'], tableData, item)
        }
      })
    },
    getData () {
      // console.log('-------getData------')
      var subFormData = new Array()
      // 处理多个明细表配置同一个数据库表的逻辑
      let subFormMap = {}
      if (this.subForms) {
        this.subForms.forEach(element => {
          // 如果非静默才可以保存
          if (element.silence === undefined || element.silence === 0) {
            // 单个明细表对象
            var subForm = {
              subFormForeignKey: element.config.subFormForeignKey, // 明细表中外键，对应主表主键
              subFormTable: element.config.tableName// 明细表数据库表名
            }
            let rule
            // 判断是否明细表配置了控件参数,在其中配置了字段规则
            if (this.validUtil.isNotNull(element.attr)) {
              try {
                let attr = JSON.parse(element.attr)
                if (attr && attr['rule']) {
                  rule = attr['rule']
                }
              } catch (e) {
                console.log('-----getData-解析明细表控件参数---------', e)
              }
            }
            element.config.rule = rule
            // 传递是否树表
            subForm.isTree = element.config.isTree
            subForm.rootId = element.config.rootId
            subForm.parentColumn = element.config.parentColumn
            let tableData = []
            // console.log('-------columns--------'+element.config.queryColumns)
            if (element.config.tableData && element.config.tableData.length > 0) {
              // 递归组装明细表数据
              this.deepSubFormData(element.config, element.config.tableData, tableData)
            }
            // console.log('-------getData------',element.config,tableData)
            // 判断是否之前有相同的明细表已经保存过
            let tempSubForm = subFormMap[subForm.subFormTable]
            if (tempSubForm) {
              let data = JSON.parse(tempSubForm['data'])
              data = data.concat(tableData)
              tempSubForm['data'] = JSON.stringify(data)
            } else {
              // 单个明细表数据List<Map<String,Object>>的json字符串
              subForm['data'] = JSON.stringify(tableData)
              // 明细表对象数组
              subFormData.push(subForm)
              subFormMap[subForm.subFormTable] = subForm
            }
          }
        })
      }
      // console.log('-------subFormData-------', subFormData)
      if (this.mainData['PROC_STATUS_']) {
        delete this.mainData['PROC_STATUS_']
      }
      this.formColumns.forEach(column => {
        if (column.widgetType === 'select-user-list' || column.widgetType === 'select-role-list' || column.widgetType === 'select-depart-list') {
          var subForm = {
            subFormForeignKey: column.subFormForeignKey, // 明细表中外键，对应主表主键
            subFormTable: column.tableName// 明细表数据库表名
          }
          let tableData = this.mainData[column.columnName]
          if (typeof tableData !== 'object') {
            tableData = []
          }

          // 自动给明细表增加排序
          let index = 0
          if (tableData && tableData.length > 0) {
            tableData.forEach(item => {
              item['SORT_'] = ++index
            })
          }
          // 判断是否之前有相同的明细表已经保存过
          let tempSubForm = subFormMap[subForm.subFormTable]
          console.log('-----user-------', subFormMap, subForm, subFormData)
          if (tempSubForm) {
            let data = JSON.parse(tempSubForm['data'])
            data = data.concat(tableData)
            tempSubForm['data'] = JSON.stringify(data)
          } else {
            // 单个明细表数据List<Map<String,Object>>的json字符串
            subForm['data'] = JSON.stringify(tableData)
            subFormData.push(subForm)
            subFormMap[subForm.subFormTable] = subForm
          }
          delete this.mainData[column.columnName]
        }
        // 如果为省市级联
        if (column.widgetType === 'select-cascade') {
          var subForm = {
            subFormForeignKey: column.subFormForeignKey, // 明细表中外键，对应主表主键
            subFormTable: column.tableName// 明细表数据库表名
          }
          let cascade = this.$refs[column.columnName + 'cascade'][0]
          if (cascade) {
            // let tableData = {}
            let tableData = cascade.getCheckedNodes()[0]
            // 自动给明细表增加排序
            let sort = 1
            let subData = []
            if (tableData && tableData.path) {
              tableData.path.forEach(item => {
                subData.push({'SORT_': sort, 'PARENT_ID_': item, 'COLUMN_ID_': column.id, 'VALUE_': tableData.pathLabels[sort - 1]})
                sort++
              })
              this.mainData[column.columnName] = cascade.inputValue
            } else {
              tableData = this.mainData[column.columnName + 'cascade']
              if (tableData && tableData.length > 0) {
                tableData.forEach(item => {
                  subData.push({'SORT_': sort, 'PARENT_ID_': item.value, 'COLUMN_ID_': column.id, 'VALUE_': item.label})
                  sort++
                })
              }
            }
            subForm['data'] = JSON.stringify(subData)
            subFormData.push(subForm)
          }
        }
        if (column.widgetType === 'select' || column.widgetType === 'select-sql' || column.widgetType === 'select-dic') {
          // this.mainData[column.columnName] = this.mainData[column.columnName + 'LABEL_']
          // 如果是多选
          if (column.multiple === 1) {
            let options = this.mainData[column.columnName + 'LABEL_']
            let str = ''
            for (let i = 0; i < options.length; i++) {
              if (i != 0) {
                str += ','
              }
              str += options[i]
            }
            this.mainData[column.columnName] = str
          }
        }
        // 如果是时间格式
        if (column.widgetType === 'select-date' && typeof this.mainData[column.columnName] !== 'string') {
          let format = 'yyyy-MM-dd'
          if (column.dateType === 'year') {
            format = 'yyyy'
          } if (column.dateType === 'month') {
            format = 'yyyy-MM'
          } if (column.dateType === 'datetime') {
            format = 'yyyy-MM-dd hh:mm:ss'
          }
          let value = this.mainData[column.columnName]
          if (typeof this.mainData[column.columnName] === 'number') {
            value = new Date(this.mainData[column.columnName])
          }
          this.mainData[column.columnName] = value.format(format)
        }
      })

      // console.log('-----final-------', subFormData)
      var mainData = {...this.mainData}// 主表数据，是Map<String,Object>
      for (let key in mainData) {
        if (typeof mainData[key] === 'object') {
          delete mainData[key]
        }
      }

      // 新增附件列表数组
      var filesList = []
      // 删除附件id逗号隔开字符串
      var deleteFilesList = []
      // console.info(this)
      // console.info(this.$refs)
      // 循环所有附件
      this.formColumns.forEach(column => {
        if (column.widgetType === 'file' && (column.silence === undefined || column.silence === 0)) {
          // console.info('-----uploading_------' + 'uploading_' + column.columnName)
          let uploading = this.$refs['uploading_' + column.columnName]
          // console.info(uploading === undefined || uploading.length === 0?'--空--':'--有值---')
          if (uploading) {
            if (uploading.length > 0) {
              uploading = uploading[0]
            }
            // console.info(uploading.filesList)
            let fileList = uploading.getFilesList()
            // console.info('-----fileList-----'+fileList)
            if (fileList) {
              filesList = filesList.concat(fileList)
            }
            if (uploading.deleteFilesList) {
              deleteFilesList = deleteFilesList.concat(uploading.deleteFilesList)
            }
          }
        }
      })
      // console.log(subFormData)
      var params = {
        sqlTableName: this.defaultConfig.tableName, // 主表数据库表名
        // mainFormData: JSON.stringify(mainData),//主表数据，map的json字符串，兼容老版本
        mainFormDataMap: mainData, // 主表数据,map对象
        subFormData: JSON.stringify(subFormData), // 明细表数组的json字符串
        filesList: filesList, // 新增附件列表数组
        deleteFilesList: deleteFilesList, // 删除附件id逗号隔开字符串
        ifSaveWorkflow: false// 是否执行流程，如果是，保存完业务数据后，自动调用流程提交;如果否只是执行保存业务数据
      }

      // 组装摘要
      if (this.defaultConfig.abstracts) {
        let abstracts = this.defaultConfig.abstracts
        let keys = abstracts.match(/\{(.*?)\}/gi) // 匹配所有类似[项目名称]的变量
        // console.info(keys)
        if (keys) {
          keys.forEach(key => {
            let columnName = key.trim().substring(key.indexOf('{') + 1, key.indexOf('}'))
            // console.log(key+'----------'+columnName)
            let column = this.formColumnsMap[columnName]
            // console.log(columnName+'----------',column)
            let value = ''
            if (column) {
              if (column.widgetType && column.widgetType === 'select-form') {
                value = this.mainData[columnName + 'LABEL_'] || this.mainData[columnName]
              } else if (column.widgetType && (column.widgetType === 'select' || column.widgetType === 'select-dic' || column.widgetType === 'select-sql')) {
                if (column.options) {
                  let options = column.options.find(item => {
                    if (item.value === this.mainData[columnName]) {
                      return item
                    }
                  })
                  value = options ? options.name : this.mainData[columnName]
                }
              } else {
                value = this.mainData[columnName]
              }
            } else {
              value = this.getConstValue(columnName)
            }
            value = (this.validUtil.isNotNull(value) ? value : '')
            abstracts = abstracts.replace(new RegExp(key, 'gm'), value)
          })
        }
        params['abstracts'] = abstracts
      }

      let businessKey = this.defaultConfig.businessKey
      if (this.validUtil.isNotNull(businessKey)) {
        params['id'] = businessKey// 业务数据主键
        params['businessKey'] = businessKey// 业务数据主键，流程用到
      }
      params['currentUserUid'] = this.sessionUtil.getUserUid()
      params['currentUserName'] = this.sessionUtil.getUserName()
      params['currentUserId'] = this.sessionUtil.getUserId()
      if (this.validUtil.isNotNull(this.defaultConfig.formKey)) {
        params['formKey'] = this.defaultConfig.formKey// 业务表单key
      }
      params['subject'] = this.mainData['TITLE_'] || this.mainData['SUBJECT_']
      params['formId'] = this.formId
      params['formInfoId'] = this.formInfoId
      // console.log(params)
      return params
    },
    mask () {
      // console.log('------mask-----')
      this.loading = true
    },
    unmask () {
      // console.log('------unmask-----')
      this.loading = false
    },
    hideProcessMonitor () {
      this.processMonitorVisible = false
    },
    initProcess () { // 流程初始化
      this.processForm = this.$refs['process-form']
      if (this.processForm) {
        this.processForm.initProcess()
      }
      let processMonitor = this.$refs['process-monitor']
      if (processMonitor && this.validUtil.isNotNull(this.businessKey)) {
        // console.log('----------processMonitor-----------')
        processMonitor.initProcess(this.businessKey)
      }
      // console.info(this.$refs)
      // console.info(this.$refs['mainForm'])
      // console.info(this.$refs+'-------------'+this.$refs['process-form'])
    },
    checkValidSubForm (config, data) { // 验证明细表
      let _this = this
      let validFlag = true
      if (data) {
        for (let i = 0; i < data.length; i++) {
          const element = data[i]
          let noValue = true
          for (let j = 0; j < config.queryColumns.length; j++) {
            const column = config.queryColumns[j]
            let value = element[column.columnName]
            if (value != undefined && value != '' && column.columnName != 'SORT_') { // 最后判断子表是否有空数据
              noValue = false
            }
          }
          // 如果整行都为空
          if (noValue) {
            data.splice(i, 1)
          }
        }
        for (let i = 0; i < data.length; i++) {
          const element = data[i]
          let flag = true
          let msg = ''
          for (let j = 0; j < config.queryColumns.length; j++) {
            const column = config.queryColumns[j]
            let value = element[column.columnName]
            // 先判断是否有必填项未填
            if (column.require === 1) {
              if (!value && value != 0) {
                msg = config.title + '第' + (i + 1) + '行' + column.title + '未填写'
                validFlag = false
                flag = false
              }
            }
            if (column.validRule) {
              let validRule = column.validRule
              for (let j = 0; j < config.queryColumns.length; j++) {
                const edit = config.queryColumns[j]
                if (validRule.indexOf(edit.columnName) > -1) {
                  validRule = validRule.replace(new RegExp('{' + edit.columnName + '}', 'gm'), parseFloat(element[edit.columnName]))
                }
              }
              if (!eval(validRule)) {
                msg = config.title + '第' + (i + 1) + '行' + column.validMessage
                flag = false
                validFlag = false
                break
              }
            }
          }
          if (!flag) {
            _this.util.warn(msg)
            validFlag = false
            break
          }

          // 如果是树表则验证下级
          if (element['children'] && element['children'].length > 0) {
            let childFlag = _this.checkValidSubForm(config, element['children'])
            if (!childFlag) {
              validFlag = false
              break
            }
          }
        }
      }
      return validFlag
    },
    checkValid () { // 表单校验
      let _this = this
      // console.info(this.mainData);
      // console.info(this.rules);
      var p = new Promise(function (resolve, reject) {
        // console.info('-----1-----');
        let validFlag = true
        // 保存已经托管到process-form
        _this.$refs['mainForm'].validate((valid) => { // 先判断主表是否填写正确
          if (valid) {
            let msg = null
            // console.info('-----2-----');
            // 主表自定义校验规则
            if (_this.formColumns) {
              let mainData = _this.mainData
              for (let i = 0; i < _this.formColumns.length; i++) {
                let column = _this.formColumns[i]
                validFlag = _this.checkFieldValid(column)
                if (!validFlag) {
                  msg = column.validMessage
                  break
                }
              }
            }
            if (msg) {
              _this.util.warn(msg)
            }
            // 子表自定义校验规则
            if (_this.subForms) {
              for (let i = 0; i < _this.subForms.length; i++) {
                let form = _this.subForms[i]
                let flag = _this.checkValidSubForm(form.config, form.config.tableData)
                if (!flag) {
                  validFlag = false
                  break
                }
              }
            }
            if (validFlag) {
              resolve()
            } else {
              reject()
            }
          } else {
            _this.util.warn('表单校验错误！')
            reject('表单校验错误！')
          }
        })
      })
      return p
    },
    submit (type) { // 按钮触发函数
      let _this = this
      // console.info(this.defaultConfig.parent)
      // 如果是打印
      // 判断是否跳转打印页面
      if (type === 9 || type === 10) {
        let formConfig = _this.defaultConfig
        let param = {
          'type': '2',
          'formInfoId': formConfig.id
        }
        this.subList = []
        formConfig.formColumns = formConfig.formColumns.filter(e => {
          if (e.widgetType === 'sub-form') {
            // 删除子表关联parent
            this.subList.push(e)
          }
          return e.widgetType !== 'sub-form'
        })
        this.html5Params = {
          formConfig: formConfig,
          subConfig: this.subList[0],
          data: this.mainData,
          type: '2',
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
              this.getFormData()
              this.openReport()
            }
          } else {
            // 如果有多个子表
            if (this.subList.length > 1) {
              this.modalList = this.subList
              this.selectModalVisible = true
            } else {
              this.html5Params.grf = JSON.stringify(utils.getReport(formConfig, 2, this.subList[0]))
              this.getFormData()
              this.openReport()
            }
          }
        })
        return
      } else if (type === 0 || type != -1) {
        // 关闭
        if (_this.defaultConfig.parent && _this.defaultConfig.parent.closeForm) {
          _this.subFormsVisible = false
          _this.defaultConfig.parent.closeForm()
        }
        // 判断是否直接打开表单
        if (this.$route.path && this.$route.path.indexOf('/form/edit/') > -1) {
          this.$router.go(-1)
        }
        if (type === -1) {
          // 刷新父页面数据
          if (_this.defaultConfig.parent && _this.defaultConfig.parent.loadData) {
            _this.defaultConfig.parent.loadData()
          }
        }
        return
      }
      this.checkValid().then(() => {
        _this.submitData() // 保存数据
      })
    },
    openReport () {
      if (this.html5Params.grf && this.html5Params.data) {
        if (this.ImageList) {
          this.html5Params.grf = JSON.parse(this.html5Params.grf)
          this.html5Params.grf.ImageList = this.ImageList
          this.html5Params.grf = JSON.stringify(this.html5Params.grf)
        }
        webapp.webapp_urlprotocol_startup()
        setTimeout(() => {
          webapp.webapp_ws_run({}, this.html5Params.grf, JSON.stringify(this.html5Params.data))
        }, 100)
      }
    },
    selectModal () {
      this.modalList.forEach(edit => {
        if (edit.selected === true) {
          if (edit.grf) {
            this.$set(this.html5Params, 'grf', edit.grf)
          } else {
            let grf = JSON.stringify(utils.getReport(this.html5Params.formConfig, 2, edit))
            this.$set(this.html5Params, 'grf', grf)
          }
        }
      })
      this.getFormData()
      this.openReport()
    },
    getFormData () {
      let formConfig = this.defaultConfig
      let data = JSON.parse(JSON.stringify(this.mainData))
      if (!data) return null
      let result = {'Table': []}
      result.Table.push(this.filterData(data, formConfig))
      let subdata = []
      if (this.subList.length > 0) {
        let flag = true
        this.subList.forEach(eidt => {
          if (eidt.selected === true) {
            flag = false
            this.html5Params.formConfig.formColumns.push(eidt)
            subdata = this.filterSubData(eidt.config.tableData, eidt.config)
          }
        })
        if (flag) {
          this.html5Params.formConfig.formColumns.push(this.subList[0])
          subdata = this.filterSubData(this.subList[0].config.tableData, this.subList[0].config)
        }
      }
      if (subdata.length > 0) {
        result.Detail1 = subdata
      }
      this.html5Params.data = result
    },
    dicValue (column, value, dicMap) { // 数据字典label
      // console.info(column)
      // console.info(JSON.stringify(column))
      if (column) {
        // console.info('---column.columnName---'+column.columnName+'-------'+this.dicMap[column.columnName]+'-------'+value)
        // console.info(JSON.stringify(this.dicMap))
        if (dicMap[column.columnName]) {
          // console.info('---dicMap[column.columnName]---'+JSON.stringify(this.dicMap[column.columnName]))
          // console.info(value+'-------'+this.dicMap[column.columnName][value+''])
          return dicMap[column.columnName][value]
        }
      }
      return value || ''
    },
    // 过滤数据
    filterData (data, formConfig) {
      if (!data || !formConfig) return
      formConfig.formColumns.forEach(e => {
        if (e && (e.widgetType === 'select-form' ||
                     e.widgetType === 'select-user' ||
                     e.widgetType === 'select-depart' ||
                     e.widgetType === 'select-date' ||
                     e.widgetType === 'select-role' ||
                     e.widgetType === 'select-dic' ||
                     e.widgetType === 'select-time' ||
                     e.widgetType === 'select-date-time' ||
                     e.columnName === 'CREATE_USER_')
        ) {
          if (data[e.columnName + 'LABEL_']) {
            data[e.columnName] = data[e.columnName + 'LABEL_']
            delete data[e.columnName + 'LABEL_']
          }
        }
        if (e.widgetType === 'select-dic' || e.widgetType === 'select-sql' || e.widgetType === 'select') {
          let str = ''
          if (e.options) {
            if (e.multiple === 1) {
              str = data[e.columnName]
            } else {
              let option = e.options.find(v => {
                return v.value == data[e.columnName]
              })
              if (option) {
                str = option.name
              }
            }
          }
          data[e.columnName] = str
          delete data[e.columnName + 'LABEL_']
        }
        if (e.widgetType === 'select-user-list' || e.widgetType === 'select-role-list' || e.widgetType === 'select-depart-list') {
          let arr = data[e.columnName]
          let str = ''
          if (arr && arr.length > 0) {
            for (let index = 0; index < arr.length; index++) {
              if (index != 0) {
                str += ','
              }
              str += arr[index].userName
            }
          }
          data[e.columnName] = str
        }
        if (e.widgetType === 'select-cascade') {
          data[e.columnName] = data[e.columnName + 'placeholder']
          delete data[e.columnName + 'cascade']
        }
        if (e.widgetType === 'file') {
          let uploading = this.$refs['uploading_' + e.columnName]
          if (uploading) {
            let fileArr = uploading[0].fileArr
            let str = ''
            for (let index = 0; index < fileArr.length; index++) {
              if (index != 0) {
                str += ','
              }
              str += fileArr[index].fileName
            }
            data[e.columnName] = str
          }
        }
        // 如果是switch控件 判断是否选中 默认1为是 0 为否
        if (e.widgetType === 'switch') {
          data[e.columnName] = (data[e.columnName + '_SWITCH'] == 'true') ? '是' : '否'
        }
      })
      data = Object.assign(data, this.flowData)
      return data
    },
    getFlowData () { // 打印时需要
      let _this = this
      if (this.mainData && this.mainData.ID_) {
        let params = {
          businessKey: this.mainData.ID_,
          flag: true
        }
        let data = {}
        getFlow(params).then(res => {
          if (res) {
            for (let index = 0; index < res.length; index++) {
              data[res[index].name] = res[index].comment
              let image = {'Image': ''}
              if (res[index].sign) {
                getFlowImg(res[index].sign).then(res1 => {
                  if (res1) {
                    image.Image = res1
                    data[res[index].name + 'sign'] = res1
                  }
                })
              }
              this.ImageList.push(image)
              if (res[index].endTime) {
                data[res[index].name + 'endTime'] = res[index].endTime.split(' ')[0]
              }
            }
          }
          this.flowData = data
        })
      }
    },
    // 过滤子表数据
    filterSubData (data, config) {
      if (!data || !config) return
      data.forEach(item => {
        config.queryColumns.forEach(e => {
          if (e && (e.widgetType === 'select-form' ||
                        e.widgetType === 'select-user' ||
                        e.widgetType === 'select-depart' ||
                        e.widgetType === 'select-date' ||
                        e.widgetType === 'select-role' ||
                        e.widgetType === 'select-dic' ||
                        e.widgetType === 'select-time' ||
                        e.widgetType === 'select-date-time' ||
                        e.columnName === 'CREATE_USER_')
          ) {
            if (item[e.columnName + 'LABEL_']) {
              item[e.columnName] = item[e.columnName + 'LABEL_']
              delete data[e.columnName + 'LABEL_']
            }
            if (config.dicMap) {
              item[e.columnName] = this.dicValue(e, item[e.columnName], config.dicMap)
            }
          }
        })
      })
      return data
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
    checkFieldValid (column) { // 验证主表列的合法性
      if (column.validRule) {
        let validRule = column.validRule
        for (let j = 0; j < this.formColumns.length; j++) {
          const edit = this.formColumns[j]
          if (validRule.indexOf(edit.columnName) > -1) {
            validRule = validRule.replace(new RegExp('{' + edit.columnName + '}', 'gm'), parseFloat(this.mainData[edit.columnName]))
          }
        }
        // console.log('------validRule-----',column,validRule)
        if (!eval(validRule)) {
          return false
        }
      }
      return true
    },
    validateField (rule, value, callback) { // 自定义验证字段
      // console.log('---------validateField----------'+value)
      if (rule.required) {
        // console.info(rule)
        if (rule.column.widgetType === 'file') {
          let uploading = this.$refs['uploading_' + rule.column.columnName]
          if (uploading) {
            if (uploading.length > 0) {
              uploading = uploading[0]
            }
            // console.info(uploading.filesList)
            let fileList = uploading.getFilesArr()
            if (fileList.length === 0) {
              return callback(new Error(rule.message))
            }
          }
        } else {
          // console.log(rule.column.columnName+'------'+rule.type+'------'+rule.column.widgetType+'------------'+value)
          if (rule.type === 'number') {
            if (rule.column.widgetType && (rule.column.widgetType === 'select' || rule.column.widgetType === 'select-sql' || rule.column.widgetType === 'select-dic')) {
              if (value === undefined) {
                return callback(new Error(rule.message))
              }
            } else {
              if (!value || value === '0' || value === 0) {
                return callback(new Error(rule.message))
              }
            }
          } else {
            if (!value) {
              return callback(new Error(rule.message))
            }
          }
        }
      }
      if (rule.validType) {
        // console.info('-----validateField----')
      }
      if (!this.checkFieldValid(rule.column)) {
        rule.message = rule.column.validMessage
        // console.log('---------',rule.column.validMessage)
        return callback(new Error(rule.column.validMessage))
      }
      callback()
    },
    submitData () { // 最终提交
      // eslint-disable-next-line no-unused-vars
      let _this = this
      // console.info('----1----')
      var params = this.getData()

      // console.info('----2----')
      // 调用api
      saveData(params).then(res => {
        // console.info(this.$refs)
        // console.info('----3----')
        // return
        // 判断是否刷新父页面
        if (_this.defaultConfig.parent && _this.defaultConfig.parent.closeForm) {
          _this.defaultConfig.parent.closeForm()
          // setTimeout(function(){
          //   // _this.defaultConfig.parent.closeForm()
          // },5000);
        }
        if (_this.config.parent && _this.defaultConfig.parent.handlerSaveDataCallback) {
          _this.defaultConfig.parent.handlerSaveDataCallback(this.validUtil.isNull(params.businessKey) ? 'new' : 'edit', params, res.id)
        } else {
          if (_this.config.parent && _this.defaultConfig.parent.loadData) {
            _this.defaultConfig.parent.loadData()
          }
        }

        _this.util.success('成功')
      })
    },
    saveDataCallback (type, params) { // 流程控件保存回调
      // console.log('------------saveDataCallback--------------' + type)
      // 办理，驳回，撤销
      if (type === 6 || type === 5 || type === 3) {
        this.$router.go(-1)
        if (type === 3) { // 撤销
          this.$bus.$emit('handlerApplyReload', params)
        } else {
          this.$bus.$emit('handlerApprovalReload', params)
          this.$bus.$emit('handlerCopyReload', params)
        }
      }
      if (type === 8) {
        if (this.config.parent === undefined) {
          this.$router.go(-1)
          this.$bus.$emit('handlerApplyReload', params)
        }
      }
      if (this.config.parent && this.defaultConfig.parent.loadData) {
        this.defaultConfig.parent.loadData()
        this.submit(type)
      }
    },
    // 选人点击事件
    selectMember (column) {
      if (!this.formColumnReadOnly(column)) {
        // console.info('========selectMember======')
        this.selectMemberModels.isShow = true
        this.selectMemberModels.form = column
        this.selectMemberModels.radioSelectFlags = (column.widgetType === 'select-user')
      }
    },
    removeProcUser (user, column) {
      this.mainData[column.columnName] = this.mainData[column.columnName].filter(
        item => {
          return item != user
        }
      )
    },
    initApiConfig (column) { // 表单初始化遍历字段，统计api接口触发
      if (column.apiConfig) {
        let _this = this
        let apiConfig = column.apiConfig
        if (apiConfig.children) {
          apiConfig.children.forEach(item => {
            // 判断是否需要表单传参
            if (item.value && item.value.indexOf('{') > -1) {
              let value = item.value.trim()
              let columnName = value.substring(value.indexOf('{') + 1, value.indexOf('}'))
              // console.info(columnName)
              let apiSourceData = _this.apiSourceData[columnName]
              if (apiSourceData == undefined) {
                apiSourceData = []
                _this.apiSourceData[columnName] = apiSourceData
              }
              apiSourceData.push(apiConfig)
            }
          })
        }
      }
      // console.info(this.apiSourceData)
    },
    initRuleComputeConfig (columns, column, mainData) { // 字段初始化所有拼接的方法
      let rule = column.sourceAttr
      let _this = this
      // console.info(this.defaultConfig)
      // this.ruleComputeData[column.columnName] = rule
      // return
      // console.info(rule)
      let keys = rule.match(/\[(.*?)\]/gi) // 匹配所有类似[项目名称]的变量
      // console.info(keys)
      if (keys) {
        keys.forEach(key => {
          let columnName = key.trim().substring(key.indexOf('[') + 1, key.indexOf(']'))
          // console.info(columnName)
          // 先判断是否是表单字段
          let col = columns.find(item => {
            return item.title === columnName
          })
          if (col !== undefined && col !== null) {
            if (_this.ruleComputeData[col.columnName] === undefined) {
              _this.ruleComputeData[col.columnName] = []
            }
            _this.ruleComputeData[col.columnName].push({
              rule: rule,
              keys: keys,
              desColumnName: column.columnName
            })
          } else {
            if (_this.ruleComputeData[columnName] === undefined) {
              _this.ruleComputeData[columnName] = []
            }
            _this.ruleComputeData[columnName].push({
              rule: rule,
              keys: keys,
              desColumnName: column.columnName
            })
          }
        })
      }
      // console.info( _this.ruleComputeData)
    },
    computeRuleComputeConfig (columnName) { // 计算数据来源为规则计算的表单
      // console.info('-------computeRuleComputeConfig------'+columnName,this.ruleComputeData,this.ifFormEditRender)
      // console.log(this.mainData)
      // return
      let _this = this
      let ruleComputeData = null
      // 设置默认是初始化触发
      let isInit = true
      if (columnName !== undefined) {
        let temp = this.ruleComputeData[columnName]
        if (temp) {
          // 说明是单字段触发
          isInit = false
          ruleComputeData = {}
          ruleComputeData[columnName] = this.ruleComputeData[columnName]
        } else {
          return
        }
      } else {
        // 说明是初始化新增的时候全部算一次
        ruleComputeData = this.ruleComputeData
      }
      // console.log('-----ruleComputeData----',ruleComputeData)
      // console.info(ruleComputeData)
      // return
      if (ruleComputeData != null) {
        // return
        for (let key in ruleComputeData) {
          let ruleConfigArr = ruleComputeData[key]
          for (let m = 0; m < ruleConfigArr.length; m++) {
            var ruleConfig = ruleConfigArr[m]
            let desColumnName = ruleConfig['desColumnName']

            // 如果是loadData之后调用，且该字段有值，则说明可能是编辑状态，编辑的时候不再进行计算
            if (isInit && this.validUtil.isNotNull(this.mainData[desColumnName])) {
              continue
            }

            // console.log('------1111-------',desColumnName,ruleConfig)

            var value = ruleConfig.rule + ''
            let keys = ruleConfig.keys
            // console.info('--rule-'+value)
            keys.forEach(key => {
              let srcColumnTitle = key.trim().substring(key.indexOf('[') + 1, key.indexOf(']'))
              let srcColumnName = _this.formColumnTitleMap[srcColumnTitle]
              let srcColumn = _this.formColumnsMap[srcColumnName]
              // console.info(srcColumnTitle+'---------'+srcColumnName)

              let val = null
              if (srcColumn) {
                // 说明是数据库字段
                if (srcColumn.widgetType === 'select-form' || srcColumn.widgetType === 'select-user' || srcColumn.widgetType === 'select-depart') {
                  val = '"' + _this.mainData[srcColumnName + 'LABEL_'] + '"'
                  // console.info('---val----'+val)
                } else if (srcColumn.widgetType === 'select' || srcColumn.widgetType === 'select-dic' || srcColumn.widgetType === 'select-sql') {
                  let options = srcColumn.options
                  // console.info(options)
                  if (options) {
                    let option = options.find(option => {
                      return option.value === _this.mainData[srcColumnName]
                    })
                    if (option) {
                      val = '"' + option.name + '"'
                    }
                  }
                } else if (srcColumn.widgetType === 'select-date' || srcColumn.widgetType === 'select-time' || srcColumn.widgetType === 'select-date-time') {
                  val = '"' + _this.mainData[srcColumnName] + '"'
                } else {
                  // console.log('----------22-----------',srcColumnName,srcColumn)
                  if (srcColumn.javaType === 'String') {
                    val = '"' + _this.mainData[srcColumnName] + '"'
                  } else {
                    val = _this.mainData[srcColumnName]
                  }
                }
                // console.info(srcColumnTitle+'----'+srcColumn.javaType+'-----'+val)
                if (val == 'undefined' || val == '"undefined"' || val === undefined || val === null || val === '') {
                  if (srcColumn.javaType === 'Integer' || srcColumn.javaType === 'Double' || srcColumn.javaType === 'Float') {
                    val = 0
                  } else {
                    val = '""'
                  }
                }
              } else {
                // 判断是否系统常量
                val = '"' + this.getConstValue(srcColumnTitle) + '"'
              }
              // console.info(srcColumnTitle+'---22222-----'+val)
              // console.info(key+'--'+(val == '"undefined"')+'--'+typeof val+'--'+val)
              // console.info(val.length+'--'+'undefined'.length)
              if (val == 'undefined' || val == '"undefined"' || val === undefined || val === null) {
                val = '""'
              }
              value = value.replace(key, val)
            })

            // 判断是否有变量{}
            if (value.indexOf('{') > -1 && value.indexOf('}') > -1) {
              if (this.defaultConfig && this.defaultConfig.initValues) {
                let initValues = this.defaultConfig.initValues
                // console.info(initValues)
                if (initValues) {
                  for (let key in initValues) {
                    value = value.replace('{' + key + '}', initValues[key])
                  }
                }
              }
            }
            // console.info(desColumnName+'---value---'+('value = ' + value))
            // 判断是否日期计算
            if (value.indexOf('addDays') > -1) {
              // console.log('--------进入--------')
              value = value.replace('addDays', '_this.util.addDays')
            }
            try {
              eval('value = ' + value)
              // value = this.toFixed(value)
              // console.info(typeof value)
              let desColumn = _this.formColumnsMap[desColumnName]
              // 如果不是编辑时第一次渲染，或者编辑时第一次渲染，但是时静默类型，则就每次都计算
              if (!this.ifFormEditRender || (this.ifFormEditRender && desColumn && desColumn.silence && desColumn === 1)) {
                if (value === 'NaN') {
                  _this.mainData[desColumnName] = 0
                } else {
                  _this.mainData[desColumnName] = value
                  if (typeof _this.mainData[desColumnName] !== 'string') {
                    _this.mainData[desColumnName] = this.toFixed(value)
                  }
                }
              }
            } catch (e) {

            }
          }
          // console.info(desColumnName+'---value---'+value)
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
    registerSubFormChangeEvent (column) { // 明细表注册事件，主表字段切换修改明细表
      if (column.config && column.config.events) {
        let events = column.config.events
        let _this = this
        events.forEach(event => {
          // console.log(event,parseInt(event.type))
          if (parseInt(event.type) === EVENT_TYPE.SUB_FORM_CHANGE_BY_MAIN_FORM) {
            // console.info('------1-----')
            if (event.apiConfig) {
              let apiConfig = event.apiConfig
              // console.info('-----------' + apiConfig.id)
              if (apiConfig.children) {
                // console.info('------22-----')
                apiConfig.children.forEach(item => {
                  // 判断是否需要表单传参
                  if (item.value && item.value.indexOf('{') > -1) {
                    let value = item.value.trim()
                    let columnName = value.substring(value.indexOf('{') + 1, value.indexOf('}'))
                    // console.info(columnName)
                    let apiSourceData = _this.apiSourceData[columnName]
                    if (apiSourceData == undefined) {
                      apiSourceData = []
                      _this.apiSourceData[columnName] = apiSourceData
                    }
                    apiConfig.eventType = EVENT_TYPE.SUB_FORM_CHANGE_BY_MAIN_FORM
                    apiConfig.subFormKey = column.columnName
                    apiSourceData.push(apiConfig)
                  }
                })
              }
              // console.info(_this.apiSourceData)
            }
          }
        })
      }
    },
    // 选人回调函数
    memberCallBack () {
      this.selectMemberModels.isShow = false
      var vm = this
      this.formRows.forEach(element => {
        element.forEach(e => {
          if (e.columnName === this.selectMemberModels.form.columnName) {
            if (this.selectMemberModels.form.widgetType === 'select-user') {
              if (this.selectMemberModels.selectList.length > 0) {
                vm.$set(vm.mainData, e.columnName + 'LABEL_', this.selectMemberModels.selectList[0].userName)
                vm.$set(vm.mainData, e.columnName, this.selectMemberModels.selectList[0].id)
                // 如果不关联
                if (this.selectMemberModels.form.ifNotRelated == 1) {
                  if (e.columnName.lastIndexOf('UID_') > -1 || e.columnName.lastIndexOf('ID_') > -1) {
                    vm.$set(vm.mainData, e.columnName, this.selectMemberModels.selectList[0].id)
                    vm.$set(vm.mainData, e.columnName + 'LABEL_', this.selectMemberModels.selectList[0].id)
                  }
                  if (e.columnName.lastIndexOf('NAME_') > -1) {
                    vm.$set(vm.mainData, e.columnName, this.selectMemberModels.selectList[0].userName)
                    vm.$set(vm.mainData, e.columnName + 'LABEL_', this.selectMemberModels.selectList[0].userName)
                  }
                }
                // 判断字段是否为ID_或UID_结尾 是则给NAME_也赋值
                if (e.columnName.lastIndexOf('UID_') > -1) {
                  let name = e.columnName.split('UID_')
                  vm.$set(vm.mainData, name[0] + 'NAME_', this.selectMemberModels.selectList[0].userName)
                }
                if (e.columnName.lastIndexOf('ID_') > -1) {
                  let name = e.columnName.split('ID_')
                  vm.$set(vm.mainData, name[0] + 'NAME_', this.selectMemberModels.selectList[0].userName)
                }
                // 如果是NAME_结尾 给ID_和UID_也赋值
                if (e.columnName.lastIndexOf('NAME_') > -1) {
                  let name = e.columnName.split('NAME_')
                  vm.$set(vm.mainData, name[0] + 'ID_', this.selectMemberModels.selectList[0].id)
                  vm.$set(vm.mainData, name[0] + 'UID_', this.selectMemberModels.selectList[0].id)
                }
              }
            } else if (this.selectMemberModels.form.widgetType === 'select-user-multi') {
              // eslint-disable-next-line no-unused-vars
              var labels = ''
              var ids = ''
              this.selectMemberModels.selectList.forEach(element => {
                labels += element.userName + ','
                ids += element.id + ','
              })
              labels = labels.substring(0, labels.length - 1)
              ids = ids.substring(0, ids.length - 1)
              vm.$set(vm.mainData, e.columnName + 'LABEL_', labels)
              vm.$set(vm.mainData, e.columnName, ids)

              // 如果不关联
              if (this.selectMemberModels.form.ifNotRelated == 1) {
                if (e.columnName.lastIndexOf('UID_') > -1 || e.columnName.lastIndexOf('ID_') > -1) {
                  vm.$set(vm.mainData, e.columnName, ids)
                  vm.$set(vm.mainData, e.columnName + 'LABEL_', ids)
                }
                if (e.columnName.lastIndexOf('NAME_') > -1) {
                  vm.$set(vm.mainData, e.columnName, labels)
                  vm.$set(vm.mainData, e.columnName + 'LABEL_', labels)
                }
              }
              // 判断字段是否为ID_或UID_结尾 是则给NAME_也赋值
              if (e.columnName.lastIndexOf('UID_') > -1) {
                let name = e.columnName.split('UID_')
                vm.$set(vm.mainData, name[0] + 'NAME_', labels)
              }
              if (e.columnName.lastIndexOf('ID_') > -1) {
                let name = e.columnName.split('ID_')
                vm.$set(vm.mainData, name[0] + 'NAME_', labels)
              }
              // 如果是NAME_结尾 给ID_和UID_也赋值
              if (e.columnName.lastIndexOf('NAME_') > -1) {
                let name = e.columnName.split('NAME_')
                vm.$set(vm.mainData, name[0] + 'ID_', ids)
                vm.$set(vm.mainData, name[0] + 'UID_', ids)
              }
            } else if (this.selectMemberModels.form.widgetType === 'select-user-list') {
              var value = []
              let attr = this.selectMemberModels.form.attr
              // console.log('---------attr-------'+attr)
              this.selectMemberModels.selectList.forEach(item => {
                if (this.validUtil.isNotNull(attr)) {
                  item.USER_NAME_ = item.userName
                  item.USER_UID_ = item.id
                  item.PICTURE_ = item.picture
                  let rule

                  try {
                    let attrObj = JSON.parse(attr)
                    if (attrObj && attrObj['rule']) {
                      rule = attrObj['rule']
                    }
                  } catch (e) {
                    console.log('-------memberCallBack---多选人回调解析控件参数报错----', e)
                  }

                  if (rule) {
                    for (let columnName in rule) {
                      let key = rule[columnName]
                      // 判断key是否常量
                      if (key != undefined && String(key).indexOf('{') === -1 && this.validUtil.isNull(item[key])) {
                        item[columnName] = key
                      } else {
                        item[columnName] = item[key]
                      }
                    }
                  }
                  // 说明是直接写死类型 接的写法
                  /* let options = attr.split(';')
                  options.forEach(item => {
                    let option = item.split(',')
                    // 存入键值对
                    if (item[option[1]]) {
                      item[option[0]] = item[option[1]]
                    }
                  }) */
                } else {
                  item.USER_NAME_ = item.userName
                  item.USER_UID_ = item.id
                  item.PICTURE_ = item.picture
                }
                value.push(item)
              })
              vm.$set(vm.mainData, e.columnName, value)
            }
          }
        })
      })
    },
    closeProcessForm () { // 关闭流程处理
      this.processFormVisible = !this.processFormVisible
    },
    // 选角色点击事件
    selectRole (column, row, index) {
      if (!this.formColumnReadOnly(column)) {
        this.selectRoleModels.isShow = true
        this.selectRoleModels.form = column
        this.selectRoleModels.selectList = this.mainData[column.columnName] || []
        this.selectRoleModels.radioSelectFlags = (column.widgetType === 'select-role')
      }
    },
    // 选角色回调函数
    selectRoleCallBack () {
      let vm = this
      if (this.selectRoleModels.selectList.length == 0) {
        this.util.warn('请至少选择一个角色！')
        return false
      }
      this.selectRoleModels.isShow = false
      this.formRows.forEach(element => {
        element.forEach(e => {
          if (e.columnName === this.selectRoleModels.form.columnName) {
            if (this.selectRoleModels.form.widgetType === 'select-role') {
              vm.$set(vm.mainData, e.columnName + 'LABEL_', this.selectRoleModels.selectList[0].roleName)
              vm.$set(vm.mainData, e.columnName, this.selectRoleModels.selectList[0].id)
              if (e.columnName.lastIndexOf('UID_') > -1) {
                let name = e.columnName.split('UID_')
                vm.$set(vm.mainData, name[0] + 'NAME_', this.selectRoleModels.selectList[0].roleName)
              }
              if (e.columnName.lastIndexOf('ID_') > -1) {
                let name = e.columnName.split('ID_')
                vm.$set(vm.mainData, name[0] + 'NAME_', this.selectRoleModels.selectList[0].roleName)
              }
            } else if (this.selectRoleModels.form.widgetType === 'select-role-multi') {
              // eslint-disable-next-line no-unused-vars
              var labels = ''
              var ids = ''
              this.selectRoleModels.selectList.forEach(element => {
                labels += element.roleName + ','
                ids += element.id + ','
              })
              vm.$set(vm.mainData, e.columnName + 'LABEL_', labels.substring(0, labels.length - 1))
              vm.$set(vm.mainData, e.columnName, ids.substring(0, ids.length - 1))

              if (e.columnName.lastIndexOf('UID_') > -1) {
                let name = e.columnName.split('UID_')
                vm.$set(vm.mainData, name[0] + 'NAME_', labels.substring(0, labels.length - 1))
              }
              if (e.columnName.lastIndexOf('ID_') > -1) {
                let name = e.columnName.split('ID_')
                vm.$set(vm.mainData, name[0] + 'NAME_', labels.substring(0, labels.length - 1))
              }
            } else if (this.selectRoleModels.form.widgetType === 'select-role-list') {
              var value = []
              let attr = this.selectRoleModels.form.attr
              this.selectRoleModels.selectList.forEach(item => {
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
                  item.ROLE_NAME_ = item.roleName
                  item.ROLE_UID_ = item.id
                }
                value.push(item)
              })
              vm.$set(vm.mainData, e.columnName, value)
            }
          }
        })
      })
    },
    // 选部门点击事件
    selectQuerters (column) {
      if (!this.formColumnReadOnly(column)) {
        this.selectQuertersModels.isShow = true
        this.selectQuertersModels.form = column
        this.selectQuertersModels.radioSelectFlags = (column.widgetType === 'select-depart')
      }
    },
    // 选部门回调函数
    quertersCallBack () {
      if (this.selectQuertersModels.selectList.length === 0) {
        this.util.warn('请至少选择一个部门！')
        return false
      }
      this.selectQuerters.isShow = false
      var vm = this
      this.formRows.forEach(element => {
        element.forEach(e => {
          if (e.columnName === this.selectQuertersModels.form.columnName) {
            if (this.selectQuertersModels.form.widgetType === 'select-depart') {
              vm.$set(vm.mainData, e.columnName + 'LABEL_', this.selectQuertersModels.selectList[0].label)
              vm.$set(vm.mainData, e.columnName, this.selectQuertersModels.selectList[0].id)
              if (e.columnName.lastIndexOf('UID_') > -1) {
                let name = e.columnName.split('UID_')
                vm.$set(vm.mainData, name[0] + 'NAME_', this.selectQuertersModels.selectList[0].label)
              }
              if (e.columnName.lastIndexOf('ID_') > -1) {
                let name = e.columnName.split('ID_')
                vm.$set(vm.mainData, name[0] + 'NAME_', this.selectQuertersModels.selectList[0].label)
              }
            } else if (this.selectQuertersModels.form.widgetType === 'select-depart-multi') {
              // eslint-disable-next-line no-unused-vars
              var labels = ''
              var ids = ''
              this.selectQuertersModels.selectList.forEach(element => {
                labels += element.label + ','
                ids += element.id + ','
              })
              vm.$set(vm.mainData, e.columnName + 'LABEL_', labels.substring(0, labels.length - 1))
              vm.$set(vm.mainData, e.columnName, ids.substring(0, ids.length - 1))

              if (e.columnName.lastIndexOf('UID_') > -1) {
                let name = e.columnName.split('UID_')
                vm.$set(vm.mainData, name[0] + 'NAME_', labels.substring(0, labels.length - 1))
              }
              if (e.columnName.lastIndexOf('ID_') > -1) {
                let name = e.columnName.split('ID_')
                vm.$set(vm.mainData, name[0] + 'NAME_', labels.substring(0, labels.length - 1))
              }
            } else if (this.selectQuertersModels.form.widgetType === 'select-depart-list') {
              var value = []
              let attr = this.selectQuertersModels.form.attr
              this.selectQuertersModels.selectList.forEach(item => {
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
                  item.departName = item.label
                  item.DEPART_NAME_ = item.label
                  item.DEPART_UID_ = item.id
                }
                value.push(item)
              })
              vm.$set(vm.mainData, e.columnName, value)
            }
          }
        })
      })
    },
    computeInitValue (column, mainData) { // 表单新增初始化计算初始值
      // console.info(column)
      if (column.sourceType === 'current-user-uid') {
        if (column.widgetType && column.widgetType === 'select-user') {
          mainData[column.columnName] = this.sessionUtil.getUserUid()
          mainData[column.columnName + 'LABEL_'] = this.sessionUtil.getUserName()
        } else {
          mainData[column.columnName] = this.sessionUtil.getUserUid()
        }
      } else if (column.sourceType === 'current-user-id') {
        mainData[column.columnName] = this.sessionUtil.getUserId()
      } else if (column.sourceType === 'current-user-name') {
        mainData[column.columnName] = this.sessionUtil.getUserName()
      } else if (column.sourceType === 'current-depart-uid') {
        if (column.widgetType && column.widgetType === 'select-depart') {
          mainData[column.columnName] = this.sessionUtil.getDepartUid()
          mainData[column.columnName + 'LABEL_'] = this.sessionUtil.getDepartName()
        } else {
          mainData[column.columnName] = this.sessionUtil.getDepartUid()
        }
      } else if (column.sourceType === 'current-depart-id') {
        mainData[column.columnName] = this.sessionUtil.getDepartId()
      } else if (column.sourceType === 'current-depart-name') {
        mainData[column.columnName] = this.sessionUtil.getDepartName()
      } else if (column.sourceType === 'current-company-uid') {
        if (column.widgetType && column.widgetType === 'select-depart') {
          mainData[column.columnName] = this.sessionUtil.getDepartUid()
          mainData[column.columnName + 'LABEL_'] = this.sessionUtil.getDepartName()
        } else {
          mainData[column.columnName] = this.sessionUtil.getDepartUid()
        }
      } else if (column.sourceType === 'current-company-id') {
        mainData[column.columnName] = this.sessionUtil.getDepartId()
      } else if (column.sourceType === 'current-company-name') {
        mainData[column.columnName] = this.sessionUtil.getDepartName()
      } else if (column.sourceType === 'current-date') {
        mainData[column.columnName] = (new Date()).format('yyyy-MM-dd')
        // mainData[column.columnName] = new Date()
      } else if (column.sourceType === 'current-datetime') {
        // mainData[column.columnName] = new Date()
        mainData[column.columnName] = (new Date()).format('yyyy-MM-dd hh:mm:ss')
      } else if (column.sourceType === 'current-year') {
        mainData[column.columnName] = new Date().getFullYear()
      } else if (column.sourceType === 'current-month') {
        mainData[column.columnName] = new Date().getMonth() + 1
      } else if (column.sourceType === 'current-week') {
        mainData[column.columnName] = this.util.getYearWeek()
      } else if (column.sourceType === 'current-next-monday') { // 下周一
        mainData[column.columnName] = this.util.getNextMonday()
      } else if (column.sourceType === 'current-month-first') { // 本月第一天
        mainData[column.columnName] = this.util.getCurrentMonthFirst()
      } else if (column.sourceType === 'current-month-last') { // 本月最后一天
        mainData[column.columnName] = this.util.getCurrentMonthLast()
      } else if (column.sourceType === 'next-month-first') { // 本月第一天
        mainData[column.columnName] = this.util.getNextMonthFirst()
      } else if (column.sourceType === 'next-month-last') { // 本月最后一天
        mainData[column.columnName] = this.util.getNextMonthLast()
      }
      // console.log(column.columnName+'-----------'+mainData[column.columnName])
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
      }
    }
  }
}
