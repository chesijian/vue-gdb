<template>
    <div class="check-box">
        <div class="tabs-box">
             <div class="tabs" style="">
                <div ><router-link :class="{active:$route.path=='/page/measured'}" to="/page/measured">首页</router-link></div>
                <div ><router-link :class="{active:$route.path=='/page/measured/form/query/t_measure_plan'}"  to="/page/measured/form/query/t_measure_plan" v-if="sessionUtil.isAllowMenu('020801')||sessionUtil.isAllowBtn('gc4_1:view')">计划编制</router-link></div>
                <div ><router-link :class="{active:$route.path=='/page/measured/checkProblem'}"  to="/page/measured/checkProblem"  v-if="sessionUtil.isAllowMenu('/page/measured/checkProblem')||sessionUtil.isAllowMenu('020802')">检查记录</router-link></div>
                <div ><router-link :class="{active:$route.path=='/page/measured/areaMeasured'}" to="/page/measured/areaMeasured"  v-if="sessionUtil.isAllowMenu('/page/measured/areaMeasured')||sessionUtil.isAllowMenu('020803')">区域测点</router-link></div>
                <!-- <div ><router-link :class="{active:$route.path=='/page/measured/jurisdiction'}"  to="/page/measured/jurisdiction" v-if="sessionUtil.isAllowMenu('/page/measured/jurisdiction')||sessionUtil.isAllowBtn('gc4_4:view')">权限配置</router-link></div> -->
                <div ><router-link active-class="active"  :to="{path:'/page/measured/checkSet',query:{formType:'measure'}}" v-if="sessionUtil.isAllowMenu('020804')">检查项设置</router-link></div>
                <!-- <div ><router-link :class="{active:$route.path=='/page/measured/form/query/t_inspect_group'}"  to="/page/measured/form/query/t_inspect_group" >检查权限</router-link></div> -->
                <!--<div ><router-link :class="{active:$route.path=='/page/measured/planning'}"  to="/page/measured/planning" >计划编制</router-link></div>-->

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
