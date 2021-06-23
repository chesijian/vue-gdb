<template>
  <div class="check-box">
    <div class="tabs-box">
      <div class="tabs" style="">
        <div ><router-link  :class="{active:$route.path=='/page/realNameSystem'}" to="/page/realNameSystem/">首页</router-link></div>
        <div ><router-link v-if="sessionUtil.isAllowBtn('gc7_1:view')||sessionUtil.isAllowMenu('/page/realNameSystem/memberManage')||sessionUtil.isAllowMenu('020301')" :class="{active:$route.path=='/page/realNameSystem/memberManage'}" to="/page/realNameSystem/memberManage">人员管理</router-link></div>
        <div ><router-link v-if="sessionUtil.isAllowBtn('gc7_2:view')||sessionUtil.isAllowMenu('/page/realNameSystem/signinRecord')||sessionUtil.isAllowMenu('020302')" :class="{active:$route.path=='/page/realNameSystem/signinRecord'}" to="/page/realNameSystem/signinRecord">考勤记录</router-link></div>
        <div ><router-link v-if="sessionUtil.isAllowBtn('gc7_3:view')||sessionUtil.isAllowMenu('/page/realNameSystem/LaborContract')||sessionUtil.isAllowMenu('020303')" :class="{active:$route.path=='/page/realNameSystem/LaborContract'}" to="/page/realNameSystem/LaborContract">劳动合同</router-link></div>
        <div ><router-link v-if="sessionUtil.isAllowBtn('sb2_1:view')||sessionUtil.isAllowMenu('/page/realNameSystem/gateBrake')||sessionUtil.isAllowMenu('020304')" :class="{active:$route.path=='/page/realNameSystem/gateBrake'}" to="/page/realNameSystem/gateBrake">闸机设置</router-link></div>
        <div ><router-link v-if="sessionUtil.isAllowBtn('gc7_5:view')||sessionUtil.isAllowMenu('/page/realNameSystem/ShiftManagement')||sessionUtil.isAllowMenu('020305')" :class="{active:$route.path=='/page/realNameSystem/ShiftManagement'}" to="/page/realNameSystem/ShiftManagement">班次设置</router-link></div>
        <div ><router-link v-if="sessionUtil.isAllowBtn('gc7_6:view')||sessionUtil.isAllowMenu('/page/realNameSystem/WorkforceManagement')||sessionUtil.isAllowMenu('020306')" :class="{active:$route.path=='/page/realNameSystem/WorkforceManagement'}" to="/page/realNameSystem/WorkforceManagement">排班管理</router-link></div>
        <div ><router-link v-if="sessionUtil.isAllowBtn('gc7_7:view')||sessionUtil.isAllowMenu('/page/realNameSystem/CreditRecord')||sessionUtil.isAllowMenu('020307')" :class="{active:$route.path=='/page/realNameSystem/CreditRecord'}" to="/page/realNameSystem/CreditRecord">征信记录</router-link></div>
        <div ><router-link v-if="sessionUtil.isAllowBtn('gc7_8:view')||sessionUtil.isAllowMenu('/page/realNameSystem/AdvanceAndRetreat')||sessionUtil.isAllowMenu('020308')" :class="{active:$route.path=='/page/realNameSystem/AdvanceAndRetreat'}" to="/page/realNameSystem/AdvanceAndRetreat">人员进退场</router-link></div>
        <div ><router-link v-if="sessionUtil.isAllowBtn('gc7_9:view')||sessionUtil.isAllowMenu('/page/realNameSystem/WageManagement')||sessionUtil.isAllowMenu('020309')" :class="{active:$route.path=='/page/realNameSystem/WageManagement'}" to="/page/realNameSystem/WageManagement">工资管理</router-link></div>
        <div ><router-link v-if="sessionUtil.isAllowMenu('/page/realNameSystem/TrainingManagement')||sessionUtil.isAllowMenu('020310')" :class="{active:$route.path=='/page/realNameSystem/TrainingManagement'}" to="/page/realNameSystem/TrainingManagement">培训管理</router-link></div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        activeStr:'检查问题',
      }
    },
  }
</script>

<style scoped>
  .check-box{
    width: 100%;
    height: 100%;
    padding:36px 10px 10px;
    box-sizing: border-box;
    position: relative;
  }
  .tabs-box{
    position: absolute;top: 0;padding: 0 10px;box-sizing: border-box;left: 0;width: 100%;
  }
  .tabs{
    width: 100%;
    height: 36px;
    border: 1px solid #44D2FF ;
    box-sizing: border-box;
    padding: 0 10px;
    text-align: center;

  }
  .tabs div a{
    width: 78px;
    float: left;
    height: 26px;
    line-height: 26px;
    margin-top: 4px;
    cursor: pointer;
    margin-bottom: 10px;
    font-size: 14px;
    color: #fff;
    text-decoration: none;
  }
  .tabs .active{
    background: url(../../assets/indexImg/select.png) no-repeat  top center;
  }
</style>
