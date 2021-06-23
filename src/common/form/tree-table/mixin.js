/* eslint-disable eqeqeq */
import {getTreeData} from '@/api/form-render'
export const mixin = {
  data: function () {
    return {
      treeColumns: [],
      treeData: [],
      treeStructure: true,
      parentSelectedRow: null, // 级联页面，父页面的选中行
      openConfig: {}
    }
  },
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array,
      default: function () {
        return []
      }
    },
    queryParams: {
      type: Object,
      default: function () {
        return {}
      }
    },
  },
  computed: {
    treeDataLoaded () { // 该计算属性完全是为了触发计算treeData
      let data = [
        {
          id: 1,
          SUBJECT_NAME_: '科目一',
          DEPART_NAME_: '材料部',
          children: [
            {
              id: 11,
              SUBJECT_NAME_: '科目一',
              DEPART_NAME_: '材料部子集'
            }
          ]
        },
        {
          id: 2,
          SUBJECT_NAME_: '科目二',
          DEPART_NAME_: '市场部',
          children: [
            {
              id: 21,
              SUBJECT_NAME_: '科目二',
              DEPART_NAME_: '市场部子集',
              children: [
                {
                  id: 11,
                  SUBJECT_NAME_: '科目一',
                  DEPART_NAME_: '材料部子集'
                }
              ]
            }
          ]
        }
      ]

      return true
    }
  },
  mounted () {
    this.treeData = []
    this.formData = {}
    this.formDialogVisible = false
    this.selectedData = []
    this.keyword = '';
    this.formData = {};
    this.queryFormVisible = false;
    this.searchFormRows = [];
    this.searchFormColumns = [];
    this.topButtons = [];
    // this.data = this.treeToArray(this.data, null, null, this.defaultExpandAll)
    this.init()
    
  },
  methods: {
    init () {
      let columns = [];
      let ifNewBtn = false;
      let ifImportBtn = false;
      let ifExportBtn = false;
      let topButtons = [];
      let queryColumns = this.config.queryColumns
      let treeColumn = this.config.treeColumn
      if(this.queryParams){
        this.openConfig =JSON.parse(JSON.stringify(this.queryParams))
        this.openConfig.initValues = this.queryParams
      }
      this.openConfig.parent = this
      // console.info('treeColumn--------'+treeColumn)
      // 过滤权限
      queryColumns = queryColumns.filter((item, index) => {
        return item.btnLook == 1
      })
      if (queryColumns) {
        queryColumns.forEach(column => {
          // 判断是否隐藏
          if (!column.hidden) {
            let newColumn = {dataIndex: column.columnName, text: column.title, width: column.width}
            if (newColumn.dataIndex === treeColumn) {
              newColumn.treeColumn = true
            }
            if (column.sortable) {
              newColumn.sortable = column.sortable
            }
            if(column && column.javaType === 'TopButton'){
              if(column.columnName.toLowerCase() === 'new' && this.config.btnAdd == 1){
                ifNewBtn = true;
                topButtons.push(column);
              }
              if(column.columnName.toLowerCase() === 'import' ){
                ifImportBtn = true;
                topButtons.push(column);
              }else if(column.columnName.toLowerCase() === 'export' && this.config.btnExport == 1){
                ifExportBtn = true;
                topButtons.push(column);
              }
            }else if(column && column.javaType === 'CellButton'){
              if(column.columnName.toLowerCase() === 'edit' || column.columnName.toLowerCase() === 'delete'){
                if(column.columnName.toLowerCase() === 'edit' && column.hidden === 1){
                  this.showRowEditButton = false
                }
                if(column.columnName.toLowerCase() === 'delete'  && column.hidden === 1){
                  this.showRowDeleteButton = false
                }
              }else{
                columns.push(column)
              }
            }else{
              columns.push(newColumn)
            }
          }
        })
      }
      let standardButtons = [];
      if(!ifNewBtn && !this.readOnly && this.config.btnAdd == 1){
        // console.info('--------------')
        // 添加默认新增按钮
        standardButtons.push({columnName:'new',title:'新增',icon:'el-icon-plus'});
        // topButtons = topButtons.splice(0,0,{columnName:'new',title:'新增',icon:'el-icon-plus'});
      }
      if(!ifImportBtn){
        // 添加默认导入按钮
        //topButtons = topButtons.splice(0,0,{columnName:'new',title:'导入',icon:'el-icon-download'});
      }

      if(standardButtons.length>0){
        standardButtons.reverse().forEach(button=>{
          topButtons.unshift(button);
        });

      }
      this.treeColumns = columns
      // 判断是否是选择，如果是选择，不需要弹出搜索框
      this.queryFormVisible = true
      // console.info(this.queryFormVisible+'--------'+this.singleSelect)
      this.formConfig = {...this.config};
      // 传递到query-form
      this.topButtons = topButtons;
      // 把当前组件传递给子组件
      this.formConfig.parent = this;
      // 加载table数据
      if(this.autoLoad){
        this.loadData();
      }
    },
    queryData (params) { // 查询表单查询调用
      if (params) {
        this.keyword = params.keyword
        this.formData = params.formData
        this.loadData()
      }
    },
    handlerParentClick (row) { // 监听级联页面时，上一个关联父页面点击触发本页面数据刷新
      this.parentSelectedRow = row
      this.loadData()
    },
    loadData () {
      let _this = this
      let treeData = []
      if (this.config && this.config != undefined) {
        // 判断是否带有过滤参数
        let queryParams = []
        let queryParam = this.queryParams
        if(queryParam && this.config.queryColumns){
          this.config.queryColumns.forEach(column => {
            if(column.initMatchValue && column.matchType){
              for (const key in queryParam) {
                // 判断是否需要替换过滤参数中的值
                column.initMatchValue = column.initMatchValue.replace(new RegExp("\\{" + key + "\\}","g"),queryParam[key])
              }
              queryParams.push({'key': column.columnName,'value': column.initMatchValue})
            }
          })
        }
        let parentId = null
        if (this.parentSelectedRow != null) {
          parentId = this.parentSelectedRow.id || this.parentSelectedRow.ID_
        }
        let params = {
          'formKey': _this.config.formKey,
          'id': _this.config.id,
          'tableName': _this.config.tableName,
          'api': _this.config.api,
          'queryParams':queryParams,
          'parentId': parentId
        }
        getTreeData(params, this).then(data => {
          // 添加跟节点显示
          if(_this.config.showRoot){
            let root = {};
            root['children'] = data;
            root[_this.config.treeColumn] = _this.config.rootText;
            _this.rowClick(root)
            data = [root]
          }
          if(data && data.length>0){
            treeData = this.treeToArray(data, null, null, this.defaultExpandAll)
          }
          _this.treeData = treeData
          // 如果为左右结构 且为左侧树结构 默认将第一行数据作为参数
          if(_this.config.parent && _this.isLeft){
            // 默认选中第一项
            // this.$refs['jr-table'].toggleRowSelection(_this.treeData[0], true)// 用于多选
            this.$refs['jr-table'].setCurrentRow(_this.treeData[0])// 用于单选
            this.handlerSelectionChange([_this.treeData[0]])
            _this.config.parent.handlerRowClick(2, _this.treeData[0])
          }
        })
      }
    }, // 展示或隐藏行
    showTr: function (row, index) {
      let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
      row.row._show = show
      return show ? '' : 'display:none;'
    },
    // 展开下级
    toggle: function (trIndex) {
      let me = this
      let record = me.treeData[trIndex]
      record._expanded = !record._expanded
    },
    // 显示层级关系的空格和图标
    spaceIconShow (index) {
      let me = this
      if (me.treeStructure && index === 0) {
        return true
      }
      return false
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow (column, index, record) {
      let me = this
      // if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
      if (me.treeStructure && column.treeColumn && record.children && record.children.length > 0) {
        return true
      }
      return false
    },
    // 显示行
    treeToArray (data, parent, level, expandedAll) {
      let Vue = this
      let tmp = []
      Array.from(data).forEach(function (record) {
        if (record._expanded === undefined) {
          Vue.$set(record, '_expanded', expandedAll)
        }
        if (parent) {
          Vue.$set(record, '_parent', parent)
        }
        let _level = 0
        if (level !== undefined && level !== null) {
          _level = level + 1
        }
        Vue.$set(record, '_level', _level)
        tmp.push(record)
        if (record.children && record.children.length > 0) {
          let children = Vue.treeToArray(record.children, record, _level, expandedAll)
          tmp = tmp.concat(children)
        }
      })
      return tmp
    }
  }
}
