import {getGridData, copy, getDicData} from '@/api/form-render'
import {mapGetters, mapMutations} from 'vuex'
import Vue from 'vue'
// import {formUtil} from '../form'

export const mixin = {
  data: function () {
    return {
      dicData: {},
      gridColumns: [],
      gridData: [],
      pageSize: 30,
      pageIndex: 1,
      pageCount: 0,
      totalCount: 0,
      parentSelectedRow: null, // 级联页面，父页面的选中行
      flag: true, // 判断是否有配置流程状态字段
      openDialogWidth: '',
      openDialogHeight: '',
      openConfig: {}
    }
  },
  props: {

  },
  computed: {
    ...mapGetters([
      'getFormConfig'
    ]),
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
    // 复制表单例子
    var vue = Vue // 定义Vue eval里无法直接获取vue
    eval("vue.prototype['copyForm'] = function (params){this.$confirm('是否确认复制'+params.TITLE_+'表单?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => { this.copy(params.FORM_KEY_).then(res => {if(res.status === 200){this.loadData();this.$message({type: 'success',message: '复制成功!'});}}); }).catch(() => {this.$message({type: 'info',message: '已取消复制'});});}")
    // Vue.prototype.copyForm = function (params){
    //   this.$confirm('是否确认复制'+params.TITLE_+'表单?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //   copyForm(params.FORM_KEY_).then(res => {if(res.status === 200){this.loadData();this.$message({type: 'success',message: '复制成功!'});}});
    //   }).catch(() => {
    //   this.$message({type: 'info',message: '已取消复制'});
    //   });
    // }
  },
  methods: {
    init () {
      let _this = this
      let gridColumns = []
      let searchFormColumns = []
      let searchFormRows = []
      let searchVisible = false
      let queryColumns = this.config.queryColumns
      let ifNewBtn = false
      let ifImportBtn = false
      let ifExportBtn = false
      let topButtons = []
      let code = ''
      // console.log('------1------',this.queryParams)
      // if(this.queryParams){
        /*this.openConfig =JSON.parse(JSON.stringify(this.queryParams))
        this.openConfig.initValues = this.queryParams*/
        // this.queryParams = this.openConfig.initValues
      // }
      // console.log('------2------',this.queryParams)
      // this.openConfig.parent = this
      if (this.config.pageSize) this.pageSize = this.config.pageSize
      let formConfig = this.config.parent.formConfig
      // formCode单号
      if (formConfig.formCode) code = formConfig.formCode.field
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

          // 判单是否显示搜索框
          if (column.matchType) {
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
                  _this.dicMap[column.columnName][option[0]] = option[1]
                  // 存入键值对
                  data[option[0]] = option[1]
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
              column.width = attrObj.width ? ((attrObj.width + '').indexOf('px') > -1 ? attrObj.width : (attrObj.width + 'px')): '100px'
              column.height = attrObj.height ? ((attrObj.height + '').indexOf('px') > -1 ? attrObj.height : (attrObj.height + 'px')): '100px'
              column.ifThumb = column.ifThumb ? column.ifThumb : true
            }
          }
          if (column && column.javaType === 'TopButton') {
            if (column.columnName.toLowerCase() === 'new' && this.config.btnAdd == 1) {
              ifNewBtn = true
              topButtons.push(column)
            }
            if (column.columnName.toLowerCase() === 'import') {
              ifImportBtn = true
              topButtons.push(column)
            } else if (column.columnName.toLowerCase() === 'export' && this.config.btnExport == 1) {
              ifExportBtn = true
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
            } else{
              gridColumns.push(column)
            }
          } else{
            gridColumns.push(column)
          }
        })
        // 计算每个控件占每行的比例
        if (searchFormRows) {
          searchFormRows.filter(e => {
            let col = 0
            e.forEach(v => { col += v.col})
            e.filter(v => { v.col = v.col / col; return v })
            return e
          })
        }
        // console.info('----------');
        // console.info(topButtons);
        let standardButtons = []
        if (!ifNewBtn && !this.readOnly && this.config.btnAdd == 1) {
          // console.info('--------------')
          // 添加默认新增按钮
          standardButtons.push({columnName: 'new', title: '新增', icon: 'el-icon-plus'})
          // topButtons = topButtons.splice(0,0,{columnName:'new',title:'新增',icon:'el-icon-plus'});
        }
        if (!ifImportBtn) {
          // 添加默认导入按钮
          // topButtons = topButtons.splice(0,0,{columnName:'new',title:'导入',icon:'el-icon-download'});
          // standardButtons.push({columnName:'import',title:'导入',icon:'el-icon-download'});
        }
        if (!ifExportBtn && this.config.btnExport == 1) {
          // 添加默认新增按钮
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
        this.queryFormVisible = true
        this.searchVisible = searchVisible
        _this.gridColumns = gridColumns
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
    handlerParentClick (row) { // 监听级联页面时，上一个关联父页面点击触发本页面数据刷新
      this.pageIndex = 1
      this.parentSelectedRow = row
      this.loadData()
    },
    handleSizeChange (pageSize) { // pageSize切换
      this.pageIndex = 1
      this.pageSize = pageSize
      this.loadData()
    },
    handleCurrentChange (pageIndex) { // pageSize切换
      // console.info('-----handleCurrentChange----'+queryFormIndex+'---'+pageIndex)
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
    loadData () { // 加载grid数据
      // console.info('-------loadData------', this.parentSelectedRow);
      let _this = this
      _this.emptyText = '正在加载...'
      let config = this.config
      let searchParams = []
      // 判断是否带有过滤参数
      let queryParams = []
      let queryParam = this.queryParams
      /*console.info(this.config.queryColumns)
      console.info(this.queryParams) */
      if (queryParam) {
        // 把url传参或者父组件传参传递到后台
        for (let key in queryParam) {
          queryParams.push({'key': key, 'value': queryParam[key]})
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
            if (key != null && queryParam && queryParam[key]) {
              queryParams.push({'key': child.code, 'value': queryParam[key]})
            } else {
              queryParams.push({'key': child.code, 'value': child.value})
            }
          })
        }
        params.apiId = apiConfig.id
        if (apiConfig.runtype === 'Interface') {
          params._url = apiConfig.runsql
        }
      }
      this.pageCount = 0
      getGridData(params, this).then(res => {
        _this.gridData = res.data
        _this.totalCount = res.totalCount
        if (res.data == undefined || res.data.length === 0) {
          _this.emptyText = '暂无数据'
          _this.pageCount = 0
        } else{
          // 如果为左右结构 且为左侧 默认将第一行数据作为参数
          if (_this.config.parent && _this.isLeft) {
            // 默认选中第一项
            /* this.$refs['jr-table'].toggleRowSelection(_this.gridData[0], true)// 用于多选
            this.$refs['jr-table'].setCurrentRow(_this.gridData[0])// 用于单选*/
            this.$refs['jr-table'].setCurrentRow(_this.gridData[0])// 用于单选
            this.handlerSelectionChange([_this.gridData[0]])
            _this.config.parent.handlerRowClick(2, _this.gridData[0])
          }
          _this.pageCount = (_this.totalCount + _this.pageSize - 1) / _this.pageSize
        }
      }).catch(() => {
        // console.info('---------catch---------')
        _this.emptyText = '暂无数据'
        _this.pageCount = 0
      })
    },
    copy (params) {
      return copy(params)
    },
    handlerRowClick (queryFormIndex, row) { // 监听查询列表的单击事件
      // console.info('------handlerRowClick-------' + queryFormIndex)
      // console.info(row)
    }

  }
}
