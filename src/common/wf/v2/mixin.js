import selectMember from '@/common/select-user/select-user.vue'
import ProcessMonitor from '@/common/wf/v2/process-monitor.vue'

import {wfUtil} from './process-form'

export const mixin = {
  name: 'ProcessForm',
  props: {
    model: {
      type: Object,
      default: function () {
        return {}
      }
    },
    readOnly: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data () {
    return {
      defaultConfig: {
        ifHasProcess: true // 是否该表单拥有流程
      },
      pngSrc: null,
      pngTitle: '流程图',
      pngVisible: false,
      procTaskVisible: false, // 显示流转记录
      showProcUserDelete: false, // 显示处理人的删除按钮
      showCopyUserDelete: false, // 显示抄送人的删除按钮
      // showSelectProcUser: false,//显示选择处理人
      // showSelectCopyUser: false,//显示选择抄送人
      showProcessMonitor: false, // 显示流程监控
      dialogSelProcVisible: false, // 是否显示流程选择框
      processMonitorCount: 0,
      processMonitorModel: {
        // 流程监控
      },
      procUserModel: {
        //
        isShow: false,
        selectList: [],
        callBack: this.selectProcUserCallback,
        radioSelectFlags: false
      },
      copyUserModel: {
        // 抄送模型
        isShow: false,
        selectList: [],
        callBack: this.selectCopyUserCallback,
        radioSelectFlags: false
      },
      id: '', // 业务主键
      comment: '', // 审批意见
      processList: [], // 流程列表
      modelList: [], // 流程模型
      ifShowProc: false, // 是否显示处理人
      ifShowCopy: false, // 是否显示抄送
      ifSelUser: false, // 是否允许选人
      isNewFlag: true, // 是否新增业务数据
      isReadOnly: true, // 是否只读
      ifSelCopy: false, // 是否允许选择抄送
      procDefId: '', // 流程定义主键
      procDefName: '', // 流程定义
      procInstId: '', // 流程实例主键
      taskId: '', // 任务主键
      isWorkflow: false, // 是否可以处理流程
      isApply: false, // 是否是我申请的
      isCopy: false, // 是否处理抄送
      ifBackFirst: false, // 是否回退首环节
      isApproval: false, // 是否处理待办
      activitiData: [], // 处理待办时后置节点信息
      currentActId: null, // 处理待办时当前环节
      taskStatus: null, // 任务状态claim/toDo
      taskType: null, // 任务类型，1表示抄送，0表示待办
      selectedAct: null // 选中的后置环节
      // readOnly: true // 设置是否只读
    }
  },
  components: {
    ProcessMonitor,
    selectMember
  },
  created () {
    this.util.init(this)
    wfUtil.init(this)
    // console.info("processForm=======created========");
    // this.config =  this.defaultConfig;
  },
  activated () {
    // console.info("processForm=======activated========");
  },
  mounted () {
    this.procTaskVisible = false
    this.procDefId = null
    this.procInstId = null
    this.taskId = null
    this.taskStatus = null
    this.currentActId = null
    this.taskType = null
    this.isWorkflow = false
    this.isReadOnly = true
    this.ifBackFirst = false
    this.isEndEvent = false
    this.isApply = false
    this.isApproval = false
    this.isEndEvent = true
    this.isCopy = false
    this.ifShowProc = false
    this.processMonitorCount = 0
    this.showProcessMonitor = false
    this.processMonitorModel.parent = this
    //console.info("processForm=======mounted========");
    if (this.model.ifHasProcess != undefined && !this.model.ifHasProcess) {
      this.defaultConfig.ifHasProcess = false
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam('_procInstId'))) {
      this.procInstId = this.util.getUrlParam('_procInstId')
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam('_procDefId'))) {
      this.procDefId = this.util.getUrlParam('_procDefId')
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam('_taskId'))) {
      this.taskId = this.util.getUrlParam('_taskId')
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam('_taskType'))) {
      this.taskType = this.util.getUrlParam('_taskType')
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam('_currentActId'))) {
      this.currentActId = this.util.getUrlParam('_currentActId')
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam('_taskStatus'))) {
      this.taskStatus = this.util.getUrlParam('_taskStatus')
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam('id'))) {
      this.id = this.util.getUrlParam('id')
    }
    // console.info('this.procInstId-------'+this.procInstId)
    this.initProcess()
  },
  methods: {
    initProcess () {
      var _this = this
      // console.info('-----initProcess-----',this.model.parent)
      if (this.model.parent) {
        this.model.parent.processForm = this
        // 判断是否表单已经设置只读
        if(this.readOnly){
          _this.isReadOnly = true
        }
        // console.info('--------------'+_this.isReadOnly)
      }
      // console.info("processForm=======initProcess========" + this.defaultConfig.ifHasProcess);
      if (this.defaultConfig.ifHasProcess) {
        // console.info("-------" + this.taskId);
        // 说明是待办、待阅、已办、已阅
        if (this.validUtil.isNotEmpty(this.taskId)) {
          this.updateReadOnly(true)
          //待办
          if (
            _this.validUtil.isNotEmpty(this.taskType) &&
            this.taskType != '1'
          ) {
            _this.loadExecution()
          } else if (
            _this.validUtil.isNotEmpty(this.taskType) &&
            this.taskType == '1'
          ) {
            // 抄送
            _this.loadExecution()
            _this.isReadOnly = true
          }
        } else if (this.validUtil.isNotEmpty(this.procInstId)) {
          // 说明是我申请的
          // _this.loadExecution();
          // this.util.post("/workflow/openWorkflow", {procDefId:this.procDefId,procInstId:this.procInstId}, function (res) {
          //     if (res != undefined && res.status == 200) {
          //     }
          // });
          // console.info('---------我申请的--------')
          this.updateReadOnly(true)
          _this.loadExecution()
        } else {
          // console.info('=================')
          // 说明是第一次提交
          this.util.restGet('/api_v1/wf/process', {formKey: this.model.formKey, sqlTableName: this.model.parent.tableName, businessKey: this.model.businessKey, currentUserUid: this.sessionUtil.getUserUid()}, function (res) {
            // console.info(res);
            // 根据配置的启动规则计算流程
            wfUtil.initModel(res)
            // console.info('isWorkflow=='+_this.isWorkflow)
          }
          )
        }
        // console.info("======");
      } else {
        // 说明不是流程
        this.isWorkflow = false
      }
    },
    loadExecution () {
      // 加载流程处理单
      var _this = this
      this.util.restGet(
        '/api_v1/wf/execution',
        {
          id: this.id,
          key: this.key,
          formKey: this.model.formKey,
          procInstId: this.procInstId,
          taskId: this.taskId,
          taskType: this.taskType,
          procDefId: this.procDefId,
          currentUserUid: this.sessionUtil.getUserUid()
        },
        function (res) {
          if (res.status == 200) {
            //可以处理
            if (res.data.enable == undefined || res.data.enable == 1) {
              // 如果是待阅
              if (
                _this.validUtil.isNotEmpty(_this.taskId) &&
                _this.taskType == '1'
              ) {
                _this.isWorkflow = true
                _this.isCopy = true
                _this.initProcessMonitor()
                return;
              } else if (
                (_this.validUtil.isNotEmpty(_this.taskId) &&
                  _this.taskType == '0') ||
                (res.data['activities'] != undefined &&
                  res.data['activities'].length > 0)
              ) {
                // 待办
                _this.ifSelCopy = res.data['ifSelCopy']
                _this.isWorkflow = true
                _this.ifShowCopy = true
                _this.isReadOnly = false
                _this.isApply = false
                _this.isEndEvent = false
                //如果是第一环节说明是驳回
                if (res.data.ifFirstNode && _this.validUtil.isNotEmpty(_this.procInstId)) {
                  _this.ifBackFirst = true
                } else {
                  if (_this.validUtil.isNotEmpty(_this.procInstId)) {
                    _this.isApproval = true
                  } else {
                    // 第一次提交
                  }
                }

                for (var i = 0; i < res.data.activities.length; i++) {
                  var item = res.data.activities[i]
                  //默认第一个选中
                  if (i == 0) {
                    item.selected = true
                    _this.initProcUsers(item)
                  } else {
                    item.selected = false
                  }
                }
                _this.activitiData = res.data['activities']
                _this.initCopyUsers(res.data)
              } else {
                // 我申请的
                _this.isWorkflow = true
                _this.isApply = true
              }
            } else {
              // 说明当前打开表单的不是处理人本人，或者该任务不存在
            }
            _this.initProcessMonitor()
          } else {
            _this.util.error(res['errorMsg'])
          }
        }
      )
    },
    updateReadOnly (readOnly) { // 修改表单只读状态
      if (this.model.parent && this.model.parent.updateReadOnly) {
        this.model.parent.updateReadOnly(readOnly)
      }
    },
    initProcUsers (item) {
      // 初始化环节处理人
      if (item.type != 'endType' && item.taskType != 'endEvent') {
        this.ifShowProc = true
      } else {
        this.ifShowProc = false
      }
      var procUsers = item.procUsers
      this.selectedAct = item
      var selectList = []
      if (procUsers != undefined && procUsers.length > 0) {
        for (var i = 0; i < procUsers.length; i++) {
          var procUser = procUsers[i]
          selectList.push({
            id: procUser.procUserUid,
            userName: procUser.procUserName,
            userId: procUser.procUserId,
            picture: procUser.picture
          })
        }
      }
      this.procUserModel.selectList = selectList

      if (item.ifSelUser) {
        this.ifSelUser = true
      } else {
        this.ifSelUser = false
      }
      // console.info('----------this.selectedAct----------')
      // console.info(this.selectedAct)
      // this.procUserModel.isShow = true;
    },
    initCopyUsers (item) {
      // 初始化环节抄送人
      var copyUsers = item.copyUsers
      // this.selectedAct = item;
      var selectList = []
      if (copyUsers != undefined && copyUsers.length > 0) {
        for (var i = 0; i < copyUsers.length; i++) {
          var procUser = copyUsers[i]
          selectList.push({
            id: procUser.procUserUid,
            userName: procUser.procUserName,
            userId: procUser.procUserId,
            picture: procUser.picture
          })
        }
      }
      this.copyUserModel.selectList = selectList

      if (item.ifSelCopy) {
        this.ifSelCopy = true
      } else {
        this.ifSelCopy = false
      }
    },
    initProcessMonitor () {
      //加载流程监控
      this.showProcessMonitor = true;
      return;
      var _this = this;
      //console.info(_this.$refs.processMonitor);
      if (this.processMonitorCount > 100) {

      }
      if (_this.$refs.processMonitor == undefined) {
        this.processMonitorCount++;
        setTimeout(function () {
          _this.initProcessMonitor();
        }, 500);

      }
      //console.info("=======");
      this.processMonitorCount = 0;
      _this.$refs.processMonitor.initProcess(_this.procInstId, _this.procDefId);
    },
    addProcUser () {
      // 添加处理人
      // console.info(this.$refs.selectProcUser);
      if (this.selectedAct) {
        var procUsers = this.selectedAct.procUsers
        var selectList = []
        if (procUsers != undefined && procUsers.length > 0) {
          for (var i = 0; i < procUsers.length; i++) {
            var procUser = procUsers[i]
            selectList.push({
              id: procUser.procUserUid,
              userName: procUser.procUserName,
              userId: procUser.procUserId,
              picture: procUser.picture
            })
          }
        }
        this.procUserModel.selectList = selectList
      }

      // console.info(this.procUserModel.selectList)
      this.procUserModel.isShow = true
      //this.procUserModel.selectList =
      // this.$refs.selectProcUser.sync(this.procUserModel.selectList);
    },
    removeProcUser (user) {
      this.procUserModel.selectList = this.procUserModel.selectList.filter(
        item => {
          return item != user
        }
      )
      this.selectedAct.procUsers = this.selectedAct.procUsers.filter(item => {
        return item.procUserUid != user.id
      })
    },
    delProcUser () {
      this.showProcUserDelete = !this.showProcUserDelete
    },
    addCopyUser () {
      // 添加处理人
      console.info(this.$refs.selectCopyUser)
      this.copyUserModel.isShow = true
      // this.$refs.selectCopyUser.sync(this.copyUserModel.selectList);
    },
    removeCopyUser (user) {
      this.copyUserModel.selectList = this.copyUserModel.selectList.filter(
        item => {
          return item != user
        }
      )
    },
    delCopyUser () {
      this.showCopyUserDelete = !this.showCopyUserDelete
    },
    selected (item, list) {
      // console.info("====selected===="+item.id);
      // console.info(item);
      // 由于单选
      for (var i = 0; i < list.length; i++) {
        // 默认第一个选中
        var temp = list[i]
        // console.info(temp.id +'=='+ item.id)
        if (temp.id == item.id) {
          temp.selected = true
        } else {
          temp.selected = false
        }
      }
      // this.processList = list
      // console.info(this.processList)
      // console.info( this.processList);
    },
    selectProcUserCallback () {
      // console.info("====selectProcUserCallback====");
      // console.info(this.procUserModel.selectList);
      var selectList = []
      for (var i = 0; i < this.procUserModel.selectList.length; i++) {
        var procUser = this.procUserModel.selectList[i]
        selectList.push({
          procUserUid: procUser.id,
          procUserName: procUser.userName,
          procUserId: procUser.userId,
          picture: procUser.picture
        })
      }
      this.selectedAct.procUsers = selectList
      this.procUserModel.isShow = false
      // console.info('-------selectProcUserCallback--------')
      // console.info(this.selectedAct)
    },
    selectCopyUserCallback () {
      // console.info("====selectCopyUserCallback====");
      this.copyUserModel.isShow = false
    },
    submit (type) {
      let _this = this
      if (type == 1 || type == 6 || type == 8) {
        // 校验表单
        // 判断父组件是否复写表单验证方法
        if (this.model.parent.checkValid != undefined) {
          this.model.parent.checkValid().then(() => {
            _this.confirmSubmit(type)
          })
        }
      } else if (type == 9 || type == 10) {
        // 删除配置parent 避免JSON.stringify报错
        this.$parent.submit (9)
      }else {
        this.confirmSubmit(type)
      }
    },
    confirmSubmit (type) {
      var _this = this
      if (type == 0) {
        if (this.model.parent) {
          this.model.parent.closeProcessForm()
          return;
        }
        // 取消
        if (this.model.parent.cancelCallback != undefined) {
          this.model.parent.cancelCallback()
        } else {
          history.back()
        }
        return
      } else if (type == 7) {
        // 当多个流程时弹出流程选择框中的确定
        for (var i = 0; i < this.processList.length; i++) {
          // 默认第一个选中
          var temp = this.processList[i]
          if (temp.selected) {
            this.isWorkflow = true
            this.procDefId = temp.procDefId
            this.procDefName = temp.name
            this.key = temp.key
            this.closeSelDialog()
            //加载流程处理单
            this.loadExecution()
            return;
          }
        }
      } else if (type == 8) {
        // 提交，判断是否流程定义还没有，并且该表单有多个流程
        if ( !this.validUtil.isNotEmpty(this.procDefId) && this.modelList.length > 1) {
          wfUtil.compute()
          return
        }
      }

      var maskStr = '正在保存...'
      var params = {}
      if (this.isWorkflow) {
        params['comment'] = this.comment
        params['procDefName'] = _this.validUtil.isNotEmpty(this.procDefName)
          ? this.procDefName
          : this.model.parent.modelName
        params['procDefId'] = _this.procDefId
        params['taskId'] = _this.taskId
        params['taskType'] = _this.taskType
        params['procInstId'] = _this.procInstId
        params['ifSaveWorkflow'] = true
      }
      params['id'] = this.id
      params['businessKey'] = params['id']
      params['currentUserUid'] = this.sessionUtil.getUserUid(this)
      params['currentUserName'] = this.sessionUtil.getUserName(this)
      params['currentUserId'] = this.sessionUtil.getUserId(this)
      params['formKey'] = this.model.parent.formKey
      params['sqlTableName'] = this.model.parent.tableName
      params['entityId'] = this.model.parent.entityId
      //只是点击保存
      if (type == 1) {
        // //判断父组件是否复写表单验证方法
        // if (this.model.parent.checkValid != undefined) {
        //   if (!this.model.parent.checkValid()) {
        //     return;
        //   }
        // }
        // 判断表单是否复写获取数据的方法
        if (this.model.parent.getData != undefined) {
          var formData = this.model.parent.getData()
          //合并对象
          params = Object.assign(params, formData)
          params['ifSaveWorkflow'] = false
        }
      }
      if (type == 6 || type == 8) {
        // type == 6表示按钮是同意，8表示提交
        maskStr = '正在提交...'
        //如果不是抄送则获取表单数据和下一环节数据
        if (this.taskType != '1') {
          if (this.model.parent != undefined) {
            // if (this.model.parent.checkValid != undefined) {
            //   if (!this.model.parent.checkValid()) {
            //     return;
            //   }
            // }
            // console.info("-------"+this.model.parent.getData);
            if (this.model.parent.getData != undefined) {
              var formData = this.model.parent.getData()
              //合并对象
              params = Object.assign(params, formData)
              params['ifSaveWorkflow'] = true
            }
          }
          // console.info(params)
          // _this.util.successToast("----数据获取完毕-----");
          if (this.model.parent.agentId != undefined) {
            params['agentId'] = this.model.parent.agentId
          }
          if (!_this.isEndEvent) {
            for (var i = 0; i < _this.activitiData.length; i++) {
              var act = _this.activitiData[i]
              if (act.selected) {
                // console.info(act);
                if (act.type != 'endType' && act.taskType != 'endEvent') {
                  if (act.procUsers.length == 0) {
                    this.util.failueToast('请选择[' + act.name + ']处理人！')
                    return false
                  }
                }
              }
            }
          }

          var newActivitiData = []
          for (var i = 0; i < _this.activitiData.length; i++) {
            var act = _this.activitiData[i]
            if (act.selected) {
              newActivitiData.push(act)
            }
          }
          // console.info(this.activitiData);
          // console.info(this.copyUserModel.users);
          // params['activityData'] = JSON.stringify(newActivitiData);
          params['activities'] = newActivitiData
          //console.info(this.copyUserModel.users);
          var copyUsersArr = new Array()
          for (var i = 0; i < this.copyUserModel.selectList.length; i++) {
            var procUser = this.copyUserModel.selectList[i]
            var user = new Object()
            user.id = procUser['id']
            user.userName = procUser['userName']
            user.mobile = procUser['mobile']
            user.wxId = procUser['wxId']
            copyUsersArr.push(user)
          }
          // console.info(this.copyUserModel.users);
          params['copyUsersStr'] = JSON.stringify(copyUsersArr)
          params['operateType'] = 0
        } else {
          // 如果是抄送
          params['operateType'] = 1
        }
        params['sqlTableName'] = this.validUtil.isNotEmpty(this.model.parent.tableName) ? this.model.parent.tableName : this.model.parent.sqlTableName
      } else if (type == 5) {
        // 不同意，回退
        params['mainFormData'] = null
        params['subFormData'] = null
        params['sqlTableName'] = this.validUtil.isNotEmpty(this.model.parent.tableName) ? this.model.parent.tableName : this.model.parent.sqlTableName
        params['operateType'] = 6
      } else if (type == 3) {
        // 撤销
        if (this.model.parent.getData != undefined) {
          var data = this.model.parent.getData()
          //console.info(data);
          params['subject'] = data['subject']
        }
        params['procDefName'] = _this.procDefName
        params['formKey'] = this.model.parent.tableId
        params['sqlTableName'] = this.model.parent.tableName
        params['procDefId'] = _this.procDefId
        params['id'] = this.id == undefined ? '' : this.id
        params['businessKey'] = params['id']
        params['currentUserUid'] = this.sessionUtil.getUserUid(this)
        params['currentUserName'] = this.sessionUtil.getUserName(this)
        params['currentUserId'] = this.sessionUtil.getUserId(this)
        params['ifSaveWorkflow'] = true
        params['operateType'] = 14
        params['procInstId'] = _this.procInstId
        maskStr = '正在撤销...'
      } else if (type == 4) {
        // 催办
        if (this.isWorkflow) {
          params['sqlTableName'] = this.model.parent.tableName
          params['procDefId'] = this.procDefId
          params['formKey'] = this.model.parent.tableId
          params['id'] = this.id == undefined ? '' : this.id
          params['businessKey'] = params['id']
          params['currentUserUid'] = this.sessionUtil.getUserUid(this)
          params['currentUserName'] = this.sessionUtil.getUserName(this)
          params['currentUserId'] = this.sessionUtil.getUserId(this)
          params['ifSaveWorkflow'] = true
          params['operateType'] = 13
          params['procInstId'] = this.procInstId
          maskStr = '正在催办...'
        }
      }
      // 保存前回调
      if (this.model.parent.beforeSaveData != undefined) {
        this.model.parent.beforeSaveData(type, params)
      }
      if (type == 3) {
        _this.util.confirm('你确定要撤销？', '提示', function () {
          _this.util.mask(maskStr)
          _this.saveData(type, params)
          if (this.model.parent.saveData != undefined) {
            this.model.parent.saveData(type, params)
          } else {
            _this.saveData(type, params)
          }
        })
      } else {
        _this.util.mask(maskStr)
        if (this.model.parent.saveData != undefined) {
          this.model.parent.saveData(type, params)
        } else {
          _this.saveData(type, params)
        }
      }
    },
    deleteProcInst (procInstId) {
      var _this = this
      _this.util.restDelete('/api_v1/wf/proc_insts', {procInstId: procInstId}, function (res) {
        if (res != undefined && res != null) {
          _this.model.parent.isReadOnly = false
          if (_this.model.parent.updateStatus != undefined) {
            // 更新父节点状态
            _this.model.parent.updateStatus()
          }
          _this.isReadOnly = false
          _this.procInstId = null
          _this.procDefId = null
          _this.taskId = null
          _this.isApproval = false
          _this.isApply = false
          _this.isEndEvent = false
          //重新加载流程
          _this.updateReadOnly(false)
          _this.initProcessMonitor()
          _this.initProcess()
        }
        _this.util.unmask()
      })
    },
    saveData (type, params) {
      var _this = this
      //说明是撤销
      if (type == 3) {
        this.deleteProcInst(_this.procInstId)
        return;
      }
      _this.util.restPost('/api_v1/form/business', params, function (res) {
        if (res != undefined && res != null) {
          if (res.status == 200) {
            _this.util.successToast('成功')
            if (type == 4) {
            } else {
              _this.isReadOnly = true
              _this.ifBackFirst = false
              _this.isWorkflow = false
              _this.isApply = false
              _this.isApproval = false
              _this.isEndEvent = true
              _this.$store.state.operate = 'save'
              if (_this.model.parent.saveDataCallback != undefined) {
                _this.model.parent.saveDataCallback(type, params)
              } else if (_this.model.parent.submit != undefined) {
                _this.model.parent.submit(type)
              } else {
                // 保存完后回调
                // _this.$router.go(-1);
              }
            }
          } else {
            _this.util.failueToast('保存失败' + res.errorMsg)
          }
        }
        _this.util.unmask()
      })
    },
    closeSelDialog () {
      this.dialogSelProcVisible = false
    },
openPng () {
      // 打开流程图
      if (this.validUtil.isNotEmpty(this.procDefId)) {
        this.pngVisible = true
        if (this.procInstId == null) {
          this.procInstId = ''
        }
        this.pngSrc = this.util.getBaseUrl() + '/api_v1/wf/png?procDefId=' + this.procDefId + '&procInstId=' + this.procInstId + '&access_token=' + this.sessionUtil.getAccessToken()
        // console.info(this.pngSrc);
      }
    }
  }
}
