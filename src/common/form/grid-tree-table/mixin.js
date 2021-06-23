import {getGridData, copy, getDicData, getTreeData } from '@/api/form-render'
import Vue from 'vue'
import excel from '@/utils/excel'
// import {formUtil} from '../form'

export const mixin = {
  data: function () {
    return {
      dicData: {},
      gridColumns: [],
      moreColumns: [],
      gridData: [],
      pageSize: 30,
      pageIndex: 1,
      pageCount: 0,
      totalCount: 0,
      parentSelectedRow: null, // 级联页面，父页面的选中行
      flag: true, // 判断是否有配置流程状态字段
      openDialogWidth: '',
      openDialogHeight: '',
      openConfig: {},
      rootId: null,
      selectExcelVisible: false,
      excelList: [],
      excelData: [],
      excelModal: null,
      uploadConfig: {
        limit: 10,
        limitSize: 50048576,
        // listType: 'picture-card',
        readOnly: false,
        xtype: 'test',
        accept: '.xlsx,.xls',
        acceptMsg: '只能传xls/xlsx格式文件'
      },
      searchPlaceholder: '请输入关键字'
    }
  },
  props: {

  },
  computed: {
    switchVal () {
      return true
    }
  },
  mounted () {
    this.keyword = ''
    this.formData = {}
    this.gridData = []
    this.pageSize = 30
    this.pageCount = 0
    this.pageIndex = 1
    this.totalCount = 0
    this.queryFormVisible = false
    this.searchFormRows = []
    this.searchFormColumns = []
    this.topButtons = []
    this.init()
  },
  methods: {
    init () {
      let _this = this
      let gridColumns = []
      let searchFormColumns = []
      let searchFormRows = []
      let searchVisible = false
      let searchPlaceholder = []
      let queryColumns = this.config.queryColumns
      let ifNewBtn = false
      let ifImportBtn = false
      let ifExportBtn = false
      let summaryColumns = null
      let topButtons = []
      let code = ''
      if (this.config.pageSize) this.pageSize = this.config.pageSize
      let formConfig = {}
      if (this.config.parent && this.config.parent.formConfig) {
        formConfig = this.config.parent.formConfig
        // formCode单号
        if (formConfig.formCode) code = formConfig.formCode.field
      }
      if (queryColumns) {
        // 遍历每个表单中配置的查询列
        queryColumns.forEach(column => {
          if (column.columnName && column.columnName === code) {
            if (!column.openParams && !column.openUrl) {
              let params = {'formKey': formConfig.formCode.formKey, 'businessKey': '{ID_}', 'disabled': true}
              column.openParams = JSON.stringify(params)
              column.openUrl = 'form-edit'
              column.openType = 1
            }
          }
          if (column.matchType && column.row && column.col) {
            if (searchFormRows[column.row - 1] === undefined) {
              searchFormRows[column.row - 1] = []
            }
            searchFormRows[column.row - 1].push(column)
            searchFormColumns.push(column)
          }
          // 如果是数表则配置有模糊查询
          if (column.matchType === 'like' && this.isTree && column.hidden !== 1) {
            searchPlaceholder.push(column.title)
            searchVisible = true
          }
          // 如果列表则配置过匹配类型就显示搜索框
          if (column.matchType && !this.isTree && column.hidden !== 1) {
            searchPlaceholder.push(column.title)
            searchVisible = true
          }
          if (column.widgetType === 'select') {
            let attr = column.attr
            column['options'] = []
            // 加载数据字典
            if (_this.validUtil.isNotNull(attr)) {
              if (attr.indexOf(',') > -1) {
                _this.dicMap[column.columnName] = {}
                // 说明是直接写死类型
                let data = {}
                let options = attr.split(';')
                options.forEach(item => {
                  let option = item.split(',')
                  _this.dicMap[column.columnName][column.javaType === 'Integer' ? parseInt(option[0]) : option[0]] = option[1]
                  // 存入键值对
                  data[column.javaType === 'Integer' ? parseInt(option[0]) : option[0]] = option[1]
                })
                column.options = data
              }
            }
          } else if (column.widgetType === 'select-dic') {
            let attr = column.attr
            getDicData(attr).then(dicData => {
              let data = {}
              if (dicData) {
                _this.dicMap[column.columnName] = {}
                dicData.forEach(item => {
                  // 存入键值对
                  data[item.value] = item.name
                  _this.dicMap[column.columnName][item.value] = item['name']
                })
                // _this.dicData[column.attr] = data;
              }
              this.$set(column, 'options', data)
              // _this.$refs['jr-table'].doLayout();
              this.$forceUpdate()
            })
          } else if (column.widgetType === 'tag') {
            let attr = column.attr
            if (_this.validUtil.isNotNull(attr)) {
              if (attr.indexOf(',') > -1) {
                let data = {}
                let options = attr.split(';')
                options.forEach(item => {
                  let option = item.split(',')
                  // 存入键值对
                  data[option[0]] = 'jr-tag-' + option[1]
                })
                column.tabMap = data
                // console.info(data)
              }
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
          if (column && column.javaType === 'TopButton') {
            if (column.columnName.toLowerCase() === 'new' && this.config.btnAdd == 1 && !this.readOnly && (!this.singleSelect && !this.multipleSelect)) {
              ifNewBtn = true
              topButtons.push(column)
            }
            if (column.columnName.toLowerCase() === 'import' && !this.readOnly && (!this.singleSelect && !this.multipleSelect)) {
              ifImportBtn = true
              topButtons.push(column)
            } else if (column.columnName.toLowerCase() === 'export' && !this.readOnly && this.config.btnExport == 1 && (!this.singleSelect && !this.multipleSelect)) {
              ifExportBtn = true
              topButtons.push(column)
            } else {
              topButtons.push(column)
            }
          } else if (column && column.javaType === 'CellButton') {
            if (column.columnName.toLowerCase() === 'edit' || column.columnName.toLowerCase() === 'delete') {
              if (column.columnName.toLowerCase() === 'edit' && column.hidden === 1) {
                this.showRowEditButton = false
              }
              if (column.columnName.toLowerCase() === 'delete' && column.hidden === 1) {
                this.showRowDeleteButton = false
              }
            } else {
              gridColumns.push(column)
            }
          } else {
            gridColumns.push(column)
          }

          if (column.summary) {
            if (summaryColumns === null) {
              summaryColumns = {}
            }
            summaryColumns[column.columnName] = column
          }
        })
        // 计算每个控件占每行的比例
        if (searchFormRows) {
          // searchFormRows.filter(e => {
          //   let col = 0;
          //   e.forEach(v => {col += v.col;});
          //   e.filter(v => {v.col = v.col / col;return v});
          //   return e
          // });
          // 修改每个控件占每行的比例
          // 修改每个控件占每行的比例
          searchFormRows = searchFormRows.map(e => {
            return e.map(v => {
              v.col = v.col / this.config.colNum
              // 如果一行只有一列，且是下拉框，则默认占用整行
              if (e.length === 1 && v.widgetType && (v.widgetType === 'select' || v.widgetType === 'select-dic' || v.widgetType === 'select-select')) {
                v.col = 1
              }
              return v
            })
          })
        }
        // console.info('----------');
        // console.info(topButtons);
        let standardButtons = []
        if (!ifNewBtn && this.config.btnAdd == 1 && !this.readOnly && (!this.singleSelect && !this.multipleSelect)) {
          // console.info('--------------')
          // 添加默认新增按钮
          standardButtons.push({columnName: 'new', title: '新增', icon: 'el-icon-plus'})
          // topButtons = topButtons.splice(0,0,{columnName:'new',title:'新增',icon:'el-icon-plus'});
        }
        // 添加导入按钮
        if (this.config.formExcelList && this.config.formExcelList.length > 0) {
          topButtons.push({
            icon: 'el-icon-download',
            title: '导入',
            widgetType: 'import',
            data: this.config.formExcelList
          })
        }
        if (!ifImportBtn && !this.readOnly && (!this.singleSelect && !this.multipleSelect)) {
          // 添加默认导入按钮
          // topButtons = topButtons.splice(0,0,{columnName:'new',title:'导入',icon:'el-icon-download'});
          // standardButtons.push({columnName:'import',title:'导入',icon:'el-icon-download'});
        }
        if (!ifExportBtn && this.config.btnExport == 1 && !this.isTree) {
          // topButtons = topButtons.splice(0,1,{columnName:'new',title:'导出',icon:'el-icon-upload2'});
          standardButtons.push({columnName: 'export', title: '导出', icon: 'el-icon-upload2'})
        }
        if (standardButtons.length > 0) {
          standardButtons.reverse().forEach(button => {
            topButtons.unshift(button)
          })
        }
        if (searchFormRows.length > 0) {
          _this.searchFormColumns = searchFormColumns
          _this.searchFormRows = searchFormRows
        }
        // 过滤权限
        gridColumns = gridColumns.filter((item, index) => {
          return item.btnLook == 1
        })

        this.gridColumns = JSON.parse(JSON.stringify(gridColumns))
        this.moreColumns = this.handMoreColumns(JSON.parse(JSON.stringify(gridColumns)))
        this.queryFormVisible = true
        if (searchPlaceholder.length > 0) {
          let laceholder = '请输入'
          for (let i = 0; i < searchPlaceholder.length; i++) {
            if (i !== searchPlaceholder.length - 2) {
              laceholder += searchPlaceholder[i] + '、'
            } else {
              laceholder += searchPlaceholder[i] + '或'
            }
          }
          this.searchPlaceholder = laceholder.slice(0, laceholder.length - 1)
        }
        this.searchVisible = searchVisible
        var vue = Vue // 定义Vue eval里无法直接获取vue
        eval("vue.prototype['copyForm'] = function (params){this.$confirm('是否确认复制'+params.TITLE_+'表单?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => { this.copy(params.FORM_KEY_).then(res => {if(res.status === 200){this.loadData();this.$message({type: 'success',message: '复制成功!'});}}); }).catch(() => {this.$message({type: 'info',message: '已取消复制'});});}")
        this.summaryColumns = summaryColumns
        if (summaryColumns !== null) {
          this.summaryColumns = summaryColumns
          this.showSummary = true
          this.$forceUpdate()
        }
        // console.log('------gridColumns----',_this.gridColumns)
        // 加载table数据
        if (this.autoLoad) {
          this.loadData()
        }
        this.formConfig = {...this.config}
        // console.info(topButtons);
        // 传递到query-form
        this.topButtons = topButtons
        // 把当前组件传递给子组件
        this.formConfig.parent = this
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
    // 处理生成多表头格式
    handMoreColumns (fields) {
      // 处理多表头
      let fieldsmap = []
      // 遍历所有字段组织多表头的数据位
      for (let i = 0; i < fields.length; i++) {
        let title = fields[i].title
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
    handlerParentClick (row) { // 监听级联页面时，上一个关联父页面点击触发本页面数据刷新
      this.pageIndex = 1
      this.parentSelectedRow = row
      this.rootId = null
      this.loadData()
    },
    downloadExecl (edit) {
      this.excelModal = edit
    },
    computeInitValue (key) { // 表单新增初始化计算初始值
      // console.info(column)
      if (key === '{current-user-uid}') {
        return this.sessionUtil.getUserUid()
      } else if (key === '{current-user-id}') {
        return this.sessionUtil.getUserId()
      } else if (key === '{current-user-name}') {
        return this.sessionUtil.getUserName()
      } else if (key === '{current-depart-uid}') {
        return this.sessionUtil.getDepartUid()
      } else if (key === '{current-depart-id}') {
        return this.sessionUtil.getDepartId()
      } else if (key === '{current-depart-name}') {
        return this.sessionUtil.getDepartName()
      } else if (key === '{current-company-uid}') {
        return this.sessionUtil.getDepartUid()
      } else if (key === '{current-company-id}') {
        return this.sessionUtil.getDepartId()
      } else if (key === '{current-company-name}') {
        return this.sessionUtil.getDepartName()
      } else if (key === '{current-date}') {
        return (new Date()).format('yyyy-MM-dd')
      } else if (key === '{current-datetime}') {
        return (new Date()).format('yyyy-MM-dd hh:mm:ss')
      } else if (key === '{current-year}') {
        return new Date().getFullYear()
      } else if (key === '{current-month}') {
        return new Date().getMonth() + 1
      } else if (key === '{current-week}') {
        return this.util.getYearWeek()
      } else if (key === '{current-next-monday}') { // 下周一
        return this.util.getNextMonday()
      } else if (key === '{current-month-first}') { // 本月第一天
        return this.util.getCurrentMonthFirst()
      } else if (key === '{current-month-last}') { // 本月最后一天
        return this.util.getCurrentMonthLast()
      } else if (key === '{next-month-first}') { // 本月第一天
        return this.util.getNextMonthFirst()
      } else if (key === '{next-month-last}') { // 本月最后一天
        return this.util.getNextMonthLast()
      } else {
        return null
      }
      // console.log(column.columnName+'-----------'+mainData[column.columnName])
    },
    selectExcel () {
      let modal = {}
      if (this.excelModal) {
        modal = this.excelModal
      } else {
        modal = this.excelList[0]
      }
      if (modal && modal.children && this.excelData && modal.category && modal.category === 2) {
        if (this.gridData === undefined) {
          this.gridData = []
        }
        let data = []
        // 导入添加排序
        let sort = this.totalCount
        this.excelData.forEach(item => {
          let row = { SORT_: sort++ }
          modal.children.forEach(column => {
            if (column.excelName) {
              // 将key值转换为小写
              column.columnName = column.columnName.toLowerCase()
              row[column.columnName] = item[column.excelName]
              // 固定常量
              if (column.excelName.startsWith('[') && column.excelName.endsWith(']')) {
                row[column.columnName] = column.excelName.slice(1, column.excelName.length).slice(0, column.excelName.length - 1)
              }
              // 系统参数
              if (column.excelName.indexOf('{') > -1) {
                let searchParams = this.$refs['query-form'].getParams()
                // 搜索条件
                for (const key in searchParams) {
                  row[column.columnName] = column.excelName.replace(new RegExp('{' + key + '}', 'gm'), searchParams[key])
                }
                // 全局项目
                let sessionProj = {}
                if (window.localStorage.getItem('_session_proj' + this.sessionUtil.getUser().id)) {
                  sessionProj = JSON.parse(window.localStorage.getItem('_session_proj' + this.sessionUtil.getUser().id))
                } else if (this.getFormConfig && this.getFormConfig['_session_proj' + this.sessionUtil.getUser().id]) {
                  sessionProj = this.getFormConfig['_session_proj' + this.sessionUtil.getUser().id].data
                }
                if (sessionProj) {
                  for (const key in sessionProj) {
                    row[column.columnName] = column.excelName.replace(new RegExp('{' + key + '}', 'gm'), sessionProj[key])
                  }
                }
                // 父级页面携带参数
                if (this.parentSelectedRow) {
                  for (const key in this.parentSelectedRow) {
                    if (column.excelName.indexOf(key) > -1) {
                      row[column.columnName] = column.excelName.replace(new RegExp('{' + key + '}', 'gm'), this.parentSelectedRow[key])
                    }
                  }
                }
                // 其他系统常量
                let computeInitValue = this.computeInitValue(column.excelName)
                if (computeInitValue) {
                  row[column.columnName] = computeInitValue
                }
              }
            }
          })
          data.push(row)
        })
        let params = {
          data: data,
          tableName: this.config.tableName,
          errorMechanism: modal.errorMechanism
        }
        // 如果没配置api 走默认api地址
        if (!modal.api) {
          modal.api = '/api_v1/excel/common'
        }
        console.log(`api地址：` + modal.api + `参数：`, params)
        this.util.restPost(modal.api, params, res => {
          if (res.status === 200) {
            this.util.success('导入成功!')
          } else {
            this.util.warn('导入失败!')
          }
          this.loadData()
        })
      } else {
        this.util.warn('导入失败!')
      }
      this.selectExcelVisible = false
    },
    handleSizeChange (pageSize) { // pageSize切换
      this.pageIndex = 1
      this.pageSize = pageSize
      this.loadData()
    },
    handleCurrentChange (pageIndex) { // pageSize切换
      console.info('-----handleCurrentChange----' + this.pageCount + '---' + pageIndex)
      // console.info(this)
      let pageCount = this.pageCount
      if (pageIndex <= pageCount) {
        this.pageIndex = pageIndex
        this.loadData()
      }
    },
    queryData (params) { // 查询表单查询调用
      if (params) {
        this.keyword = params.keyword
        this.formData = params.formData
        this.loadData()
      }
    },
    // 树表懒加载
    load (tree, treeNode, resolve) {
      this.rootId = tree.id
      this.loadData(resolve)
    },
    loadData (resolve) { // 加载grid数据
      let _this = this
      _this.emptyText = '正在加载...'
      if (this.config.lazy === undefined || this.config.lazy === 0) {
        this.loading = true
      }
      let config = this.config
      let searchParams = []
      // 判断是否带有过滤参数
      let queryParams = []
      let queryParam = this.queryParams
      /* console.info(this.config.queryColumns)
      console.info(this.queryParams) */
      if (queryParam) {
        // 把url传参或者父组件传参传递到后台
        for (let key in queryParam) {
          if (this.validUtil.isNotNull(queryParam[key])) {
            queryParams.push({'key': key, 'value': queryParam[key]})
          } else {
            // 如果左侧选中行中有该值，则替换
            if (this.parentSelectedRow != null && this.parentSelectedRow[key] !== undefined) {
              queryParams.push({'key': key, 'value': this.parentSelectedRow[key]})
            } else {
              queryParams.push({'key': key, 'value': queryParam[key]})
            }
          }
        }
      }
      // 判断是否搜索,然后拼接搜索
      let formData = this.formData
      if (formData) {
        this.config.queryColumns.forEach(column => {
          let val = formData[column.columnName]
          if (val && this.validUtil.isNotNull(val) && column.matchType != undefined) {
            searchParams.push(
              {
                'key': column.columnName,
                'value': val
              }
            )
          }
        })
      }
      let parentId = null
      if (this.parentSelectedRow != null) {
        parentId = this.parentSelectedRow.id || this.parentSelectedRow.ID_
        // 把左右结构或者上下结构前一个选中行整个传参
        for (let key in this.parentSelectedRow) {
          if (key !== 'id' && key != 'ID_' && key != 'children') {
            if (this.validUtil.isNull(queryParam[key])) {
              queryParams.push({'key': key, 'value': this.parentSelectedRow[key]})
            }
          }
        }
        // console.log('------11111-------',this.parentSelectedRow, queryParams)
      }
      let params = {
        'formKey': config.formKey,
        'id': config.id,
        'keyword': this.keyword,
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize,
        'searchParams': searchParams,
        'queryParams': queryParams,
        'parentId': parentId
      }
      let apiConfig = this.config.apiConfig
      // console.info(queryParams)
      if (apiConfig) {
        if (apiConfig.children) {
          apiConfig.children.forEach(child => {
            let key = null
            if (child.value && child.value.indexOf('{') > -1) {
              key = child.value.substring(child.value.indexOf('{') + 1, child.value.indexOf('}')).trim()
            }
            if (key != null && queryParam && this.validUtil.isNotNull(queryParam[key])) {
              queryParams.push({'key': child.code, 'value': queryParam[key]})
            } else {
              // 如果左侧选中行中有该值，则替换
              if (this.parentSelectedRow != null && this.parentSelectedRow[key] !== undefined) {
                queryParams.push({'key': child.code, 'value': this.parentSelectedRow[key]})
              } else {
                queryParams.push({'key': child.code, 'value': child.value})
              }
            }
          })
        }
        params.apiId = apiConfig.id
        if (apiConfig.runtype === 'Interface') {
          params._url = apiConfig.runsql
        }
      }
      // 每次刷新都清空selection
      // this.$refs['jr-table'].clearSelection()
      this.selection = []
      if (this.isTree) {
        params.rootId = this.rootId
        getTreeData(params, this).then(data => {
          if (data && data.length > 0) {
            // 添加跟节点显示
            if (_this.config.showRoot && !this.rootId) {
              let root = {}
              root['children'] = data
              root['id'] = _this.config.rootId
              root[_this.config.treeColumn] = _this.config.rootText
              _this.rowClick(root)
              data = [root]
            }
            if (resolve) {
              setTimeout(() => {
                resolve(data)
              }, 1000)
            } else {
              _this.gridData = data
              // 如果为左右结构 且为左侧 默认将第一行数据作为参数
              if (_this.config.parent && _this.isLeft) {
                // 默认选中第一项
                /* this.$refs['jr-table'].toggleRowSelection(_this.gridData[0], true)// 用于多选
                this.$refs['jr-table'].setCurrentRow(_this.gridData[0])// 用于单选 */
                this.$refs['jr-table'].setCurrentRow(_this.gridData[0])// 用于单选
                this.handlerSelectionChange([_this.gridData[0]])
                _this.config.parent.handlerRowClick(2, _this.gridData[0])
              }
            }
          } else {
            if (resolve) return resolve([])
            _this.emptyText = '暂无数据'
            _this.pageCount = 0
            _this.gridData = []
          }
          this.handlerSelectionAutoSet()// 自动把之前选择数据勾选上
          this.loading = false
        })
      } else {
        getGridData(params, this).then(res => {
          _this.gridData = res.data
          if (res.data == undefined || res.data.length === 0) {
            _this.emptyText = '暂无数据'
            _this.pageCount = 0
            _this.totalCount = 0
          } else {
            _this.totalCount = res.totalCount
            // 如果为左右结构 且为左侧 默认将第一行数据作为参数
            if (_this.config.parent && _this.isLeft) {
              // 默认选中第一项
              /* this.$refs['jr-table'].toggleRowSelection(_this.gridData[0], true)// 用于多选
              this.$refs['jr-table'].setCurrentRow(_this.gridData[0])// 用于单选 */
              this.$refs['jr-table'].setCurrentRow(_this.gridData[0])// 用于单选
              this.handlerSelectionChange([_this.gridData[0]])
              _this.config.parent.handlerRowClick(2, _this.gridData[0])
            }
            _this.pageCount = (_this.totalCount + _this.pageSize - 1) / _this.pageSize
            // this.handlerDeepSetChecked(_this.gridData)
          }
          this.handlerSelectionAutoSet()// 自动把之前选择数据勾选上
          this.loading = false
        }).catch(() => {
          // console.info('---------catch---------')
          _this.emptyText = '暂无数据'
          _this.pageCount = 0
          _this.totalCount = 0
          this.handlerSelectionAutoSet()// 自动把之前选择数据勾选上
          this.loading = false
        })
      }
    },
    copy (params) {
      return copy(params)
    },
    handlerRowClick (queryFormIndex, row) { // 监听查询列表的单击事件
      // console.info('------handlerRowClick-------' + queryFormIndex)
      // console.info(row)
    },
    toggleRowExpansion (row, expanded) {
      console.log(row, expanded)
    }
  }
}
