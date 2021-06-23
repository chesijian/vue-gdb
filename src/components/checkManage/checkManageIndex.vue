<template>
    <div class="check-box">
        <div class="tabs-box">
             <div class="tabs" style="">
                <div ><router-link :to="{path:'/page/checkManage',query:{checkType:'quality'}}" :class="{active:$route.path=='/page/checkManage'}">首页</router-link></div>
                <div ><router-link active-class="active" v-if="sessionUtil.isAllowMenu('020501')"  to="/page/checkManage/form/query/t_InspectQuality_plan" >计划编制</router-link></div>
                <div ><router-link :to="{path:'/page/checkManage/checkProblem',query:{checkType:'quality'}}" active-class="active" v-if="sessionUtil.isAllowMenu('020502')" >检查记录</router-link></div>
                <!-- <div ><router-link :to="{path:'/page/checkManage/jurisdiction',query:{checkType:'quality'}}" active-class="active" v-if="sessionUtil.isAllowMenu('/page/checkManage/jurisdiction')||sessionUtil.isAllowBtn('gc2_3:view')">权限配置</router-link></div> -->
                <div ><router-link :to="{path:'/page/checkManage/checkSet',query:{checkType:'quality',formType:'inspect'}}" :class="{active:$route.path=='/page/checkManage/checkSet'}" v-if="sessionUtil.isAllowMenu('020503')" >检查项设置</router-link></div>
                <!-- <div ><router-link to="/page/checkManage/checkProblem" v-if="sessionUtil.isAllowMenu('/page/checkManage/checkProblem')||sessionUtil.isAllowBtn('gc2_2:view')" :class="{active:$route.path=='/page/checkManage/checkProblem'}" >检查记录</router-link></div>
                <div ><router-link to="/page/checkManage/jurisdiction" :class="{active:$route.path=='/page/checkManage/jurisdiction'}" v-if="sessionUtil.isAllowMenu('/page/checkManage/jurisdiction')||sessionUtil.isAllowBtn('gc2_3:view')">权限配置</router-link></div>
                <div ><router-link to="/page/checkManage/checkSet" :class="{active:$route.path=='/page/checkManage/checkSet'}" >检查项设置</router-link></div> -->
                <!--<div ><router-link :class="{active:$route.path=='/page/checkManage/planning'}"  to="/page/checkManage/planning" v-if="sessionUtil.isAllowMenu('/page/checkManage/planning')||sessionUtil.isAllowBtn('gc2_4:view')">计划编制</router-link></div>-->
               <!--<div ><router-link :class="{active:$route.path=='/page/checkManage/form/query/t_inspect_group'}"  to="/page/checkManage/form/query/t_inspect_group" v-if="sessionUtil.isAllowMenu('/page/checkManage/form/query/t_inspect_group')||sessionUtil.isAllowBtn('gc2_5:view')">检查权限</router-link></div>-->
            </div>
        </div>
        <router-view :key="$route.path"></router-view>
    </div>
</template>
<script>
export default {
    data(){
        return {
            activeStr:'检查问题',
            checkType:"quality",
            pathObj:{
                quality:"checkManage",
                safety:"safetyCheck"
            }
            
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
