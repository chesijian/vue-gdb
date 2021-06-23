
export const mixin = {
  data: function () {
    return {

    }
  },
  props: {
    vueName: {
      type: String,
      default: ''
    },
    require: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  render: function (createElement) {
    // console.info(typeof this.config.params+'---'+this.config.params)
    let props = null
    if(typeof this.config.params === 'string'){
      props = JSON.parse(this.config.params)
    }else {
      props = this.config.params
    }
    return createElement(this.vueName,{
      // props:this.config.params
      ref: 'cmp-child',
      props:props
    })
  },
  computed:{

  },
  created () {
    // console.info(this.config)
    // this.$options.components[this.vueName] = require('@/components/' + this.vueName + '.vue')
    this.$options.components[this.vueName] = this.config.route.component
  },
  mounted () {

  },
  methods: {
    getGridData (index) { // 获取选中的列表数据
      let cmp = this.$refs['cmp-child']
      if (cmp && cmp.getGridData) {
        return cmp.getGridData(index)
      }
      return null
    },
    getSelectedData (index) { // 表单作为弹框选择时 获取选中数据, index为指定table的索引
      // console.log('-------cmp-loader---getSelectedData----'+index, this.$refs)
      let cmp = this.$refs['cmp-child']
      let selectedData = []
      if (cmp && cmp.getSelectedData) {
        selectedData = cmp.getSelectedData(index)
      }
      return selectedData
    },
    getExtraParams (index) { // 表单作为弹框选择时 获取选中数据, index为指定table的索引
      // console.log('-------cmp-loader---getSelectedData----'+index, this.$refs)
      let cmp = this.$refs['cmp-child']
      let selectedData = undefined
      if (cmp && cmp.getExtraParams) {
        selectedData = cmp.getExtraParams(index)
      }
      return selectedData
    }
  }
}
