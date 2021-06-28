
// eslint-disable-next-line no-unused-vars
import {getConfig} from '@/api/form-render'
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'

export const mixin = {
  name: 'form-view',
  data: function () {
    return {
      queryForm: {1: {
        show: false
      },
      2: {
        show: false
      },
      3: {
        show: false
      }},
      levelNum: 1, // 层级
      routeQuery: null, // 路由中的query
      selectCatalog: false, // 选择上级目录
      singleQuery: false, // 单查询
      singleShow: false, // 单查询
      cascadeShow: false, // 级联页面
      cascadeTwoQuery: false, // 级联左右
      cascadeThreeQuery: false, // 级联左右（上下）
      queryShow: false, // 单查询
      queryFormShow: false, // 查询-表单
      formShow: false, // 单表单
      formKey: '', // 表单key
      formConfig: {},
      activeName: '',
      width: 0,
      topButtons: [],
      keyword: '',
      urlShowCheckBox: false, // 单个表单兼容url地址传参
      urlAssignShowCheckBox: {}, // 多个表单兼容url地址传参
      searchVisible: false
    }
  },
  props: {
    openConfig: { // 列表或者按钮或者传统触发弹框打开页面时使永
      type: Object,
      default: function () {
        return undefined
      }
    },
    readOnly: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    config: {
      type: Object,
      default: function () {
        return {}
      }
    },
    queryParams: {
      type: Object,
      default: function () {
        return {}
      }
    },
    singleSelect: {
      type: Boolean,
      default: false
    },
    multipleSelect: { // 多选
      type: Boolean,
      default: false
    },
    hasTitle: { // 是否有标题
      type: Boolean,
      default: true
    },
    isModal: { // 是否是弹窗
      type: Boolean,
      default: false
    },
    selectFormKey: {
      type: String,
      default: ''
    },
    assignShowCheckBox: { // 是否显示checkbox,表单弹框时传参，可以指定其中哪一个form，assignShowCheckBox: {1:true}
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters([
      'getFormConfig'
    ])
  },
  created () {

  },
  mounted () {
    this.cascadeShow = false
    this.cascadeTwoShow = false
    this.cascadeThreeShow = false
    this.queryShow = false
    this.formShow = false
    this.queryFormShow = false
    this.routeQuery = null
    this.queryForm = {
      1: {
        show: false
      },
      2: {
        show: false
      },
      3: {
        show: false
      }
    }
    let width = document.body.clientWidth
    this.width = width
    this.queryFormCount = 0
    this.formKey = ''
    // 判断是否是选择，且配置的是选择目录
    this.init()
    // 判断是否是选择弹框，而且是单页面
  },
  methods: {
    ...mapMutations([
      'setFormConfig'
    ]),
    init () {
      console.log("表单初始化=========>>>>");
      let _this = this
      if (this.config && this.config !== undefined && this.config.title !== undefined) {
        this.cascadeShow = false
        this.queryForm[1] = this.config
        // 把当前组件传递给子组件
        this.queryForm[1].parent = this
        this.selectCatalog = true
        this.singleQuery = true
        this.queryFormCount = 1
      } else {
        let formKey = this.selectFormKey
        // 判断是否是选择弹框，而且配置的是关联表单
        if (!this.validUtil.isNotNull(formKey)) {
          formKey = this.$route.params.formKey
          // 获取路由中查询参数，一般用于打开菜单或者表单时传参
          let routeQuery = this.getRouteQuery()
          if (routeQuery.assignShowCheckBox) {
            this.urlAssignShowCheckBox = {...routeQuery.assignShowCheckBox}
            delete routeQuery.assignShowCheckBox
          }
          if (routeQuery.showCheckBox) {
            this.urlShowCheckBox = routeQuery.showCheckBox
            delete routeQuery.showCheckBox
          }
          this.routeQuery = routeQuery
        }
        // 判断是否直接打开表单
        console.log("判断是否直接打开表单======>>>");
        getConfig(formKey, this).then(data => {
          let formConfig = {}
          for (var key in data) {
            formConfig[key] = data[key]
          }
          if (formConfig) this.selectFormTitle = formConfig.title
          if (formConfig.width && !(formConfig.width.indexOf('px') > -1) && !(formConfig.width.indexOf('%') > -1)) formConfig.width = formConfig.width + 'px'
          if (formConfig.height && !(formConfig.height.indexOf('px') > -1) && !(formConfig.height.indexOf('%') > -1)) formConfig.height = formConfig.height + 'px'
          this.formConfig = formConfig
          this.$emit('on-load', formConfig)
          var type = this.$route.path.split('/')[2]
          if (type) {
            if (type === 'query') {
              this.queryFormShow = true
            } else if (type === 'view') {
              this.queryShow = true
            } else if (type === 'edit') {

            } else {
              // 说明不是通过路由进入，而是弹框
              this.queryShow = true
            }
          }

          // 默认页面层级
          let level = 1
          // 先排序，并计算层级，理论上第一个层级只能是一个表单,但是还是有数组接收
          let deepFormChildren = {} // 记录每个父级节点对应的子节点
          let deepForms = []
          if (this.formConfig.forms) {
            let forms = this.formConfig.forms
            forms.forEach(form => {
              form.singleSelect = this.singleSelect
              form.multipleSelect = this.multipleSelect
              form.show = true
              form.formKey = formKey
              // 设置自读属性
              form.readOnly = this.readOnly
              // 添加权限属性
              form.btnAdd = this.formConfig.btnAdd
              form.btnEdit = this.formConfig.btnEdit
              form.btnLook = this.formConfig.btnLook
              form.btnDelete = this.formConfig.btnDelete
              form.btnExport = this.formConfig.btnExport
              // 设置父组件
              form.parent = this

              if (this.validUtil.isNotNull(form.parentId)) {
                if (deepFormChildren[form.parentId] === undefined) {
                  deepFormChildren[form.parentId] = []
                }
                deepFormChildren[form.parentId].push(form)
              } else {
                // 如果parentId为空说明是第一层
                deepForms.push(form)
              }
            })
            
            deepForms = this.getTreeChild(deepForms, deepFormChildren, level)
          }
          // 默认第一层
          this.queryForm[1] = deepForms[0]
          let children = this.queryForm[1].children
          let assignShowCheckBox = this.validUtil.emptyObj(this.urlAssignShowCheckBox) ? this.assignShowCheckBox : this.urlAssignShowCheckBox
          if (children && children.length > 0) {
            // 默认多层结构是，最顶层既不是单选也不是多选
            this.queryForm[1].multipleSelect = false
            if (this.singleSelect || this.multipleSelect || this.readOnly) {
              this.queryForm[1].readOnly = true
            }
            // 有可能是弹框中指定了表单的单选或者多选状态
            this.queryForm[1].showCheckBox = assignShowCheckBox[this.queryForm[1]['tableName']] === undefined ? false : assignShowCheckBox[this.queryForm[1]['tableName']]

            if (this.queryForm[1].multipleSelect) {
              this.queryForm[1].singleSelect = false
            }

            if (children.length > 1) {
              // 说明是左右结构，且右侧为多个tab
              children.forEach(form => {
                form.multipleSelect = false
                if (this.singleSelect || this.multipleSelect || this.readOnly) {
                  form.readOnly = true
                }
                // 有可能是弹框中指定了表单的单选或者多选状态
                form.showCheckBox = assignShowCheckBox[form['tableName']] === undefined ? false : assignShowCheckBox[form['tableName']]

                if (form.multipleSelect) {
                  _form.singleSelect = false
                }
              })
              this.cascadeTwoQuery = true
              _this.queryForm[2] = {
                children
              }
              // 默认渲染第一个tab的按钮
              this.getTopButton(_this.queryForm[2].children[0])
            } else {
              // 说明有可能左右，有可能左右（上下）
              _this.queryForm[2] = children[0]
              if (this.singleSelect || this.multipleSelect || this.readOnly) {
                _this.queryForm[2].readOnly = true
              }
              // 有可能是弹框中指定了表单的单选或者多选状态
              _this.queryForm[2].showCheckBox = assignShowCheckBox[_this.queryForm[2]['tableName']] === undefined ? false : assignShowCheckBox[_this.queryForm[2]['tableName']]
              let son = this.queryForm[2].children
              if (son && son.length > 0) {
                // 默认
                _this.queryForm[2].multipleSelect = false
                // 说明是左右(上下)结构，且最下侧为多个tab
                son.forEach(form => {
                  form.multipleSelect = false
                  if (this.singleSelect || this.multipleSelect || this.readOnly) {
                    form.readOnly = true
                  }
                  // 有可能是弹框中指定了表单的单选或者多选状态
                  form.showCheckBox = assignShowCheckBox[form['tableName']] === undefined ? false : assignShowCheckBox[form['tableName']]

                  if (form.multipleSelect) {
                    _form.singleSelect = false
                  }
                })
                this.cascadeThreeQuery = true
              } else {
                this.cascadeTwoQuery = true
              }
            }
          } else {
            // 说明是单页面
            this.singleQuery = true
            if (this.urlShowCheckBox) {
              _this.queryForm[1].showCheckBox = true
              console.log('-------this.urlShowCheckBox------' + this.urlShowCheckBox)
            }
          }
          // 把配置的数据回填规则付给最后一个查询表单，因为一般回填规则只是回填级联页面
          if (this.formConfig.backFillMap) {
            _this.queryForm[_this.levelNum].backFillMap = this.formConfig.backFillMap
          }
          // _this.queryForm[_this.queryFormCount].ifHasProcess = this.formConfig.ifHasProcess
          // 把配置是否关联流程附给最后一个查询表单
          if (this.formConfig.ifHasProcess) {
            _this.queryForm[_this.levelNum].ifHasProcess = this.formConfig.ifHasProcess
          }
        })
        this.$forceUpdate()
      }
    },
    getTreeChild (forms, deepFormChildren, level) { // 递归组装树层级
      let isHashChildren = false
      // 排序
      forms.sort(function (a, b) {
        if (a.sort < b.sort) {
          return -1
        } else if (a.sort > b.sort) {
          return 1
        }
        return 0
      })
      forms.forEach(form => {
        form['level'] = level
        let children = deepFormChildren[form.id]
        if (children) {
          if (!isHashChildren) {
            isHashChildren = true
            level = level + 1
            this.levelNum = level
          }
          // 递归下级
          let newChild = this.getTreeChild(children, deepFormChildren, level)
          form['children'] = newChild
        }
      })
      return forms
    },
    getTopButton (config) {
      let searchVisible = false
      let queryColumns = config.queryColumns
      let ifNewBtn = false
      let ifImportBtn = false
      let ifExportBtn = false
      let topButtons = []
      if (queryColumns) {
        // 遍历每个表单中配置的查询列
        queryColumns.forEach(column => {
          if (column.matchType && column.row && column.col) {
            if (searchFormRows[column.row - 1] === undefined) {
              searchFormRows[column.row - 1] = []
            }
            searchFormRows[column.row - 1].push(column)
            searchFormColumns.push(column)
          }
          // 判单是否显示搜索框
          if (column.matchType) {
            searchVisible = true
          }
          if (column && column.javaType === 'TopButton') {
            if (column.columnName.toLowerCase() === 'new') {
              ifNewBtn = true
            }
            if (column.columnName.toLowerCase() === 'import') {
              ifImportBtn = true
            } else if (column.columnName.toLowerCase() === 'export') {
              ifExportBtn = true
            }
            topButtons.push(column)
          }
        })
        // 计算每个控件占每行的比例
        // console.info('----------');
        // console.info(topButtons);
        let standardButtons = []
        if (!ifNewBtn) {
          // console.info('--------------')
          // 添加默认新增按钮
          standardButtons.push({columnName: 'new', title: '新增', icon: 'el-icon-plus'})
          // topButtons = topButtons.splice(0,0,{columnName:'new',title:'新增',icon:'el-icon-plus'});
        }
        if (!ifImportBtn) {
          // 添加默认导入按钮
          // topButtons = topButtons.splice(0,0,{columnName:'import',title:'导入',icon:'el-icon-download'});
          standardButtons.push({columnName: 'import', title: '导入', icon: 'el-icon-download'})
        }
        if (!ifExportBtn) {
          // 添加默认新增按钮
          // topButtons = topButtons.splice(0,1,{columnName:'new',title:'导出',icon:'el-icon-upload2'});
          standardButtons.push({columnName: 'export', title: '导出', icon: 'el-icon-upload2'})
        }
        if (standardButtons.length > 0) {
          standardButtons.reverse().forEach(button => {
            topButtons.unshift(button)
          })
        }
      }
      this.topButtons = topButtons
      this.searchVisible = searchVisible
    },
    queryData (flag) {
      let params = {
        keyword: this.keyword
      }
      let queryForm = this.$refs['queryForm' + this.levelNum][this.activeName]
      // this.$emit('openForm')
      if (queryForm) {
        queryForm.queryData(params)
      }
    },
    handlerTopButtonClick (column) { // 当页面是tab时调用，这种情况一般最level的max最大值也就是levelNum
      // 判断是否自定义按钮
      if (column.openType && column.openUrl) {
        if (column.openType === 2) {
          this.openByName(column.openUrl, column.openParams)
        }
      } else {
        // 标准按钮新增
        if (column.columnName === 'new') {
          let queryForm = this.$refs['queryForm' + this.levelNum][this.activeName]
          // this.$emit('openForm')
          if (queryForm) {
            queryForm.handlerFormOpen()
          }
        }
        if (column.columnName === 'export') {
          let queryForm = this.$refs['queryForm' + this.levelNum][this.activeName]
          if (queryForm) {
            queryForm.handlerTopButtonClick(column)
          }
        }
      }
    },
    handleTabClick (tab, event) {
      let tabs = this.queryForm[this.levelNum].children[this.activeName]
      this.getTopButton(tabs)
    },
    closeForm () {
      // console.log(this)
      this.pare.closeForm()
      // this.parent.closeForm()
    },
    handlerRowClick (queryFormIndex, row) {
      console.log('----------handlerRowClick-----------', queryFormIndex, row)
      let queryForm = this.$refs['queryForm' + queryFormIndex]
      if (queryForm) {
        // console.log(queryForm)
        // 判断是否多个tab
        if (queryForm.length > 1) {
          queryForm.forEach(item => {
            if (item.handlerParentClick) {
              item.handlerParentClick(row)
            }
          })
          /* if (queryForm[this.activeName].handlerParentClick) {
            queryForm[this.activeName].handlerParentClick(row)
          } */
        } else {
          if (queryForm.handlerParentClick) {
            queryForm.handlerParentClick(row)
          }
        }
      }
      // console.info(queryForm)
    },
    getGridData (index) { // 获取选中的列表数据
      let queryForm = this.$refs['queryForm' + index || this.levelNum]
      if (queryForm) {
        return queryForm.gridData
      }
      return null
    },
    getSelectedData (index, flag) { // 表单作为弹框选择时 获取选中数据, index为指定table的索引,flag == 0是判断是否需要调用原生数据还是经过回填的数据
      console.log(index + '---------form-view------getSelectedData--------' + flag)
      let queryForm = this.$refs['queryForm' + (index || this.levelNum)]
      let selectedData = []
      if (queryForm && queryForm.getSelectedData) {
        // console.info(queryForm)
        if (flag !== undefined) {
          selectedData = queryForm.getSelectedData(flag)
        } else {
          selectedData = queryForm.getSelectedData()
        }
      }
      return selectedData
    },
    getSelectedTreeData (index,flag) { // 表单作为弹框选择时 获取选中数据, index为指定table的索引,flag == 0是判断是否需要调用原生数据还是经过回填的数据
      console.log(index+'---------form-view------getSelectedData--------'+flag)
      let queryForm = this.$refs['queryForm' + (index || this.levelNum)]
      let selectedData = []
      if (queryForm && queryForm.getSelectedTreeData) {

        // console.info(queryForm)
        if(flag !== undefined){
          selectedData = queryForm.getSelectedTreeData(flag)
        }else{
          selectedData = queryForm.getSelectedTreeData()
        }

      }
      return selectedData
    },
	  getRouteQuery () { // 获取路由query
      return this.$route.query
    }
  }
}
