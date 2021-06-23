<template>
    <div class="jrsoft-process" style="margin-top:10px;">

        

        <div style="width:100%;display:flex;">
            <div style="width:30%;display:block;float:left;">

            </div>
            <div style="width:70%;display:block;float:left;">
                
            </div>
        </div>

        <div v-if="isWorkflow">
            
                    <div v-if="activitiData.length>0" style="background-color: rgb(238, 238, 238); height: 35px;line-height: 35px;padding-top: 0px;padding-left: 10px;">
                        <div style="float:left;margin-right:20px;">后续环节:</div>
                        <div v-for="(item,key) in activitiData" :key="key" @click="selected(item,activitiData);initProcUsers(item);" style="float:left;margin-right:20px;">
                            <img class="select-img" src="../assets/administrationIcon/active.png" width="20px" v-show="item.selected" alt="">
                            <img class="select-img" src="../assets/administrationIcon/defult.png" width="20px" v-show="!item.selected" alt=""><span style="margin-left:5px;margin-top:3px;">{{item.name}}</span>

                        </div>
                    </div>
                    <el-row v-show="ifShowProc" style="margin-bottom: 0px;">
                        <div>
                           
                            <div class="load">
                                <ul id="imgsLoad" style="margin-bottom:0px;">
                                    <li style="margin-top: 2px;">
                                        <ul style="overflow:hidden;">
                                            <li style="float:left;margin:5px 5px 5px 5px;margin-right: 10px;position:relative;text-align:left;width:43px;display: inline-block;" v-for="procUser in procUserModel.selectList" :key="procUser.id">
                                                <div>
                                                    <div>
                                                        <img style="width:43px;height:43px;" :src="procUser.picture" alt=""></div>
                                                    <div style="text-align:center; font-size: 10px;">
                                                        <span>{{procUser.userName.length>3?procUser.userName.substring(procUser.userName.length-3,procUser.userName.length):procUser.userName}}</span>
                                                    </div>
                                                </div>
                                                <i @click="removeProcUser(procUser,$event)" v-if="showProcUserDelete" class="changeDelete" style="position:absolute;top:-3px;left:30px;background:#f00;width:20px;height:20px;border-radius:50%;color:#fff">&nbsp;X</i>
                                            </li>
                                            <li v-if="ifSelUser" style="float:left;margin:5px 0px 17px 3px;position:relative;font-size:14px;line-height:20px;text-align:left;width:43px;display: inline-block;">
                                                <div>
                                                    <svg class="icon" style="font-size:46px;color:#ccc;" @click="addProcUser()" aria-hidden="true">
                                                        <use xlink:href="#icon-tianjiarenyuan"></use>
                                                    </svg>
                                                    <!-- <img style="width:45px;height:45px;" @click="addProcUser()" src="../../assets/addPeople1.png"> -->
                                                </div>
                                            </li>
                                            <li v-if="ifSelUser" style="float:left;margin:5px 5px 17px 5px;position:relative;text-align:left;width:43px;display: inline-block;">
                                                <div>
                                                    <svg class="icon" style="font-size:46px;color:#ccc;" @click="delProcUser()" aria-hidden="true">
                                                        <use xlink:href="#icon-shanchulianxiren"></use>
                                                    </svg>
                                                    <!-- <img style="width:45px;height:45px;" @click="delProcUser()" src="../../assets/removePeople1.png"> -->
                                                </div>
                                            </li>
                                        </ul>
                                    </li>

                                </ul>
                            </div>
                            <selectMember :selectMemberModels='procUserModel' ref="selectProcUser"></selectMember>
                        </div>
                    </el-row>
                    <el-row v-show="ifShowCopy" style="margin-bottom: 0px;">
                        <div class="middle" style="background-color: rgb(238, 238, 238);line-height: 35px;">
                            <div class="pop" style="background-color: #eeefef;margin-left:10px;">
                                <span style="text-align:left;">抄送人</span>
                            </div>
                        </div>
                        <div class="load">
                            <ul id="imgsLoad" style="margin-bottom:0px;">
                                <li style="margin-top: 2px;">
                                    <ul>
                                        <li style="float:left;margin:5px 5px 5px 5px;position:relative;text-align:left;" v-for="user in copyUserModel.selectList" :key="user.id">
                                            <div>
                                                <div>
                                                    <img style="width:43px;height:43px;" :src="user.picture" alt=""></div>
                                                <div style="text-align:center; font-size: 10px;">
                                                    <span>{{user.userName.length>3?user.userName.substring(user.userName.length-3,user.userName.length):user.userName}}</span>
                                                </div>
                                            </div>
                                            <i @click="removeCopyUser(user,$event)" v-if="showCopyUserDelete" class="changeDelete" style="position:absolute;top:-6px;left:-5px;background:#f00;width:20px;height:20px;font-size:14px;line-height:20px;border-radius:50%;color:#fff">&nbsp;X</i>
                                        </li>
                                        <li v-if="ifSelCopy" style="float:left;margin:5px 0px 17px 3px;position:relative;text-align:left;">
                                            <svg class="icon" style="font-size:46px;color:#ccc" @click="addCopyUser()" aria-hidden="true">
                                                <use xlink:href="#icon-tianjiarenyuan"></use>
                                            </svg>
                                            <!-- <img style="width:45px;height:45px;" @click="addCopyUser()" src="../../assets/addPeople1.png"> -->
                                        </li>
                                        <li v-if="ifSelCopy" style="float:left;margin:5px 5px 17px 5px;position:relative;text-align:left;">
                                            <svg class="icon" style="font-size:46px;color:#ccc" @click="delCopyUser()" aria-hidden="true">
                                                <use xlink:href="#icon-shanchulianxiren"></use>
                                            </svg>
                                            <!-- <img style="width:45px;height:45px;" @click="delCopyUser()" src="../../assets/removePeople1.png"> -->
                                        </li>
                                    </ul>
                                </li>

                            </ul>
                        </div>
                        <selectMember :selectMemberModels='copyUserModel' ref="selectCopyUser"></selectMember>
                    </el-row>
                    <el-row v-if="activitiData.length>0 || isCopy" style="margin-bottom: 0px;">
                        <div class="middle" style="background-color: rgb(238, 238, 238);line-height: 35px;">
                            <div class="pop" style="background-color: #eeefef;margin-left:10px;">
                                <span style="text-align:left;">审批意见</span>
                            </div>
                        </div>
                        <div style="margin-top: 5px;margin-bottom:5px;">
                            <el-input type="textarea" v-model="comment"></el-input>
                        </div>
                    </el-row>
                </div>

        <div v-if="showProcessMonitor" style="">
            <!--流程监控-->
            <el-row>
                <div class="middle" style="background-color: rgb(238, 238, 238);line-height: 35px;">
                            <div class="pop" style="background-color: #eeefef;margin-left:10px;">
                                <span style="text-align:left;">流转记录</span>
                            </div>
                        </div>
                <processMonitor :model="processMonitorModel" ref="processMonitor" style="margin-top:10px;"></processMonitor>
            </el-row>
        </div>

        <div>

            <div class="select-box" v-if="dialogSelProcVisible">
                <div class="select">
                    <div class="title">
                        <h4 style="margin:30px 22px 0;"><i></i>请选择流程</h4>

                    </div>
                    <div class="select-center">
                        <ul>
                            <li v-for="(item,key) in processList" :key="key" @click="selected(item,processList)" style="border-bottom: dashed  1px rgb(235, 233, 233);">
                                <p>{{item.name}}</p>
                                <img class="select-img" src="../assets/administrationIcon/active.png" width="20px" v-show="item.selected" alt="">
                                <img class="select-img" src="../assets/administrationIcon/defult.png" width="20px" v-show="!item.selected" alt="">
                            </li>
                        </ul>
                    </div>
                    <div class="footer">
                        <button @click="submit(7)" class="button">提交</button>
                        <button @click="closeSelDialog()">取消</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="buttonGroup">
