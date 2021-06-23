export const mixin = {
  data: function () {
    return {
      type:'sp-tree-table',
      defaultExpandAll:true,
      treeStructure: true
    }
  },
  props: {
    config: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {},
  created() {

  },
  mounted() {
    this.init();
    // this.loadData();
  },
  methods: {
    init(){
      let config = this.config;
      if(config){
        let treeColumn = config.treeColumn;
        // console.info('treeColumn------'+treeColumn)
        let columns = [];
        if(config.columns){
          config.columns.forEach(column => {
            // 判断是否隐藏
            if (!column.hidden) {
              let newColumn = {...column};
              if (newColumn.columnName === treeColumn) {
                newColumn.treeColumn = true
              }
              if (column.sortable) {
                newColumn.sortable = column.sortable
              }
              columns.push(newColumn)
            }
          });
        }
        // console.info(columns)
        this.columns = columns;
      }
    },
    loadData(data){
      // let data  = [{
      //   id:'material-store-1',
      //   title:"物资目录",
      //   type:2,
      //   entityId:'IMS_MAT_CATALOG',
      //   tableName:'IMS_MAT_CATALOG',
      //   children:[{
      //     id:'material-store-2',
      //     title:"物资明细",
      //     type:1,
      //     entityId:'IMS_MAT_INFO',
      //     tableName:'IMS_MAT_INFO',
      //     parentId:'material-store-1'
      //   }]
      // }];
      // console.info(data)
      // if(this.tableData.length>0){
      //   return;
      // }
      if(data == undefined){
        data = this.config.data;
        if(data === undefined ){
          data = [];
        }
      }
      // console.info(data)
      let treeData = this.treeToArray(data, null, null, this.defaultExpandAll);
      // console.info(treeData)
      this.tableData = treeData
    },
    showTr: function (row, index) {// 展示或隐藏行
      let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
      row.row._show = show
      return show ? '' : 'display:none;'
    },
    // 展开下级
    toggle: function (trIndex) {
      let me = this;
      let record = me.tableData[trIndex];
      record._expanded = !record._expanded
    },
    // 显示层级关系的空格和图标
    spaceIconShow(index) {
      let me = this
      if (me.treeStructure && index === 0) {
        return true
      }
      return false
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow(column, index, record) {
      let me = this;
      // if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
      if (me.treeStructure && column.treeColumn && record.children && record.children.length > 0) {
        return true
      }
      return false
    },
    // 显示行
    treeToArray(data, parent, level, expandedAll) {
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
