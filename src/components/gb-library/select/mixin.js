import {getConfig, getDicData} from "../../../api/form-render";

export const mixin = {
  data: function () {
    return {
      formKey: 't_gdb_jcbz_select',
      loading: false,
      showTree: false,
      formData: {
        PROJ_LX:[],
        PROJ_PURPOSE:[]
      },
      dicData:{
        PROJ_LX:[],
        PROJ_PURPOSE:[]
      },
      rules: {
        PROJ_LX: [
          {type: 'array', required: true, message: '请至少选择一个项目类型', trigger: 'change'}
        ],
        PROJ_PURPOSE: [
          {type: 'array', required: true, message: '请至少选择一个业态', trigger: 'change'}
        ]
      },
      queryParams:{},
      dataConfig: {}, // 右侧检查项
      treeConfig: {}// 左边国标库目录
    }
  },
  props: {
    openConfig: { // 列表或者按钮或者传统触发弹框打开页面时使永
      type: Object,
      default: function () {
        return undefined
      }
    }
  },
  computed: {
    dicValue () { // 数据字典label
      return function (name) {
        // console.info(this.dicMap[column.columnName])
        if (name) {
          if (this.dicData[name]) {
            return this.dicData[name]
          }
        }
        return []
      }
    }
  },
  created() {

  },
  mounted() {
    this.queryParams = this.openConfig.queryParams
    // console.log('------mounted------',this.openConfig,this.queryParams)

    this.init()
  },
  methods: {
    getGridData(){
      let queryForm = this.$refs['jr-tree']
      if (queryForm) {
        return queryForm.gridData
      }
      return null
    },
    getSelectedData(){
      let queryForm = this.$refs['jr-tree']
      let selectedData = []
      if (queryForm && queryForm.getSelectedData) {
        selectedData = queryForm.getSelectedData()
      }
      return selectedData
    },
    getExtraParams (){
      return new Promise(resolve => {
        this.$refs['jr-form'].validate((valid) => {
          if (valid) {
            let data = [
              {
                key: 'PROJ_LX',
                valye: this.formData['PROJ_LX'].join(',')
              },
              {
                key: 'PROJ_PURPOSE',
                valye: this.formData['PROJ_PURPOSE'].join(',')
              }
            ]
            data = {
              PROJ_LX: this.formData['PROJ_LX'].join(','),
              PROJ_PURPOSE: this.formData['PROJ_PURPOSE'].join(',')
            }
            // console.log('--------getExtraParams-------',data)
            resolve(data)
          } else {
            return false;
          }
        });
      });

    },
    init() {
      this.loading = true
      getConfig(this.formKey).then(res => {
        let treeConfig = res.forms[0]
        treeConfig.formKey = this.formKey
        treeConfig.parent = this
        treeConfig.parent.formConfig = res
        let dataConfig = res.forms[1]
        dataConfig.formKey = this.formKey
        dataConfig.parent = this
        dataConfig.parent.formConfig = res
        this.treeConfig = treeConfig
        this.dataConfig = dataConfig
        this.showTree = true
        // console.log(res, this.treeConfig)
        this.loading = false

      })
      // 获取项目类型数据字典
      getDicData("PROJ_GCLX").then(data => {
        this.dicData['PROJ_LX'] = data
        this.$forceUpdate()
      })
      // 获取业态数据字典
      getDicData("T_PROJ_PURPOSE").then(data => {
        this.dicData['PROJ_PURPOSE'] = data
        this.$forceUpdate()
        // console.log(this.dicData)
      })
    },
    handlerRowClick (queryFormIndex, row) {
      let queryForm = this.$refs['jr-data']
      // console.log('------handlerRowClick------',queryFormIndex, row, queryForm)
      if (queryForm) {
        if (queryForm.handlerParentClick) {
          queryForm.handlerParentClick(row)
        }
      }
    }
  }
}
