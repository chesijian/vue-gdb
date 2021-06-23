<template>
  <div class="jrsoft-process" style="margin-top:0px;">
    <div  class="buttonGroup" style="margin-top: 0px;">
      <el-button-group>
        <el-button size="mini" v-if="!isReadOnly && !isApproval" @click="submit(1)" type="warning">保存</el-button>
        <el-button size="mini" v-if="isApproval" @click="submit(6)" type="warning">同意</el-button>
        <el-button size="mini" v-if="ifBackFirst || isCopy" @click="submit(6)" type="warning">提交</el-button>
        <el-button size="mini" v-if="isWorkflow && !isApply && !isApproval   && !isCopy && !ifBackFirst" @click="submit(8)"
                   type="warning">{{isEndEvent?"办理完成":"提交"}}
        </el-button>

        <el-button size="mini" v-if="isApproval" @click="submit(5)" type="danger">驳回</el-button>
        <el-button size="mini" v-if="isApply " @click="submit(3)" type="warning">撤销</el-button>
        <el-button size="mini" v-if="isApply" @click="submit(4)" type="warning">催办</el-button>
        <!-- <el-button type="warning" size="mini" @click="submit(9)">打印</el-button> -->
        <el-button type="warning" size="mini" @click="submit(10)">导出</el-button>
        <el-button type="info" size="mini" @click="model.parent.submit(0)">关闭</el-button>
      </el-button-group>
    </div>
    <div v-if="isWorkflow && (activitiData.length>0 || isCopy)" style="padding-top: 0px;padding-bottom: 0px;background-color: white;">

      <!--<div class="boxs-1"  :style="{width:'95%',height:'80%',overflow: 'auto'}">-->
    <div v-if="isWorkflow">



      <div v-if="activitiData.length>0"
           style="background-color: rgb(228, 228, 228); height: 35px;line-height: 35px;padding-top: 0px;padding-left: 10px;margin-top: 10px;">
        <div style="float:left;margin-right:20px;">后续环节:</div>
        <div v-for="(item,key) in activitiData" :key="key" @click="selected(item,activitiData);initProcUsers(item);"
             style="float:left;margin-right:20px;">
          <img class="select-img" src="../../../assets/administrationIcon/active.png" width="20px" v-show="item.selected"
               alt="">
          <img class="select-img" src="../../../assets/administrationIcon/defult.png" width="20px" v-show="!item.selected"
               alt=""><span style="margin-left:5px;margin-top:3px;">{{item.name}}</span>

        </div>
      </div>
      <el-row v-show="ifShowProc" style="margin-bottom: 0px;">
        <div>

          <div class="load">
            <ul style="margin-bottom:0px;">
              <li style="margin-top: 2px;">
                <ul style="overflow:hidden;">
                  <li
                    style="float:left;margin:5px 5px 5px 5px;margin-right: 10px;position:relative;text-align:left;width:43px;display: inline-block;"
                    v-for="procUser in procUserModel.selectList" :key="procUser.id">
                    <div>
                      <div>
                        <img style="width:43px;height:43px;" :src="procUser.picture" alt=""></div>
                      <div style="text-align:center; font-size: 10px;">
                        <span>{{procUser.userName.length>3?procUser.userName.substring(procUser.userName.length-3,procUser.userName.length):procUser.userName}}</span>
                      </div>
                    </div>
                    <i @click="removeProcUser(procUser,$event)" v-if="showProcUserDelete" class="changeDelete"
                       style="position:absolute;top:-3px;left:30px;background:#f00;width:20px;height:20px;font-size:14px;line-height:20px;border-radius:50%;color:#fff">&nbsp;X</i>
                  </li>
                  <li v-if="ifSelUser"
                      style="float:left;margin:5px 0px 17px 3px;position:relative;text-align:left;width:43px;display: inline-block;">
                    <div>
                      <svg class="icon" style="font-size:46px;width: 46px;height: 46px;fill:#ccc;" @click="addProcUser()" aria-hidden="true">
                        <use xlink:href="#icon-tianjiarenyuan"></use>
                      </svg>
                      <!-- <img style="width:45px;height:45px;" @click="addProcUser()" src="../../assets/addPeople1.png"> -->
                    </div>
                  </li>
                  <li v-if="ifSelUser"
                      style="float:left;margin:5px 5px 17px 5px;position:relative;text-align:left;width:43px;display: inline-block;">
                    <div>
                      <svg class="icon" style="font-size:46px;width: 46px;height: 46px;fill:#ccc;" @click="delProcUser()" aria-hidden="true">
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
        <div class="middle" style="background-color: rgb(228, 228, 228);line-height: 35px;">
          <div class="pop" style="background-color: rgb(228, 228, 228);margin-left:10px;">
            <span style="text-align:left;">抄送人</span>
          </div>
        </div>
        <div class="load">
          <ul style="margin-bottom:0px;">
            <li style="margin-top: 2px;">
              <ul>
                <li style="float:left;margin:5px 5px 5px 5px;position:relative;text-align:left;"
                    v-for="user in copyUserModel.selectList" :key="user.id">
                  <div>
                    <div>
                      <img style="width:43px;height:43px;" :src="user.picture" alt=""></div>
                    <div style="text-align:center; font-size: 10px;">
                      <span>{{user.userName.length>3?user.userName.substring(user.userName.length-3,user.userName.length):user.userName}}</span>
                    </div>
                  </div>
                  <i @click="removeCopyUser(user,$event)" v-if="showCopyUserDelete" class="changeDelete"
                     style="position:absolute;top:-6px;left:-5px;background:#f00;width:20px;height:20px;font-size:14px;line-height:20px;border-radius:50%;color:#fff">&nbsp;X</i>
                </li>
                <li v-if="ifSelCopy" style="float:left;margin:5px 0px 17px 3px;position:relative;text-align:left;">
                  <svg class="icon" style="font-size:46px;width: 46px;height: 46px;fill:#ccc" @click="addCopyUser()" aria-hidden="true">
                    <use xlink:href="#icon-tianjiarenyuan"></use>
                  </svg>
                  <!-- <img style="width:45px;height:45px;" @click="addCopyUser()" src="../../assets/addPeople1.png"> -->
                </li>
                <li v-if="ifSelCopy" style="float:left;margin:5px 5px 17px 5px;position:relative;text-align:left;">
                  <svg class="icon" style="font-size:46px;width: 46px;height: 46px;fill:#ccc" @click="delCopyUser()" aria-hidden="true">
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
        <div class="middle" style="background-color: rgb(228, 228, 228);line-height: 35px;">
          <div class="pop" style="background-color: rgb(228, 228, 228);margin-left:10px;">
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
        <div class="middle" style="background-color: rgb(228, 228, 228);line-height: 35px;">
          <div class="pop" style="background-color: rgb(228, 228, 228);margin-left:10px;">
            <span  class="span-look" style="text-align:left;margin-left: 0px;" @click="procTaskVisible = !procTaskVisible">流转记录</span><span class="span-look" @click="openPng();" style="">查看流程图</span>
          </div>
        </div>
        <process-monitor  v-if="procTaskVisible" :model="processMonitorModel" ref="processMonitor" style="margin-top:10px;"></process-monitor>
      </el-row>
    </div>


    </div>

    <div>

      <div class="select-box" v-if="dialogSelProcVisible">
        <div class="select">
          <div class="title">
            <h4 style="margin:30px 22px 0;"><i></i>请选择流程</h4>

          </div>
          <div class="select-center">
            <ul>
              <li v-for="(item,key) in processList" :key="key" @click="selected(item,processList)"
                  style="border-bottom: dashed  1px rgb(235, 233, 233);">
                <p>{{item.name}}</p>
                <img class="select-img" src="../../../assets/administrationIcon/active.png" width="20px"
                     v-show="item.selected" alt="">
                <img class="select-img" src="../../../assets/administrationIcon/defult.png" width="20px"
                     v-show="!item.selected" alt="">
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
   // import {unwatchFile} from "fs";
  import {mixin} from './mixin.js'

  export default {
    name: 'ProcessForm',
    mixins: [mixin]

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
    padding-bottom: 10px;
  }

  .jrsoft-process img {
    vertical-align: middle;
  }

  .btnClass button {
    height: 35px;
  }

  .span-look {
    margin-left: 20px;
    text-align: left;
    color: #9a9a9a;
    cursor: pointer;
  }

  span.span-look:hover {
    color: #908c8c;
  }
  .boxs {
    width: 812px;
    transform: translate(-50%, -50%);
    position: fixed;
    left: 50%;
    top: 50%;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    height: 391px;
    z-index: 99;
    overflow: hidden;
    padding: 0 15px;
    display: flex;
    flex-flow: column;
    box-sizing: border-box;
  }
</style>
