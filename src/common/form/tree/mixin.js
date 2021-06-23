import { deleteData, getGridData, copy, getDicData, getTreeData} from '@/api/form-render'
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
      openConfig: {},
      rootId: null,
      defaultProps: {
        children: 'children',
        label: this.config.treeColumn,
        isLeaf: 'leaf'
      }
    }
  },
  props: {

  },
  computed: {
    switchVal () {
      return true
    },
    isLeaf (data, node) {
      console.log(data, node)
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
    var vue = Vue // 定义Vue eval里无法直接获取vue
    eval("vue.prototype['copyForm'] = function (params){this.$confirm('是否确认复制'+params.TITLE_+'表单?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => { this.copy(params.FORM_KEY_).then(res => {if(res.status === 200){this.loadData();this.$message({type: 'success',message: '复制成功!'});}}); }).catch(() => {this.$message({type: 'info',message: '已取消复制'});});}")
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
      let ifNewChildBtn = false
      let ifEditBtn = false
      let ifDeleteBtn = false
      let ifImportBtn = false
      let ifExportBtn = false
      let topButtons = []
      let code = ''
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
          // 如果是数表则配置有模糊查询
          if (column.matchType == 'like' && this.isTree) {
            searchVisible = true
          }
          // 如果列表则配置过匹配类型就显示搜索框
          if (column.matchType && !this.isTree) {
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
              column.width = attrObj.width ? ((attrObj.width + '').indexOf('px') > -1 ? attrObj.width : (attrObj.width + 'px')) : '100px'
              column.height = attrObj.height ? ((attrObj.height + '').indexOf('px') > -1 ? attrObj.height : (attrObj.height + 'px')) : '100px'
              column.ifThumb = column.ifThumb ? column.ifThumb : true
            }
          }
          if (column && column.javaType === 'TopButton') {
            // 同级新增
            if (column.columnName.toLowerCase() === 'new' && this.config.btnAdd == 1 && !this.readOnly && (!this.singleSelect && !this.multipleSelect)) {
              ifNewBtn = true
              column.class = column.icon + ' tree-icon'
              topButtons.push(column)
            }
            // 增加下级
            else if (column.columnName.toLowerCase() === 'new-child' && this.config.btnAdd == 1 && !this.readOnly && (!this.singleSelect && !this.multipleSelect)) {
              ifNewChildBtn = true
              column.class = column.icon + ' tree-icon'
              topButtons.push(column)
            } else if (column.columnName.toLowerCase() === 'edit' && this.config.btnEdit == 1 && !this.readOnly && (!this.singleSelect && !this.multipleSelect)) {
              ifEditBtn = true
              column.class = column.icon + ' tree-icon'
              topButtons.push(column)
            } else if (column.columnName.toLowerCase() === 'delete' && this.config.btnDelete == 1 && !this.readOnly && (!this.singleSelect && !this.multipleSelect)) {
              ifDeleteBtn = true
              column.class = column.icon + ' tree-icon-delete'
              topButtons.push(column)
            } else {
              column.class = column.icon + ' tree-icon'
              topButtons.push(column)
            }
          } else if (column && column.javaType === 'CellButton') {
            gridColumns.push(column)
          } else {
            gridColumns.push(column)
          }
        })
        // 计算每个控件占每行的比例
        if (searchFormRows) {
          searchFormRows.filter(e => {
            let col = 0
            e.forEach(v => { col += v.col })
            e.filter(v => { v.col = v.col / col; return v })
            return e
          })
        }
        // console.info('----------');
        // console.info(topButtons);
        let standardButtons = []
        if (!ifNewBtn && this.config.btnAdd == 1 && !this.readOnly && (!this.singleSelect && !this.multipleSelect)) {
          // 添加默认新增按钮
          standardButtons.push({columnName: 'new', title: '添加同级', class: 'el-icon-folder-add tree-icon'})
        }
        if (!ifNewChildBtn && this.config.btnAdd == 1 && !this.readOnly && (!this.singleSelect && !this.multipleSelect)) {
          // 添加默认导入按钮
          standardButtons.push({columnName: 'new-child', title: '添加下级', class: 'el-icon-document-add tree-icon'})
        }
        if (!ifEditBtn && this.config.btnEdit == 1 && !this.readOnly && (!this.singleSelect && !this.multipleSelect)) {
          // 添加默认导入按钮
          standardButtons.push({columnName: 'edit', title: '编辑', class: 'el-icon-edit tree-icon'})
        }
        if (!ifDeleteBtn && this.config.btnDelete == 1 && !this.readOnly && (!this.singleSelect && !this.multipleSelect)) {
          // 添加默认导入按钮
          standardButtons.push({columnName: 'delete', title: '删除', type: 'danger', class: 'el-icon-delete tree-icon-delete'})
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
        if (this.config.lazy !== 1) {
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
      this.rootId = null
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
    // 树表懒加载
    load (node, resolve) {
      this.rootId = node.data.id || this.config.rootId
      this.loadData(resolve)
    },
    loadData (resolve) { // 加载grid数据
      // console.info('-------loadData------', this.parentSelectedRow);
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
      params.rootId = this.rootId
      getTreeData(params, this).then(data => {
        if (data && data.length > 0) {
          data.map((item, index) => {
            item.leaf = item.hasChildren !== 1
            return item
          })
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
              resolve(data || [])
            }, 1000)
          } else {
            _this.gridData = data
            // console.log('-------------')
            _this.$nextTick(function () {
              return
              let nodeDivs = document.querySelectorAll("div[class='el-tree-node__content']")
              // console.log('-----------',nodeDivs)
              if (nodeDivs) {
                nodeDivs.forEach((nodeDiv, index) => {
                  if (index % 2 === 1) {
                    nodeDiv.classList.add('el-tree-node__row--striped')
                  }
                })
              }
            })
            // 如果为左右结构 且为左侧 默认将第一行数据作为参数
            if (_this.config.parent && _this.isLeft) {
              // 默认选中第一项
              /* this.$refs['jr-table'].toggleRowSelection(_this.gridData[0], true)// 用于多选
              this.$refs['jr-table'].setCurrentRow(_this.gridData[0])// 用于单选 */
              this.handlerSelectionChange([_this.gridData[0]])
              _this.config.parent.handlerRowClick(2, _this.gridData[0])
            }
          }
        } else {
          if (resolve) return resolve([])
          _this.emptyText = '暂无数据'
          _this.pageCount = 0
        }
      })
    },
    getSelectedTreeNode (id) {
      return this.$refs['jr-table'].getNode(id)
    },
    copy (params) {
      return copy(params)
    },
    handlerRowClick (queryFormIndex, row) { // 监听查询列表的单击事件
      // console.info('------handlerRowClick-------' + queryFormIndex)
      // console.info(row)
    },
    // --------拖拉拽函数开始--------
    toggleRowExpansion (row, expanded) {
      console.log(row, expanded)
    },
    handleDragStart (node, ev) {
      // console.log(this.startNode);
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      // console.log('tree drag enter: ', dropNode.label);
    },
    handleDragLeave (draggingNode, dropNode, ev) {
      // console.log('tree drag leave: ', dropNode.label);
    },
    handleDragOver (draggingNode, dropNode, ev) {
      // console.log('tree drag over: ', dropNode.label);
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      let _this = this
      let params = {
        id: draggingNode.data.id,
        parentColumn: this.config.parentColumn,
        formInfoId: this.config.id
      }
      // 先修改数据ID
      if (dropType === 'inner') {
        params.parentId = dropNode.data.id
        params.sort = dropNode.data.children.length
      }
      if (dropType === 'after') {
        params.parentId = dropNode.data.parentId
        params.sort = (dropNode.data['SORT_'] || 0) + 1
      }
      if (dropType === 'before') {
        params.parentId = dropNode.data.parentId
        params.sort = (dropNode.data['SORT_'] || 0) - 1
      }
      _this.util.mask()
      _this.util.restPost('/api_v1/form/edit_tree', params, function (res) {
        if (res != undefined && res != null) {
          if (res.status !== 200) {
            _this.util.warn('操作失败' + res.errorMsg)
          }
        }
        _this.util.unmask()
      })
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      // console.log('tree drop: ', dropNode.label, dropType);
    },
    allowDrop (draggingNode, dropNode, type) {
      // console.log(draggingNode, dropNode, type)
      return true
      // if (dropNode.data.label === '二级 3-1') {
      //   return type !== 'inner';
      // } else {
      //   return true;
      // }
    },
    handlerSaveDataCallback (operateType, params, id) {
      console.log('-------handlerSaveDataCallback---------', operateType, params, id)
      let node = params.mainFormDataMap
      let parentNode = this.getSelectedTreeNode(node[this.config.parentColumn])
      node.parentId = node[this.config.parentColumn]
      node.label = node.TITLE_ || node.NAME_
      node.id = id
      node.ID_ = id
      console.log('-------handlerSaveDataCallback----1-----', parentNode)
      if (operateType === 'new') {
        if (parentNode && parentNode != null) {
          this.$refs['jr-table'].append(node, parentNode)
        } else {
          console.log('------1------', this.gridData)
          // 说明是最顶层
          this.gridData.splice(node['SORT_'] - 1, 0, node)
          console.log('------2------', this.gridData)
        }
      } else {
        this.loadData()
      }
    },
    handleNodeEdit (e, node, data) {
      if (e) {
        e.stopPropagation()
      }
      // console.log('----handleEdit----',node,data)
      this.handleEdit(node, data)
    },
    handleDelete (e, node, data) { // 删除的时候执行
      if (e) {
        e.stopPropagation()
      }
      console.log('----handleDelete----', node, data)
      if (node.childNodes && node.childNodes.length > 0) {
        this.warn('请先删除子节点！')
        return
      }
      let row = data
      let _this = this
      this.util.confirm('确认要删除吗？', '提示', () => {
        // console.log(index, row);
        let id = row['ID_']
        // console.info(this.config)
        let tableName = this.config.tableName
        deleteData({tableName: tableName, businessKey: id}).then(res => {
          _this.util.success('删除成功！')
          _this.$refs['jr-table'].remove(node)
        })
      })
    },
    allowDrag (draggingNode) {
      return true
      // return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
    },
    renderContent (h, { node, data, store }) {
      let tool = []
      /* if(!this.singleSelect && !this.multipleSelect && !this.readOnly){
        tool = [
          h('i',{
            attrs: {
              type: 'warning',
              size: 'mini'
            },
            class:'el-icon-edit',
            style: {
              'font-size': '13pt',
              'cursor': 'pointer',
              'color': 'rgb(59, 140, 255)'
            },on: {
              click: ((e)=>{
                this.handleNodeEdit(e, node, data)
              })
            }
          }),
          h('i',{
            attrs: {
              type: 'danger',
              size: 'mini'
            },
            class:'el-icon-delete',
            style: {
              'font-size': '13pt',
              'cursor': 'pointer',
              'color': 'red',
              'margin-left': '5px'
            },on: {
              click: ((e)=>{
                this.handleDelete(e, node, data)
              })
            }
          })
        ]
      } */
      // console.log('--------renderContent------',node)
      return h('span', {
        class: 'jr-tree-node'
      }, [
        h('span', {
          class: 'jr-tree-node-text'
        }, [
          h('span', {
            domProps: {
              innerHTML: node.label
            }
          })
        ]),
        h('span', {
          class: 'jr-tree-node-tool'
        }, [
          h('div', {
            class: 'el-button-group'
          /* domProps: {
            innerHTML: '<i  type="warning" size="mini" @click="handleEdit(node, data)" class="el-icon-edit" style="font-size: 13pt; cursor: pointer; color: rgb(59, 140, 255);"></i> <i type="danger" size="mini" class="el-icon-delete" style="margin-left: 5px; font-size: 13pt; cursor: pointer; color: red;"></i>'
          } */
          }, tool)
        ])
      ])
    }
    // --------拖拉拽函数结束--------
  }
}