<div>
            <div style="text-align: left;" class="btnClass">
                <el-button v-if="!isReadOnly && !isApproval" @click="submit(1)"  type="primary">保存</el-button>
                <el-button v-if="isApproval" @click="submit(6)" type="success">同意</el-button>
                <el-button v-if="ifBackFirst || isCopy" @click="submit(6)" type="success">提交</el-button>
                <el-button v-if="isWorkflow && !isApply && !isApproval   && !isCopy && !ifBackFirst" @click="submit(8)" type="primary">{{isEndEvent?"办理完成":"提交"}}</el-button>
                <el-button v-if="isApproval" @click="submit(5)" type="danger">驳回</el-button>
                <el-button v-if="isApply " @click="submit(3)" type="warning">撤销</el-button>
                <el-button v-if="isApply" @click="submit(4)" type="primary">催办</el-button>
                <el-button @click="submit(0)">返回</el-button>

            </div>
            </div>
        </div>
    </div>
    
</template>
<script>
import selectMember from "@/common/selectMember.vue";
import processMonitor from "@/common/processMonitor.vue";
import { unwatchFile } from "fs";
export default {
  props: ["model"],
  data() {
    return {
      defaultConfig: {
        ifHasProcess: true //是否该表单拥有流程
      },
      showProcUserDelete: false, //显示处理人的删除按钮
      showCopyUserDelete: false, //显示抄送人的删除按钮
      // showSelectProcUser: false,//显示选择处理人
      // showSelectCopyUser: false,//显示选择抄送人
      showProcessMonitor: false, //显示流程监控
      dialogSelProcVisible: false, //是否显示流程选择框
      processMonitorCount: 0,
      processMonitorModel: {
        //流程监控
      },
      procUserModel: {
        //
        isShow: false,
        selectList: [],
        callBack: this.selectProcUserCallback,
        radioSelectFlags: false
      },
      copyUserModel: {
        //抄送模型
        isShow: false,
        selectList: [],
        callBack: this.selectCopyUserCallback,
        radioSelectFlags: false
      },
      id: "", //业务主键
      comment: "", //审批意见
      processList: [], //流程列表
      ifShowProc: false, //是否显示处理人
      ifShowCopy: false, //是否显示抄送
      ifSelUser: false, //是否允许选人
      isNewFlag: true, //是否新增业务数据
      isReadOnly: true, //是否只读
      ifSelCopy: false, //是否允许选择抄送
      procDefId: "", //流程定义主键
      procDefName: "", //流程定义
      procInstId: "", //流程实例主键
      taskId: "", //任务主键
      isWorkflow: false, //是否可以处理流程
      isApply: false, //是否是我申请的
      isCopy: false, //是否处理抄送
      ifBackFirst: false, //是否回退首环节
      isApproval: false, //是否处理待办
      activitiData: [], //处理待办时后置节点信息
      currentActId: null, //处理待办时当前环节
      taskStatus: null, //任务状态claim/toDo
      taskType: null, //任务类型，1表示抄送，0表示待办
      selectedAct: null, //选中的后置环节
      readOnly: true //设置是否只读
    };
  },
  components: {
    processMonitor,
    selectMember
  },
  created() {
    this.util.init(this);
    //console.info("processForm=======created========");
    //this.config =  this.defaultConfig;
  },
  activated() {
    //console.info("processForm=======activated========");
  },
  mounted() {
    this.procDefId = null;
    this.procInstId = null;
    this.taskId = null;
    this.taskStatus = null;
    this.currentActId = null;
    this.taskType = null;
    this.isWorkflow = false;
    this.isReadOnly = true;
    this.ifBackFirst = false;
    this.isEndEvent = false;
    this.isApply = false;
    this.isApproval = false;
    this.isEndEvent = true;
    this.isCopy = false;
    this.ifShowProc = false;
    this.processMonitorCount = 0;
    this.showProcessMonitor = false;
    //console.info("processForm=======mounted========");
    if (this.model.ifHasProcess != undefined && !this.model.ifHasProcess) {
      this.defaultConfig.ifHasProcess = false;
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam("_procInstId"))) {
      this.procInstId = this.util.getUrlParam("_procInstId");
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam("_procDefId"))) {
      this.procDefId = this.util.getUrlParam("_procDefId");
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam("_taskId"))) {
      this.taskId = this.util.getUrlParam("_taskId");
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam("_taskType"))) {
      this.taskType = this.util.getUrlParam("_taskType");
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam("_currentActId"))) {
      this.currentActId = this.util.getUrlParam("_currentActId");
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam("_taskStatus"))) {
      this.taskStatus = this.util.getUrlParam("_taskStatus");
    }
    if (this.validUtil.isNotEmpty(this.util.getUrlParam("id"))) {
      this.id = this.util.getUrlParam("id");
    }
    this.initProcess();
  },
  methods: {
    initProcess() {
      var _this = this;
      //console.info("processForm=======initProcess========" + this.defaultConfig.ifHasProcess);
      if (this.defaultConfig.ifHasProcess) {
        //console.info("-------" + this.taskId);
        //说明是待办、待阅、已办、已阅
        if (this.validUtil.isNotEmpty(this.taskId)) {
          //待办
          if (
            _this.validUtil.isNotEmpty(this.taskType) &&
            this.taskType != "1"
          ) {
            _this.loadExecution();
          } else if (
            _this.validUtil.isNotEmpty(this.taskType) &&
            this.taskType == "1"
          ) {
            //抄送
            _this.loadExecution();
            _this.isReadOnly = true;
          }
        } else if (this.validUtil.isNotEmpty(this.procInstId)) {
          //说明是我申请的
          //_this.loadExecution();
          // this.util.post("/workflow/openWorkflow", {procDefId:this.procDefId,procInstId:this.procInstId}, function (res) {
          // 	if (res != undefined && res.status == 200) {
          //     }
          // });
          _this.loadExecution();
        } else {
          //说明是第一次提交
          this.util.restGet(
            "/api_v1/wf/process",
            {
              formKey: this.model.formKey,
              businessKey: this.id,
              currentUserUid: this.sessionUtil.getUserUid()
            },
            function (res) {
              // console.info(res);
              //存在多个流程
              if (
                res.data.modelList != undefined &&
                res.data.modelList.length > 1
              ) {
                _this.isWorkflow = true;
                //_this.dialogProcessVisible = true;
                for (var i = 0; i < res.data.modelList.length; i++) {
                  //默认第一个选中
                  if (i == 0) {
                    res.data.modelList[i].selected = true;
                  } else {
                    res.data.modelList[i].selected = false;
                  }
                  res.data.modelList[i].id = res.data.modelList[i].key;
                }
                _this.processList = res.data.modelList;
                _this.isEndEvent = false;
                //console.info(_this.processList);
              } else if (
                res.data.modelList != undefined &&
                res.data.modelList.length == 1
              ) {
                //只有一个流程
                _this.isWorkflow = true;
                var temp = res.data.modelList[0];
                _this.procDefId = temp.procDefId;
                _this.procDefName = temp.name;
                _this.key = temp.key;
                _this.loadExecution();
              } else {
                //没有绑定流程，或者已经存在流程示例
                if (res.data.procInstId != undefined) {
                  _this.util.failueToast("已经存在流程实例！");
                  _this.procInstId = res.data.procInstId;
                  _this.procDefId = res.data.procDefId;
                  _this.initProcessMonitor();
                } else {
                  if (!_this.validUtil.isNotEmpty(_this.id)) {
                    _this.isReadOnly = false;
                  }
                }
              }
            }
          );
        }
        //console.info("======");
      } else {
        //说明不是流程
        this.isWorkflow = false;
      }
    },
    loadExecution() {
      //加载流程处理单
      var _this = this;
      this.util.restGet(
        "/api_v1/wf/execution",
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
            console.info(res.data);
            //console.info(_this.activitiData);
            //可以处理
            if (res.data.enable == undefined || res.data.enable == 1) {
              //如果是待阅
              if (
                _this.validUtil.isNotEmpty(_this.taskId) &&
                _this.taskType == "1"
              ) {
                _this.isWorkflow = true;
                _this.isCopy = true;
                _this.initProcessMonitor();
                return;
              } else if (
                (_this.validUtil.isNotEmpty(_this.taskId) &&
                  _this.taskType == "0") ||
                (res.data["activities"] != undefined &&
                  res.data["activities"].length > 0)
              ) {
                //待办
                _this.ifSelCopy = res.data["ifSelCopy"];
                _this.isWorkflow = true;
                _this.ifShowCopy = true;
                _this.isReadOnly = false;
                _this.isApply = false;
                _this.isEndEvent = false;
                //如果是第一环节说明是驳回
                if (
                  res.data.ifFirstNode &&
                  _this.validUtil.isNotEmpty(_this.procInstId)
                ) {
                  _this.ifBackFirst = true;
                } else {
                  if (_this.validUtil.isNotEmpty(_this.procInstId)) {
                    _this.isApproval = true;
                  } else {
                    //第一次提交
                  }
                }

                for (var i = 0; i < res.data.activities.length; i++) {
                  var item = res.data.activities[i];
                  //默认第一个选中
                  if (i == 0) {
                    item.selected = true;
                    _this.initProcUsers(item);
                  } else {
                    item.selected = false;
                  }
                }
                _this.activitiData = res.data["activities"];
              } else {
                //我申请的
                _this.isWorkflow = true;
                _this.isApply = true;
              }
            } else {
              //说明当前打开表单的不是处理人本人，或者该任务不存在
            }
            _this.initProcessMonitor();
          } else {
            _this.util.error(res["errorMsg"]);
          }
        }
      );
    },
    initProcUsers(item) {
      //初始化环节处理人
      if (item.type != "endType" && item.taskType != "endEvent") {
        this.ifShowProc = true;
      } else {
        this.ifShowProc = false;
      }
      var procUsers = item.procUsers;
      this.selectedAct = item;
      var selectList = [];
      if (procUsers != undefined && procUsers.length > 0) {
        for (var i = 0; i < procUsers.length; i++) {
          var procUser = procUsers[i];
          selectList.push({
            id: procUser.procUserUid,
            userName: procUser.procUserName,
            userId: procUser.procUserId,
            picture: procUser.picture
          });
        }
      }
      this.procUserModel.selectList = selectList;

      if (item.ifSelUser) {
        this.ifSelUser = true;
      } else {
        this.ifSelUser = false;
      }
      //this.procUserModel.isShow = true;
    },
    initProcessMonitor() {
      //加载流程监控
      this.showProcessMonitor = true;
      var _this = this;
      //console.info(_this.$refs.processMonitor);
      if (this.processMonitorCount > 100) {
        return;
      }
      if (_this.$refs.processMonitor == undefined) {
        this.processMonitorCount++;
        setTimeout(function () {
          _this.initProcessMonitor();
        }, 500);
        return;
      }
      //console.info("=======");
      _this.$refs.processMonitor.initProcess(_this.procInstId, _this.procDefId);
    },
    addProcUser() {
      //添加处理人
      //console.info(this.$refs.selectProcUser);
      this.procUserModel.isShow = true;
      this.$refs.selectProcUser.sync(this.procUserModel.selectList);
      
    },
    removeProcUser(user) {
      this.procUserModel.selectList = this.procUserModel.selectList.filter(
        item => {
          return item != user;
        }
      );
      this.selectedAct.procUsers = this.selectedAct.procUsers.filter(item => {
        return item.procUserUid != user.id;
      });
    },
    delProcUser() {
      this.showProcUserDelete = !this.showProcUserDelete;
    },
    addCopyUser() {
      //添加处理人
      this.copyUserModel.isShow = true;
      this.$refs.selectCopyUser.sync(this.copyUserModel.selectList);
    },
    removeCopyUser(user) {
      this.copyUserModel.selectList = this.copyUserModel.selectList.filter(
        item => {
          return item != user;
        }
      );
    },
    delCopyUser() {
      this.showCopyUserDelete = !this.showCopyUserDelete;
    },
    selected(item, list) {
      //console.info("====selected===="+item.key);
      //console.info(item);
      //由于单选
      for (var i = 0; i < list.length; i++) {
        //默认第一个选中
        var temp = list[i];
        if (temp.id == item.id) {
          temp.selected = true;
        } else {
          temp.selected = false;
        }
      }
      //console.info( this.processList);
    },
    selectProcUserCallback() {
      console.info("====selectProcUserCallback====");
      //console.info(this.procUserModel.selectList);
      var selectList = [];
      for (var i = 0; i < this.procUserModel.selectList.length; i++) {
        var procUser = this.procUserModel.selectList[i];
        selectList.push({
          procUserUid: procUser.id,
          procUserName: procUser.userName,
          procUserId: procUser.userId,
          picture: procUser.picture
        });
      }
      this.selectedAct.procUsers = selectList;
      this.procUserModel.isShow = false;
    },
    selectCopyUserCallback() {
      //console.info("====selectCopyUserCallback====");
      this.copyUserModel.isShow = false;
    },
    submit(type) {
      var _this = this;
      if (type == 0) {
        //取消
        if (this.model.parent.cancelCallback != undefined) {
          this.model.parent.cancelCallback();
        } else {
          history.back();
        }
        return;
      } else if (type == 7) {
        //当多个流程时弹出流程选择框中的确定
        for (var i = 0; i < this.processList.length; i++) {
          //默认第一个选中
          var temp = this.processList[i];
          if (temp.selected) {
            this.procDefId = temp.procDefId;
            this.procDefName = temp.name;
            this.key = temp.key;
            this.closeSelDialog();
            //加载流程处理单
            this.loadExecution();
            return;
          }
        }
      } else if (type == 8) {
        //提交，判断是否流程定义还没有，并且该表单有多个流程
        if (
          !this.validUtil.isNotEmpty(this.procDefId) &&
          this.processList.length > 1
        ) {
          this.dialogSelProcVisible = true;
          return;
        }
      }

      var maskStr = "正在保存...";
      var params = {};
      if (this.isWorkflow) {
        params["comment"] = this.comment;
        params["procDefName"] = _this.validUtil.isNotEmpty(this.procDefName)
          ? this.procDefName
          : this.model.parent.modelName;
        params["procDefId"] = _this.procDefId;
        params["taskId"] = _this.taskId;
        params["taskType"] = _this.taskType;
        params["procInstId"] = _this.procInstId;
        params["ifSaveWorkflow"] = true;
      }
      params["id"] = this.id;
      params["businessKey"] = params["id"];
      params["currentUserUid"] = this.sessionUtil.getUserUid(this);
      params["currentUserName"] = this.sessionUtil.getUserName(this);
      params["currentUserId"] = this.sessionUtil.getUserId(this);
      params["formKey"] = this.model.parent.formKey;
      params["sqlTableName"] = this.model.parent.sqlTableName;
      //只是点击保存
      if (type == 1) {
        //判断父组件是否复写表单验证方法
        if (this.model.parent.checkValid != undefined) {
          if (!this.model.parent.checkValid()) {
            return;
          }
        }
        //判断表单是否复写获取数据的方法
        if (this.model.parent.getData != undefined) {
          var formData = this.model.parent.getData();
          //合并对象
          params = Object.assign(params, formData);
          params["ifSaveWorkflow"] = false;
        }
      }
      if (type == 6 || type == 8) {
        //type == 6表示按钮是同意，8表示提交
        maskStr = "正在提交...";
        //如果不是抄送则获取表单数据和下一环节数据
        if (this.taskType != "1") {
          if (this.model.parent != undefined) {
            if (this.model.parent.checkValid != undefined) {
              if (!this.model.parent.checkValid()) {
                return;
              }
            }
            //console.info("-------"+this.model.parent.getData);
            if (this.model.parent.getData != undefined) {
              var formData = this.model.parent.getData();
              //合并对象
              params = Object.assign(params, formData);
              params["ifSaveWorkflow"] = true;
            }
          }
          //console.info(params)
          //_this.util.successToast("----数据获取完毕-----");
          if (this.model.parent.agentId != undefined) {
            params["agentId"] = this.model.parent.agentId;
          }
          if (!_this.isEndEvent) {
            for (var i = 0; i < _this.activitiData.length; i++) {
              var act = _this.activitiData[i];
              if (act.selected) {
                console.info(act);
                if (act.type != "endType" && act.taskType != "endEvent") {
                  if (act.procUsers.length == 0) {
                    this.util.failueToast("请选择[" + act.name + "]处理人！");
                    return false;
                  }
                }
              }
            }
          }

          var newActivitiData = [];
          for (var i = 0; i < _this.activitiData.length; i++) {
            var act = _this.activitiData[i];
            if (act.selected) {
              newActivitiData.push(act);
            }
          }
          //console.info(this.activitiData);
          //console.info(this.copyUserModel.users);
          //params['activityData'] = JSON.stringify(newActivitiData);
          params["activities"] = newActivitiData;
          //console.info(this.copyUserModel.users);
          var copyUsersArr = new Array();
          for (var i = 0; i < this.copyUserModel.selectList.length; i++) {
            var procUser = this.copyUserModel.selectList[i];
            var user = new Object();
            user.id = procUser["id"];
            user.userName = procUser["userName"];
            user.mobile = procUser["mobile"];
            user.wxId = procUser["wxId"];
            copyUsersArr.push(user);
          }
          //console.info(this.copyUserModel.users);
          params["copyUsersStr"] = JSON.stringify(copyUsersArr);
          params["operateType"] = 0;
        } else {
          //如果是抄送
          params["operateType"] = 1;
        }
      } else if (type == 5) {
        //不同意，回退
        params["mainFormData"] = null;
        params["subFormData"] = null;
        params["operateType"] = 6;
      } else if (type == 3) {
        //撤销
        if (this.model.parent.getData != undefined) {
          var data = this.model.parent.getData();
          //console.info(data);
          params["subject"] = data["subject"];
        }
        params["procDefName"] = _this.procDefName;
        params["formKey"] = this.model.parent.formKey;
        params["sqlTableName"] = this.model.parent.sqlTableName;
        params["procDefId"] = _this.procDefId;
        params["id"] = this.id == undefined ? "" : this.id;
        params["businessKey"] = params["id"];
        params["currentUserUid"] = this.sessionUtil.getUserUid(this);
        params["currentUserName"] = this.sessionUtil.getUserName(this);
        params["currentUserId"] = this.sessionUtil.getUserId(this);
        params["ifSaveWorkflow"] = true;
        params["operateType"] = 14;
        params["procInstId"] = _this.procInstId;
        maskStr = "正在撤销...";
      } else if (type == 4) {
        //催办
        if (this.isWorkflow) {
          params["sqlTableName"] = this.model.parent.sqlTableName;
          params["procDefId"] = this.procDefId;
          params["formKey"] = this.model.parent.formKey;
          params["id"] = this.id == undefined ? "" : this.id;
          params["businessKey"] = params["id"];
          params["currentUserUid"] = this.sessionUtil.getUserUid(this);
          params["currentUserName"] = this.sessionUtil.getUserName(this);
          params["currentUserId"] = this.sessionUtil.getUserId(this);
          params["ifSaveWorkflow"] = true;
          params["operateType"] = 13;
          params["procInstId"] = this.procInstId;
          maskStr = "正在催办...";
        }
      }
      if (type == 3) {
        _this.util.confirm("你确定要撤销？", "提示", function () {
          _this.util.mask(maskStr);
          _this.saveData(type, params);
          if (this.model.parent.saveData != undefined) {
            this.model.parent.saveData(type, params);
          } else {
            _this.saveData(type, params);
          }
        });
      } else {
        _this.util.mask(maskStr);
        if (this.model.parent.saveData != undefined) {
          this.model.parent.saveData(type, params);
        } else {
          _this.saveData(type, params);
        }
      }
    },
    saveData(type, params) {
      var _this = this;
      _this.util.restPost("/api_v1/form/business", params, function (res) {
        if (res != undefined && res != null) {
          if (res.status == 200) {
            _this.util.successToast("成功");
            if (type == 4) {
            } else if (type == 3) {
              //如果是撤销
              _this.procInstId = res.data["procInstId"];
              _this.taskId = res.data["taskId"];
              _this.taskType = "0";
              _this.model.parent.isReadOnly = false;
              if (_this.model.parent.updateStatus != undefined) {
                _this.model.parent.updateStatus();
              }
              _this.ifBackFirst = true;
              _this.loadExecution();
              //_this.loadMonitor();
            } else {
              _this.isReadOnly = true;
              _this.ifBackFirst = false;
              _this.isWorkflow = false;
              _this.isApply = false;
              _this.isApproval = false;
              _this.isEndEvent = true;
              _this.$store.state.operate = "save";
              if (_this.model.parent.saveDataCallback != undefined) {
                _this.model.parent.saveDataCallback();
              } else {
                history.back();
              }
            }
          } else {
            _this.util.failueToast("保存失败" + res.errorMsg);
          }
        }

        _this.util.unmask();
      });
    },
    closeSelDialog() {
      this.dialogSelProcVisible = false;
    }
  }
};
</script>
 
