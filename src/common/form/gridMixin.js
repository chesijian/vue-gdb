import { deleteData, getDataByApi, copyTreeData, saveData, batchSaveData } from '@/api/form-render'
import {formUtil} from './form'
// import {mapGetters} from "vuex/types/index";
import {mapGetters, mapMutations} from 'vuex'
export const gridMixin = {
  data: function () {
    return {
      showRowEditButton: true,
      showRowDeleteButton: true,
      showOpenDialogTitle: false,
      openDialogConfirmVisible: false, // 弹框打开表单是否显示确认取消按钮
      openDialogTitle: '', // 弹框打开表单的标题
      openDialogConfig: {}, // 弹框打开表单的配置
      openDialogVueName: '', // 弹框打开表单的配置
      openDialogVisible: false, // 弹框打开页面openType=1
      summaryColumns: {}, // 合计列
      summaryData: {}, // 表格合计数据
      showSummary: false, // 是否显示合计
      // singleSelect:false, // 是否单选
      // multiSelect:false, // 是否多选
      defaultPic: require('../../assets/img/defaut.jpg'),
      emptyText: '',
      dicMap: {},
      topButtons: [], // 顶部工具栏
      selection: [], // 复选框数据
      searchVisible: false, // 是否显示搜索框
      formConfig: {}, // 对应的表单的配置
      queryFormVisible: false,
      keyword: false,
      formData: [], // 高级查询对应的表单中数据
      selectedData: [], // 记录累计选中行，常用于分页复选框
      searchFormRows: [],
      formDialogVisible: false,
      loading: false,
      searchFormColumns: []
    }
  },
  props: {
    config: {
      type: Object,
      default: function () {
        return {}
      }
    },
    level: { // 层级
      type: Number,
      default: function () {
        return 1
      }
    },
    readOnly: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    showCheckBox: {
      type: Boolean,
      default: false
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
    hasQuery: { // 是否显示查询
      type: Boolean,
      default: true
    },
    queryParams: {
      type: Object,
      default: function () {
        return {}
      }
    },
    isLeft: {
      type: Boolean,
      default: false
    },
    isTree: {
      type: Boolean,
      default: false
    },
    cascade: { // 是否级联
      type: Boolean,
      default: false
    },
    autoLoad: { // 自动加载
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'getFormConfig'
    ]),
    formDialogStyle () { // 打开表单的样式
      // 判断如果是左边的话还是弹框
      if (this.isLeft) {
        return {
          width: this.formConfig.formWidth ? (this.formConfig.formWidth.indexOf('px') > -1 ? this.formConfig.formWidth : this.formConfig.formWidth + 'px') : '900px',
          height: this.formConfig.formHeight ? (this.formConfig.formHeight.indexOf('px') > -1 ? this.formConfig.formHeight : this.formConfig.formHeight + 'px') : '600px'
        }
      } else {
        return {width: '100%', height: '100%', position: 'absolute', zIndex: '12', top: '0', background: 'white', 'padding-left': '10px', 'padding-right': '10px', 'box-sizing': 'border-box', 'padding-top': '10px'}
      }
    },
    dicValue () { // 数据字典label
      return function (column, value) {
        // console.info(this.dicMap[column.columnName])
        if (column) {
          if (this.dicMap[column.columnName]) {
            if (this.validUtil.isNotNull(value)) {
              return this.dicMap[column.columnName][value]
            } else {
              return this.dicMap[column.columnName]['']
            }
          }
        }
        return value || ''
      }
    },
    formatDate () {
      return function (column, row) {
        // console.log('-----formatDate-----')
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
    },
    computePicView () {
      return function (column, row) {
        let defaultUrl = this.defaultPic// 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
        if (row[column.columnName]) {
          defaultUrl = this.util.getBaseUrl() + '/api_v1/files/' + row[column.columnName] + '/look?ifThumb=' + column.ifThumb + '&access_token=' + this.sessionUtil.getAccessToken()
        }
        return defaultUrl
      }
    }
  },
  watch: {
    dicMap: {
      handler: function (val, oldval) {
        // console.log('------dicMap--------')
        // console.info(JSON.stringify(val))
      },
      deep: true// 对象内部的属性监听，也叫深度监听
    },
    selection: {
      handler: function (val, oldval) {
        // console.log(oldval,'---watch---selection--------',val)
      }
    }
  },
  created () {
    this.util.init(this)
    this.topButtons = []
    document.title = this.config.title;
  },

  methods: {
    closeForm () {
      this.formDialogVisible = false
      // 弹框的关闭和保存之后调用关闭
      this.openDialogVisible = false
    },
    handlerFormOpen (column) { // 点击新增或编辑按钮\
      if (this.$route.params.formKey) { delete this.$route.params.formKey }
      // console.info(this.config)

      // 左右级联打开表单时自动填写选中的树节点的id和title填充到表单中，默认规则为：PARENT_ID_ = ID_,PARENT_ID_LABEL_ = TITLE_
      let parentSelectedRow = this.parentSelectedRow // 先从右侧获取，
      console.log('----handlerFormOpen--1--', parentSelectedRow)

      let initValues = { ...this.queryParams }
      if (this.gridData) {
        initValues['SORT_'] = this.gridData.length + 1
      } else {
        initValues['SORT_'] = 1
      }
      // 判断是否是树
      if (this.isTreeCmp()) {
        let parentColumnName = this.config.parentColumn
        let parentColumnLabel = this.config.parentColumn + 'LABEL_'
        // 获取选中的节点
        let selectedNode = null
        let selectedData = this.getSelectedData(0)
        if (selectedData && selectedData.length > 0) {
          selectedNode = selectedData[0]
        }
        if (selectedNode !== undefined && selectedNode != null) {
          // 判断如果是树，则获取选中的树节点
          let selectedTreeNode = this.$refs['jr-table'].getNode(selectedNode.id)
          console.log(selectedNode.parentId + '----parent----', selectedTreeNode.parent)
          console.log('----selectedTreeNode----', selectedTreeNode)
          // 默认是同级新增，判断是否新增下级
          if (column && column.columnName === 'new-child') {
            initValues['SORT_'] = selectedTreeNode.childNodes.length + 1
          } else {
            // 同级新增
            initValues['SORT_'] = selectedTreeNode.parent.childNodes.length + 1
            if (selectedNode.parentId === this.config.rootId) {
              selectedNode = {
                id: selectedNode.parentId,
                ID_: selectedNode.parentId,
                TITLE_: this.config.rootText
              }
            } else {
              selectedNode = selectedTreeNode.parent.data
            }
          }
          initValues[parentColumnName] = selectedNode['ID_']
          initValues[parentColumnLabel] = selectedNode['TITLE_'] ? selectedNode['TITLE_'] : (selectedNode['NAME_'] ? selectedNode['NAME_'] : selectedNode['PROJ_NAME_'])
        } else {
          // 默认是在root根节点下面增加子节点

          this.info('您未选中任何节点，将在根节点下添加！')
          initValues[parentColumnName] = this.config.rootId
          initValues[parentColumnLabel] = this.config.rootText
          let rootNode = this.getSelectedTreeNode(this.config.rootId)
          if (rootNode && rootNode !== null) {
            initValues['SORT_'] = rootNode.childNodes.length + 1
          } else {
            initValues['SORT_'] = this.gridData.length + 1
          }
        }
      } else if (this.isTreeGridCmp()) {
        // 判断是否是树表
        let parentColumnName = this.config.parentColumn
        let parentColumnLabel = this.config.parentColumn + 'LABEL_'
        // 获取选中的节点
        let selectedNode = null
        let selectedData = this.getSelectedData(0)
        if (selectedData && selectedData.length > 0) {
          selectedNode = selectedData[0]
        }
        console.log('-----isTreeGridCmp-----', selectedNode)
        if (selectedNode !== undefined && selectedNode != null) {
          // 默认是增加下级
          initValues['SORT_'] = selectedNode.children ? selectedNode.children.length + 1 : 1
          console.log('-------this.queryParams-------', initValues, selectedNode)
          initValues[parentColumnName] = selectedNode['ID_']
          initValues[parentColumnLabel] = selectedNode['TITLE_'] ? selectedNode['TITLE_'] : (selectedNode['NAME_'] ? selectedNode['NAME_'] : selectedNode['PROJ_NAME_'])
        } else {
          // 默认是在root根节点下面增加子节点
          initValues[parentColumnName] = this.config.rootId
          initValues[parentColumnLabel] = this.config.rootText
        }
      }

      // 判断是左右结构左侧添加，还是单页面添加
      if (this.level === 1) {

      } else if (this.level > 1) {
        // 说明是左右结构或者上下结构，右侧添加
        // 获取左侧选中数据
        let parentSelectedData = this.parentSelectedRow ? [this.parentSelectedRow] : this.config.parent.getSelectedData(this.level - 1)
        console.log('--------左右结构右侧添加-------', parentSelectedData)
        if (parentSelectedData === undefined || parentSelectedData === null || parentSelectedData.length === 0) {
          this.warn('请选择关联数据！')
          return
        }
        parentSelectedData = parentSelectedData[0]
        this.formConfig.parentSelectedData = parentSelectedData
        // 左右结构组装数据
        let columnName = 'PARENT_ID_'
        let columnLable = 'PARENT_ID_LABEL_'
        if (this.config && this.config.parent && this.config.parent.formConfig && this.config.parent.formConfig.linkColumnName) {
          columnName = this.config.parent.formConfig.linkColumnName
          columnLable = this.config.parent.formConfig.linkColumnName + 'LABEL_'
        }
        initValues[columnName] = parentSelectedData['ID_']
        initValues[columnLable] = parentSelectedData['TITLE_'] || parentSelectedData['NAME_'] || parentSelectedData['PROJ_NAME_']
      }

      this.formConfig.initValues = initValues
      console.log('------this.config--------', this.config)
      // 判断form-view中的路由qeury是否有值
      let routeQuery = this.config.parent.routeQuery
      if (routeQuery && routeQuery !== undefined && routeQuery != null) {
        if (this.formConfig.initValues === undefined) {
          this.formConfig.initValues = routeQuery
        } else {
          if (this.formConfig.initValues === undefined || this.formConfig.initValues === null) {
            this.formConfig.initValues = {}
          }
          for (let key in routeQuery) {
            this.formConfig.initValues[key] = routeQuery[key]
          }
          // this.formConfig.initValues = this.formConfig.initValues.concat(routeQuery);
        }
      }
      console.log('------this.formConfig.initValues--------', this.formConfig.initValues)
      // console.info(this.formConfig,'sss')
      this.formConfig.parent = this
      this.formConfig.businessKey = ''
      // this.formConfig.sort =
      this.formDialogVisible = true
    },
    iptBlur (row, column, index) {
      // this.clickRow = row;
      setTimeout(() => {
        this.$set(row, column.columnName + 'isShow', false)
      }, 100)
    },
    cellClick (index, row, column) {
      // console.log('-------cellClick---------',index, column,row,this.readOnly)
      // 判断是否需要可编辑
      if (!this.singleSelect && !this.multipleSelect && !this.readOnly && (column.readOnly !== undefined && column.readOnly === 0) && (column.widgetType && column.widgetType === 'input')) {
        this.$set(row, column.columnName + 'isShow', true)
        this.$forceUpdate()
        // console.log(row[column.columnName + 'isShow']+'---------------',row)
        // row[column.columnName + 'isShow'] = true
        if (!column.widgetType || (column.widgetType && column.widgetType != 'date')) {
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs[column.columnName + index][0].focus()
            })
          }, 100)
        }
      }

      // 触发单击整行事件
      this.rowClick(row)
      // 只读点击无效
      /* if (this.readOnly) {
        return
      } */
      // console.log(row,column)
      if (column.openUrl && column.openParams) {
        // var openParams =  JSON.parse(column.openParams)
        // openParams.params = row
        // this.$router.push({
        //   name: column.openUrl,
        //   params: openParams
        // })
        // // this.$router.go(0)
        // this.util.routerRefresh()
        this.handleRowButtonClick(column, index, row)
      }
    },
    // 选中父亲
    checkParent (data, value) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === value.id) {
          return [data[i]]
        }
        if (data[i].children) {
          var ro = this.checkParent(data[i].children, value)
          if (ro !== undefined) {
            return ro.concat(data[i])
          }
        }
      }
    },
    // 选择子类
    checkChildren (data) {
      for (let index = 0; index < data.length; index++) {
        this.$refs['jr-table'].toggleRowSelection(data[index])
        if (data[index].children && data[index].children.length > 0) {
          this.checkChildren(data[index].children)
        }
      }
    },
    swapItems (arr, index1, index2) { // 交换数组元素位置
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    // 获取父亲
    getParent (data, value) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === value.id) {
          return [data[i]]
        }
        if (data[i].children) {
          this.getParent(data[i].children, value)
        }
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
    handlerChangeValue (newVal, column, row, index) {
      // 判断如果是树表，且有合计，则要向上统计
      if (this.isTreeGridCmp()) {
        let columnName = column.columnName
        let columnConfig = this.summaryColumns[columnName]
        let updateData = []
        if (columnConfig) {
          // 递归向上计算
          this.deepUpSummary(column, row, updateData)
          // console.log('------handlerChangeValue-------',updateData)
        } else {
          let mainFormDataMap = {}
          if (column.javaType && (column.javaType === 'Integer' || column.javaType === 'Double')) {
            newVal = Number(newVal)
            if (isNaN(newVal)) {
              newVal = 0
            }
          }
          row[columnName] = newVal
          mainFormDataMap[columnName] = newVal
          updateData.push({
            id: row['ID_'],
            sqlTableName: this.config.tableName,
            mainFormDataMap: mainFormDataMap
          })
        }
        if (updateData.length > 0) {
          // 提交后台保存
          batchSaveData({
            formKey: this.config.formKey,
            formId: this.config.formId,
            formInfoId: this.config.id,
            batchData: updateData}).catch(e => {
            this.util.warn('修改数据失败，请刷新页面重试!')
          })
        }
      }
    },
    deepUpSummary (column, row, updateData) { // 递归向上合计
      let columnName = column.columnName
      let value = Number(row[columnName])
      if (isNaN(value)) {
        value = 0
      }
      row[columnName] = value
      let mainFormDataMap = {}
      mainFormDataMap[columnName] = value
      updateData.push({
        id: row['ID_'],
        sqlTableName: this.config.tableName,
        mainFormDataMap: mainFormDataMap
      })
      // 如果父亲是根节点，则不需要统计，控件会自动计算
      if (row['parentId'] && row['parentId'] !== this.config.rootId) {
        let parentNode = this.getParentNode(this.gridData, row['parentId'])
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
          this.deepUpSummary(column, parentNode, updateData)
          this.$forceUpdate()
        }
      }
    },
    handleOperateClick (buttonId, index, row) { // 上移或下移
      let tableData = this.gridData
      let length = tableData.length
      // if(buttonId === 'up'){ // 上移
      //   if(index == 0) {
      //     return
      //   }
      //   tableData = this.swapItems(tableData, index, index - 1)
      // }else if(buttonId === 'down'){ // 下移
      //   if(index === tableData.length -1) {
      //     return
      //   }
      //   tableData = this.swapItems(tableData, index, index + 1)
      // }
      // tableData.forEach((item,index) => {
      //   item['sort'] = (index+1)
      // })
      // console.info(tableData)
    },
    isTreeCmp () {
      // console.log('-------isTreeCmp-----'+this.config.type, this.config)
      return this.config.type === 4
    },
    isTreeGridCmp () {
      // console.log('-------isTreeGridCmp-----'+this.config.type, this.config)
      return this.config.type === 2
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
    rowClick (item) {
      console.log('-------rowClick---------', item)
      this.$emit('handlerRowClick', item)
      // this.selectedData = [item]
      // if(this.selection.indexOf(item)<0){
      //   this.selection.push(item);
      // }
      // 判断是否是树
      if (this.config.type == 4) {
        if (this.singleSelect || !this.multipleSelect) {
          this.$refs['jr-table'].setCurrentNode(item)
          // this.selection = [item]
          this.handlerSelectionChange([item])
        }
      } else {
        if (this.singleSelect || !this.showCheckBox) {
          this.$refs['jr-table'].setCurrentRow(item)
          // this.selection = [item]
          this.handlerSelectionChange([item])
        } else {
          this.$refs['jr-table'].toggleRowSelection(item)
          // this.handlerSelectionChange([item])
        }
      }
      // console.info(this.selection)
    },
    handleDelete (index, row) { // 删除的时候执行
      let _this = this
      this.util.confirm('确认要删除吗？', '提示', () => {
        // console.log(index, row);
        let id = row['ID_']
        // console.info(this.config)
        let tableName = this.config.tableName
        deleteData({tableName: tableName, businessKey: id}).then(res => {
          _this.util.success('删除成功！')
          _this.loadData()
        })
        // let entity = formUtil.getEntity(this.config.entity)
        // let deleteSql = ''
        // if (entity) {
        //   if (entity.children) {
        //     entity.children.forEach(child => {
        //       deleteSql += 'delete from ' + child.tableName + ' where ' + child.foreignKey + '= \'' + id + '\';'
        //     })
        //   }
        //   deleteSql += 'delete from ' + entity.tableName + ' where ID_= \'' + id + '\';'
        //   // console.info('deleteSql-----------'+deleteSql)
        //   deleteData({sql: deleteSql}).then(res => {
        //     _this.util.success('删除成功！')
        //     _this.loadData()
        //   })
        // }
      })
    },
    deepBackFill (data, backFillMap) { // getSelectedData中递归回填数据
      // console.log('------deepBackFill-------',data, backFillMap)
      data = data.map(item => {
        let newItem = {}
        for (let rule in backFillMap) {
          newItem[rule] = item[backFillMap[rule]]
        }
        if (newItem.children && newItem.children.length > 0) {
          newItem.children = this.deepBackFill(newItem.children, backFillMap)
        }
        return newItem
      })
      return data
    },
    getSelectedData (flag) { // 获取选中行,flag为undefined的时候获取回填规则的数据，如果flag=0表示获取原数据
      if (this.gridData === undefined || this.gridData.length === 0) {
        return []
      }

      let selectedData = this.selectedData && this.selectedData.length > 0 ? this.selectedData : this.selection
      // console.log(flag+'---------getSelectedData----'+this.config.title+'----',this.selectedData, this.selection,selectedData)
      // 判断是否单选模式
      if (selectedData === null || selectedData.length == 0) {

      }
      // console.info('-----backfillRule----'+this.config.backfillRule);
      // console.info(this.config.backFillMap)
      // 判断是否有回填规则
      if (flag == undefined && this.config.backFillMap) {
        selectedData = this.deepBackFill(selectedData, this.config.backFillMap)
      }
      // console.log('-----------selectedData-----------',selectedData)
      return selectedData
    },
    getSelectedTreeData (flag) { // 获取选中的数据不包含子节点，只包含根节点以下数据, 主要用于明细表选择弹框
      let selectedData = this.getSelectedData(flag)
      if (selectedData) {
        let selectedMap = {}
        // 保存已选中的数据
        selectedData.forEach(item => {
          selectedMap[item['ID_'] || item['id']] = true
        })
        // 只留下根节点下的第一层
        selectedData = selectedData.filter(item => {
          let key = item['parentId']
          if (key && key === this.config.rootId) {
            return true
          }
          return false
        })
        // let data = this.config.tableData || this.gridData // 树结构是gridData
        // console.log('-------getSelectedTreeData----',selectedData, selectedMap)
        let srcData = this._deepTreeData(selectedData, selectedMap)
        return srcData
      }
      return selectedData
    },
    handlerOpenDialogConfirm: async function () { // openDialog弹框确定触发
      // 判断是否执行拷贝
      if (this.openDialogConfig.column && this.openDialogConfig.column.attr === 'copy') {
        let data = this.$refs['open-dialog'].getGridData(1)
        let selectedData = this.$refs['open-dialog'].getSelectedData(this.openDialogConfig.srcLevel || 1, 0)// 选中行
        let selectedMap = {}
        if (selectedData && selectedData != null) {
          selectedData.forEach(item => {
            selectedMap[item['ID_']] = true
          })
        }
        // console.log('-------handlerOpenDialogConfirm--------',data,selectedData,this.$refs['open-dialog'])
        let extraParams
        if (this.$refs['open-dialog'] && this.$refs['open-dialog'].getExtraParams) {
          extraParams = await this.$refs['open-dialog'].getExtraParams()
          // console.log('-----extraParams------',extraParams)
        }

        // console.log(data, selectedData)
        // 递归组装数据
        let srcData = this._deepTreeData(data, selectedMap)
        if (srcData.length === 0) {
          this.warn('请选择数据源')
          return
        }
        // console.log('-----最终计算结果-------', srcData)
        let srcFormKey = this.openDialogConfig.srcFormKey
        let desFormKey = this.openDialogConfig.desFormKey
        let desParams = this.openDialogConfig.desQueryParams
        // console.log('-----desParams-------',desParams)
        // 判断是否删除旧的数据
        let ifDelete = this.openDialogConfig.ifDelete
        // 选中的目标树主键
        let desId = ''
        let desSelectedData = this.getSelectedData(0)
        if (!ifDelete && desSelectedData && desSelectedData.length > 0) {
          desId = this.getSelectedData()[0]['ID_']
        }
        // 判断是否带有过滤参数
        let desQueryParams = []
        let queryParam = this.queryParams
        // console.log('-------queryParam------',this.queryParams)
        if (queryParam) {
          // 把url传参或者父组件传参传递到后台
          for (let key in queryParam) {
            desQueryParams.push({'key': key, 'value': queryParam[key]})
          }
        }
        if (extraParams) {
          if (desParams === undefined) {
            desParams = {}
          }
          desParams = Object.assign(desParams, extraParams)
        }
        let desParentId = null
        if (this.parentSelectedRow != null) {
          desParentId = this.parentSelectedRow.id || this.parentSelectedRow.ID_
        }
        let desRootId = this.config.rootId
        // console.log('------------', desParams, desQueryParams, desParentId, desRootId, desId)
        let desFormInfoId = this.config.id
        // console.log(srcFormKey, desFormKey, desParentId, desQueryParams, srcData)
        let params = {srcFormKey, srcData, desFormKey, desFormInfoId, desRootId, desId, desParentId, desParams, desQueryParams, delete: ifDelete}
        // console.log('-------params-------',params)
        // return
        copyTreeData(params, this).then(res => {
          this.loadData()
          this.openDialogVisible = false
          // this.cascade = false
        })
      }
    },
    _deepTreeData (data, selectedMap) {
      let resultArr = []
      if (data && data != null && data.length > 0) {
        // 组装选中的数据
        data.forEach(item => {
          let key = item['ID_'] || item['id']
          if (selectedMap[key]) {
            // 判断是否有子节点
            let newItem = { ...item }
            newItem.children = this._deepTreeData(newItem.children, selectedMap)
            if (newItem.children.length === 0) {
              // delete newItem.children
            }
            resultArr.push(newItem)
          }
        })
      }
      return resultArr
    },
    handlerSelectionChange (val) {
      console.log('-------handlerSelectionChange----' + this.config.title + '-----', this.selection, val)
      // 如果是树获取所有选中行，包括子节点和上级节点
      if (this.config.type === 4 && (this.multipleSelect || this.showCheckBox)) {
        val = this.$refs['jr-table'].getCheckedNodes(false, true)
      }
      // 去重复
      /* let x = new Set(val);
      val = [...x]; */
      // 判断是否需要记录选中
      let ifSaveSelected = false
      if (val && val[0]) {
        if (val[0]['ID_']) {
          ifSaveSelected = true
        }
      }
      // 判断如果是树，是列表或树表则做选中记忆
      if ((this.multipleSelect || this.showCheckBox) && ifSaveSelected && this.config.type !== 4) {
        // 对比val和旧的选中找出新增或者移除的
        let newData = []
        let deleteData = []
        let x = {}
        val = val.filter(item => {
          let key = item['ID_'] || item['id']

          if (x[key]) {
            return false
          } else {
            x[key] = item
            return true
          }
        })
        // this.$refs['jr-table'].toggleRowSelection(val)
        // 判断是否是tree
        if (this.selection && this.selection.length > 0) {
          this.selection.forEach((item, index) => {
            let find = val.find(s => {
              return s['ID_'] === item['ID_']
            })
            if (find) {

            } else {
              deleteData.push(item)
            }
          })
          val.forEach(item => {
            let find = this.selection.find(s => {
              return s['ID_'] === item['ID_']
            })
            if (find) {

            } else {
              newData.push(item)
            }
          })
        } else {
          val.forEach(item => {
            let find = this.selectedData.find(s => {
              return s['ID_'] === item['ID_']
            })
            if (find) {

            } else {
              newData.push(item)
            }
          })
        }
        if (this.selectedData === undefined) {
          this.selectedData = []
        } else {
          this.selectedData = this.selectedData.filter(item => {
            let find = deleteData.find(s => {
              return s['ID_'] === item['ID_']
            })
            if (find) {
              return false
            } else {
              return true
            }
          })
        }
        this.selectedData = this.selectedData.concat(newData)
      }
      this.selection = val
      console.log('-------handlerSelectionChange----' + this.config.title + '--end---', this.selection, this.selectedData)
    },
    handlerSelectionAutoSet () { // 切换页面，或者pageSize变化时打勾之前选择
      if (this.gridData === undefined || this.gridData.length === 0) {
        this.selection = []
      } else {
        // 判断如果是树，是列表或树表则做选中记忆
        if (this.config.type !== 4) {
          let checkedData = []
          this.handlerDeepSetChecked(this.gridData, checkedData)
          if (checkedData) {
            this.$nextTick(() => {
              checkedData.forEach(row => {
                this.$refs['jr-table'].toggleRowSelection(row)
              })
            })
          } else {
            // this.$refs.multipleTable.clearSelection();
          }
        }
      }
      console.log('------handlerSelectionAutoSet---' + this.config.title + '-----', this.selection, this.selectedData)
    },
    handleEdit (index, row) { // 点击编辑按钮
      this.formConfig.businessKey = row['ID_']
      // this.$router.push({params: {}})
      // 判断form-view中的路由qeury是否有值
      let routeQuery = this.config.parent.routeQuery
      // console.info(routeQuery)
      // console.info(this.formConfig.initValues)
      if (routeQuery != undefined && routeQuery != null) {
        if (this.formConfig.initValues === undefined) {
          this.formConfig.initValues = routeQuery
        } else {
          if (this.formConfig.initValues === undefined || this.formConfig.initValues === null) {
            this.formConfig.initValues = {}
          }
          for (let key in routeQuery) {
            this.formConfig.initValues[key] = routeQuery[key]
          }
          // this.formConfig.initValues = this.formConfig.initValues.concat(routeQuery);
        }
      }
      delete this.$route.params.formKey
      this.formDialogVisible = true
    },
    handlerTopButtonClick (button) { // queryForm页面点击topButton，切实弹框触发
      if (button.attr && button.attr === 'copy') {
        let selectedData = this.getSelectedData(0)
        // console.log('---------handlerTopButtonClick----------copy---------'+selectedData.length,selectedData)
        if (selectedData.length !== 1) {
          this.warn('您没有选择数据，将拷贝到根节点下')
        }
      }
      console.log('------handlerTopButtonClick-------', button)
      // 树组件按钮再右上角topButton时触发
      if (button.columnName === 'edit' || button.columnName === 'delete') {
        let selectedData = this.getSelectedData(0)
        if (selectedData.length !== 1) {
          // 请选择一行数据
          this.warn('请选择一行数据')
          return
        }
        let selectedTreeNode = this.$refs['jr-table'].getNode(selectedData[0].id)

        if (button.columnName === 'edit') {
          this.handleEdit(selectedTreeNode, selectedData[0])
        } else if (button.columnName === 'delete') {
          this.handleDelete(undefined, selectedTreeNode, selectedData[0])
        }
        return
      } else if (button.widgetType === 'import') {
        this.selectExcelVisible = true
        this.excelList = button.data
        return
      }
      this.handleRowButtonClick(button, 0)
    },
    handleRowButtonClick (column, index, row) { // 列表中按钮
      console.log('-------handleRowButtonClick-------', column, row)
      // 只读点击无效
      /* if (this.readOnly) {
        return
      } */
      if (column.events) {
        eval(column.events)
      }
      // console.log(column.openType+'--------1-------'+column.openUrl)
      if (column.openType && column.openUrl) {
        if (!row) {
          row = {}
        }
        let openParams = column.openParams
        if(this.validUtil.isNull(openParams)){
          openParams = "{}"
        }
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
                let queryParams = {}
                if (this.queryParams) {
                  queryParams = this.queryParams
                }
                // 如果是级联页面，则把上层数据也传入
                if (this.parentSelectedRow) {
                  queryParams = Object.assign(this.parentSelectedRow, queryParams)
                }
                let sessionProj = null
                if (window.localStorage.getItem('_session_proj' + this.sessionUtil.getUser().id)) {
                  sessionProj = JSON.parse(window.localStorage.getItem('_session_proj' + this.sessionUtil.getUser().id))
                } else if (this.getFormConfig['_session_proj' + this.sessionUtil.getUser().id]) {
                  sessionProj = this.getFormConfig['_session_proj' + this.sessionUtil.getUser().id].data
                  // console.log('------mainData-------', mainData, sessionProj)
                }
                if (sessionProj) {
                  if (this.validUtil.isNull(queryParams['PROJ_UID_'])) {
                    queryParams['PROJ_UID_'] = sessionProj.PROJ_UID_
                  }
                  if (this.validUtil.isNull(queryParams['PROJ_NAME_'])) {
                    queryParams['PROJ_NAME_'] = sessionProj.PROJ_NAME_
                  }
                  if (this.validUtil.isNull(queryParams['session-proj-uid'])) {
                    queryParams['session-proj-uid'] = sessionProj.PROJ_NAME_
                  }
                }
                // 试着替换查询参数 queryParams
                if (queryParams[columnName]) {
                  openParams = openParams.replace(new RegExp(key, 'gm'), '"' + queryParams[columnName] + '"')
                } else {
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
          this.openDialogTitle = this.config.title
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
          // console.log('--------openParams----------'+openParams)

          this.openDialogVueName = column.openUrl // eg: 'form-edit'
          let params = null
          if (this.openDialogVueName === 'form-query' || this.openDialogVueName === 'form-view') {
            // 说明是查询列表
            this.showOpenDialogTitle = false
            params = {}
            openParams = typeof openParams === 'string' ? JSON.parse(openParams) : openParams
            params = Object.assign(params, openParams)
            params.selectFormKey = openParams.formKey
            // 给列表传递查询参数
            params.queryParams = openParams.queryParams
            params.openConfig = {}
            /* // console.log('----------',openParams)
            if(openParams.assignMultipleSelect){
              params.assignMultipleSelect = openParams.assignMultipleSelect
            } */
          } else {
            // 根据配置设置弹窗的宽高
            this.openDialogWidth = column.openWidth || '';
            this.openDialogHeight = column.openHeight || '';
            this.showOpenDialogTitle = true
            params = {
              openConfig: typeof openParams === 'string' ? JSON.parse(openParams) : openParams
            }
          }
          let route = this.getRouteConfigByName(column.openUrl)
          // console.info(route)
          // 因为是表单所以通过这种方式传参
          params.openConfig.parent = this
          params.openConfig.openDialogTitle = this.config.title
          this.openDialogConfig = {
            route, params
          }
          // 判断是否执行的是拷贝
          if (column.attr && column.attr === 'copy' && (openParams.desFormKey || params.openConfig.desFormKey)) {
            this.openDialogConfirmVisible = true
            // this.cascade = true // 设置是级联，这样就可以根据配置的窗口大小打开
            // params.desFormKey = openParams.desFormKey//
            // 设置源视图的层级，比如级联时需要指明，默认是1
            this.openDialogConfig.srcLevel = openParams.srcLevel || params.openConfig.srcLevel
            this.openDialogConfig.desFormKey = openParams.desFormKey || params.openConfig.desFormKey
            this.openDialogConfig.srcFormKey = openParams.formKey || params.openConfig.formKey
            this.openDialogConfig.desQueryParams = openParams.desQueryParams || params.openConfig.desQueryParams
            // this.openDialogConfig.ifDelete = !!(openParams.desQueryParams || params.openConfig.desQueryParams)
            this.openDialogConfig.ifDelete = openParams.delete === undefined?false:openParams.delete
            console.log('-------openParams--------',openParams)
            this.openDialogConfig.column = column
            // this.openDialogConfig.selectedData = this.getSelectedData()
          }
          this.openDialogVisible = true
        }
      } else {
        // 判断标签tag组件是否配置有的状态不能点击, 例如：发布,1;取消发布,2;已发布,5,0;
        if (column.widgetType && column.widgetType === 'tag') {
          let value = row[column.columnName]
          // console.log('----------', column, value)
          if (column.attr) {
            let tagArr = column.attr.split(';')
            for (let i = 0; i < tagArr.length; i++) {
              let tagItem = tagArr[i].split(',')
              // console.log('----------', tagItem, tagItem[0])
              if (tagItem && tagItem[0] === value && tagItem.length === 3) {
                // 发布,1;取消发布,2;已发布,5,0
                if (tagItem[2] === '0') {
                  // 表示不能点击
                  return
                }
              }
            }
          }
        }
        // 判断是否按钮触发调用
        if (column.sourceType === 'api' && column.sourceAttr) {
          let idArr = []
          if (!row) {
            row = {}
            // 说明是顶部工具栏触发，说明是多选
            let selectedData = this.getSelectedData()
            if (selectedData && selectedData.length > 0) {
              selectedData.forEach(item => {
                if (item['ID_'] || item['id']) {
                  idArr.push(item['ID_'] || item['id'])
                }
              })
              row['ids'] = idArr.join(',')
            } else {
              this.warn('请选择数据!')
              return
            }
          }
          let _this = this
          let apiConfigArr = column.apiConfig
          if (apiConfigArr) {
            let promiseArr = []
            // apiConfigArr.forEach(apiConfig => {
            for (let i = 0;i<apiConfigArr.length; i++) {
              let apiConfig = apiConfigArr[i]
              let params = {}
              if (apiConfig.children) {
                apiConfig.children.forEach(child => {
                  let key = null
                  for (let field in row) {
                    if (child.value === '{' + field + '}') {
                      key = field
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
              // 判断是否接口
              if (apiConfig.runtype === 'Interface') {
                params['_url'] = apiConfig.runsql
                for (let key in row) {
                  if (params['_url'].indexOf('{' + key + '}') > -1) {
                    params['_url'].replace('{' + key + '}', row[key])
                  }
                }
              }
              if (row['ids']) {
                params['ids'] = row['ids']
              }else{
                params['businessKey'] = row['ID_'] || row['id']
              }

              params['formKey'] = this.config.formKey

              // 判断是否有条件
              let condition = apiConfig.condition
              if (this.validUtil.isNotNull(condition)) {
                this.gridColumns.forEach(c => {
                  if (condition.indexOf(c.columnName) > -1) {
                    let value = row[c.columnName]
                    if (c.javaType && c.javaType === 'String') {
                      value = '"' + value + '"'
                    }
                    condition = condition.replace(new RegExp('{' + c.columnName + '}', 'gm'), value)
                  }
                })
                var flag = true
                var expression = 'flag = (' + condition + ')'
                // console.log('-----expression-----' + expression)
                eval(expression)
                if (!flag) {
                  continue
                }
              }

              // 调用获取数据
              let p = getDataByApi(apiConfig.id, params)
              promiseArr.push(p)
            }

            _this.util.mask('正在执行...')
            Promise.all(promiseArr).then(() => {
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
    },
    handlerDeepSetChecked (data, checkedData) { // 递归勾选之前选中的数据
      console.log('---------handlerDeepSetChecked--------', data, this.selectedData)
      if ((this.multipleSelect || this.showCheckbox) && this.selectedData && this.selectedData.length > 0) {
        data.forEach(item => {
          let find = this.selectedData.find(temp => {
            if (temp['ID_'] === item['ID_']) {
              return true
            }
          })
          console.log(item['INSPECT_ITEM_'] + '--------find---------', item, find, this.selection)
          if (find) {
            // this.$refs['jr-table'].toggleRowSelection(item, true)
            checkedData.push(item)
          }
          if (item.children) {
            this.handlerDeepSetChecked(item.children, checkedData)
          }
        })
      }
    }
  }
}
