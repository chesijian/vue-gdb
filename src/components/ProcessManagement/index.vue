<template>
  <div class="check-box">
    <div class="tabs-box">
      <div class="tabs" style="">
        <div ><router-link :class="{active:$route.path=='/page/ProcessManagement'}" to="/page/ProcessManagement">首页</router-link></div>
        <div ><router-link active-class="active" :to="{path:'/page/ProcessManagement/workingProcedure',query:{formType:'procedure'}}"  v-if="sessionUtil.isAllowMenu('/page/ProcessManagement/workingProcedure')">工序</router-link></div>
        <div ><router-link :class="{active:$route.path=='/page/ProcessManagement/InspectionLot'}" to="/page/ProcessManagement/InspectionLot" v-if="sessionUtil.isAllowMenu('/page/ProcessManagement/InspectionLot')||sessionUtil.isAllowBtn('gc3_2:view')">工序检验批</router-link></div>
        <div ><router-link :class="{active:$route.path=='/page/ProcessManagement/ProcessTask'}" to="/page/ProcessManagement/ProcessTask" v-if="sessionUtil.isAllowMenu('/page/ProcessManagement/ProcessTask')||sessionUtil.isAllowBtn('gc3_3:view')">工序计划</router-link></div>
        <!-- <div ><router-link :class="{active:$route.path=='/page/ProcessManagement/form/query/t_procedure_plan'}"  to="/page/ProcessManagement/form/query/t_procedure_plan"  v-if="sessionUtil.isAllowMenu('/page/ProcessManagement/Rectification')||sessionUtil.isAllowBtn('gc3_4:view')">计划编制</router-link></div> -->
        <div ><router-link :class="{active:$route.path=='/page/ProcessManagement/Rectification'}" to="/page/ProcessManagement/Rectification" v-if="sessionUtil.isAllowMenu('/page/ProcessManagement/Rectification')||sessionUtil.isAllowBtn('gc3_5:view')">检查记录</router-link></div>
        <!-- <div ><router-link :class="{active:$route.path=='/page/ProcessManagement/jurisdiction'}"  to="/page/ProcessManagement/jurisdiction" v-if="sessionUtil.isAllowMenu('/page/ProcessManagement/jurisdiction')||sessionUtil.isAllowBtn('gc3_6:view')">权限配置</router-link></div> -->
        <div ><router-link :class="{active:$route.path=='/page/ProcessManagement/ProcessStatistics'}" to="/page/ProcessManagement/ProcessStatistics"  v-if="sessionUtil.isAllowMenu('020705')" >工序统计</router-link></div>
                
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
