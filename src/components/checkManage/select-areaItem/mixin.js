import {getConfig, getDicData} from '../../../api/form-render'

export const mixin = {
  data: function () {
    return {
      formKey: 't_gdb_jcbz_select',
      yetaiValue: '',
      principal: [],
      startDate: '',
      finishDate: '',
      dataSource: '企业库',
      loading: false,
      loadIteming: false,
      showTree: false,
      areaList: [],
      projItemList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      companyProps: {
        children: 'children',
        label: 'itemName',
        isLeaf: 'leaf'
      },
      dicData: [],
      rootNode: 0,
      rootResolve: {},
      selectProjectObj: {}, // 当前项目
      projMembers: [], // 右侧检查项
      treeConfig: {}, // 左边国标库目录
      formKey: ''
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
        if (name) {
          if (this.dicData[name]) {
            return this.dicData[name]
          }
        }
        return []
      }
    }
  },
  created () {
    this.selectProjectObj = JSON.parse(this.cookieUtil.get('projectNode'))
    var parentData = this.openConfig.parent.config.parent.getData()
    this.formKey = parentData.formKey
    var mainData = parentData.mainFormDataMap
    this.startDate = mainData.START_DATE_
    this.finishDate = mainData.END_DATE_
    this.loadDicData()
    this.getTaskMembers()
  },
  mounted () {
    // this.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
    this.init()
  },
  methods: {
    getGridData () {
      let queryForm = this.$refs['jr-tree']
      if (queryForm) {
        return queryForm.gridData
      }
      return null
    },
    closeForm () {
      this.openConfig.parent.closeForm()
    },
    submitForm () {
      this.openConfig.parent.confirmSelect()
      this.openConfig.parent.closeForm()
    },
    getSelectedData () {
      let areaList = this.$refs.areaTree.getCheckedNodes()
      let projList = this.$refs.projTree.getCheckedNodes()
      let companyList = this.$refs.companyTree.getCheckedNodes()
      var checkItemList = companyList.concat(projList)
      var inspectorArr = []
      this.principal.forEach(item => {
        var obj = this.projMembers.find(obj => obj.id === item)
        inspectorArr.push(obj.userName)
      })
      var result = []
      areaList.forEach(item => {
        checkItemList.forEach(checkItem => {
          var obj = {
            AREA_NAME_: (item.parentName ? item.parentName.slice(1) + '>' : '') + item.label,
            AREA_CODE_: item.code,
            AREA_UID_: item.id,
            areaSn: item.sn,
            YE_TAI_: item.yeTai,
            INSPECT_ITEM_: (checkItem.parentStr ? checkItem.parentStr.slice(1) + '>' : '') + checkItem.itemName,
            INSPECT_ITEM_UID_: checkItem.id,
            CHECK_REQUIRE_: checkItem.checkRequire,
            INSPECTOR_UID_: this.principal.join(','),
            INSPECTOR_UID_LABEL_: this.principal.join(','),
            INSPECTOR_NAME_: inspectorArr.join(','),
            START_DATE_: this.startDate,
            END_DATE_: this.finishDate
          }
          result.push(obj)
        })
      })
      return result
    },
    getTaskMembers () {
      var roleType = this.formKey == 't_measure_plan' ? 'proChecker,measureCheck' : 'proChecker,qualityCheck'
      var params = {
        projUid: this.selectProjectObj.id,
        roleType: roleType
      }
      this.util.restGet('/api_v1/construction/inspect/authorityMember', params, (res) => {
        if (res.status == 200 && res.data) {
          this.principal = res.data.map(item => item.id)
        }
      })
    },
    initData () {
      this.getPartList()
      this.rootNode.childNodes = [] // 这里把子节点清空，是因为再次调用 loadNode 的时候会往 childNodes 里 push 节点，所以会有节点重复的情况。
      this.loadCompanyItem(this.rootNode, this.rootResolve)
    },
    getPartList () { // 获取区域数据
      this.loading = true
      var params = {
        purpose: this.yetaiValue,
        projUid: this.selectProjectObj.id
      }
      this.util.restGet('/api_v1/construction/inspect/partTree', params, (res) => {
        this.loading = false
        if (res.status == 200 && res.data != undefined) {
          // this.models.push(res.data);
          this.areaList = res.data
        } else {
          this.areaList = []
        }
      })
    },
    loadCompanyItem (node, resolve) { // 加载企业库
      if (node.level == 0) {
        this.rootResolve = resolve
        this.rootNode = node
      }
      var params = {
        type: this.formKey == 't_measure_plan' ? 'measure' : 'quality',
        id: node.data == undefined ? 'root' : node.data.id,
        projType: this.selectProjectObj.classify,
        projPurpose: this.yetaiValue
      }
      this.loadIteming = true
      this.util.restGet('/api_v1/construction/inspect/getCheckItemEnterprise', params, (res) => {
        this.loadIteming = false
        if (res.status == 200 && res.data) {
          res.data.forEach(item => {
            item.parentStr = node.data == undefined ? '' : node.data.parentStr + '>' + node.data.itemName
          })
          resolve(res.data)
        } else {
          resolve([])
        }
      })
    },
    loadProjCheckItem (node, resolve) { // 加载项目库
      var formType = this.formKey == 't_measure_plan' ? 'measure' : 'inspect'
      console.log('node.data=====', node.data)
      var params = {
        ifCatalog: true,
        projUid: this.selectProjectObj.id,
        formType: formType,
        parentUid: node.data == undefined ? 'root' : node.data.id,
        type: this.formKey == 't_measure_plan' ? 'measure' : 'quality',
        itemLb: this.formKey == 't_measure_plan' ? '实测项' : '检查项',
        pageSize: 100,
        pageIndex: 1
      }
      this.loadIteming = true
      // this.util.restGet('/api_v1/construction/inspect/checkItemCatalog', params, (res)=> {
      this.util.restGet('/api_v1/construction/inspect/getCheckItemData', params, (res) => {
        this.loadIteming = false
        if (res.status == 200 && res.data) {
          res.data.forEach(item => {
            item.parentStr = node.data == undefined ? '' : node.data.parentStr + '>' + node.data.itemName
          })
          resolve(res.data)
        } else {
          resolve([])
        }
        // this.$forceUpdate();
      })
    },
    loadProjCheckItem_bak () {
      var formType = this.formKey == 't_measure_plan' ? 'measure' : 'inspect'
      this.util.restGet('/api_v1/construction/inspect/checkItemCatalog', {projUid: this.selectProjectObj.id, formType: formType}, (res) => {
        if (res.status == 200 && res.data) {
          if (formType == 'measure') {
            this.projItemList = res.data
          } else {
            res.data[0].id = 'root_quality'
            res.data.splice(1, 1)
            this.projItemList = res.data
          }
        } else {
          this.projItemList = []
        }
        this.$forceUpdate()
      })
    },
    loadProjMember () {
      var param = {
        projUid: this.selectProjectObj.id
      }
      this.util.restGet('/api_v1/business/project/getMemberByProjUid', param, (res) => {
        if (res.status == 200) {
          if (res.data) {
            this.projMembers = res.data.member
          } else {
            this.projMembers = []
          }
        } else {
          this.util.error(res.errorMsg)
        }
      })
    },
    getExtraParams () {
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
            return false
          }
        })
      })
    },
    init () {
      // 获取业态数据字典
      // getDicData("T_PROJ_PURPOSE").then(data => {
      //   this.dicData['PROJ_PURPOSE'] = data
      // });

      // 获取区域数据
      // this.getPartList();
      this.loadProjMember()
      // this.initData();
      // 获取项目库
      // this.loadProjCheckItem();
      // this.loadDicData();
    },
    loadDicData () {
      var param = {
        projUid: this.selectProjectObj.id
      }
      this.util.restGet('/api_v1/construction/inspect/areaPurpose', param, (res) => {
        if (res.status == 200 && res.data) {
          this.dicData = res.data
          this.yetaiValue = res.data[0].name
          this.getPartList()
        } else {
          this.dicData = []
        }
        // this.initData();
      }, null, false)
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
