import CmpLoader from '../../../common/cmp-loader/cmp-loader'
import {getDicData,getSqlDicData,getCommonGridData} from '@/api/form-render'
export const mixin = {
  data: function () {
    return {
      type:'grid-table',
      pageSize:30,
      pageIndex:1,
      pageCount:0,
      totalCount:0
    }
  },
  props: {
  },
  computed:{

  },
  created () {

  },
  mounted () {
    // console.info(this.queryParams)
    this.init();
    this.loadData();
  },
  methods: {
    init(){
      let config = this.config;
      // console.log(config)
      let _this = this;
      if(config){
        if(config.columns){
          config.columns.forEach(column=>{
            // 判断是否数据字典
            if (column.widgetType === 'select') {
              let attr = column.attr;
              column['options'] = [];
              if(_this.validUtil.isNotNull(attr)){
                if ( attr.indexOf(',') > -1) {

                  _this.dicMap[column.columnName] = {};
                  // 说明是直接写死类型
                  let data = [];
                  let options = attr.split(';');
                  options.forEach(item => {
                    let option = item.split(',');
                    // 存入键值对
                    data.push({name: option[1], value: option[0]});
                    _this.dicMap[column.columnName][option[0]] = option[1];
                  });
                  column.options = data;
                  // this.$forceUpdate()
                }
              }

            }else if (column.widgetType === 'select-dic') {
              let attr = column.attr;

              if(_this.validUtil.isNotNull(attr)) {
                if(_this.dicMap[column.columnName] === undefined){
                  // 加载数据字典
                  _this.dicMap[column.columnName] = {};
                  getDicData(attr).then(data => {
                    data.forEach(item => {
                      _this.dicMap[column.columnName][item.value] = item['name'];
                    });
                    column.options = data;
                    this.$forceUpdate()
                  })
                }

              }
            }else if (column.widgetType === 'select-sql') {
              let attr = column.attr;
              if (_this.dicMap[column.columnName] === undefined) {
                // 加载数据字典
                _this.dicMap[column.columnName] = {};
                getSqlDicData({columnId: column.id, params: this.queryParams}).then(data => {
                  if (data) {
                    data.forEach(item => {
                      _this.dicMap[column.columnName][item.value] = item['name'];
                      _this.$set(_this.dicMap[column.columnName], item.value, item['name']);
                    });
                    column.options = data;
                    // console.info(_this.dicMap)
                    this.$forceUpdate()
                    this.$refs['jr-table'].doLayout()
                  }
                })
              }
            }
          });
          this.columns = config.columns;
        }
      }
    },
    updateColumns(){
      this.init()
    },
    loadData(data){ // 加载数据
      let tableData = [];
      let _this = this;
      if(data){
        tableData = data;
        this.tableData = tableData;
        // 循环遍历解决新增属性无法更新视图问题
        this.tableData.forEach(item=>{
          this.columns.forEach(column=>{
            if(item[column.columnName] === undefined){
              // if(column.javaType && column.javaType === 'Double')
              // item[column.columnName] = '';
              _this.$set(item, column.columnName, undefined);
            }
          });
        });
      }else{
        if(this.config.proxy){
          let url = this.config.proxy.url
          let type = this.config.proxy.type
          let params = {...this.config.proxy.params}
          params.pageIndex = this.pageIndex
          params.pageSize = this.pageSize
          if(params === undefined){
            params = {}
          }
          params = Object.assign(params, this.queryDataParams)


          if(this.config.proxy.beforeLoad){
            this.config.proxy.beforeLoad(params)
          }

          getCommonGridData(url, type, params).then(res => {
            _this.tableData = res.data;
            if(res.data == undefined || res.data.length ===0){
              _this.emptyText ='暂无数据';
              _this.pageCount = 0;
              _this.totalCount = 0
            }else{
              _this.totalCount = res.totalCount
              _this.pageCount = (_this.totalCount  +  _this.pageSize  - 1) / _this.pageSize;
            }
          }).catch(() => {
            _this.tableData = []
            _this.emptyText ='暂无数据';
            _this.pageCount = 0;
            _this.totalCount = 0
          })
        }
      }


    },
    cellClick(row , column){ // 单元格单击

    },deleteRow (index, rows) {
      // 移除一行
      if (this.tableData.length > 0) {
        rows.splice(index, 1) // 删掉该行
      }
    },
    addRow (cellObj) {
      // 新增一行
      var vm = this;
      if(cellObj === undefined){
        cellObj = {};
      }
      vm.columns.forEach(column => {
        cellObj[column.columnName + 'isShow'] = false;
        if(cellObj[column.columnName] === undefined){
          cellObj[column.columnName] = undefined
        }

      });
      if (vm.tableData === undefined) {
        vm.tableData = []
      }
      cellObj['sort'] = vm.tableData.length+1;
      vm.tableData.push(cellObj)
    },dblClick (row, column, index) {
      if(this.readOnly || !this.edit){
        if(column.openUrl && column.openParams){
          if(column.onCellClick){
            column.onCellClick(column, row, index)
          }else{
            this.handleRowButtonClick (column, index, row)
          }

        }
        return;
      }
      this.$set(row,column.columnName + 'isShow',true)
      //row[column.columnName + 'isShow'] = true
      if (column.widgetType && column.widgetType != 'date') {
        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs[column.columnName + index][0].focus()
          })
        }, 50)
      }
    },
    handlerChangeValue (newVal, column, row, index) { // 监听字段值发生改变
      // this.$refs[column.columnName + index][0].focus();
      row[column.columnName + 'isShow'] = false
      var expression = ''
      this.columns.forEach(column => {
        if (column.javaType === 'Double' || column.javaType === 'Integer') {
          if (row[column.columnName] === undefined) {
            expression += 'var ' + column.columnName + ' = 0 ;'
          } else {
            expression += 'var ' + column.columnName + ' = ' + row[column.columnName] + ' ;'
          }
        }
      })
      // console.info('expression-----'+expression)
      // 循环计算公式
      if (this.expression) {
        for (let key in this.expression) {
          // eslint-disable-next-line camelcase
          var expression_result = 0
          // console.info(key+'-------'+this.expression[key])
          var resultStr = expression + 'expression_result = ' + this.expression[key] + ';'
          // console.info('resultStr-----'+resultStr)
          // eslint-disable-next-line no-eval
          eval(resultStr)
          // console.info('expression_result-------'+expression_result)
          // eslint-disable-next-line camelcase
          row[key] = expression_result
          this.$forceUpdate()
        }
      }
    },
    handleSizeChange (pageSize) { // pageSize切换
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
  iptBlur (row, column, index) {
    // this.clickRow = row;
    this.$set(row,column.columnName + 'isShow',false)
  },
  getSummaries (param) {
    const { columns, data } = param
    const sums = []
    let _this = this
    columns.forEach((column, index) => {
      if (index === 2) {
        sums[index] = '合计'
        return
      }
      let property = column.property ? column.property : column.columnName
      let columnConfig = _this.summaryColumns[property]
      if (columnConfig) {
        let title = columnConfig.title
        // console.info(columnConfig)
        const values = data.map(item => {
          // console.info(property+'-----'+JSON.stringify(item))
          JSON.stringify(item)
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
          // console.info('result---'+result)
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
    // 触发调用
    this.handlerSummaryChange()
    // console.info('-----sums----'+JS
    // ON.stringify(sums))
    // this.$forceUpdate()
    return sums
  },
  getSummaryData () { // 获取汇总数据
    return this.summaryData
  },
  handlerSummaryChange () { // 获取汇总数据
    // console.info('-----handlerSummaryChange-----1---'+this.config.parent)
    if (this.config.parent && this.config.parent.handlerSummaryChange) {
      this.config.parent.handlerSummaryChange(this.config, this.getSummaryData())
    }
  }
  },
  components: {
    CmpLoader
  }
}