<style scoped>
.select-box {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 998;
}

.select {
  position: absolute;
  z-index: 999;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  width: 460px;
  height: 250px;
  overflow: hidden;
  padding: 68px 20px 58px 20px;
  box-sizing: border-box;
}

.select-center {
  width: 100%;
  height: 100%;
  overflow: auto;
}

h4 {
  color: #333;
  font-size: 18px;
  font-family: SourceHanSansCN-Medium;
  padding-left: 12px;
  position: relative;
  margin: 30px 0;
}

h4 i {
  content: "";
  position: absolute;
  left: 0;
  top: 4px;
  height: 20px;
  width: 2px;
}

.select .title {
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;
}

.img-box img {
  width: 100%;
  margin-top: 4px;
}

.footer {
  position: absolute;
  bottom: 20px;
  width: 100%;
  left: 0;
}

.footer button {
  float: right;
  width: 60px;
  height: 28px;
  margin-right: 20px;
}

.select-center li {
  height: 37px;
  box-sizing: border-box;
  padding: 6.5px 0;
}

.select-center li p {
  float: left;
}

.select-center li img {
  float: left;
  margin-right: 8px;
}

.select-center li .select-img {
  float: right;
}
.button {
  background: rgb(92, 154, 212);
  color: rgb(255, 255, 255);
  border-color: rgb(92, 154, 212);
}
/* .buttonGroup {
    position: fixed;
    bottom: 16px;
    background: white;
    height: 50px;
    z-index: 100;
    right: 65px;
} */
.jrsoft-process {
  padding-bottom: 20px;
}
.jrsoft-process img {
  vertical-align: middle;
}
.btnClass button {
  height: 35px;
}
</style>