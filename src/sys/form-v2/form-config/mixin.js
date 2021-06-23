
import {getConfig, saveConfig,getSqlDicData} from '@/api/form-render'
import CommonGridTable from '../../../common/table/grid-table/grid-table'
import CommonTreeTable from '../../../common/table/tree-table/tree-table'
import FormColumn from '../../../sys/form-v2/form-column/form-column'
import FormInfo from '../../../sys/form-v2/form-info/form-info'
import {mapGetters, mapMutations} from 'vuex'
import {widgetType, javaType, matchType, sourceType, titleAlign, dataAlign, sortRule, pageSize, eventType} from '../const'

export const mixin = {
  data: function () {
    return {
      config: {}, // 配置
      activeName: 'query-design',
      columnDialogVisible: false, // 显示列配置
      columnSelectDialogVisible: false, // 显示数据库列选择框
      dialogVisible: false, // form-info的表单编辑
      formTitle: '', // 表单弹框标题
      formKey: '', // 表单key
      formCount: 0, // 表单总数
      formData: {}, // 表单数据
      columnConfig: {}, // 列配置
      formInfoConfig: {}, // form-info配置信息
      selectedFormColumns: [], // 选中的表单中的列
      selectedGridRow: null, // 右侧编辑时选中的行
      selectedGridindex: null, // 右侧编辑时选中的行得index
      apiOptions: [],
      apiOptionsStr: '',
      eventGridShow: false, // 标记事件配置grid是否被点击过
      root: {}, // 表单树的根节点
      width: 0,
      subForms: [],
      subFormsMap: {},
      queryParams: {},
      showTab: false,
      formMap: {}, // 主表或明细表列表
      queryDesignGridConfig: {
        showPageBar: false,
        showCheckbox: true,
        edit: true,
        type: 'query-design',
        columns: [
          {
            columnName: 'title',
            javaType: 'String',
            width: 100,
            sortable: true,
            require: true,
            title: '标题',
            widgetType: 'input'
          }, {
            columnName: 'columnName',
            javaType: 'String',
            width: 120,
            require: true,
            sortable: true,
            title: '字段名称',
            widgetType: 'input'
          }, {
            columnName: 'javaType',
            javaType: 'String',
            title: 'javaType',
            width: 100,
            widgetType: 'select',
            attr: javaType
          }, {
            columnName: 'width',
            javaType: 'Integer',
            title: '宽度',
            width: 80,
            require: true,
            widgetType: 'number'
          }, {
            columnName: 'titleAlign',
            javaType: 'String',
            title: '标题位置',
            width: 80,
            require: true,
            widgetType: 'select',
            attr: titleAlign
          }, {
            columnName: 'dataAlign',
            javaType: 'String',
            title: '数据位置',
            width: 80,
            require: true,
            widgetType: 'select',
            attr: dataAlign
          }, {
            columnName: 'widgetType',
            javaType: 'String',
            title: '控件类型',
            width: 120,
            widgetType: 'select',
            require: true,
            attr: widgetType
          }, {
            columnName: 'attr',
            javaType: 'String',
            title: '控件参数',
            width: 100,
            hidden: true,
            widgetType: 'input'
          }, {
            columnName: 'matchType',
            javaType: 'String',
            title: '匹配类型',
            width: 100,
            widgetType: 'select',
            attr: matchType
          }, {
            columnName: 'initMatchValue',
            javaType: 'String',
            title: '匹配参数',
            width: 120,
            hidden: true,
            widgetType: 'input'
          }, {
            columnName: 'row',
            javaType: 'Integer',
            title: '行',
            width: 50,
            widgetType: 'number'
          }, {
            columnName: 'col',
            javaType: 'Integer',
            title: '列',
            width: 50,
            widgetType: 'number'
          }, {
            columnName: 'icon',
            javaType: 'String',
            title: '图标',
            width: 80,
            hidden: true,
            widgetType: 'input'
          }, {
            columnName: 'hidden',
            javaType: 'Integer',
            title: '隐藏',
            width: 80,
            widgetType: 'switch'
          }, {
            columnName: 'silence',
            javaType: 'Integer',
            title: '静默字段',
            width: 80,
            widgetType: 'switch'
          }, {
            columnName: 'openType',
            javaType: 'String',
            title: '打开方式',
            width: 80,
            hidden: true,
            widgetType: 'select',
            attr: '1,弹框;2,tab'
          }, {
            columnName: 'openUrl',
            javaType: 'String',
            title: '打开地址',
            width: 120,
            hidden: true,
            widgetType: 'input'
          }, {
            columnName: 'openParams',
            javaType: 'String',
            title: '路由参数',
            width: 120,
            hidden: true,
            widgetType: 'input'
          }, {
            columnName: 'sortRule',
            javaType: 'String',
            sortable: true,
            title: '排序规则',
            width: 100,
            widgetType: 'select',
            attr: sortRule
          }, {
            columnName: 'sort',
            javaType: 'Double',
            sortable: true,
            title: '排序',
            width: 80,
            widgetType: 'number'
          }
        ]
      },
      formDesignGridConfig: {
        showCheckbox: true,
        showPageBar: false,
        edit: true,
        type: 'form-design',
        columns: [
          {
            columnName: 'title',
            javaType: 'String',
            width: 100,
            sortable: true,
            require: true,
            title: '标题',
            widgetType: 'input'
          }, {
            columnName: 'columnName',
            javaType: 'String',
            width: 120,
            require: true,
            sortable: true,
            title: '字段名称',
            widgetType: 'input'
          }, {
            columnName: 'javaType',
            javaType: 'String',
            title: 'javaType',
            width: 100,
            widgetType: 'select',
            attr: javaType
          }, {
            columnName: 'widgetType',
            javaType: 'String',
            title: '控件类型',
            width: 120,
            widgetType: 'select',
            require: true,
            attr: widgetType
          }, {
            columnName: 'attr',
            javaType: 'String',
            title: '控件参数',
            hidden: true,
            width: 100,
            widgetType: 'input'
          }, {
            columnName: 'row',
            javaType: 'Integer',
            title: '行',
            width: 80,
            widgetType: 'number'
          }, {
            columnName: 'col',
            javaType: 'Integer',
            title: '列',
            width: 80,
            widgetType: 'number'
          }, {
            columnName: 'icon',
            javaType: 'String',
            title: '图标',
            width: 80,
            hidden: true,
            widgetType: 'input'
          }, {
            columnName: 'readOnly',
            javaType: 'Integer',
            title: '只读',
            width: 80,
            widgetType: 'switch'
          }, {
            columnName: 'hidden',
            javaType: 'Integer',
            title: '隐藏',
            width: 80,
            widgetType: 'switch'
          }, {
            columnName: 'silence',
            javaType: 'Integer',
            title: '静默字段',
            width: 80,
            widgetType: 'switch'
          }, {
            columnName: 'openType',
            javaType: 'String',
            title: '打开方式',
            width: 80,
            hidden: true,
            widgetType: 'select',
            attr: '1,弹框;2,tab'
          }, {
            columnName: 'openUrl',
            javaType: 'String',
            hidden: true,
            title: '打开地址',
            width: 120,
            widgetType: 'input'
          }, {
            columnName: 'openParams',
            javaType: 'String',
            hidden: true,
            title: '路由参数',
            width: 120,
            widgetType: 'input'
          }, {
            columnName: 'sourceType',
            javaType: 'String',
            title: '来源类型',
            hidden: true,
            width: 120,
            widgetType: 'select',
            attr: sourceType
          }, {
            columnName: 'sourceAttr',
            javaType: 'String',
            title: '数据来源',
            hidden: true,
            width: 120,
            widgetType: 'input'
          }, {
            columnName: 'sort',
            javaType: 'Double',
            title: '排序',
            width: 80,
            sortable: true,
            widgetType: 'number'
          }
        ]
      },
      eventDesignGridConfig: {
        showPageBar: false,
        showCheckbox: true,
        edit: true,
        type: 'event-design',
        columns: [
          {
            columnName: 'title',
            javaType: 'String',
            width: 200,
            sortable: true,
            require: true,
            title: '标题',
            widgetType: 'input'
          }, {
            columnName: 'formInfoId',
            javaType: 'String',
            width: 120,
            require: true,
            sortable: true,
            title: '表单名称',
            widgetType: 'select',
            attr: ''
          }, {
            columnName: 'type',
            javaType: 'String',
            width: 100,
            title: '事件类型',
            widgetType: 'select',
            attr: eventType
          }, {
            id: 'sys-select-api',
            columnName: 'apiId',
            javaType: 'Integer',
            title: '调用api',
            width: 200,
            require: true,
            widgetType: 'select-sql'
          }, {
            columnName: 'sort',
            javaType: 'Integer',
            title: '排序',
            width: 80,
            sortable: true,
            widgetType: 'number'
          }]
      },
      subFormDesignGridConfig: { // 明细表设计
        showPageBar: false,
        showCheckbox: true,
        edit: true,
        type: 'sub-form-design',
        columns: [
          {
            columnName: 'title',
            javaType: 'String',
            width: 100,
            sortable: true,
            require: true,
            title: '标题',
            widgetType: 'input'
          }, {
            columnName: 'columnName',
            javaType: 'String',
            width: 100,
            require: true,
            sortable: true,
            title: '字段名称',
            widgetType: 'input'
          }, {
            columnName: 'javaType',
            javaType: 'String',
            title: 'javaType',
            width: 100,
            widgetType: 'select',
            attr: javaType
          }, {
            columnName: 'width',
            javaType: 'Integer',
            title: '宽度',
            width: 80,
            require: true,
            widgetType: 'number'
          }, {
            columnName: 'widgetType',
            javaType: 'String',
            title: '控件类型',
            width: 120,
            widgetType: 'select',
            require: true,
            attr: widgetType
          }, {
            columnName: 'attr',
            javaType: 'String',
            title: '控件参数',
            width: 100,
            widgetType: 'input'
          }, {
            columnName: 'hidden',
            javaType: 'Integer',
            title: '隐藏',
            width: 80,
            widgetType: 'switch'
          }, {
            columnName: 'silence',
            javaType: 'Integer',
            title: '静默字段',
            width: 80,
            widgetType: 'switch'
          }, {
            columnName: 'summary',
            javaType: 'Integer',
            title: '合计',
            width: 80,
            widgetType: 'switch'
          }, {
            columnName: 'expression',
            javaType: 'String',
            title: '表达式',
            width: 80,
            widgetType: 'input'
          }, {
            columnName: 'sortRule',
            javaType: 'String',
            sortable: true,
            title: '排序规则',
            width: 100,
            widgetType: 'select',
            attr: sortRule
          }, {
            columnName: 'sort',
            javaType: 'Double',
            title: '排序',
            width: 80,
            sortable: true,
            widgetType: 'number'
          }
        ]
      },
      treeGridConfig: {
        treeColumn: 'title',
        parentColumn: 'parentId',
        rootId: '',
        rootText: '',
        showRoot: false,
        columns: [
          {
            columnName: 'title',
            javaType: 'String',
            width: 100,
            title: '标题'
          }
        ]
      }
    }
  },
  props: {

  },
  computed: {
    ...mapGetters([
      'getFormConfig'
    ])
  },
  components: {
    CommonGridTable, CommonTreeTable, FormInfo, FormColumn
  },
  created () {

  },
  mounted () {
    this.eventGridShow = false
    let formKey = this.getParam('formKey')
    // console.info('------formKey---'+formKey);
    let width = document.body.clientWidth
    this.width = width
    let _this = this
    window.onresize = () => {
      return (() => {
        _this.width = document.body.clientWidth
        // console.info('-----------')
      })()
    }
    // console.info(width)
    this.formKey = formKey
    this.init()
    // console.log(this.queryDesignGridConfig)
  },
  methods: {
    ...mapMutations([
      'setFormConfig'
    ]),
    init () {
      let _this = this
      // 加载表单
      getConfig(this.formKey, this).then(data => {
        // 替换显示标题显示根节点
        _this.config = data

        // 加载事件的数据
        getSqlDicData({columnId: 'sys-select-api', params: {formId: _this.config.id}}).then(options => {
          if (options) {
            // console.log('-------getSqlDicData------', options)
            /*let apiOptionsStr = ''
            options.forEach(item => {
              apiOptionsStr = apiOptionsStr + item.value + ',' + item.name + ';'
            })
            this.apiOptionsStr = apiOptionsStr*/
            this.apiOptions = options
            this.$forceUpdate()
          }
        })
        this.queryParams = {formId: this.config.id}
        this.showTab = true
        let forms = data.forms
        let subForms = []
        let subFormsMap = {}
        // 遍历明细表
        forms.forEach(form => {
          // 替换表单SWITCH开关值
          if (form['showTitle']) {
            form['showTitle_SWITCH'] = form['showTitle'] === 1
          }
          if (form['showRoot']) {
            form['showRoot_SWITCH'] = form['showRoot'] === 1
          }
          if (form['expandAll']) {
            form['expandAll_SWITCH'] = form['expandAll'] === 1
          }
          if (form['lazy']) {
            form['lazy_SWITCH'] = form['lazy'] === 1
          }
          if (form.formColumns) {
            form.formColumns.forEach(column => {
              if (column.widgetType && column.widgetType === 'sub-form') {
                column['key'] = form.id + '@' + column.columnName
                subFormsMap[column['key']] = column
                subForms.push(column)
              }
            })
          }
        })
        this.subFormsMap = subFormsMap
        this.subForms = subForms
        _this.initTree(forms)



      })
    },
    initTree (forms) {
      let root = {}
      root.children = []
      forms.forEach(form => {
        let parentId = form.id
        forms.forEach(form2 => {
          if (form2.parentId && form2.parentId === parentId) {
            if (form.children === undefined) {
              form.children = []
            }
            form.children.push(form2)
          }
        })
        if (form.parentId === undefined || form.parentId === '') {
          root.children.push(form)
        }
      })
      this.root = root
      // console.info(root.children)
      // this.treeGridConfig.data = root.children;
      this.loadTreeData(root.children)
    },
    loadTreeData (data) {
      this.$refs['tree-grid'].loadData(data)
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
        // console.info(columns)
        if (columns) {
          this.$refs[this.activeName][0].loadData(columns)
        } else {
          this.$refs[this.activeName][0].loadData([])
        }
      } else {
        if (this.activeName === 'event-design') {
          this.eventGridShow = true
          // 初始化表单名称
          let forms = this.getTreeData()
          // console.info(forms)
          let formList = ''
          forms.forEach(form => {
            formList += ';' + form.id + ',' + form.title
            this.formMap[form.id] = form.title
          })

          // 再循环明细表
          this.subForms.forEach(subForm => {
            // console.info(subForm)
            this.formMap[(subForm.id ? subForm.id : subForm.key)] = subForm.title
            formList += ';' + (subForm.id ? subForm.id : subForm.key) + ',' + subForm.title
          })

          formList = formList.substring(1)
          // console.info(formList)
          this.eventDesignGridConfig.columns[1].attr = formList
          // console.info(this.queryParams)
          // console.info(this.eventDesignGridConfig)
          // 更新列
          this.$refs[this.activeName].init()

          let tableData = this.$refs['event-design'].tableData
          if (tableData === undefined || tableData.length === 0) {
            let events = this.config.events
            if (events) {
              this.$refs[this.activeName].loadData(events)
            }
          }
        } else {
          let selectedForm = this.getSelectFrom()
          if (selectedForm != null) {
            this.handlerTreeRowClick(selectedForm)
            return
          }
          this.$refs[this.activeName].loadData([])
        }
      }
    },
    handlerSaveClick () { // 保存表单
      console.info('-----最终保存------')
      let eventData = this.$refs['event-design'].tableData
      // console.log(this.eventGridShow + '--------eventData--------' , eventData)
      if (eventData !== undefined && this.eventGridShow) {
        this.config.events = eventData
      } else {
        // 不做任何修改
      }
      // console.info(eventData)
      console.info(this.config)

      // return
      let config = {...this.config}
      if (config && config.forms) {
        config.forms.forEach(form => {
          if (form.children) {
            delete form.children
          }
          if (form._parent) {
            delete form._parent
          }
        })
      }
      let _this = this
      saveConfig(this.formKey, config).then(res => {
        _this.util.success('保存成功！')
      })
      // 保存到缓存
      this.setFormConfig(this.formKey, this.config)
    },
    handlerTreeRowClick (row) {
      // console.info('------handlerTreeRowClick-------'+row.id);
      // console.info(row);
      let tableData = []
      if (this.activeName === 'query-design') {
        if (row.queryColumns === undefined) {
          row.queryColumns = []
        }
        tableData = row.queryColumns

        this.selectedFormColumns = tableData
        this.$refs[this.activeName].loadData(tableData)
      } else if (this.activeName === 'form-design') {
        if (row.formColumns === undefined) {
          row.formColumns = []
        }
        tableData = row.formColumns
        this.selectedFormColumns = tableData
        this.$refs[this.activeName].loadData(tableData)
      }
      // console.info(tableData)
    },
    handlerTreeOperateClick (buttonId, index, row) {
      if (buttonId === 'edit') {
        this.formData = row
        this.formTitle = row.title
        this.formInfoConfig.parent = this
        this.dialogVisible = true
      } else if (buttonId === 'delete') {
        let _this = this
        this.util.confirm('确认要删除吗？', '提示', () => {
          // console.log('-----1------',_this.root)//
          _this.root.children = _this.root.children.filter(form => {
            if (form.id === row.id) {
              // 删除config
              _this.config.forms = _this.config.forms.filter(temp => {
                if (temp.id === row.id) {
                  return false
                }
                return true
              })

              return false
            }
            if (form.children) {
              form.children = form.children.filter(f => {
                if (f.id === row.id) {
                  // 删除config
                  _this.config.forms = _this.config.forms.filter(temp => {
                    if (temp.id === row.id) {
                      return false
                    }
                    return true
                  })
                  return false
                }
                return true
              })
              if (form.children.length === 0) {
                delete form.children
              }
            }
            return true
          })
          // console.log('-----2------',_this.root)
          // console.info(_this.root.children)
          _this.loadTreeData(_this.root.children)
        })
      }
    },
    handlerGridOperateClick (buttonId, index, row) { // 右侧列表操作按钮
      if (buttonId === 'edit') {
        // this.columnConfig = row;
        this.columnTitle = row.title
        this.columnDialogVisible = true
        // console.info('0000000000'+this.activeName)
        if (this.activeName === 'query-design') {
          this.columnConfig.type = 1
        } else if (this.activeName === 'form-design') {
          this.columnConfig.type = (row.widgetType === 'sub-form' ? 3 : 2)
          if (row.widgetType === 'sub-form') {
            if (row.config === undefined) {
              row.config = {
                entity: '',
                title: '',
                tableName: '',
                subFormForeignKey: '',
                queryColumns: []
              }
            }
            // console.info('-----------')
            // console.info(row.config)
            row.rootId = row.config.rootId
            row.rootText = row.config.rootText
            row.treeColumn = row.config.treeColumn
            row.parentColumn = row.config.parentColumn
            row.expandAll = row.config.expandAll
            row.tableName = row.config.tableName
            row.entity = row.config.entity
            row.subFormForeignKey = row.config.subFormForeignKey
          }
        } else if (this.activeName.indexOf('@') > -1) {
          // 说明明细表的列编辑
          this.columnConfig.type = 4
        }
        // console.info(row)
        this.columnConfig.data = row
        this.selectedGridRow = row
        this.selectedGridindex = index
      } else if (buttonId === 'delete') {
        this.handlerGridOperateDeleteClick(row)
      } else if (buttonId === 'up' || buttonId === 'down') { // 上移或下移
        this.handlerGridOperatePosClick(buttonId, index, row)
      }
    },
    swapItems (arr, index1, index2) { // 交换数组元素位置
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    handlerGridOperatePosClick (buttonId, index, row) { // 上移或下移
      let tableData = this.getActiveGrid().tableData
      let length = tableData.length
      if (buttonId === 'up') { // 上移
        if (index == 0) {
          return
        }
        tableData = this.swapItems(tableData, index, index - 1)
      } else if (buttonId === 'down') { // 下移
        if (index === tableData.length - 1) {
          return
        }
        tableData = this.swapItems(tableData, index, index + 1)
      }
      tableData.forEach((item, index) => {
        item['sort'] = (index + 1)
      })
      // console.info(tableData)
    },
    handlerGridOperateDeleteClick (row) { // 右侧列表左上角删除和操作列中删除出发的函数
      let deleteData = null
      if (row) {
        // console.info(row);
        deleteData = [row]
      } else {
        // 删除复选框选中
        let selectedData = this.getSelectedGridData(this.activeName)
        // console.info(selectedData);
        deleteData = selectedData
      }
      if (deleteData.length === 0) {
        this.util.warn('请至少选择一行数据!')
        return
      }
      let _this = this
      this.util.confirm('确认要删除吗？', '提示', () => {
        let tableData = _this.getActiveGrid().tableData
        // console.info(tableData)
        tableData = tableData.filter(item => {
          if (deleteData.indexOf(item) > -1) {
            return false
          }
          return true
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
        // console.info(tableData)
        // console.info(_this.root.children)
      })
    },
    handlerNewClick () { // 点击新增
      this.formData = {id: this.getFormId()}
      let treeData = this.getTreeData()
      this.formData.sort = treeData.length + 1
      let selectedTreeNode = this.getSelectFrom()
      if (selectedTreeNode != null) {
        this.formData.parentId = selectedTreeNode.id
      }
      this.formInfoConfig.parent = this
      // console.info(selectedTreeNode)
      this.dialogVisible = true
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
    handlerColumnInfoSaveClick () { // 列信息保存
      let form = this.$refs['column-info']
      form.checkValid().then(() => {
        let formData = form.getData()
        for (let key in formData) {
          let value = formData[key]
          this.selectedGridRow[key] = value
        }
        this.columnDialogVisible = false
        // console.info(this.getActiveGrid().tableData)
        // 判断当前列是否时明细表配置
        if (this.selectedGridRow['widgetType'] === 'sub-form') {
          if (!this.selectedGridRow.config) {
            this.selectedGridRow.config = {}
          }
          this.selectedGridRow.config['title'] = formData['title']
          this.selectedGridRow.config['entity'] = formData['entity']
          this.selectedGridRow.config['tableName'] = formData['tableName']
          this.selectedGridRow.config['subFormForeignKey'] = formData['subFormForeignKey']
          this.selectedGridRow.config['rootId'] = formData['rootId']
          this.selectedGridRow.config['rootText'] = formData['rootText']
          this.selectedGridRow.config['treeColumn'] = formData['treeColumn']
          this.selectedGridRow.config['parentColumn'] = formData['parentColumn']
          this.selectedGridRow.config['expandAll'] = formData['expandAll']
          // 想subForms和subFormsMap中插入数据
          let key = this.getSelectFrom().id + '@' + this.selectedGridRow['columnName']
          this.selectedGridRow.key = key
          if (!this.subFormsMap[key]) {
            this.selectedGridRow.queryColumns = []
            this.subFormsMap[key] = this.selectedGridRow
            this.subForms.push(this.selectedGridRow)
          }
        }
        // this.$set(this.getActiveGrid().tableData, this.selectedGridindex, this.selectedGridRow);
        // this.getActiveGrid().loadData(this.getActiveGrid().tableData);
        console.log(this.getActiveGrid().tableData)
        this.$forceUpdate()
      })
    },
    handlerFormInfoSaveClick () { // 表单信息保存
      let formInfo = this.$refs['form-info']
      formInfo.checkValid().then(() => {
        let formData = formInfo.getData()
        // console.info(formData)
        // 保存到左侧树中
        let id = formData['id']
        let parentId = formData['parentId']
        // console.info(id+'----'+parentId)
        // 遍历root 修改root中数据
        // if(parentId === undefined || parent)
        let parent = null
        let old = null
        if (this.isNull(parentId)) {
          // 说明是父亲根节点
          parent = this.root
          this.root.children.forEach(form => {
            if (form.id === id) {
              // 说明是修改
              old = form
              return false
            }
          })
        } else {
          this.root.children.forEach(form => {
            if (form.id === parentId) {
              parent = form
              // 直接遍历下级
              if (form.children) {
                form.children.forEach(f => {
                  if (f.id === id) {
                    // 说明是修改
                    old = f
                    return false
                  }
                })
              }
              return false
            }
            // 遍历子节点
            // 直接遍历下级
            form.children.forEach(f => {
              if (f.id === parentId) {
                parent = f
                if (f.children) {
                  f.children.forEach(ff => {
                    if (ff.id === id) {
                      // 说明是修改
                      old = ff
                      return false
                    }
                  })
                }
                return false
              }
            })
          })
        }
        // console.info(parent);
        // console.info(old);

        // 判断是否新增
        if (old === null) {
          if (parent.children === undefined) {
            parent.children = [formData]
          } else {
            parent.children.push(formData)
          }
          // 如果是新增，则组装到formConfig的forms里面
          this.config.forms.push(formData)
        } else {
          // 修改对象
          for (let key in formData) {
            if (key !== 'children' && key !== '_expanded' && key !== '_level' && key !== '_show' && key.indexOf('_SWITCH') < 0) {
              old[key] = formData[key]
            }
          }
        }
        // console.info(this.root.children);
        this.loadTreeData(this.root.children)
        this.dialogVisible = false
      })
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
    getSelectFrom () { // 获取左侧树表选中的表单
      let selectedTreeNode = this.$refs['tree-grid'].getSelectedData()
      if (selectedTreeNode && selectedTreeNode[0]) {
        return selectedTreeNode[0]
      }
      return null
    },
    getActiveGrid (grid) { // 获取右侧选中的grid
      let selectedGrid = this.$refs[grid === undefined ? this.activeName : grid]
      if (selectedGrid.length !== undefined) {
        selectedGrid = selectedGrid[0]
      }
      return selectedGrid
    },
    getSelectedGridData (grid) { // 获取左侧树表选中的表单
      let selectedTreeNode = this.getActiveGrid(grid).getSelectedData()
      if (selectedTreeNode) {
        return selectedTreeNode
      }
      return null
    },
    getFormId () { // 获取表单随机id
      let treeData = this.getTreeData()
      // console.info(treeData.length)
      this.formCount = treeData.length + 1
      return this.formKey + '-' + this.formCount
    },
    getTreeData () {
      let treeData = this.$refs['tree-grid'].getData()
      return treeData
    },
    handlerGridViewClick () { // 预览表单
      // 跳转路由
      let params = {
        'formKey': this.config.formKey,
        'title': this.config.title
      }
      this.$router.push({
        name: 'form-query',
        params: params
      })
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

      // console.info(grid)
      // console.info(data)
      // console.info(this.$copyText)
      // this.$copyText(JSON.stringify(data)).then(function (e) {
      //   // alert('Copied--'+window.clipboardData)
      //   console.info(window)
      //   // console.info(window.clipboardData)
      //   // var txt=window.clipboardData.getData("Text")
      //   // console.info(txt)
      //   // console.info(window.getSelection())
      //   console.log(e)
      // }, function (e) {
      //   alert('Can not copy')
      //   console.log(e)
      // })
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

      // console.info(event)
      // console.info(window.navigator)
      // console.info(window.navigator.clipboard)
      // navigator.clipboard.readText().then(
      //   clipText => alert(clipText));
      // console.info(window.navigator.clipboard.readText())
      // var clipboardData = (event.clipboardData || window.clipboardData);
      // console.info(clipboardData)
    }

  }
}
