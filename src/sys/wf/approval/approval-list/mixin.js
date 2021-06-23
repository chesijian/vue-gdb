import CommonGridTable from '../../../../common/table/grid-table/grid-table'
import QueryForm from '../../../../common/form/query-form/query-form'
export const mixin = {
  data: function () {
    return {
      title: '待办',
      searchFormRows: [
        [
          {
            columnName: 'PROJ_ID_',
            javaType: 'String',
            width: 80,
            row: 1,
            col :1/3,
            require:true,
            title: '项目',
            attr: 'project-info',
            widgetType:'select-form'
          },
          {
            columnName: 'modelId',
            javaType: 'String',
            width: 80,
            row: 1,
            col :1/3,
            require:true,
            title: '流程',
            attr: 'sys-wf-model-list',
            widgetType:'select-form'
          },
          {
            columnName: 'startUserUid',
            javaType: 'String',
            width: 80,
            row: 1,
            col :1/3,
            hidden:true,
            title: '申请人',
            widgetType:'select-user'
          }
        ]
      ],
      config: {
        title: '我的待办',
        showPageBar: true,
        showOperateTool:false,
        proxy: {
          type: 'get',
          url: '/api_v1/wf/tasks/approval',
          params:{

          },
          beforeLoad: params => {
            params.assignee = this.sessionUtil.getUserUid()
          }
        },
        columns: [
          {
            columnName: 'sn',
            javaType: 'String',
            width: 80,
            require:true,
            title: '单号',
            openType: 1,
            openUrl:'form-edit',
            openParams:'{"formKey": "{formKey}", "title": "{subject}","businessKey":"{businessKey}","disabled":true}',
            widgetType:'input'
          },{
            columnName: 'subject',
            javaType: 'String',
            width: 150,
            sortable: true,
            title: '标题',
            openUrl:'1',
            openParams:'1',
            onCellClick:(column, row, index)=>{
              this.openPage(column, row, index)
            },
            widgetType:'input'
          }, {
            columnName: 'abstracts',
            javaType: 'String',
            title: '摘要',
            width: 100,
            widgetType:'input'
          }, {
            columnName: 'actName',
            javaType: 'String',
            title: '当前环节',
            width: 100,
            widgetType:'input'
          }, {
            columnName: 'procDefName',
            javaType: 'String',
            title: '流程名称',
            width: 100,
            widgetType:'input'
          }, {
            columnName: 'startUserName',
            javaType: 'String',
            title: '申请人',
            width: 80,
            widgetType:'input'
          }, {
            columnName: 'startTime',
            javaType: 'String',
            title: '申请时间',
            width: 100,
            widgetType:'select-date-time'
          }
        ]
      }
    }
  },
  props: {

  },
  computed:{

  },
  created () {
    this.$bus.$on('handlerApprovalReload', (params) => { //获取传递的参数并进行操作
      console.log('-------handlerApprovalReload------')
      this.loadData()
    })

  },
  mounted () {
    this.init()
  },
  methods: {
    handlerTopButtonClick (button) { // queryForm页面点击topButton，切实弹框触发
      console.log(button)
    },
    init() {

    },
    loadData() {
      this.$refs['jr-table'].loadData()
    },
    openPage(column, row, index){
      console.log('----openPage------', row)
      if (this.validUtil.isNotEmpty(row.formKey)) {
        var status = "";
        if (row.assignee == null || row.assignee == "") {
          status = "claim";
        } else {
          status = "toDo";
        }
        var query = { id: row.businessKey,formKey: row.formKey,readOnly:true, _procInstId: row.procInstId, _procDefId: row.procDefId, _taskId: row.id , _taskType: row.category, _currentActId: row.actId, _taskStatus: status, isReadOnly: true }
        if (this.validUtil.isNotEmpty(row.formUrl) && this.validUtil.isNotEmpty(row.procInstId) && this.validUtil.isNotEmpty(row.id )) {

          // console.log(item)
          this.$router.push({ path: row.formUrl, query:  query});

        }else {
          this.$router.push({
            name: "form-edit",
            query: query,
            params: query
          }); //编辑表单数据

        }
      }
    },
    queryData (params) { // 查询表单查询调用
      if(params !== undefined && params.formData){
        params = Object.assign(params, params.formData)
        params.search = params.keyword
        params.projectId = params['PROJ_ID_']
        delete params.formData
        delete params.PROJ_ID_
        delete params.PROJ_ID_LABEL_
      }else{
        params = {}
      }
      // console.log('--------------',params)
      this.$refs['jr-table'].queryData(params)
    }
  },
  components: {
    CommonGridTable,QueryForm
  }
}
