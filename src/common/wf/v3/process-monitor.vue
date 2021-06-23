<template>

  <div v-if="monitorVisible" style="margin-top:0px;">
    <!--流程监控-->
    <el-row>
      <div class="middle" style="background-color: rgb(245, 247, 250);line-height: 35px;">
        <div class="pop" style="background-color: rgb(245, 247, 250);margin-left:10px;color: blue;">
          <span class="span-look" style="text-align:left;margin-left: 0px;color:#3b8cff;" @click="procTaskVisible = !procTaskVisible">流转记录</span><span
          class="span-look" @click="openPng();" style="color:#3b8cff;">查看流程图</span>
        </div>
      </div>
      <div v-if="procTaskVisible" style="margin-top:0px;height:100%" :space="200">
        <div class="el-steps el-steps--vertical " style="margin-top: 10px;">
          <div v-for="(item,key) in actList" :key="key" class="el-step is-vertical" style="flex-basis: 50%;">
            <div class="el-step__head "
                 :style="item.startTime == undefined?'color:#c0c4cc':(item.endTime == undefined?'color:#409eff':'color:#67c23a')">
              <div class="el-step__line"
                   :style="item.startTime == undefined?'margin-right: 0px;    background-color:#c0c4cc':(item.endTime == undefined?'margin-right: 0px;background-color:#409eff':'margin-right: 0px;background-color:#67c23a')">
                <i class="el-step__line-inner" style="transition-delay: 0ms; border-width: 0px; height: 0%;"></i>
              </div>
              <div class="el-step__icon is-text"
                   :style="item.startTime == undefined?'border-color:#c0c4cc':(item.endTime == undefined?'border-color:#409eff':'border-color:#67c23a')">
                <!---->
                <div class="el-step__icon-inner">{{key+1}}</div>
              </div>


            </div>
            <div class="el-step__main " style="padding-right: 10px;">
              <div class="jr-step__main">
                <div>
                  <img class="el-step-avatar" :src="avatar(item)">
                </div>
                <div class="jr-step-content">
                  <div class="jr-step-content-header">
                    <div class="jr-step-content-header-task">
                      {{item.name}}
                    </div>
                    <div class="jr-step-content-header-time">
                      {{(item.startTime == undefined?'':item.startTime.substring(0,11))+(item.endTime == undefined?'':'~ '+item.endTime.substring(0,11))}}
                    </div>
                  </div>
                  <div class="jr-step-content-floor">
                    <div class="jr-step-content-comment">
                      {{item.comment}}
                    </div>
                    <div class="jr-step-content-sign"
                         v-if="item.category !== '1'  && !item.start && item.startTime && item.endTime">
                      签名：<img v-if="item.sign" class="jr-step-content-sign-img" :src="signPic(item)">
                      <span v-else>{{item.assignee}}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div v-if="item.category == '1'" class="el-step-type">
              抄送
            </div>
            <div v-if="item.category !== '1' && !item.start && item.startTime && item.endTime === undefined"
                 class="jr-step-run">
              审批中
            </div>
            <div
              v-if="item.category !== '1' && !item.start && item.startTime && item.endTime && (item.comment === undefined || (item.comment.indexOf('回退首环节')< 0 && item.comment.indexOf('回退上一环节')< 0))"
              class="jr-step-end">
              已审批
            </div>
            <div
              v-if="item.category !== '1' && !item.start && item.startTime && item.endTime && (item.comment && item.comment.indexOf('回退首环节')>-1)"
              class="jr-step-reject">
              已驳回
            </div>
            <div
              v-if="item.category !== '1' && !item.start && item.startTime && item.endTime && (item.comment && item.comment.indexOf('回退上一环节')>-1)"
              class="jr-step-reject">
              不同意
            </div>
          </div>
        </div>
      </div>
    </el-row>
    <el-dialog
      :title="pngTitle"
      :visible.sync="pngVisible"
      width="30%"
      height="50%"
      center>
      <div style="width:100%;height:500px;text-align: center;overflow: auto;">

        <img style="width:200px;" width='100%' :src="pngSrc"/>
      </div>

    </el-dialog>
  </div>


</template>
<script>

  export default {
    name: 'ProcessMonitor',
    props: ['model'],
    data() {
      return {
        monitorVisible:false,
        pngSrc: null,
        pngTitle: '流程图',
        pngVisible: false,
        defaultConfig: {},
        procTaskVisible: false,
        defaultAvatar: require('../../../assets/login/DefaultAvatar.png'),
        showProcUserDelete: false,//显示处理人的删除按钮
        showCopyUserDelete: false,//显示抄送人的删除按钮
        showSelectProcUser: false,//显示选择处理人
        showSelectCopyUser: false,//显示选择抄送人
        actList: [],
        businessKey:'',
        procDefId: '',//流程定义主键
        procInstId: ''//流程实例主键

      };
    },
    components: {},
    computed: {
      signPic(item) {
        return function (item) {
          let defaultUrl = ''// 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
          if (item['sign']) {
            defaultUrl = this.util.getBaseUrl() + '/api_v1/files/' + item['sign'] + '/look?ifThumb=false&access_token=' + this.sessionUtil.getAccessToken()
          }
          return defaultUrl
        }
      },
      avatar(item) {
        return function (item) {
          let defaultUrl = this.defaultAvatar
          if (item['avatar']) {
            defaultUrl = item['avatar']
          }
          return defaultUrl
        }
      }
    },
    created() {
      this.util.init(this);
      //console.info("processMonitor=======created========");
      //this.config =  this.defaultConfig;
    },
    activated() {
      //console.info("processMonitor=======activated========");
    },
    mounted() {

    },
    watch:{
      model:{
        handler(newVal,oldVal){
          /*if(newVal != null ){

            console.log('------',newVal,newVal.ifHasProcess,this.validUtil.isNotNull(newVal.businessKey))
          }
          if(newVal != null && newVal.ifHasProcess && this.validUtil.isNotNull(newVal.businessKey)){
            this.initProcess(newVal.businessKey)
          }*/
        },
        immediate:true
      }
    },
    methods: {

      initProcess(businessKey) {
        // console.log('--------initProcess----------',businessKey)
        if(this.validUtil.isNull(businessKey)){
          return
        }
        this.monitorVisible = true
        this.businessKey = businessKey
        this.actList = [];
        if (this.validUtil.isNotEmpty(businessKey)) {
          var _this = this;
          this.util.restGet('/api_v1/wf/tasks/historic', {
            businessKey: businessKey,
            flag: false
          }, function (res) {
            if (res.status == 200) {
              if (res.data && res.data.length>0) {
                _this.procTaskVisible = true
                _this.actList = res.data;
              }else{
                // 隐藏父页面的流程监控
                if(_this.model.parent && _this.model.parent.hideProcessMonitor){
                  _this.model.parent.hideProcessMonitor()
                }
              }

              // _this.actList.push({
              //     assignee: "管理员",
              //     category: "0",
              //     name: "结束",
              //     taskDefKey: "node4",
              // });
            }
          });
        }
      },
      openPng() {
        // 打开流程图
        if (this.validUtil.isNotEmpty(this.businessKey)) {
          this.pngVisible = true
          this.pngSrc = this.util.getBaseUrl() + '/api_v1/wf/png?businessKey=' + this.businessKey + '&access_token=' + this.sessionUtil.getAccessToken()
          // console.info(this.pngSrc);
        }
      }
    }
  };
</script>

<style scoped>
  .jr-step__main {
    width: 100%;
    display: flex;
    /*border: 1px dashed green;*/
    margin-bottom: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .el-step-avatar {
    width: 35px;
    height: 35px;
    margin: 9px;

  }

  .jr-step-content {
    display: flex;
    flex-flow: column;
    width: 100%;
  }

  .jr-step-content-header {
    width: 100%;
    padding-top: 5px;
    display: flex;
  }

  .jr-step-content-header-task {
    display: flex;
    width: 50%;
    padding-top: 0px;
  }

  .jr-step-content-comment {
    font-size: 10pt;
    color: #8b919e;
  }

  .jr-step-content-header-time {
    float: right;
    text-align: right;
    width: 50%;
    padding-right: 5px;
    color: #909399;
  }

  .jr-step-content-sign {
    text-align: right;
    padding-right: 57px;
    color: #909399;
  }

  .jr-step-content-sign-img {
    width: 65px;
    height: 25px;
    padding-bottom: 5px;
  }

  .el-step-type {
    position: absolute;
    width: 25px;
    left: 200px;
    font-size: 9pt;
    border: 1px solid #ff7e00;
    padding: 2px;
    height: 14px;
    line-height: 15px;
    top: 1px;
    color: #ff6000;
  }

  .jr-step-end {
    position: absolute;
    width: 36px;
    right: 200px;
    font-size: 9pt;
    border: 1px solid #67c23a;
    /* padding: 2px; */
    height: 14px;
    line-height: 15px;
    top: 6px;
    color: #67c23a;
    transform: rotate(-7deg);
    padding: 2px 10px 2px 10px;
    border-radius: 3px;
  }

  .jr-step-reject {
    position: absolute;
    width: 36px;
    right: 200px;
    font-size: 9pt;
    border: 1px solid #ff7e00;
    /* padding: 2px; */
    height: 14px;
    line-height: 15px;
    top: 6px;
    color: #ff6000;
    transform: rotate(-7deg);
    padding: 2px 10px 2px 10px;
    border-radius: 3px;
  }

  .jr-step-run {
    position: absolute;
    width: 36px;
    right: 200px;
    font-size: 9pt;
    border: 1px solid #409eff;
    /* padding: 2px; */
    height: 14px;
    line-height: 15px;
    top: 6px;
    color: #409eff;
    transform: rotate(-7deg);
    padding: 2px 10px 2px 10px;
    border-radius: 3px;
  }
</style>
